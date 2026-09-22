/**
 * Video ngắn hiện ở trang chủ (mục "Video ngắn", chủ website yêu cầu tháng 9/2026, kiểu video ngắn/reels
 * của các nhà thuốc trực tuyến khác). Không tự dựng video; chỉ nhúng liên kết tới video CÓ THẬT
 * (Zalo, Facebook, YouTube...). Mảng rỗng thì cả mục tự ẩn trên trang chủ (xem `src/pages/index.astro`).
 *
 * Thêm một video: thêm một phần tử vào mảng bên dưới.
 * - url: liên kết tới video thật (mở tab mới khi bấm vào)
 * - thumbnail: ảnh đại diện video, đặt trong src/assets/videos/, tỷ lệ dọc 9:16 giống ảnh reels
 * - title: tiêu đề ngắn hiện dưới ảnh
 *
 * Lưu ý về `thumbnail`: Facebook (và hầu hết mạng xã hội) không cho lấy ảnh đại diện video qua công cụ
 * tự động (cần đăng nhập, link ảnh cũng hết hạn) nên KHÔNG dùng ảnh thật của video làm thumbnail ở đây —
 * video "reel-duoc-si-thuong-1" bên dưới đang dùng ảnh đại diện tự thiết kế (nền xanh lá, biểu tượng Play)
 * thay cho ảnh cắt từ video thật. Muốn hiện đúng khung hình đầu video, gửi cho Claude 1 ảnh chụp màn hình
 * video đó (tỷ lệ dọc) để thay vào. Tiêu đề "Dược sĩ Thương chia sẻ kiến thức sức khỏe" là tên tạm đặt,
 * nhờ chủ website xác nhận lại đúng nội dung video khi có dịp.
 */
import reelDuocSiThuong1 from '../assets/videos/reel-duoc-si-thuong-1.jpg';

export interface VideoItem {
  title: string;
  url: string;
  thumbnail: ImageMetadata;
}

export const videos: VideoItem[] = [
  {
    title: 'Dược sĩ Thương chia sẻ kiến thức sức khỏe',
    url: 'https://www.facebook.com/reel/2111457869732557',
    thumbnail: reelDuocSiThuong1,
  },
];
