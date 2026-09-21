export interface Group {
  /** Biểu tượng nhỏ (emoji) hiện cạnh tên nhóm trong menu thả xuống. */
  icon: string;
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
    name: 'Ăn uống & dinh dưỡng',
    description: 'Chế độ ăn, thực phẩm và thực đơn lành mạnh theo từng nhu cầu.',
  },
  'nhan-biet-benh': {
    name: 'Nhận biết bệnh',
    description: 'Triệu chứng, dấu hiệu cảnh báo và khi nào cần đi khám.',
  },
  'phong-chong-benh': {
    name: 'Phòng chống bệnh',
    description: 'Lối sống, tiêm chủng, sàng lọc và chăm sóc sức khỏe tại nhà.',
  },
  'kien-thuc-ve-thuoc': {
    name: 'Kiến thức về thuốc',
    description: 'Cách dùng thuốc an toàn, tương tác thuốc và bảo quản thuốc.',
    groups: {
      'khang-sinh': {
        name: 'Kháng sinh',
        icon: '🦠',
        description: 'Khi nào cần kháng sinh, vì sao không tự ý dùng và cách tránh kháng thuốc.',
      },
      'giam-dau-ha-sot': {
        name: 'Giảm đau, hạ sốt',
        icon: '🌡️',
        description: 'Paracetamol, ibuprofen và cách dùng an toàn khi đau, sốt.',
      },
      'khang-viem': {
        name: 'Thuốc kháng viêm',
        icon: '💊',
        description: 'Thuốc kháng viêm không steroid (NSAID) và corticoid: khác nhau ra sao, lưu ý gì.',
      },
      'da-day': {
        name: 'Thuốc dạ dày',
        icon: '🍽️',
        description: 'Thuốc trung hòa acid, thuốc giảm tiết acid và những điều cần biết khi dùng.',
      },
      'ho-cam-cum': {
        name: 'Thuốc ho, cảm cúm',
        icon: '🤧',
        description: 'Thuốc giảm triệu chứng ho, sổ mũi, nghẹt mũi và cách tránh dùng trùng thành phần.',
      },
      'di-ung': {
        name: 'Thuốc dị ứng',
        icon: '🌼',
        description: 'Thuốc kháng histamin: chọn và dùng sao cho an toàn.',
      },
      'vitamin-khoang-chat': {
        name: 'Vitamin, khoáng chất',
        icon: '🍊',
        description: 'Bổ sung khi nào là cần thiết và khi nào có thể gây hại.',
      },
      'tim-mach-huyet-ap': {
        name: 'Thuốc tim mạch, huyết áp',
        icon: '❤️',
        description: 'Các nhóm thuốc hạ huyết áp và vì sao cần dùng đều đặn theo chỉ định.',
      },
      'tieu-duong': {
        name: 'Thuốc đái tháo đường',
        icon: '🩸',
        description: 'Thuốc và insulin: dùng đúng, phòng hạ đường huyết.',
      },
      'dung-thuoc-an-toan': {
        name: 'Dùng thuốc an toàn',
        icon: '🛡️',
        description: 'Đọc nhãn thuốc, bảo quản, tương tác thuốc và những nguyên tắc chung.',
      },
    },
  },
  'hoi-dap': {
    name: 'Hỏi đáp',
    description: 'Giải đáp những thắc mắc thường gặp về sức khỏe và thuốc.',
  },
} satisfies Record<string, Category>;

export type CategorySlug = keyof typeof categoryData;

export const categories: Record<CategorySlug, Category> = categoryData;

export const categorySlugs = Object.keys(categoryData) as [CategorySlug, ...CategorySlug[]];

/** Danh sách [slug nhóm, nhóm] của một chuyên mục (rỗng nếu chuyên mục không có nhóm con). */
export function getGroups(category: CategorySlug): [string, Group][] {
  return Object.entries(categories[category].groups ?? {});
}
