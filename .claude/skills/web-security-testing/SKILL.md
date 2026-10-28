---
name: web-security-testing
description: Dùng khi cần lập test case, kiểm thử hoặc review bảo mật cho website/web API (theo OWASP), xuất checklist hoặc báo cáo lỗ hổng.
---

# Kiểm thử bảo mật website

Skill này hướng dẫn lập test case và thực hiện kiểm thử bảo mật cho mọi loại website / web API, dựa trên OWASP Top 10 và OWASP WSTG. Áp dụng cho cả black-box (chỉ có URL) và white-box (có source code).

## Bước 0 — Xác nhận phạm vi (BẮT BUỘC trước khi test)

Hỏi hoặc xác nhận với người dùng:
1. **Quyền test**: website thuộc sở hữu của họ hoặc có văn bản cho phép. Nếu không rõ → chỉ lập test case, không thực hiện test trên hệ thống thật.
2. **Môi trường**: ưu tiên staging/dev. Nếu là production → chỉ test không phá hủy (read-only, không spam, không DoS).
3. **Đầu vào có sẵn**: URL, tài khoản test (các role khác nhau), tài liệu API, source code, danh sách chức năng.
4. **Đầu ra mong muốn**: (a) bảng test case để QA chạy tay, (b) review source code, (c) báo cáo kết quả sau khi test.

Nếu người dùng không trả lời được → mặc định lập bảng test case đầy đủ (đầu ra a).

## Bước 1 — Thu thập thông tin ứng dụng

Liệt kê trước khi viết test case:
- Các chức năng: đăng ký, đăng nhập, quên mật khẩu, profile, upload, thanh toán, tìm kiếm, admin…
- Các role người dùng và quyền của từng role
- Danh sách endpoint/API, tham số, phương thức HTTP
- Công nghệ (framework, DB, server, CDN) nếu biết
- Dữ liệu nhạy cảm hệ thống xử lý (thông tin cá nhân, thẻ, token)

Chỉ sinh test case cho chức năng thực sự có. Không đưa test case thừa (ví dụ: không có upload thì bỏ nhóm FILE).

## Bước 2 — Danh mục test case

Mỗi test case gồm: **ID, Nhóm, Tên, Tiền điều kiện, Các bước, Kết quả mong đợi, Mức độ**.

### AUTH — Xác thực
- AUTH-01: Đăng nhập sai mật khẩu nhiều lần → có khóa tạm/CAPTCHA/rate limit.
- AUTH-02: Thông báo lỗi đăng nhập không tiết lộ username/email có tồn tại hay không.
- AUTH-03: Chính sách mật khẩu (độ dài tối thiểu, chặn mật khẩu phổ biến).
- AUTH-04: Quên mật khẩu: token ngẫu nhiên, hết hạn, dùng 1 lần, không lộ trong URL bên thứ ba.
- AUTH-05: Đổi mật khẩu/email yêu cầu nhập lại mật khẩu cũ.
- AUTH-06: Trang đăng nhập và mọi form nhạy cảm chỉ qua HTTPS.
- AUTH-07: MFA (nếu có) không bị bỏ qua bằng cách gọi thẳng bước sau.

### SESS — Phiên làm việc
- SESS-01: Cookie phiên có `Secure`, `HttpOnly`, `SameSite`.
- SESS-02: Session ID thay đổi sau khi đăng nhập (chống session fixation).
- SESS-03: Đăng xuất hủy phiên phía server (dùng lại cookie/token cũ → bị từ chối).
- SESS-04: Phiên hết hạn sau thời gian không hoạt động.
- SESS-05: JWT (nếu có): kiểm tra chữ ký, không chấp nhận `alg: none`, có `exp`, không chứa dữ liệu nhạy cảm.

### ACC — Phân quyền (Access Control)
- ACC-01: IDOR — đổi ID trong URL/body (ví dụ `/orders/123` → `/orders/124`) bằng tài khoản khác → bị từ chối.
- ACC-02: User thường truy cập trực tiếp URL/API admin → 403.
- ACC-03: Chưa đăng nhập truy cập trang/API cần đăng nhập → chuyển login hoặc 401.
- ACC-04: Sửa field quyền trong request (`role`, `is_admin`, `price`, `user_id`) → server bỏ qua (mass assignment).
- ACC-05: Đổi phương thức HTTP (GET↔POST↔PUT↔DELETE) không vượt qua được kiểm tra quyền.
- ACC-06: Ẩn nút trên UI không phải là cơ chế phân quyền — kiểm tra API tương ứng.

### INP — Kiểm tra đầu vào / Injection
- INP-01: SQL Injection — nhập ký tự đặc biệt (`'`, `"`, `--`) vào form/tham số → không lỗi SQL, không thay đổi kết quả bất thường.
- INP-02: XSS phản xạ — nhập chuỗi HTML/script vào tham số tìm kiếm → được escape khi hiển thị.
- INP-03: XSS lưu trữ — nhập vào bình luận/profile/tên → được escape ở mọi nơi hiển thị (kể cả trang admin, email).
- INP-04: Validate phía server (bỏ validate client bằng cách sửa request → server vẫn chặn).
- INP-05: Giới hạn độ dài, kiểu dữ liệu, giá trị âm/rất lớn.
- INP-06: Open redirect — tham số `redirect`/`next`/`url` không chuyển sang domain ngoài.
- INP-07: Command/Template/LDAP/NoSQL injection ở các chức năng tương ứng (nếu có).
- INP-08: SSRF — chức năng nhận URL (import, preview link, webhook) không truy cập được địa chỉ nội bộ.

### CSRF — Giả mạo request
- CSRF-01: Request thay đổi dữ liệu có CSRF token hoặc cookie `SameSite` phù hợp.
- CSRF-02: Bỏ/sửa token → request bị từ chối.
- CSRF-03: CORS không cho phép origin tùy ý kèm credentials.

### FILE — Upload / Download
- FILE-01: Chỉ chấp nhận đúng loại file (kiểm tra cả nội dung, không chỉ đuôi).
- FILE-02: Upload file script (.php, .jsp, .html, .svg chứa script) → bị chặn hoặc không thực thi được.
- FILE-03: Giới hạn dung lượng file.
- FILE-04: Tên file được đổi/làm sạch; không path traversal (`../`).
- FILE-05: File riêng tư không truy cập được qua URL trực tiếp khi không có quyền.

### CONF — Cấu hình
- CONF-01: HTTPS bắt buộc, HTTP chuyển hướng sang HTTPS, có HSTS.
- CONF-02: Security headers: `Content-Security-Policy`, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`.
- CONF-03: Không lộ phiên bản server/framework trong header hoặc trang lỗi.
- CONF-04: Tắt debug mode, directory listing trên production.
- CONF-05: Không truy cập được file nhạy cảm: `.env`, `.git/`, backup (`.bak`, `.zip`, `.sql`), file cấu hình, phpinfo.
- CONF-06: Trang admin/công cụ quản trị (DB admin, dashboard) không public.
- CONF-07: TLS không hỗ trợ giao thức/cipher cũ.

### DATA — Dữ liệu nhạy cảm
- DATA-01: API không trả thừa trường nhạy cảm (password hash, token, thông tin user khác).
- DATA-02: Mật khẩu được hash bằng thuật toán mạnh (bcrypt/argon2) — white-box.
- DATA-03: Không có dữ liệu nhạy cảm trong URL, log, localStorage, mã nguồn frontend (API key, secret).
- DATA-04: Trang chứa dữ liệu nhạy cảm có `Cache-Control: no-store`.

### ERR — Xử lý lỗi
- ERR-01: Trang lỗi 404/500 không hiển thị stack trace, đường dẫn, câu SQL.
- ERR-02: Request sai định dạng (JSON hỏng, thiếu tham số) → trả lỗi chung, không crash.

### BIZ — Logic nghiệp vụ
- BIZ-01: Sửa giá, số lượng, mã giảm giá trong request → server tính lại.
- BIZ-02: Bỏ qua bước trong luồng nhiều bước (ví dụ nhảy thẳng tới bước xác nhận thanh toán).
- BIZ-03: Race condition — gửi đồng thời request dùng mã giảm giá/rút tiền/vote → chỉ hợp lệ 1 lần.
- BIZ-04: Rate limit cho chức năng gửi email/SMS/OTP.

### API — Web API
- API-01: Mọi endpoint đều yêu cầu xác thực phù hợp (kể cả endpoint cũ, `/v1`, endpoint ẩn).
- API-02: Rate limiting.
- API-03: Tài liệu API (Swagger, GraphQL introspection) không public trên production nếu không cần.
- API-04: Phân trang có giới hạn (không lấy toàn bộ dữ liệu bằng `limit=999999`).

### DEP — Thư viện phụ thuộc
- DEP-01: Quét lỗ hổng thư viện (`npm audit`, `composer audit`, `pip-audit`, OWASP Dependency-Check…).
- DEP-02: Không dùng thư viện frontend lỗi thời có CVE đã biết.

### LOG — Ghi log & giám sát
- LOG-01: Ghi log đăng nhập thất bại, thay đổi quyền, thao tác admin.
- LOG-02: Log không chứa mật khẩu, token, số thẻ.

## Bước 3 — Mức độ

| Mức | Ý nghĩa |
|---|---|
| Critical | Chiếm quyền hệ thống/admin, đọc/sửa toàn bộ dữ liệu, RCE, SQLi khai thác được |
| High | Truy cập dữ liệu người khác (IDOR), XSS lưu trữ, bypass xác thực |
| Medium | CSRF, XSS phản xạ, thiếu rate limit đăng nhập, lộ thông tin cấu hình |
| Low | Thiếu security header, lộ phiên bản, thông báo lỗi chi tiết |
| Info | Gợi ý cải thiện, không khai thác trực tiếp được |

## Bước 4 — Định dạng đầu ra

### Bảng test case (khi lập kế hoạch)
Một bảng (sheet/CSV/Markdown) với các cột:
`ID | Nhóm | Tên test case | Tiền điều kiện | Các bước | Kết quả mong đợi | Mức độ | Kết quả thực tế | Trạng thái (Pass/Fail/N/A) | Ghi chú`

Để trống cột Kết quả thực tế và Trạng thái cho QA điền.

### Báo cáo (sau khi test)
1. Tóm tắt: số test case, số Pass/Fail, số lỗi theo mức độ.
2. Danh sách lỗi sắp theo mức độ, mỗi lỗi gồm: ID, mô tả, URL/endpoint, bước tái hiện, bằng chứng (request/response đã che dữ liệu nhạy cảm), ảnh hưởng, đề xuất sửa.
3. Các mục chưa test được và lý do.

### Review source code (white-box)
Với mỗi phát hiện: file + dòng, đoạn code liên quan, nhóm test case tương ứng, mức độ, cách sửa cụ thể.

## Công cụ gợi ý
- Proxy/scan: OWASP ZAP, Burp Suite Community
- Header/TLS: securityheaders.com, SSL Labs, testssl.sh
- Thư viện: npm audit, composer audit, pip-audit, Trivy, OWASP Dependency-Check
- Trình duyệt: DevTools (Network, Application/Cookies)

## Nguyên tắc
- Chỉ test hệ thống có quyền. Không test tài khoản/dữ liệu của người dùng thật — dùng tài khoản test.
- Không thực hiện tấn công phá hủy: không DoS/brute-force quy mô lớn, không xóa/sửa dữ liệu thật.
- Gặp lỗi Critical → dừng khai thác sâu hơn, báo ngay cho người dùng.
- Không lưu mật khẩu, token, secret phát hiện được vào file báo cáo — che đi (`****`).
- Không chỉ dựa vào scanner tự động: luôn kiểm tra tay nhóm ACC và BIZ vì scanner thường bỏ sót.
