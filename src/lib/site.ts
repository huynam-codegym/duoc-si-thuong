/** Thông tin thương hiệu dùng chung. Đổi ở đây là đổi toàn website. */
export const site = {
  name: 'Dược Sĩ Thương',
  // Số hiển thị cho người đọc
  phone: '0988 283 415',
  // Liên kết bấm để gọi trên điện thoại (định dạng quốc tế, bỏ số 0 đầu)
  phoneHref: 'tel:+84988283415',
  phoneIntl: '+84988283415',
  // Chuyên môn và chức vụ do chủ website cung cấp
  degree: 'Dược sĩ đại học',
  role: 'CEO',
  pharmacy: {
    name: 'Nhà Thuốc Nhật Minh',
    facebook: 'https://www.facebook.com/nhathuocnhatminhhanoi',
  },
} as const;
