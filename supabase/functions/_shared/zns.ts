// Gửi tin Zalo ZNS (Zalo Notification Service) từ Zalo Official Account của Nhà Thuốc Nhật Minh tới số
// điện thoại khách (tháng 10/2026). Dùng chung cho send-order-email (đơn mới) và notify-order-status
// (đổi trạng thái). Xem CLAUDE.md, mục "Báo khách qua Zalo OA (ZNS)".
//
// Cần cấu hình (supabase secrets set ...), thiếu cái nào thì bỏ qua êm, KHÔNG làm hỏng việc đặt hàng:
//   ZALO_APP_ID, ZALO_APP_SECRET   — ứng dụng trên developers.zalo.me đã liên kết với OA
//   ZALO_REFRESH_TOKEN             — refresh token ban đầu (chỉ dùng lần đầu, sau đó lưu ở bảng zalo_oa_tokens)
//   ZNS_TEMPLATE_ORDER_NEW         — mã mẫu tin "đã nhận đơn" đã được Zalo duyệt
//   ZNS_TEMPLATE_ORDER_STATUS      — mã mẫu tin "cập nhật trạng thái đơn" đã được Zalo duyệt
//
// Refresh token của Zalo chỉ dùng được 1 lần: mỗi lần làm mới, Zalo trả refresh token MỚI và cái cũ hết
// hiệu lực. Vì vậy phải lưu lại token mới (bảng zalo_oa_tokens, mục "14." trong docs/supabase-schema.sql),
// không thể chỉ để trong secret cố định.

// Tài liệu gửi tin: https://zalo.solutions/business-message/guidelines/gui-api (access token sống 25 giờ, refresh token 3 tháng)
const TOKEN_URL = 'https://oauth.zaloapp.com/v4/oa/access_token';
const SEND_URL = 'https://business.openapi.zalo.me/message/template';

export interface TokenRow {
  access_token: string | null;
  refresh_token: string;
  expires_at: string | null;
}

/** Nơi lưu token — tách ra để test được mà không cần cơ sở dữ liệu thật. */
export interface TokenStore {
  load(): Promise<TokenRow | null>;
  /** Ghi token mới, chỉ khi refresh token hiện tại vẫn là `previous` (tránh 2 lượt làm mới đè nhau). */
  save(row: TokenRow, previous: string | null): Promise<boolean>;
}

export interface ZnsResult {
  sent: boolean;
  reason?: string;
}

// deno-lint-ignore no-explicit-any
export function supabaseTokenStore(admin: any): TokenStore {
  return {
    async load() {
      const { data, error } = await admin.from('zalo_oa_tokens').select('access_token, refresh_token, expires_at').eq('id', 1).maybeSingle();
      if (error) throw new Error(`Đọc zalo_oa_tokens lỗi: ${error.message}`);
      return data;
    },
    async save(row, previous) {
      if (previous === null) {
        const { error } = await admin.from('zalo_oa_tokens').upsert({ id: 1, ...row });
        return !error;
      }
      const { data, error } = await admin.from('zalo_oa_tokens').update(row).eq('id', 1).eq('refresh_token', previous).select('id');
      return !error && (data?.length ?? 0) > 0;
    },
  };
}

/** Số Việt Nam dạng 0xxxxxxxxx hoặc +84... -> 84xxxxxxxxx (định dạng ZNS yêu cầu). */
export function toZnsPhone(phone: string): string | null {
  let d = phone.replace(/\D/g, '');
  if (d.startsWith('0')) d = `84${d.slice(1)}`;
  return /^84\d{9}$/.test(d) ? d : null;
}

function configured(templateId: string | undefined): boolean {
  return Boolean(Deno.env.get('ZALO_APP_ID') && Deno.env.get('ZALO_APP_SECRET') && templateId);
}

async function refresh(store: TokenStore, current: TokenRow | null): Promise<string> {
  const refreshToken = current?.refresh_token || Deno.env.get('ZALO_REFRESH_TOKEN');
  if (!refreshToken) throw new Error('Chưa có refresh token Zalo (ZALO_REFRESH_TOKEN).');
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', secret_key: Deno.env.get('ZALO_APP_SECRET')! },
    body: new URLSearchParams({ app_id: Deno.env.get('ZALO_APP_ID')!, grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  const json = await res.json().catch(() => ({}));
  if (!json.access_token || !json.refresh_token) {
    // Có thể lượt khác vừa làm mới xong (refresh token cũ đã hết hiệu lực): đọc lại xem đã có token mới chưa
    const latest = await store.load();
    if (latest?.access_token && latest.refresh_token !== refreshToken && isFresh(latest)) return latest.access_token;
    throw new Error(`Làm mới token Zalo thất bại: ${json.error ?? res.status} ${json.message ?? json.error_name ?? ''}`.trim());
  }
  const row: TokenRow = {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: new Date(Date.now() + Number(json.expires_in ?? 3600) * 1000).toISOString(),
  };
  const saved = await store.save(row, current?.refresh_token ?? null);
  if (!saved) console.error('Không lưu được token Zalo mới — lần gửi sau có thể phải cấu hình lại ZALO_REFRESH_TOKEN.');
  return row.access_token!;
}

function isFresh(row: TokenRow): boolean {
  // Làm mới sớm 5 phút trước khi hết hạn
  return Boolean(row.access_token && row.expires_at && new Date(row.expires_at).getTime() - Date.now() > 5 * 60_000);
}

async function accessToken(store: TokenStore): Promise<string> {
  const row = await store.load();
  if (row && isFresh(row)) return row.access_token!;
  return refresh(store, row);
}

/**
 * Gửi 1 tin ZNS. Không bao giờ ném lỗi ra ngoài: trả { sent, reason } để nơi gọi tự quyết định báo gì.
 * `templateData` phải đúng tên tham số đã khai báo khi tạo mẫu tin trên Zalo.
 */
export async function sendZns(
  store: TokenStore,
  templateId: string | undefined,
  phone: string,
  templateData: Record<string, string>,
  trackingId: string,
): Promise<ZnsResult> {
  if (!configured(templateId)) return { sent: false, reason: 'not_configured' };
  const to = toZnsPhone(phone);
  if (!to) return { sent: false, reason: 'invalid_phone' };
  try {
    const token = await accessToken(store);
    const res = await fetch(SEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', access_token: token },
      // tracking_id: tối đa 48 ký tự, không có ký tự đặc biệt (theo tài liệu zalo.solutions)
      body: JSON.stringify({
        phone: to,
        template_id: templateId,
        template_data: templateData,
        tracking_id: trackingId.replace(/[^A-Za-z0-9]/g, '').slice(0, 48),
      }),
    });
    const json = await res.json().catch(() => ({}));
    if (json.error === 0) return { sent: true };
    console.error('ZNS lỗi:', json.error, json.message);
    return { sent: false, reason: String(json.message ?? json.error ?? res.status) };
  } catch (err) {
    console.error('ZNS lỗi:', err);
    return { sent: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
