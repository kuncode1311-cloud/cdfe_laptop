import { apiFetch } from './api-client';

let boNhoDemVoucher = [];

if (typeof window !== 'undefined') {
    apiFetch('/ma-giam-gia', { cache: 'no-store' })
        .then((data) => {
            if (Array.isArray(data) && data.length > 0) {
                boNhoDemVoucher = data;
            }
        })
        .catch(() => { });
}

export const MaGiamGiaService = {
    /**
     * Lấy toàn bộ danh sách mã giảm giá còn hiệu lực
     */
    layDanhSachMaGiamGia() {
        return boNhoDemVoucher.filter((m) => m.kich_hoat);
    },

    /**
     * Lấy danh sách mã giảm giá từ Express API (Async)
     * @param {boolean} [tatCa=false] - Nếu true, trả về toàn bộ voucher bao gồm cả mã đã ẩn (dành cho Admin)
     */
    async layDanhSachMaGiamGiaAsync(tatCa = false) {
        const url = tatCa ? '/ma-giam-gia' : '/ma-giam-gia?kich_hoat=true';
        const data = await apiFetch(url, { cache: 'no-store' });
        if (Array.isArray(data) && data.length > 0) {
            boNhoDemVoucher = data;
        }
        if (tatCa) {
            return boNhoDemVoucher;
        }
        return boNhoDemVoucher.filter((m) => m.kich_hoat);
    },

    /**
     * Kiểm tra mã giảm giá trực tiếp từ RESTful API MongoDB Atlas (Async)
     * @param {string} maCode - Mã code giảm giá
     * @param {number} tongTienTamTinh - Tổng tiền tạm tính của giỏ hàng
     * @returns {Promise<Object>} Kết quả kiểm tra
     */
    async kiemTraMaGiamGiaAsync(maCode, tongTienTamTinh) {
        if (!maCode || !maCode.trim()) {
            return { hop_le: false, thong_diep: 'Vui lòng nhập mã giảm giá.', so_tien_giam: 0 };
        }
        try {
            const res = await apiFetch('/ma-giam-gia/kiem-tra', {
                method: 'POST',
                body: JSON.stringify({
                    ma_code: maCode.trim(),
                    tong_tien_tam_tinh: tongTienTamTinh
                })
            });
            if (res && res.hop_le !== undefined) {
                return res;
            }
        } catch (err) {
            console.warn('[MaGiamGiaService] Lỗi gọi API kiểm tra mã giảm giá, chuyển sang kiểm tra bộ nhớ đệm:', err.message);
        }
        return this.kiemTraMaGiamGia(maCode, tongTienTamTinh);
    },

    /**
     * Kiểm tra tính hợp lệ của mã giảm giá dựa trên mã code và tổng tiền đơn hàng (Đồng bộ)
     */
    kiemTraMaGiamGia(maCode, tongTienTamTinh) {
        if (!maCode || !maCode.trim()) {
            return { hop_le: false, thong_diep: 'Vui lòng nhập mã giảm giá.', so_tien_giam: 0 };
        }
        const codeChuan = maCode.trim().toUpperCase();
        const maTimThay = boNhoDemVoucher.find((m) => m.ma_code.toUpperCase() === codeChuan && m.kich_hoat);
        if (!maTimThay) {
            return {
                hop_le: false,
                thong_diep: 'Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng.',
                so_tien_giam: 0
            };
        }
        if (tongTienTamTinh < maTimThay.don_hang_toi_thieu) {
            return {
                hop_le: false,
                thong_diep: `Đơn hàng tối thiểu phải từ ${new Intl.NumberFormat('vi-VN').format(maTimThay.don_hang_toi_thieu)}đ để áp dụng mã này.`,
                so_tien_giam: 0
            };
        }
        let soTienGiam = 0;
        if (maTimThay.loai_giam === 'tien_mat') {
            soTienGiam = maTimThay.gia_tri_giam;
        } else {
            soTienGiam = Math.round((tongTienTamTinh * maTimThay.gia_tri_giam) / 100);
            if (maTimThay.giam_toi_da && soTienGiam > maTimThay.giam_toi_da) {
                soTienGiam = maTimThay.giam_toi_da;
            }
        }
        return {
            hop_le: true,
            thong_diep: `Áp dụng thành công mã "${maTimThay.ma_code}"! Giảm ${new Intl.NumberFormat('vi-VN').format(soTienGiam)}đ.`,
            so_tien_giam: soTienGiam,
            ma_ap_dung: maTimThay
        };
    },

    /**
     * Thêm mã giảm giá mới (Dành cho Admin)
     */
    async themMaGiamGia(duLieuMoi) {
        return await apiFetch('/ma-giam-gia', {
            method: 'POST',
            body: JSON.stringify(duLieuMoi)
        });
    },

    /**
     * Cập nhật mã giảm giá (Dành cho Admin)
     */
    async capNhatMaGiamGia(id, duLieuCapNhat) {
        return await apiFetch(`/ma-giam-gia/${id}`, {
            method: 'PUT',
            body: JSON.stringify(duLieuCapNhat)
        });
    },

    /**
     * Lưu mã voucher vào ví người dùng (Yêu cầu đăng nhập)
     */
    async luuMaVoucherAsync(maCode) {
        return await apiFetch('/ma-giam-gia/luu-ma', {
            method: 'POST',
            body: JSON.stringify({ ma_code: maCode })
        });
    },

    /**
     * Lấy danh sách voucher trong ví của người dùng hiện tại
     */
    async layViVoucherAsync() {
        try {
            const res = await apiFetch('/ma-giam-gia/vi-cua-toi', { cache: 'no-store' }, { danhSachMa: [], vouchers: [] });
            return res;
        } catch (err) {
            console.warn('[MaGiamGiaService] Lỗi lấy ví voucher:', err.message);
            return { danhSachMa: [], vouchers: [] };
        }
    },

    /**
     * Xóa mã giảm giá (Dành cho Admin)
     */
    async xoaMaGiamGia(id) {
        return await apiFetch(`/ma-giam-gia/${id}`, {
            method: 'DELETE'
        });
    }
};
