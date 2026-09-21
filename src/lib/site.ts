/** Thông tin thương hiệu dùng chung. Đổi ở đây là đổi toàn website. */
export const site = {
  name: 'Dược Sĩ Thương',
  // Số hiển thị cho người đọc
  phone: '0988 283 415',
  // Liên kết mở Zalo chat với số này (dùng cho nút "Gọi ngay qua Zalo")
  zaloHref: 'https://zalo.me/0988283415',
  // Liên kết bấm để gọi thường trên điện thoại (hiện chưa dùng ở nút nào)
  phoneHref: 'tel:+84988283415',
  phoneIntl: '+84988283415',
  // Chat trực tiếp ở trang Hỏi đáp (dịch vụ Tawk.to). Để trống = chưa bật, trang chỉ hiện nút Zalo.
  // Lấy từ mã nhúng của Tawk.to: https://embed.tawk.to/<tawkPropertyId>/<tawkWidgetId>
  chat: {
    tawkPropertyId: '',
    tawkWidgetId: '',
  },
  // Chuyên môn và chức vụ do chủ website cung cấp
  degree: 'Dược sĩ đại học',
  role: 'CEO',
  pharmacy: {
    name: 'Nhà Thuốc Nhật Minh',
    facebook: 'https://www.facebook.com/nhathuocnhatminhhanoi',
  },
} as const;
