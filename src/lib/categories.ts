import type { IconName } from './icon-names';

export interface Group {
  /** Icon đường nét hiện cạnh tên nhóm trong menu thả xuống (xem GroupIcon.astro). */
  icon: IconName;
  name: string;
  description: string;
}

export interface Category {
  name: string;
  description: string;
  /** Nhóm con (ví dụ nhóm thuốc). Nếu có, menu hiện danh sách thả xuống và có trang riêng cho từng nhóm. */
  groups?: Record<string, Group>;
}

const categoryData = {
  'an-uong': {
    // Tên đổi từ "Ăn uống & dinh dưỡng" thành "Bệnh & Góc Sức Khỏe" (chủ website yêu cầu tháng 9/2026,
    // theo kiểu menu của các nhà thuốc trực tuyến khác) SAU KHI thêm nhóm bệnh thường gặp bên dưới,
    // để tên chuyên mục khớp đúng với nội dung thật (trước đó chỉ đổi tạm ở menu, xem lịch sử Git).
    name: 'Bệnh & Góc Sức Khỏe',
    description: 'Ăn uống, dinh dưỡng và các bệnh thường gặp: dấu hiệu nhận biết, cách chăm sóc và khi nào cần đi khám.',
    groups: {
      'nguyen-tac': {
        name: 'Nguyên tắc ăn uống',
        icon: 'salad',
        description: 'Những nguyên tắc cơ bản để ăn uống cân bằng mỗi ngày.',
      },
      'thieu-canxi': {
        name: 'Thiếu canxi',
        icon: 'bone',
        description: 'Thiếu canxi nên ăn gì? Thực phẩm giàu canxi và cách để cơ thể hấp thu tốt hơn.',
      },
      'thieu-sat': {
        name: 'Thiếu sắt',
        icon: 'droplet',
        description: 'Thiếu sắt nên ăn gì? Nguồn sắt từ động vật, thực vật và cách tăng hấp thu.',
      },
      'thieu-vitamin-d': {
        name: 'Thiếu vitamin D',
        icon: 'sun',
        description: 'Thiếu vitamin D nên ăn gì, và vai trò của ánh nắng.',
      },
      'thieu-vitamin-b12': {
        name: 'Thiếu vitamin B12',
        icon: 'egg',
        description: 'Thiếu vitamin B12 nên ăn gì, và ai dễ bị thiếu.',
      },
      'thieu-kem': {
        name: 'Thiếu kẽm',
        icon: 'shell',
        description: 'Thiếu kẽm nên ăn gì để hỗ trợ miễn dịch, tăng trưởng và vết thương mau lành.',
      },
      'thieu-i-ot': {
        name: 'Thiếu i-ốt',
        icon: 'wave',
        description: 'Thiếu i-ốt nên ăn gì để tuyến giáp hoạt động bình thường.',
      },
      'thieu-vitamin-c': {
        name: 'Thiếu vitamin C',
        icon: 'citrus',
        description: 'Thiếu vitamin C nên ăn gì, và cách giữ vitamin C khi chế biến.',
      },
      'thieu-acid-folic': {
        name: 'Thiếu acid folic',
        icon: 'leaf',
        description: 'Thiếu acid folic (folate) nên ăn gì, và vì sao quan trọng khi chuẩn bị mang thai.',
      },
      'tieu-chay-cap': {
        name: 'Tiêu chảy cấp',
        icon: 'stomach',
        description: 'Dấu hiệu, cách bù nước và khi nào cần đưa trẻ đi khám.',
      },
      'tay-chan-mieng': {
        name: 'Tay chân miệng',
        icon: 'baby',
        description: 'Dấu hiệu ở trẻ nhỏ, chăm sóc tại nhà và dấu hiệu trở nặng cần cấp cứu.',
      },
      cum: {
        name: 'Cúm',
        icon: 'thermometer',
        description: 'Phân biệt cúm với cảm lạnh, chăm sóc tại nhà và tiêm phòng.',
      },
      'sot-xuat-huyet': {
        name: 'Sốt xuất huyết',
        icon: 'droplet',
        description: 'Dấu hiệu cảnh báo trở nặng, thuốc nên tránh và cách phòng muỗi đốt.',
      },
    },
  },
  'kien-thuc-ve-thuoc': {
    // Tên hiển thị là "Thuốc" (chủ website yêu cầu tháng 9/2026, theo kiểu menu của các nhà thuốc trực tuyến khác).
    // Đây VẪN CHỈ LÀ bài viết kiến thức, KHÔNG bán thuốc; slug và nội dung giữ nguyên "kiến thức về thuốc".
    // Không tự đổi thành khu bán hàng khi chưa có giấy phép kinh doanh dược qua thương mại điện tử.
    name: 'Thuốc',
    description: 'Cách dùng thuốc an toàn, tương tác thuốc và bảo quản thuốc.',
    groups: {
      'khang-sinh': {
        name: 'Kháng sinh',
        icon: 'bacteria',
        description: 'Khi nào cần kháng sinh, vì sao không tự ý dùng và cách tránh kháng thuốc.',
      },
      'giam-dau-ha-sot': {
        name: 'Giảm đau, hạ sốt',
        icon: 'thermometer',
        description: 'Paracetamol, ibuprofen và cách dùng an toàn khi đau, sốt.',
      },
      'khang-viem': {
        name: 'Thuốc kháng viêm',
        icon: 'capsule',
        description: 'Thuốc kháng viêm không steroid (NSAID) và corticoid: khác nhau ra sao, lưu ý gì.',
      },
      'da-day': {
        name: 'Thuốc dạ dày',
        icon: 'stomach',
        description: 'Thuốc trung hòa acid, thuốc giảm tiết acid và những điều cần biết khi dùng.',
      },
      'ho-cam-cum': {
        name: 'Thuốc ho, cảm cúm',
        icon: 'wind',
        description: 'Thuốc giảm triệu chứng ho, sổ mũi, nghẹt mũi và cách tránh dùng trùng thành phần.',
      },
      'di-ung': {
        name: 'Thuốc dị ứng',
        icon: 'flower',
        description: 'Thuốc kháng histamin: chọn và dùng sao cho an toàn.',
      },
      'vitamin-khoang-chat': {
        name: 'Vitamin, khoáng chất',
        icon: 'citrus',
        description: 'Bổ sung khi nào là cần thiết và khi nào có thể gây hại.',
      },
      'tim-mach-huyet-ap': {
        name: 'Thuốc tim mạch, huyết áp',
        icon: 'heart',
        description: 'Các nhóm thuốc hạ huyết áp và vì sao cần dùng đều đặn theo chỉ định.',
      },
      'tieu-duong': {
        name: 'Thuốc đái tháo đường',
        icon: 'droplet',
        description: 'Thuốc và insulin: dùng đúng, phòng hạ đường huyết.',
      },
      'dung-thuoc-an-toan': {
        name: 'Dùng thuốc an toàn',
        icon: 'shield',
        description: 'Đọc nhãn thuốc, bảo quản, tương tác thuốc và những nguyên tắc chung.',
      },
    },
  },
} satisfies Record<string, Category>;

export type CategorySlug = keyof typeof categoryData;

export const categories: Record<CategorySlug, Category> = categoryData;

export const categorySlugs = Object.keys(categoryData) as [CategorySlug, ...CategorySlug[]];

/** Danh sách [slug nhóm, nhóm] của một chuyên mục (rỗng nếu chuyên mục không có nhóm con). */
export function getGroups(category: CategorySlug): [string, Group][] {
  return Object.entries(categories[category].groups ?? {});
}
