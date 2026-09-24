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

## feroglobin-b12, osteocare, siro-feroglobin-b12 (nhóm Vitabiotics, tháng 9/2026)

Nguồn: anh gửi ảnh chụp nhãn tiếng Việt đầy đủ (mặt sau hộp/vỏ hộp) cho cả 3 sản phẩm — thành phần, cách dùng, đối tượng, số công bố, nhà sản xuất/nhập khẩu/phân phối đều chép trực tiếp từ ảnh nhãn, không tự suy đoán hay lấy từ nguồn khác. Cả 3 đều của thương hiệu Vitabiotics (Anh), nhập khẩu bởi Công ty TNHH VE Pharma (Việt Nam). Giá do anh cho: Feroglobin B12 (viên) 363.000đ/Hộp, Osteocare 257.000đ/Hộp, Siro Feroglobin B12 358.000đ/Chai.

**Việc bạn cần làm**
- **Đối chiếu lại với hộp/chai thật:** tôi đọc thông tin từ ảnh chụp (độ phân giải có hạn ở vài chỗ chữ nhỏ), nên vẫn cần dược sĩ cầm hộp/chai thật đối chiếu lại toàn bộ, đặc biệt các số liệu hàm lượng.
- **Riêng Siro Feroglobin B12 — mục Cách dùng cho trẻ em cần kiểm tra kỹ:** nhãn ghi "Trẻ 3–12 tuổi: 1 thìa (10ml)/ngày" — chỉ 1 lần/ngày, không rõ có phải "1 thìa x 2-3 lần/ngày" (khớp với cách ghi trên nhãn tiếng Anh gốc, "1 teaspoonful 2-3 times daily") mà bị in/đọc nhầm hay không. Tôi đã transcribe đúng như đọc được trên ảnh và **đã thêm khuyến cáo hỏi bác sĩ/dược sĩ trước khi dùng cho trẻ nhỏ**, nhưng đây là liều dùng cho trẻ em nên **bắt buộc dược sĩ xác nhận lại đúng số lần/ngày với vỏ hộp thật** trước khi coi bài này là thông tin chính thức.
- **Nhóm "Vitamin tổng hợp":** tôi tạo nhóm mới này theo ảnh mẫu anh gửi (breadcrumb "Trang chủ/Thực phẩm chức năng/Vitamin tổng hợp"), xếp Siro Feroglobin B12 vào đây dù thành phần chính là sắt — vì sản phẩm có tới 11+ vitamin/khoáng chất kết hợp nên xếp vào "tổng hợp" hợp lý, nhưng nếu anh muốn xếp vào nhóm "Vitamin & khoáng chất" hoặc một nhóm khác thì báo tôi đổi lại `group` trong file sản phẩm.
- **Số công bố sản phẩm:** Feroglobin viên 9183/2019/ĐKSP, Osteocare 8615/2019/ĐKSP, Siro Feroglobin 8974/2019/ĐKSP — chép từ ảnh nhãn, chưa đối chiếu lại với cổng thông tin công bố sản phẩm của Bộ Y tế.
- **Ảnh sản phẩm:** ảnh chính của cả 3 sản phẩm đều được cắt ra từ ảnh quảng cáo có sẵn (ảnh gốc có kèm chữ quảng cáo/so sánh mẫu cũ-mới), không phải ảnh chụp riêng trên nền trắng chuẩn — nếu nhà thuốc có ảnh chụp thật đẹp hơn, gửi để thay.

## siro-feroglobin-b12, siro-osteocare (tháng 9/2026)

Cùng nguồn/thương hiệu Vitabiotics như trên, thêm 2 sản phẩm dạng siro. Giá anh cho: Siro Feroglobin B12 358.000đ/Chai, Siro Osteocare 311.000đ/Chai. Số công bố: Siro Feroglobin 8974/2019/ĐKSP, Siro Osteocare 9186/2019/ĐKSP.

- **siro-osteocare xếp cùng nhóm "Canxi & Vitamin D"** như bản viên nén Osteocare (anh ghi đường dẫn nhắc cả "Vitamin & Khoáng chất" lẫn "Canxi & Vitamin D" — tôi hiểu là xếp vào nhóm "Canxi & Vitamin D" cho nhất quán với sản phẩm Osteocare viên đã có, vì site chỉ có 1 cấp nhóm, không lồng 2 cấp. Báo tôi nếu ý anh khác.
- **siro-osteocare — liều dùng cho trẻ đọc rõ, không có điểm mơ hồ** như siro Feroglobin (nhãn ghi rõ theo từng mốc tuổi 1-3/4-8/từ 9 tuổi, khớp logic tăng dần theo tuổi).
- Ảnh chính của cả 2 sản phẩm là ảnh chụp thật (chai + hộp trên nền trắng), không phải ảnh cắt từ quảng cáo.

## wellbaby-multi-vitamin-liquid (tháng 9/2026) — ĐÃ ĐĂNG (anh gửi số công bố 10643/2019/ĐKSP, xác nhận đăng), vẫn cần dược sĩ rà lại

Cùng thương hiệu Vitabiotics, nhưng đây là sản phẩm dành cho **trẻ từ 4 tháng đến 4 tuổi** — nhạy cảm hơn hẳn các sản phẩm trước (người lớn/trẻ lớn). Giá anh cho: 412.000đ/Chai. Tôi **chủ động để `draft: true`** (khác với 4 sản phẩm trước đã tự đăng luôn khi có giá) vì 2 lý do:

1. **Không đọc rõ được nhãn phụ tiếng Việt** trên ảnh gửi (ảnh mờ hơn hẳn 4 sản phẩm trước, đặc biệt là số giấy tiếp nhận đăng ký bản công bố sản phẩm — để trống `publicationNo`, chưa dám đoán số). Thành phần và cách dùng tôi lấy từ **nhãn tiếng Anh** trên vỏ hộp (rõ hơn nhiều), nhưng chưa đối chiếu được với nhãn phụ tiếng Việt chính thức.
2. **Sản phẩm cho trẻ nhỏ (kể cả trẻ 4-6 tháng tuổi)** — liều dùng, đối tượng dùng cần dược sĩ/bác sĩ nhi khoa xác nhận kỹ trước khi đăng, không nên tự động lên web chỉ vì đã có giá.

**Việc anh cần làm trước khi đổi `draft: false`:**
- Gửi ảnh rõ hơn (chụp thẳng, đủ sáng) của nhãn phụ tiếng Việt mặt sau hộp, đặc biệt đoạn "Số giấy tiếp nhận đăng ký bản công bố sản phẩm" và tên/địa chỉ nhà sản xuất, nhập khẩu.
- Dược sĩ xác nhận lại liều dùng cho trẻ 4-6 tháng (2,5ml/ngày) và 7 tháng-4 tuổi (5ml/ngày) khớp đúng với nhãn phụ tiếng Việt (tôi lấy từ nhãn tiếng Anh, có thể lệch với bản dịch chính thức).

## liveril (tháng 9/2026)

Cùng thương hiệu Vitabiotics (Anh), nhập bởi VE Pharma. Nguồn: anh gửi ảnh quảng cáo (công dụng, xuất xứ, thành phần chính) và 1 ảnh nhãn phụ tiếng Việt đầy đủ ở mặt hộp, độ phân giải khá thấp (425x425px — đây là giới hạn thật của ảnh gửi, không phải do tôi nén). Giá anh cho: 441.000đ/Hộp. Tôi tạo mới nhóm **"Gan - Mật"** (icon tự vẽ mới, `liver`, vì trước đó site chưa có icon nào cho gan) theo đúng đường dẫn anh gửi.

**Việc anh cần làm**
- **Đối chiếu lại với hộp thật — đặc biệt quan trọng với sản phẩm này:** vì ảnh nhãn phụ chỉ 425x425px, tôi phải phóng to nhiều lần mới đọc được. Các thông tin sau đã đọc với độ tin cậy khá tốt sau khi phóng to (Công dụng, Cách dùng, Đối tượng sử dụng, số công bố 8719/2019/ĐKSP, Bảo quản) — nhưng **danh sách chi tiết 22 vitamin & khoáng chất khác kèm hàm lượng từng chất (ví dụ Vitamin C, L-Glutathione, kẽm, sắt, selen...) tôi CHƯA đưa số liệu chi tiết vào bài** vì đọc 2 lần cho ra 2 con số khác nhau ở một số chỗ (dấu hiệu ảnh quá mờ để đọc chính xác) — trường `ingredients` chỉ ghi 4 thành phần chính (Silymarin, Atiso, CoQ10, L-Carnitine) có độ tin cậy cao từ ảnh quảng cáo rõ nét, và ghi chung "cùng 22 vitamin & khoáng chất khác". Nếu muốn liệt kê đầy đủ hàm lượng từng chất, cần ảnh chụp rõ hơn hoặc đối chiếu hộp thật.
- **Danh sách phụ liệu** (chất độn, chất bao, chất tạo màu...) trong trường `ingredients` cũng đọc từ ảnh mờ tương tự — nên xem là tham khảo, chưa chắc chắn 100%.
- **Đối tượng sử dụng:** nhãn ghi "Người lớn từ 18 tuổi, bị các vấn đề về gan" — tôi viết lại thành "người trưởng thành... đang quan tâm hoặc gặp vấn đề về chức năng gan" kèm câu nhắc đi khám nếu nghi ngờ bệnh gan thật (tránh để người đọc tự chẩn đoán, theo nguyên tắc 2 trong CLAUDE.md).
- **Ảnh sản phẩm:** ảnh chính và các ảnh phụ đều cắt/dùng từ ảnh quảng cáo và ảnh nhãn anh gửi, không phải ảnh chụp riêng của nhà thuốc.

## pregnacare-plus-omega-3 (tháng 9/2026)

Cùng thương hiệu Vitabiotics (Anh). Nguồn: anh gửi 16 ảnh (ảnh quảng cáo, ảnh vỉ thuốc, 2 ảnh nhãn phụ tiếng Việt riêng biệt trên 2 mặt hộp, bảng thành phần tiếng Anh rõ nét, tờ rơi giới thiệu thương hiệu). Giá anh cho: 584.000đ/Hộp. Tên gốc trên nhãn là **"Pregnacare Plus Omega-3"** — tên thư mục anh gửi ghi "Perage plus" chỉ là cách gõ tắt/nghe nhầm, tôi dùng đúng tên in trên hộp.

**Việc anh cần làm**
- **Độ tin cậy nội dung cao hơn Liveril:** sản phẩm này có bảng thành phần tiếng Anh rất rõ nét (ảnh riêng, độ phân giải tốt) và 2 ảnh nhãn phụ tiếng Việt đọc được sau khi phóng to, đối chiếu chéo 2 ảnh cho kết quả khớp nhau — nên trường `ingredients` đã ghi đầy đủ hàm lượng từng vitamin/khoáng chất. Vẫn nên đối chiếu lại với hộp thật cho chắc chắn trước khi coi là chính thức.
- **Nhóm "Vitamin tổng hợp":** xếp theo đúng đường dẫn anh gửi. Lưu ý sản phẩm này **dành riêng cho phụ nữ mang thai/cho con bú**, về mặt nội dung sẽ hợp với nhóm có sẵn "Phụ nữ & mẹ bầu" hơn — nếu muốn chuyển nhóm, báo tôi đổi `group` trong file sản phẩm (chỉ 1 dòng, không ảnh hưởng nội dung khác).
- **Số công bố sản phẩm:** 9184/2019/ĐKSP — đọc từ ảnh nhãn phụ tiếng Việt (đã phóng to, khá rõ), số này sát với số của Feroglobin viên (9183/2019/ĐKSP) nên hợp lý vì có thể cùng đợt nộp hồ sơ, nhưng vẫn nên đối chiếu lại với hộp thật.
- **Lưu ý dị ứng cá và đậu nành:** tôi thêm câu cảnh báo này dựa trên dòng "Allergy Advice" đọc được trên bảng thành phần tiếng Anh (dầu cá trong viên nang, vitamin E nguồn gốc đậu nành/Soya) — dược sĩ xác nhận lại câu này diễn đạt đúng và đủ.
- **Đây là sản phẩm "dual pack"** (2 loại viên dùng cùng ngày: 1 viên nén vỉ xanh + 1 viên nang Omega-3 vỉ hồng) — khác cấu trúc với các sản phẩm 1-loại-viên trước đó trên site; trang chi tiết hiện ghi rõ điều này ở mục "Cách dùng", nhờ dược sĩ đọc lại xem diễn đạt có dễ hiểu không.
- **Ảnh sản phẩm:** dùng ảnh quảng cáo, ảnh vỉ thuốc và ảnh nhãn anh gửi (17 ảnh + video), không phải ảnh chụp riêng của nhà thuốc.

## pregnacare-max (tháng 9/2026)

Cùng thương hiệu Vitabiotics (Anh), cùng dòng sản phẩm với Pregnacare Plus Omega-3 ở trên nhưng là bản **"Max" — công thức nâng cao hơn** (có thêm canxi 500mg/ngày và dùng acid folic dạng L-Methylfolate thay vì chỉ acid folic thường). Nguồn: anh gửi 13 ảnh (ảnh quảng cáo, ảnh vỉ thuốc, 2 ảnh nhãn phụ tiếng Việt — ảnh thứ 2 rõ hơn hẳn ảnh đầu nên tôi dùng ảnh đó để đối chiếu số liệu, bảng thành phần tiếng Anh rõ nét, tờ rơi giới thiệu thương hiệu). Giá anh cho: 495.000đ/Hộp, khuyến mãi -10% từ giá gốc 550.000đ.

**Việc anh cần làm**
- **Đây là sản phẩm khuyến mãi ĐẦU TIÊN của site** (tính năng `originalPrice`/nhãn "-X%" mới thêm) — kiểm tra lại giao diện thẻ sản phẩm và trang chi tiết đúng như ảnh mẫu anh gửi. Đợt khuyến mãi có hạn kết thúc hay không tôi chưa rõ nên **chưa thêm dòng chữ kiểu "áp dụng đến ngày..."** — nếu khuyến mãi có ngày kết thúc cụ thể, báo tôi bổ sung.
- **Độ tin cậy nội dung:** cao, tương tự Pregnacare Plus — có bảng thành phần tiếng Anh rõ nét và ảnh nhãn phụ tiếng Việt thứ 2 (ảnh 13) đọc rất rõ sau khi phóng to, khớp với bảng tiếng Anh. Vẫn nên đối chiếu lại với hộp thật cho chắc chắn.
- **Số công bố sản phẩm:** 1475/2024/ĐKSP — đọc từ ảnh nhãn phụ tiếng Việt rõ (ảnh 13, đã phóng to), khác hẳn dải số 2019 của các sản phẩm Vitabiotics trước đó (hợp lý vì có thể đăng ký sau). Ảnh nhãn đầu tiên (ảnh 10) mờ hơn nên lúc đầu tôi đọc nhầm ra một số gần giống nhưng khác — nếu có sản phẩm Vitabiotics nào sau này chỉ có 1 ảnh nhãn mờ mà không có ảnh đối chiếu, nên xin ảnh rõ hơn thay vì tự tin dùng số đọc được từ ảnh mờ.
- **Nhóm "Vitamin tổng hợp":** xếp theo đúng đường dẫn anh gửi, cùng lưu ý như Pregnacare Plus — sản phẩm dành riêng cho phụ nữ mang thai/cho con bú, có thể hợp với nhóm "Phụ nữ & mẹ bầu" hơn.
- **Lưu ý dị ứng và cảnh báo:** thêm cảnh báo dị ứng cá/đậu nành/có thể lẫn các loại hạt (đọc từ nhãn: "được sản xuất tại một cơ sở có thể chế biến các loại hạt"), cảnh báo vitamin K với thuốc chống đông máu, và cảnh báo sản phẩm có chứa sắt cần để xa tầm tay trẻ em (đọc trực tiếp từ nhãn, không phải tôi tự suy đoán).
- **Ảnh sản phẩm:** dùng ảnh quảng cáo, ảnh vỉ thuốc và ảnh nhãn anh gửi (13 ảnh + video), không phải ảnh chụp riêng của nhà thuốc. Video chưa có sẵn logo (khác với video Liveril/Pregnacare Plus có sẵn khung tên "Dược Sĩ Thương") nhưng trang tự phủ logo lên như các sản phẩm có video khác, không cần làm gì thêm.
