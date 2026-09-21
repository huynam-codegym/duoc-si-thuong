// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Website chạy ở tên miền riêng (GitHub Pages + Cloudflare DNS), nên không cần `base`.
// Nếu quay lại địa chỉ github.io/duoc-si-thuong thì thêm lại: site 'https://huynam-codegym.github.io', base '/duoc-si-thuong'.
export default defineConfig({
  site: 'https://duocsithuong.com',
  integrations: [sitemap()],
});
