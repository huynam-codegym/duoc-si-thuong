---
name: fix-bug
description: Sửa lỗi (bug) trên site Dược Sĩ Thương theo quy trình cố định — tái hiện, tìm nguyên nhân gốc, sửa, test hồi quy giao diện + chức năng, rồi BẮT BUỘC chạy lại kiểm tra bảo mật (skill web-security-testing) cho phần vừa sửa trước khi deploy. Dùng mỗi khi chủ website báo lỗi ("lỗi", "không chạy", "bị vỡ", "sai", gửi ảnh chụp chỗ hỏng), khi test/kiểm tra bảo mật phát hiện lỗi, hoặc khi gọi /fix-bug.
---

# Sửa lỗi

Mọi lỗi (giao diện, chức năng, dữ liệu, bảo mật) đều đi qua skill này. Kết thúc LUÔN là một vòng kiểm tra bảo mật — sửa lỗi xong mà chưa chạy bảo mật thì chưa coi là xong. Không hỏi xác nhận từng bước (build/commit/push/deploy làm liền mạch), chỉ hỏi khi thật sự thiếu thông tin để tái hiện lỗi hoặc khi cách sửa đụng tới nội dung y khoa/giá/pháp lý.

## 1. Tái hiện lỗi — chưa thấy lỗi thì chưa sửa

- Ghi rõ: trang/URL, khổ màn hình (máy tính ≥77rem / điện thoại 375px), đăng nhập hay chưa, thao tác dẫn tới lỗi, kết quả đúng phải là gì.
- Tái hiện bằng công cụ thật, không đoán từ code:
  - Giao diện/JS: Puppeteer (`scripts/regression/`, xem mục 4) chụp ảnh + đo `getBoundingClientRect()`; đọc console lỗi.
  - Dữ liệu/Supabase/Edge Function: gọi bằng `fetch` của Node (KHÔNG dùng `curl` trong Git Bash với JSON tiếng Việt — hỏng UTF-8, xem CLAUDE.md).
- Lỗi "lúc được lúc không": nghĩ ngay tới đua dữ liệu (race), chỉ mục Pagefind tải lười, cache 10 phút của GitHub Pages, sự kiện auth bắn lại giữa các trang — mô phỏng đúng điều kiện (nhiều lượt liên tiếp trên CÙNG 1 trang, mạng chậm) thay vì 1 lần thử.
- Không tái hiện được → báo lại chủ website những gì đã thử, xin thêm ảnh/thao tác. Không "sửa mò".

## 2. Tìm nguyên nhân gốc

- Tìm trong CLAUDE.md các mục "Bẫy đã gặp" cùng họ trước (độ ưu tiên CSS `.order label`/`.faq-chat-form button`, `rem` trong `@media`, `flex-basis:auto`, `1fr` thiếu `minmax(0,…)`, `position: sticky` tạo stacking context, `define:vars` tắt ESM, `atob` hỏng UTF-8, `compressHTML` của Astro 7, RLS gác theo HÀNG không theo CỘT…). Lỗi mới thường là họ hàng của lỗi cũ.
- Tìm hết MỌI nơi cùng mẫu lỗi (Grep), không chỉ chỗ được báo — ví dụ lỗi ở 1 thẻ sản phẩm thì kiểm tra cả 6 chỗ hiện giá, cả khay giỏ hàng, cả trang admin.

## 3. Sửa

- Sửa đúng nguyên nhân gốc, phạm vi nhỏ nhất; viết code giống code xung quanh (comment tiếng Việt ngắn giải thích VÌ SAO nếu không hiển nhiên).
- Lỗi dữ liệu/quyền: sửa ở MÁY CHỦ (RLS, trigger, hàm `security definer`, Edge Function), không chỉ ẩn nút ở giao diện. SQL mới → thêm mục đánh số tiếp theo trong `docs/supabase-schema.sql` và nhắc chủ website tự chạy trong SQL Editor (không tự chạy được — không có khóa service_role). Sau khi chủ website chạy xong, kiểm tra lại bằng 1 lần ghi/đọc thử thật (tài khoản/dữ liệu tạm, xóa sau) — không chỉ tin là đã chạy.
- Không bao giờ ghi khóa bí mật (service_role, Resend, GitHub token, Turnstile secret) vào file — chỉ biến shell tạm hoặc `supabase secrets set`.
- Mọi thao tác ghi dữ liệu phải có chỗ hiện lỗi NHÌN THẤY ĐƯỢC cho người dùng, không chỉ `console.error`.

## 4. Test hồi quy (bắt buộc với mọi thay đổi giao diện/CSS/component/thư viện)

Bộ test dùng chung ở `scripts/regression/` (thư viện riêng, không phải dependency của site):

```bash
# Node build site phải >= 22.23.4 (Astro 7). Máy chủ website đã cài Node 24; nếu `node -v` thấp hơn (máy khác),
# tải Node 24 LTS bản zip từ nodejs.org vào scratchpad, ĐỐI CHIẾU SHA256 với SHASUMS256.txt, rồi
# export PATH="<thư mục node>:$PATH" trước khi chạy npm.
cd scripts/regression && npm install          # lần đầu
# 1) Bản TRƯỚC khi sửa: git stash (hoặc build từ commit cũ) → npm run build → chép dist sang scratchpad/dist-old
# 2) Bản SAU khi sửa: npm run build → chép dist sang scratchpad/dist-new
node run.mjs <dist-old> <shots-old> 4400       # chụp 28 trang × 2 khổ + 15 kiểm tra chức năng
node run.mjs <dist-new> <shots-new> 4401
node summary.mjs <shots-new>                   # trang lỗi console / tràn ngang / ảnh vỡ + kết quả chức năng
node compare.mjs <shots-old> <shots-new> <shots-diff>   # % điểm ảnh khác nhau từng ảnh
```

- Trên Windows truyền đường dẫn dạng `cygpath -w` cho Node.
- `run.mjs` chặn sẵn `/auth/v1/signup` để mở khung chat không tạo tài khoản ẩn danh thật.
- Đọc kết quả: kết quả chức năng (summary) cũ và mới phải GIỐNG NHAU, trừ đúng phần vừa sửa. Ảnh khác nhau chỉ được ở đúng chỗ vừa sửa; khoảng 40-700 điểm ảnh ở ô tìm kiếm là chữ gợi ý tự gõ (nhiễu, bỏ qua). Ảnh nào khác ngoài dự kiến → cắt vùng khác nhau đặt cạnh nhau và XEM bằng mắt trước khi kết luận.
- Thêm kiểm tra riêng cho đúng lỗi vừa sửa (Puppeteer) và chạy ở ít nhất 1280px và 375px. Trang có ảnh `loading="lazy"`: cuộn hết trang trước khi chụp.
- Muốn bảo vệ lâu dài, thêm hẳn 1 `check(...)` vào `run.mjs` cho lỗi vừa sửa để lần sau tự phát hiện nếu tái phát.

## 5. Kiểm tra bảo mật SAU khi sửa (bắt buộc)

Gọi skill `web-security-testing` (Skill tool) cho phạm vi vừa thay đổi — không cần chạy lại toàn bộ danh mục mỗi lần, nhưng tối thiểu:
- **DEP-01**: `npm audit` (phải 0 lỗ hổng, hoặc ghi rõ lỗ hổng còn lại và lý do).
- **DATA-03**: quét `dist/` không có khóa bí mật/JWT `service_role`/source map; chuỗi khớp phải xem tận nơi (thư viện Supabase có sẵn chữ `sb_secret_` trong code kiểm tra tiền tố — không phải rò rỉ).
- **CONF-02**: thẻ meta CSP + đoạn chống nhúng trang vẫn còn trong mọi trang build.
- Nhóm liên quan tới phần vừa sửa: đụng form/hiển thị chữ khách nhập → INP (XSS: `textContent` không `innerHTML`); đụng Supabase/RLS/Edge Function → ACC + BIZ (thử bằng khóa anon, tài khoản tạm; không PATCH/DELETE hàng loạt dữ liệu thật); đụng đơn hàng → BIZ-01 (giá tính lại ở máy chủ), API-02 (giới hạn tần suất).
- Phát hiện lỗi mới → quay lại bước 1 với lỗi đó (vòng lặp sửa → test → bảo mật) cho tới khi sạch. Lỗi Critical → dừng khai thác sâu, báo ngay chủ website.
- Báo cáo không ghi token/mật khẩu/khóa — che `****`.

## 6. Ghi lại và deploy

- CLAUDE.md: thêm "Bẫy đã gặp" (triệu chứng → nguyên nhân → cách sửa → bài học) vào đúng mục liên quan. Không ghi lại lịch sử git.
- Commit (tiếng Anh, có dòng Co-Authored-By theo hướng dẫn hệ thống) → push `main` → đợi GitHub Actions xong (`gh run watch`) → kiểm tra site thật (`https://duocsithuong.com`) đúng chỗ vừa sửa. Nhắc chủ website Ctrl+F5 nếu chưa thấy (cache 10 phút).
- Báo cáo cuối (tiếng Việt, mở đầu 3 icon mặt cười): lỗi là gì, nguyên nhân, đã sửa gì, đã test gì (khổ màn hình, kết quả), kết quả bảo mật, việc chủ website cần tự làm (nếu có).
