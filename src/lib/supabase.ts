/**
 * Kết nối tới Supabase (đăng nhập, hồ sơ khách hàng, lịch sử đơn hàng) — chạy hoàn toàn ở trình duyệt
 * vì site là site tĩnh (không có máy chủ riêng). Chỉ import file này trong thẻ <script> của component,
 * không import ở phần frontmatter.
 *
 * URL và khóa "anon/publishable" KHÔNG phải bí mật — Supabase thiết kế để lộ ra ở trình duyệt là an
 * toàn, quyền hạn thật sự được kiểm soát bằng Row Level Security (RLS) trên từng bảng ở phía Supabase.
 * Tuyệt đối không đưa khóa "service_role" (bí mật, toàn quyền) vào code phía trình duyệt.
 *
 * Giá trị lấy từ biến môi trường PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY (file `.env`, không
 * commit lên git — xem `.gitignore`). Khi build trên GitHub Actions, 2 biến này lấy từ Repository
 * variables (Settings > Secrets and variables > Actions > Variables), xem `.github/workflows/deploy.yml`.
 */
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const anonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, anonKey);
