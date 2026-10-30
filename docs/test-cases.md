# Bộ test case — Dược Sĩ Thương

Tài liệu nội bộ, không đăng lên website. Liệt kê toàn bộ test case của hệ thống, cách chạy, và cách xử lý khi có case lỗi.

- Tạo: 30/10/2026. Sửa tính năng nào thì sửa luôn case tương ứng ở đây (và trong `scripts/regression/cases.mjs` nếu là case tự động).
- **Cách chạy:** `T` = tự động, chạy bằng `scripts/regression/cases.mjs` trên bản build ở máy (Supabase được giả lập, không ghi dữ liệu thật). `L` = tự động, gọi **dữ liệu/máy chủ thật** (chỉ đọc hoặc gửi dữ liệu bị từ chối trước khi ghi, không tạo dữ liệu). `Tay` = phải làm bằng tay (cần tài khoản thật, email thật, thanh toán, in ấn...).
- **Khổ màn hình:** case giao diện chạy ở **1280px** (máy tính) và **375px** (điện thoại) trừ khi ghi khác.

## Cách chạy và vòng lặp sửa lỗi

```bash
npm run build                                   # dựng dist/ (Node >= 22.23.4)
cd scripts/regression && npm install            # lần đầu
node cases.mjs <dist> <outDir> 4410             # chạy mọi case T + L, ghi <outDir>/report.md và results.json
node cases.mjs <dist> <outDir> 4410 --only=ORD  # chỉ chạy 1 nhóm (tiền tố mã case)
node run.mjs <dist> <shots> 4400                # bộ chụp ảnh hồi quy 28 trang × 2 khổ (xem skill fix-bug)
```

Vòng lặp:

1. Chạy `cases.mjs`. Đọc `report.md`: mỗi case `PASS` / `FAIL` kèm chi tiết.
2. Case `FAIL` → xử lý theo skill `fix-bug` (tái hiện, tìm nguyên nhân gốc, sửa, test hồi quy). Case sai vì **test viết sai** (không phải lỗi site) thì sửa test, ghi rõ lý do trong commit.
3. Chạy lại `cases.mjs` (toàn bộ, không chỉ case vừa sửa) và `run.mjs` (so ảnh trước/sau).
4. Còn `FAIL` → quay lại bước 2. Sạch hết → chạy skill `web-security-testing` cho phần vừa sửa → commit, push, đợi deploy, kiểm tra site thật.
5. Ghi kết quả lần chạy vào mục "Lịch sử chạy" cuối file.

---

## 1. Chung — mọi trang (UI)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| UI-01 | Mở từng trang HTML trong `dist/` | Trả 200; trang không tồn tại trả trang 404 tiếng Việt | T |
| UI-02 | Tràn ngang | `scrollWidth` không lớn hơn bề rộng màn hình ở 1280 và 375px (trang mẫu đại diện) | T |
| UI-03 | Lỗi JavaScript | Không có `pageerror`/console error (bỏ qua lỗi mạng tới Supabase đã chặn khi test) | T |
| UI-04 | Ảnh vỡ | Không có `<img>` tải lỗi (sau khi cuộn hết trang để kích hoạt lazy-load) | T |
| UI-05 | Thẻ cơ bản | Mỗi trang có đúng 1 `<h1>`, có `<title>`, `meta description`, `canonical`, `lang="vi"` | T |
| UI-06 | Bảo mật trong HTML | Mỗi trang có meta CSP (`object-src 'none'`), meta referrer, đoạn script chống bị nhúng | T |
| UI-07 | Chân trang | Mỗi trang có tuyên bố miễn trừ trách nhiệm, liên kết "Chính sách bảo mật", "Tra cứu đơn hàng" | T |
| UI-08 | Liên kết nội bộ | Mọi `href` nội bộ trong `dist/` trỏ tới trang/tệp có thật | T |
| UI-09 | Ảnh có alt | Mọi `<img>` hiển thị (không `hidden`, không trang trí `alt=""` có `aria-hidden`) có `alt` | T |
| UI-10 | Cỡ chữ | Cỡ chữ gốc của trang là 18px (`html{font-size:112.5%}`) | T |

## 2. Điều hướng (NAV)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| NAV-01 | Rê chuột từng mục có menu con ở thanh menu (1280px) | Menu lớn/menu con của TỪNG mục hiện ra, không chỉ mục đầu | T |
| NAV-02 | Bấm nút 3 gạch (375px) | Ngăn kéo mở; nhấn Esc thì đóng | T |
| NAV-03 | Trong ngăn kéo bấm khối "Đăng nhập" | Khung đăng nhập nổi mở đè lên ngăn kéo | T |
| NAV-04 | Ngăn kéo có khối "Tra cứu đơn hàng" | Có và trỏ đúng `/tra-cuu-don-hang/` | T |
| NAV-05 | Nút "Về đầu trang" | 1280px: ẩn lúc đầu, hiện sau khi cuộn ≥400px, bấm thì về đầu trang. 375px: luôn ẩn | T |
| NAV-06 | Ở 1280px không có nút 3 gạch; ở 375px không có thanh menu ngang | Đúng | T |
| NAV-07 | Menu trái khu bán hàng, nhóm cha có nhóm con | Đang ở trang nhóm con thì nhóm cha tự mở sẵn | T |

## 3. Tìm kiếm (SRC)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| SRC-01 | Gõ "canxi" ở ô tìm kiếm đầu trang | Hiện gợi ý sản phẩm (có ảnh, có giá), tối đa 6 dòng + dòng "Xem tất cả" | T |
| SRC-02 | Gõ liên tiếp 3 từ khóa ngay sau khi tải trang (không tải lại) | Lượt ĐẦU TIÊN cũng có gợi ý (bẫy chỉ mục lọc tải lười) | T |
| SRC-03 | `/tim-kiem/?q=vitamin` | Có kết quả dạng thẻ; đổi sang "Bài viết sức khỏe" thì kết quả đổi | T |
| SRC-04 | Sắp xếp "Giá thấp" | Giá các thẻ sản phẩm tăng dần | T |
| SRC-05 | Gõ không dấu "khang sinh" | Ra bài/sản phẩm có "kháng sinh" | T |
| SRC-06 | Mở `/tim-kiem/?q=canxi` rồi bấm vào ô tìm kiếm trống | Lịch sử hiện "canxi"; nút × xóa được | T |
| SRC-07 | Từ khóa không có kết quả ("zzzqqq") | Hiện thông báo không có kết quả, không lỗi | T |

## 4. Trang sản phẩm (PRD)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| PRD-01 | Mọi trang sản phẩm | Có breadcrumb, giá hoặc "Liên hệ", nút "Thêm vào giỏ"/"Mua ngay", khung cảnh báo theo khu (`ProductNotice`) | T |
| PRD-02 | Sản phẩm có `originalPrice` > `price` | Hiện "-X%" đúng bằng `round((gốc-bán)/gốc*100)` và giá gốc gạch ngang | T |
| PRD-03 | JSON-LD `Product` | Có `offers.price` khớp `price` trong `/san-pham.json`, `priceCurrency` VND, không có `availability` | T |
| PRD-04 | Thanh mua hàng dính | Ẩn lúc mới tải trang (kể cả sản phẩm có bảng thành phần dài), hiện sau khi cuộn qua nút mua gốc | T |
| PRD-05 | Sản phẩm liên quan | Tối đa 8, không có chính sản phẩm đang xem | T |
| PRD-06 | Sản phẩm nháp (`draft: true`) | Không có trong `dist/`, không có trong `/san-pham.json`, không có trong sitemap | T |
| PRD-07 | `/san-pham.json` | Mỗi sản phẩm đã đăng có đúng 1 dòng, giá khớp trang sản phẩm | T |
| PRD-08 | Nhãn xuất xứ và nhãn "-X%" trên thẻ (375px) | Hai nhãn không chồng nhau, không đè lên ảnh | T |
| PRD-09 | Chữ cấm trong nội dung sản phẩm | Không có "chữa khỏi", "thần dược", "100% hiệu quả", "không tác dụng phụ", "không có tác dụng phụ", "khỏi bệnh" | T |
| PRD-10 | Đánh giá khi chưa có dữ liệu | Hiện "Chưa có đánh giá nào"; dòng tóm tắt sao cạnh tên sản phẩm ẩn | T |
| PRD-11 | Bấm "Viết đánh giá"/gửi bình luận khi chưa đăng nhập | Mở khung đăng nhập nổi | T |

## 5. Giỏ hàng (CART)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| CART-01 | Bấm "Thêm vào giỏ" ở trang sản phẩm | Số trên biểu tượng giỏ tăng; `/gio-hang/` có sản phẩm đó | T |
| CART-02 | Giỏ trống | Hiện thông báo giỏ trống và liên kết "Tra cứu đơn hàng" | T |
| CART-03 | Tổng dưới 350.000đ | Phí vận chuyển 20.000đ, "Thành tiền" = tổng + 20.000đ | T |
| CART-04 | Tổng từ 350.000đ | Phí vận chuyển "Miễn phí" | T |
| CART-05 | Có sản phẩm khuyến mãi | Dòng "Giảm giá trực tiếp" = tổng giá gốc − tổng giá bán; "Giảm giá voucher" 0đ | T |
| CART-06 | Tăng số lượng tới giới hạn | Không vượt quá 20 | T |
| CART-07 | Xóa sản phẩm | Dòng biến mất, tổng cập nhật, hết sản phẩm thì về trạng thái giỏ trống | T |
| CART-08 | Chọn "Chuyển khoản (QR Code)" | Hiện khung QR; URL ảnh QR có đúng số tiền (đã cộng ship) và mã đơn trong nội dung; mã đơn hiện dưới QR. Đổi phương thức khác thì khung ẩn | T |
| CART-09 | Chỉ có sản phẩm "Liên hệ" | Phí ship ghi "Nhà thuốc báo sau" | Tay (hiện không có sản phẩm "Liên hệ" nào đã đăng) |

## 6. Form đặt hàng (ORD)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| ORD-01 | Bấm "Hoàn tất" khi để trống mọi ô | Lỗi tiếng Việt dưới từng ô bắt buộc (tên, SĐT người đặt, email, tên/SĐT người nhận, địa chỉ, ô đồng ý); không có tooltip tiếng Anh của trình duyệt; không gọi máy chủ | T |
| ORD-02 | SĐT sai ("123", "abcdefghij") | "Số điện thoại chưa đúng..." | T |
| ORD-03 | Email: trống, `abc@gmail`, `te..n@gmail.com`, `thương@gmail.com`, `ten@gmail.con`, `ten@-abc.com`, `a b@gmail.com`, `.ten@gmail.com` | Báo lỗi đúng câu tương ứng (gõ nhầm tên miền thì gợi ý "Có phải là @gmail.com?") | T |
| ORD-04 | Email `Ten@Gmail.COM` | Được nhận, gửi lên máy chủ dạng `ten@gmail.com` | T |
| ORD-05 | Hiện lỗi không làm lệch bố cục | Vị trí các ô trước/sau khi báo lỗi giống nhau (lệch 0px) ở 375px và 1280px | T |
| ORD-06 | Gõ lại ô đang lỗi | Lỗi của ô đó biến mất | T |
| ORD-07 | Gửi đơn hợp lệ, máy chủ trả thành công (giả lập) | Hiện thông báo thành công có mã đơn, nhắc email, có liên kết tra cứu `?ma=<mã>`; giỏ được xóa | T |
| ORD-08 | Máy chủ trả lỗi kèm lý do (giả lập 429) | Hiện đúng lý do máy chủ gửi, kèm liên kết Zalo dự phòng; giỏ không bị xóa | T |
| ORD-09 | Dữ liệu gửi lên máy chủ | Có `orderId` khớp mã dưới QR, có email đã chuẩn hóa, có danh sách sản phẩm (id, số lượng) | T |
| ORD-10 | Ô ẩn chống bot `_gotcha` | Có trong form, bị ẩn khỏi người dùng | T |
| ORD-11 | Ô xác minh Turnstile trên site thật | Hiện trên nút "Hoàn tất" | L |
| ORD-12 | Đặt đơn thật bằng email của chủ website | Nhận email xác nhận (không vào Spam); nhà thuốc nhận email báo đơn; đơn có trong `/admin/don-hang/` | Tay |

## 7. Máy chủ đặt hàng `send-order-email` (API)

Gọi thẳng hàm thật bằng `fetch` của Node (không dùng `curl` trong Git Bash vì hỏng chữ tiếng Việt). Mọi dữ liệu ở đây đều bị từ chối TRƯỚC bước lưu đơn nên không tạo dữ liệu.

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| API-01 | Body không phải JSON | 400 | L |
| API-02 | Email sai (5 kiểu) | 400, thông báo tiếng Việt | L |
| API-03 | SĐT sai | 400 "Số điện thoại chưa đúng." | L |
| API-04 | Sản phẩm không có trong bảng giá | 400 | L |
| API-05 | Số lượng 0 hoặc 21 | 400 | L |
| API-06 | Hình thức thanh toán lạ | 400 | L |
| API-07 | Dữ liệu hợp lệ nhưng không có mã Turnstile | 403 (không lưu đơn, không gửi email) | L |
| API-08 | Mã đơn có ký tự lạ (`<script>`) | 400 | L |
| API-09 | Giới hạn 5 đơn/10 phút | Đơn thứ 6 bị 429 | Tay (đã test 28/10/2026; cần tạm gỡ Turnstile) |
| API-10 | Giá gửi lên sai (1đ) | Đơn lưu theo giá thật | Tay (đã test 28/10/2026) |

## 8. Các hàm máy chủ khác (FN)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| FN-01 | `notify-order-status` không có đăng nhập / chỉ khóa anon / JWT giả | 401 | L |
| FN-02 | `manage-product` không có đăng nhập / chỉ khóa anon | 401 | L |
| FN-03 | `notify-chat-message` với hội thoại không tồn tại | Không gửi email, không lỗi 500 | L |
| FN-04 | Admin đổi trạng thái đơn | Khách nhận email đúng trạng thái; trang admin báo "đã gửi email" | Tay |

## 9. Tra cứu đơn hàng (LK)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| LK-01 | Mở `/tra-cuu-don-hang/?ma=ABC123` | Ô mã đơn điền sẵn "ABC123" | T |
| LK-02 | Bấm Tra cứu khi trống | Báo lỗi tiếng Việt, không gọi máy chủ | T |
| LK-03 | Máy chủ trả đơn (giả lập) | Hiện 4 bước, bước hiện tại đúng trạng thái; chữ khách nhập hiện dạng chữ thường (không chạy HTML) | T |
| LK-04 | Máy chủ trả rỗng (giả lập) | Báo "không tìm thấy" | T |
| LK-05 | Gọi `lookup_order` thật với mã/SĐT bịa | Trả rỗng, không lộ dữ liệu | L |

## 10. Tài khoản (ACC)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| ACC-01 | `/tai-khoan/` khi chưa đăng nhập | Hiện nút Google, tab Đăng nhập/Đăng ký, dòng Chính sách bảo mật; ô mật khẩu rộng bằng ô email | T |
| ACC-02 | Bấm "Tài khoản" đầu trang (1280px) | Khung đăng nhập nổi mở, có dòng Chính sách bảo mật và "Tra cứu đơn hàng"; Esc đóng | T |
| ACC-03 | Phiên ẩn danh (do khung chat tạo) | Đầu trang vẫn ghi "Tài khoản"/"Đăng nhập", không coi là đã đăng nhập | T |
| ACC-04 | Đăng nhập Google, email; đăng xuất; quên mật khẩu | Thành công, toast hiện đúng 1 lần, quay về trang chủ | Tay |

## 11. Khung chat (CHAT)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| CHAT-01 | Bấm nút chat | Khung mở, có ô nhập, nút ghim, nút mic, liên kết "Nhắn Zalo cho dược sĩ"; nút ✕ đóng | T |
| CHAT-02 | Khung chat ở 375px | Không tràn ngang, nút gửi nằm trong màn hình | T |
| CHAT-03 | Nhắn tin 2 chiều khách ↔ dược sĩ, ảnh, file, ghi âm, "Đã xem" | Hoạt động theo thời gian thực | Tay (đã test 10/2026 bằng 2 cửa sổ) |

## 12. Trang quản trị (ADM)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| ADM-01 | Mở 4 trang `/admin/*` khi chưa đăng nhập | Có `noindex`; hiện lời nhắc đăng nhập; không có dữ liệu đơn/tin nhắn trong HTML | T |
| ADM-02 | HTML tĩnh `/admin/san-pham/` | Không chứa dữ liệu sản phẩm nháp | T |
| ADM-03 | Đổi trạng thái, in phiếu, báo đơn mới, trả lời bình luận, thêm/sửa sản phẩm | Theo mô tả trong CLAUDE.md | Tay |

## 13. SEO và nội dung (SEO)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| SEO-01 | `sitemap-0.xml` | Có mọi trang sản phẩm; không có `/admin/`, `/gio-hang/`, `/tai-khoan/` và các trang `noindex` | T |
| SEO-02 | `robots.txt` | Trỏ tới sitemap của `https://duocsithuong.com` | T |
| SEO-03 | Trang bài viết | Có ngày đăng, ngày cập nhật, mục nguồn tham khảo, tuyên bố miễn trừ; bài "bản xem thử" có `noindex` và khung vàng | T |
| SEO-04 | Trang chính sách bảo mật | Có ngày đăng/cập nhật, không có `noindex` | T |
| SEO-05 | `og:image` | Mọi trang có ảnh chia sẻ, đường dẫn tuyệt đối | T |

## 14. Bảo mật (SEC)

| Mã | Kiểm tra | Kết quả mong đợi | Cách |
| --- | --- | --- | --- |
| SEC-01 | Khóa anon đọc `orders`, `profiles`, `conversations`, `messages`, `order_rate_log`, `zalo_oa_tokens` | Trả rỗng hoặc bị từ chối | L |
| SEC-02 | Khóa anon ghi `product_reviews`, `orders` | Bị từ chối | L |
| SEC-03 | Khóa anon liệt kê bucket `chat-attachments` | Rỗng hoặc bị từ chối | L |
| SEC-04 | Quét `dist/` | Không có JWT `service_role`, khóa Resend (`re_`), token GitHub (`ghp_`, `github_pat_`), source map | T |
| SEC-05 | `npm audit` (thư mục gốc) | 0 lỗ hổng | T |
| SEC-06 | Site thật: `http://` → `https://`; `/.env`, `/.git/config`, `/docs/supabase-schema.sql` | Chuyển hướng HTTPS; các tệp kia 404 | L |
| SEC-07 | Code hiển thị chữ khách nhập ở trang admin/tra cứu | Dùng `textContent`, không ghép chữ khách vào `innerHTML` | Tay (đọc code mỗi lần sửa) |

---

## Lịch sử chạy

Ghi mỗi lần chạy đủ bộ: ngày, số case PASS/FAIL, lỗi đã sửa.

### 30/10/2026 — lần chạy đầu tiên

- **Vòng 1:** 94 case, PASS 88, FAIL 6.
  - Lỗi thật (2), đã sửa:
    - **ORD-05 (375px):** câu "Số điện thoại chưa đúng, ví dụ 0912345678." dài 2 dòng nên đẩy mọi ô bên dưới xuống 18px. Câu "Vui lòng đồng ý để nhà thuốc liên hệ và giao hàng trước khi gửi đơn." dài 3 dòng. Đã rút gọn: "SĐT chưa đúng, ví dụ 0912345678.", "Vui lòng nhập SĐT người đặt/nhận.", "Vui lòng đồng ý trước khi gửi đơn.". Test giờ đo thêm trường hợp để trống mọi ô và tự báo câu lỗi nào xuống dòng.
    - **SEO-01:** sitemap có 32 trang `noindex` (4 trang `/admin/`, `/tai-khoan/`, các bài "bản xem thử", trang tra cứu thuốc), vì bộ lọc chỉ loại `/gio-hang/`. Đã thêm bước sau build trong `astro.config.mjs`: đọc HTML đã build và bỏ khỏi sitemap mọi trang có `noindex` (205 → 173 URL).
  - Test viết sai (4), đã sửa test: UI-01 (trang `/404` vốn trả 404), UI-09 (ảnh trang trí `alt` rỗng là đúng), PRD-09 (bài vitamin đang *cảnh báo* người đọc về các chữ cấm), SEO-03 (ngày ghi bằng chữ "Đăng ngày…", không dùng thẻ `<time>`).
- **Vòng 2:** PASS 92, FAIL 2. ORD-05 báo sai ở ô đồng ý: chỗ báo lỗi của ô này lúc trống đã cao hơn `min-height`. Đã sửa test để so với chiều cao lúc chưa có lỗi.
- **Vòng 3 (cuối):** **94/94 PASS.** Chạy lại trên bản build cũ thì ORD-05 và SEO-01 FAIL đúng như mong đợi, tức là test bắt được lỗi. So ảnh 28 trang × 2 khổ (`run.mjs`): chỉ lệch 36-654 điểm ảnh ở ô tìm kiếm (chữ gợi ý tự gõ, nhiễu đã biết).
