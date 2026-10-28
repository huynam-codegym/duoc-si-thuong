---
name: update-deps
description: Cập nhật thư viện (Astro, @astrojs/*, supabase-js, pagefind, GitHub Actions, Node) của site Dược Sĩ Thương lên bản mới nhất, kể cả bản lớn (major), rồi test lại TOÀN BỘ chức năng + giao diện bằng so ảnh trước/sau và chạy kiểm tra bảo mật. Dùng khi có bản mới (Dependabot mở PR, npm audit báo lỗ hổng, chủ website nhắc "cập nhật thư viện"), định kỳ hằng tháng, hoặc khi gọi /update-deps.
---

# Cập nhật thư viện

Việc thường xuyên: chạy ít nhất **mỗi tháng 1 lần**, và ngay khi Dependabot mở PR hoặc `npm audit` báo lỗ hổng. Mục tiêu: luôn ở bản mới nhất, `npm audit` = 0, giao diện/chức năng không đổi so với trước khi nâng.

## 1. Xem có gì mới

```bash
npm outdated; npm audit
npm view astro version engines --json        # bản mới + yêu cầu Node
gh pr list --author app/dependabot             # PR Dependabot đang chờ
for r in withastro/action actions/checkout actions/deploy-pages; do echo "$r $(gh api repos/$r/releases/latest --jq .tag_name)"; done
```

- Bản lớn (major) của Astro: ĐỌC hướng dẫn nâng cấp `https://docs.astro.build/en/guides/upgrade-to/v<N>/` (WebFetch) TRƯỚC khi cài, liệt kê từng thay đổi phá vỡ và đối chiếu với dự án (đã gặp ở v7: `compressHTML` đổi mặc định, bộ Markdown mới Sätteri, trình biên dịch Rust khắt khe HTML sai lồng thẻ, Vite 8, yêu cầu Node ≥ 22.23.4).
- Yêu cầu Node tăng → cập nhật cùng lúc `.nvmrc`, `engines` trong `package.json`, `node-version` trong `.github/workflows/deploy.yml`.
- `typescript`: dự án không chạy type-check lúc build; chỉ nâng bản lớn khi đã xác nhận công cụ Astro/editor hỗ trợ (TypeScript 7 là bản biên dịch mới viết lại, chưa nâng — tháng 10/2026).

## 2. Chụp mốc TRƯỚC khi nâng

Dùng bộ test `scripts/regression/` (xem skill `fix-bug` mục 4 cho cách cài và cách chạy Node 24 bản zip nếu máy chỉ có Node cũ):

```bash
npm run build && cp -r dist <scratchpad>/dist-old
node scripts/regression/run.mjs <dist-old> <shots-old> 4400
```

## 3. Nâng cấp

```bash
npm install astro@latest @astrojs/sitemap@latest @supabase/supabase-js@latest
npm install -D pagefind@latest
npm audit            # phải 0
npm run build        # đọc kỹ mọi warning/deprecation
```

Sửa các chỗ hỏng theo hướng dẫn nâng cấp. Ưu tiên tùy chọn cấu hình giữ hành vi cũ (ví dụ `compressHTML: true`) hơn là sửa rải rác từng file, trừ khi tùy chọn đó bị đánh dấu sắp bỏ.

## 4. Test lại TẤT CẢ (bắt buộc, không bỏ bước nào)

```bash
cp -r dist <scratchpad>/dist-new
node scripts/regression/run.mjs <dist-new> <shots-new> 4401
node scripts/regression/summary.mjs <shots-old> > old.txt; node scripts/regression/summary.mjs <shots-new> > new.txt; diff old.txt new.txt
node scripts/regression/compare.mjs <shots-old> <shots-new> <shots-diff>
```

1. **Chức năng**: kết quả 15 kiểm tra (gợi ý tìm kiếm, trang tìm kiếm + đổi Sản phẩm/Bài viết, thêm giỏ + trang giỏ hàng + tiền ship, thanh mua hàng dính, khung chat, 6 menu lớn rê chuột, khung đăng nhập, ngăn kéo điện thoại, sitemap/robots/pagefind/san-pham.json) phải GIỐNG HỆT bản cũ.
2. **Giao diện**: 28 trang × 2 khổ (1280/375). Ảnh lệch kích thước hoặc lệch > 0,1% → cắt vùng khác nhau, đặt cũ/mới cạnh nhau, XEM bằng mắt. Nhiễu đã biết: chữ gợi ý tự gõ trong ô tìm kiếm (~40-700 điểm ảnh).
3. **Chữ hiển thị trên MỌI trang** (không chỉ 28 trang chụp): so `document.body.innerText` của toàn bộ trang trong `dist-old`/`dist-new` bằng Puppeteer, tìm chỗ 2 từ bị dính (mất khoảng trắng) hoặc chữ đổi. Cách này đã bắt được lỗi `compressHTML` của Astro 7 trên ~90 trang mà ảnh chụp chỉ thấy ở vài trang.
4. **Cấu trúc HTML MỌI trang**: so chuỗi thẻ + id/class/href/alt/data-* (chuẩn hóa `&amp;`/`&#38;`, bỏ mã băm `_astro`/`astro-cid`) để bắt thay đổi do bộ dựng Markdown/trình biên dịch mới (bảng, id tiêu đề cho mục lục, ảnh).
5. **Thứ tự danh sách**: mọi `.sort()` trên `getCollection()` phải có tiêu chí phụ cố định (đã gặp: bài cùng `updatedAt` đổi chỗ khi lên Astro 7 → thêm `a.id.localeCompare(b.id)`).
6. **`npm run dev`** khởi động được, trang chủ/sản phẩm/bài viết trả 200, bài nháp vẫn hiện ở dev, đường dẫn sai trả 404.
7. Sau deploy: kiểm tra site thật (trang chủ, 1 bài, 1 sản phẩm, `/tim-kiem/?q=canxi`, `/sitemap-index.xml`, 1 địa chỉ sai ra 404) và GitHub Actions chạy xanh.

Bước 3-4: `node scripts/regression/compare-text.mjs <dist-old> <dist-new>` và `node scripts/regression/compare-html.mjs <dist-old> <dist-new>` (chỉ in ra những gì khác).

## 5. Bảo mật

Gọi skill `web-security-testing` tối thiểu các nhóm DEP (audit = 0), DATA-03 (quét `dist/` không lộ khóa/source map), CONF-02 (meta CSP + chống nhúng còn nguyên). Phát hiện lỗi → xử lý qua skill `fix-bug`.

## 6. Ghi lại và deploy

- CLAUDE.md: cập nhật phiên bản ("Yêu cầu: Node.js … Phiên bản Astro …"), thêm bẫy mới gặp khi nâng cấp.
- Commit → push `main` (hoặc merge PR Dependabot sau khi đã test như trên) → đợi Actions → kiểm tra site thật.
- Báo cáo chủ website: đã nâng gì từ bản nào lên bản nào, lỗ hổng trước/sau, lỗi phát hiện và đã sửa, kết quả test.
