/**
 * Giỏ hàng chạy hoàn toàn trên trình duyệt của khách (localStorage), không cần máy chủ.
 * Chỉ import file này trong thẻ <script> của component (chạy ở trình duyệt), không import ở phần frontmatter.
 * Giá và tên lưu lại lúc thêm vào giỏ; đơn hàng luôn được nhà thuốc xác nhận lại trước khi giao.
 */
export interface CartItem {
  id: string;
  name: string;
  /** null = sản phẩm "Liên hệ" (chưa có giá) */
  price: number | null;
  /** Giá gốc trước khuyến mãi (không bắt buộc) — chỉ để HIỆN giá gạch ngang + nhãn "-X%" trong giỏ
   * hàng, KHÔNG dùng để tính tiền (tạm tính luôn dựa trên `price`, xem cartTotal() bên dưới). */
  originalPrice?: number | null;
  unit: string;
  image: string;
  qty: number;
}

export const MAX_QTY = 20;
const KEY = 'duocsithuong-cart';

// Nếu trình duyệt chặn localStorage (ví dụ cửa sổ ẩn danh) thì giữ giỏ trong bộ nhớ, giỏ vẫn dùng được trong trang đang mở
let memory: CartItem[] = [];

function isItem(value: unknown): value is CartItem {
  const item = value as CartItem;
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    (item.price === null || (typeof item.price === 'number' && item.price > 0)) &&
    (item.originalPrice === undefined || item.originalPrice === null || (typeof item.originalPrice === 'number' && item.originalPrice > 0)) &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  );
}

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data: unknown = raw ? JSON.parse(raw) : [];
    memory = Array.isArray(data) ? data.filter(isItem) : [];
  } catch {
    // giữ nguyên `memory`
  }
  return memory.map((item) => ({ ...item }));
}

function save(items: CartItem[]) {
  memory = items;
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // không lưu được thì thôi, `memory` vẫn giữ giỏ
  }
  window.dispatchEvent(new CustomEvent('cart:change'));
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const items = getCart();
  const found = items.find((entry) => entry.id === item.id);
  if (found) {
    Object.assign(found, item, { qty: Math.min(MAX_QTY, found.qty + qty) });
  } else {
    items.push({ ...item, qty: Math.min(MAX_QTY, qty) });
  }
  save(items);
}

/** Đặt số lượng; nhỏ hơn 1 thì xóa khỏi giỏ. */
export function setQty(id: string, qty: number) {
  const items = getCart();
  const found = items.find((entry) => entry.id === id);
  if (!found) return;
  if (!Number.isFinite(qty) || qty < 1) {
    save(items.filter((entry) => entry.id !== id));
    return;
  }
  found.qty = Math.min(MAX_QTY, Math.floor(qty));
  save(items);
}

export function removeItem(id: string) {
  save(getCart().filter((entry) => entry.id !== id));
}

export function clearCart() {
  save([]);
}

export function cartCount(items = getCart()): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

/** Tổng tiền của các sản phẩm đã có giá. */
export function cartTotal(items = getCart()): number {
  return items.reduce((sum, item) => sum + (item.price ?? 0) * item.qty, 0);
}

export function hasUnpriced(items = getCart()): boolean {
  return items.some((item) => item.price === null);
}

// Chữ "đ" thường liền số, không phải ký hiệu "₫" (khớp cách hiện giá ở formatPrice trong products.ts)
export function formatVnd(value: number): string {
  return `${value.toLocaleString('vi-VN')}đ`;
}
