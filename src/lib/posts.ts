import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategorySlug } from './categories';

export type Post = CollectionEntry<'posts'>;

/** Bài đã được kiểm duyệt và đủ điều kiện đăng. */
export function isPublishable(post: Post): boolean {
  return !post.data.draft && post.data.reviewedBy.trim() !== '';
}

/**
 * Trả về các bài viết, mới cập nhật nhất trước.
 * Khi chạy `npm run dev` hiện cả bản nháp để xem thử;
 * khi `npm run build` chỉ giữ bài đã kiểm duyệt.
 */
export async function getPosts(category?: CategorySlug): Promise<Post[]> {
  const all = await getCollection('posts');
  return all
    .filter((post) => import.meta.env.DEV || isPublishable(post))
    .filter((post) => !category || post.data.category === category)
    .sort((a, b) => b.data.updatedAt.valueOf() - a.data.updatedAt.valueOf());
}

/**
 * Bỏ dấu tiếng Việt (kể cả đ/Đ). Pagefind tự bỏ dấu thanh và dấu mũ nhưng không xem "đ" là "d",
 * nên gõ "dot quy" sẽ không ra "đột quỵ". Bản không dấu này được thêm vào chỉ mục tìm kiếm.
 */
export function foldVietnamese(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
