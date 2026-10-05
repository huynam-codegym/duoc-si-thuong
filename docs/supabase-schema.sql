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
