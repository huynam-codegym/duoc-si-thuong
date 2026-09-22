/**
 * "Khu" bán hàng: Thực phẩm chức năng, Dược mỹ phẩm, Chăm sóc cá nhân, Thiết bị y tế.
 * Nguồn duy nhất cho menu lớn ở đầu trang, menu bên trái, trang khu/nhóm và kiểm tra frontmatter sản phẩm.
 * Mỗi khu có URL riêng `/<slug khu>/`. Thêm khu mới: thêm vào departmentData bên dưới, các phần khác tự cập nhật.
 * Tên nhóm chỉ nên gọi theo hệ cơ quan/công dụng, không gọi theo tên bệnh (tránh hiểu nhầm là thuốc chữa bệnh).
 *
 * Lưu ý: khu "Thuốc" KHÔNG có ở đây. Theo yêu cầu của chủ website (tháng 9/2026), mục "Thuốc" trên menu chỉ là
 * tên hiển thị khác của chuyên mục bài viết "Kiến thức về thuốc" (xem `categories.ts`), KHÔNG bán thuốc online.
 * Bán thuốc qua mạng ở Việt Nam cần giấy chứng nhận đủ điều kiện kinh doanh dược qua thương mại điện tử
 * (Luật Dược, Nghị định 54/2017/NĐ-CP sửa đổi); thuốc kê đơn không được quảng cáo/bán online. Không tự thêm
 * khu bán thuốc khi chưa có giấy phép và yêu cầu rõ ràng của chủ website.
 */
import type { IconName } from './icon-names';

export interface ProductGroup {
  /** Icon đường nét hiện cạnh tên nhóm (xem GroupIcon.astro). */
  icon: IconName;
  name: string;
  description: string;
}

export interface Department {
  name: string;
  description: string;
  groups: Record<string, ProductGroup>;
}

const departmentData = {
  'thuc-pham-chuc-nang': {
    name: 'Thực phẩm chức năng',
    description: 'Thực phẩm bổ sung theo nhu cầu sức khỏe: vitamin, khoáng chất, hỗ trợ tiêu hóa, tim mạch...',
    groups: {
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
    },
  },
  'duoc-my-pham': {
    name: 'Dược mỹ phẩm',
    description: 'Sản phẩm chăm sóc da theo tư vấn dược sĩ: làm sạch, dưỡng ẩm, chống nắng.',
    groups: {
      'cham-soc-da-mat': {
        icon: 'sparkle',
        name: 'Chăm sóc da mặt',
        description: 'Sản phẩm làm sạch, dưỡng da và phục hồi da mặt.',
      },
      'chong-nang': {
        icon: 'sun',
        name: 'Chống nắng',
        description: 'Kem và sản phẩm chống nắng bảo vệ da khỏi ánh nắng.',
      },
      'tri-mun-tham-nam': {
        icon: 'droplet',
        name: 'Trị mụn, thâm nám',
        description: 'Sản phẩm hỗ trợ làm sạch da mụn và làm mờ thâm nám.',
      },
      'duong-am-phuc-hoi': {
        icon: 'leaf',
        name: 'Dưỡng ẩm, phục hồi da',
        description: 'Sản phẩm cấp ẩm và phục hồi hàng rào bảo vệ da.',
      },
      'cham-soc-vung-mat-moi': {
        icon: 'eye',
        name: 'Chăm sóc vùng mắt, môi',
        description: 'Sản phẩm dành riêng cho vùng da quanh mắt và môi.',
      },
    },
  },
  'cham-soc-ca-nhan': {
    name: 'Chăm sóc cá nhân',
    description: 'Sản phẩm vệ sinh và chăm sóc cá nhân dùng hằng ngày cho cả gia đình.',
    groups: {
      've-sinh-rang-mieng': {
        icon: 'tooth',
        name: 'Vệ sinh răng miệng',
        description: 'Kem đánh răng, nước súc miệng và dụng cụ vệ sinh răng miệng.',
      },
      'cham-soc-toc': {
        icon: 'comb',
        name: 'Chăm sóc tóc',
        description: 'Dầu gội, dầu xả và sản phẩm chăm sóc tóc, da đầu.',
      },
      'sua-tam-xa-phong': {
        icon: 'droplet',
        name: 'Sữa tắm, xà phòng',
        description: 'Sản phẩm làm sạch cơ thể hằng ngày.',
      },
      've-sinh-phu-nu': {
        icon: 'flower',
        name: 'Vệ sinh phụ nữ',
        description: 'Dung dịch và sản phẩm vệ sinh dành cho phụ nữ.',
      },
      'khu-mui': {
        icon: 'wind',
        name: 'Khử mùi',
        description: 'Sản phẩm khử mùi và giữ cơ thể thơm mát.',
      },
    },
  },
  'thiet-bi-y-te': {
    name: 'Thiết bị y tế',
    description: 'Thiết bị và dụng cụ y tế dùng tại nhà: đo huyết áp, đo đường huyết, sơ cứu.',
    groups: {
      'may-do-huyet-ap': {
        icon: 'heart',
        name: 'Máy đo huyết áp',
        description: 'Máy đo huyết áp dùng tại nhà.',
      },
      'may-do-duong-huyet': {
        icon: 'droplet',
        name: 'Máy đo đường huyết',
        description: 'Máy và que thử đường huyết dùng tại nhà.',
      },
      'nhiet-ke': {
        icon: 'thermometer',
        name: 'Nhiệt kế',
        description: 'Nhiệt kế đo thân nhiệt cho cả gia đình.',
      },
      'khau-trang-sat-khuan': {
        icon: 'shield',
        name: 'Khẩu trang, sát khuẩn',
        description: 'Khẩu trang y tế và dung dịch sát khuẩn.',
      },
      'bang-gac-so-cuu': {
        icon: 'firstaid',
        name: 'Băng gạc, sơ cứu',
        description: 'Băng gạc và dụng cụ sơ cứu cơ bản tại nhà.',
      },
    },
  },
} satisfies Record<string, Department>;

export type DepartmentSlug = keyof typeof departmentData;
export const departments: Record<DepartmentSlug, Department> = departmentData;
export const departmentSlugs = Object.keys(departmentData) as [DepartmentSlug, ...DepartmentSlug[]];

/** Danh sách [slug nhóm, nhóm] của một khu. */
export function getProductGroups(department: DepartmentSlug): [string, ProductGroup][] {
  return Object.entries(departments[department].groups);
}
