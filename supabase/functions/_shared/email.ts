// Kiểm tra email khách nhập ở form đặt hàng (tháng 10/2026). DÙNG CHUNG cho 2 nơi để luật luôn khớp:
//   - trình duyệt: src/pages/gio-hang.astro (báo lỗi ngay dưới ô email)
//   - máy chủ: supabase/functions/send-order-email (không tin trình duyệt, kiểm tra lại)
// File này chỉ là TypeScript thuần, không dùng API riêng của Deno hay trình duyệt.
// Câu báo lỗi giữ NGẮN để không xuống 2 dòng trên điện thoại (dòng lỗi chỉ dành sẵn chỗ cho 1 dòng).

// Gõ nhầm tên miền hay gặp -> tên miền đúng
const DOMAIN_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmail.vn': 'gmail.com',
  'gmail.com.vn': 'gmail.com',
  'gmai.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'yahoo.con': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'hotmail.con': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotnail.com': 'hotmail.com',
  'outlook.con': 'outlook.com',
  'outlok.com': 'outlook.com',
  'icloud.con': 'icloud.com',
  'iclould.com': 'icloud.com',
};

// Phần trước @: chữ cái/số không dấu và . _ % + -, không bắt đầu/kết thúc bằng dấu chấm, không có 2 chấm liền.
const LOCAL_RE = /^[a-z0-9_%+-]+(\.[a-z0-9_%+-]+)*$/i;
// Tên miền: các nhãn chữ/số/gạch ngang (không bắt đầu/kết thúc bằng gạch ngang), đuôi cuối toàn chữ cái, ≥2 ký tự.
const DOMAIN_RE = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,24}$/i;

export type EmailCheck = { ok: true; email: string } | { ok: false; message: string };

/** Chuẩn hóa (bỏ khoảng trắng, viết thường) rồi kiểm tra. `email` trả về là bản đã chuẩn hóa. */
export function checkEmail(raw: string): EmailCheck {
  const email = raw.trim().toLowerCase();
  if (!email) return { ok: false, message: 'Vui lòng nhập email.' };
  if (/\s/.test(email)) return { ok: false, message: 'Email không được có dấu cách.' };
  const at = email.lastIndexOf('@');
  if (at < 1 || email.indexOf('@') !== at) return { ok: false, message: 'Email chưa đúng, ví dụ ten@gmail.com.' };
  const local = email.slice(0, at);
  const domain = email.slice(at + 1);
  // Chữ có dấu tiếng Việt (ví dụ "thương@gmail.com") rơi vào đây vì LOCAL_RE/DOMAIN_RE chỉ nhận chữ không dấu
  if (email.length > 254 || local.length > 64 || !LOCAL_RE.test(local) || !DOMAIN_RE.test(domain)) {
    return { ok: false, message: 'Email chưa đúng, ví dụ ten@gmail.com.' };
  }
  const fix = DOMAIN_TYPOS[domain];
  if (fix) return { ok: false, message: `Có phải là @${fix}?` };
  return { ok: true, email };
}
