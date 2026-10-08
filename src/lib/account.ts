/**
 * Lấy tên hiển thị của khách đang đăng nhập — dùng cho các khung cần hiện tên khách (đánh giá, bình
 * luận sản phẩm...). Cùng logic với resolveDisplayName() trong Header.astro (ưu tiên tên Google, rồi
 * họ tên trong hồ sơ, cuối cùng mới tới phần trước "@" của email) nhưng tách ra đây để component MỚI
 * dùng lại được qua import — Header.astro/tai-khoan.astro giữ nguyên bản riêng của mình, không đổi.
 * Chỉ import trong thẻ <script> (chạy ở trình duyệt).
 */
import { supabase } from './supabase';

export async function resolveDisplayName(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Promise<string> {
  const metaName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  if (typeof metaName === 'string' && metaName.trim()) return metaName.trim();
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
  if (profile?.full_name?.trim()) return profile.full_name.trim();
  return user.email?.split('@')[0] ?? 'Khách';
}
