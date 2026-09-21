import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categories, categorySlugs } from './lib/categories';

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

export const collections = { posts };
