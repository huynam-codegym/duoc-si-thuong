# Ghi chú cho người kiểm duyệt: các bài về nhóm thuốc

Tài liệu này KHÔNG được đăng lên website. Nó liệt kê, với từng bài nháp, những nhận định **nằm ngoài phần đã đối chiếu trực tiếp với nguồn được dẫn** (kiến thức chung, do AI soạn), để dược sĩ/bác sĩ kiểm tra kỹ trước khi đăng.

Cách duyệt một bài: đọc nội dung, kiểm tra các mục bên dưới, sửa trực tiếp trong file `src/content/posts/<tên-bài>.md`, rồi điền `reviewedBy` (tên người kiểm duyệt) và đổi `draft: false`.

Trạng thái: cả 10 bài đã đăng ở dạng "bản xem thử" (có khung vàng, `noindex`). Cách hoàn tất một bài: xem mục "Khi dược sĩ đã rà soát một bài" trong CLAUDE.md.

Xem bài ở máy: `npm run dev` rồi mở http://localhost:4321/kien-thuc-ve-thuoc/ (bản chạy thử hiện cả bài nháp).

## Nguồn đã đối chiếu (đọc trực tiếp nội dung trang)

- MedlinePlus: Antibiotics, Pain Relievers, Cold and Cough Medicines, Steroids, Blood Pressure Medicines, Diabetes Medicines, Over-the-Counter Medicines.
- FDA: The Over-the-Counter Drug Facts Label.
- WHO: Hypertension, Diabetes, Antimicrobial resistance (không nêu trực tiếp lời khuyên dùng thuốc, xem mục kháng sinh).

Các trang MedlinePlus Antibiotics, Heartburn, GERD, Allergy, Vitamins, Dietary Supplements và WHO Antimicrobial resistance đã kiểm tra đường dẫn còn truy cập được, nhưng nội dung chi tiết chưa được đối chiếu từng câu.

Nguồn quốc tế; **chưa có nguồn Việt Nam** (Bộ Y tế, Dược thư quốc gia, Cục Quản lý Dược). Nên bổ sung để hợp với thực tế thuốc lưu hành tại Việt Nam.

## Việc chung cần kiểm tra ở mọi bài

- Tên hoạt chất, ví dụ nêu trong bài có còn lưu hành/thông dụng tại Việt Nam không.
- Bài **không đưa liều cụ thể** (cố ý). Xem có cần thêm khoảng liều tham khảo chung hay không.
- Mục "Khi nào cần đi khám/cấp cứu" có đủ và phù hợp thực hành ở Việt Nam (số 115).
- Lưu ý nhóm đặc biệt: trẻ em, phụ nữ có thai, cho con bú, người cao tuổi, bệnh nền.

## Từng bài

### paracetamol-va-ibuprofen-dung-an-toan (Giảm đau, hạ sốt)
- Đã có nguồn: paracetamol quá liều gây hại gan; dùng trùng vì nhiều thuốc chứa paracetamol; NSAID gây buồn nôn, đau dạ dày, loét; hỏi bác sĩ nếu dùng quá 10 ngày (5 ngày ở trẻ em); không cho trẻ dùng aspirin (từ trang thuốc ho, cảm cúm).
- Cần kiểm tra thêm: ibuprofen ảnh hưởng thận, huyết áp, hen; tránh NSAID khi mang thai; ibuprofen uống cùng bữa ăn; "sốt ở trẻ còn rất nhỏ cần bác sĩ khám" (ngưỡng tuổi cụ thể nên bổ sung); dấu hiệu quá liều paracetamol có thể xuất hiện muộn.
- Câu "10 ngày/5 ngày" gốc từ nguồn nói riêng về paracetamol; bài mở rộng cho thuốc giảm đau nói chung.

### thuoc-khang-viem-nsaid-va-corticoid (Thuốc kháng viêm)
- Đã có nguồn: corticoid giảm viêm và ảnh hưởng miễn dịch; dùng trong thời gian ngắn nhất có thể; tác dụng phụ như loãng xương, đục thủy tinh thể; không tự ngưng, cần hướng dẫn giảm liều; NSAID gây buồn nôn, đau dạ dày, loét.
- Cần kiểm tra thêm: tác dụng phụ tăng đường huyết, huyết áp, dễ nhiễm trùng của corticoid; nguy cơ ngưng đột ngột khi đã dùng kéo dài; NSAID ảnh hưởng thận, suy tim, thuốc chống đông; đoạn "cảnh giác thuốc không rõ nguồn gốc có thể trộn corticoid" và các dấu hiệu nêu (tăng cân, mặt tròn, phù...).

### thuoc-da-day-khang-acid-va-giam-tiet-acid (Thuốc dạ dày)
- Nội dung phần lớn từ kiến thức chung, chưa đối chiếu từng câu với 2 nguồn MedlinePlus.
- Cần kiểm tra: phân loại thuốc và hoạt chất nêu; tác dụng phụ của nhóm chứa nhôm/magie/calci; khoảng cách uống với thuốc khác; nguy cơ dùng PPI kéo dài (thiếu B12, magie...); mốc "khoảng 2 tuần"; các dấu hiệu cảnh báo cần đi khám.

### thuoc-ho-cam-cum-tranh-dung-trung-thanh-phan (Thuốc ho, cảm cúm)
- Đã có nguồn: thuốc chứa hoạt chất trùng nhau, có thể gây quá liều; không dùng cho trẻ dưới 2 tuổi; không cho trẻ dùng aspirin; các biện pháp không dùng thuốc (nghỉ ngơi, nước, máy tạo ẩm, nước muối, hút mũi).
- Cần kiểm tra thêm: thuốc thông mũi ảnh hưởng huyết áp, nhịp tim; kháng histamin gây buồn ngủ; "không cho trẻ dưới 1 tuổi ăn mật ong"; mốc "ho kéo dài trên 3 tuần"; ngưỡng dùng cho trẻ trên 2 tuổi theo quy định Việt Nam.

### thuoc-di-ung-khang-histamin (Thuốc dị ứng)
- Nội dung chủ yếu từ kiến thức chung.
- Cần kiểm tra: phân loại thế hệ và ví dụ hoạt chất; mức độ buồn ngủ; người cần thận trọng (cao tuổi, phì đại tuyến tiền liệt, tăng nhãn áp, bệnh gan thận); các dấu hiệu phản vệ và khuyến cáo gọi 115.

### vitamin-va-khoang-chat-khi-nao-can-bo-sung (Vitamin, khoáng chất)
- Nội dung chủ yếu từ kiến thức chung.
- Cần kiểm tra: các tình huống bổ sung nêu; vitamin tan trong dầu và nguy cơ tích lũy; vitamin A liều cao khi mang thai; ngộ độc sắt ở trẻ nhỏ; tương tác vitamin K với thuốc chống đông, khoáng chất với một số kháng sinh và thuốc tuyến giáp.

### thuoc-huyet-ap-vi-sao-khong-tu-ngung (Thuốc tim mạch, huyết áp)
- Đã có nguồn: đa số người tăng huyết áp không có triệu chứng; hậu quả đột quỵ, nhồi máu cơ tim, suy thận; nên dùng thuốc đúng chỉ định; 4 nhóm thuốc và cơ chế tóm tắt; biện pháp lối sống (WHO).
- Cần kiểm tra thêm: tác dụng phụ từng nhóm; ngưng đột ngột thuốc chẹn beta; xử trí khi quên liều; NSAID và thuốc thông mũi làm tăng huyết áp; dấu hiệu đột quỵ.

### thuoc-dai-thao-duong-phong-ha-duong-huyet (Thuốc đái tháo đường)
- Đã có nguồn: không tự thay đổi, ngưng thuốc; cần trao đổi với bác sĩ về xử trí khi đường huyết quá thấp/cao; vẫn cần ăn uống, vận động; các nhóm thuốc (metformin...) và insulin (WHO).
- **Trang MedlinePlus và WHO được đối chiếu không nói về hạ đường huyết.** Toàn bộ phần dấu hiệu, cách phòng, cách xử trí hạ đường huyết là kiến thức chung, cần kiểm tra kỹ nhất; nên bổ sung nguồn về hạ đường huyết (ví dụ hướng dẫn của Hội Đái tháo đường hoặc Bộ Y tế).
- Cần kiểm tra thêm: bảo quản insulin; điều chỉnh thuốc khi ốm; cảnh báo sản phẩm "hạ đường huyết" trộn thuốc; hướng dẫn với người lơ mơ (không cho ăn uống, gọi 115).

### doc-nhan-thuoc-va-dung-thuoc-an-toan (Dùng thuốc an toàn)
- Đã có nguồn: các mục của nhãn thuốc không kê đơn (hoạt chất, công dụng, cảnh báo, cách dùng, tá dược, thông tin khác), đọc nhãn mỗi lần mua, tên gọi giống nhau nhưng hoạt chất khác nhau; không dùng lâu/nhiều hơn mức ghi; tương tác với thuốc, thức ăn; thận trọng khi mang thai; dụng cụ đong cho trẻ; để xa tầm tay trẻ em.
- Cần kiểm tra thêm: đối chiếu với **quy định nhãn thuốc tại Việt Nam** (số đăng ký, nhà sản xuất...); cách bảo quản và xử lý thuốc hết hạn tại Việt Nam.

### dung-khang-sinh-dung-cach (Kháng sinh, bài đã có từ trước)
- Đã có nguồn (MedlinePlus, Antibiotics): kháng sinh chỉ tác dụng với vi khuẩn, không với cảm lạnh, cúm, phần lớn đau họng; dùng thừa gây kháng thuốc; không giữ thuốc thừa, không chia sẻ, không dùng thuốc của người khác; có tác dụng phụ và dị ứng nặng.
- **Trang WHO Antimicrobial resistance (bản đã đọc) không nêu trực tiếp** các lời khuyên cho từng người (chỉ dùng khi có chỉ định, không đòi kê, không dùng thuốc thừa, rửa tay...); nó chỉ nói về nguyên nhân kháng thuốc ở mức hệ thống (dùng kháng sinh không phù hợp, thiếu nước sạch và vệ sinh, thiếu vắc xin...). Nguồn này chỉ nên coi là bối cảnh.
- Cần kiểm tra thêm: cách diễn đạt "đúng thời gian" (MedlinePlus khuyên dùng đủ đợt theo chỉ định dù đã thấy đỡ); mục phòng bệnh (rửa tay, tiêm chủng, ăn chín); các dấu hiệu cần đi khám (sốt cao kéo dài, đau tai, tiểu buốt, vết thương có mủ...).
- **Bài còn mỏng so với các bài khác**: chưa có phần tác dụng phụ thường gặp, tương tác, trẻ em, phụ nữ có thai, cho con bú. Nên bổ sung khi duyệt. Nên đối chiếu thêm hướng dẫn sử dụng kháng sinh của Bộ Y tế Việt Nam.
