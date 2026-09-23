import { getCollection, type CollectionEntry } from 'astro:content';
import type { DepartmentSlug } from './departments';

export type Product = CollectionEntry<'products'>;

/**
 * Trả về các sản phẩm, xếp theo tên. Khi chạy `npm run dev` hiện cả bản nháp để xem thử;
 * khi `npm run build` chỉ giữ sản phẩm có `draft: false`.
 */
export async function getProducts(department?: DepartmentSlug, group?: string): Promise<Product[]> {
  const all = await getCollection('products');
  return all
    .filter((product) => import.meta.env.DEV || !product.data.draft)
    .filter((product) => !department || product.data.department === department)
    .filter((product) => !group || product.data.group === group)
    .sort((a, b) => a.data.name.localeCompare(b.data.name, 'vi'));
}

/** Ví dụ 350000 -> "350.000đ" (chữ "đ" thường, liền số, không phải ký hiệu "₫" có gạch ngang qua thân
 * chữ dễ bị nhầm thành gạch chân — theo yêu cầu chủ website tháng 9/2026). Không có giá thì trả "Liên hệ". */
export function formatPrice(price?: number): string {
  return price === undefined ? 'Liên hệ' : `${price.toLocaleString('vi-VN')}đ`;
}

/** Khoảng giá dùng làm bộ lọc tìm kiếm (Pagefind). Không có giá thì trả undefined (không lọc được theo giá). */
export function priceBucket(price?: number): string | undefined {
  if (price === undefined) return undefined;
  if (price < 100_000) return 'Dưới 100.000 đ';
  if (price < 300_000) return '100.000 - 300.000 đ';
  if (price < 500_000) return '300.000 - 500.000 đ';
  return 'Trên 500.000 đ';
}
