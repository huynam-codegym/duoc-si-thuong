// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Đang deploy lên GitHub Pages: https://huynam-codegym.github.io/duoc-si-thuong/
// Nếu sau này dùng tên miền riêng: đổi `site` thành tên miền đó và bỏ dòng `base`.
export default defineConfig({
  site: 'https://huynam-codegym.github.io',
  base: '/duoc-si-thuong',
  integrations: [sitemap()],
});
