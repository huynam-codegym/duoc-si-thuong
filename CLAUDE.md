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

Các chuyên mục chính:

| Chuyên mục | Nội dung |
| --- | --- |
| Ăn uống & dinh dưỡng | Chế độ ăn, thực phẩm, thực đơn theo bệnh lý và độ tuổi |
| Nhận biết bệnh | Triệu chứng, dấu hiệu cảnh báo, khi nào cần đi khám |
| Phòng chống bệnh | Lối sống, tiêm chủng, sàng lọc, vệ sinh, chăm sóc tại nhà |
| Kiến thức về thuốc | Cách dùng thuốc an toàn, tương tác thuốc, bảo quản thuốc |
| Hỏi đáp | Giải đáp thắc mắc thường gặp |

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

Pagefind chưa hỗ trợ tiếng Việt đầy đủ: nó tự bỏ dấu thanh/dấu mũ (gõ "khang sinh" ra "kháng sinh") nhưng không coi "đ" là "d". Vì vậy trang bài viết có thêm một đoạn ẩn chứa bản không dấu của tiêu đề và mô tả (`foldVietnamese` trong `src/lib/posts.ts`). Nhờ đó gõ "dot quy" ra "đột quỵ". Từ chỉ nằm trong phần nội dung chứa chữ "đ" thì vẫn phải gõ đúng dấu.

### Cấu trúc thư mục

```
src/
  content/
    posts/            # bài viết Markdown (phẳng, chuyên mục khai báo trong frontmatter)
  content.config.ts   # schema kiểm tra frontmatter của bài viết
  lib/
    categories.ts     # danh sách chuyên mục (slug, tên, mô tả) - nguồn duy nhất
    posts.ts          # getPosts(), isPublishable(), formatDate()
    url.ts            # url(): thêm đường dẫn gốc (base) vào liên kết nội bộ
    site.ts           # thông tin thương hiệu dùng chung (tên, số điện thoại): đổi ở đây là đổi toàn site
  components/         # Header, Footer, Disclaimer, PostCard, CallButton (nút gọi điện)
  layouts/            # BaseLayout (meta, canonical, JSON-LD)
  pages/
    index.astro               # trang chủ
    [category]/index.astro    # trang chuyên mục
    [category]/[slug].astro   # trang bài viết, URL dạng /an-uong/ten-bai/
    gioi-thieu.astro          # trang giới thiệu dược sĩ Thương, có nút gọi và lưu ý cấp cứu 115
    tim-kiem.astro            # trang tìm kiếm (Pagefind UI, hỗ trợ ?q=từ-khóa)
    404.astro                 # trang báo lỗi không tìm thấy
    robots.txt.ts             # robots.txt, tự lấy tên miền từ `site`
  styles/global.css   # CSS toàn site
src/assets/
  cover.jpg           # ảnh bìa thương hiệu (2048x762), hiện ở đầu trang chủ
  logo.jpg            # logo tạm: khuôn mặt dược sĩ Thương cắt từ ảnh bìa, hiện ở header
public/               # favicon.png, apple-touch-icon.png, og-image.jpg, _headers (chỉ Cloudflare/Netlify dùng)
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
- **Logo** `src/assets/logo.jpg`: **logo tạm**, là khuôn mặt của dược sĩ cắt từ ảnh bìa (300x300). Khi có logo chính thức thì thay file này (giữ tên `logo.jpg`, hoặc sửa import trong `src/components/Header.astro`).
- **Favicon và ảnh chia sẻ mạng xã hội** trong `public/`: `favicon.png` (64px), `apple-touch-icon.png` (180px) cắt từ khuôn mặt; `og-image.jpg` (1200x630) là ảnh bìa đặt giữa nền trắng. Các file này được tạo bằng script từ ảnh bìa, nên khi đổi ảnh bìa hoặc logo phải tạo lại cho khớp.
- Màu chủ đạo: xanh lá (`--green-900`, `--green-700` trong `src/styles/global.css`), khớp với ảnh bìa.
- **Số điện thoại 0988 283 415** lưu ở `src/lib/site.ts` (một nơi duy nhất). Hiển thị qua component `CallButton` (bấm để gọi, dạng `tel:+84988283415`) ở trang chủ, trang Giới thiệu và chân trang. Đổi số thì chỉ sửa `site.ts` và ảnh bìa (số cũng nằm trong ảnh, phải sửa alt ở `src/pages/index.astro`).
- **Chuyên môn và chức vụ** do chủ website cung cấp (tháng 9/2026), lưu ở `src/lib/site.ts`: **Dược sĩ đại học**, **CEO Nhà Thuốc Nhật Minh**, trang Facebook của nhà thuốc https://www.facebook.com/nhathuocnhatminhhanoi. Hiển thị ở trang Giới thiệu (thẻ chuyên môn, nút Facebook), chân trang và dữ liệu schema.org (`Person`).
- **Trang Giới thiệu** chỉ dùng thông tin chủ website đã công bố (ảnh bìa và các thông tin trên). **Không tự thêm bằng cấp cụ thể, số chứng chỉ hành nghề, địa chỉ nhà thuốc, tên trường** khi chưa có thông tin do chủ website cung cấp. Không tự nói nhà thuốc ở tỉnh/thành nào.
- **Minh bạch với nhà thuốc:** chủ website điều hành một nhà thuốc, nên bài viết là nội dung chia sẻ kiến thức, **không quảng cáo và không gắn liên kết bán sản phẩm** của nhà thuốc. Nếu một bài có nhắc đến sản phẩm hoặc nhà thuốc thì phải nói rõ mối liên hệ đó (xem thêm nguyên tắc 6 và 9 ở mục "Nguyên tắc nội dung sức khỏe").
- Ảnh bìa chứa số điện thoại và ảnh cá nhân, đó là thông tin chủ website đã chủ động công khai. Không thêm thông tin liên hệ hay ảnh cá nhân khác (email, địa chỉ, mạng xã hội...) khi chưa được chủ website đồng ý.

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
category: "an-uong"        # an-uong | nhan-biet-benh | phong-chong-benh | kien-thuc-ve-thuoc | hoi-dap
publishedAt: 2026-01-01
updatedAt: 2026-01-01
sources:                   # bắt buộc, ít nhất 1 nguồn uy tín
  - title: "Tên nguồn"
    url: "https://..."
reviewedBy: ""             # người kiểm duyệt (dược sĩ/bác sĩ), để trống nếu chưa kiểm duyệt
draft: true                # đổi thành false sau khi được kiểm duyệt
---
```

Bài có `draft: true` hoặc `reviewedBy` để trống thì **không được đăng** lên bản chính thức.

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
