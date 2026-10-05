// Edge Function: báo email cho chủ nhà thuốc khi KHÁCH gửi tin nhắn mới trong khung "Nhắn tin trực
// tiếp cho dược sĩ" (tháng 10/2026) — xem src/lib/chat.ts, src/components/FaqChat.astro.
//
// Trước đây trang /admin/tin-nhan/ chỉ tự cập nhật real-time khi ĐANG MỞ SẴN trang đó — không có
// cách nào biết có tin nhắn mới nếu không ngồi canh màn hình. Function này dùng LẠI đúng cấu hình
// Resend đã thiết lập cho email xác nhận đơn hàng (xem supabase/functions/send-order-email), không
// cần thêm bước thiết lập nào mới (RESEND_API_KEY/OWNER_EMAIL/RESEND_FROM đã có sẵn trong
// `supabase secrets`).
//
// TỐI ĐA 1 EMAIL / GIỜ / HỘI THOẠI (chủ website yêu cầu tháng 10/2026) — không phải cứ mỗi tin nhắn là
// báo 1 lần, vì khách nhắn liên tục sẽ spam hộp thư. Đọc/ghi cột `conversations.last_notified_at`
// bằng khóa SERVICE_ROLE (bỏ qua RLS, chỉ function này trên máy chủ Supabase mới có khóa này, KHÔNG
// lộ ra trình duyệt) để quyết định có gửi hay không — làm ở phía máy chủ (không phải ở trình duyệt
// khách) để không ai "lách" được giới hạn này bằng cách tự gọi lại nhiều lần.
//
// Gọi mỗi khi khách gửi 1 tin nhắn (src/lib/chat.ts, sendMessage() khi sender === 'customer') —
// KHÔNG chặn việc gửi tin nếu email lỗi (fire-and-forget, chat vẫn hoạt động bình thường).
//
// Deploy: `npx supabase functions deploy notify-chat-message` (không cần set thêm secrets nào khác —
// SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY đã tự có sẵn trong mọi Edge Function của dự án).

import { createClient } from 'npm:@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const OWNER_EMAIL = Deno.env.get('OWNER_EMAIL');
const RESEND_FROM = Deno.env.get('RESEND_FROM') || 'Dược Sĩ Thương <onboarding@resend.dev>';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const NOTIFY_THROTTLE_MS = 60 * 60 * 1000; // 1 giờ

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
  if (!RESEND_API_KEY || !OWNER_EMAIL || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: 'Chưa cấu hình đủ secrets trên Supabase.' }), {
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

  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Kiểm tra lần báo email gần nhất của ĐÚNG hội thoại này — chưa từng báo (null) hoặc đã quá 1 giờ
  // thì mới gửi tiếp, còn lại bỏ qua (khách vẫn gửi tin bình thường, chỉ là không báo email thêm).
  const { data: conv, error: convError } = await supabaseAdmin.from('conversations').select('last_notified_at').eq('id', payload.conversationId).maybeSingle();
  if (convError) {
    console.error('Không đọc được hội thoại:', convError);
    return new Response(JSON.stringify({ error: 'Không đọc được hội thoại.' }), { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
  const lastNotified = conv?.last_notified_at ? new Date(conv.last_notified_at).getTime() : 0;
  if (Date.now() - lastNotified < NOTIFY_THROTTLE_MS) {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { headers: { ...headers, 'Content-Type': 'application/json' } });
  }

  const who = payload.customerName ? escapeHtml(payload.customerName) : `Khách #${payload.conversationId.slice(0, 8)}`;
  const html = `<!doctype html>
<html lang="vi"><body style="font-family: Arial, Helvetica, sans-serif; color: #111827; padding: 16px">
<h2 style="color: #14532d">Có tin nhắn mới từ ${who}</h2>
<table role="presentation" cellpadding="0" cellspacing="0" style="background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; margin: 12px 0">
<tr><td style="padding: 14px 16px; font-size: 15px; color: #14532d">${escapeHtml(payload.body)}</td></tr>
</table>
<p><a href="https://duocsithuong.com/admin/tin-nhan/" style="color: #15803d; font-weight: 600">Trả lời ngay tại /admin/tin-nhan/</a></p>
<p style="font-size: 12px; color: #9ca3af">Để tránh làm phiền, mỗi hội thoại chỉ báo email tối đa 1 lần/giờ — khách có thể đã nhắn thêm vài tin sau tin này, hãy vào trang quản trị xem đầy đủ.</p>
</body></html>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: RESEND_FROM, to: OWNER_EMAIL, subject: `Tin nhắn mới từ ${who} - Dược Sĩ Thương`, html }),
    });
    if (!response.ok) throw new Error(`Resend lỗi (${response.status}): ${await response.text()}`);

    // Chỉ cập nhật mốc thời gian SAU KHI gửi email thành công — nếu Resend lỗi, lần khách nhắn tiếp
    // theo vẫn được thử báo lại (không bị "khóa" 1 giờ oan vì 1 email chưa từng gửi được).
    await supabaseAdmin.from('conversations').update({ last_notified_at: new Date().toISOString() }).eq('id', payload.conversationId);

    return new Response(JSON.stringify({ ok: true }), { headers: { ...headers, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('Gửi email báo tin nhắn mới thất bại:', err);
    return new Response(JSON.stringify({ error: 'Không gửi được email.' }), { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } });
  }
});
