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
  {
    id: 'ngay-05-11',
    theme: 'Sức khỏe & mẹ bé',
    start: '2026-11-05T08:00:00+07:00',
    end: '2026-11-05T22:00:00+07:00',
    items: {
      'elasten-collagen-28-2-ong-25ml': 2_099_000,
      'blackmores-coq10-150mg-30-vien': 508_000,
      'blackmores-bio-magnesium-100-vien': 627_000,
      'orihiro-glucosamine-900-vien': 665_000,
      'pregnacare-max': 470_000,
      'blackmores-pregnancy-breast-feeding-gold-60-vien': 579_000,
      'kids-smart-liquid-multi-iron-200ml': 437_000,
      'optibac-for-women-30-vien': 446_000,
    },
  },
  {
    id: 'ngay-06-11',
    theme: 'Làm đẹp & chăm sóc da',
    start: '2026-11-06T08:00:00+07:00',
    end: '2026-11-06T22:00:00+07:00',
    items: {
      'anessa-perfect-uv-mild-milk-60ml': 422_000,
      'la-roche-posay-anthelios-xl-anti-shine-50ml': 456_000,
      'transino-tone-up-cc-cream-30g': 570_000,
      'reihaku-hatomugi-tone-up-uv-70g': 128_000,
      'omi-sunbears-protect-milk-30g': 68_000,
      'cetaphil-baby-wash-shampoo-calendula': 228_000,
      'aderma-dermalibour-cica-creme-50ml': 308_000,
      'vichy-clinical-control-96h-50ml': 308_000,
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
