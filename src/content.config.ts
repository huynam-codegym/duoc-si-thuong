import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories, categorySlugs } from './lib/categories';
import { productGroupSlugs } from './lib/product-groups';

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

// Sản phẩm thực phẩm chức năng (khu bán hàng, tách riêng khỏi bài viết kiến thức)
const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      // Mô tả ngắn hiện ở thẻ sản phẩm và đầu trang chi tiết (1-2 câu, không hứa hẹn chữa bệnh)
      summary: z.string(),
      group: z.enum(productGroupSlugs),
      // Giá bán (VNĐ). Bỏ trống thì hiện "Liên hệ"
      price: z.number().int().positive().optional(),
      // Quy cách, ví dụ "Hộp 30 viên"
      unit: z.string().optional(),
      brand: z.string().optional(),
      origin: z.string().optional(),
      // Dạng bào chế (ví dụ "Viên nang mềm") và thành phần đúng như trên nhãn, hiện trong bảng thông tin ở đầu trang
      dosageForm: z.string().optional(),
      ingredients: z.string().optional(),
      // Ảnh sản phẩm (đặt trong src/assets/products/<tên>/), nên vuông, nền sáng
      image: image(),
      imageAlt: z.string().min(1),
      // Số tiếp nhận hồ sơ công bố sản phẩm và số giấy xác nhận nội dung quảng cáo (nếu có); hiện ở trang chi tiết
      publicationNo: z.string().optional(),
      adConfirmationNo: z.string().optional(),
      updatedAt: z.coerce.date(),
      // Mặc định là bản nháp: chỉ thấy khi chạy npm run dev
      draft: z.boolean().default(true),
    }),
});

export const collections = { posts, products };
