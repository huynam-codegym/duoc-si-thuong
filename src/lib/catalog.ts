/**
 * Đọc bảng sản phẩm công khai /san-pham.json (dựng lúc build từ src/pages/san-pham.json.ts) ở trình duyệt,
 * dùng cho "Sản phẩm bạn đã xem" và nút "Mua lại". Chỉ import trong thẻ <script>.
 */
import { url } from './url';

export interface CatalogItem {
  name: string;
  price: number | null;
  originalPrice: number | null;
  unit: string;
  /** Đường dẫn trang chi tiết */
  url: string;
  /** Ảnh 160px dùng trong giỏ hàng */
  image: string;
  /** Ảnh 320px cho thẻ sản phẩm */
  thumb: string;
  group: string;
}

let pending: Promise<Record<string, CatalogItem>> | null = null;

export function loadCatalog(): Promise<Record<string, CatalogItem>> {
  pending ??= fetch(url('/san-pham.json')).then((res) => {
    if (!res.ok) throw new Error(`san-pham.json ${res.status}`);
    return res.json();
  });
  pending.catch(() => (pending = null)); // lỗi mạng thì lần sau thử lại
  return pending;
}
