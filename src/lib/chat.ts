/**
 * Chat trực tiếp với dược sĩ qua Supabase Realtime (tháng 10/2026) — tin nhắn THẬT, 2 chiều, cập nhật
 * theo thời gian thực, có đính kèm ảnh/file/tin nhắn thoại và trạng thái "đã xem". Chỉ import trong
 * thẻ <script> (chạy ở trình duyệt).
 *
 * Khách KHÔNG cần đăng ký/đăng nhập để chat — dùng "đăng nhập ẩn danh" của Supabase
 * (signInAnonymously(), cần chủ website tự bật ở Dashboard > Authentication > Sign In / Providers >
 * Anonymous Sign-Ins) để có `auth.uid()` thật, dùng cho RLS mà không lộ hội thoại của người này cho
 * người khác (khác với cách làm liều kiểu "ai cũng đọc được" nếu chỉ dựa vào 1 mã ngẫu nhiên lưu ở
 * localStorage mà không qua RLS thật). Khách đã đăng nhập thật (Google/email) thì dùng luôn phiên đó,
 * không tạo thêm tài khoản ẩn danh — hội thoại gắn vào đúng tài khoản thật của họ.
 */
import { supabase } from './supabase';

export type AttachmentType = 'image' | 'file' | 'audio';

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender: 'customer' | 'admin';
  body: string;
  created_at: string;
  read_at: string | null;
  attachment_url: string | null;
  attachment_type: AttachmentType | null;
  attachment_name: string | null;
}

export interface Conversation {
  id: string;
  customer_user_id: string;
  customer_name: string | null;
  status: string;
  created_at: string;
  last_message_at: string;
}

export interface Attachment {
  url: string; // đường dẫn trong Storage (KHÔNG phải URL công khai — bucket riêng tư, xem getAttachmentUrl())
  type: AttachmentType;
  name: string;
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

/**
 * Tải 1 file (ảnh/tài liệu/ghi âm) lên Storage, trả về đường dẫn để gắn vào tin nhắn (sendMessage).
 * Đường dẫn dạng "<conversationId>/<tên ngẫu nhiên>.<đuôi file>" — policy Storage dựa vào
 * conversationId ở đầu đường dẫn để biết ai được tải lên/xem (xem docs/supabase-schema.sql mục 6c).
 */
export async function uploadAttachment(conversationId: string, file: File, type: AttachmentType): Promise<Attachment> {
  await ensureSession();
  const fallbackExt = type === 'audio' ? 'webm' : 'bin';
  const ext = (file.name.split('.').pop() || fallbackExt).toLowerCase().replace(/[^a-z0-9]/g, '') || fallbackExt;
  const path = `${conversationId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('chat-attachments').upload(path, file, { contentType: file.type || undefined });
  if (error) throw error;
  return { url: path, type, name: file.name || `tin-nhan-thoai.${ext}` };
}

/**
 * Đổi đường dẫn Storage đã lưu trong tin nhắn thành URL xem được thật sự — bucket "chat-attachments"
 * là bucket RIÊNG TƯ nên không dùng getPublicUrl() được, phải xin "signed URL" có hạn dùng (7 ngày,
 * đủ dài cho việc xem lại lịch sử chat bình thường). Gọi lại hàm này mỗi lần hiện tin nhắn (không lưu
 * URL cố định vào đâu cả) để không bao giờ dùng phải URL đã hết hạn.
 */
export async function getAttachmentUrl(path: string): Promise<string | null> {
  const { data, error } = await supabase.storage.from('chat-attachments').createSignedUrl(path, 60 * 60 * 24 * 7);
  if (error) return null;
  return data.signedUrl;
}

export async function sendMessage(
  conversationId: string,
  sender: 'customer' | 'admin',
  body: string,
  customerName?: string | null,
  attachment?: Attachment,
): Promise<ChatMessage | null> {
  const trimmed = body.trim();
  if (!trimmed && !attachment) return null;
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender,
      body: trimmed,
      attachment_url: attachment?.url ?? null,
      attachment_type: attachment?.type ?? null,
      attachment_name: attachment?.name ?? null,
    })
    .select('*')
    .single();
  if (error) throw error;

  // Báo email cho chủ nhà thuốc khi KHÁCH gửi tin — đây là cách DUY NHẤT để biết có tin nhắn mới nếu
  // không đang mở sẵn trang /admin/tin-nhan/ (trang đó chỉ tự cập nhật real-time lúc đang mở). Tối đa
  // 1 email/giờ/hội thoại — Edge Function tự kiểm tra (không phải ở đây, tránh sai nếu nhiều tab/trình
  // duyệt cùng gửi), xem supabase/functions/notify-chat-message. Không chặn việc gửi tin nếu email lỗi
  // (fire-and-forget) — chat vẫn phải hoạt động bình thường dù email tạm trục trặc.
  if (sender === 'customer') {
    supabase.functions.invoke('notify-chat-message', { body: { conversationId, customerName: customerName ?? null, body: trimmed || `[${attachmentLabel(attachment)}]` } }).catch(() => {
      // Bỏ qua lỗi — chỉ là báo thêm, không phải luồng chính.
    });
  }

  return data as ChatMessage;
}

function attachmentLabel(attachment?: Attachment): string {
  if (!attachment) return '';
  if (attachment.type === 'image') return 'Hình ảnh';
  if (attachment.type === 'audio') return 'Tin nhắn thoại';
  return 'Tệp đính kèm';
}

/** Đánh dấu mọi tin nhắn của ADMIN trong hội thoại là "đã xem" (khách đang xem khung chat). */
export async function markReadByCustomer(conversationId: string) {
  const { error } = await supabase.rpc('mark_messages_read_by_customer', { p_conversation_id: conversationId });
  if (error) console.error('Không đánh dấu đã xem được:', error);
}

/** Đánh dấu mọi tin nhắn của KHÁCH trong hội thoại là "đã xem" (admin đang xem hội thoại này). */
export async function markReadByAdmin(conversationId: string) {
  const { error } = await supabase.rpc('mark_messages_read_by_admin', { p_conversation_id: conversationId });
  if (error) console.error('Không đánh dấu đã xem được:', error);
}

/**
 * Lắng nghe tin nhắn MỚI (và cập nhật, ví dụ đổi trạng thái đã xem) của 1 hội thoại theo thời gian
 * thực. Trả về hàm hủy đăng ký.
 */
export function subscribeToMessages(conversationId: string, onInsert: (message: ChatMessage) => void, onUpdate?: (message: ChatMessage) => void): () => void {
  const channel = supabase
    .channel(`messages:${conversationId}`)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      onInsert(payload.new as ChatMessage);
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` }, (payload) => {
      onUpdate?.(payload.new as ChatMessage);
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

/** Lắng nghe hội thoại/tin nhắn mới hoặc đổi trạng thái TOÀN BỘ hộp thư — dùng cho trang quản trị. */
export function subscribeToInbox(onConversationChange: () => void, onMessageInsert: (message: ChatMessage) => void, onMessageUpdate?: (message: ChatMessage) => void): () => void {
  const channel = supabase
    .channel('admin-inbox')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'conversations' }, onConversationChange)
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => onMessageInsert(payload.new as ChatMessage))
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'messages' }, (payload) => onMessageUpdate?.(payload.new as ChatMessage))
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
