/**
 * Dữ liệu "hỏi đáp dựng sẵn" cho khung chat nổi (tháng 10/2026, chủ website yêu cầu, tạm thay cho chat
 * AI thật vì chưa muốn tốn phí gọi API) — KHÔNG phải AI thật, chỉ so khớp từ khóa với danh sách câu hỏi
 * có sẵn bên dưới, chạy hoàn toàn trên trình duyệt, không tốn phí, không gửi gì lên máy chủ nào.
 *
 * Thêm câu hỏi mới: thêm 1 phần tử vào mảng FAQ_ITEMS bên dưới. `keywords` là các từ KHÔNG DẤU, chữ
 * thường, dùng để so khớp (câu hỏi của khách cũng được bỏ dấu trước khi so) — thêm nhiều biến thể cách
 * hỏi khác nhau để khớp tốt hơn. Chỉ viết nội dung ĐÚNG SỰ THẬT đã có trong site (giá, chính sách...),
 * không tự bịa (nguyên tắc 1 trong CLAUDE.md) — câu nào chưa có thông tin thật thì trả lời thẳng là
 * chưa có, hướng khách nhắn Zalo hỏi trực tiếp thay vì đoán.
 */
import { foldVietnamese } from './text';

export interface FaqItem {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'la-thuoc-khong',
    question: 'Sản phẩm có phải là thuốc không?',
    keywords: ['thuoc', 'tpbvsk', 'thuc pham chuc nang', 'co phai thuoc'],
    answer:
      'Các sản phẩm ở khu Thực phẩm chức năng đều là thực phẩm bảo vệ sức khỏe, KHÔNG phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh. Nếu bạn đang dùng thuốc điều trị, nên hỏi ý kiến bác sĩ hoặc dược sĩ trước khi dùng thêm sản phẩm khác.',
  },
  {
    id: 'cach-dat-hang',
    question: 'Làm sao để đặt hàng?',
    keywords: ['dat hang', 'mua hang', 'cach mua', 'cach dat'],
    answer:
      'Bạn chọn sản phẩm, bấm "Thêm vào giỏ" hoặc "Mua ngay", sau đó vào Giỏ hàng điền thông tin người nhận và chọn hình thức thanh toán rồi bấm "Hoàn tất". Nhà thuốc sẽ gọi điện xác nhận lại đơn trước khi giao.',
  },
  {
    id: 'phi-van-chuyen',
    question: 'Phí vận chuyển bao nhiêu?',
    keywords: ['phi ship', 'phi van chuyen', 'ship', 'giao hang mat phi'],
    answer: 'Đơn hàng từ 350.000đ được miễn phí vận chuyển. Dưới mức này, phí vận chuyển là 20.000đ.',
  },
  {
    id: 'hinh-thuc-thanh-toan',
    question: 'Có những hình thức thanh toán nào?',
    keywords: ['thanh toan', 'momo', 'zalopay', 'chuyen khoan', 'the visa', 'qr'],
    answer:
      'Bạn có thể chọn: tiền mặt khi nhận hàng, chuyển khoản (quét mã QR), ví MoMo, ví ZaloPay hoặc thẻ Visa/Mastercard. Với hình thức khác tiền mặt, nhà thuốc sẽ liên hệ hướng dẫn thanh toán cụ thể trước khi giao — website chưa thu tiền trực tiếp qua thẻ/ví.',
  },
  {
    id: 'xac-nhan-don',
    question: 'Sau khi đặt hàng, khi nào được xác nhận?',
    keywords: ['xac nhan don', 'bao lau', 'khi nao giao', 'khi nao nhan duoc'],
    answer:
      'Sau khi bấm "Hoàn tất", hệ thống gửi ngay email xác nhận đã ghi nhận đơn (nếu bạn có để lại email). Nhà thuốc sẽ gọi điện xác nhận lại giá, phí giao hàng và cách thanh toán trước khi giao — đây chưa phải hóa đơn thanh toán.',
  },
  {
    id: 'doi-tra',
    question: 'Có đổi trả được không?',
    keywords: ['doi tra', 'tra hang', 'hoan tien', 'doi hang'],
    answer: 'Hiện site chưa công bố chính sách đổi trả cụ thể. Bạn vui lòng nhắn Zalo cho dược sĩ để được tư vấn trực tiếp cho từng trường hợp.',
  },
  {
    id: 'duoc-si-la-ai',
    question: 'Dược sĩ Thương là ai?',
    keywords: ['duoc si thuong la ai', 'gioi thieu', 'ceo'],
    answer: 'Dược sĩ Thương là Dược sĩ đại học, hiện là CEO Nhà Thuốc Nhật Minh. Bạn có thể xem thêm ở trang Giới thiệu.',
  },
  {
    id: 'lien-he',
    question: 'Làm sao liên hệ dược sĩ?',
    keywords: ['lien he', 'so dien thoai', 'hotline', 'zalo'],
    answer: 'Bạn nhắn Zalo số 0988 283 415 (bấm biểu tượng Zalo ở góc màn hình) để được dược sĩ tư vấn trực tiếp.',
  },
  {
    id: 'trieu-chung-benh',
    question: 'Tôi bị đau bụng/sốt/ho, phải làm sao?',
    keywords: ['dau bung', 'sot', 'ho', 'dau dau', 'met moi', 'bi benh', 'trieu chung', 'om'],
    answer:
      'Mình không thể chẩn đoán bệnh qua tin nhắn. Nếu triệu chứng nhẹ, bạn có thể xem thêm bài viết ở chuyên mục "Bệnh & Góc Sức Khỏe". Nếu triệu chứng nặng, kéo dài hoặc có dấu hiệu nguy hiểm, hãy đến cơ sở y tế gần nhất hoặc gọi 115 ngay.',
  },
  {
    id: 'ban-thuoc-ke-don',
    question: 'Website có bán thuốc kê đơn không?',
    keywords: ['ban thuoc', 'thuoc ke don', 'mua thuoc'],
    answer:
      'Không. Website chỉ chia sẻ kiến thức về thuốc, không bán thuốc trực tuyến (việc này cần giấy phép kinh doanh dược qua thương mại điện tử). Khu bán hàng hiện chỉ có thực phẩm chức năng, dược mỹ phẩm, chăm sóc cá nhân và thiết bị y tế.',
  },
  {
    id: 'dia-chi-cua-hang',
    question: 'Có cửa hàng để đến mua trực tiếp không?',
    keywords: ['dia chi', 'cua hang', 'den mua truc tiep', 'o dau'],
    answer: 'Mình chưa có thông tin địa chỉ cửa hàng để chia sẻ ở đây. Bạn nhắn Zalo cho dược sĩ để hỏi trực tiếp nhé.',
  },
  {
    id: 'co-thai',
    question: 'Phụ nữ có thai dùng được không?',
    keywords: ['co thai', 'mang thai', 'cho con bu', 'bau'],
    answer:
      'Mỗi sản phẩm có lưu ý riêng cho phụ nữ có thai/cho con bú ở trang chi tiết sản phẩm (mục "Lưu ý"). Bạn nên hỏi ý kiến bác sĩ hoặc dược sĩ trước khi dùng bất kỳ sản phẩm nào trong giai đoạn này.',
  },
];

/** So khớp câu khách gõ với danh sách FAQ_ITEMS — bỏ dấu + chữ thường rồi đếm số từ khóa khớp được,
 * trả về mục có điểm cao nhất (điểm > 0). Không có AI thật nên chỉ là so khớp từ khóa đơn giản. */
export function matchFaq(query: string): FaqItem | null {
  const folded = foldVietnamese(query.toLowerCase());
  let best: FaqItem | null = null;
  let bestScore = 0;
  for (const item of FAQ_ITEMS) {
    let score = 0;
    for (const keyword of item.keywords) {
      if (folded.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  return bestScore > 0 ? best : null;
}
