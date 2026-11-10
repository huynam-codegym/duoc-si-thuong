/**
 * Chương trình "Flash Sale giá tốt" (chủ website yêu cầu 04/11/2026, theo mẫu Long Châu gửi): mỗi khung
 * giờ có một danh sách sản phẩm với GIÁ FLASH riêng, chỉ áp dụng cho đơn đặt trong khung giờ đó.
 *
 * File này KHÔNG import `astro:content` để dùng được cả ở trình duyệt (giỏ hàng, đếm ngược) lẫn lúc build
 * (`/san-pham.json` đưa khung giờ cho Edge Function send-order-email tính lại tiền theo giờ máy chủ).
 *
 * Giá Flash tạm đặt = giá bán hiện tại giảm thêm 5%, làm tròn xuống nghìn đồng (chủ website giao cho tôi đặt
 * theo đề xuất). Đổi giá: sửa số trong `items`. Lúc build sẽ báo lỗi nếu giá Flash không thấp hơn giá bán
 * hoặc giảm quá 50% so với giá gốc (xem checkFlashPrice trong FlashSale.astro).
 */
export interface FlashSlot {
  id: string;
  /** Chủ đề hiện dưới tiêu đề tab */
  theme: string;
  /** Giờ Việt Nam, dạng ISO có múi giờ */
  start: string;
  end: string;
  /** slug sản phẩm -> giá Flash (đồng) */
  items: Record<string, number>;
}

export const FLASH_SALE = { slug: 'flash-sale', title: 'Flash Sale giá tốt' };

export const flashSlots: FlashSlot[] = [
  // Đợt 1 (05/11 và 06/11/2026) đã kết thúc, xem lịch sử git nếu cần đối chiếu
  {
    id: 'ngay-11-11',
    theme: 'Xương khớp, tim mạch & trí não',
    start: '2026-11-11T08:00:00+07:00',
    end: '2026-11-11T22:00:00+07:00',
    items: {
      'orihiro-glucosamine-900-vien': 665_000,
      'joints-ultra-doppelherz-30-vien': 465_000,
      'magnesium-bisglycinate-webber-naturals-120-vien': 532_000,
      'ecogreen-jex-natural-60-vien': 655_000,
      'blackmores-bio-magnesium-100-vien': 627_000,
      'blackmores-coq10-150mg-30-vien': 508_000,
      'blackmores-ginkgo-forte-40-vien': 422_000,
      'blackmores-omega-double-90-vien': 617_000,
    },
  },
  {
    id: 'ngay-12-11',
    theme: 'Mẹ bé & làm đẹp',
    start: '2026-11-12T08:00:00+07:00',
    end: '2026-11-12T22:00:00+07:00',
    items: {
      'pregnacare-max': 470_000,
      'blackmores-pregnancy-breast-feeding-gold-60-vien': 579_000,
      'kids-smart-liquid-multi-iron-200ml': 437_000,
      'fitobimbi-immuno': 365_000,
      'cetaphil-baby-wash-shampoo-calendula': 228_000,
      'elasten-collagen-28-2-ong-25ml': 2_099_000,
      'anessa-perfect-uv-mild-milk-60ml': 422_000,
      'la-roche-posay-anthelios-xl-anti-shine-50ml': 456_000,
    },
  },
];

const ms = (iso: string) => Date.parse(iso);

/** Khung giờ đang diễn ra lúc `now` (nếu có). */
export function activeFlashSlot(now = Date.now()): FlashSlot | undefined {
  return flashSlots.find((slot) => now >= ms(slot.start) && now < ms(slot.end));
}

/** Giá Flash của sản phẩm nếu đang trong khung giờ của nó. */
export function flashPriceFor(id: string, now = Date.now()): { price: number; slot: FlashSlot } | undefined {
  const slot = activeFlashSlot(now);
  const price = slot?.items[id];
  return slot && price ? { price, slot } : undefined;
}

/** Chương trình còn khung giờ nào chưa kết thúc không. */
export const flashSaleActive = (now = Date.now()) => flashSlots.some((slot) => now < ms(slot.end));

/** Mốc bắt đầu/kết thúc gần nhất sau `now` — để trang đang mở tự cập nhật giá đúng lúc. */
export function nextFlashBoundary(now = Date.now()): number | undefined {
  const times = flashSlots.flatMap((slot) => [ms(slot.start), ms(slot.end)]).filter((t) => t > now);
  return times.length ? Math.min(...times) : undefined;
}

/**
 * Gắn khối giá dựng bằng JS (kết quả tìm kiếm, gợi ý đầu trang) vào FlashPriceSync: slug lấy từ đường dẫn
 * sản phẩm, giá gốc lấy từ chữ "363.000 đ" của Pagefind. Gọi xong thì bắn sự kiện `flash:sync`.
 */
export function markFlashSync(box: HTMLElement, productUrl: string, priceText?: string, originalText?: string) {
  const digits = (text?: string) => text?.replace(/\D/g, '') ?? '';
  const slug = productUrl.split('/').filter(Boolean).pop();
  if (!slug || !digits(priceText)) return;
  box.dataset.flashSync = slug;
  box.dataset.price = digits(priceText);
  box.dataset.originalPrice = digits(originalText);
}

/** "22:00" theo giờ Việt Nam */
export function flashTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' });
}

/** "05/11" theo giờ Việt Nam */
export function flashDate(iso: string): string {
  // Tự ghép "ngày/tháng": toLocaleDateString('vi-VN') ở Node ra "05-11", ở trình duyệt có khi ra "05/11"
  const parts = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: 'Asia/Ho_Chi_Minh' }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${get('day')}/${get('month')}`;
}
