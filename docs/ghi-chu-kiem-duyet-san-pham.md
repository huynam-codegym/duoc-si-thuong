# Ghi chú cho chủ website: sản phẩm thực phẩm chức năng

Tài liệu này KHÔNG được đăng lên website. Nó ghi lại những điểm cần bạn xác nhận trước khi để sản phẩm hiển thị cho khách.

## blackmores-omega-double-90-vien (sản phẩm ví dụ, tháng 9/2026)

Nguồn: bạn gửi ảnh chụp trang sản phẩm và đoạn mô tả từ website Long Châu. Tôi không lấy giá, khuyến mãi, đánh giá, huy hiệu "Chính hãng" hay ảnh của Long Châu.

**Việc bạn cần làm**
- **Ảnh sản phẩm:** đang dùng ảnh giữ chỗ. Cần ảnh chụp thật hộp sản phẩm của nhà thuốc (vuông, nền sáng, khoảng 900x900), thay vào `src/assets/products/blackmores-omega-double-90-vien/anh.jpg` và sửa `imageAlt`.
- **Giá:** chủ website đặt tạm 450.000 ₫ (trường `price`, số nguyên, đơn vị đồng) khi đưa bản xem thử lên web. Xác nhận lại giá thật của nhà thuốc. Giá 642.600 ₫ và giảm 10% trên trang Long Châu là của họ, không dùng lại.
- **Số công bố sản phẩm và số xác nhận quảng cáo:** điền `publicationNo` và `adConfirmationNo` từ hồ sơ của nhà phân phối. Chưa có thì để trống.
- **Đối chiếu nội dung với nhãn và hồ sơ công bố:** thành phần (1 g omega-3, 360 mg EPA, 240 mg DHA), dạng bào chế, cách dùng, đối tượng, cảnh báo dị ứng (cá, sulfites, đậu nành), điều kiện bảo quản.

**Những chỗ tôi đã sửa so với đoạn bạn gửi, và lý do**
- Viết lại bằng lời của website, không chép nguyên văn đoạn mô tả của Long Châu (có thể vướng bản quyền nội dung). Nếu nhà phân phối cung cấp tài liệu sản phẩm chính thức, nên dùng tài liệu đó.
- Bỏ các câu khẳng định mạnh không có nguồn trên trang này: "đã được chứng minh có vai trò...", "giảm nguy cơ các vấn đề về mắt và da", "giải pháp hiệu quả để bù đắp sự thiếu hụt", "thiếu hụt DHA có thể liên quan đến suy giảm trí nhớ", "lựa chọn lý tưởng, nâng cao sức khỏe toàn diện", "gấp đôi so với dầu cá thông thường" (so sánh với sản phẩm khác). Các câu này vi phạm nguyên tắc 1 và 4 trong CLAUDE.md, và có thể vướng quy định quảng cáo nếu không khớp với nội dung đã được xác nhận.
- Các câu về công dụng và mùi tanh được ghi rõ là "theo nhà sản xuất".
- Thêm lưu ý cho phụ nữ có thai, cho con bú, người có bệnh nền, người dùng thuốc ảnh hưởng đông máu (theo nguyên tắc 7 trong CLAUDE.md). Câu về thuốc đông máu là kiến thức chung của tôi, không có trong đoạn bạn gửi; dược sĩ cần xác nhận.

**Chưa làm theo mẫu Long Châu**
- Chọn đơn vị tính, thư viện nhiều ảnh, khuyến mãi, đánh giá, mục "Tìm nhà thuốc", chính sách đổi trả và miễn phí vận chuyển (đây là chính sách kinh doanh của họ, chỉ thêm khi nhà thuốc bạn có thật), thanh mua hàng cố định khi cuộn trang.

## com-vi-sinh-lacto-biomin-gold-hop-20-goi (tháng 9/2026)

Nguồn: bạn gửi 3 ảnh chụp hộp và gói sản phẩm (mặt trước), giá 149.000 ₫/hộp. Gắn vào nhóm "Tiêu hóa" (`thuc-pham-chuc-nang`/`tieu-hoa`) vì đây là nhóm sản phẩm liên quan tới tab "Tiêu chảy cấp" ở mục "Bệnh thường gặp theo mùa" trên trang chủ (xem `src/lib/seasonal.ts`).

**Trước khi thêm sản phẩm khác cùng loại, một điều quan trọng cần biết:** khi anh gửi sản phẩm **Enterogermina Gut Defense** trước đó, tôi nhận thấy mặt sau hộp có in "SĐK: QLSP-0728-13" và dòng "...xem hướng dẫn sử dụng **thuốc**" — đây là cách ghi thường dùng cho **thuốc đã đăng ký** (có số đăng ký thuốc), khác với thực phẩm chức năng (ghi "Số tiếp nhận đăng ký bản công bố sản phẩm"). Vì site **chưa có giấy phép kinh doanh dược qua thương mại điện tử** (xem CLAUDE.md, mục "Khu bán hàng"), tôi **chưa thêm sản phẩm Enterogermina này vào cửa hàng** — nhờ anh xác nhận lại đây là thuốc hay TPCN trước khi tôi thêm (nếu là thuốc thì không thể bán trực tuyến khi chưa có giấy phép). Sản phẩm Lacto Biomin Gold+ trong ảnh anh gửi có ghi rõ "Thực phẩm bảo vệ sức khỏe" trên bao bì nên tôi thêm sản phẩm này thay vào nhóm Tiêu hóa.

**Việc bạn cần làm**
- **Ảnh sản phẩm:** đã dùng ảnh hộp thật anh gửi (mặt trước). Nếu có ảnh đẹp hơn hoặc ảnh chụp riêng của nhà thuốc, gửi để thay.
- **Thành phần và liều dùng chi tiết:** ảnh gửi chỉ có mặt trước hộp và 1 gói lẻ, chưa thấy mặt sau (nơi thường ghi hàm lượng từng thành phần, liều dùng theo độ tuổi, số công bố sản phẩm, hạn dùng, nhà sản xuất/nhà phân phối). Trang sản phẩm đang ghi rõ "chưa có trong ảnh gửi tới" ở phần thành phần và cách dùng — gửi thêm ảnh mặt sau hoặc thông tin cụ thể để tôi điền đầy đủ và chính xác hơn.
- **Số công bố sản phẩm và số xác nhận quảng cáo:** điền `publicationNo` và `adConfirmationNo` khi có.
- **Thương hiệu "Bayer World":** đây là tên in trên bao bì (không phải hãng dược phẩm Bayer AG của Đức) — nhờ anh xác nhận đây đúng là nhà phân phối/thương hiệu hợp lệ của sản phẩm trước khi bán, vì tên gần giống một thương hiệu lớn có thể gây nhầm lẫn cho khách.
- **Giá 149.000 ₫/hộp:** đã điền đúng theo anh gửi.

**Những câu tôi giữ nguyên/diễn đạt lại từ bao bì**
- Các công dụng ("bổ sung lợi khuẩn...", "cải thiện tình trạng biếng ăn...", "hỗ trợ cải thiện hệ vi sinh đường ruột...") đều ghi rõ "theo nhà sản xuất", đúng nguyên văn ý trên bao bì, không thêm claim mạnh hơn (không viết "chữa", "khỏi", "hiệu quả tuyệt đối").
- Thêm lưu ý cho trẻ dưới 1 tuổi, người có bệnh nền, người dùng thuốc khác — theo nguyên tắc 7 trong CLAUDE.md, đây là lưu ý chung tôi thêm vào, dược sĩ cần xác nhận lại có đúng với sản phẩm này không.
