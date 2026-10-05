// Edge Function: gửi email xác nhận đơn hàng (tháng 9/2026).
//
// Chạy trên máy chủ Supabase (Deno), KHÔNG chạy trong trình duyệt — vì vậy khóa RESEND_API_KEY
// (bí mật, khác hẳn khóa "anon" của Supabase) giữ được an toàn ở đây, không lộ ra trình duyệt.
// Trang /gio-hang/ gọi function này bằng supabase.functions.invoke('send-order-email', {...}) ngay
// sau khi khách bấm "Hoàn tất" (xem src/pages/gio-hang.astro).
//
// Việc của function: build HTML email (mẫu giống src/emails/xac-nhan-don-hang.html, viết lại bằng
// JS template string cho dễ chèn dữ liệu thật) rồi gọi Resend API để gửi:
//   1. Cho KHÁCH (nếu khách có điền email — ô này không bắt buộc) — xác nhận đơn theo mẫu đẹp.
//   2. Cho CHỦ NHÀ THUỐC (luôn gửi) — thông báo có đơn mới, kèm đủ thông tin để liên hệ/xử lý ngay,
//      vì đây là kênh DUY NHẤT thay cho luồng "mở Zalo, khách tự chép & gửi" trước đây.
//
// Cần thiết lập trước khi dùng thật (xem CLAUDE.md, mục "Gửi email xác nhận đơn hàng"):
//   - Tài khoản Resend (miễn phí), xác minh tên miền duocsithuong.com (thêm bản ghi DNS ở Cloudflare)
//     để gửi được tới email BẤT KỲ của khách (chưa xác minh tên miền thì Resend chỉ cho gửi tới đúng
//     email đăng ký tài khoản Resend, không dùng được cho khách thật).
//   - `supabase secrets set RESEND_API_KEY=... OWNER_EMAIL=... RESEND_FROM="Dược Sĩ Thương <don-hang@duocsithuong.com>"`
//   - `supabase functions deploy send-order-email`

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
Chào <strong>${escapeHtml(order.ordererName)}</strong>, Dược Sĩ Thương đã nhận được đơn hàng <strong>#${order.orderId}</strong>.
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
<h2 style="color: #14532d">Đơn hàng mới #${order.orderId}</h2>
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
    order = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Dữ liệu đơn hàng không hợp lệ.' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

  if (!order.items?.length || !order.ordererName || !order.phone || !order.address) {
    return new Response(JSON.stringify({ error: 'Thiếu thông tin đơn hàng bắt buộc.' }), {
      status: 400,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }

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

    return new Response(JSON.stringify({ ok: true, customerEmailSent }), {
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Gửi email chủ nhà thuốc thất bại:', err);
    return new Response(JSON.stringify({ error: 'Không gửi được email.' }), {
      status: 502,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
});
