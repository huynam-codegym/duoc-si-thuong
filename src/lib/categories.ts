export const categories = {
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
  },
  'hoi-dap': {
    name: 'Hỏi đáp',
    description: 'Giải đáp những thắc mắc thường gặp về sức khỏe và thuốc.',
  },
} as const;

export type CategorySlug = keyof typeof categories;

export const categorySlugs = Object.keys(categories) as [CategorySlug, ...CategorySlug[]];
