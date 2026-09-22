/**
 * Dữ liệu cho 3 trang "Tra cứu": tra-cuu-thuoc (theo hoạt chất, có nhóm), tra-cuu-duoc-chat (danh sách hoạt
 * chất A-Z), tra-cuu-duoc-lieu (danh sách dược liệu A-Z). Chủ website yêu cầu (tháng 9/2026, theo mẫu Long
 * Châu gửi) thay cho danh sách nhóm bài viết "Kiến thức về thuốc" trên menu (tạm ẩn, xem Header.astro).
 *
 * QUAN TRỌNG — vì sao chỉ có TÊN, không có trang chi tiết từng chất:
 * - Đây là tên HOẠT CHẤT/DƯỢC LIỆU (tên chung, tên khoa học), KHÔNG phải tên biệt dược/thương hiệu — đúng
 *   quy tắc "chỉ dùng tên hoạt chất" đã có trong CLAUDE.md, tránh giống quảng cáo thuốc theo tên thương hiệu
 *   khi site chưa có giấy phép kinh doanh dược qua thương mại điện tử.
 * - Danh sách bên dưới chỉ là VÍ DỤ để lên giao diện (chủ website đồng ý dùng tạm để xem giao diện, tháng
 *   9/2026), gồm các hoạt chất/dược liệu phổ biến, không kèm liều dùng/chỉ định/chống chỉ định — vì tôi
 *   không có kho dữ liệu dược đầy đủ và không tự bịa thông tin y khoa (nguyên tắc 1, 10 trong CLAUDE.md).
 *   Vì vậy mỗi tên chưa có TRANG CHI TIẾT riêng; bấm vào một tên (ở trang tra cứu hay ở menu lớn) sẽ
 *   chạy TÌM KIẾM tên đó trên toàn site (`/tim-kiem/?q=...`, xem `AzLookup.astro`/`Header.astro`) — ra
 *   bài viết nào có nhắc tới tên đó (nếu có), thay vì mở một trang trống hay 404.
 * - Muốn có trang chi tiết từng hoạt chất/dược liệu (liều dùng, chống chỉ định...): cần chủ website cung cấp
 *   nội dung có nguồn (Dược thư Quốc gia Việt Nam, DrugBank...) để viết đúng như một bài kiến thức về thuốc,
 *   không thể tự sinh hàng loạt.
 */

export interface IngredientCategory {
  slug: string;
  name: string;
  icon: 'bacteria' | 'heart' | 'brain' | 'stomach';
}

export const ingredientCategories: IngredientCategory[] = [
  { slug: 'khang-sinh-khang-nam', name: 'Kháng sinh & kháng nấm', icon: 'bacteria' },
  { slug: 'tim-mach', name: 'Tim mạch', icon: 'heart' },
  { slug: 'than-kinh', name: 'Thần kinh', icon: 'brain' },
  { slug: 'tieu-hoa-gan-mat', name: 'Tiêu hóa & gan mật', icon: 'stomach' },
];

export interface Ingredient {
  name: string;
  category: string; // slug trong ingredientCategories
}

// Tên hoạt chất (INN - tên chung quốc tế), KHÔNG phải tên biệt dược. Ví dụ minh họa, chưa đầy đủ.
export const activeIngredients: Ingredient[] = [
  { name: 'Amoxicillin', category: 'khang-sinh-khang-nam' },
  { name: 'Azithromycin', category: 'khang-sinh-khang-nam' },
  { name: 'Cephalexin', category: 'khang-sinh-khang-nam' },
  { name: 'Ciprofloxacin', category: 'khang-sinh-khang-nam' },
  { name: 'Clarithromycin', category: 'khang-sinh-khang-nam' },
  { name: 'Doxycycline', category: 'khang-sinh-khang-nam' },
  { name: 'Fluconazole', category: 'khang-sinh-khang-nam' },
  { name: 'Metronidazole', category: 'khang-sinh-khang-nam' },
  { name: 'Amlodipine', category: 'tim-mach' },
  { name: 'Atorvastatin', category: 'tim-mach' },
  { name: 'Bisoprolol', category: 'tim-mach' },
  { name: 'Clopidogrel', category: 'tim-mach' },
  { name: 'Enalapril', category: 'tim-mach' },
  { name: 'Furosemide', category: 'tim-mach' },
  { name: 'Losartan', category: 'tim-mach' },
  { name: 'Simvastatin', category: 'tim-mach' },
  { name: 'Gabapentin', category: 'than-kinh' },
  { name: 'Levodopa', category: 'than-kinh' },
  { name: 'Sertraline', category: 'than-kinh' },
  { name: 'Amitriptyline', category: 'than-kinh' },
  { name: 'Diazepam', category: 'than-kinh' },
  { name: 'Domperidone', category: 'tieu-hoa-gan-mat' },
  { name: 'Esomeprazole', category: 'tieu-hoa-gan-mat' },
  { name: 'Omeprazole', category: 'tieu-hoa-gan-mat' },
  { name: 'Ranitidine', category: 'tieu-hoa-gan-mat' },
  { name: 'Loperamide', category: 'tieu-hoa-gan-mat' },
  { name: 'Silymarin', category: 'tieu-hoa-gan-mat' },
];

// Danh sách đầy đủ hơn cho trang "Tra cứu dược chất" (gồm cả nhóm giảm đau/hạ sốt, dị ứng, vitamin... không chỉ 4 nhóm trên)
export const allActiveIngredients: string[] = [
  ...activeIngredients.map((item) => item.name),
  'Paracetamol',
  'Ibuprofen',
  'Diclofenac',
  'Aspirin (Acid acetylsalicylic)',
  'Loratadine',
  'Cetirizine',
  'Chlorpheniramine',
  'Dextromethorphan',
  'Salbutamol',
  'Metformin',
  'Gliclazide',
  'Insulin',
  'Levothyroxine',
  'Prednisolone',
  'Dexamethasone',
  'Vitamin C (Acid ascorbic)',
  'Vitamin B12 (Cyanocobalamin)',
  'Kẽm gluconat',
  'Sắt (II) sulfat',
  'Acid folic',
].sort((a, b) => a.localeCompare(b, 'vi'));

// Dược liệu (tên thường dùng trong y học cổ truyền Việt Nam), ví dụ minh họa
export const herbalMaterials: string[] = [
  'Atiso',
  'Bạc hà',
  'Bồ công anh',
  'Cam thảo',
  'Cỏ mực (Nhọ nồi)',
  'Cúc hoa',
  'Diếp cá',
  'Đinh lăng',
  'Đương quy',
  'Gừng',
  'Hoài sơn',
  'Hoàng kỳ',
  'Ích mẫu',
  'Kim ngân hoa',
  'Nghệ',
  'Rau má',
  'Sài đất',
  'Tam thất',
  'Trần bì',
  'Xuyên khung',
].sort((a, b) => a.localeCompare(b, 'vi'));
