// Edge Function: báo email cho chủ nhà thuốc khi KHÁCH gửi tin nhắn mới trong khung "Nhắn tin trực
// tiếp cho dược sĩ" (tháng 10/2026) — xem src/lib/chat.ts, src/components/FaqChat.astro.
//
// Trước đây trang /admin/tin-nhan/ chỉ tự cập nhật real-time khi ĐANG MỞ SẴN trang đó — không có
// cách nào biết có tin nhắn mới nếu không ngồi canh màn hình. Function này dùng LẠI đúng cấu hình
// Resend đã thiết lập cho email xác nhận đơn hàng (xem supabase/functions/send-order-email), không
// cần thêm bước thiết lập nào mới (RESEND_API_KEY/OWNER_EMAIL/RESEND_FROM đã có sẵn trong
// `supabase secrets`).
//
// Gọi mỗi khi khách gửi 1 tin nhắn (src/lib/chat.ts, sendMessage() khi sender === 'customer') —
// KHÔNG chặn việc gửi tin nếu email lỗi (fire-and-forget, chat vẫn hoạt động bình thường).
//
// Deploy: `npx supabase functions deploy notify-chat-message` (không cần set thêm secrets nào khác).

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Dược Sĩ Thương <onboarding@resend.dev>';

const ALLOWED_ORIGINS = new Set(['https://duocsithuong.com', 'http://localhost:4321']);

function corsHeaders(origin: string | null) {
  const allow = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://duocsithuong.com';
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

interface NotifyPayload {
  conversationId: string;
  customerName: string | null;
  body: string;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
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

  let payload: NotifyPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Dữ liệu không hợp lệ.' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
  if (!payload.conversationId || !payload.body) {
    return new Response(JSON.stringify({ error: 'Thiếu nội dung tin nhắn.' }), { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const who = payload.customerName ? escapeHtml(payload.customerName) : `Khách #${payload.conversationId.slice(0, 8)}`;
  const html = `<!doctype html>
<html lang="vi"><body style="font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 16px">
<h2 style="color: #14532d">Có tin nhắn mới từ ${who}</h2>
<table role="presentation" cellpadding="0" cellspacing="0" style="background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; margin: 12px 0">
<tr><td style="padding: 14px 16px; font-size: 15px; color: #14532d">${escapeHtml(payload.body)}</td></tr>
</table>
<p><a href="https://duocsithuong.com/admin/tin-nhan/" style="color: #15803d; font-weight: 600">Trả lời ngay tại /admin/tin-nhan/</a></p>
</body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: OWNER_EMAIL, subject: `Tin nhắn mới từ ${who} - Dược Sĩ Thương`, html }),
    });
    if (!response.ok) throw new Error(`Resend lỗi (${response.status}): ${await response.text()}`);
    return new Response(JSON.stringify({ ok: true }), { headers: { ...headers, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Gửi email báo tin nhắn mới thất bại:', err);
    return new Response(JSON.stringify({ error: 'Không gửi được email.' }), { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
});
