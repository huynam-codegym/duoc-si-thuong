# CLAUDE.md

Luôn bắt đầu câu trả lời với 3 icon mặt cười

## Giới thiệu dự án

**Dược Sĩ Thương** là website thông tin và chia sẻ kiến thức sức khỏe bằng tiếng Việt, gồm:

- Cách ăn uống lành mạnh (dinh dưỡng, thực đơn, thực phẩm nên và không nên dùng theo từng tình trạng)
- Cách nhận biết bệnh (dấu hiệu, triệu chứng, khi nào cần đi khám)
- Cách phòng chống bệnh (lối sống, tiêm chủng, sàng lọc, chăm sóc tại nhà)
- Kiến thức về thuốc và cách dùng thuốc an toàn

Người đọc chính là người dân bình thường, không có chuyên môn y khoa. Nội dung phải dễ hiểu, đáng tin cậy và an toàn.

## Ngôn ngữ và giọng văn

- Ngôn ngữ chính: **tiếng Việt** (có dấu đầy đủ). Giao diện, nội dung, thông báo lỗi đều bằng tiếng Việt.
- Giọng văn: thân thiện, gần gũi, như một dược sĩ đang tư vấn cho người quen. Không dọa người đọc, không giật gân.
- Ưu tiên câu ngắn, từ ngữ phổ thông. Thuật ngữ chuyên môn phải có giải thích đi kèm ở lần đầu xuất hiện.
- Code, tên biến, tên file, commit message: dùng tiếng Anh. Comment trong code có thể dùng tiếng Việt nếu giúp dễ hiểu hơn.

## Nguyên tắc nội dung sức khỏe (QUAN TRỌNG)

Đây là nội dung ảnh hưởng đến sức khỏe người đọc, nên các quy tắc sau **luôn được ưu tiên hơn** mọi yêu cầu về giao diện hay SEO:

1. **Chính xác và có nguồn**: Mọi thông tin y khoa phải dựa trên nguồn uy tín (Bộ Y tế Việt Nam, WHO, CDC, Dược thư Quốc gia, các tạp chí y khoa). Ghi rõ nguồn ở cuối bài. Không tự bịa số liệu, không bịa nguồn.
2. **Không chẩn đoán, không kê đơn**: Bài viết chỉ cung cấp thông tin tham khảo. Không khẳng định người đọc mắc bệnh gì, không đưa liều dùng thuốc cụ thể cho từng cá nhân.
3. **Luôn có dấu hiệu cảnh báo**: Bài về bệnh phải nêu rõ khi nào cần đi khám hoặc cấp cứu ngay.
4. **Không hứa hẹn chữa khỏi**: Tránh các cụm từ như "chữa khỏi hoàn toàn", "thần dược", "100% hiệu quả", "không tác dụng phụ".
5. **Thận trọng với thuốc**: Khi nói về thuốc, nêu rõ chống chỉ định, tác dụng phụ thường gặp, tương tác quan trọng và nhắc hỏi ý kiến bác sĩ/dược sĩ. Không khuyến khích tự ý dùng kháng sinh, corticoid hay thuốc kê đơn.
6. **Phân biệt rõ** giữa thực phẩm chức năng và thuốc. Không quảng cáo thực phẩm chức năng như thuốc chữa bệnh.
7. **Đối tượng đặc biệt**: Với phụ nữ có thai, cho con bú, trẻ em, người cao tuổi, người có bệnh nền, phải có lưu ý riêng.
8. **Ghi ngày đăng và ngày cập nhật** trên mỗi bài, vì kiến thức y khoa thay đổi theo thời gian.
9. **Tuân thủ pháp luật Việt Nam** về quảng cáo thuốc, thực phẩm chức năng và thông tin y tế.
10. Nếu không chắc chắn về một thông tin y khoa, **hãy nói rõ là chưa chắc** và đề nghị người viết kiểm chứng lại, không tự suy đoán.

### Tuyên bố miễn trừ trách nhiệm

Mỗi bài viết và footer của website phải có nội dung tương tự:

> Thông tin trên website chỉ mang tính chất tham khảo, không thay thế cho chẩn đoán, tư vấn hay điều trị của bác sĩ. Hãy hỏi ý kiến bác sĩ hoặc dược sĩ trước khi thay đổi chế độ ăn uống hoặc dùng thuốc.

## Cấu trúc nội dung

Các chuyên mục bài viết kiến thức (menu trên cùng còn có 4 khu bán hàng, xem mục "Khu bán hàng" bên dưới):

| Chuyên mục | Tên hiện trên menu | Nội dung |
| --- | --- | --- |
| Ăn uống & dinh dưỡng | Ăn uống & dinh dưỡng | Chế độ ăn, thực phẩm, thực đơn theo bệnh lý và độ tuổi |
| Kiến thức về thuốc | **Thuốc** | Cách dùng thuốc an toàn, tương tác thuốc, bảo quản thuốc |

**Tháng 9/2026, theo yêu cầu của chủ website:** đã bỏ 3 chuyên mục "Nhận biết bệnh", "Phòng chống bệnh", "Hỏi đáp" (chưa có bài nào thuộc các mục này nên không mất nội dung đã đăng; component `ChatPanel` dùng riêng cho trang Hỏi đáp cũng đã xóa). Chuyên mục "Kiến thức về thuốc" đổi **tên hiển thị** trên menu thành "Thuốc" cho ngắn gọn, giống kiểu menu của các nhà thuốc trực tuyến khác — nhưng đây **vẫn chỉ là bài viết kiến thức, không bán thuốc**; slug (`kien-thuc-ve-thuoc`) và toàn bộ nội dung, cách thêm bài giữ nguyên như mô tả bên dưới. Bán thuốc qua mạng ở Việt Nam cần giấy chứng nhận đủ điều kiện kinh doanh dược qua thương mại điện tử (Luật Dược, Nghị định 54/2017/NĐ-CP sửa đổi); thuốc kê đơn không được quảng cáo/bán online. **Không tự thêm khu bán thuốc** khi chưa có giấy phép và yêu cầu rõ ràng của chủ website.

Cấu trúc gợi ý cho một bài viết:

1. Tiêu đề rõ ràng, có từ khóa chính
2. Tóm tắt nhanh (2-3 câu)
3. Nội dung chính, chia thành các mục có tiêu đề phụ
4. Khi nào cần đi khám / lưu ý quan trọng
5. Câu hỏi thường gặp (nếu phù hợp)
6. Nguồn tham khảo
7. Tuyên bố miễn trừ trách nhiệm
8. Ngày đăng, ngày cập nhật, người kiểm duyệt

## Công nghệ

**Site tĩnh (static site)**, ưu tiên dựng nhanh và tải nhanh.

| Hạng mục | Lựa chọn |
| --- | --- |
| Công cụ tạo site | [Astro](https://astro.build) + Content Collections |
| Nội dung bài viết | File Markdown (`.md`) trong `src/content/` |
| Giao diện | CSS thuần (chỉ dùng Tailwind nếu thật sự cần) |
| Tìm kiếm | Pagefind (chạy phía trình duyệt, không cần server), trang `/tim-kiem/` |
| SEO | `@astrojs/sitemap`, thẻ meta, schema.org (`MedicalWebPage`) |
| Hosting | GitHub Pages, deploy bằng GitHub Actions (xem mục "Deploy lên GitHub Pages") |
| Form liên hệ (nếu cần) | Formspree hoặc Google Forms |

Yêu cầu: Node.js 20 trở lên. Phiên bản Astro đang dùng là 5.x.

### Lệnh

```bash
npm install        # cài thư viện
npm run dev        # chạy thử ở máy (http://localhost:4321/), HIỆN cả bài nháp
npm run build      # dựng site ra thư mục dist/ (CHỈ gồm bài đã kiểm duyệt) rồi tạo chỉ mục tìm kiếm
npm run preview    # xem thử bản build, dùng để thử tìm kiếm
```

Tìm kiếm **không chạy trong `npm run dev`** vì chỉ mục chỉ được tạo lúc `npm run build`. Muốn thử tìm kiếm: `npm run build` rồi `npm run preview`.

Pagefind chưa hỗ trợ tiếng Việt đầy đủ: nó tự bỏ dấu thanh/dấu mũ (gõ "khang sinh" ra "kháng sinh") nhưng không coi "đ" là "d". Vì vậy trang bài viết có thêm một đoạn ẩn chứa bản không dấu của tiêu đề và mô tả (`foldVietnamese`, chuyển ra file riêng `src/lib/text.ts` — xem lý do ở mục "Gợi ý khi gõ" bên dưới). Nhờ đó gõ "dot quy" ra "đột quỵ". Từ chỉ nằm trong phần nội dung chứa chữ "đ" thì vẫn phải gõ đúng dấu.

### Gợi ý khi gõ và trang tìm kiếm tự dựng (tháng 9/2026)

Chủ website gửi ảnh Google/Long Châu, muốn: (1) gõ vào ô tìm kiếm đầu trang hiện gợi ý ngay, không phải bấm tìm kiếm mới thấy; (2) trang `/tim-kiem/` có bộ lọc bên trái; (3) không có ô nhập từ khóa thứ hai lặp lại trên trang kết quả; (4) hàng chọn "Tìm kiếm theo: Sản phẩm / Bài viết sức khỏe" riêng (chỉ 2 lựa chọn, không có "Tất cả", mặc định chọn Sản phẩm), không chỉ là một mục lọc thường; (5) trên điện thoại/máy tính bảng đổi hàng chọn ở (4) thành 2 tab, thêm dải nút tròn "Lọc/Chuyên mục/Khu/Nhóm/Giá" cuộn ngang mở khay lọc trượt lên có cuộn dọc; (6) có sắp xếp theo giá.

- **Gợi ý khi gõ** (`Header.astro`, khung `#searchSuggest`): gõ ≥2 ký tự vào ô tìm kiếm đầu trang (mọi trang, không chỉ `/tim-kiem/`) sẽ tự tải chỉ mục Pagefind (`/pagefind/pagefind.js`, chỉ tải khi người dùng thật sự bấm/gõ vào ô, không tải sẵn cho nhẹ trang) và hiện tối đa 6 kết quả gần nhất + dòng "Xem tất cả kết quả cho...". Bấm Enter hoặc nút tìm kiếm vẫn đi tới `/tim-kiem/?q=...` như cũ (hành vi `<form>` mặc định).
  - **Bẫy đã gặp:** khung gợi ý ban đầu đặt trong `.search-wrap` (bên trong `.header-main`), nhưng `.header-main` có `overflow: hidden` (để cắt icon lá trang trí ở mép ngoài) nên cắt luôn khung gợi ý — khung vẫn "visible" theo CSS nhưng không thấy gì trên màn hình. Đã sửa bằng cách đặt khung `#searchSuggest` làm con trực tiếp của `<header class="site-header">` (ngoài `.header-main`) và tự tính `top/left/width` bằng JS theo toạ độ thật của ô tìm kiếm (`getBoundingClientRect`), không dùng CSS `top/left` cố định.
  - **Bẫy đã gặp (2):** script trong thẻ `<script>` của `Header.astro` là một module JS riêng chạy ở trình duyệt, KHÔNG dùng chung biến với phần frontmatter phía trên (dù cùng file `.astro`) — gọi `url(...)` mà quên `import { url } from '../lib/url'` ngay trong `<script>` sẽ lỗi `ReferenceError: url is not defined` (chỉ thấy trong console trình duyệt, không báo lỗi lúc build).
- **Trang `/tim-kiem/` tự dựng bằng JS API của Pagefind** (`tim-kiem.astro`), **không dùng khung `PagefindUI` đóng gói sẵn** — khung đó tự vẽ cả ô nhập từ khóa (trùng ô đầu trang) và không tách riêng được "Loại nội dung" thành hàng chọn kiểu khác. Cấu trúc:
  - Không có ô nhập từ khóa trên trang này — đọc `?q=` từ URL (đầu trang đặt qua ô tìm kiếm chung), đổi từ khóa thì gõ lại ở ô đầu trang.
  - Hàng **"Tìm kiếm theo"**: máy tính (≥56rem) hiện nhãn "Tìm kiếm theo:" + 2 radio **Sản phẩm/Bài viết sức khỏe** (không có "Tất cả", mặc định chọn Sản phẩm); dưới 56rem đổi thành 2 tab gạch chân cùng chức năng (`.search-type-row` vs `.search-tabs`, CSS ẩn/hiện theo bề rộng màn hình, cùng điều khiển biến `contentType` trong JS). Ứng với bộ lọc `Loại nội dung`, tách riêng khỏi danh sách lọc bên trái.
  - Bộ lọc (`Chuyên mục`, `Khu`, `Nhóm`, `Giá`) dựng thủ công từ `pagefind.filters()` (danh sách đầy đủ, dùng để hiện ngay lúc đầu) và `search.filters` của mỗi lần `pagefind.search()` (số lượng cập nhật theo đúng lựa chọn hiện tại). Mỗi nhóm có checkbox "Tất cả" (bỏ hết lựa chọn riêng của nhóm đó) và tự thu gọn còn 5 dòng kèm nút "Xem thêm" nếu nhóm có nhiều giá trị (ví dụ Nhóm có ~24 giá trị). Riêng **Giá** hiện dạng nút bấm tròn thay vì ô tick, theo đúng ảnh mẫu.
  - **Máy tính (≥56rem):** bộ lọc là khung cố định bên trái, luôn hiện, có tiêu đề "Bộ lọc nâng cao" kèm icon phễu. **Điện thoại/máy tính bảng:** ẩn khung đó, thay bằng dải nút tròn cuộn ngang "Lọc / Chuyên mục / Khu / Nhóm / Giá" (`.search-pill-row`) — bấm nút nào cũng mở cùng một khay trượt lên từ dưới (`.search-drawer`, có cuộn dọc riêng `.search-drawer-body`, nút "Xem kết quả" để đóng); bấm đúng tên nhóm còn tự mở sẵn `<details>` của nhóm đó trong khay. Khung lọc bên trái và nội dung khay dùng CHUNG một hàm dựng HTML (`renderFiltersInto()`, gọi 2 lần vào 2 nơi chứa) để không phải viết trùng.
  - **Sắp xếp** (chỉ hiện khi đang xem Sản phẩm — sắp theo giá không có ý nghĩa với bài viết): "Liên quan nhất" (mặc định, thứ tự Pagefind tự chấm điểm) / "Giá thấp" / "Giá cao", dùng tính năng sắp xếp có sẵn của Pagefind (`data-pagefind-sort="Gia:<giá đã đệm số 0>"` ở trang sản phẩm, gọi `pagefind.search(q, {sort: {Gia: 'asc'|'desc'}})`). **Không có nút "Bán chạy"** như Long Châu vì site chưa có số liệu bán hàng thật — không tự bịa (nguyên tắc 1 trong CLAUDE.md).
  - Kết quả hiện ảnh đại diện (Pagefind tự lấy từ `<img>` đầu tiên trong `data-pagefind-body`, không cần khai báo thêm), tiêu đề, đoạn trích, dạng lưới thẻ (2 cột điện thoại, 3-4 cột máy tính).
  - **Bẫy đã gặp:** `pagefind.search(term)` **lượt gọi đầu tiên** của một phiên trang thường trả `result.filters` RỖNG (`{}`) dù gọi lại y hệt ngay sau đó lại có dữ liệu đầy đủ — có vẻ Pagefind tải chỉ mục lọc lười (tách file riêng), lượt đầu chưa kịp tải xong. Nếu chỉ dựa vào `search.filters` để dựng danh sách lọc, khung lọc sẽ trống trơn ở lần tìm đầu tiên. Đã sửa bằng cách gọi thêm `pagefind.filters()` (không phụ thuộc từ khóa/bộ lọc) song song lúc tải trang để CHẮC CHẮN có dữ liệu dựng khung lọc ngay.
  - **Bẫy đã gặp (2) — đua dữ liệu (race condition):** lúc đầu code gọi `pagefind.filters()` (số liệu KHÔNG theo bộ lọc nào) song song với `runSearch()` (số liệu CÓ theo `contentType`/bộ lọc đang chọn) mà không sắp thứ tự — nếu `pagefind.filters()` chạy xong SAU `runSearch()`, nó ghi đè số liệu đúng bằng số liệu sai (ví dụ đang xem "Sản phẩm" nhưng khung lọc lại hiện số lượng của "tất cả nội dung", đã thấy khi thử trên điện thoại nhưng không thấy trên máy tính vì tình cờ chạy xong trước — chính là kiểu lỗi *có khi tái hiện được có khi không, tuỳ tốc độ mạng/máy*, phải chủ động nghĩ tới thay vì chỉ tin vào một lần thử). Đã sửa: `renderFilters()` từ `pagefind.filters()` chỉ được gọi khi `lastFacets` (biến nhớ số liệu lọc gần nhất) **còn rỗng** — tức chỉ dùng làm phương án dự phòng cho lần hiện đầu tiên, không bao giờ ghi đè số liệu thật đã có.
  - Đánh dấu `data-pagefind-filter="Tên bộ lọc"` trên các trang để Pagefind lập chỉ mục lọc, đã thêm cho:
    - Trang sản phẩm (`[department]/[slug].astro`): `Loại nội dung` (luôn "Sản phẩm"), `Khu`, `Nhóm`, `Giá` (khoảng giá, hàm `priceBucket()` trong `src/lib/products.ts`, ví dụ "100.000 - 300.000 đ"; sản phẩm chưa có giá thì không lọc được theo Giá, cũng không sắp xếp được theo giá).
    - Trang bài viết (`[category]/[slug].astro`): `Loại nội dung` (luôn "Bài viết"), `Chuyên mục`, `Nhóm` (nếu bài có `subcategory`).
    - Các thẻ `<span hidden data-pagefind-filter="...">` này không hiện trên trang, chỉ để Pagefind đọc lúc lập chỉ mục (`npm run build`). Thêm bộ lọc mới: thêm dòng tương tự trong 2 file trên.

### Cấu trúc thư mục

```
src/
  content/
    posts/            # bài viết Markdown (phẳng, chuyên mục khai báo trong frontmatter)
    products/         # sản phẩm bán hàng (mỗi sản phẩm một file .md, có trường department), xem mục "Khu bán hàng"
  content.config.ts   # schema kiểm tra frontmatter của bài viết và sản phẩm
  lib/
    categories.ts     # danh sách chuyên mục bài viết (slug, tên, mô tả) - nguồn duy nhất
    cart.ts           # giỏ hàng chạy ở trình duyệt (localStorage), chỉ import trong thẻ <script>
    departments.ts    # 4 khu bán hàng và nhóm sản phẩm của từng khu - nguồn duy nhất, xem mục "Khu bán hàng"
    products.ts       # getProducts(department?, group?), formatPrice()
    posts.ts          # getPosts(), isPublishable(), formatDate()
    icon-names.ts      # danh sách tên icon đường nét (IconName) dùng cho GroupIcon
    url.ts            # url(): thêm đường dẫn gốc (base) vào liên kết nội bộ
    site.ts           # thông tin thương hiệu dùng chung (tên, số điện thoại): đổi ở đây là đổi toàn site
  components/         # Header, Footer, Disclaimer, PostCard, ZaloButton (nút "Gọi ngay qua Zalo"), ZaloFloat (biểu tượng Zalo nổi ở mọi trang), GroupIcon (icon đường nét tự vẽ), ShopShell/ProductCard/ProductNotice (khu bán hàng)
  layouts/            # BaseLayout (meta, canonical, JSON-LD)
  pages/
    index.astro               # trang chủ
    [category]/index.astro    # trang chuyên mục bài viết
    [category]/[slug].astro   # trang bài viết, URL dạng /an-uong/ten-bai/
    [category]/nhom/[group].astro  # trang một nhóm con, URL dạng /kien-thuc-ve-thuoc/nhom/khang-sinh/
    [department]/index.astro      # trang một khu bán hàng, URL dạng /thuc-pham-chuc-nang/
    [department]/nhom/[group].astro  # trang một nhóm sản phẩm, URL dạng /thiet-bi-y-te/nhom/nhiet-ke/
    [department]/[slug].astro     # trang chi tiết sản phẩm, nút Mua ngay/Thêm vào giỏ
    gio-hang.astro            # giỏ hàng và form đặt hàng, gộp sản phẩm từ mọi khu (noindex)
    gioi-thieu.astro          # trang giới thiệu dược sĩ Thương, có nút gọi và lưu ý cấp cứu 115
    tim-kiem.astro            # trang tìm kiếm (Pagefind UI, hỗ trợ ?q=từ-khóa)
    404.astro                 # trang báo lỗi không tìm thấy
    robots.txt.ts             # robots.txt, tự lấy tên miền từ `site`
  styles/global.css   # CSS toàn site
src/assets/
  cover.jpg           # ảnh bìa thương hiệu (2048x762), hiện ở đầu trang chủ
  logo.jpg            # logo chính thức (hình tròn viền xanh, 640x640), hiện ở header
public/               # favicon.png, apple-touch-icon.png, og-image.jpg, _headers (chỉ Cloudflare/Netlify dùng)
docs/                 # tài liệu nội bộ, KHÔNG đăng lên website (ví dụ ghi chú cho người kiểm duyệt)
astro.config.mjs      # `site` = https://duocsithuong.com (không có `base`)
.github/workflows/    # deploy.yml: tự build và deploy khi đẩy code lên `main`
.nvmrc                # phiên bản Node dùng khi build
```

### Deploy lên GitHub Pages

- Repo: https://github.com/huynam-codegym/duoc-si-thuong (công khai, vì GitHub Pages bản miễn phí yêu cầu vậy)
- Website: **https://duocsithuong.com** (tên miền mua ở Cloudflare Registrar, tháng 9/2026, gia hạn tự động hằng năm)
- DNS quản lý ở Cloudflare (mục DNS > Records của tên miền): 4 bản ghi `A` cho `@` trỏ tới 185.199.108.153, .109.153, .110.153, .111.153 và 1 bản ghi `CNAME` cho `www` trỏ tới `huynam-codegym.github.io`. **Tất cả phải để "DNS only" (đám mây xám)**, nếu bật Proxied thì GitHub không cấp được HTTPS.
- Tên miền được khai báo trong Settings > Pages của repo (không dùng file `CNAME` vì workflow tự deploy bỏ qua file này).
- Tự động deploy mỗi lần đẩy code lên nhánh `main`, qua `.github/workflows/deploy.yml` (dùng `withastro/action` và `actions/deploy-pages`). Có thể chạy tay ở tab Actions (workflow_dispatch).

Website chạy ở gốc tên miền nên `astro.config.mjs` **không có `base`**. Tuy vậy mọi liên kết nội bộ vẫn phải viết qua hàm `url()` trong `src/lib/url.ts`, ví dụ `href={url('/an-uong/')}`, **không viết `href="/..."` trực tiếp**. Làm vậy để nếu sau này phải dùng lại đường dẫn con (ví dụ github.io/duoc-si-thuong) thì chỉ cần thêm `base` vào cấu hình.

Khi chạy `npm run dev` hoặc `npm run preview`, mở http://localhost:4321/.

Lưu ý:
- Chỉ bài đã kiểm duyệt (`draft: false` và có `reviewedBy`) mới lên website. Chưa có bài nào thì website hiện "đang biên soạn".
- `public/_headers` chỉ có tác dụng trên Cloudflare Pages/Netlify, GitHub Pages bỏ qua.
- Vì repo công khai, mã nguồn (kể cả bài nháp) ai cũng xem được. Đừng để thông tin nhạy cảm hoặc bài chưa muốn lộ trong repo.

Sau khi deploy, kiểm tra: trang chủ, một bài viết, `/tim-kiem/`, `/sitemap-index.xml`, và một địa chỉ không tồn tại (phải ra trang 404).

### Nhận diện thương hiệu

- **Ảnh bìa** `src/assets/cover.jpg`: dược sĩ Thương (chủ website) mặc áo blouse tại nhà thuốc, có sẵn tên thương hiệu, khẩu hiệu "Dược sĩ đồng hành chăm sóc sức khỏe gia đình bạn", "Hơn 10 năm kinh nghiệm", số điện thoại **0988 283 415**. Dùng qua component `<Image>` của Astro (tự tạo ảnh webp nhiều kích cỡ). Văn bản alt của ảnh đã ghi lại các nội dung này, khi đổi ảnh bìa phải sửa alt ở `src/pages/index.astro`.
- **Logo** `src/assets/logo.jpg`: **logo chính thức** do chủ website cung cấp (tháng 9/2026): hình tròn viền xanh lá, chân dung dược sĩ Thương mặc áo blouse, chữ "Dược sĩ Thương - Đồng hành chăm sóc sức khỏe gia đình bạn". Gốc 1254x1254, thu về 640x640. Ảnh có 4 góc trắng ngoài vòng tròn nên ở header dùng `border-radius: 50%` để cắt tròn (`.brand-logo` trong `src/styles/global.css`). Khi đổi logo: thay file (giữ tên `logo.jpg`) rồi tạo lại favicon và apple-touch-icon.
- **Favicon và ảnh chia sẻ mạng xã hội** trong `public/`: `favicon.png` (64px, cắt tròn, 4 góc trong suốt) và `apple-touch-icon.png` (180px, hình vuông nền trắng) đều tạo từ logo chính thức; `og-image.jpg` (1200x630) là ảnh bìa đặt giữa nền trắng (dùng khi chia sẻ trang chủ, trang không có ảnh đại diện riêng). Các file này tạo bằng script (thư viện `sharp`), nên khi đổi logo hoặc ảnh bìa phải tạo lại cho khớp. Trình duyệt giữ favicon rất lâu, đổi xong người dùng có thể phải xóa bộ nhớ đệm mới thấy.
- Màu chủ đạo: xanh lá (`--green-900`, `--green-700` trong `src/styles/global.css`), khớp với ảnh bìa.
- **Số điện thoại 0988 283 415** lưu ở `src/lib/site.ts` (một nơi duy nhất). Nút liên hệ là component `ZaloButton`: bấm vào mở **Zalo** của số này (`https://zalo.me/0988283415`, mở tab mới, trên điện thoại mở ứng dụng Zalo nếu đã cài). Có ở trang Giới thiệu, trang Hỏi đáp và chân trang. **Trang chủ không có nút này và không có đoạn giới thiệu "Kiến thức về ăn uống, nhận biết bệnh..." dưới ảnh bìa** (chủ website đã yêu cầu bỏ, không thêm lại); trang chủ chỉ giữ ảnh bìa, vùng bấm trong ảnh và biểu tượng Zalo nổi. Ngoài ra khối "0988 283 415 | Liên hệ ngay" **nằm trong ảnh bìa** cũng bấm được: có một liên kết trong suốt `.banner-cta` phủ lên đúng vị trí đó (trong `src/pages/index.astro`, CSS ở `src/styles/global.css`, vị trí tính theo % của ảnh gốc 2048x762: trái 21.3%, rộng 38.6%, tâm dọc 81.2%, cao 13.6%). **Khi đổi ảnh bìa phải đo lại các con số này** cho khớp khối liên hệ mới. Khi rê chuột (hoặc focus bàn phím) vùng này hiện **viền cam `#ea580c`** cùng nhãn "Bấm để nhắn Zalo" (nền `#c2410c`); chọn màu cam vì đối lập với xanh lá của ảnh bìa nên người dùng nhận ra chỗ bấm được. Chủ website chọn Zalo thay cho gọi điện thường; liên kết `tel:` vẫn còn trong `site.ts` (`phoneHref`) nhưng hiện không nút nào dùng. Nếu số điện thoại đổi mà không còn dùng Zalo, sửa `zaloHref`. Đổi số thì chỉ sửa `site.ts` và ảnh bìa (số cũng nằm trong ảnh, phải sửa alt ở `src/pages/index.astro`).
- **Chuyên môn và chức vụ** do chủ website cung cấp (tháng 9/2026), lưu ở `src/lib/site.ts`: **Dược sĩ đại học**, **CEO Nhà Thuốc Nhật Minh**, trang Facebook của nhà thuốc https://www.facebook.com/nhathuocnhatminhhanoi. Hiển thị ở trang Giới thiệu (thẻ chuyên môn, nút Facebook), chân trang và dữ liệu schema.org (`Person`).
- **Trang Giới thiệu** chỉ dùng thông tin chủ website đã công bố (ảnh bìa và các thông tin trên). **Không tự thêm bằng cấp cụ thể, số chứng chỉ hành nghề, địa chỉ nhà thuốc, tên trường** khi chưa có thông tin do chủ website cung cấp. Không tự nói nhà thuốc ở tỉnh/thành nào.
- **Minh bạch với nhà thuốc:** chủ website điều hành một nhà thuốc, nên **bài viết kiến thức** (các chuyên mục ở menu trên) vẫn là nội dung chia sẻ, **không quảng cáo và không gắn liên kết bán sản phẩm**. Việc bán hàng chỉ nằm trong khu riêng **Thực phẩm chức năng** (chủ website yêu cầu tháng 9/2026, xem mục "Khu Thực phẩm chức năng"). Không chèn liên kết sản phẩm vào bài viết; nếu một bài có nhắc đến sản phẩm hoặc nhà thuốc thì phải nói rõ mối liên hệ đó (xem thêm nguyên tắc 6 và 9 ở mục "Nguyên tắc nội dung sức khỏe").
- Ảnh bìa chứa số điện thoại và ảnh cá nhân, đó là thông tin chủ website đã chủ động công khai. Không thêm thông tin liên hệ hay ảnh cá nhân khác (email, địa chỉ, mạng xã hội...) khi chưa được chủ website đồng ý.

### Liên hệ và hỏi đáp qua Zalo (không dùng Zalo OA)

- **Chủ website đã quyết định không dùng chat Zalo OA** (cũng không dùng Tawk.to). Toàn bộ liên hệ đi qua **Zalo cá nhân** `https://zalo.me/0988283415`. Không thêm lại khung chat OA hay dịch vụ chat bên thứ ba khi chưa được chủ website yêu cầu.
- **Biểu tượng Zalo nổi ở mọi trang** (`src/components/ZaloFloat.astro`, gắn trong `BaseLayout`): nút vuông bo tròn nền trắng, viền xanh Zalo `#0068ff`, chữ "Zalo", cố định ở góc phải dưới; bấm vào mở Zalo cá nhân (tab mới). Là biểu tượng tự vẽ bằng SVG theo kiểu biểu tượng chat của Zalo, không phải logo chính thức.
- Website **không nạp mã của bên thứ ba nào cho việc chat**. (Trang "Hỏi đáp" và component `ChatPanel` đã bỏ tháng 9/2026 theo yêu cầu chủ website; liên hệ hỏi đáp giờ chỉ qua biểu tượng Zalo nổi và nút Zalo ở trang Giới thiệu, chân trang.)
- Trình duyệt giữ bản trang cũ tối đa khoảng 10 phút (GitHub Pages đặt `Cache-Control: max-age=600`), nên sau khi deploy nếu người dùng chưa thấy thay đổi thì bảo họ tải lại cứng (Ctrl+F5) hoặc mở cửa sổ ẩn danh.
- **Quy tắc khi tư vấn qua tin nhắn:** chỉ tham khảo, không chẩn đoán, không kê đơn, không hứa chữa khỏi (như các nguyên tắc nội dung sức khỏe ở trên). Trường hợp có dấu hiệu nguy hiểm hướng dẫn khách gọi 115 hoặc đến cơ sở y tế. Khung hỏi đáp đã có dòng lưu ý: không gửi CCCD, mật khẩu, thông tin thanh toán.
- **Dữ liệu cá nhân:** câu hỏi sức khỏe là thông tin nhạy cảm. Vẫn nên lưu ý quy định bảo vệ dữ liệu cá nhân của Việt Nam (Nghị định 13/2023/NĐ-CP) khi lưu trữ hoặc dùng lại nội dung khách hỏi (ví dụ đăng thành bài Hỏi đáp phải ẩn danh và xin phép).

### Cách thêm bài viết mới

1. Tạo file `.md` trong `src/content/posts/`. Tên file không dấu, dùng gạch ngang; tên file chính là phần cuối của URL.
2. Điền đủ frontmatter như bên dưới. Để `draft: true` và `reviewedBy: ""` cho đến khi được kiểm duyệt.
3. Chạy `npm run dev` để xem thử (bài nháp sẽ có banner cảnh báo).
4. Sau khi dược sĩ/bác sĩ kiểm duyệt: điền `reviewedBy`, đổi `draft: false`. Bài chỉ xuất hiện trong `npm run build` khi **cả hai** điều kiện này thỏa.

Muốn thêm hoặc đổi tên chuyên mục: sửa `src/lib/categories.ts`, các phần khác (menu, trang chuyên mục, schema) tự cập nhật theo.

### Lưu ý về bài mẫu

5 bài hiện có trong `src/content/posts/` là **bài mẫu do AI soạn**, đều là bản nháp, chưa được kiểm duyệt. Không đăng trước khi dược sĩ/bác sĩ rà soát nội dung và kiểm tra lại nguồn.

### Frontmatter bắt buộc của mỗi bài viết

```yaml
---
title: "Tiêu đề bài viết"
description: "Mô tả ngắn 1-2 câu, dùng cho SEO"
category: "an-uong"        # an-uong | kien-thuc-ve-thuoc (menu hiện tên "Thuốc")
subcategory: "khang-sinh"   # nhóm con (không bắt buộc), chỉ dùng cho chuyên mục có nhóm, xem mục "Nhóm con và menu thả xuống"
publishedAt: 2026-01-01
updatedAt: 2026-01-01
cover: "../../assets/posts/ten-bai/cover.jpg"   # ảnh đại diện (không bắt buộc), xem mục "Hình ảnh trong bài viết"
coverAlt: "Mô tả ảnh cho người đọc màn hình"      # bắt buộc nếu có cover
coverCredit: "Đồ họa: Dược Sĩ Thương. Số liệu: WHO"  # nguồn/tác giả ảnh, hiện dưới ảnh
sources:                   # bắt buộc, ít nhất 1 nguồn uy tín
  - title: "Tên nguồn"
    url: "https://..."
reviewedBy: ""             # người kiểm duyệt (dược sĩ/bác sĩ), để trống nếu chưa kiểm duyệt
draft: true                # đổi thành false sau khi được kiểm duyệt
---
```

Bài có `draft: true` hoặc `reviewedBy` để trống thì **không được đăng** lên bản chính thức.

### Nhóm con và menu thả xuống

- Một chuyên mục có thể có **nhóm con**. Hiện có hai chuyên mục: "Kiến thức về thuốc" (10 **nhóm thuốc**) và "Ăn uống & dinh dưỡng" (9 nhóm: Nguyên tắc ăn uống và 8 vi chất "Thiếu gì, ăn gì"). Nhóm thuốc gồm (kháng sinh, giảm đau/hạ sốt, kháng viêm, dạ dày, ho/cảm cúm, dị ứng, vitamin/khoáng chất, tim mạch/huyết áp, đái tháo đường, dùng thuốc an toàn). Danh sách khai báo trong `src/lib/categories.ts` (mục `groups`), đó là nguồn duy nhất.
- **Menu thả xuống trên máy tính (từ 77rem trở lên)** ở thanh đầu trang (`src/components/Header.astro`): rê chuột vào "Kiến thức về thuốc" thì hiện danh sách nhóm (mục đầu là "Xem tất cả bài viết"). Cũng bấm mũi tên nhỏ cạnh tên mục để mở bằng bàn phím; bấm ra ngoài hoặc nhấn Esc để đóng. Menu luôn liệt kê **đủ nhóm đã khai báo**, kể cả nhóm chưa có bài công khai (trang nhóm khi đó hiện "chưa có bài viết được kiểm duyệt").
- **Menu dạng ngăn kéo trên điện thoại và máy tính bảng (dưới 77rem, ví dụ iPhone, Samsung, iPad đứng)** (chủ website yêu cầu tháng 9/2026, theo mẫu Long Châu gửi, không sao chép giao diện của họ): thanh menu ngang **ẩn hẳn**, thay bằng **nút 3 gạch** ở đầu trang (`#mobile-menu-btn`, cạnh logo). Bấm vào mở khung `#mobile-drawer` trượt ra từ bên trái (rộng tối đa 23rem), có nền mờ phía sau, đóng bằng nút ✕, bấm ra ngoài hoặc nhấn Esc. Bên trong liệt kê đủ 4 khu bán hàng, 2 chuyên mục bài viết và Giới thiệu; mục nào có nhóm con thì bấm mũi tên để mở/đóng kiểu accordion (không hiện khung xem trước sản phẩm như menu lớn trên máy tính, chỉ danh sách tên nhóm kèm icon, để gọn cho màn hình nhỏ). Cuối khung có nút "Nhắn Zalo tư vấn". Ở máy tính bảng nằm ngang hoặc màn hình rộng hơn (≥77rem) quay lại dùng thanh menu ngang bình thường, không có nút 3 gạch. Đổi ngưỡng 77rem thì sửa CSS (`@media (max-width: 76.99rem)` và `@media (min-width: 77rem)`, xem thêm mục "Bẫy kỹ thuật rem" ngay dưới) **và** hàm `isDesktop()` trong script cuối `Header.astro` (dùng cho khay xem nhanh giỏ hàng, xem mục "Giỏ hàng và đặt hàng") — hai nơi phải luôn khớp nhau, xem bẫy đã gặp bên dưới.
  - **Mũi tên (chevron) của accordion phải luôn có `width`/`height` rõ ràng trong CSS** (`.mobile-drawer-toggle svg`). Thiếu dòng này từng làm mũi tên hiện quá to hoặc mất hẳn tùy trình duyệt trên điện thoại thật (dù trên máy tính xem thử vẫn đúng) — SVG không có kích thước sẽ dùng cỡ mặc định của trình duyệt, mỗi nơi một khác. Thêm icon/nút SVG mới ở bất kỳ đâu trong site cũng nên đặt `width`/`height` tường minh, không chỉ dựa vào `viewBox`.
  - **Hàng đầu trang (logo, nút giỏ hàng, ô tìm kiếm) dễ bị tràn ở màn hình hẹp** vì phải chứa cả nút 3 gạch. Đã xử lý: ô tìm kiếm rộng luôn xuống hàng riêng ở mọi màn hình dưới 77rem (kể cả máy tính bảng và một số laptop màn hình nhỏ), chỉ nằm cùng hàng với logo/giỏ hàng khi màn hình đủ rộng (≥77rem, không còn nút 3 gạch). Nếu sau này đổi nội dung hàng đầu trang, nhớ kiểm tra lại độ rộng ở khổ hẹp nhất (khoảng 320-375px) vì đây là chỗ dễ vỡ layout nhất.
  - **Bẫy kỹ thuật: `rem` trong `@media` không cùng cỡ với `rem` trong CSS thường.** Trang đặt `html{font-size:112.5%}` (18px) để chữ to hơn cho người lớn tuổi, nên `1rem` trong CSS thường (kể cả biến `--max-wide: 68rem`) = 18px → khung nội dung rộng tối đa thật sự là **1224px**, không phải 1088px. Nhưng trình duyệt tính `rem` trong `@media` theo cỡ chữ mặc định 16px (không đổi theo `html{font-size}`), nên `64rem` trong `@media` chỉ là 1024px. Hai mốc này **lệch nhau** nên từng có một khoảng "chết" (khoảng 1024-1224px, ví dụ iPad ngang, laptop màn nhỏ, cửa sổ trình duyệt chia đôi) nơi nút 3 gạch đã ẩn nhưng khung vẫn chưa đủ 1188px thật sự cần cho 7 mục, khiến "Giới thiệu" bị rớt xuống dòng riêng — đã sửa bằng cách đưa mọi mốc liên quan (ẩn/hiện nút 3 gạch, ẩn/hiện thanh menu ngang, đổi hàng ô tìm kiếm) về cùng **77rem trong `@media`** (≈1232px, đúng lúc khung 1224px đã đạt tối đa và chắc chắn đủ chỗ). Khi thêm mốc `@media` mới liên quan đến bố cục đầu trang, luôn **đo thử bằng trình duyệt** ở nhiều khổ (không chỉ 375/768/1280) thay vì tính nhẩm bằng rem, vì rất dễ tính sai như trên.
  - **Tên thương hiệu cạnh logo** (`.brand-name`): dùng ở khung ngăn kéo `.mobile-drawer-brand` (giữ nguyên, một dòng cỡ chữ bình thường vì đủ chỗ) và trước đây cũng dùng ở hàng đầu trang. **Tháng 9/2026 (đợt sau), chủ website yêu cầu đổi tiếp:** ở màn hình **≤30rem** (điện thoại), bỏ hẳn logo + tên thương hiệu khỏi hàng đầu trang (`.header-main .brand{display:none}`), nhường chỗ cho **ô tìm kiếm** — cả 3 nằm chung 1 hàng: nút 3 gạch / ô tìm kiếm (`.search-wrap`, đổi `order` và `flex` để không còn tự xuống hàng riêng) / giỏ hàng, đúng mẫu ảnh Long Châu gửi. Thương hiệu không mất hẳn — vẫn còn logo + tên trong khung ngăn kéo khi bấm nút 3 gạch (`.mobile-drawer-brand`). Máy tính bảng và màn hình rộng hơn (>30rem, dưới 77rem vẫn có nút 3 gạch) **giữ nguyên** layout cũ: có logo/tên, ô tìm kiếm xuống hàng riêng bên dưới. **Bẫy kỹ thuật:** đổi `.search-wrap` sang `flex: 1 1 auto` tưởng đủ để nó "co giãn lấp chỗ trống" cùng hàng với nút 3 gạch/giỏ hàng, nhưng `flex-basis: auto` khiến trình duyệt tính kích thước ban đầu của ô này theo **nội dung** (ô nhập liệu muốn rộng bao nhiêu tuỳ ý) chứ không phải chỗ trống thật còn lại — kích thước "mong muốn" đó lớn hơn khung hẹp nên bị coi là không vừa hàng, đẩy cả nút 3 gạch lẫn giỏ hàng xuống dòng riêng dù 3 mục cộng lại vẫn thừa chỗ (test bằng mắt trên trình duyệt thật mới thấy, đo bằng rect mới rõ). Phải đổi thành `flex: 1 1 0%` (flex-basis 0%) để trình duyệt bỏ qua kích thước nội dung, chỉ chia chỗ trống còn lại theo `flex-grow`. Đổi tên thương hiệu thì sửa cả hai nơi dùng chữ "Dược Sĩ"/"Thương" (`Header.astro`, cả `.brand` lẫn `.mobile-drawer-brand`).
  - **Bẫy đã gặp — hai mốc "máy tính" không khớp nhau:** khay xem nhanh giỏ hàng (`isDesktop()` trong script `Header.astro`, xem mục "Giỏ hàng và đặt hàng") từng dùng `min-width: 64rem` — SAI, lệch với mốc THẬT của site (77rem, xem mục "Bẫy kỹ thuật rem" ngay trên). Hậu quả: ở khổ 64–77rem (~1024–1232px, ví dụ iPad ngang, laptop màn nhỏ), site đã hiện menu ngăn kéo (coi là "điện thoại") nhưng khay giỏ hàng lại chạy kiểu "máy tính" (rê chuột mở khay) thay vì kiểu điện thoại (khay chọn số lượng + thông báo chữ) — không nhất quán, dễ bị bỏ sót vì phải test đúng khổ hẹp đó mới thấy. Đã sửa về cùng `77rem`. Mọi chỗ dùng khái niệm "có phải máy tính hay không" trong site (kể cả JS `matchMedia`, không riêng CSS `@media`) đều phải cùng một mốc — thêm tính năng phân biệt máy tính/điện thoại mới nhớ kiểm tra lại các mốc đã có, không tự đặt số mới.
- Mỗi nhóm có trang riêng `/kien-thuc-ve-thuoc/nhom/<nhóm>/` (`src/pages/[category]/nhom/[group].astro`) liệt kê bài của nhóm và các nhóm khác. Trang chuyên mục cũng có phần "Chọn theo nhóm". Đầu mỗi bài hiện thêm thẻ tên nhóm.
- Gắn bài vào nhóm bằng `subcategory: "<slug nhóm>"` trong frontmatter. Build sẽ báo lỗi nếu slug không có trong `categories.ts`.
- **Biểu tượng nhỏ trong menu thả xuống:** mỗi nhóm có trường `icon` trong `categories.ts`/`departments.ts`, kiểu `IconName` (`src/lib/icon-names.ts`). Biểu tượng là **icon đường nét tự vẽ** (component `src/components/GroupIcon.astro`, SVG nét mảnh màu xanh lá, khớp màu thương hiệu), **không dùng emoji nữa** (chủ website yêu cầu tháng 9/2026, vì emoji hiện mỗi máy/điện thoại một kiểu, không đồng bộ). Biểu tượng chỉ để trang trí (`aria-hidden`), chữ bên cạnh vẫn là tên nhóm. Dùng ở khắp dự án: menu thả xuống, menu lớn của từng khu bán hàng, menu bên trái khu bán hàng, thẻ danh mục sản phẩm ở trang chủ (`<GroupIcon badge />`, có khung tròn), tiêu đề trang nhóm sản phẩm, và dải cam kết ở trang chủ (`doctor`, `chat`, `book`).
  - **Thêm icon mới:** thêm tên vào `IconName` trong `src/lib/icon-names.ts`, rồi thêm một khối `{name === '...' && (...)}` ở **cả hai** nhánh (có khung tròn và không khung) trong `GroupIcon.astro`. Vẽ đơn giản: hình học cơ bản (đường tròn, cung, đường thẳng), khung 24x24, nét dày `stroke-width="1.7"`, để icon cùng một "họ" nhìn đồng bộ.
  - **Bảng ánh xạ hiện tại** (một icon có thể dùng cho nhiều nhóm cùng ý nghĩa): `salad` nguyên tắc ăn uống; `bone` canxi/xương khớp; `droplet` sắt/đường huyết/tiểu đường; `sun` vitamin D; `egg` vitamin B12; `shell` kẽm; `wave` i-ốt; `citrus` vitamin C/vitamin-khoáng chất; `leaf` acid folic; `bacteria` kháng sinh; `thermometer` giảm đau hạ sốt; `capsule` kháng viêm; `stomach` dạ dày/tiêu hóa; `wind` ho cảm cúm; `flower` dị ứng/phụ nữ mẹ bầu; `heart` tim mạch; `shield` dùng thuốc an toàn/đề kháng; `eye` mắt; `brain` thần kinh não; `sparkle` làm đẹp; `baby` trẻ em; `book`/`cart` mục "Xem tất cả"; `doctor`/`chat` dải cam kết trang chủ.
- **Thêm nhóm mới:** thêm vào `groups` trong `categories.ts` (bắt buộc có `icon`); menu, trang nhóm và sitemap tự cập nhật. Muốn chuyên mục khác cũng có nhóm con thì thêm `groups` cho chuyên mục đó, không cần sửa code khác.
- **Quy tắc riêng cho bài về thuốc:** không đưa liều dùng cụ thể; nêu chống chỉ định, tác dụng phụ, tương tác, người cần thận trọng (trẻ em, phụ nữ có thai/cho con bú, người cao tuổi, bệnh nền), dấu hiệu cần đi khám/cấp cứu (115); không nêu tên biệt dược/thương hiệu; chỉ dùng tên hoạt chất. Ghi rõ điều nào **chưa đối chiếu trực tiếp với nguồn** trong `docs/` để người kiểm duyệt kiểm tra (xem `docs/ghi-chu-kiem-duyet-nhom-thuoc.md`).
- **Ảnh đại diện của các bài về thuốc** là ảnh minh họa thống nhất (nhãn nhóm, tiêu đề, biểu tượng emoji, nền xanh lá) do chủ website và Claude thiết kế bằng HTML rồi chụp thành ảnh; ảnh **không chứa số liệu y khoa**.
- **Hình trong bài về thuốc:** (lưu ý kỹ thuật: khi chụp hình từ HTML phải ẩn thanh cuộn của trình duyệt, nếu không ảnh bị dính thanh cuộn xám) mỗi bài có ảnh đại diện (`cover.jpg`) và 2 hình minh họa trong nội dung (`hinh-1.jpg`, `hinh-2.jpg`) trong `src/assets/posts/<tên-bài>/`: bảng so sánh, danh sách dấu hiệu, các bước. Đều là **đồ họa tự thiết kế**, chỉ dùng thông tin đã có trong bài (không thêm số liệu mới). Dựng bằng HTML/CSS rồi chụp ảnh; khổ rộng 1000px, chữ từ khoảng 30px trở lên để vẫn đọc được trên điện thoại (ảnh thu nhỏ còn khoảng 1/3). Mỗi hình có alt mô tả đầy đủ nội dung và dòng in nghiêng ghi nguồn. Bảng chữ vẫn giữ bên dưới hình để người dùng đọc màn hình và công cụ tìm kiếm có đủ thông tin.
- **"Bản xem thử":** bài hiện trên web nhưng chưa có người kiểm duyệt được đánh dấu bằng `draft: false` và `reviewedBy: "(bản xem thử, chưa được kiểm duyệt)"` (giá trị bắt đầu bằng dấu `(` nghĩa là chỉ ghi chú trạng thái, không phải tên người). Với bài như vậy website tự: hiện khung vàng "Bản xem thử: bài này đang chờ dược sĩ kiểm duyệt" ở đầu bài, ghi "Chưa được kiểm duyệt" ở dòng thông tin, thêm `noindex` để Google không lập chỉ mục, **không** ghi người kiểm duyệt vào dữ liệu schema.org, và ghi "Bản xem thử, chờ kiểm duyệt" ở thẻ bài. Hàm `isPreview()`/`hasRealReviewer()` trong `src/lib/posts.ts`.
- **Khi dược sĩ đã rà soát một bài:** sửa nội dung nếu cần, đổi `reviewedBy` thành tên người kiểm duyệt thật (không để dấu `(` ở đầu), cập nhật `updatedAt`, và sửa các dòng nguồn "kiến thức chung, đang chờ dược sĩ kiểm duyệt" trong hình (bài đái tháo đường) nếu đã có nguồn. Khung vàng, `noindex` và nhãn tự biến mất.
- **Trạng thái tháng 9/2026:** 10 bài (kháng sinh, giảm đau/hạ sốt, kháng viêm, dạ dày, ho/cảm cúm, dị ứng, vitamin, huyết áp, đái tháo đường, đọc nhãn thuốc) đã đăng ở dạng **bản xem thử theo yêu cầu của chủ website**; đều do AI soạn, **chưa được kiểm duyệt**. Bài kháng sinh còn mỏng (thiếu tác dụng phụ, trẻ em, thai kỳ) và nguồn WHO của bài không nêu trực tiếp lời khuyên, đã thêm MedlinePlus Antibiotics. Nguồn chủ yếu là MedlinePlus, WHO, FDA; chưa có nguồn Việt Nam (Bộ Y tế, Dược thư quốc gia). Điểm cần dược sĩ kiểm tra: `docs/ghi-chu-kiem-duyet-nhom-thuoc.md`.

### "Tra cứu thuốc / dược chất / dược liệu" (tháng 9/2026, tạm thay cho danh sách nhóm bài viết trên menu)

Chủ website gửi ảnh trang "Tra cứu thuốc" của Long Châu (tra cứu theo tên biệt dược, có mục Tra cứu thuốc/Tra cứu dược chất/Tra cứu dược liệu) và muốn menu "Thuốc" đổi sang kiểu này. Cách xử lý, và **lý do không làm giống hệt**:

- **Long Châu liệt kê theo tên biệt dược/thương hiệu** (ví dụ "Gel Klenzit MS", "Viên sủi Berocca Bayer") vì họ là nhà thuốc có giấy phép bán thuốc online thật. Site này **chưa có giấy phép kinh doanh dược qua thương mại điện tử** (xem mục "Cấu trúc nội dung" và "Khu bán hàng" ở trên) và quy tắc riêng cho bài về thuốc đã có từ trước là **chỉ dùng tên hoạt chất, không nêu tên biệt dược** — nên sau khi trao đổi, chủ website đồng ý đổi "Tra cứu thuốc" sang tra cứu theo **tên hoạt chất** (kèm lọc theo nhóm bệnh), không dùng tên thương hiệu.
- **Dữ liệu hiện tại chỉ là ví dụ để lên giao diện**, chủ website đã đồng ý dùng tạm (tháng 9/2026): một số hoạt chất và dược liệu phổ biến, **không có trang chi tiết riêng** (không có liều dùng, chỉ định, chống chỉ định...) vì đây là dữ liệu dạng từ điển số lượng lớn, không thể tự soạn hàng loạt mà không bịa thông tin y khoa (nguyên tắc 1, 10). Tên hiện chỉ để duyệt/tìm (không phải liên kết). Xem ghi chú đầy đủ trong `src/lib/drug-lookup.ts`.
- **3 trang mới** (đường dẫn gốc, không lồng trong `/kien-thuc-ve-thuoc/`): `/tra-cuu-thuoc/` (có thêm tile lọc theo nhóm: Kháng sinh & kháng nấm, Tim mạch, Thần kinh, Tiêu hóa & gan mật), `/tra-cuu-duoc-chat/`, `/tra-cuu-duoc-lieu/` — cùng dùng component `src/components/AzLookup.astro` (ô tìm kiếm gõ-là-lọc + chỉ mục A-Z + danh sách thẻ chữ). Cả 3 trang có `noindex` (bản xem thử giao diện, không phải nội dung đã kiểm duyệt).
- **Menu "Thuốc"** (`Header.astro`, hằng số `drugLookupLinks`): dropdown giờ hiện 3 mục này (kèm icon `search`/`flask`/`leaf`) **thay vì** danh sách 10 nhóm bài "Kiến thức về thuốc" như trước — chỉ đổi phần *hiển thị trên menu*, 10 bài và trang nhóm cũ (`/kien-thuc-ve-thuoc/nhom/...`) **vẫn còn nguyên**, chỉ tạm không có lối vào từ menu thả xuống (vẫn vào được qua trang chuyên mục `/kien-thuc-ve-thuoc/` ở đầu dropdown, hoặc tìm kiếm). Muốn khôi phục danh sách nhóm cũ trên menu: bỏ điều kiện `isDrugLookup`/`slug === 'kien-thuc-ve-thuoc'` ở `Header.astro` (cả bản desktop và `drawerSections`).
- **`foldVietnamese`** (bỏ dấu tiếng Việt cho ô tìm kiếm) đã tách ra `src/lib/text.ts` (không import `astro:content`) để dùng được trong mã chạy ở trình duyệt; `posts.ts` re-export lại hàm này để chỗ khác không phải đổi import. **Bẫy kỹ thuật:** một hàm dùng trong thẻ `<script>` (chạy ở trình duyệt) không được nằm trong file có import `astro:content`, nếu không build sẽ báo lỗi `ServerOnlyModule` — nhớ để hàm dùng chung (không phụ thuộc nội dung bài viết) ở file riêng như `text.ts`.

### Loạt bài "Thiếu gì, ăn gì" (chuyên mục "Bệnh & Góc Sức Khỏe", slug `an-uong`)

- 8 bài, mỗi bài một vi chất: canxi, sắt, vitamin D, vitamin B12, kẽm, i-ốt, vitamin C, acid folic. Slug dạng `thieu-<vi-chất>-nen-an-gi`, nhóm dạng `thieu-<vi-chất>` (khai báo trong `categories.ts`, có icon riêng). Bài "5 nguyên tắc ăn uống lành mạnh" thuộc nhóm `nguyen-tac`. Xem menu thả xuống của chuyên mục Ăn uống.
- **Bố cục mỗi bài:** tóm tắt nhanh; vi chất giúp gì; **thực phẩm giàu vi chất (kèm hình)**; cách hấp thu tốt hơn hoặc dấu hiệu/nguy cơ (kèm hình); nhu cầu mỗi ngày (ghi rõ là khuyến nghị của Hoa Kỳ theo MedlinePlus); thiếu và thừa; khi nào đi khám; liên kết "Xem thêm".
- **Nguồn chính:** trang MedlinePlus Medical Encyclopedia của từng vi chất (`https://medlineplus.gov/ency/article/<mã>.htm`, ví dụ 002412 canxi, 002422 sắt, 002405 vitamin D, 002403 B12, 002416 kẽm, 002421 i-ốt, 002404 vitamin C, 002408 acid folic). Bài canxi có thêm ý kiến chuyên gia Viện Dinh dưỡng Quốc gia qua báo Dân trí.
- **Số liệu trong hình phải có nguồn.** Ví dụ tôm, cua: chỉ nêu khi có nguồn (cua đồng 5.040 mg/100 g, tôm nhỏ 910 mg/100 g theo Viện Dinh dưỡng) và luôn kèm điều kiện "ăn cả mai, yếm, vỏ, xương". Không nêu thực phẩm hay số liệu chưa có nguồn trong hình; nếu cần nhắc trong nội dung thì ghi vào `docs/ghi-chu-kiem-duyet-thieu-gi-an-gi.md`.
- **Nhóm thực phẩm và tên gọi** dùng cách gọi quen thuộc ở Việt Nam. Không khuyến khích tự uống viên bổ sung liều cao; luôn có mục "Khi nào cần đi khám".
- **Tất cả 8 bài (và bài nguyên tắc) đang ở dạng "bản xem thử"** (xem mục Bản xem thử ở trên), do AI soạn, chưa được kiểm duyệt. Điểm cần kiểm tra: `docs/ghi-chu-kiem-duyet-thieu-gi-an-gi.md`. Mức khuyến nghị hằng ngày đang theo Hoa Kỳ, cần thay bằng "Nhu cầu dinh dưỡng khuyến nghị cho người Việt Nam".
- **Liên kết giữa các bài** trong Markdown dùng đường dẫn từ gốc (ví dụ `/an-uong/thieu-canxi-nen-an-gi/`), và chỉ trỏ tới bài đang được đăng, nếu không sẽ ra trang 404.

### Chuyên mục "Bệnh & Góc Sức Khỏe" (trước là "Ăn uống & dinh dưỡng") và trang chủ (tháng 9/2026)

Chủ website gửi ảnh trang chủ Long Châu, có mục "Bệnh theo mùa" (tab theo tên bệnh, kèm sản phẩm), "Video ngắn nổi bật" (reels) và muốn mở thêm chuyên mục bệnh. Cách xử lý:

- **Chuyên mục `an-uong` đổi tên thật thành "Bệnh & Góc Sức Khỏe"** (`categories.ts`, slug và URL `/an-uong/` giữ nguyên) và **thêm 4 nhóm con về bệnh thường gặp** vào đúng `groups` đã có (cạnh 9 nhóm "Thiếu gì, ăn gì"): `tieu-chay-cap`, `tay-chan-mieng`, `cum`, `sot-xuat-huyet`. Từ khi có nội dung bệnh thật, tên chuyên mục không còn là "chỉ đổi chữ trên menu" như bản nháp trước đó (đã bỏ hàm `navLabel()` từng dùng để tách riêng tên menu và tên thật) — mọi nơi (menu, tiêu đề trang, thẻ gắn ở bài, trang chủ, sitemap) giờ dùng thống nhất một tên. Không tạo chuyên mục mới riêng để tránh thanh menu có thêm mục (đã đủ 7 mục, xem mục "Bẫy kỹ thuật rem" ở trên).
- **4 bài "bệnh thường gặp"** (`tieu-chay-cap-dau-hieu-va-cach-xu-tri`, `tay-chan-mieng-o-tre-nho`, `cum-mua-dau-hieu-va-cham-soc`, `sot-xuat-huyet-dau-hieu-canh-bao`, tháng 9/2026): bố cục tóm tắt nhanh, dấu hiệu thường gặp (kèm hình), cách chăm sóc tại nhà, dấu hiệu trở nặng cần đi khám/gọi **115** (kèm hình, nền hồng nhạt `.warn` để nổi bật cảnh báo), phòng ngừa, nguồn. Nguồn: WHO, CDC, MedlinePlus (tiếng Anh, **chưa đối chiếu với hướng dẫn Bộ Y tế Việt Nam**). **Đây là nội dung y khoa nhạy cảm hơn các bài trước** (bệnh có thể trở nặng nhanh, nhất là sốt xuất huyết và tay chân miệng ở trẻ nhỏ) nên ưu tiên kiểm duyệt sớm — xem `docs/ghi-chu-kiem-duyet-benh-thuong-gap.md`, đặc biệt phần dấu hiệu trở nặng của tay chân miệng (giật mình, run tay chân) chưa đối chiếu trực tiếp với tài liệu Việt Nam.
- **"Bệnh thường gặp theo mùa"** (`seasonalTopics` trong `src/lib/seasonal.ts`, hiện ở trang chủ ngay dưới dải "Liên hệ nhanh"): tab theo TỪNG BỆNH (Tiêu chảy cấp, Tay chân miệng, Cúm, Sốt xuất huyết), mỗi tab có khung bên trái (icon, đoạn giới thiệu ngắn lấy ý từ bài viết, nút "Xem dấu hiệu & cách chăm sóc" dẫn tới bài đầy đủ) và khung bên phải là sản phẩm hỗ trợ liên quan — **theo đúng mẫu chủ website gửi (ảnh trang chủ Long Châu) và yêu cầu tháng 9/2026**, thay cho quyết định trước đó là tách hẳn 4 bài khỏi sản phẩm (xem lịch sử Git nếu cần đối chiếu). Để vẫn đúng nguyên tắc 4 và 6 (không hứa chữa khỏi, không quảng cáo thực phẩm chức năng như thuốc):
  - Mỗi bệnh chỉ trỏ tới một **NHÓM sản phẩm chung** đã có trong `departments.ts` (ví dụ tiêu chảy cấp → nhóm "Tiêu hóa", cúm/tay chân miệng → "Đề kháng & miễn dịch"), không phải "sản phẩm chữa bệnh X"; sản phẩm hiện ra là sản phẩm THẬT trong `src/content/products/`, không bịa. Sốt xuất huyết chưa có nhóm sản phẩm phù hợp (thuốc hạ sốt paracetamol không bán trên site; chưa có nhóm "phòng muỗi") nên **không khai báo `productSource`**, chỉ hiện nội dung bên trái.
  - Nhóm chưa có sản phẩm thật thì tự hiện dòng "Sản phẩm hỗ trợ liên quan đang được cập nhật" kèm nút nhắn Zalo hỏi dược sĩ — **không hiện sản phẩm giả**. Cuối mục luôn có dòng nhắc "chỉ mang tính hỗ trợ, không phải thuốc, không thay thế khám/điều trị của bác sĩ".
  - Thêm sản phẩm thật cho một bệnh: chỉ cần thêm bài sản phẩm vào đúng `department`/`group` đã khai báo trong `seasonal.ts`, không cần sửa code. Đổi nhóm sản phẩm gắn với một bệnh: sửa `productSource` trong `seasonal.ts`.
- **"Sản phẩm theo nhu cầu"** (`needTabs` trong `src/pages/index.astro`, ngay dưới mục "Bệnh thường gặp theo mùa"): tab riêng theo NHÓM sản phẩm có thật (ví dụ "Vitamin & khoáng chất"), không gắn theo tên bệnh — mục này **vẫn giữ** song song với "Bệnh thường gặp theo mùa" ở trên vì phục vụ mục đích khác (duyệt sản phẩm theo nhu cầu chung, không giới hạn 4 bệnh). Dữ liệu tự động gộp mọi nhóm (ở cả 4 khu bán hàng) đã có ít nhất 1 sản phẩm thật, mỗi thẻ có khung cuộn ngang riêng (`.carousel`, dùng chung style với các khối sản phẩm khác). Nhóm nào chưa có sản phẩm thì không hiện thẻ; **cả mục tự ẩn nếu chưa nhóm nào có sản phẩm**. Không cần sửa gì khi thêm sản phẩm mới, thẻ tự xuất hiện.
- **"Video ngắn"** (`src/lib/videos.ts` + `src/components/VideoSection.astro`): chủ website đã gửi 1 video thật (Facebook Reel), đang hiện ở trang chủ. **Ảnh đại diện (`thumbnail`) của video này là ảnh tự thiết kế (nền xanh lá, chữ "Video ngắn"), không phải ảnh cắt từ video thật** — Facebook không cho lấy ảnh đại diện video qua công cụ tự động (cần đăng nhập, link ảnh cũng hết hạn), nên không dùng ảnh thật của Facebook làm thumbnail. Muốn hiện đúng khung hình đầu video, chủ website gửi 1 ảnh chụp màn hình video đó (tỷ lệ dọc) để thay vào; tiêu đề hiện tại ("Dược sĩ Thương chia sẻ kiến thức sức khỏe") là tên tạm đặt, cần xác nhận lại đúng nội dung video. Thêm video mới: thêm 1 phần tử vào mảng `videos` (tiêu đề, `url` liên kết tới video thật, `thumbnail` là ảnh đại diện tỷ lệ dọc 9:16 đặt trong `src/assets/videos/` — CSS đã tự vẽ icon ▶ đè lên mọi ảnh nên **không cần vẽ icon Play vào ảnh**). Thẻ video bấm vào mở tab mới tới đúng nơi video được đăng (site không tự lưu trữ video, không có chỗ "tải video lên" trên website vì đây là site tĩnh không có máy chủ/CMS).

### Khu bán hàng (Thực phẩm chức năng, Dược mỹ phẩm, Chăm sóc cá nhân, Thiết bị y tế)

Chủ website yêu cầu (tháng 9/2026): 4 khu bán hàng riêng biệt, mỗi khu có **menu bên trái**, mô tả và ảnh từng sản phẩm, bấm vào xem chi tiết và **đặt hàng trực tiếp trên web**. Ban đầu chỉ có "Thực phẩm chức năng"; 3 khu còn lại (Dược mỹ phẩm, Chăm sóc cá nhân, Thiết bị y tế) thêm sau theo mẫu menu chủ website gửi (kiểu Long Châu), **không thêm khu "Thuốc"** vì bán thuốc online cần giấy phép riêng (xem mục "Cấu trúc nội dung" ở trên).

- **"Khu" (department) là khái niệm chung** cho cả 4, khai báo trong `src/lib/departments.ts`: mỗi khu có `name`, `description` và `groups` (nhóm sản phẩm riêng của khu đó, mỗi nhóm có `icon`, `name`, `description`). Thêm khu mới: thêm vào `departmentData`, các trang tự sinh thêm route mới, không cần sửa code khác. Slug khu hiện có: `thuc-pham-chuc-nang`, `duoc-my-pham`, `cham-soc-ca-nhan`, `thiet-bi-y-te`.
- **Trang dùng chung cho mọi khu** (route động `[department]`, KHÔNG lặp code cho từng khu):
  - `/[department]/` (`src/pages/[department]/index.astro`) — tất cả sản phẩm của khu.
  - `/[department]/nhom/[group]/` — một nhóm trong khu.
  - `/[department]/[slug]/` — trang chi tiết một sản phẩm (route này và `[category]/[slug].astro` của bài viết cùng tồn tại vì slug khu và slug chuyên mục bài viết không trùng nhau; Astro build ra URL cụ thể nên không xung đột).
- **Nhóm sản phẩm của từng khu (tháng 9/2026, tôi đặt tạm theo kiểu hiệu thuốc trực tuyến, chủ website có thể bớt hoặc đổi):**
  - Thực phẩm chức năng (11 nhóm): vitamin & khoáng chất, đề kháng & miễn dịch, mắt & thị lực, tiêu hóa, thần kinh & trí nhớ, hỗ trợ làm đẹp, đường huyết, tim mạch, xương khớp, phụ nữ & mẹ bầu, trẻ em.
  - Dược mỹ phẩm (5 nhóm): chăm sóc da mặt, chống nắng, trị mụn/thâm nám, dưỡng ẩm/phục hồi da, chăm sóc vùng mắt/môi.
  - Chăm sóc cá nhân (5 nhóm): vệ sinh răng miệng, chăm sóc tóc, sữa tắm/xà phòng, vệ sinh phụ nữ, khử mùi.
  - Thiết bị y tế (5 nhóm): máy đo huyết áp, máy đo đường huyết, nhiệt kế, khẩu trang/sát khuẩn, băng gạc/sơ cứu.
  - Thứ tự khai báo là thứ tự trong menu. Đặt tên nhóm theo hệ cơ quan hoặc đối tượng dùng, **không theo tên bệnh** (ví dụ "Đường huyết", không phải "Tiểu đường").
- **Giao diện kiểu cửa hàng (tham khảo kiểu hiệu thuốc trực tuyến, không sao chép thương hiệu hay nội dung của website nào):** đầu trang gồm hàng logo + **ô tìm kiếm lớn** (gửi tới `/tim-kiem/?q=từ-khóa`, viền khi bấm vào là quầng sáng nhẹ chứ không phải viền cứng) + nút **Giỏ hàng**, hàng menu có 4 mục khu bán hàng rồi các chuyên mục kiến thức và Giới thiệu. Cả 7 mục cùng một kiểu chữ đen, không có mục nào nổi bật hơn mục khác (chủ website yêu cầu tháng 9/2026, theo mẫu Long Châu gửi — trước đó "Thực phẩm chức năng" có nền pill xanh đậm mặc định, nay đã bỏ); rê chuột (hoặc bấm mũi tên) vào mục nào thì chữ mục đó đổi màu xanh và có gạch chân, đồng thời mở danh sách nhóm/menu lớn của mục đó — **áp dụng như nhau cho cả 7 mục**, xem `.site-nav a`, `.site-nav .has-sub:hover > .mega-menu`/`.submenu` trong `global.css`. Mục "Tìm kiếm" cũ trong menu đã bỏ vì có ô tìm kiếm.
  - **Bẫy từng gặp:** trước đó menu lớn (`.mega-menu`, dùng cho 4 khu bán hàng) chỉ mở khi rê chuột vào đúng khu đầu tiên, vì CSS `:hover` viết nhắm riêng lớp `.nav-shop` (lớp chỉ gắn cho khu đầu). 3 khu còn lại vẫn bấm mũi tên mở được (dùng lớp `.open` chung) nhưng rê chuột thì không, nên dễ bị coi nhầm là "3 khu kia không có danh mục". Đã sửa bằng cách đổi luật `:hover` sang áp dụng chung cho mọi `.has-sub` (khớp với cách chuyên mục kiến thức vốn đã làm đúng từ đầu). Khi thêm hộp thả xuống mới ở thanh menu, luôn kiểm tra **cả bấm mũi tên lẫn rê chuột** trên từng mục, không chỉ mục đầu tiên. Vì có 7 mục nên thanh menu tự xuống dòng ở hầu hết màn hình (khung nội dung rộng tối đa 68rem), đó là bình thường, không phải lỗi. Trang chủ (tháng 9/2026, bố cục có tham khảo trang chủ Long Châu chủ website gửi nhưng chỉ dùng những phần hợp với site tĩnh và nội dung có thật, xem "Những phần không làm theo mẫu" bên dưới): ảnh bìa, dải cam kết (chỉ nêu điều có thật: dược sĩ đại học tư vấn, nhắn Zalo, bài có nguồn), **dải "Liên hệ nhanh"** (6 ô nhỏ: Tư vấn dược sĩ, Thực phẩm chức năng, Ăn uống & dinh dưỡng, Thuốc, Giỏ hàng, Giới thiệu — chỉ trỏ tới trang có thật, không thêm ô "Tìm nhà thuốc"/"Đơn của tôi" vì chưa có), rồi với **mỗi khu đã có sản phẩm thật** hiện "Danh mục [tên khu]" (lưới icon nhóm) + sản phẩm nổi bật dạng **cuộn ngang** (`.carousel`, có nút mũi tên khi trên 4 sản phẩm; khu chưa có sản phẩm thì tự ẩn cả hai phần, không hiện mục trống), sau đó "Góc sức khỏe" (chuyên mục và bài mới). Không thêm cam kết như "chính hãng 100%", "giao nhanh" khi chưa có thông tin từ chủ website.
- **Những phần trong trang chủ mẫu Long Châu tôi cố ý không làm theo** (không có dữ liệu thật hoặc không phù hợp site tĩnh, tránh bịa nội dung): banner khuyến mãi xoay vòng/đếm giờ flash sale, carousel thương hiệu/brand, mục "Bệnh theo mùa" và "Bệnh theo đối tượng" (cần nhiều bài viết phân loại theo bệnh mà site chưa có), video ngắn, banner tải ứng dụng, "Tìm nhà thuốc" (không có hệ thống cửa hàng vật lý để tra), dải huy hiệu "Đổi trả 30 ngày/Cam kết 100%/Miễn phí vận chuyển" (chưa có chính sách thật). Nếu chủ website sau này có các nội dung/chính sách đó thật, có thể thêm.
- **Chân trang** (`src/components/Footer.astro`, tháng 9/2026) đổi từ 1 dòng sang **dạng sơ đồ nhiều cột** (kiểu chân trang Long Châu nhưng chỉ liệt kê trang có thật của site): cột "Dược Sĩ Thương" (chuyên môn, Zalo, Facebook), "Kiến thức" (2 chuyên mục bài viết), "Mua sắm" (4 khu bán hàng), "Liên kết" (Giới thiệu, Giỏ hàng, Tìm kiếm), rồi Tuyên bố miễn trừ trách nhiệm và dòng bản quyền. Không thêm mạng xã hội, hotline, hay huy hiệu chưa có thật (DMCA, Bộ Công Thương...).
- **Menu bên trái** (`src/components/ShopShell.astro`, nhận prop `department`): "Tất cả sản phẩm" và các nhóm của khu đó, kèm số sản phẩm mỗi nhóm. Trên màn hình từ 48rem trở lên là cột cố định bên trái; trên điện thoại gập lại thành nút "Danh mục sản phẩm". Chỉ có ở khu bán hàng, các trang bài viết không có.
- **Menu lớn ở thanh menu trên cùng:** mỗi khu có menu lớn riêng (rê chuột hoặc bấm mũi tên). Trên máy tính hiện bảng hai cột, **danh sách nhóm bên trái** và **khung bên phải** đổi theo nhóm đang rê chuột vào (tên nhóm, liên kết "Xem tất cả", tối đa 5 sản phẩm của nhóm; nhóm chưa có sản phẩm thì hiện mô tả và "đang cập nhật sản phẩm"). Trên điện thoại chỉ hiện danh sách nhóm. Khung sản phẩm ghi **"Sản phẩm trong nhóm"**, không ghi "Bán chạy nhất" vì chưa có số liệu bán hàng; không thêm nhãn giảm giá hay khuyến mãi khi chưa có thông tin thật. Chưa có nhóm con cấp 2 và chưa có nút Đăng nhập (chưa có tài khoản khách).
- **Từ khóa gợi ý dưới ô tìm kiếm** (`searchHints` trong `Header.astro`): chỉ dùng từ có bài viết trên website (canxi, sắt, kẽm, vitamin D, vitamin C, acid folic, kháng sinh) để kết quả không trống. Đổi danh sách này khi có thêm sản phẩm hoặc bài viết. **Chỉ hiện trên máy tính (từ 77rem trở lên)**; điện thoại và máy tính bảng ẩn hẳn dãy này (chủ website yêu cầu tháng 9/2026, cho đầu trang gọn hơn).
- **Trang chi tiết sản phẩm:** đường dẫn "Trang chủ / tên khu / nhóm / tên sản phẩm"; bảng thông tin (thương hiệu, xuất xứ, dạng bào chế, thành phần, số công bố, xác nhận quảng cáo, chỉ hiện dòng nào có dữ liệu); **chọn số lượng** rồi "Mua ngay" hoặc "Thêm vào giỏ"; phần mô tả có **mục lục bên trái** (tự lấy từ các tiêu đề `##` trong nội dung, nên dùng các mục Mô tả sản phẩm, Công dụng, Cách dùng, Lưu ý, Bảo quản) và nút **Kích thước chữ: Mặc định / Lớn hơn** (nhớ lựa chọn trên máy người đọc). Chưa có: chọn đơn vị tính, nhiều ảnh, khuyến mãi, đánh giá, "Tìm nhà thuốc", thanh mua hàng cố định khi cuộn, chính sách đổi trả và vận chuyển (chỉ thêm khi nhà thuốc có chính sách thật). **Không chép giá, khuyến mãi, đánh giá, huy hiệu "Chính hãng", ảnh hay đoạn mô tả nguyên văn từ website khác** (bản quyền và có thể sai với hồ sơ công bố của mình); viết lại từ nhãn và tài liệu nhà phân phối, câu về công dụng ghi rõ "theo nhà sản xuất". Bỏ các câu kiểu "đã được chứng minh", "giảm nguy cơ...", "hiệu quả", "lý tưởng", so sánh với sản phẩm khác. Xem ví dụ và ghi chú ở `docs/ghi-chu-kiem-duyet-san-pham.md`.
- **Thêm sản phẩm:** sao chép `src/content/products/san-pham-mau.md` (bản mẫu, `draft: true` nên chỉ thấy khi `npm run dev`), đổi tên file không dấu (là phần cuối URL), đặt ảnh vuông nền sáng khoảng 900x900 trong `src/assets/products/<tên>/`, điền frontmatter — **nhớ điền cả `department` (khu) lẫn `group` (nhóm trong khu đó)**, build sẽ báo lỗi nếu `group` không thuộc `department` đã chọn — viết nội dung (thành phần, đối tượng, cách dùng, lưu ý) rồi đổi `draft: false`. Giá bỏ trống thì hiện "Liên hệ".
- **`origin` (xuất xứ) bắt buộc với mọi sản phẩm** (chủ website yêu cầu tháng 9/2026, `content.config.ts` báo lỗi build nếu thiếu). Ghi đúng nước sản xuất/công bố trên nhãn — không tự đoán khi chưa chắc (nguyên tắc 1, 10). Hiện thành nhãn nhỏ có cờ quốc gia ở góc trên-trái ảnh thẻ sản phẩm (`ProductCard.astro`, chữ đen, không viền) và dòng "Xuất xứ" ở bảng thông tin trang chi tiết. Ảnh cờ SVG lấy từ thư viện mã nguồn mở flag-icons (MIT), tự lưu ở `public/flags/`, ánh xạ tên nước tiếng Việt → mã ISO ở `src/lib/flags.ts` (đã có sẵn ~17 nước hay gặp). Nước chưa có trong bảng ánh xạ vẫn hiện được (chỉ mất phần cờ, còn chữ) — thêm nước mới: xem hướng dẫn trong comment đầu file `flags.ts`.
- **Quy tắc nội dung sản phẩm** (áp dụng nguyên tắc 4, 6, 9 ở đầu file): chỉ ghi thông tin đúng như **nhãn và hồ sơ công bố** của sản phẩm, không tự bịa thành phần, công dụng, số liệu. Chỉ dùng cách nói "hỗ trợ", "bổ sung"; **không** viết "chữa", "điều trị", "khỏi bệnh", "thần dược", không so sánh với thuốc. Điền `publicationNo` (số tiếp nhận công bố sản phẩm) và `adConfirmationNo` (số giấy xác nhận nội dung quảng cáo) nếu có, trang sẽ hiển thị. Theo hiểu biết của tôi, quảng cáo thực phẩm chức năng/mỹ phẩm ở Việt Nam cần giấy xác nhận nội dung quảng cáo hoặc số công bố mỹ phẩm, và website bán hàng có thể phải thông báo/đăng ký với Bộ Công Thương; **chủ website cần tự xác nhận với cơ quan quản lý**, tôi không thể khẳng định.
- **Cảnh báo bắt buộc, khác nhau theo khu** (component `ProductNotice`, nhận prop `department`, xem nội dung từng khu trong `src/components/ProductNotice.astro`): Thực phẩm chức năng ghi "không phải là thuốc, không thay thế thuốc chữa bệnh"; Dược mỹ phẩm và Chăm sóc cá nhân ghi rõ là sản phẩm dùng ngoài da, nhắc thử trước và ngừng dùng nếu kích ứng; Thiết bị y tế ghi rõ "không thay thế chẩn đoán của bác sĩ", kết quả đo chỉ tham khảo. Cuối trang chi tiết ghi rõ sản phẩm do **Nhà Thuốc Nhật Minh** giới thiệu và bán. Không xóa hay dùng nhầm cảnh báo của khu khác.
- **Giỏ hàng và đặt hàng** (`src/lib/cart.ts`, `src/pages/gio-hang.astro`): nút "Thêm vào giỏ" ở thẻ sản phẩm và trang chi tiết, "Mua ngay" (thêm rồi sang giỏ). Giỏ **gộp chung sản phẩm từ cả 4 khu**, lưu ở **trình duyệt của khách** (localStorage, mỗi lần tối đa 20 cái/sản phẩm), biểu tượng giỏ ở đầu trang có số lượng. Trang `/gio-hang/` cho đổi số lượng, xóa, xem tạm tính (sản phẩm "Liên hệ" chưa tính giá), rồi điền họ tên, số điện thoại (10 chữ số hoặc +84), địa chỉ, ghi chú và ô đồng ý. Trang giỏ hàng không hiện `ProductNotice` (vì giỏ có thể lẫn sản phẩm nhiều khu, không chọn được cảnh báo nào là đúng); cảnh báo riêng từng sản phẩm đã hiện ở trang chi tiết trước khi thêm vào giỏ. **Chưa có tài khoản khách, chưa có thanh toán trực tuyến, chưa có trang quản lý đơn**; văn bản nói nhà thuốc sẽ xác nhận giá, phí giao hàng và cách thanh toán trước khi giao (chủ website cần xác nhận đúng với thực tế). Có hai chế độ gửi đơn, chọn qua `orderEndpoint` trong `src/lib/site.ts`:
  - **Để trống (hiện tại):** bấm gửi thì mở Zalo cá nhân, chép sẵn nội dung đơn (mọi sản phẩm) vào clipboard và hiện nội dung để khách dán vào chat; giỏ chỉ xóa khi khách bấm "Tôi đã gửi xong". Không lưu dữ liệu ở đâu ngoài Zalo.
  - **Điền địa chỉ dịch vụ nhận form** (ví dụ Formspree `https://formspree.io/f/xxxx`, chủ website tự đăng ký và nhận đơn qua email của họ): form gửi JSON (danh sách sản phẩm, tổng tiền, thông tin khách) đến đó, hiện thông báo đã gửi và xóa giỏ. Website là site tĩnh, không có máy chủ riêng nên không tự lưu đơn. **Không đưa email của chủ website vào mã nguồn hay dịch vụ nào khi chưa được đồng ý.**
- **Cửa hàng đầy đủ (chưa làm):** chủ website muốn có tài khoản khách, thanh toán trực tuyến, quản lý đơn. Việc này **cần máy chủ hoặc dịch vụ bên ngoài** (ví dụ Supabase cho tài khoản và đơn hàng, cổng thanh toán như PayOS/VNPay/MoMo cần hợp đồng và thủ tục với doanh nghiệp) và chủ website phải tự tạo tài khoản, cấp khóa. Không tự làm khi chưa có quyết định và thông tin đó. Giỏ hàng hiện tại được thiết kế để sau này chỉ cần thay bước gửi đơn.
- **Dữ liệu cá nhân:** tên, số điện thoại, địa chỉ khách là dữ liệu cá nhân (Nghị định 13/2023/NĐ-CP). Form có ô đồng ý và dặn không gửi CCCD, mật khẩu, thông tin thẻ. Khi dùng dịch vụ nhận form của bên thứ ba cần cân nhắc thêm trang chính sách bảo mật.
- **Tìm kiếm và SEO:** trang chi tiết có `data-pagefind-body` (tìm được bằng ô Tìm kiếm, kể cả không dấu) và dữ liệu schema.org `Product` (chưa khai báo giá và tình trạng còn hàng để tránh nêu sai). Sản phẩm `draft: true` có `noindex`.
- **Trạng thái tháng 9/2026:** chỉ khu Thực phẩm chức năng có 1 sản phẩm thật (Blackmores Omega Double, giá do chủ website đặt tạm 450.000 ₫, ảnh còn là ảnh giữ chỗ) và 1 sản phẩm mẫu (`draft: true`, chỉ thấy khi `npm run dev`). Ba khu còn lại (Dược mỹ phẩm, Chăm sóc cá nhân, Thiết bị y tế) **chưa có sản phẩm nào**, hiện "Sản phẩm đang được cập nhật"; menu và trang nhóm đã có sẵn, chỉ cần thêm bài sản phẩm khi chủ website gửi thông tin.

### Hình ảnh trong bài viết

Mỗi bài nên có **ảnh đại diện** (`cover`) và 1-3 hình minh họa trong nội dung để dễ hình dung.

- **Vị trí file:** `src/assets/posts/<tên-bài>/` (tên thư mục trùng tên file bài). Ảnh đại diện khai báo trong frontmatter (`cover`, `coverAlt`, `coverCredit`). Ảnh trong nội dung viết bằng Markdown, ngay sau đó là một dòng in nghiêng ghi nguồn:
  ```
  ![Mô tả ảnh chi tiết](../../assets/posts/ten-bai/hinh-1.jpg)
  *Đồ họa: Dược Sĩ Thương. Số liệu: WHO.*
  ```
- **Astro tự tối ưu ảnh** (đổi sang webp, tạo nhiều kích cỡ) nên chỉ cần đặt ảnh gốc chất lượng tốt, rộng khoảng 1600px, tỷ lệ 16:9 cho ảnh đại diện. Ảnh đại diện còn được dùng làm ảnh chia sẻ mạng xã hội (cắt 1200x630) và cho Google.
- **Mô tả ảnh (alt) bắt buộc** với ảnh đại diện (build sẽ báo lỗi nếu thiếu `coverAlt`) và nên có với mọi ảnh: mô tả nội dung/số liệu trong ảnh, không viết chung chung như "hình minh họa".
- **Bản quyền:** chỉ dùng (1) ảnh do chủ website tự chụp, (2) đồ họa tự thiết kế, (3) ảnh có giấy phép cho dùng miễn phí như Unsplash, Pexels, Pixabay hoặc Wikimedia Commons, **ghi rõ nguồn** ở `coverCredit` hoặc dòng in nghiêng. **Không lấy ảnh từ website khác, từ Google Hình ảnh hay từ Facebook** khi chưa được phép. Nếu chưa chắc giấy phép thì không dùng.
- **Nội dung ảnh:** không dùng ảnh bệnh nhân thật, ảnh gây sốc hoặc phản cảm (vết thương, bệnh ngoài da...), ảnh trước-sau như hứa hẹn điều trị, ảnh có logo/thương hiệu thuốc hay thực phẩm chức năng cụ thể (tránh thành quảng cáo). Không đưa hình có khuôn mặt người khác khi chưa được đồng ý.
- **Số liệu trong đồ họa** phải khớp đúng với nguồn trong bài; biểu đồ vẽ đúng tỷ lệ, không phóng đại. Ví dụ mẫu: bài "5 nguyên tắc ăn uống lành mạnh" có ảnh bìa kiểu nhãn nhóm và hai hình minh họa dạng danh sách ô lớn (`hinh-1.jpg`, `hinh-2.jpg`, số liệu WHO; làm lại 2026-09-22 theo khổ 1000px/chữ lớn thay cho bản 1600x900 cũ khó đọc trên điện thoại). Đồ họa được dựng bằng HTML/CSS rồi chụp thành ảnh (màu xanh lá `#15803d`, nền `#f0fdf4`, cam `#ea580c` để nhấn), có ghi nguồn và địa chỉ website ở chân ảnh; xem thêm mục "Ảnh đại diện của các bài về thuốc" và "Hình trong bài về thuốc" phía trên cho quy cách khổ 1000px/chữ ≥30px.

### Định hướng chung

- Website thiên về nội dung, cần **tải nhanh**, **SEO tốt** và **hiển thị tốt trên điện thoại** (mobile-first, vì phần lớn người đọc dùng điện thoại).
- Ưu tiên giải pháp đơn giản, dễ bảo trì (ví dụ: site tĩnh hoặc CMS nhẹ) thay vì kiến trúc phức tạp.
- Nội dung bài viết nên lưu dạng Markdown hoặc trong CMS để dễ chỉnh sửa mà không cần sửa code.

## Giao diện và trải nghiệm

- Phong cách: sạch sẽ, sáng, tạo cảm giác tin cậy và dễ chịu (tông màu xanh lá/xanh dương nhạt, nhiều khoảng trắng). Tránh màu quá chói hoặc bố cục rối.
- Cỡ chữ đủ lớn, độ tương phản cao vì nhiều người đọc là người lớn tuổi.
- Đạt các tiêu chuẩn cơ bản về khả năng truy cập (alt cho ảnh, thẻ heading đúng thứ bậc, điều hướng bằng bàn phím).
- Ảnh phải được nén, có `alt` mô tả bằng tiếng Việt. Không dùng ảnh gây sợ hãi hoặc phản cảm.
- Không dùng popup quảng cáo gây khó chịu.

## SEO

- Mỗi trang có `title`, `meta description`, URL thân thiện không dấu (ví dụ: `/an-uong/che-do-an-cho-nguoi-tieu-duong`).
- Dùng dữ liệu có cấu trúc (schema.org `Article`, `FAQPage`, và `MedicalWebPage` khi phù hợp).
- Có sitemap và robots.txt.
- Không nhồi nhét từ khóa, không giật tít sai sự thật.

## Quy ước làm việc với code

- Giữ code đơn giản, dễ đọc. Không thêm thư viện khi chưa thật sự cần.
- Không hard-code nội dung bài viết vào component. Tách nội dung ra khỏi giao diện.
- Không commit thông tin bí mật (API key, mật khẩu). Dùng biến môi trường.
- Trước khi kết thúc một tác vụ, kiểm tra lại trang hiển thị đúng trên cả điện thoại và máy tính.
- Khi tạo hoặc sửa nội dung y khoa, luôn tuân thủ mục "Nguyên tắc nội dung sức khỏe" ở trên.

## Cách Claude làm việc trong dự án này

- Trả lời bằng tiếng Việt, trừ khi được yêu cầu khác.
- Khi viết bài mẫu hoặc nội dung sức khỏe, đánh dấu rõ phần cần **dược sĩ/bác sĩ kiểm duyệt trước khi đăng**. Không coi nội dung do AI viết là đã được kiểm chứng.
- Nếu yêu cầu chưa rõ (ví dụ: chưa biết công nghệ, chưa biết bố cục), hỏi lại ngắn gọn trước khi làm.
- Đề xuất trước khi thay đổi lớn về cấu trúc dự án.
