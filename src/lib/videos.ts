/**
 * Video ngắn hiện ở trang chủ (mục "Video ngắn", chủ website yêu cầu tháng 9/2026, kiểu video ngắn/reels
 * của các nhà thuốc trực tuyến khác). Không tự dựng video; chỉ nhúng liên kết tới video CÓ THẬT
 * (Zalo, Facebook, YouTube...). Mảng rỗng thì cả mục tự ẩn trên trang chủ (xem `src/pages/index.astro`).
 *
 * Thêm một video: thêm một phần tử vào mảng bên dưới.
 * - url: liên kết tới video thật (mở tab mới khi bấm vào)
 * - thumbnail: ảnh đại diện video, đặt trong src/assets/videos/, tỷ lệ dọc 9:16 giống ảnh reels
 * - title: tiêu đề ngắn hiện dưới ảnh
 */
export interface VideoItem {
  title: string;
  url: string;
  thumbnail: ImageMetadata;
}

export const videos: VideoItem[] = [];
