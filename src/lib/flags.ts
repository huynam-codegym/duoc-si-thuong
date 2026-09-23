/**
 * Ánh xạ tên xuất xứ (trường `origin` của sản phẩm, tiếng Việt) sang mã quốc gia ISO 3166-1
 * alpha-2 (viết thường), dùng để hiện đúng ảnh cờ ở thẻ sản phẩm (`public/flags/<mã>.svg`).
 *
 * Ảnh cờ lấy từ thư viện mã nguồn mở flag-icons (https://github.com/lipis/flag-icons, MIT),
 * tải sẵn về `public/flags/` để tự lưu trữ (không gọi ra ngoài lúc người dùng xem trang).
 *
 * Thêm quốc gia mới: thêm một dòng vào bảng dưới, rồi tải file SVG tương ứng, ví dụ:
 *   curl -o public/flags/th.svg https://cdn.jsdelivr.net/npm/flag-icons@7.5.0/flags/4x3/th.svg
 * (đổi "th" thành mã ISO alpha-2 của quốc gia, xem danh sách mã ở README của flag-icons).
 * Xuất xứ không có trong bảng vẫn hiện được, chỉ không có ảnh cờ (chỉ hiện chữ) — không tự đoán
 * mã quốc gia để tránh gắn nhầm cờ.
 */
const originFlagCodes: Record<string, string> = {
  'Việt Nam': 'vn',
  Úc: 'au',
  Mỹ: 'us',
  'Nhật Bản': 'jp',
  'Hàn Quốc': 'kr',
  Đức: 'de',
  Pháp: 'fr',
  Canada: 'ca',
  'Thụy Sĩ': 'ch',
  'New Zealand': 'nz',
  Anh: 'gb',
  'Vương Quốc Anh': 'gb',
  Singapore: 'sg',
  'Thái Lan': 'th',
  'Trung Quốc': 'cn',
  Ý: 'it',
  'Tây Ban Nha': 'es',
  'Ấn Độ': 'in',
};

export function originFlagCode(origin: string): string | undefined {
  return originFlagCodes[origin.trim()];
}
