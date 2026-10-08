-- Chạy TOÀN BỘ file này 1 lần trong Supabase Dashboard > SQL Editor > New query > Run.
-- Tạo 2 bảng: hồ sơ khách hàng (profiles) và đơn hàng (orders), kèm Row Level Security (RLS)
-- để mỗi khách chỉ xem/sửa được dữ liệu của chính mình — không ai xem được dữ liệu người khác,
-- kể cả khi biết khóa "anon public" dùng ở trình duyệt.

-- 1. Hồ sơ khách hàng: mở rộng thêm cho auth.users (Supabase Auth tự quản lý email/mật khẩu,
--    KHÔNG lưu lại ở đây). id trùng với id tài khoản đăng nhập.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  address text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Khách chỉ xem hồ sơ của mình"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Khách chỉ sửa hồ sơ của mình"
  on public.profiles for update
  using (auth.uid() = id);

-- Tự tạo 1 dòng hồ sơ trống ngay khi có tài khoản đăng ký mới
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. Đơn hàng: lưu lại đơn khách đã đặt (chỉ khi khách đã đăng nhập lúc đặt hàng).
-- customer_name/phone/address là NGƯỜI NHẬN hàng; orderer_* là người đặt (có thể khác người nhận,
-- ví dụ đặt hộ người thân).
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  payment_method text not null default 'cod',
  items jsonb not null,
  total integer,
  status text not null default 'moi',
  orderer_name text,
  orderer_phone text,
  orderer_email text,
  hide_product_name boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "Khách chỉ xem đơn hàng của mình"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Khách chỉ tạo đơn hàng cho chính mình"
  on public.orders for insert
  with check (auth.uid() = user_id);

-- 3. CHỈ CẦN CHẠY nếu bảng orders đã tạo TỪ TRƯỚC tháng 9/2026 (đã chạy phần "2." ở trên rồi, giờ
-- thêm 4 cột mới: tách "Thông tin người đặt" và tùy chọn ẩn tên sản phẩm khi giao hàng). Nếu đang
-- chạy TOÀN BỘ file này lần đầu thì bỏ qua đoạn này — "create table" ở trên đã có sẵn 4 cột rồi,
-- chạy lại cũng không sao (add column if not exists) nhưng thừa.
alter table public.orders
  add column if not exists orderer_name text,
  add column if not exists orderer_phone text,
  add column if not exists orderer_email text,
  add column if not exists hide_product_name boolean not null default false;

-- 4. Chat trực tiếp với dược sĩ (tháng 10/2026) — khác hẳn khung "Hỏi đáp nhanh" dựng sẵn (câu hỏi có
-- sẵn, so khớp từ khóa, không gửi lên đâu cả): đây là tin nhắn THẬT, 2 chiều, cập nhật theo thời gian
-- thực qua Supabase Realtime. Khách (kể cả CHƯA đăng nhập) dùng "đăng nhập ẩn danh"
-- (supabase.auth.signInAnonymously(), xem src/lib/chat.ts) để có auth.uid() thật dùng cho RLS mà
-- không cần form đăng ký — khách đã đăng nhập thật (Google/email) thì hội thoại gắn vào tài khoản
-- thật luôn, không tạo thêm tài khoản ẩn danh. Chủ website xem/trả lời ở trang /admin/tin-nhan/.

-- Đánh dấu tài khoản dược sĩ/chủ website — CHỈ chủ website tự bật is_admin=true cho ĐÚNG tài khoản
-- của mình sau khi đăng nhập lần đầu (Supabase Dashboard > Table Editor > profiles > sửa dòng của
-- mình), không tự thêm tài khoản admin nào khác qua code.
alter table public.profiles add column if not exists is_admin boolean not null default false;

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_user_id uuid not null references auth.users (id) on delete cascade,
  customer_name text,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now()
);

alter table public.conversations enable row level security;

create policy "Khách xem hội thoại của mình"
  on public.conversations for select
  using (auth.uid() = customer_user_id);

create policy "Khách tạo hội thoại của mình"
  on public.conversations for insert
  with check (auth.uid() = customer_user_id);

create policy "Admin xem mọi hội thoại"
  on public.conversations for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admin sửa hội thoại (đổi trạng thái đóng/mở)"
  on public.conversations for update
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender text not null check (sender in ('customer', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.messages enable row level security;

create policy "Khách xem tin nhắn hội thoại của mình"
  on public.messages for select
  using (exists (select 1 from public.conversations c where c.id = conversation_id and c.customer_user_id = auth.uid()));

create policy "Khách gửi tin nhắn vào hội thoại của mình"
  on public.messages for insert
  with check (sender = 'customer' and exists (select 1 from public.conversations c where c.id = conversation_id and c.customer_user_id = auth.uid()));

create policy "Admin xem mọi tin nhắn"
  on public.messages for select
  using (exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

create policy "Admin gửi tin nhắn trả lời"
  on public.messages for insert
  with check (sender = 'admin' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- Tự cập nhật last_message_at của hội thoại mỗi khi có tin nhắn mới — dùng để sắp xếp hộp thư admin
-- theo hội thoại mới nhất lên đầu, không phải tự JOIN/MAX() mỗi lần hiện danh sách.
create function public.touch_conversation_last_message()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

create trigger on_message_insert
  after insert on public.messages
  for each row execute procedure public.touch_conversation_last_message();

-- 5. BẮT BUỘC làm thêm sau khi chạy xong SQL ở trên — Supabase KHÔNG tự bật realtime cho bảng mới tạo.
-- Thiếu bước này, tin nhắn vẫn lưu được vào database bình thường nhưng KHÔNG tự hiện ra ngay ở phía
-- bên kia — phải tự tải lại trang mới thấy. Làm bằng SQL (1 dòng, chạy ngay trong file này cũng được):
alter publication supabase_realtime add table public.conversations, public.messages;
-- (Cách khác, không bắt buộc: Supabase Dashboard > Database > Replication > bật công tắc Realtime cho
-- 2 bảng "conversations" và "messages" — làm đúng 1 trong 2 cách là đủ, không cần làm cả hai.)

-- 6. Đính kèm ảnh/file/tin nhắn thoại, trạng thái "đã xem", và báo email tối đa 1 lần/giờ (tháng
-- 10/2026) — xem CLAUDE.md mục "Nhắn tin trực tiếp cho dược sĩ" để biết cách dùng đầy đủ.

-- 6a. Báo email tối đa 1 lần/giờ/hội thoại: notify-chat-message (Edge Function) tự đọc/ghi cột này
-- bằng khóa service_role (bỏ qua RLS) — không cần policy nào cho cột này.
alter table public.conversations add column if not exists last_notified_at timestamptz;

-- 6b. Đính kèm + đã xem: attachment_url lưu ĐƯỜNG DẪN trong Storage (không phải URL công khai, vì
-- bucket chat-attachments ở dưới là bucket RIÊNG TƯ — xem getAttachmentUrl() trong src/lib/chat.ts,
-- tạo "signed URL" có hạn dùng mỗi lần hiện tin nhắn thay vì lưu URL cố định).
alter table public.messages
  add column if not exists attachment_url text,
  add column if not exists attachment_type text check (attachment_type in ('image', 'file', 'audio')),
  add column if not exists attachment_name text,
  add column if not exists read_at timestamptz;

-- Đánh dấu "đã xem" qua 2 hàm riêng (KHÔNG cấp quyền UPDATE trực tiếp trên bảng messages cho khách
-- hàng/admin) — mỗi hàm chỉ cho phép sửa đúng 1 cột read_at, đúng chiều (khách chỉ đánh dấu tin của
-- ADMIN là đã xem, admin chỉ đánh dấu tin của KHÁCH là đã xem), không ai sửa được nội dung tin nhắn
-- của người khác qua đường này.
create function public.mark_messages_read_by_customer(p_conversation_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.messages set read_at = now()
  where conversation_id = p_conversation_id
    and sender = 'admin'
    and read_at is null
    and exists (select 1 from public.conversations c where c.id = p_conversation_id and c.customer_user_id = auth.uid());
end;
$$;

create function public.mark_messages_read_by_admin(p_conversation_id uuid)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  update public.messages set read_at = now()
  where conversation_id = p_conversation_id
    and sender = 'customer'
    and read_at is null
    and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
end;
$$;

grant execute on function public.mark_messages_read_by_customer(uuid) to authenticated;
grant execute on function public.mark_messages_read_by_admin(uuid) to authenticated;

-- 6c. Nơi lưu file ảnh/file/tin nhắn thoại — bucket RIÊNG TƯ (public = false): chỉ đúng khách của hội
-- thoại đó hoặc admin mới tải lên/xem được, qua policy khớp "thư mục gốc" của đường dẫn file với
-- conversation_id (đường dẫn dạng "<conversation_id>/<tên-file-ngẫu-nhiên>.<đuôi>", xem
-- uploadAttachment() trong src/lib/chat.ts). Giới hạn 15MB/file, chỉ nhận vài định dạng phổ biến —
-- đổi `allowed_mime_types` nếu cần thêm định dạng khác.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-attachments',
  'chat-attachments',
  false,
  15728640,
  array[
    'image/jpeg', 'image/png', 'image/webp', 'image/gif',
    'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/mp4', 'audio/wav',
    'application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ]
)
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Khách tải lên đính kèm hội thoại của mình"
  on storage.objects for insert
  with check (
    bucket_id = 'chat-attachments'
    and exists (select 1 from public.conversations c where c.id::text = (storage.foldername(name))[1] and c.customer_user_id = auth.uid())
  );

create policy "Khách xem đính kèm hội thoại của mình"
  on storage.objects for select
  using (
    bucket_id = 'chat-attachments'
    and exists (select 1 from public.conversations c where c.id::text = (storage.foldername(name))[1] and c.customer_user_id = auth.uid())
  );

create policy "Admin tải lên và xem mọi đính kèm"
  on storage.objects for all
  using (bucket_id = 'chat-attachments' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
  with check (bucket_id = 'chat-attachments' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true));

-- 7. Đánh giá sản phẩm (có sao) và bình luận sản phẩm (tháng 10/2026) — 2 luồng TÁCH RIÊNG theo yêu cầu
-- chủ website: "Đánh giá" luôn có sao (1-5, bắt buộc) + chữ (không bắt buộc), dược sĩ trả lời được
-- NGAY DƯỚI mỗi đánh giá (1 lượt trả lời/đánh giá, đủ dùng cho quy mô site này). "Bình luận" là khung
-- tự do riêng, không cần sao, khách đăng nhập bình luận được nhiều lần. Cả hai: AI CŨNG ĐỌC ĐƯỢC (kể
-- cả chưa đăng nhập) — chỉ GỬI mới cần đăng nhập. Dùng chung cho MỌI sản phẩm qua `product_slug`
-- (chính là tên file .md trong src/content/products/, không kèm department vì slug sản phẩm vốn đã
-- duy nhất toàn site). Xem src/lib/reviews.ts, src/components/ProductReviews.astro.

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  body text,
  admin_reply text,
  admin_reply_by text,
  admin_reply_at timestamptz,
  created_at timestamptz not null default now(),
  unique (product_slug, user_id)
);

alter table public.product_reviews enable row level security;

create policy "Ai cũng xem được đánh giá"
  on public.product_reviews for select
  using (true);

create policy "Khách đã đăng nhập tạo đánh giá của chính mình"
  on public.product_reviews for insert
  with check (auth.uid() = user_id);

create policy "Khách xóa đánh giá của chính mình"
  on public.product_reviews for delete
  using (auth.uid() = user_id);

create index on public.product_reviews (product_slug);

-- Dược sĩ trả lời đánh giá qua hàm riêng (KHÔNG cấp UPDATE trực tiếp trên bảng cho ai, kể cả admin) —
-- cùng lý do đã áp dụng cho "đã xem" ở mục 6b: nếu cấp UPDATE thường, khách có thể lợi dụng sửa luôn
-- rating/body của bất kỳ đánh giá nào (kể cả của người khác) qua gọi thẳng REST API, không chỉ cột
-- admin_reply. Hàm này security definer nên không cần cấp UPDATE thật nào trên bảng.
create function public.admin_reply_to_review(p_review_id uuid, p_reply text)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_name text;
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and is_admin = true) then
    raise exception 'not authorized';
  end if;
  select coalesce(full_name, 'Dược sĩ') into v_name from public.profiles where id = auth.uid();
  update public.product_reviews
  set admin_reply = p_reply, admin_reply_by = v_name, admin_reply_at = now()
  where id = p_review_id;
end;
$$;

grant execute on function public.admin_reply_to_review(uuid, text) to authenticated;

create table public.product_comments (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null,
  user_id uuid not null references auth.users (id) on delete cascade,
  author_name text not null,
  author_role text not null default 'customer' check (author_role in ('customer', 'admin')),
  body text not null,
  created_at timestamptz not null default now()
);

alter table public.product_comments enable row level security;

create policy "Ai cũng xem được bình luận"
  on public.product_comments for select
  using (true);

-- author_role phải khớp thật với quyền của người gửi (không tin JS phía trình duyệt tự gắn nhãn
-- "admin" cho chính mình) — chỉ tài khoản có profiles.is_admin = true mới gửi được author_role='admin'.
create policy "Khách đã đăng nhập tạo bình luận của chính mình"
  on public.product_comments for insert
  with check (
    auth.uid() = user_id
    and (
      author_role = 'customer'
      or (author_role = 'admin' and exists (select 1 from public.profiles where id = auth.uid() and is_admin = true))
    )
  );

create policy "Khách xóa bình luận của chính mình"
  on public.product_comments for delete
  using (auth.uid() = user_id);

create index on public.product_comments (product_slug);

-- 8. Trả lời bình luận (tháng 10/2026) — biến "Bình luận sản phẩm" ở mục "7." thành luồng trò chuyện
-- 2 CHIỀU thật sự: khách và dược sĩ trả lời qua lại được trong cùng 1 nhánh (trước đó dược sĩ chỉ đăng
-- được 1 bình luận rời rạc, không trả lời đúng vào bình luận nào). parent_id null = bình luận GỐC;
-- parent_id = id bình luận GỐC = một lượt TRẢ LỜI trong nhánh đó — CHỈ 1 CẤP (bấm "Trả lời" trên một
-- trả lời vẫn gắn vào ĐÚNG bình luận gốc ban đầu, hiện phẳng theo thời gian trong cùng nhánh, kiểu
-- Messenger, không lồng nhiều cấp cho dễ hiển thị). Ai cũng trả lời được (không riêng dược sĩ), đúng
-- yêu cầu "khách cũng trả lời lại được bình luận của dược sĩ".
alter table public.product_comments add column if not exists parent_id uuid references public.product_comments (id) on delete cascade;

create index on public.product_comments (parent_id);
