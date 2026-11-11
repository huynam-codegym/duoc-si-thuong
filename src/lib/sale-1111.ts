import { promoSlots } from './flash-sale';
import { getProducts, type Product } from './products';

/**
 * Chương trình "Săn sale 11.11" (chủ website yêu cầu 11/11/2026, theo bài đăng Facebook của nhà thuốc).
 * Banner ở trang chủ (`Sale1111Banner.astro`) + trang `/san-sale-11-11/` liệt kê sản phẩm.
 *
 * Sản phẩm, giá ưu đãi và thời gian nằm ở `promoSlots` (id 'san-sale-11-11') trong flash-sale.ts, vì giỏ
 * hàng, trang sản phẩm và máy chủ đặt hàng đều đọc giá theo giờ từ đó. File này chỉ thêm phần chữ.
 *
 * Câu chữ lấy từ bài đăng của chủ website, bỏ các cụm phóng đại ("cực tốt"). "Freeship tận nhà" ghi đúng
 * chính sách giao hàng thật (miễn phí từ FREE_SHIPPING_THRESHOLD trong cart.ts), không ghi miễn phí vô điều kiện.
 */
const slot = promoSlots.find((s) => s.id === 'san-sale-11-11')!;

export const SALE_1111 = {
  slug: 'san-sale-11-11',
  title: 'Săn sale 11.11',
  headline: 'Không ngại đi xa, mua sắm ngay tại nhà',
  start: slot.start,
  // Hết thời hạn thì banner trang chủ tự ẩn, trang chương trình báo đã kết thúc.
  endsAt: slot.end,
  items: slot.items,
};

/** Sản phẩm thật của chương trình, đúng thứ tự khai báo. Build báo lỗi nếu giá ưu đãi không hợp lệ. */
export async function getSale1111Products(): Promise<Product[]> {
  const all = await getProducts();
  const bySlug = new Map(all.map((p) => [p.id, p]));
  return Object.entries(SALE_1111.items).map(([slug, salePrice]) => {
    const product = bySlug.get(slug);
    if (!product) throw new Error(`Săn sale 11.11: không có sản phẩm đang bán "${slug}"`);
    const { price, originalPrice } = product.data;
    if (!price || salePrice >= price) throw new Error(`Săn sale 11.11: giá ưu đãi ${slug} phải thấp hơn giá bán ${price}`);
    if (salePrice < (originalPrice ?? price) / 2) throw new Error(`Săn sale 11.11: ${slug} giảm quá 50% so với giá gốc`);
    return product;
  });
}

export const sale1111Active = (now = new Date()) => now < new Date(SALE_1111.endsAt);
