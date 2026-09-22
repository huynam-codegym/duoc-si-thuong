/**
 * Hàm xử lý chữ dùng chung, KHÔNG phụ thuộc `astro:content` — để có thể import an toàn cả ở mã chạy
 * trên trình duyệt (thẻ <script> của component/trang), không chỉ ở phần frontmatter (chạy trên máy chủ).
 * `posts.ts` (có import astro:content) re-export lại hàm này để chỗ khác không phải đổi đường dẫn import.
 */

/**
 * Bỏ dấu tiếng Việt (kể cả đ/Đ). Pagefind tự bỏ dấu thanh và dấu mũ nhưng không xem "đ" là "d",
 * nên gõ "dot quy" sẽ không ra "đột quỵ". Bản không dấu này được thêm vào chỉ mục tìm kiếm.
 */
export function foldVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}
