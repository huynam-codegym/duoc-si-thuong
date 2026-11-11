import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { departments } from '../lib/departments';
import { priceSlots } from '../lib/flash-sale';
import { getProducts } from '../lib/products';
import { url } from '../lib/url';

// Bảng giá công khai (chỉ sản phẩm đã đăng), dựng lúc build ra /san-pham.json. Edge Function
// send-order-email đọc file này để tính lại tiền theo GIÁ THẬT, không tin giá trình duyệt gửi lên
// (giỏ hàng lưu ở localStorage, ai cũng sửa được). Giá vốn đã hiện công khai trên từng trang sản phẩm.
// Trình duyệt cũng đọc file này (src/lib/catalog.ts) để hiện "Sản phẩm bạn đã xem" và nút "Mua lại".
export const GET: APIRoute = async () => {
  const products = await getProducts();
  const entries = await Promise.all(
    products.map(async (p) => {
      // Khung giờ có giá riêng (Flash Sale + chương trình khác, src/lib/flash-sale.ts): máy chủ áp giá thấp
      // nhất trong các khung đang diễn ra lúc nhận đơn
      const flash = priceSlots.flatMap((slot) =>
        slot.items[p.id] ? [{ start: slot.start, end: slot.end, price: slot.items[p.id], ...(slot.label && { label: slot.label }) }] : [],
      );
      // Cùng thông số ảnh với ProductCard (160px giỏ hàng) để dùng lại đúng file đã dựng
      const image = await getImage({ src: p.data.image, width: 160, height: 160, format: 'webp' });
      const thumb = await getImage({ src: p.data.image, width: 320, height: 320, format: 'webp' });
      return [
        p.id,
        {
          name: p.data.name,
          price: p.data.price ?? null,
          originalPrice: p.data.originalPrice ?? null,
          unit: p.data.unit ?? '',
          url: url(`/${p.data.department}/${p.id}/`),
          image: image.src,
          thumb: thumb.src,
          group: departments[p.data.department].groups[p.data.group].name,
          ...(flash.length > 0 && { flash }),
        },
      ] as const;
    }),
  );
  return new Response(JSON.stringify(Object.fromEntries(entries)), { headers: { 'Content-Type': 'application/json' } });
};
