import { discountPercent, getProducts, type Product } from './products';

/**
 * Chương trình "Quà tặng 20.11" (chủ website yêu cầu tháng 11/2026, theo mẫu banner Long Châu gửi).
 * Banner ở trang chủ (`CampaignBanner.astro`) + trang `/qua-tang-20-11/` liệt kê sản phẩm theo 4 nhóm quà.
 *
 * Chỉ dùng sản phẩm và giá THẬT đang bán: không đặt thêm giảm giá riêng cho chương trình, "Giảm đến X%"
 * tự tính từ giá khuyến mãi (originalPrice) sẵn có của các sản phẩm trong chương trình, "miễn phí giao
 * hàng" là chính sách thật từ 350.000đ (FREE_SHIPPING_THRESHOLD trong cart.ts). Không ghi "freeship tận
 * nhà" vô điều kiện như mẫu.
 *
 * Đổi sản phẩm: sửa mảng `slugs` (tên file trong src/content/products/, không có .md). Sản phẩm chưa
 * đăng (draft) hoặc đã xóa thì tự bỏ qua. 3 sản phẩm đầu của mỗi nhóm là ảnh hiện trên ô ở banner.
 */
export const CAMPAIGN = {
  slug: 'qua-tang-20-11',
  title: 'Quà tặng 20.11',
  headline: 'Chọn quà sức khỏe, tri ân thầy cô',
  // Hết ngày 20/11/2026 giờ Việt Nam thì banner ở trang chủ tự ẩn, trang chương trình báo đã kết thúc.
  endsAt: '2026-11-21T00:00:00+07:00',
};

export const campaignGroups = [
  {
    id: 'suc-khoe',
    name: 'Quà tặng sức khỏe',
    slugs: [
      'blackmores-omega-double-90-vien',
      'blackmores-coq10-150mg-30-vien',
      'blackmores-ginkgo-forte-40-vien',
      'blackmores-bio-c-1000mg-31-vien',
      'blackmores-multivitamin-for-men-50-vien',
      'blackmores-bio-magnesium-100-vien',
      'doppelherz-aktiv-coenzyme-q10',
      'doppelherz-aktiv-anti-stress',
      'visionace-original',
      'vinaga-dha-100-vien',
      'alive-probiotics-men-vi-sinh-30-goi',
      'magnesium-bisglycinate-webber-naturals-120-vien',
    ],
  },
  {
    id: 'sac-dep',
    name: 'Quà tặng sắc đẹp',
    slugs: [
      'elasten-collagen-28-2-ong-25ml',
      'anessa-perfect-uv-mild-milk-60ml',
      'blackmores-evening-primrose-oil-190-vien',
      'la-roche-posay-anthelios-xl-anti-shine-50ml',
      'transino-whitening-uv-protector-30ml',
      'transino-tone-up-cc-cream-30g',
      'anessa-perfect-uv-skincare-milk-na-60ml',
      'sunplay-tone-up-uv-essence-50g',
      'reihaku-hatomugi-tone-up-uv-70g',
      'vichy-xit-khoang-eau-thermale-150ml',
    ],
  },
  {
    id: 'xuong-khop',
    name: 'Quà tặng xương khớp',
    slugs: [
      'orihiro-glucosamine-900-vien',
      'joints-ultra-doppelherz-30-vien',
      'doppelherz-aktiv-magnesium-calcium-d3',
      'ecogreen-jex-natural-60-vien',
      'khuong-thao-dan-gold-120-vien',
      'bach-nien-kien-fobic-80-vien',
      'osteocare',
    ],
  },
  {
    id: 'cham-soc-ca-nhan',
    name: 'Quà tặng chăm sóc cá nhân',
    slugs: [
      'vichy-clinical-control-96h-50ml',
      'aderma-dermalibour-cica-creme-50ml',
      'lactacyd-odor-fresh-250ml',
      'aderma-exomega-allergo-200ml',
      'cetaphil-baby-wash-shampoo-calendula',
      'lactacyd-baby-gentle-care-500ml',
    ],
  },
] as const;

export type CampaignGroup = (typeof campaignGroups)[number] & { products: Product[] };

/** Các nhóm quà kèm sản phẩm thật (đúng thứ tự khai báo), bỏ nhóm không còn sản phẩm nào. */
export async function getCampaignGroups(): Promise<CampaignGroup[]> {
  const all = await getProducts();
  const bySlug = new Map(all.map((p) => [p.id, p]));
  return campaignGroups
    .map((group) => ({ ...group, products: group.slugs.flatMap((slug) => bySlug.get(slug) ?? []) }))
    .filter((group) => group.products.length > 0);
}

/** Mức giảm cao nhất (%) trong chương trình, tính từ giá khuyến mãi thật. Không có thì undefined. */
export function maxCampaignDiscount(groups: CampaignGroup[]): number | undefined {
  const values = groups.flatMap((g) => g.products.map((p) => discountPercent(p.data.price, p.data.originalPrice) ?? 0));
  const max = Math.max(0, ...values);
  return max > 0 ? max : undefined;
}

/** Chương trình còn diễn ra (tính lúc build; banner còn tự kiểm tra lại ở trình duyệt). */
export const campaignActive = (now = new Date()) => now < new Date(CAMPAIGN.endsAt);
