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
