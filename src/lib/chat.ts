/**
 * Chat trực tiếp với dược sĩ qua Supabase Realtime (tháng 10/2026) — khác hẳn "Hỏi đáp nhanh" dựng
 * sẵn (src/lib/faq.ts, so khớp từ khóa, không gửi lên đâu cả): đây là tin nhắn THẬT, 2 chiều, cập
 * nhật theo thời gian thực. Chỉ import trong thẻ <script> (chạy ở trình duyệt).
 *
 * Khách KHÔNG cần đăng ký/đăng nhập để chat — dùng "đăng nhập ẩn danh" của Supabase
 * (signInAnonymously(), cần chủ website tự bật ở Dashboard > Authentication > Sign In / Providers >
 * Anonymous Sign-Ins) để có `auth.uid()` thật, dùng cho RLS mà không lộ hội thoại của người này cho
 * người khác (khác với cách làm liều kiểu "ai cũng đọc được" nếu chỉ dựa vào 1 mã ngẫu nhiên lưu ở
 * localStorage mà không qua RLS thật). Khách đã đăng nhập thật (Google/email) thì dùng luôn phiên đó,
 * không tạo thêm tài khoản ẩn danh — hội thoại gắn vào đúng tài khoản thật của họ.
 */
import { supabase } from './supabase';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'customer' | 'admin';
  body: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  customer_user_id: string;
  customer_name: string | null;
  status: string;
  created_at: string;
  last_message_at: string;
}

/** Đảm bảo có phiên đăng nhập (thật hoặc ẩn danh) trước khi chat — gọi trước mọi thao tác khác. */
export async function ensureSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) return session;
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.session;
}

/** Lấy hội thoại "open" gần nhất của khách đang đăng nhập (thật/ẩn danh), tạo mới nếu chưa có. */
export async function getOrCreateConversation(customerName?: string): Promise<Conversation> {
  const session = await ensureSession();
  const userId = session!.user.id;

  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('*')
    .eq('customer_user_id', userId)
    .eq('status', 'open')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (findError) throw findError;
  if (existing) return existing as Conversation;

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({ customer_user_id: userId, customer_name: customerName ?? null })
    .select('*')
    .single();
  if (createError) throw createError;
  return created as Conversation;
}

export async function listMessages(conversationId: string): Promise<ChatMessage[]> {
  const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  if (error) throw error;
  return (data ?? []) as ChatMessage[];
}

export async function sendMessage(conversationId: string, sender: 'customer' | 'admin', body: string) {
  const trimmed = body.trim();
  if (!trimmed) return;
  const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender, body: trimmed });
  if (error) throw error;
}

/** Lắng nghe tin nhắn MỚI của 1 hội thoại theo thời gian thực. Trả về hàm hủy đăng ký. */
export function subscribeToMessages(conversationId: string, onInsert: (message: ChatMessage) => void): () => void {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      onInsert(payload.new as ChatMessage);
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

// ---- Dùng cho trang quản trị /admin/tin-nhan/ (chủ website) ----

export async function listConversationsForAdmin(): Promise<Conversation[]> {
  const { data, error } = await supabase.from('conversations').select('*').order('last_message_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Conversation[];
}

/** Lắng nghe hội thoại/tin nhắn mới TOÀN BỘ hộp thư (không giới hạn 1 hội thoại) — dùng cho trang quản trị. */
export function subscribeToInbox(onConversationChange: () => void, onMessageInsert: (message: ChatMessage) => void): () => void {
  const channel = supabase
    .channel('admin-inbox')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, onConversationChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => onMessageInsert(payload.new as ChatMessage))
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function isCurrentUserAdmin(): Promise<boolean> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return false;
  const { data, error } = await supabase.from('profiles').select('is_admin').eq('id', session.user.id).maybeSingle();
  if (error || !data) return false;
  return Boolean(data.is_admin);
}
