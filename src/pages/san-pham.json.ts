import type { APIRoute } from 'astro';
import { flashSlots } from '../lib/flash-sale';
import { getProducts } from '../lib/products';

// Bảng giá công khai (chỉ sản phẩm đã đăng), dựng lúc build ra /san-pham.json. Edge Function
// send-order-email đọc file này để tính lại tiền theo GIÁ THẬT, không tin giá trình duyệt gửi lên
// (giỏ hàng lưu ở localStorage, ai cũng sửa được). Giá vốn đã hiện công khai trên từng trang sản phẩm.
export const GET: APIRoute = async () => {
  const products = await getProducts();
  const catalog = Object.fromEntries(
    products.map((p) => {
      // Khung giờ Flash Sale (src/lib/flash-sale.ts): máy chủ áp giá Flash nếu giờ nhận đơn nằm trong khung
      const flash = flashSlots.flatMap((slot) =>
        slot.items[p.id] ? [{ start: slot.start, end: slot.end, price: slot.items[p.id] }] : [],
      );
      return [
        p.id,
        {
          name: p.data.name,
          price: p.data.price ?? null,
          originalPrice: p.data.originalPrice ?? null,
          ...(flash.length > 0 && { flash }),
        },
      ];
    }),
  );
  return new Response(JSON.stringify(catalog), { headers: { 'Content-Type': 'application/json' } });
};
