import { getCollection, type CollectionEntry } from 'astro:content';
import type { ProductGroupSlug } from './product-groups';

export type Product = CollectionEntry<'products'>;

/**
 * Trả về các sản phẩm, xếp theo tên. Khi chạy `npm run dev` hiện cả bản nháp để xem thử;
 * khi `npm run build` chỉ giữ sản phẩm có `draft: false`.
 */
export async function getProducts(group?: ProductGroupSlug): Promise<Product[]> {
  const all = await getCollection('products');
  return all
    .filter((product) => import.meta.env.DEV || !product.data.draft)
    .filter((product) => !group || product.data.group === group)
    .sort((a, b) => a.data.name.localeCompare(b.data.name, 'vi'));
}

/** Ví dụ 350000 -> "350.000 ₫". Không có giá thì trả "Liên hệ". */
export function formatPrice(price?: number): string {
  return price === undefined ? 'Liên hệ' : `${price.toLocaleString('vi-VN')} ₫`;
}
