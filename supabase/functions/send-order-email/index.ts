// Edge Function: gửi email xác nhận đơn hàng (tháng 9/2026).
//
// Chạy trên máy chủ Supabase (Deno), KHÔNG chạy trong trình duyệt — vì vậy khóa RESEND_API_KEY
// (bí mật, khác hẳn khóa "anon" của Supabase) giữ được an toàn ở đây, không lộ ra trình duyệt.
// Trang /gio-hang/ gọi function này bằng supabase.functions.invoke('send-order-email', {...}) ngay
// sau khi khách bấm "Hoàn tất" (xem src/pages/gio-hang.astro).
//
// Việc của function: build HTML email (mẫu giống src/emails/xac-nhan-don-hang.html, viết lại bằng
// JS template string cho dễ chèn dữ liệu thật) rồi gọi Resend API để gửi:
//   1. Cho KHÁCH (ô email bắt buộc từ 29/10/2026) — xác nhận đơn theo mẫu đẹp.
//   2. Cho CHỦ NHÀ THUỐC (luôn gửi) — thông báo có đơn mới, kèm đủ thông tin để liên hệ/xử lý ngay,
//      vì đây là kênh DUY NHẤT thay cho luồng "mở Zalo, khách tự chép & gửi" trước đây.
//
// Cần thiết lập trước khi dùng thật (xem CLAUDE.md, mục "Gửi email xác nhận đơn hàng"):
//   - Tài khoản Resend (miễn phí), xác minh tên miền duocsithuong.com (thêm bản ghi DNS ở Cloudflare)
//     để gửi được tới email BẤT KỲ của khách (chưa xác minh tên miền thì Resend chỉ cho gửi tới đúng
//     email đăng ký tài khoản Resend, không dùng được cho khách thật).
//   - `supabase secrets set RESEND_API_KEY=... OWNER_EMAIL=... RESEND_FROM="Dược Sĩ Thương <don-hang@duocsithuong.com>"`
//   - `supabase functions deploy send-order-email`

import { createClient } from 'npm:@supabase/supabase-js@2';
import { sendZns, supabaseTokenStore, type ZnsResult } from '../_shared/zns.ts';
import { checkEmail } from '../_shared/email.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');
// Địa chỉ "From" phải thuộc tên miền đã xác minh trong Resend — để trống sẽ dùng địa chỉ thử nghiệm
// của Resend (onboarding@resend.dev), CHỈ gửi được tới đúng email đăng ký tài khoản Resend, dùng để
// thử trong lúc chưa xác minh tên miền xong.
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Dược Sĩ Thương <onboarding@resend.dev>';

// Chỉ nhận yêu cầu từ đúng trang web (site tĩnh gọi thẳng từ trình duyệt khách, không qua máy chủ
// riêng nào khác) — thêm localhost để còn thử được lúc chạy `npm run dev`.
const ALLOWED_ORIGINS = new Set(['https://duocsithuong.com', 'http://localhost:4321']);

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://duocsithuong.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

interface OrderItem {
  id: string;
  name: string;
  qty: number;
  price: number | null;
}

interface OrderPayload {
  orderId: string;
  items: OrderItem[];
  total: number;
  originalTotal: number;
  // Phí vận chuyển (xem shippingFee() trong src/lib/cart.ts) — null nghĩa là chưa đủ căn cứ tính phí
  // (giỏ toàn sản phẩm "Liên hệ"), hiện "Nhà thuốc báo sau" thay vì áp phí sai.
  shipping: number | null;
  ordererName: string;
  ordererPhone: string;
  ordererEmail: string;
  name: string; // người nhận
  phone: string; // người nhận
  address: string;
  note: string;
  hideProductName: boolean;
  paymentMethod: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cod: 'Tiền mặt khi nhận hàng',
  bank: 'Chuyển khoản ngân hàng (QR Code)',
  momo: 'Ví MoMo',
  zalopay: 'Ví ZaloPay',
  visa: 'Thẻ Visa/Mastercard',
};

function formatVnd(value: number): string {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
}

function itemsHtml(items: OrderItem[]): string {
  return items
    .map((item) => {
      const price = item.price === null ? 'Liên hệ' : formatVnd(item.price * item.qty);
      return `<tr style="border-bottom: 1px solid #f3f4f6">
        <td style="padding: 10px 8px; font-size: 14px; color: #111827">${escapeHtml(item.name)}</td>
        <td align="center" style="padding: 10px 8px; font-size: 14px; color: #111827">${item.qty}</td>
        <td align="right" style="padding: 10px 8px; font-size: 14px; color: #111827; white-space: nowrap">${price}</td>
      </tr>`;
    })
    .join('');
}

// HTML dùng chung khung thương hiệu (xanh lá, khung vàng nhắc "chưa phải hóa đơn thanh toán", khung
// cam liên hệ Zalo) — giữ đúng thiết kế đã duyệt ở src/emails/xac-nhan-don-hang.html, chỉ khác là
// chèn trực tiếp dữ liệu thật bằng JS thay vì để {{biến}} cho dịch vụ khác xử lý.
function renderCustomerEmail(order: OrderPayload): string {
  const discount = order.originalTotal - order.total;
  const discountRow =
    discount > 0
      ? `<tr><td style="padding:4px 0;font-size:14px;color:#4b5563">Giảm giá trực tiếp</td><td align="right" style="padding:4px 0;font-size:14px;color:#dc2626">-${formatVnd(discount)}</td></tr>`
      : '';
  const noteRow = order.note ? `<br /><span style="color:#6b7280">Ghi chú: ${escapeHtml(order.note)}</span>` : '';
  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod;
  // Chính sách phí ship (tháng 10/2026, chủ website cung cấp): miễn phí từ 350.000đ, dưới mức đó
  // 20.000đ — null nghĩa là giỏ toàn sản phẩm "Liên hệ", chưa đủ căn cứ tính phí.
  const shippingLabel = order.shipping === null ? 'Nhà thuốc báo sau' : order.shipping === 0 ? 'Miễn phí' : formatVnd(order.shipping);
  const grandTotal = order.total + (order.shipping ?? 0);

  return `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Xác nhận đơn hàng - Dược Sĩ Thương</title></head>
<body style="margin: 0; padding: 0; background: #f0fdf4; font-family: Arial, Helvetica, sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f0fdf4; padding: 24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width: 600px; max-width: 92%; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dcfce7">
<tr><td style="background: #15803d; padding: 24px 32px; text-align: center">
<span style="color: #ffffff; font-size: 22px; font-weight: 700">Dược Sĩ Thương</span><br />
<span style="color: #bbf7d0; font-size: 13px">Nhà Thuốc Nhật Minh</span>
</td></tr>
<tr><td style="padding: 32px 32px 8px">
<h1 style="margin: 0 0 12px; font-size: 20px; color: #14532d">Cảm ơn bạn đã đặt hàng!</h1>
<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #374151">
Chào <strong>${escapeHtml(order.ordererName)}</strong>, Dược Sĩ Thương đã nhận được đơn hàng <strong>#${escapeHtml(order.orderId)}</strong>.
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; margin-bottom: 24px">
<tr><td style="padding: 12px 16px; font-size: 13px; line-height: 1.6; color: #854d0e">
Đây là email <strong>ghi nhận đơn</strong>, chưa phải hóa đơn thanh toán. Nhà thuốc sẽ gọi tới số <strong>${escapeHtml(order.phone)}</strong> để xác nhận lại giá, phí giao hàng và cách thanh toán trước khi giao.
</td></tr></table>
<h2 style="margin: 0 0 10px; font-size: 15px; color: #14532d">Sản phẩm đã đặt</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 4px">
<thead><tr style="background: #f0fdf4">
<th align="left" style="padding: 8px; font-size: 12px; color: #166534; border-bottom: 1px solid #dcfce7">Sản phẩm</th>
<th align="center" style="padding: 8px; font-size: 12px; color: #166534; border-bottom: 1px solid #dcfce7">SL</th>
<th align="right" style="padding: 8px; font-size: 12px; color: #166534; border-bottom: 1px solid #dcfce7">Thành tiền</th>
</tr></thead>
<tbody>${itemsHtml(order.items)}</tbody>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 12px 0 24px">
<tr><td style="padding: 4px 0; font-size: 14px; color: #4b5563">Tổng tiền</td><td align="right" style="padding: 4px 0; font-size: 14px; color: #4b5563">${formatVnd(order.originalTotal)}</td></tr>
${discountRow}
<tr><td style="padding: 4px 0; font-size: 14px; color: #4b5563">Giảm giá voucher</td><td align="right" style="padding: 4px 0; font-size: 14px; color: #4b5563">0đ</td></tr>
<tr><td style="padding: 4px 0; font-size: 14px; color: #4b5563">Phí vận chuyển</td><td align="right" style="padding: 4px 0; font-size: 14px; color: #4b5563">${shippingLabel}</td></tr>
<tr><td style="padding: 10px 0 0; border-top: 2px solid #15803d; font-size: 16px; font-weight: 700; color: #14532d">Thành tiền</td><td align="right" style="padding: 10px 0 0; border-top: 2px solid #15803d; font-size: 16px; font-weight: 700; color: #14532d">${formatVnd(grandTotal)}</td></tr>
</table>
<h2 style="margin: 0 0 8px; font-size: 15px; color: #14532d">Thông tin nhận hàng</h2>
<p style="margin: 0 0 20px; font-size: 14px; line-height: 1.7; color: #374151">
${escapeHtml(order.name)} — ${escapeHtml(order.phone)}<br />
${escapeHtml(order.address)}${noteRow}
</p>
<h2 style="margin: 0 0 8px; font-size: 15px; color: #14532d">Hình thức thanh toán</h2>
<p style="margin: 0 0 24px; font-size: 14px; color: #374151">
${escapeHtml(paymentLabel)}. Với hình thức khác tiền mặt, nhà thuốc sẽ liên hệ hướng dẫn thanh toán cụ thể — site chưa thu tiền trực tuyến qua thẻ/ví.
</p>
<p style="margin: 0 0 24px; font-size: 14px; color: #374151">
Theo dõi tình trạng đơn: <a href="https://duocsithuong.com/tra-cuu-don-hang/?ma=${encodeURIComponent(order.orderId)}" style="color: #15803d; font-weight: 600">tra cứu đơn #${escapeHtml(order.orderId)}</a> (nhập số điện thoại đã dùng khi đặt).
</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; margin-bottom: 20px">
<tr><td style="padding: 14px 16px">
<strong style="color: #c2410c; font-size: 14px">Cần hỗ trợ hoặc muốn đổi đơn?</strong>
<p style="margin: 6px 0 0; font-size: 13px; color: #7c2d12; line-height: 1.6">
Nhắn Zalo cho dược sĩ: <a href="https://zalo.me/0988283415" style="color: #c2410c; font-weight: 600">zalo.me/0988283415</a> hoặc gọi 0988 283 415.
</p></td></tr></table>
<p style="margin: 0 0 24px; font-size: 12px; line-height: 1.6; color: #9ca3af">
Thông tin sản phẩm chỉ mang tính tham khảo, không thay thế chẩn đoán hay tư vấn của bác sĩ/dược sĩ. Hãy hỏi ý kiến bác sĩ hoặc dược sĩ trước khi dùng nếu bạn đang có bệnh nền, mang thai hoặc cho con bú.
</p>
</td></tr>
<tr><td style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #f3f4f6">
<p style="margin: 0; font-size: 12px; color: #9ca3af">© ${new Date().getFullYear()} Dược Sĩ Thương — Nhà Thuốc Nhật Minh</p>
<p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af">Email này gửi tự động vì bạn vừa đặt hàng tại duocsithuong.com</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

// Email cho CHỦ NHÀ THUỐC — gọn hơn, thông tin liên hệ khách đặt lên đầu để xử lý nhanh, không cần
// khung thương hiệu đẹp như gửi khách.
function renderOwnerEmail(order: OrderPayload): string {
  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod;
  const lines = order.items
    .map((item) => `${item.name} x${item.qty} — ${item.price === null ? 'Liên hệ' : formatVnd(item.price * item.qty)}`)
    .join('<br />');
  return `<!doctype html>
<html lang="vi"><body style="font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 16px">
<h2 style="color: #14532d">Đơn hàng mới #${escapeHtml(order.orderId)}</h2>
<p><strong>Người đặt:</strong> ${escapeHtml(order.ordererName)} — ${escapeHtml(order.ordererPhone)}${order.ordererEmail ? ` — ${escapeHtml(order.ordererEmail)}` : ' (không để lại email)'}</p>
<p><strong>Người nhận:</strong> ${escapeHtml(order.name)} — ${escapeHtml(order.phone)}<br />${escapeHtml(order.address)}</p>
${order.note ? `<p><strong>Ghi chú:</strong> ${escapeHtml(order.note)}</p>` : ''}
${order.hideProductName ? '<p><strong>⚠️ Khách yêu cầu ẩn tên sản phẩm khi giao hàng.</strong></p>' : ''}
<p><strong>Thanh toán:</strong> ${escapeHtml(paymentLabel)}</p>
<hr />
<p>${lines}</p>
<p>Phí vận chuyển: ${order.shipping === null ? 'Nhà thuốc báo sau' : order.shipping === 0 ? 'Miễn phí' : formatVnd(order.shipping)}</p>
<p><strong>Thành tiền: ${formatVnd(order.total + (order.shipping ?? 0))}</strong>${order.originalTotal > order.total ? ` (giá gốc sản phẩm ${formatVnd(order.originalTotal)})` : ''}</p>
</body></html>`;
}

async function sendEmail(to: string, subject: string, html: string) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: RESEND_FROM, to, subject, html }),
  });
  if (!response.ok) throw new Error(`Resend lỗi (${response.status}): ${await response.text()}`);
}

// Lưu đơn bằng khóa SERVICE_ROLE (bỏ qua RLS, chỉ có trên máy chủ Supabase, không lộ ra trình duyệt).
// Khách đã đăng nhập thì gắn user_id (lấy từ JWT trong header Authorization mà supabase.functions.invoke
// tự gửi kèm) để đơn vẫn hiện trong "Lịch sử đơn hàng" ở /tai-khoan/; khách vãng lai thì user_id = null.
// order_code là unique nên khách bấm gửi lại sau lỗi mạng cũng không tạo đơn trùng.
async function saveOrder(req: Request, order: OrderPayload): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return;
  try {
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    let userId: string | null = null;
    if (token) {
      const { data } = await admin.auth.getUser(token);
      userId = data.user?.id ?? null;
    }
    const row = {
      user_id: userId,
      customer_name: order.name,
      phone: order.phone,
      address: order.address,
      note: order.note || null,
      payment_method: order.paymentMethod || 'cod',
      items: order.items,
      total: order.total,
      orderer_name: order.ordererName,
      orderer_phone: order.ordererPhone,
      orderer_email: order.ordererEmail || null,
      hide_product_name: Boolean(order.hideProductName),
    };
    const { error } = await admin
      .from('orders')
      .upsert({ ...row, order_code: order.orderId, shipping: order.shipping }, { onConflict: 'order_code', ignoreDuplicates: true });
    if (!error) return;
    // Bảng chưa chạy SQL mục "9." (chưa có order_code/shipping, user_id còn bắt buộc): vẫn lưu đơn của
    // khách đã đăng nhập theo cấu trúc cũ để "Lịch sử đơn hàng" không bị mất trong lúc chuyển đổi.
    console.error('Lưu đơn (cấu trúc mới) thất bại:', error.message);
    if (userId) {
      const { error: legacyError } = await admin.from('orders').insert(row);
      if (legacyError) console.error('Lưu đơn (cấu trúc cũ) thất bại:', legacyError.message);
    }
  } catch (err) {
    console.error('Lưu đơn thất bại:', err);
  }
}

// ---------------------------------------------------------------------------------------------
// Chống spam/giả mạo đơn (tháng 10/2026). Function này ai cũng gọi thẳng được (CORS chỉ chặn trình
// duyệt, không chặn script), nên phải tự kiểm tra:
//   1. Dữ liệu hợp lệ + tính lại tiền theo bảng giá thật /san-pham.json (không tin giá client gửi).
//   2. Cloudflare Turnstile ("không phải robot") — chỉ bật khi đã đặt secret TURNSTILE_SECRET_KEY.
//   3. Tối đa RATE_LIMIT đơn / RATE_WINDOW_MINUTES phút cho mỗi IP và mỗi số điện thoại (bảng
//      order_rate_log, mục "12." trong docs/supabase-schema.sql).
// ---------------------------------------------------------------------------------------------
const SITE_URL = Deno.env.get('SITE_URL') || 'https://duocsithuong.com';
const TURNSTILE_SECRET_KEY = Deno.env.get('TURNSTILE_SECRET_KEY');
const RATE_LIMIT = 5;
const RATE_WINDOW_MINUTES = 10;
const MAX_QTY = 20;
const MAX_ITEMS = 30;
const FREE_SHIPPING_THRESHOLD = 350_000; // khớp src/lib/cart.ts
const SHIPPING_FEE = 20_000;

class RejectError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

type Catalog = Record<string, { name: string; price: number | null; originalPrice: number | null }>;
let catalogCache: { data: Catalog; at: number } | null = null;

async function loadCatalog(): Promise<Catalog> {
  if (catalogCache && Date.now() - catalogCache.at < 5 * 60_000) return catalogCache.data;
  const res = await fetch(`${SITE_URL}/san-pham.json`);
  if (!res.ok) throw new Error(`Không tải được bảng giá (${res.status})`);
  const data = (await res.json()) as Catalog;
  catalogCache = { data, at: Date.now() };
  return data;
}

const digits = (value: string) => value.replace(/\D/g, '');
const str = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

function isPhone(value: string) {
  const d = digits(value);
  return /^[0-9+\s.\-()]+$/.test(value) && d.length >= 9 && d.length <= 12;
}

/** Làm sạch dữ liệu client gửi lên và tính lại tiền theo giá thật. Ném RejectError nếu không hợp lệ. */
async function sanitizeOrder(raw: Record<string, unknown>): Promise<OrderPayload> {
  const order = {
    orderId: str(raw.orderId, 24),
    ordererName: str(raw.ordererName, 100),
    ordererPhone: str(raw.ordererPhone, 20),
    ordererEmail: str(raw.ordererEmail, 120),
    name: str(raw.name, 100),
    phone: str(raw.phone, 20),
    address: str(raw.address, 300),
    note: str(raw.note, 500),
    hideProductName: raw.hideProductName === true,
    paymentMethod: str(raw.paymentMethod, 20) || 'cod',
  };
  if (!/^[A-Z0-9]{6,24}$/i.test(order.orderId)) throw new RejectError(400, 'Mã đơn không hợp lệ.');
  if (!order.ordererName || !order.name || !order.address) throw new RejectError(400, 'Thiếu thông tin đơn hàng bắt buộc.');
  if (!isPhone(order.ordererPhone) || !isPhone(order.phone)) throw new RejectError(400, 'Số điện thoại chưa đúng.');
  // Email bắt buộc từ 29/10/2026 (chủ website yêu cầu): đây là kênh báo khách xác nhận và tình trạng đơn
  // Cùng luật với trình duyệt (supabase/functions/_shared/email.ts)
  const emailCheck = checkEmail(order.ordererEmail);
  if (!emailCheck.ok) throw new RejectError(400, emailCheck.message);
  order.ordererEmail = emailCheck.email;
  if (!PAYMENT_LABELS[order.paymentMethod]) throw new RejectError(400, 'Hình thức thanh toán không hợp lệ.');

  const rawItems = Array.isArray(raw.items) ? raw.items : [];
  if (rawItems.length === 0 || rawItems.length > MAX_ITEMS) throw new RejectError(400, 'Giỏ hàng không hợp lệ.');

  let catalog: Catalog;
  try {
    catalog = await loadCatalog();
  } catch (err) {
    console.error(err);
    throw new RejectError(503, 'Chưa kiểm tra được giá sản phẩm, vui lòng thử lại sau.');
  }

  const seen = new Set<string>();
  const items: OrderItem[] = [];
  let total = 0;
  let originalTotal = 0;
  for (const entry of rawItems as Record<string, unknown>[]) {
    const id = str(entry?.id, 120);
    const qty = Number(entry?.qty);
    const product = catalog[id];
    if (!product || seen.has(id)) throw new RejectError(400, 'Giỏ hàng có sản phẩm không còn bán, vui lòng tải lại trang giỏ hàng.');
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) throw new RejectError(400, 'Số lượng sản phẩm không hợp lệ.');
    seen.add(id);
    items.push({ id, name: product.name, qty, price: product.price });
    total += (product.price ?? 0) * qty;
    originalTotal += (product.originalPrice ?? product.price ?? 0) * qty;
  }
  const unpriced = items.some((item) => item.price === null);
  const shipping = total === 0 && unpriced ? null : total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { ...order, items, total, originalTotal, shipping };
}

function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('cf-connecting-ip') || '').trim();
}

async function verifyTurnstile(token: unknown, ip: string): Promise<void> {
  if (!TURNSTILE_SECRET_KEY) return; // chưa cấu hình thì bỏ qua (site vẫn đặt hàng được)
  if (typeof token !== 'string' || !token) throw new RejectError(403, 'Vui lòng bấm xác minh "không phải robot" trước khi gửi đơn.');
  const body = new URLSearchParams({ secret: TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const result = (await res.json().catch(() => ({}))) as { success?: boolean };
  if (!result.success) throw new RejectError(403, 'Xác minh "không phải robot" chưa thành công, vui lòng thử lại.');
}

/** Tối đa RATE_LIMIT đơn / RATE_WINDOW_MINUTES phút cho mỗi IP và mỗi số điện thoại. Bảng chưa tạo
 * (chưa chạy SQL mục "12.") thì cho qua, để không làm hỏng việc đặt hàng thật. */
async function checkRateLimit(ip: string, order: OrderPayload): Promise<void> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return;
  const admin = createClient(supabaseUrl, serviceRoleKey);
  const phones = [...new Set([digits(order.ordererPhone), digits(order.phone)])];
  const since = new Date(Date.now() - RATE_WINDOW_MINUTES * 60_000).toISOString();
  const tooMany = 'Bạn đã gửi quá nhiều đơn trong thời gian ngắn. Vui lòng đợi khoảng 10 phút rồi thử lại.';

  const byPhone = await admin.from('order_rate_log').select('id', { count: 'exact', head: true }).gte('created_at', since).overlaps('phones', phones);
  if (byPhone.error) {
    console.error('Bỏ qua giới hạn tần suất:', byPhone.error.message);
    return;
  }
  if ((byPhone.count ?? 0) >= RATE_LIMIT) throw new RejectError(429, tooMany);
  if (ip) {
    const byIp = await admin.from('order_rate_log').select('id', { count: 'exact', head: true }).gte('created_at', since).eq('ip', ip);
    if ((byIp.count ?? 0) >= RATE_LIMIT) throw new RejectError(429, tooMany);
  }
  const { error } = await admin.from('order_rate_log').insert({ ip: ip || null, phones });
  if (error) console.error('Ghi nhật ký tần suất thất bại:', error.message);
  // Chỉ cần giữ trong khung 10 phút; xóa bản ghi quá 1 ngày đúng như Chính sách bảo mật đã ghi
  const dayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
  const cleanup = await admin.from('order_rate_log').delete().lt('created_at', dayAgo);
  if (cleanup.error) console.error('Dọn nhật ký tần suất thất bại:', cleanup.error.message);
}

function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** "Bioflora x1, Osteocare x2" — gọn trong 1 ô của bảng ZNS; ẩn tên nếu khách yêu cầu. */
function productSummary(order: OrderPayload): string {
  const count = order.items.reduce((sum, item) => sum + item.qty, 0);
  if (order.hideProductName) return `${count} sản phẩm (đã ẩn tên theo yêu cầu)`;
  const first = order.items.slice(0, 2).map((item) => `${item.name} x${item.qty}`).join(', ');
  const more = order.items.length > 2 ? ` và ${order.items.length - 2} sản phẩm khác` : '';
  return clip(first + more, 100);
}

// MỖI ĐƠN CHỈ GỬI 1 TIN ZALO, lúc đặt (chủ website chọn để tiết kiệm phí). Chuyển khoản thì gửi mẫu
// "yêu cầu thanh toán" (Zalo tự vẽ mã QR theo tài khoản khai báo trong mẫu); cách khác gửi mẫu tóm tắt
// đơn. Chưa có mẫu thanh toán thì dùng mẫu tóm tắt. Tên tham số phải trùng mẫu trên Zalo (xem CLAUDE.md).
async function sendOrderZns(order: OrderPayload): Promise<ZnsResult> {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !serviceRoleKey) return { sent: false, reason: 'not_configured' };
  const store = supabaseTokenStore(createClient(supabaseUrl, serviceRoleKey));
  const phone = order.ordererPhone || order.phone;
  const grandTotal = order.total + (order.shipping ?? 0);
  const customerName = clip(order.ordererName || order.name, 30);
  const paymentTemplate = Deno.env.get('ZNS_TEMPLATE_ORDER_PAYMENT');

  if (order.paymentMethod === 'bank' && paymentTemplate && grandTotal > 0) {
    return sendZns(
      store,
      paymentTemplate,
      phone,
      {
        customer_name: customerName,
        order_code: order.orderId,
        amount: String(grandTotal),
        // Giống hệt nội dung chuyển khoản của mã QR trên trang giỏ hàng, để nhà thuốc đối chiếu 1 kiểu
        transfer_note: `Thanh toan don ${order.orderId} Duoc Si Thuong`,
      },
      `pay-${order.orderId}`,
    );
  }

  return sendZns(
    store,
    Deno.env.get('ZNS_TEMPLATE_ORDER_NEW'),
    phone,
    {
      customer_name: customerName,
      order_code: order.orderId,
      phone: order.phone,
      address: clip(order.address, 100),
      products: productSummary(order),
      shipping: order.shipping === null ? 'Nhà thuốc báo sau' : order.shipping === 0 ? 'Miễn phí' : formatVnd(order.shipping),
      total: formatVnd(grandTotal),
      payment_method: PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod,
    },
    `new-${order.orderId}`,
  );
}

Deno.serve(async (req) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });
  if (!RESEND_API_KEY || !OWNER_EMAIL) {
    return new Response(JSON.stringify({ error: 'Chưa cấu hình RESEND_API_KEY/OWNER_EMAIL trên Supabase.' }), {
      status: 500,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  let order: OrderPayload;
  try {
    const raw = await req.json().catch(() => {
      throw new RejectError(400, 'Dữ liệu đơn hàng không hợp lệ.');
    });
    if (!raw || typeof raw !== 'object') throw new RejectError(400, 'Dữ liệu đơn hàng không hợp lệ.');
    const ip = clientIp(req);
    order = await sanitizeOrder(raw);
    await verifyTurnstile(raw.turnstileToken, ip);
    await checkRateLimit(ip, order);
  } catch (err) {
    const status = err instanceof RejectError ? err.status : 400;
    const message = err instanceof RejectError ? err.message : 'Dữ liệu đơn hàng không hợp lệ.';
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  // Lưu đơn vào bảng orders TRƯỚC khi gửi email, để trang /admin/don-hang/ có đủ mọi đơn (kể cả khách
  // chưa đăng nhập). Lỗi lưu không chặn việc gửi email — email vẫn là kênh báo đơn chính.
  await saveOrder(req, order);
  // Tin Zalo OA (ZNS) báo đã nhận đơn tới SĐT người đặt — chạy song song với email, lỗi không chặn đơn.
  const zalo = sendOrderZns(order);

  try {
    // Luôn báo cho chủ nhà thuốc trước — đây là kênh DUY NHẤT để nhà thuốc biết có đơn mới (thay
    // luồng Zalo thủ công trước đây), nên phải chắc chắn gửi được mới coi là thành công.
    await sendEmail(OWNER_EMAIL, `Đơn hàng mới #${order.orderId} - ${order.ordererName}`, renderOwnerEmail(order));

    // Gửi xác nhận cho khách CHỈ KHI khách có để lại email (ô này không bắt buộc) — lỗi ở bước này
    // (ví dụ khách gõ sai định dạng email hiếm gặp) không nên làm hỏng cả đơn, vì nhà thuốc đã nhận
    // được thông báo ở bước trên rồi.
    let customerEmailSent = false;
    if (order.ordererEmail) {
      try {
        await sendEmail(order.ordererEmail, `Xác nhận đơn hàng #${order.orderId} - Dược Sĩ Thương`, renderCustomerEmail(order));
        customerEmailSent = true;
      } catch (err) {
        console.error('Gửi email khách thất bại:', err);
      }
    }

    const zaloResult = await zalo;
    return new Response(JSON.stringify({ ok: true, customerEmailSent, zaloSent: zaloResult.sent }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Gửi email chủ nhà thuốc thất bại:', err);
    await zalo;
    return new Response(JSON.stringify({ error: 'Không gửi được email.' }), {
      status: 502,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
