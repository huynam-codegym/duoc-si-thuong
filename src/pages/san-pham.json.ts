import type { APIRoute } from 'astro';
import { getProducts } from '../lib/products';

// Bảng giá công khai (chỉ sản phẩm đã đăng), dựng lúc build ra /san-pham.json. Edge Function
// send-order-email đọc file này để tính lại tiền theo GIÁ THẬT, không tin giá trình duyệt gửi lên
// (giỏ hàng lưu ở localStorage, ai cũng sửa được). Giá vốn đã hiện công khai trên từng trang sản phẩm.
export const GET: APIRoute = async () => {
  const products = await getProducts();
  const catalog = Object.fromEntries(
    products.map((p) => [p.id, { name: p.data.name, price: p.data.price ?? null, originalPrice: p.data.originalPrice ?? null }]),
  );
  return new Response(JSON.stringify(catalog), { headers: { 'Content-Type': 'application/json' } });
};
