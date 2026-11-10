/**
 * "Sản phẩm bạn đã xem" (chủ website yêu cầu 10/11/2026): nhớ slug các sản phẩm khách vừa mở trang chi tiết,
 * lưu ở localStorage của chính trình duyệt khách (không gửi đi đâu). Chỉ import trong thẻ <script>.
 * Tên, ảnh, giá KHÔNG lưu ở đây mà lấy mới từ /san-pham.json lúc hiện, nên giá luôn đúng và sản phẩm đã
 * ngừng bán tự biến mất.
 */
const KEY = 'duocsithuong-recent-v1';
export const MAX_RECENT = 12;

export function getRecentlyViewed(): string[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(data) ? data.filter((slug): slug is string => typeof slug === 'string').slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
}

/** Đưa sản phẩm lên đầu danh sách (xem lại thì không tạo dòng trùng). */
export function addRecentlyViewed(slug: string) {
  const list = [slug, ...getRecentlyViewed().filter((s) => s !== slug)].slice(0, MAX_RECENT);
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // trình duyệt chặn localStorage thì bỏ qua
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // bỏ qua
  }
}
