const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/**
 * Thêm đường dẫn gốc (`base` trong astro.config.mjs) vào liên kết nội bộ.
 * Trên GitHub Pages website nằm ở /duoc-si-thuong/ nên mọi liên kết phải qua hàm này.
 * Ví dụ: url('/an-uong/') -> '/duoc-si-thuong/an-uong/'
 */
export function url(path: string): string {
  return `${base}${path}`;
}
