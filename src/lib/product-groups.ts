/**
 * Nhóm sản phẩm thực phẩm chức năng: nguồn duy nhất cho menu lớn ở đầu trang, menu bên trái, trang nhóm và kiểm tra frontmatter.
 * Thêm/đổi nhóm ở đây, các phần khác tự cập nhật. Thứ tự ở đây là thứ tự hiện trong menu.
 * Tên nhóm chỉ nên gọi theo hệ cơ quan hoặc đối tượng dùng, không gọi theo tên bệnh (tránh hiểu nhầm là thuốc chữa bệnh).
 */
import type { IconName } from './icon-names';

export interface ProductGroup {
  /** Icon đường nét hiện cạnh tên nhóm (xem GroupIcon.astro). */
  icon: IconName;
  name: string;
  description: string;
}

const productGroupData = {
  'vitamin-khoang-chat': {
    icon: 'citrus',
    name: 'Vitamin & khoáng chất',
    description: 'Thực phẩm bổ sung vitamin và khoáng chất cho chế độ ăn hằng ngày.',
  },
  'de-khang': {
    icon: 'shield',
    name: 'Đề kháng & miễn dịch',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức đề kháng của cơ thể.',
  },
  mat: {
    icon: 'eye',
    name: 'Mắt & thị lực',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe đôi mắt.',
  },
  'tieu-hoa': {
    icon: 'stomach',
    name: 'Tiêu hóa',
    description: 'Thực phẩm bổ sung như men vi sinh, chất xơ dành cho người quan tâm đến đường tiêu hóa.',
  },
  'than-kinh-nao': {
    icon: 'brain',
    name: 'Thần kinh & trí nhớ',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe thần kinh và não bộ.',
  },
  'lam-dep': {
    icon: 'sparkle',
    name: 'Hỗ trợ làm đẹp',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến làn da, mái tóc và móng.',
  },
  'duong-huyet': {
    icon: 'droplet',
    name: 'Đường huyết',
    description:
      'Thực phẩm bổ sung dành cho người quan tâm đến chuyển hóa đường. Người bị đái tháo đường cần hỏi bác sĩ trước khi dùng.',
  },
  'tim-mach': {
    icon: 'heart',
    name: 'Tim mạch',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe tim mạch.',
  },
  'xuong-khop': {
    icon: 'bone',
    name: 'Xương khớp',
    description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe xương và khớp.',
  },
  'phu-nu-me-bau': {
    icon: 'flower',
    name: 'Phụ nữ & mẹ bầu',
    description: 'Thực phẩm bổ sung dành cho phụ nữ, phụ nữ chuẩn bị mang thai và đang mang thai.',
  },
  'tre-em': {
    icon: 'baby',
    name: 'Trẻ em',
    description: 'Thực phẩm bổ sung dành cho trẻ em. Luôn hỏi bác sĩ, dược sĩ trước khi cho trẻ dùng.',
  },
} satisfies Record<string, ProductGroup>;

export type ProductGroupSlug = keyof typeof productGroupData;
export const productGroups: Record<ProductGroupSlug, ProductGroup> = productGroupData;
export const productGroupSlugs = Object.keys(productGroupData) as [ProductGroupSlug, ...ProductGroupSlug[]];
