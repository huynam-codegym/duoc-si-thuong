// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Sau khi build: bỏ khỏi sitemap mọi trang có <meta name="robots" content="noindex...">
// (trang quản trị, giỏ hàng, tài khoản, bài "bản xem thử", trang tra cứu thuốc...). Đọc thẳng HTML
// đã build nên thêm trang noindex mới cũng tự được bỏ, không phải nhớ sửa bộ lọc. Phải đứng SAU
// sitemap() trong integrations để chạy sau khi sitemap đã được ghi.
function dropNoindexFromSitemap() {
  return {
    name: 'drop-noindex-from-sitemap',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const root = fileURLToPath(dir);
        const sitemapFile = path.join(root, 'sitemap-0.xml');
        if (!fs.existsSync(sitemapFile)) return;
        let xml = fs.readFileSync(sitemapFile, 'utf8');
        xml = xml.replace(/<url><loc>([^<]+)<\/loc>.*?<\/url>/g, (entry, loc) => {
          const file = path.join(root, new URL(loc).pathname, 'index.html');
          if (!fs.existsSync(file)) return entry;
          return /<meta name="robots" content="noindex/.test(fs.readFileSync(file, 'utf8')) ? '' : entry;
        });
        fs.writeFileSync(sitemapFile, xml);
      },
    },
  };
}

// Website chạy ở tên miền riêng (GitHub Pages + Cloudflare DNS), nên không cần `base`.
// Nếu quay lại địa chỉ github.io/duoc-si-thuong thì thêm lại: site 'https://huynam-codegym.github.io', base '/duoc-si-thuong'.
export default defineConfig({
  site: 'https://duocsithuong.com',
  // Astro 7 đổi mặc định sang 'jsx' (bỏ khoảng trắng kiểu React), làm dính chữ ở nhiều chỗ như
  // "Trang chủ /Thực phẩm chức năng". `true` giữ cách gọn khoảng trắng theo HTML như Astro 5/6.
  compressHTML: true,
  integrations: [sitemap(), dropNoindexFromSitemap()],
});
