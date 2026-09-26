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

## visionace-original (tháng 9/2026)

Cùng thương hiệu Vitabiotics (Anh), nhập bởi VE Pharma. Tên thư mục anh gửi ghi "Visionase", tên thật in trên hộp là **Visionace Original** — tôi dùng đúng tên trên hộp. Giá anh cho: 432.000đ/Hộp. Xếp vào nhóm sẵn có **"Mắt & thị lực"** (anh ghi "Mắt - Thị lực" — tôi hiểu là cùng nhóm này, không tạo nhóm trùng; báo tôi nếu muốn đổi tên nhóm).

**Việc anh cần làm**
- **SỐ CÔNG BỐ SẢN PHẨM ĐỂ TRỐNG (`publicationNo`):** chỉ có 1 ảnh nhãn phụ tiếng Việt, rất mờ (425x425px). Tôi đọc được dạng "1737/2024/ĐKSP" nhưng chữ số ở giữa không chắc chắn (hai lần phóng to cho cùng kết quả nhưng vẫn có thể nhầm 1/7). Đây là số đăng ký chính thức nên **không dám điền đoán** (nguyên tắc 1 và 10 trong CLAUDE.md). Anh đọc số trên hộp thật rồi báo lại, hoặc gửi ảnh nhãn rõ hơn để tôi điền.
- **Chỉ ghi 4 thành phần chính + "19 vitamin & khoáng chất khác"** (đọc rõ từ ảnh quảng cáo: vitamin A 300mcg RE, lutein 4mg, kẽm 15mg, chiết xuất việt quất 60mg). Bảng hàm lượng chi tiết từng vitamin trên nhãn phụ mờ nên tôi không đưa vào (cùng cách xử lý như Liveril). Dược sĩ đối chiếu hộp thật nếu muốn liệt kê đầy đủ.
- **Cảnh báo đọc từ nhãn phụ tiếng Việt (đã phóng to, khá rõ):** vitamin A không dùng khi có thai/có khả năng có thai; hỏi ý kiến bác sĩ nếu động kinh, bệnh tuyến giáp, bệnh tan máu bẩm sinh; có sắt; không phù hợp trẻ em; vitamin E nguồn gốc đậu nành; cơ sở sản xuất có thể chế biến các loại hạt. Nhờ dược sĩ xác nhận diễn đạt đúng.
- **Cách dùng "1 viên/ngày sau ăn":** khớp với chữ trên vỉ thuốc (ONE PER DAY WITH YOUR MAIN MEAL) và nhãn phụ.
- **Ảnh chính:** cắt từ ảnh quảng cáo (không phải ảnh chụp riêng của nhà thuốc).

## pregnacare-breast-feeding (tháng 9/2026)

Cùng dòng Pregnacare của Vitabiotics, dành cho **phụ nữ đang cho con bú** (sau sinh). Giá anh cho: 712.000đ/Hộp. Xếp nhóm "Vitamin tổng hợp" theo đúng đường dẫn anh gửi (giống Pregnacare Plus/Max — nội dung sẽ hợp với nhóm "Phụ nữ & mẹ bầu" hơn, báo tôi nếu muốn chuyển).

**Việc anh cần làm**
- **Độ tin cậy nội dung cao:** ảnh nhãn phụ tiếng Việt (ảnh 8) đọc rất rõ sau khi phóng to — toàn bộ hàm lượng từng vi chất, cách dùng, cảnh báo, số công bố **10645/2019/ĐKSP** đều chép trực tiếp từ đây, khớp với ảnh quảng cáo (canxi 700mg/2 viên = 350mg x 2; DHA 300mg; EPA 60mg). Vẫn nên đối chiếu hộp thật.
- **Hàm lượng ghi theo TỪNG VIÊN nén** (đúng như nhãn tiếng Việt); ảnh quảng cáo ghi theo 2 viên (liều dùng hằng ngày) — bài có ghi rõ cả hai cách để không nhầm.
- **Cảnh báo:** động kinh, bệnh tuyến giáp, bệnh nhiễm sắc tố sắt, vitamin K với thuốc chống đông (warfarin), sắt với trẻ nhỏ — đều đọc từ nhãn. Câu cảnh báo dị ứng cá là lưu ý chung tôi thêm vì viên nang từ dầu cá, dược sĩ xác nhận lại.
- **Ảnh chính:** cắt từ ảnh quảng cáo (không phải ảnh chụp riêng của nhà thuốc).

## doppelherz-aktiv-vital-pregna, doppelherz-aktiv-anti-stress, doppelherz-aktiv-omega-3 (tháng 9/2026)

Thương hiệu **Doppelherz (Đức)**, sản xuất bởi Queisser Pharma GmbH & Co. KG (Flensburg), do **Công ty CP Mastertran** chịu trách nhiệm/nhập khẩu/phân phối. Khác 9 sản phẩm Vitabiotics ở trên (không có video, chỉ có ảnh — theo yêu cầu). Giá anh cho: Vital Pregna 375.000đ, Anti Stress 349.000đ, Omega-3 335.000đ (đều Hộp 30 viên). Số công bố: 7218/2019/ĐKSP, 4045/2023/ĐKSP, 6764/2022/ĐKSP.

**Việc anh cần làm**
- **Ảnh — đã LOẠI các ảnh quảng cáo có logo "Nhà thuốc Long Châu":** trong mỗi thư mục anh gửi, các ảnh banner (công dụng, cách dùng, thành phần...) đều in logo Long Châu ở góc trên. Theo nguyên tắc của site (không dùng ảnh/thương hiệu của website khác), tôi **chỉ dùng ảnh hộp, ảnh vỉ thuốc và ảnh nhãn phụ sạch** (mỗi sản phẩm 5 ảnh). Nếu nhà thuốc có banner của chính mình hoặc của hãng/nhà phân phối (Mastertran) không có logo bên thứ ba, gửi để bổ sung. Nhờ anh cũng kiểm tra bản quyền các ảnh hộp/vỉ này (nguồn ảnh có vẻ lấy từ trang khác).
- **Anti Stress — công dụng KHÔNG phải "bổ não, cải thiện trí nhớ":** anh ghi đường dẫn "Thần kinh não / Bổ não - cải thiện trí nhớ", nhưng nhãn chỉ ghi "hỗ trợ giảm căng thẳng và hỗ trợ khả năng tập trung". Tôi viết đúng theo nhãn, không ghi "cải thiện trí nhớ" (không có trên nhãn, vi phạm nguyên tắc 1 và 4). Xếp nhóm sẵn có "Thần kinh & trí nhớ".
- **Nhóm "Vitamin tổng hợp" cho Vital Pregna và Omega-3:** xếp theo đúng đường dẫn anh gửi. Vital Pregna (dành cho phụ nữ mang thai/cho con bú) hợp nhóm "Phụ nữ & mẹ bầu" hơn; Omega-3 (dầu cá) hợp nhóm "Tim mạch" hơn — báo tôi nếu muốn chuyển.
- **Độ tin cậy nội dung cao:** nhãn phụ tiếng Việt của cả 3 sản phẩm đọc rõ sau khi phóng to (hàm lượng, cách dùng, cảnh báo, số công bố đều chép từ nhãn). Vẫn nên đối chiếu hộp thật.
- **Omega-3:** hàm lượng nhãn ghi theo **2 viên** (liều 1 ngày), bài giữ đúng cách ghi này. Câu lưu ý thuốc chống đông/phẫu thuật là kiến thức chung tôi thêm (không in trên nhãn), đã ghi rõ trong bài — dược sĩ cần xác nhận.
- **Anti Stress:** cảnh báo tương tác (thuốc chống đông coumarin, thuốc chuyển hóa ở gan), không dùng cho trẻ em/thanh thiếu niên/phụ nữ có thai/cho con bú — đều đọc từ nhãn (chữ nhỏ, đã phóng to).

**Cập nhật ảnh 3 sản phẩm Doppelherz (tháng 9/2026):** thay vì dùng banner có logo Long Châu, tôi **tự thiết kế 3 banner cho mỗi sản phẩm** (công dụng và đối tượng / thành phần chính / cách dùng và lưu ý) theo phong cách Dược Sĩ Thương (logo Dược Sĩ Thương ở đầu ảnh, nền xanh). Chữ trong banner chỉ dùng thông tin in trên nhãn sản phẩm (đúng như phần nội dung bài), không thêm lời quảng cáo của bên thứ ba. Banner đặt ngay sau ảnh chính (`anh-2`, `anh-3`, `anh-4`), các ảnh vỉ/nhãn gốc lùi xuống `anh-5`–`anh-8`. Ảnh dựng bằng HTML rồi chụp (không lưu file nguồn trong repo); muốn sửa nội dung banner thì báo tôi làm lại. Ảnh hộp trong banner vẫn là ảnh anh gửi (cần kiểm tra bản quyền ảnh hộp như đã ghi ở trên).

## 6 sản phẩm Doppelherz đợt 2 (tháng 9/2026): Liver Complex, Aktiv-Meno, Magnesium + Calcium + D3, Coenzyme Q10, Kinder Omega-3 Syrup, Kinder Optima Mini-Tabs

Thương hiệu Doppelherz (Đức), sản xuất bởi Queisser Pharma, do Công ty CP Mastertran nhập khẩu/phân phối. Không có video (theo yêu cầu). Giá anh cho: Liver Complex 395.000đ, Aktiv-Meno 411.000đ, Mg+Ca+D3 375.000đ, Coenzyme Q10 375.000đ, Kinder Omega-3 535.000đ (chai 250ml), Kinder Optima 506.000đ (hộp 20 gói).

**Ảnh:** như đợt trước, **bỏ hết banner có logo Nhà thuốc Long Châu**; mỗi sản phẩm có **3 banner tự thiết kế** mang logo Dược Sĩ Thương (công dụng và đối tượng / thành phần chính / cách dùng và lưu ý, chỉ dùng thông tin trên nhãn) đặt sau ảnh hộp chính, tiếp theo là ảnh hộp+vỉ, vỉ thuốc và ảnh nhãn phụ gốc. Ảnh hộp/vỉ/nhãn là ảnh anh gửi — nhờ anh kiểm tra bản quyền.

**Việc anh cần làm**
- **Số công bố ĐỂ TRỐNG (`publicationNo`) cho 2 sản phẩm:** *Coenzyme Q10* (ảnh nhãn mờ, đọc được dạng "8117/2019/ĐKSP" nhưng chưa chắc từng chữ số) và *Kinder Omega-3 Syrup* (tờ nhãn phụ tiếng Việt anh gửi không in số công bố). Anh đọc số trên hộp thật rồi báo tôi điền. Các sản phẩm còn lại đọc rõ: Liver Complex 1476/2023, Aktiv-Meno 4969/2022, Mg+Ca+D3 4404/2023, Kinder Optima 6594/2024 (đều /ĐKSP).
- **Nhóm mới "Sinh lý - Nội tiết tố"** (icon hoa, tạo theo đường dẫn anh gửi) cho Aktiv-Meno. Các nhóm còn lại dùng nhóm có sẵn: "Tim mạch - Huyết áp" → nhóm **Tim mạch**; "Miễn dịch - Đề kháng" → nhóm **Đề kháng & miễn dịch**; "Thần kinh não" → **Thần kinh & trí nhớ**. Báo tôi nếu muốn đổi tên nhóm cho đúng từng chữ như anh ghi.
- **Kinder Omega-3 — KHÔNG đưa vào bài câu "có tác dụng tích cực ở trẻ rối loạn tăng động thiếu tập trung (ADHD)"** dù in trên nhãn, vì là tuyên bố liên quan đến bệnh lý (nguyên tắc 4 trong CLAUDE.md). Bài ghi: hỗ trợ phát triển não bộ, hỗ trợ thị lực, phòng ngừa thiếu vi chất, tăng cường miễn dịch. Anh ghi đường dẫn "Bổ não - cải thiện trí nhớ" nhưng nhãn không nói "cải thiện trí nhớ" nên tôi không ghi. Liều theo tuổi (7,5ml / 15ml / 30ml mỗi ngày) chép đúng nhãn kèm khuyến cáo hỏi bác sĩ/dược sĩ — **dược sĩ nên xác nhận lại liều cho trẻ với vỏ hộp thật**. Trên tờ nhãn có in cả câu "Người gặp các vấn đề về mắt..." trong mục đối tượng, tôi giữ ghi "theo nhãn".
- **Aktiv-Meno:** nhãn có câu "bổ sung calci hỗ trợ giảm nguy cơ loãng xương" — tôi chỉ ghi "bổ sung canxi" (không nêu giảm nguy cơ bệnh). Các câu về triệu chứng mãn kinh ghi rõ "theo nhà sản xuất"; đã thêm cảnh báo khối u phụ thuộc estrogen đúng như nhãn.
- **Coenzyme Q10:** nhãn ghi đối tượng "người mắc các bệnh về tim mạch" — tôi diễn đạt lại thành "người quan tâm đến sức khỏe tim mạch" kèm nhắc hỏi bác sĩ, không tự ngừng thuốc. Câu lưu ý thuốc chống đông là kiến thức chung tôi thêm, dược sĩ xác nhận.
- **Mg+Ca+D3, Coenzyme Q10:** một số câu lưu ý (bệnh thận/sỏi thận, thuốc chống đông) là lưu ý chung tôi thêm, đã ghi rõ trong bài — dược sĩ xác nhận.
- **Kinder Optima:** dạng "cốm" theo cách gọi trên banner/tài liệu; nhãn ghi "hạt cốm" đổ trực tiếp lên lưỡi. Có chất tạo ngọt sucralose và lecithin đậu nành; cảnh báo dùng quá liều có thể nhuận tràng đọc từ nhãn.
- **Độ tin cậy nội dung:** cao (nhãn phụ tiếng Việt đọc rõ sau khi phóng to). Vẫn nên đối chiếu hộp thật.
