/**
 * Khối sản phẩm dạng lưới có nút "Xem thêm sản phẩm" — 2 cột trên điện thoại/máy tính bảng (hiện sẵn
 * tối đa 16 sản phẩm), 4 cột trên máy tính (≥77rem, hiện sẵn tối đa 12 sản phẩm), bấm "Xem thêm" hiện
 * thêm từng đợt (16 hoặc 12 tùy màn hình) tới khi hết thì tự ẩn nút. Dùng chung cho trang chủ
 * (`src/pages/index.astro`), trang khu bán hàng (`[department]/index.astro`) và trang nhóm sản phẩm
 * (`[department]/nhom/[group].astro`) — chỉ import và gọi hàm này trong thẻ <script> của từng trang,
 * không viết lặp lại logic. Markup cần đúng cấu trúc: khối `.carousel.carousel-wide` chứa
 * `.carousel-track` rồi tới các `.carousel-item`; nút "Xem thêm" (class `.carousel-more-btn`) là phần
 * tử em kế tiếp `.carousel-wide` (ví dụ `<p class="carousel-more"><button class="carousel-more-btn">`).
 * Cỡ trang chỉ tính MỘT LẦN lúc tải trang (đổi khổ màn hình giữa chừng không tính lại) — đơn giản, đủ
 * dùng vì người dùng hiếm khi xoay ngang/dọc đúng lúc đang bấm "Xem thêm".
 */
const PAGE_SIZE_DESKTOP = 12;
const PAGE_SIZE_MOBILE = 16;

export function initProductLoadMoreGrids(): void {
  const pageSize = window.matchMedia('(min-width: 77rem)').matches ? PAGE_SIZE_DESKTOP : PAGE_SIZE_MOBILE;
  document.querySelectorAll<HTMLElement>('.carousel-wide').forEach((wide) => {
    const items = Array.from(wide.querySelectorAll<HTMLElement>('.carousel-item'));
    const moreBtn = wide.nextElementSibling?.querySelector<HTMLButtonElement>('.carousel-more-btn');
    if (items.length === 0) return;
    let shown = pageSize;
    function render() {
      items.forEach((item, i) => (item.hidden = i >= shown));
      if (moreBtn) moreBtn.hidden = shown >= items.length;
    }
    render();
    moreBtn?.addEventListener('click', () => {
      shown += pageSize;
      render();
    });
  });
}
