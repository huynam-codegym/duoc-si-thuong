/**
 * Nhóm sản phẩm thực phẩm chức năng: nguồn duy nhất cho menu lớn ở đầu trang, menu bên trái, trang nhóm và kiểm tra frontmatter.
 * Thêm/đổi nhóm ở đây, các phần khác tự cập nhật. Thứ tự ở đây là thứ tự hiện trong menu.
 * Tên nhóm chỉ nên gọi theo hệ cơ quan hoặc đối tượng dùng, không gọi theo tên bệnh (tránh hiểu nhầm là thuốc chữa bệnh).
 */
export interface ProductGroup {
  /** Biểu tượng nhỏ (emoji) hiện cạnh tên nhóm. */
  icon: string;
  name: string;
  description: string;
}

const productGroupData = {
  'vitamin-khoang-chat': {
    icon: '🍊',
    name: 'Vitamin & khoáng chất',
    description: 'Thực phẩm bổ sung vitamin và khoáng chất cho chế độ ăn hằng ngày.',
  },
  'de-khang': {
    icon: '🛡️',
    name: 'Đề kháng & miễn dịch',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức đề kháng của cơ thể.',
  },
  mat: {
    icon: '👁️',
    name: 'Mắt & thị lực',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe đôi mắt.',
  },
  'tieu-hoa': {
    icon: '🍽️',
    name: 'Tiêu hóa',
    description: 'Thực phẩm bổ sung như men vi sinh, chất xơ dành cho người quan tâm đến đường tiêu hóa.',
  },
  'than-kinh-nao': {
    icon: '🧠',
    name: 'Thần kinh & trí nhớ',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe thần kinh và não bộ.',
  },
  'lam-dep': {
    icon: '✨',
    name: 'Hỗ trợ làm đẹp',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến làn da, mái tóc và móng.',
  },
  'duong-huyet': {
    icon: '🩸',
    name: 'Đường huyết',
    description:
      'Thực phẩm bổ sung dành cho người quan tâm đến chuyển hóa đường. Người bị đái tháo đường cần hỏi bác sĩ trước khi dùng.',
  },
  'tim-mach': {
    icon: '❤️',
    name: 'Tim mạch',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe tim mạch.',
  },
  'xuong-khop': {
    icon: '🦴',
    name: 'Xương khớp',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe xương và khớp.',
  },
  'phu-nu-me-bau': {
    icon: '🌸',
    name: 'Phụ nữ & mẹ bầu',
    description: 'Thực phẩm bổ sung dành cho phụ nữ, phụ nữ chuẩn bị mang thai và đang mang thai.',
  },
  'tre-em': {
    icon: '🧒',
    name: 'Trẻ em',
    description: 'Thực phẩm bổ sung dành cho trẻ em. Luôn hỏi bác sĩ, dược sĩ trước khi cho trẻ dùng.',
  },
} satisfies Record<string, ProductGroup>;

export type ProductGroupSlug = keyof typeof productGroupData;
export const productGroups: Record<ProductGroupSlug, ProductGroup> = productGroupData;
export const productGroupSlugs = Object.keys(productGroupData) as [ProductGroupSlug, ...ProductGroupSlug[]];
