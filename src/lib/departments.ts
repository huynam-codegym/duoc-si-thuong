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
  /**
   * Slug của các nhóm KHÁC nên "lồng" dưới nhóm này khi hiện ở **menu bên trái khu bán hàng**
   * (`ShopShell.astro`) — chủ website yêu cầu tháng 9/2026, để menu trái gọn lại thay vì liệt kê
   * phẳng hết mọi nhóm. Rê chuột (máy tính) hoặc bấm mũi tên (điện thoại/máy tính bảng) vào nhóm
   * cha mới hiện các nhóm con này. CHỈ ảnh hưởng cách hiện menu trái — trang nhóm, breadcrumb, menu
   * lớn ở đầu trang, "Danh mục [khu]" ở trang chủ, bộ lọc tìm kiếm... vẫn dùng danh sách `groups`
   * phẳng như cũ, không đổi gì (sản phẩm gắn `group` là slug nhóm con, không phải nhóm cha).
   * Nhóm con liệt kê ở đây sẽ TỰ ẨN khỏi danh sách phẳng ở menu trái (chỉ hiện lồng bên trong cha).
   */
  childGroups?: string[];
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
        childGroups: ['vitamin-tong-hop', 'canxi-vitamin-d', 'dau-ca-omega-3'],
      },
      'dau-ca-omega-3': {
        // Dùng lại icon của nhóm cha (vitamin-khoang-chat) — tháng 10/2026, theo quy ước chung của dự
        // án (xem mục "Thêm nhóm con mới ngay trong lúc thêm sản phẩm" trong CLAUDE.md).
        icon: 'citrus',
        name: 'Dầu cá - Omega 3',
        description: 'Thực phẩm bổ sung dầu cá, omega-3 (EPA, DHA) cho tim mạch, mắt và não bộ.',
      },
      'vitamin-tong-hop': {
        icon: 'citrus',
        name: 'Vitamin tổng hợp',
        description: 'Thực phẩm bổ sung nhiều loại vitamin và khoáng chất cùng lúc trong một sản phẩm.',
      },
      'de-khang': {
        icon: 'shield',
        name: 'Đề kháng & miễn dịch',
        description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức đề kháng của cơ thể.',
        childGroups: ['siro-de-khang'],
      },
      'siro-de-khang': {
        icon: 'shield',
        name: 'Siro hỗ trợ tăng đề kháng',
        description: 'Siro bổ sung beta-glucan, vitamin và khoáng chất giúp hỗ trợ tăng sức đề kháng, chủ yếu dành cho trẻ em.',
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
        childGroups: ['ho-tro-an-ngon', 'men-vi-sinh'],
      },
      'ho-tro-an-ngon': {
        icon: 'stomach',
        name: 'Hỗ trợ ăn ngon',
        description: 'Thực phẩm bổ sung dành cho trẻ biếng ăn, hấp thu kém, hỗ trợ tăng cường tiêu hóa.',
      },
      'men-vi-sinh': {
        icon: 'stomach',
        name: 'Men vi sinh',
        description: 'Thực phẩm bổ sung lợi khuẩn (probiotic) hỗ trợ cân bằng hệ vi sinh đường ruột.',
      },
      'gan-mat': {
        icon: 'liver',
        name: 'Gan - Mật',
        description: 'Thực phẩm bổ sung dành cho người quan tâm đến chức năng gan.',
      },
      'than-kinh-nao': {
        icon: 'brain',
        name: 'Thần kinh & trí nhớ',
        description: 'Thực phẩm bổ sung dành cho người quan tâm đến sức khỏe thần kinh và não bộ.',
        childGroups: ['ho-tro-giac-ngu', 'bo-nao-cai-thien-tri-nho'],
      },
      'ho-tro-giac-ngu': {
        icon: 'brain',
        name: 'Hỗ trợ giấc ngủ',
        description: 'Thực phẩm bổ sung dành cho người quan tâm đến chất lượng giấc ngủ.',
      },
      'bo-nao-cai-thien-tri-nho': {
        icon: 'brain',
        name: 'Bổ não - cải thiện trí nhớ',
        description: 'Thực phẩm bổ sung dành cho người quan tâm đến phát triển não bộ và trí nhớ.',
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
      'canxi-vitamin-d': {
        icon: 'bone',
        name: 'Canxi & Vitamin D',
        description: 'Thực phẩm bổ sung canxi, vitamin D và các khoáng chất giúp xương chắc khỏe.',
      },
      'sinh-ly-noi-tiet-to': {
        icon: 'flower',
        name: 'Sinh lý - Nội tiết tố',
        description: 'Thực phẩm bổ sung dành cho phụ nữ quan tâm đến cân bằng nội tiết tố, giai đoạn tiền mãn kinh và mãn kinh.',
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
    // 10 nhóm (tháng 9/2026, theo đúng ảnh menu Long Châu chủ website gửi) — thay cho 5 nhóm trước đó
    // (không tách riêng "Chăm sóc tóc" nữa vì ảnh mẫu không có mục này; muốn thêm lại thì tạo nhóm mới,
    // không cần sửa code khác). Đặt tên nhóm giữ nguyên như ảnh mẫu, không đổi ý.
    groups: {
      'ho-tro-tinh-duc': {
        icon: 'rings',
        name: 'Hỗ trợ tình dục',
        description: 'Sản phẩm hỗ trợ đời sống tình dục cho người trưởng thành.',
      },
      'thuc-pham-do-uong': {
        icon: 'cup',
        name: 'Thực phẩm - Đồ uống',
        description: 'Thực phẩm và đồ uống dùng hằng ngày cho cả gia đình.',
      },
      'cham-soc-rang-mieng': {
        icon: 'tooth',
        name: 'Chăm sóc răng miệng',
        description: 'Kem đánh răng, nước súc miệng và dụng cụ vệ sinh răng miệng.',
      },
      'tinh-dau-huong-lieu': {
        icon: 'vial',
        name: 'Tinh dầu & Hương liệu các loại',
        description: 'Tinh dầu, hương liệu dùng để thư giãn và tạo hương cho không gian sống.',
      },
      'thiet-bi-lam-dep': {
        icon: 'wand',
        name: 'Thiết bị làm đẹp',
        description: 'Thiết bị hỗ trợ chăm sóc da, tóc tại nhà.',
      },
      'cham-soc-vung-kin': {
        icon: 'flower',
        name: 'Chăm sóc vùng kín',
        description: 'Dung dịch và sản phẩm vệ sinh vùng kín.',
      },
      'cham-soc-me-va-be': {
        icon: 'baby',
        name: 'Chăm sóc mẹ và bé',
        description: 'Sản phẩm chăm sóc dành cho mẹ sau sinh và trẻ nhỏ.',
        // Nhóm con đầu tiên của khu Chăm sóc cá nhân (tháng 9/2026, chủ website yêu cầu): menu trái/
        // menu lớn chỉ hiện 1 dòng "Chăm sóc mẹ và bé", rê chuột mới hiện "Sữa tắm gội em bé" bên phải.
        childGroups: ['sua-tam-goi-em-be'],
      },
      'sua-tam-goi-em-be': {
        icon: 'droplet',
        name: 'Sữa tắm gội em bé',
        description: 'Sữa tắm gội dịu nhẹ dành cho trẻ sơ sinh và trẻ nhỏ.',
      },
      'ho-tro-dieu-tri-da': {
        icon: 'sparkle',
        name: 'Hỗ trợ điều trị da cơ thể',
        description: 'Sản phẩm hỗ trợ các vấn đề về da cơ thể như khô da, rạn da.',
      },
      'ta-bim': {
        icon: 'diaper',
        name: 'Tã - bỉm',
        description: 'Tã, bỉm cho trẻ em và người lớn.',
      },
      've-sinh-hang-ngay': {
        icon: 'droplet',
        name: 'Vệ sinh hàng ngày',
        description: 'Sữa tắm, xà phòng và sản phẩm vệ sinh cơ thể hằng ngày.',
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
