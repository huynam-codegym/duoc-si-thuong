import { getCollection } from 'astro:content';
import type { IconName } from './icon-names';
import { getProducts, type Product } from './products';

/**
 * "Mua theo đối tượng" (chủ website yêu cầu 10/11/2026): gom sản phẩm ĐANG BÁN theo người dùng, hiện ở trang
 * chủ (dưới "Danh mục nổi bật") và trang `/doi-tuong/<slug>/`. Mỗi sản phẩm vẫn chỉ thuộc 1 nhóm như cũ, đây
 * chỉ là cách xem thêm.
 *
 * CHỈ xếp sản phẩm vào 1 đối tượng khi mục "Đối tượng sử dụng" của bài sản phẩm (lấy từ nhãn) ghi rõ đối tượng
 * đó. Sản phẩm nhãn ghi "cần hỏi ý kiến bác sĩ" với nhóm này (ví dụ Alive Probiotics với mẹ bầu) thì KHÔNG
 * xếp vào. Chưa có mục "Người cao tuổi" vì chỉ 1 sản phẩm có nhãn ghi rõ.
 *
 * Đổi sản phẩm: sửa mảng `slugs` (tên file trong src/content/products/, không có .md). Sản phẩm chưa đăng
 * (draft) tự bỏ qua; slug gõ sai thì build báo lỗi.
 */
export interface Audience {
  slug: string;
  name: string;
  /** Câu ngắn dưới tên ở ô trang chủ và đầu trang */
  description: string;
  icon: IconName;
  /** Lưu ý riêng cho đối tượng này, hiện cuối trang (nguyên tắc 7 trong CLAUDE.md) */
  note: string;
  slugs: string[];
}

export const audiences: Audience[] = [
  {
    slug: 'tre-em',
    name: 'Trẻ em',
    description: 'Sản phẩm có nhãn ghi dùng cho trẻ sơ sinh, trẻ nhỏ và trẻ đang lớn',
    icon: 'baby',
    note:
      'Mỗi sản phẩm có độ tuổi dùng riêng, hãy xem kỹ mục "Đối tượng sử dụng" và "Cách dùng" trên trang sản phẩm. ' +
      'Trẻ dưới 1 tuổi, trẻ đang dùng thuốc hoặc có bệnh nền nên hỏi bác sĩ hoặc dược sĩ trước khi dùng. ' +
      'Trẻ biếng ăn, chậm lớn, hay ốm kéo dài cần được bác sĩ thăm khám, thực phẩm bổ sung không thay thế việc khám.',
    slugs: [
      'fitobimbi-immuno',
      'fitobimbi-appetito',
      'fitobimbi-d3k2',
      'fitobimbi-omega-junior',
      'fitobimbi-sonno',
      'kids-smart-liquid-multi-iron-200ml',
      'wellbaby-multi-vitamin-liquid',
      'doppelherz-kinder-omega-3-syrup',
      'doppelherz-kinder-optima-mini-tabs',
      'doppelherz-aktiv-kinder-visio-60v',
      'bioamicus-complete-10ml',
      'bioamicus-omega-3-30ml',
      'calcium-bioamicus-vitamin-k2-d3-10ml',
      'com-vi-sinh-lacto-biomin-gold-hop-20-goi',
      'syrup-kan-120ml',
      'siro-gadopax-forte-valens-100ml',
      'smartbibi-zinc',
      'biolizin-syrup',
      'siro-osteocare',
      'siro-feroglobin-b12',
      'vipteen-vinh-gia-20-vien',
      'cetaphil-baby-wash-shampoo-calendula',
      'cetaphil-baby-gentle-wash-shampoo',
      'lactacyd-baby-gentle-care-250ml',
      'lactacyd-baby-gentle-care-500ml',
      'lactacyd-baby-extra-milky-250ml',
      'aderma-exomega-allergo-200ml',
      'aderma-dermalibour-cica-creme-50ml',
      'yoosun-rau-ma-kem-boi-da-25g',
      'anessa-perfect-uv-mild-milk-60ml',
    ],
  },
  {
    slug: 'me-bau',
    name: 'Mẹ bầu & cho con bú',
    description: 'Sản phẩm có nhãn ghi dùng được khi mang thai hoặc cho con bú',
    icon: 'flower',
    note:
      'Khi mang thai hoặc cho con bú, hãy hỏi bác sĩ hoặc dược sĩ trước khi dùng bất kỳ sản phẩm bổ sung nào, ' +
      'nhất là khi đang uống viên sắt, canxi hoặc vitamin bác sĩ kê để tránh dùng trùng. ' +
      'Ra máu, đau bụng, phù, nhức đầu nhiều, nhìn mờ hoặc thai máy ít khi mang thai: đi khám ngay hoặc gọi 115.',
    slugs: [
      'pregnacare-max',
      'pregnacare-plus-omega-3',
      'pregnacare-breast-feeding',
      'blackmores-pregnancy-breast-feeding-gold-60-vien',
      'doppelherz-aktiv-vital-pregna',
      'feroglobin-b12',
      'siro-feroglobin-b12',
      'siro-osteocare',
      'transino-whitening-uv-protector-30ml',
      'transino-tone-up-cc-cream-30g',
    ],
  },
  {
    slug: 'phu-nu',
    name: 'Phụ nữ',
    description: 'Sản phẩm có nhãn ghi dành riêng cho phụ nữ',
    icon: 'heart',
    note:
      'Ngứa, ra khí hư bất thường, ra máu ngoài kỳ kinh hoặc đau bụng dưới kéo dài cần đi khám phụ khoa, ' +
      'không chỉ tự dùng sản phẩm vệ sinh hay bổ sung. Đang dùng thuốc nội tiết hoặc có bệnh nền thì hỏi bác sĩ trước.',
    slugs: ['doppelherz-aktiv-meno', 'optibac-for-women-30-vien', 'lactacyd-odor-fresh-250ml', 'siro-feroglobin-b12'],
  },
];

export type AudienceWithProducts = Audience & { products: Product[] };

/** Đối tượng kèm sản phẩm đang bán (đúng thứ tự khai báo), bỏ đối tượng không còn sản phẩm nào. */
export async function getAudiences(): Promise<AudienceWithProducts[]> {
  const all = await getProducts();
  const bySlug = new Map(all.map((p) => [p.id, p]));
  const allIds = new Set((await getCollection('products')).map((p) => p.id));
  for (const audience of audiences) {
    const unknown = audience.slugs.filter((slug) => !allIds.has(slug));
    if (unknown.length) throw new Error(`audiences.ts (${audience.slug}): không có sản phẩm ${unknown.join(', ')}`);
  }
  return audiences
    .map((audience) => ({ ...audience, products: audience.slugs.flatMap((slug) => bySlug.get(slug) ?? []) }))
    .filter((audience) => audience.products.length > 0);
}
