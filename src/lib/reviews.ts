/**
 * Đánh giá sản phẩm (có sao 1-5) và bình luận sản phẩm (chat tự do, không sao) — 2 luồng TÁCH RIÊNG
 * (tháng 10/2026, chủ website yêu cầu). Ai cũng đọc được, kể cả chưa đăng nhập; chỉ gửi mới cần đăng
 * nhập. Dùng chung cho MỌI sản phẩm qua `productSlug`. Xem docs/supabase-schema.sql mục "7." để biết
 * schema đầy đủ. Chỉ import trong thẻ <script> (chạy ở trình duyệt).
 */
import { supabase } from './supabase';

export interface ProductReview {
  id: string;
  product_slug: string;
  user_id: string;
  author_name: string;
  rating: number;
  body: string | null;
  admin_reply: string | null;
  admin_reply_by: string | null;
  admin_reply_at: string | null;
  created_at: string;
}

export interface ProductComment {
  id: string;
  product_slug: string;
  user_id: string;
  author_name: string;
  author_role: 'customer' | 'admin';
  body: string;
  parent_id: string | null;
  created_at: string;
}

export interface ReviewSummary {
  average: number;
  total: number;
  counts: Record<1 | 2 | 3 | 4 | 5, number>;
  commentTotal: number;
}

export async function fetchReviewSummary(productSlug: string): Promise<ReviewSummary> {
  const [{ data: ratings }, { count: commentTotal }] = await Promise.all([
    supabase.from('product_reviews').select('rating').eq('product_slug', productSlug),
    supabase.from('product_comments').select('id', { count: 'exact', head: true }).eq('product_slug', productSlug),
  ]);
  const counts: ReviewSummary['counts'] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  (ratings ?? []).forEach((row) => {
    const r = row.rating as 1 | 2 | 3 | 4 | 5;
    if (counts[r] !== undefined) counts[r] += 1;
    sum += row.rating as number;
  });
  const total = ratings?.length ?? 0;
  return { average: total ? sum / total : 0, total, counts, commentTotal: commentTotal ?? 0 };
}

export async function fetchReviews(productSlug: string, ratingFilter?: number): Promise<ProductReview[]> {
  let query = supabase.from('product_reviews').select('*').eq('product_slug', productSlug).order('created_at', { ascending: false });
  if (ratingFilter) query = query.eq('rating', ratingFilter);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as ProductReview[];
}

export async function submitReview(productSlug: string, rating: number, body: string, authorName: string): Promise<ProductReview> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Cần đăng nhập để gửi đánh giá.');
  const { data, error } = await supabase
    .from('product_reviews')
    .insert({ product_slug: productSlug, user_id: session.user.id, author_name: authorName, rating, body: body.trim() || null })
    .select('*')
    .single();
  if (error) throw error;
  return data as ProductReview;
}

export async function adminReplyToReview(reviewId: string, reply: string): Promise<void> {
  const { error } = await supabase.rpc('admin_reply_to_review', { p_review_id: reviewId, p_reply: reply });
  if (error) throw error;
}

export async function fetchComments(productSlug: string): Promise<ProductComment[]> {
  const { data, error } = await supabase.from('product_comments').select('*').eq('product_slug', productSlug).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ProductComment[];
}

/**
 * `parentId` (không bắt buộc): id của bình luận GỐC đang trả lời — để trống thì tạo bình luận gốc mới.
 * Trả lời của 1 trả lời vẫn truyền ĐÚNG id bình luận gốc ban đầu (không phải id của trả lời vừa bấm
 * "Trả lời"), để mọi lượt trả lời trong 1 nhánh nằm phẳng cùng chỗ — xem ProductReviews.astro.
 */
export async function submitComment(productSlug: string, body: string, authorName: string, isAdmin: boolean, parentId?: string): Promise<ProductComment> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) throw new Error('Cần đăng nhập để bình luận.');
  const trimmed = body.trim();
  if (!trimmed) throw new Error('Bình luận không được để trống.');
  const { data, error } = await supabase
    .from('product_comments')
    .insert({
      product_slug: productSlug,
      user_id: session.user.id,
      author_name: authorName,
      author_role: isAdmin ? 'admin' : 'customer',
      body: trimmed,
      parent_id: parentId ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as ProductComment;
}
