import { apiFetch } from './api-client';

/**
 * Service xử lý Bảo Hành sản phẩm (Admin) kết nối RESTful API MongoDB Atlas
 */
export const BaoHanhService = {
    /**
     * [ADMIN] Lấy danh sách toàn bộ các mục bảo hành trong hệ thống để quản trị
     * @param {number} [gioiHan=300] - Số lượng bản ghi tối đa lấy về
     * @returns {Promise<Array>}
     */
    async layDanhSachBaoHanhAdminAsync(gioiHan = 300) {
        try {
            const res = await apiFetch(`/bao-hanh/quan-tri/tat-ca?gioi_han=${gioiHan}`);
            return res?.danh_sach && Array.isArray(res.danh_sach) ? res.danh_sach : [];
        } catch (loi) {
            console.warn('[BaoHanhService] Lỗi lấy danh sách bảo hành:', loi.message);
            return [];
        }
    },

    /**
     * [ADMIN] Ghi đè thông tin bảo hành (serial thật / số tháng bảo hành) cho 1 sản phẩm trong 1 đơn hàng
     * @param {Object} duLieu - { ma_don_hang, id_muc, so_serial, thoi_han_bao_hanh_thang }
     */
    async ghiDeBaoHanhAsync({ ma_don_hang, id_muc, so_serial, thoi_han_bao_hanh_thang }) {
        return await apiFetch('/bao-hanh/ghi-de', {
            method: 'PATCH',
            body: JSON.stringify({ ma_don_hang, id_muc, so_serial, thoi_han_bao_hanh_thang })
        });
    }
};

export default BaoHanhService;
