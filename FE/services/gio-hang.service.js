'use client';

import { apiFetch } from './api-client';

/**
 * Giỏ hàng theo tài khoản (chỉ dùng khi đã đăng nhập). Server chỉ lưu mã sản phẩm + tùy chọn + số lượng;
 * giá và tồn kho luôn lấy mới nhất từ server mỗi lần đọc.
 */
export const GioHangService = {
    /** Lấy giỏ đã lưu: { danh_sach_muc: [{ san_pham_id, ma_tuy_chon, so_luong, san_pham }], da_go: [tên món bị gỡ] } */
    async layGioHangAsync() {
        const ketQua = await apiFetch('/gio-hang', { cache: 'no-store' });
        return {
            danh_sach_muc: Array.isArray(ketQua?.danh_sach_muc) ? ketQua.danh_sach_muc : [],
            da_go: Array.isArray(ketQua?.da_go) ? ketQua.da_go : []
        };
    },

    /** Ghi đè giỏ trên server. Chỉ gửi mã sản phẩm, tùy chọn, số lượng (không gửi giá). */
    async luuGioHangAsync(danhSachMuc) {
        return apiFetch('/gio-hang', {
            method: 'PUT',
            body: JSON.stringify({ danh_sach_muc: danhSachMuc })
        });
    }
};

export default GioHangService;
