// Edge Function: báo email cho khách khi dược sĩ đổi trạng thái đơn (tháng 10/2026).
//
// Trang /admin/don-hang/ gọi function này ngay sau khi RPC admin_update_order_status() thành công,
// gửi kèm id đơn. Function TỰ kiểm tra người gọi là admin (không tin trình duyệt), đọc lại đơn bằng
// khóa service role (trạng thái, email, sản phẩm đều lấy từ cơ sở dữ liệu, không lấy từ trình duyệt),
// rồi gửi email qua Resend — dùng lại đúng cấu hình RESEND_API_KEY/RESEND_FROM của send-order-email.
//
// Gửi tới email người đặt đã điền lúc đặt hàng; không có thì dùng email tài khoản (nếu khách đặt lúc
// đã đăng nhập thật). Không có email nào thì trả { sent: false, reason: 'no_email' }, không báo lỗi.
// Trạng thái "Mới đặt" không gửi (khách đã nhận email xác nhận lúc đặt).
// KHÔNG gửi tin Zalo OA ở đây: chủ website chọn chỉ gửi 1 tin Zalo lúc đặt đơn (send-order-email) để
// tiết kiệm phí. Muốn báo khách qua Zalo khi đổi trạng thái thì dùng nút "Nhắn Zalo cho khách" (miễn phí).
//
// Deploy: `npx supabase functions deploy notify-order-status`

import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Dược Sĩ Thương <onboarding@resend.dev>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const ALLOWED_ORIGINS = new Set(['https://duocsithuong.com', 'http://localhost:4321']);

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://duocsithuong.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function json(body: unknown, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

interface OrderItem {
  name: string;
  qty: number;
  price: number | null;
}

interface OrderRow {
  id: string;
  user_id: string | null;
  order_code: string | null;
  status: string;
  items: OrderItem[];
  total: number;
  shipping: number | null;
  payment_method: string | null;
  orderer_name: string | null;
  orderer_email: string | null;
  customer_name: string;
}


// Nội dung từng trạng thái. Câu chữ chỉ nói điều nhà thuốc thật sự làm, không hứa thời gian giao cụ thể.
const STATUS_TEXT: Record<string, { subject: string; title: string; body: string }> = {
  da_xac_nhan: {
    subject: 'đã được xác nhận',
    title: 'Đơn hàng đã được xác nhận',
    body: 'Nhà thuốc đang chuẩn bị hàng cho bạn.',
  },
  dang_giao: {
    subject: 'đang được giao',
    title: 'Đơn hàng đang được giao',
    body: 'Đơn hàng đã được gửi đi. Bạn giữ điện thoại bên mình để người giao hàng liên hệ nhé.',
  },
  hoan_tat: {
    subject: 'đã giao thành công',
    title: 'Đơn hàng đã giao thành công',
    body: 'Cảm ơn bạn đã tin tưởng Dược Sĩ Thương. Nếu có thắc mắc về cách dùng sản phẩm, bạn cứ nhắn dược sĩ.',
  },
  huy: {
    subject: 'đã được hủy',
    title: 'Đơn hàng đã được hủy',
    body: 'Đơn hàng này đã được hủy. Nếu bạn đã chuyển khoản, nhà thuốc sẽ liên hệ để hoàn tiền. Nếu bạn không yêu cầu hủy, hãy nhắn Zalo cho dược sĩ.',
  },
};

const BANK_REMINDER =
  'Bạn chọn chuyển khoản: hãy chuyển đúng số tiền nhà thuốc đã xác nhận với bạn, và giữ nguyên nội dung chuyển khoản có mã đơn để nhà thuốc đối chiếu.';

function formatVnd(value: number): string {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
}

function renderEmail(order: OrderRow): string {
  const text = STATUS_TEXT[order.status];
  const code = order.order_code ?? '';
  const name = order.orderer_name || order.customer_name;
  const items = (order.items ?? [])
    .map((item) => {
      const price = item.price === null ? 'Liên hệ' : formatVnd(item.price * item.qty);
      return `<tr><td style="padding: 8px 0; font-size: 14px; color: #111827">${escapeHtml(item.name)} × ${item.qty}</td><td align="right" style="padding: 8px 0; font-size: 14px; color: #111827; white-space: nowrap">${price}</td></tr>`;
    })
    .join('');
  const grandTotal = order.total + (order.shipping ?? 0);
  const shippingNote = order.shipping === null ? ' (chưa gồm phí vận chuyển, nhà thuốc báo sau)' : '';
  const bankRow =
    order.status === 'da_xac_nhan' && order.payment_method === 'bank'
      ? `<p style="margin: 0 0 20px; padding: 12px 16px; background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; font-size: 13px; line-height: 1.6; color: #854d0e">${BANK_REMINDER}</p>`
      : '';

  return `<!doctype html>
<html lang="vi">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(text.title)} - Dược Sĩ Thương</title></head>
<body style="margin: 0; padding: 0; background: #f0fdf4; font-family: Arial, Helvetica, sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background: #f0fdf4; padding: 24px 0">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width: 600px; max-width: 92%; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #dcfce7">
<tr><td style="background: #15803d; padding: 24px 32px; text-align: center">
<span style="color: #ffffff; font-size: 22px; font-weight: 700">Dược Sĩ Thương</span><br />
<span style="color: #bbf7d0; font-size: 13px">Nhà Thuốc Nhật Minh</span>
</td></tr>
<tr><td style="padding: 32px 32px 8px">
<h1 style="margin: 0 0 12px; font-size: 20px; color: #14532d">${escapeHtml(text.title)}</h1>
<p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #374151">
Chào <strong>${escapeHtml(name)}</strong>, đơn hàng <strong>#${escapeHtml(code)}</strong> ${escapeHtml(text.subject)}. ${escapeHtml(text.body)}
</p>
${bankRow}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top: 1px solid #dcfce7; margin-bottom: 8px">${items}</table>
<p style="margin: 0 0 24px; padding-top: 10px; border-top: 2px solid #15803d; font-size: 15px; font-weight: 700; color: #14532d">Thành tiền: ${formatVnd(grandTotal)}${shippingNote}</p>
<p style="margin: 0 0 24px; font-size: 14px; color: #374151">
Xem tình trạng đơn: <a href="https://duocsithuong.com/tra-cuu-don-hang/?ma=${encodeURIComponent(code)}" style="color: #15803d; font-weight: 600">tra cứu đơn #${escapeHtml(code)}</a> (nhập số điện thoại đã dùng khi đặt).
</p>
<p style="margin: 0 0 20px; font-size: 13px; color: #7c2d12; line-height: 1.6; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 12px 16px">
Cần hỗ trợ? Nhắn Zalo cho dược sĩ: <a href="https://zalo.me/0988283415" style="color: #c2410c; font-weight: 600">zalo.me/0988283415</a> hoặc gọi 0988 283 415.
</p>
<p style="margin: 0 0 24px; font-size: 12px; line-height: 1.6; color: #9ca3af">
Thông tin sản phẩm chỉ mang tính tham khảo, không thay thế chẩn đoán hay tư vấn của bác sĩ/dược sĩ.
</p>
</td></tr>
<tr><td style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #f3f4f6">
<p style="margin: 0; font-size: 12px; color: #9ca3af">© ${new Date().getFullYear()} Dược Sĩ Thương — Nhà Thuốc Nhật Minh</p>
<p style="margin: 4px 0 0; font-size: 12px; color: #9ca3af">Email này gửi tự động vì bạn đã đặt hàng tại duocsithuong.com</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

Deno.serve(async (req) => {
  const headers = corsHeaders(req.headers.get('origin'));
  if (req.method === 'OPTIONS') return new Response(null, { headers });
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405, headers });
  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) return json({ error: 'Thiếu cấu hình Supabase trên Edge Function.' }, 500, headers);
  if (!RESEND_API_KEY) return json({ error: 'Chưa cấu hình RESEND_API_KEY trên Supabase.' }, 500, headers);

  // Chỉ admin được gọi: nếu không, ai cũng gửi được email nhân danh nhà thuốc tới khách.
  const jwt = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!jwt) return json({ error: 'Chưa đăng nhập.' }, 401, headers);
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: userData, error: userError } = await admin.auth.getUser(jwt);
  if (userError || !userData.user) return json({ error: 'Phiên đăng nhập không hợp lệ.' }, 401, headers);
  const { data: profile } = await admin.from('profiles').select('is_admin').eq('id', userData.user.id).maybeSingle();
  if (!profile?.is_admin) return json({ error: 'Tài khoản này không có quyền quản trị đơn hàng.' }, 403, headers);

  let orderId = '';
  try {
    orderId = String((await req.json())?.orderId ?? '');
  } catch {
    // body không phải JSON: rơi xuống kiểm tra bên dưới
  }
  if (!/^[0-9a-f-]{36}$/i.test(orderId)) return json({ error: 'Mã đơn không hợp lệ.' }, 400, headers);

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id, user_id, order_code, status, items, total, shipping, payment_method, orderer_name, orderer_email, customer_name')
    .eq('id', orderId)
    .maybeSingle<OrderRow>();
  if (orderError || !order) return json({ error: 'Không tìm thấy đơn hàng.' }, 404, headers);
  if (!STATUS_TEXT[order.status]) return json({ sent: false, reason: 'status_not_notified' }, 200, headers);

  let to = order.orderer_email?.trim() || '';
  if (!to && order.user_id) {
    const { data: account } = await admin.auth.admin.getUserById(order.user_id);
    if (account.user && !account.user.is_anonymous) to = account.user.email ?? '';
  }

  let emailError = '';
  if (to) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: RESEND_FROM,
        to,
        subject: `Đơn hàng #${order.order_code ?? ''} ${STATUS_TEXT[order.status].subject} - Dược Sĩ Thương`,
        html: renderEmail(order),
      }),
    });
    if (!response.ok) {
      console.error('Resend lỗi:', response.status, await response.text());
      emailError = 'Gửi email thất bại, vui lòng thử lại sau.';
    }
  }
  const body = { sent: Boolean(to) && !emailError, reason: to ? undefined : 'no_email' };
  if (emailError) return json({ ...body, error: emailError }, 502, headers);
  return json(body, 200, headers);
});
