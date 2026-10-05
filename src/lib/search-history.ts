/**
 * Lịch sử tìm kiếm chạy hoàn toàn trên trình duyệt của khách (localStorage), không gửi lên đâu cả —
 * chỉ để khách bấm vào ô tìm kiếm là thấy lại từ khóa đã tìm gần đây, đỡ phải gõ lại.
 * Chỉ import file này trong thẻ <script> của component (chạy ở trình duyệt), không import ở phần frontmatter.
 */
export const MAX_HISTORY = 8;
const KEY = 'duocsithuong-search-history';

// Nếu trình duyệt chặn localStorage (ví dụ cửa sổ ẩn danh) thì giữ lịch sử trong bộ nhớ, vẫn dùng
// được trong trang đang mở, chỉ không nhớ lại lần sau.
let memory: string[] = [];

function isTermList(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0);
}

export function getSearchHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    const data: unknown = raw ? JSON.parse(raw) : [];
    memory = isTermList(data) ? data : [];
  } catch {
    // giữ nguyên `memory`
  }
  return [...memory];
}

function save(terms: string[]) {
  memory = terms;
  try {
    localStorage.setItem(KEY, JSON.stringify(terms));
  } catch {
    // không lưu được thì thôi, `memory` vẫn giữ lịch sử cho trang đang mở
  }
}

/** Thêm 1 từ khóa vào đầu danh sách — từ khóa trùng (không phân biệt hoa/thường) được đưa lên đầu
 * thay vì tạo dòng mới, danh sách tối đa MAX_HISTORY từ khóa gần nhất. */
export function addSearchHistory(term: string) {
  const trimmed = term.trim();
  if (!trimmed) return;
  const current = getSearchHistory();
  const deduped = current.filter((item) => item.toLowerCase() !== trimmed.toLowerCase());
  save([trimmed, ...deduped].slice(0, MAX_HISTORY));
}

export function removeSearchHistory(term: string) {
  save(getSearchHistory().filter((item) => item !== term));
}

export function clearSearchHistory() {
  save([]);
}
