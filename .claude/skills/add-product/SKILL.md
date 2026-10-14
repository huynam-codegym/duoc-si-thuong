---
name: add-product
description: Thêm 1 hoặc nhiều sản phẩm mới vào site Dược Sĩ Thương từ tin nhắn chủ website dán theo định dạng "đường dẫn/ảnh/giá/SĐK/xuất xứ/tên". Dùng khi chủ website gửi thông tin sản phẩm mới (hoặc nói "tạo sp"/"thêm sản phẩm") kèm thư mục ảnh trong C:\Users\NamNH2\Downloads\0903\. Bao gồm: đọc & kiểm tra ảnh, đối chiếu nhãn phụ, xử lý ảnh, viết nội dung, build, test, commit, deploy, cập nhật CLAUDE.md.
---

# Thêm sản phẩm mới

Quy trình này đã lặp lại hàng chục lần trong dự án Dược Sĩ Thương — skill này gom lại thành checklist cố định để không bỏ sót bước và không lặp lại các bẫy đã từng gặp. Đọc kỹ CLAUDE.md các mục "Khu bán hàng", "Nguyên tắc nội dung sức khỏe", "Hình ảnh trong bài viết" trước nếu đây là lần đầu làm — skill này KHÔNG thay thế các quy tắc đó, chỉ là trình tự thao tác.

## 1. Nhận diện định dạng tin nhắn đầu vào

Chủ website thường dán nhiều khối, mỗi khối 1 sản phẩm, dạng:

```
đường dẫn:Trang chủ/<Khu>/<Nhóm>/<Nhóm con, nếu có>
ảnh:C:\Users\NamNH2\Downloads\0903\<Tên thư mục ảnh>
giá goc : <số>đ / <đơn vị>
giá khuyến mại: <số>đ/ <đơn vị>   (không phải lúc nào cũng có)
Số đăng ký: <số>/<năm>/ĐKSP (hoặc CBMP-QLD cho mỹ phẩm)
Thương hiệu: <nước của thương hiệu>       (quyết định cờ + chữ trên thẻ sản phẩm — xem lưu ý dưới)
Sản xuất: <nước nơi sản xuất thật, theo nhãn>
Tên chính hãng: <tên đầy đủ>      (đôi khi gõ nhầm "Teen:")
```

(File Excel mẫu gọi đúng 2 cột này là "Thương hiệu" và "Sản xuất" — trước tháng 10/2026 chỉ có 1 cột "Xuất xứ" chung, chủ website đã tự tách thành 2 cột.)

Lưu ý khi đọc:
- Dấu `:` sau "đường dẫn"/"ảnh" đôi khi dính liền chữ trước, đôi khi cách — đọc linh hoạt.
- "giá gốc" > "giá khuyến mại" theo đúng nghĩa (gốc luôn CAO hơn bán). Nếu tin nhắn viết NGƯỢC (gốc thấp hơn khuyến mại) — đây là lỗi gõ, **hỏi lại bằng AskUserQuestion** trước khi đoán, đừng tự sửa thầm lặng. Đã gặp đúng trường hợp này (Orihiro Glucosamine & Spirulina).
- Số Đăng ký/SĐK đôi khi TRÙNG với số đã dùng cho sản phẩm khác trong các tin nhắn gần đây (lỗi copy-paste 2 dòng liền kề khi soạn hàng loạt) — nếu nghi ngờ, kiểm tra chéo với các sản phẩm vừa thêm gần đây, và luôn đối chiếu với nhãn phụ thật trong ảnh trước khi tin vào số trong tin nhắn.
- Đường dẫn 3-4 cấp (`Khu/Nhóm/Nhóm con`) — cấp cuối có thể là nhóm CHƯA tồn tại trong `src/lib/departments.ts`, xem bước 4.
- **"Thương hiệu" và "Sản xuất" là 2 khái niệm KHÁC NHAU (quy ước đổi tháng 10/2026, xem CLAUDE.md mục "Đổi quy ước nguồn dữ liệu cho `origin`"):** trường `origin` trong frontmatter (và do đó cờ quốc gia + chữ hiện trên thẻ sản phẩm) lấy theo **cột "Thương hiệu"**, KHÔNG lấy theo cột "Sản xuất" (nơi sản xuất thật). Nếu "Sản xuất" khác "Thương hiệu" (ví dụ thương hiệu Pháp/Nhật Bản nhưng sản xuất tại Việt Nam/Thái Lan — đã gặp Lactacyd, Omi Sun Bears, Sunplay), viết rõ điều đó thành 1 câu trong "Mô tả sản phẩm", không gắn cờ của nước sản xuất. Phần lớn sản phẩm 2 cột này TRÙNG giá trị — chỉ cần lưu ý khi khác nhau. Nếu tin nhắn chỉ cho 1 giá trị xuất xứ duy nhất (không tách riêng), dùng giá trị đó cho `origin` như trước, không cần bịa thêm thông tin.

## 2. Đọc và kiểm tra TOÀN BỘ ảnh trong thư mục trước khi viết gì

```bash
ls -la "/c/Users/NamNH2/Downloads/0903/<Tên thư mục>"
```

Nếu `ls`/`Read` báo "không tồn tại" dù thư mục rõ ràng có — khả năng cao tên thư mục chứa chữ **"Đ" hoa** (bẫy Unicode đã biết, xem mục 8). Dùng PowerShell `Get-ChildItem -Filter "<từ khoá không dấu Đ>*"` để tìm đường dẫn thật, rồi `Copy-Item` sang thư mục scratch ASCII trong project trước khi đọc.

Đọc **từng ảnh một bằng Read tool** (không bỏ qua ảnh nào), với 3 việc cùng lúc:

1. **Soi nội dung ảnh theo nguyên tắc "đăng hết ảnh"** (xem CLAUDE.md mục "Khu bán hàng" > "Không tự ý bỏ ảnh"): mặc định đăng HẾT, kể cả ảnh trông trùng lặp. Chỉ 3 ngoại lệ bắt buộc loại/patch:
   - Mặt người thật chưa được đồng ý (kể cả badge nhỏ góc ảnh, ảnh trẻ em trong ảnh minh hoạ cách dùng).
   - Logo/thương hiệu bên thứ ba KHÔNG LIÊN QUAN (nhà thuốc khác, đơn vị trung gian) — watermark của ĐÚNG nhà phân phối/nhập khẩu thật của sản phẩm thì GIỮ NGUYÊN, không phải logo đối thủ.
   - Chữ trong ảnh vi phạm nguyên tắc nội dung (hứa chữa khỏi, so sánh trực tiếp với sản phẩm khác, số liệu hiệu quả không nêu nguồn kiểm chứng được, xếp hạng thị phần không có trích dẫn cụ thể).
   - Với ảnh dính 1 trong 3 lỗi trên nhưng có DỮ LIỆU THẬT đáng giữ (bảng thành phần, số liệu, hướng dẫn dùng) — ƯU TIÊN patch/vẽ lại thay vì bỏ hẳn (xem mục 6). Chỉ bỏ hẳn khi không tách được phần hợp lệ. Luôn nói rõ với người dùng ảnh nào bị loại và lý do.
2. **Tìm nhãn phụ tiếng Việt** (thường là 1 ảnh riêng, đôi khi lẫn trong ảnh mặt sau hộp) — đây là NGUỒN THẬT để đối chiếu SĐK, xuất xứ, thành phần, liều dùng, chống chỉ định. Nếu ảnh nhỏ/mờ, dùng kỹ thuật cắt-phóng to-làm nét (xem mục 7).
3. **Đối chiếu SĐK/xuất xứ đọc được với tin nhắn** — nếu KHÁC NHAU, luôn ưu tiên số trên nhãn thật (nguyên tắc 1/10 trong CLAUDE.md: không bịa, ưu tiên nguồn đáng tin). Luôn báo rõ sự khác biệt này cho người dùng khi báo cáo kết quả, không âm thầm sửa.

## 3. Xác định slug và đường dẫn thư mục asset

- Slug: không dấu, gạch ngang, kết thúc bằng dung tích/quy cách nếu có (ví dụ `aderma-exomega-allergo-200ml`).
- Tạo thư mục: `mkdir -p src/assets/products/<slug>`.

## 4. Khu/nhóm/nhóm con trong `src/lib/departments.ts`

- Map "Khu" trong đường dẫn → `department` slug đã có (`thuc-pham-chuc-nang`, `duoc-my-pham`, `cham-soc-ca-nhan`, `thiet-bi-y-te`).
- Map "Nhóm" → slug nhóm đã có trong `departments[dept].groups`. Nếu nhóm trong đường dẫn CHƯA tồn tại:
  - Nếu đường dẫn chỉ có 3 cấp (`Khu/Nhóm mới`) và "Nhóm mới" gần nghĩa với 1 nhóm đã có → thêm làm **nhóm con** (`childGroups`) của nhóm gần nghĩa nhất, dùng lại ICON của nhóm cha (không vẽ icon mới, không hỏi lại — đây chỉ là tổ chức menu).
  - Nếu đường dẫn có 4 cấp (`Khu/Nhóm/Nhóm con`) → nhóm ở cấp 3 phải đã tồn tại (hoặc tạo mới làm nhóm cha không có sẵn sản phẩm trực tiếp), nhóm con ở cấp 4 thêm vào `childGroups` của nhóm cấp 3.
  - Sản phẩm luôn gắn `group` = slug nhóm **sâu nhất** trong đường dẫn (nhóm con nếu có), không gắn vào nhóm cha.

## 5. Xử lý ảnh bằng sharp

Viết 1 script `.mjs` tạm (xoá sau khi chạy xong) dùng sharp, **LUÔN** gồm `.flatten({ background: '#ffffff' })` trước `.jpeg()` — webp có kênh alpha sẽ tự đổ nền ĐEN nếu thiếu dòng này (đã gặp thật ở Optibac), dù ảnh không có alpha thì flatten() cũng vô hại.

```js
import sharp from 'sharp';
const dir = String.raw`C:\Users\NamNH2\Downloads\0903\<Tên thư mục>`;
const out = String.raw`C:\Users\NamNH2\Documents\Claude_demo\src\assets\products\<slug>`;
async function convert(file, outName) {
  await sharp(`${dir}\\${file}`).flatten({ background: '#ffffff' }).jpeg({ quality: 88 }).toFile(`${out}\\${outName}`);
}
await convert('1.webp', 'anh.jpg');   // ảnh đại diện — chọn ảnh sạch nhất, nền trắng nếu có
await convert('2.webp', 'anh-2.jpg');
// ... hết toàn bộ ảnh trong thư mục, không bỏ ảnh nào trừ 3 ngoại lệ ở mục 2
```

**Thứ tự ảnh trong `gallery` phải theo đúng thứ tự TÊN FILE trong thư mục nguồn** (0,1,2,3... hoặc 1,2,3...), **không tách riêng theo đuôi file** (ví dụ không dồn hết `.webp` lên trước rồi mới tới `.png`) — kể cả khi ảnh thật (`.webp`) và ảnh banner Gemini (`.png`) xen kẽ nhau trong thư mục, cứ giữ nguyên thứ tự đánh số gốc. Chủ website phản hồi về việc này tháng 10/2026 sau khi 3 sản phẩm Lactacyd bị dồn ảnh thật lên trước, banner xuống cuối thay vì giữ đúng thứ tự 0-6 trong thư mục.

Xoá script `.mjs` tạm sau khi chạy xong (`rm -f scratch-*.mjs`).

## 6. Patch/vẽ lại ảnh (chỉ khi cần, theo mục 2)

- **Patch logo/badge nhỏ**: đo vùng bằng cách cắt thử + phóng to xem lại bằng Read (không áng chừng bằng mắt), phủ hình chữ nhật trắng (SVG `<rect>` qua sharp composite) đúng vùng đã đo, mở rộng ra tới full width nếu vùng nằm sát mép để tránh để lại viền lởm chởm.
- **Thay logo bên thứ ba bằng logo Dược Sĩ Thương**: cắt tròn `src/assets/logo.jpg` + chữ "Dược Sĩ Thương" (SVG `<text>`, font đậm, màu `#14532d`) ghép đè lên nền trắng đã phủ.
- **Vẽ lại hoàn toàn kiểu "bảng thành phần nền tím"**: dùng khi ảnh gốc không giữ được (nhiều vi phạm cùng lúc) nhưng có số liệu thật cần giữ — dựng HTML/CSS (đầu trang xanh lá + huy hiệu pill trắng, nền thân tím nhạt `#f5f3ff`, tiêu đề tím `#7c3aed`, các dòng dạng thẻ trắng bo tròn có vạch tím bên trái, chân trang xanh lá) rồi chụp bằng Puppeteer `page.setContent()` + `screenshot()`, khổ vuông 800×800. **Bẫy: `page.setContent()` không tải được ảnh `file://`** (origin `about:blank` bị chặn âm thầm) — phải nhúng ảnh dạng Data URI base64 (`fs.readFileSync` + `toString('base64')`), không dùng đường dẫn file trực tiếp.

## 7. Đọc nhãn phụ nhỏ/mờ

```js
await sharp(src)
  .extract({ left, top, width, height })   // cắt đúng vùng chữ, có thể chia 3 dải ngang nếu cả nhãn dài
  .resize(width * 3, height * 3, { kernel: 'lanczos3' })
  .sharpen()
  .toFile(out);
```

## 8. Bẫy đường dẫn Windows có chữ "Đ" hoa

`Read`/`Bash ls`/PowerShell `-LiteralPath` đều báo lỗi "không tồn tại" với thư mục có chữ **"Đ" hoa** (U+0110) trong tên, dù thư mục có thật (chữ "đ" thường thì không sao). Khắc phục:

```powershell
Get-ChildItem -Path "C:\Users\NamNH2\Downloads\0903" -Filter "Kh*Gold*"   # dùng từ khoá KHÔNG chứa "Đ"
```//lấy `.FullName` thật, rồi:

```bash
cp -r "<đường dẫn thật lấy được>" "/c/Users/NamNH2/Documents/Claude_demo/scratch-<tên-ascii>"
```

Đọc/convert ảnh từ thư mục scratch ASCII này. **Nhớ xoá thư mục scratch sau khi xong** (`rm -rf scratch-*`).

## 9. Viết nội dung sản phẩm

Tạo `src/content/products/<slug>.md`. Frontmatter bắt buộc: `name`, `summary`, `department`, `group`, `price`, `unit`, `brand`, `origin`, `dosageForm`, `ingredients`, `image`, `imageAlt`, `gallery` (mọi ảnh còn lại), `publicationNo` (để `""` nếu không đọc được từ nhãn, KHÔNG đoán), `adConfirmationNo`, `updatedAt` (hôm nay), `draft: false`. Thêm `originalPrice` nếu có khuyến mãi (tự hiện nhãn "-X%").

Nội dung theo 6 mục cố định: Mô tả sản phẩm / Công dụng / Đối tượng sử dụng / Cách dùng / Lưu ý / Bảo quản. Viết theo đúng nguyên tắc trong CLAUDE.md:
- Chỉ "hỗ trợ"/"bổ sung", không "chữa"/"điều trị"/"khỏi bệnh".
- Thực phẩm chức năng ghi rõ "không phải là thuốc, không có tác dụng thay thế thuốc chữa bệnh"; mỹ phẩm ghi "Mỹ phẩm, không phải là thuốc, không có tác dụng điều trị bệnh."
- Luôn có mục chống chỉ định/thận trọng (phụ nữ có thai/cho con bú, trẻ em, dị ứng hải sản nếu có glucosamine/chondroitin, tương tác thuốc chống đông nếu có vitamin K...).
- Thành phần có dược liệu độc tính đã biết (ví dụ mã tiền chế) → thêm lưu ý riêng không tự tăng liều.
- Không nêu tên biệt dược, chỉ hoạt chất (áp dụng cho bài thuốc, không áp dụng cho TÊN SẢN PHẨM/thương hiệu bán hàng — mục này chỉ áp dụng cho bài viết kiến thức về thuốc).

## 10. Build và test

```bash
npm run build 2>&1 | grep -iE "error" | grep -v "Node.js 20"
```

Không có output = build sạch. Sau đó test bằng Puppeteer thật (bắt buộc với MỌI thay đổi UI, xem CLAUDE.md "Quy ước làm việc với code"):

```bash
npm install --no-save puppeteer-core
(npm run preview > /tmp/preview.log 2>&1 &) ; sleep 4
```

Script test tối thiểu: `page.goto` từng trang sản phẩm MỚI + trang nhóm/nhóm con liên quan, ở **2 khổ màn hình** (desktop ~1280px, mobile ~390px), `executablePath` trỏ `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`, cuộn hết trang (`window.scrollBy` lặp trong `page.evaluate`) trước khi `screenshot({fullPage:true})` để không bỏ sót ảnh `loading="lazy"`. Xem ảnh chụp thật bằng Read tool — không chỉ tin "chắc đúng".

Dọn dẹp sau test: `rm -f scratch-test*.mjs`, `npm uninstall puppeteer-core`, dừng server preview.

## 11. Cập nhật CLAUDE.md

Thêm 1 gạch đầu dòng mới vào đoạn "Trạng thái tháng 9/2026 (cập nhật tháng 10/2026)" (khu Thực phẩm chức năng) hoặc đoạn trạng thái tương ứng của khu khác — **cập nhật luôn số lượng sản phẩm tổng** ở đầu câu. Ghi rõ: tên sản phẩm, giá, nhóm, điểm khác biệt so với tin nhắn gốc (SĐK/xuất xứ/giá bị sai, ảnh nào bị loại/patch và lý do), nhóm con mới thêm nếu có.

## 12. Commit, push, deploy, xác nhận

```bash
git add <các file mới/sửa>
git commit -m "$(cat <<'EOF'
<tiêu đề ngắn: Thêm N sản phẩm ...>

<1-2 câu mô tả, nêu điểm đáng chú ý nếu có (sửa SĐK, nhóm mới...)>

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
EOF
)"
git push origin main
sleep 5 && gh run list --branch main --limit 1   # lấy ID run MỚI, không dùng run cũ còn cache
gh run watch <id> --exit-status
curl -s -o /dev/null -w "%{http_code}\n" "https://duocsithuong.com/<department>/<slug>/"
```

## 13. Báo cáo kết quả

Trả lời ngắn gọn bằng tiếng Việt: liệt kê sản phẩm đã thêm (giá, nhóm), mọi sai lệch SĐK/xuất xứ/giá đã phát hiện và cách xử lý, ảnh nào bị loại/patch và lý do, nhóm con mới (nếu có). Không lặp lại toàn bộ nội dung bài viết.

## Việc KHÔNG được tự ý làm

- Không bịa SĐK/xuất xứ/thành phần khi ảnh không rõ — để trống và nói rõ trong báo cáo.
- Không tự ý bỏ ảnh ngoài 3 ngoại lệ ở mục 2.
- Không tự sửa giá gốc/khuyến mại khi tin nhắn mâu thuẫn — hỏi lại.
- Không bỏ qua bước test Puppeteer dù "có vẻ" không ảnh hưởng UI.
- Không amend commit cũ, không force push.

## Phụ lục: Mẫu prompt Gemini tạo ảnh banner sản phẩm (BẮT BUỘC dùng đúng mẫu này)

Khi chủ website nhờ "tạo prompt/format tạo ảnh" cho một sản phẩm, viết **3 prompt riêng (ẢNH 1, ẢNH 2, ẢNH 3)**, thường là 3 chủ đề: Công dụng, Thành phần, Cách dùng/Hướng dẫn sử dụng. Mỗi prompt là **1 khối văn bản thuần, copy-paste thẳng vào Gemini được** (không dùng tiêu đề markdown `###`, không chữ in đậm `**` bên trong prompt). Mẫu chủ website chốt tháng 10/2026, giữ NGUYÊN các câu cố định, chỉ thay phần trong `<...>`:

```
Tạo 1 ảnh banner quảng cáo sản phẩm <loại sản phẩm, ví dụ: thực phẩm chức năng / mỹ phẩm>, tỉ lệ vuông 1:1, độ phân giải cao, phong cách chuyên nghiệp của nhà thuốc.
Tên sản phẩm: <tên sản phẩm>
Note: Bắt buộc 100%  ảnh cùng tên sản phẩm hãy tạo cùng 1 phông màu NỀN xuyên suốt cho các ảnh đó

ẢNH <số> (sản phẩm): Giữ NGUYÊN 100% ảnh sản phẩm đã tải lên — không vẽ lại, không đổi hình dạng, không làm mờ chữ trên nhãn. Đặt sản phẩm làm trung tâm/điểm nhấn chính của bố cục, có đổ bóng nhẹ tự nhiên bên dưới.

NỀN: <mô tả nền — PHẢI GIỐNG HỆT NHAU ở cả 3 ảnh của cùng 1 sản phẩm, chọn theo màu bao bì>

CHỮ TRÊN ẢNH (tiếng Việt, font đậm, dễ đọc, màu trắng)::Chữ này trên cùng của ảnh
- Tiêu đề chính: "<tiêu đề>"
- Phụ đề: "<phụ đề>"

3 Ý NỔI BẬT: 3 hình tròn viền sáng xếp quanh sản phẩm, mỗi hình có 1 icon đường nét + 1-2 dòng chữ ngay dưới, 1 bên trái, 2 bên phải, 3 bên trái sản phẩm:
1) <emoji gợi ý icon> — "<ý 1>"
2) <emoji> — "<ý 2>"
3) <emoji> — "<ý 3>"

KHÔNG thêm bất kỳ logo, tên thương hiệu hay chữ nào khác ngoài logo đã tải lên và phần chữ ghi ở trên. Không bịa thêm số liệu hay công dụng ngoài nội dung đã cho.
```

Quy tắc khi điền:
- **Nền giống hệt nhau ở cả 3 prompt** của cùng 1 sản phẩm (copy nguyên câu NỀN), vì chủ website cần bộ 3 ảnh đồng bộ màu.
- Mọi chữ trong ảnh chỉ lấy từ nhãn thật/thông tin chủ website gửi; không thêm số liệu, %, "chữa khỏi", "điều trị", "giải độc", so sánh, "số 1".
- Không đưa lên ảnh câu dễ hiểu thành khuyến khích hành vi có hại (ví dụ "người thường xuyên uống rượu bia") — viết trung tính ("người cần chăm sóc gan hằng ngày").
- Không có đoạn chèn logo Dược Sĩ Thương trong prompt (Gem của chủ website đã tự cấu hình) — chỉ giữ câu "ngoài logo đã tải lên".
