/**
 * "Bệnh thường gặp theo mùa" ở trang chủ: ghép mỗi bệnh (nhóm con của chuyên mục `an-uong`, xem
 * `categories.ts`) với một đoạn giới thiệu ngắn và (nếu có) một nhóm sản phẩm hỗ trợ liên quan.
 *
 * Chủ website yêu cầu (tháng 9/2026, gửi ảnh trang chủ Long Châu): mỗi tab hiện nội dung bên trái,
 * sản phẩm liên quan bên phải — khác với quyết định trước đó (xem lịch sử Git/CLAUDE.md) là tách
 * hẳn 4 bài bệnh khỏi sản phẩm. Để vẫn đúng nguyên tắc 4 và 6 (không hứa chữa khỏi, không quảng cáo
 * thực phẩm chức năng như thuốc):
 * - `productSource` chỉ trỏ tới một NHÓM sản phẩm chung (ví dụ "Tiêu hóa"), không phải "sản phẩm chữa
 *   bệnh X"; sản phẩm hiện ra là sản phẩm THẬT đã có trong `src/content/products/` (không bịa).
 * - Nhóm nào chưa có sản phẩm thật thì tự hiện "đang được cập nhật" (không hiện sản phẩm giả).
 * - Trang chủ luôn kèm một dòng nhắc "chỉ mang tính hỗ trợ, không phải thuốc" ngay dưới mục này.
 * - Không có `productSource` (ví dụ sốt xuất huyết: thuốc hạ sốt paracetamol không bán trên site,
 *   và chưa có nhóm sản phẩm phòng muỗi) thì chỉ hiện nội dung bên trái, không hiện khung sản phẩm.
 *
 * Thêm bệnh mới: thêm nhóm vào `categories.ts` (mục `an-uong`) trước, rồi thêm một phần tử ở đây.
 */
import type { DepartmentSlug } from './departments';

export interface SeasonalTopic {
  /** Slug nhóm con trong categories.ts (mục an-uong) */
  groupSlug: string;
  /** Slug bài viết đầy đủ trong src/content/posts, dùng để tạo liên kết "Xem dấu hiệu & cách chăm sóc" */
  postSlug: string;
  /** Đoạn giới thiệu ngắn hiện ở khung bên trái */
  summary: string;
  /** Nhóm sản phẩm hỗ trợ liên quan (không bắt buộc) */
  productSource?: { department: DepartmentSlug; group: string };
}

export const seasonalTopics: SeasonalTopic[] = [
  {
    groupSlug: 'tieu-chay-cap',
    postSlug: 'tieu-chay-cap-dau-hieu-va-cach-xu-tri',
    summary:
      'Tiêu chảy cấp thường gặp, dễ gây mất nước, đặc biệt ở trẻ nhỏ. Cần bù nước sớm bằng oresol pha đúng cách, giữ vệ sinh ăn uống, và cho trẻ tiêm vắc xin Rota đúng lịch để phòng bệnh.',
    productSource: { department: 'thuc-pham-chuc-nang', group: 'tieu-hoa' },
  },
  {
    groupSlug: 'tay-chan-mieng',
    postSlug: 'tay-chan-mieng-o-tre-nho',
    summary:
      'Tay chân miệng hay gặp ở trẻ dưới 5 tuổi, thường tự khỏi sau 7-10 ngày. Một số ít trẻ có thể trở nặng rất nhanh, cha mẹ nên biết dấu hiệu cảnh báo để đưa trẻ đi khám kịp thời.',
    productSource: { department: 'thuc-pham-chuc-nang', group: 'de-khang' },
  },
  {
    groupSlug: 'cum',
    postSlug: 'cum-mua-dau-hieu-va-cham-soc',
    summary:
      'Cúm mùa khởi phát đột ngột với sốt cao và đau mỏi người, khác với cảm lạnh. Phần lớn người khỏe mạnh tự hồi phục sau khoảng 1 tuần nếu nghỉ ngơi và chăm sóc đúng cách.',
    productSource: { department: 'thuc-pham-chuc-nang', group: 'de-khang' },
  },
  {
    groupSlug: 'sot-xuat-huyet',
    postSlug: 'sot-xuat-huyet-dau-hieu-canh-bao',
    summary:
      'Sốt xuất huyết lây qua muỗi vằn, phần lớn nhẹ nhưng có thể trở nặng nhanh, thường vào lúc hết sốt. Diệt lăng quăng và tránh muỗi đốt là cách phòng ngừa quan trọng nhất.',
  },
];
