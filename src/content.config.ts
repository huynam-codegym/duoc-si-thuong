import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories, categorySlugs } from './lib/categories';
import { departments, departmentSlugs } from './lib/departments';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        category: z.enum(categorySlugs),
        // Nhóm con trong chuyên mục (ví dụ nhóm thuốc "khang-sinh"). Phải khai báo trong src/lib/categories.ts
        subcategory: z.string().optional(),
        publishedAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
        // Ảnh đại diện của bài (đặt trong src/assets/posts/<tên-bài>/). Không bắt buộc.
        cover: image().optional(),
        // Mô tả ảnh cho người dùng đọc màn hình và công cụ tìm kiếm. Bắt buộc khi có `cover`.
        coverAlt: z.string().optional(),
        // Nguồn hoặc tác giả ảnh, hiện dưới ảnh. Ví dụ: "Đồ họa: Dược Sĩ Thương. Số liệu: WHO"
        coverCredit: z.string().optional(),
        // Bắt buộc có ít nhất 1 nguồn tham khảo uy tín
        sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
        // Người kiểm duyệt (dược sĩ/bác sĩ). Để trống = chưa được kiểm duyệt
        reviewedBy: z.string().default(''),
        // Mặc định là bản nháp cho đến khi được kiểm duyệt
        draft: z.boolean().default(true),
      })
      .refine((post) => !post.subcategory || post.subcategory in (categories[post.category].groups ?? {}), {
        message: 'subcategory không có trong chuyên mục này. Xem danh sách nhóm ở src/lib/categories.ts',
        path: ['subcategory'],
      })
      .refine((post) => !post.cover || Boolean(post.coverAlt?.trim()), {
        message: 'Bài có ảnh đại diện (cover) thì bắt buộc điền coverAlt (mô tả ảnh)',
        path: ['coverAlt'],
      }),
});

// Sản phẩm bán hàng (khu Thực phẩm chức năng, Dược mỹ phẩm, Chăm sóc cá nhân, Thiết bị y tế), tách riêng khỏi bài viết kiến thức
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z
      .object({
        name: z.string(),
        // Mô tả ngắn hiện ở thẻ sản phẩm và đầu trang chi tiết (1-2 câu, không hứa hẹn chữa bệnh)
        summary: z.string(),
        // Khu bán hàng. Xem danh sách khu và nhóm ở src/lib/departments.ts
        department: z.enum(departmentSlugs),
        group: z.string(),
        // Giá bán (VNĐ). Bỏ trống thì hiện "Liên hệ"
        price: z.number().int().positive().optional(),
        // Quy cách, ví dụ "Hộp 30 viên"
        unit: z.string().optional(),
        brand: z.string().optional(),
        // Xuất xứ (bắt buộc từ tháng 9/2026, theo yêu cầu chủ website): hiện thành nhãn cờ ở góc ảnh
        // thẻ sản phẩm (ProductCard, xem src/lib/flags.ts) và dòng "Xuất xứ" ở trang chi tiết.
        origin: z.string().min(1, 'Sản phẩm phải điền xuất xứ (origin)'),
        // Dạng bào chế (ví dụ "Viên nang mềm") và thành phần đúng như trên nhãn, hiện trong bảng thông tin ở đầu trang
        dosageForm: z.string().optional(),
        ingredients: z.string().optional(),
        // Ảnh sản phẩm (đặt trong src/assets/products/<tên>/), nên vuông, nền sáng
        image: image(),
        imageAlt: z.string().min(1),
        // Ảnh phụ (không bắt buộc): thêm góc chụp khác, ảnh cận cảnh... Cùng dùng chung imageAlt.
        // Trang chi tiết hiện thành dải ảnh nhỏ bên dưới ảnh chính, bấm để đổi ảnh chính.
        gallery: z.array(image()).optional(),
        // Video ngắn giới thiệu sản phẩm (không bắt buộc): liên kết tới video CÓ THẬT đã đăng ở nơi
        // khác (Facebook, YouTube, TikTok...) — site tĩnh, không tự lưu trữ video. Hiện làm ảnh ĐẦU
        // TIÊN trong dải ảnh nhỏ ở trang chi tiết (trước cả ảnh sản phẩm), có biểu tượng ▶ đè lên;
        // bấm vào mở video ở tab mới, không phát trong trang (không nhúng mã bên thứ ba). Cần cả
        // `videoThumbnail` (ảnh đại diện) vì không tự lấy được khung hình đầu video từ các mạng xã
        // hội (cần đăng nhập, link ảnh cũng hết hạn) — xem cách làm tương tự ở src/lib/videos.ts.
        video: z.string().url().optional(),
        videoThumbnail: image().optional(),
        // Số tiếp nhận hồ sơ công bố sản phẩm và số giấy xác nhận nội dung quảng cáo (nếu có); hiện ở trang chi tiết
        publicationNo: z.string().optional(),
        adConfirmationNo: z.string().optional(),
        updatedAt: z.coerce.date(),
        // Mặc định là bản nháp: chỉ thấy khi chạy npm run dev
        draft: z.boolean().default(true),
      })
      .refine((product) => product.group in departments[product.department].groups, {
        message: 'group không có trong khu (department) này. Xem danh sách nhóm ở src/lib/departments.ts',
        path: ['group'],
      })
      .refine((product) => !product.video || Boolean(product.videoThumbnail), {
        message: 'Sản phẩm có video thì bắt buộc có videoThumbnail (ảnh đại diện video)',
        path: ['videoThumbnail'],
      }),
});

export const collections = { posts, products };
