import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { categorySlugs } from './lib/categories';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(categorySlugs),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    // Bắt buộc có ít nhất 1 nguồn tham khảo uy tín
    sources: z.array(z.object({ title: z.string(), url: z.string().url() })).min(1),
    // Người kiểm duyệt (dược sĩ/bác sĩ). Để trống = chưa được kiểm duyệt
    reviewedBy: z.string().default(''),
    // Mặc định là bản nháp cho đến khi được kiểm duyệt
    draft: z.boolean().default(true),
  }),
});

export const collections = { posts };
