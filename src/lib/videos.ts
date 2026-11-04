/**
 * Video ngắn hiện ở trang chủ (mục "Video ngắn", chủ website yêu cầu tháng 9/2026, kiểu video ngắn/reels
 * của các nhà thuốc trực tuyến khác). Không tự dựng video; chỉ dùng video CÓ THẬT của chủ website.
 * Mảng rỗng thì cả mục tự ẩn trên trang chủ (xem `src/pages/index.astro`).
 *
 * Thêm một video: thêm một phần tử vào mảng bên dưới, có `src` HOẶC `url`:
 * - src: file video tự tải lên, PHÁT NGAY TRÊN TRANG (khung xem video nổi, tháng 11/2026 chủ website yêu
 *   cầu thay cho mở Facebook). Đặt file .mp4 (H.264) trong public/videos/trang-chu/, ghi đường dẫn bắt đầu
 *   bằng `/videos/...`. Nên nén dưới ~20MB/video (giống video sản phẩm) vì site chạy trên GitHub Pages,
 *   file trên 100MB không đẩy lên được.
 * - url: liên kết tới video ở nơi khác (Facebook, YouTube...), bấm vào mở tab mới. Chỉ dùng khi chưa có file.
 * - thumbnail: ảnh đại diện video, đặt trong src/assets/videos/, tỷ lệ dọc 9:16 giống ảnh reels
 * - title: tiêu đề ngắn hiện dưới ảnh
 *
 * Lưu ý về `thumbnail`: Facebook (và hầu hết mạng xã hội) không cho lấy ảnh đại diện video qua công cụ
 * tự động (cần đăng nhập, link ảnh cũng hết hạn). Với video có file (`src`), dựng ảnh bìa từ 1 khung hình
 * thật của chính file đó.
 */
// Ảnh bìa tự dựng từ 1 khung hình thật của video (giây 5,5) + tiêu đề, che dòng chữ gốc trong video.
import top6VitaminD from '../assets/videos/top-6-thuc-pham-giau-vitamin-d.jpg';

export interface VideoItem {
  title: string;
  /** File video trong public/, phát ngay trên trang. */
  src?: `/videos/${string}`;
  /** Liên kết ra ngoài (Facebook...), chỉ dùng khi không có `src`. */
  url?: string;
  thumbnail: ImageMetadata;
}

export const videos: VideoItem[] = [
  {
    // Video chủ website gửi 04/11/2026 (16 giây, 1080x1920, 3,9MB)
    title: 'Top 6 thực phẩm giàu vitamin D cho bé',
    src: '/videos/trang-chu/top-6-thuc-pham-giau-vitamin-d.mp4',
    thumbnail: top6VitaminD,
  },
];
