import { apiFetch } from './api-client';

// Bộ nhớ đệm danh mục để hỗ trợ render nhanh và fallback an toàn
let boNhoDemDanhMuc = [];

/**
 * Service xử lý Danh Mục Phân Khúc & Thương Hiệu Laptop kết nối RESTful API MongoDB Atlas
 */
export const DanhMucService = {
    /**
     * 1. Lấy toàn bộ danh sách thương hiệu / danh mục từ Express API & MongoDB
     * @param {string} [loai] - Lọc theo loại ('thuong_hieu' hoặc 'nhu_cau' / 'phan_khuc')
     * @returns {Promise<Array>}
     */
    async layDanhSachDanhMucAsync(loai) {
        try {
            const url = loai ? `/danh-muc?loai=${encodeURIComponent(loai)}` : '/danh-muc';
            const res = await apiFetch(url, { cache: 'no-store' }, boNhoDemDanhMuc);
            const data = Array.isArray(res) ? res : (res?.duLieu || []);
            if (data.length > 0 && !loai) {
                boNhoDemDanhMuc = data;
            }
            return data;
        } catch (loi) {
            console.warn('[DanhMucService] Lỗi lấy danh mục:', loi.message);
            return boNhoDemDanhMuc;
        }
    },

    /**
     * 2. Lấy danh sách các Hãng / Thương hiệu laptop (ASUS, Lenovo, Dell, Apple,...)
     * @returns {Promise<Array>}
     */
    async layDanhSachThuongHieuAsync() {
        const danhSach = await this.layDanhSachDanhMucAsync('thuong_hieu');
        if (danhSach && danhSach.length > 0) {
            return danhSach;
        }
        // Nếu database chưa phân loại, lọc theo trường loai hoặc lấy toàn bộ
        const tatCa = await this.layDanhSachDanhMucAsync();
        const chiThuongHieu = tatCa.filter(dm => dm.loai === 'thuong_hieu' || !dm.loai);
        return chiThuongHieu.length > 0 ? chiThuongHieu : tatCa;
    },

    /**
     * 3. Lấy danh sách danh mục nhu cầu (Gaming, AI PC, Mỏng nhẹ,...)
     * @returns {Promise<Array>}
     */
    async layDanhSachNhuCauAsync() {
        const danhSach = await this.layDanhSachDanhMucAsync('nhu_cau');
        if (danhSach && danhSach.length > 0) {
            return danhSach;
        }
        const tatCa = await this.layDanhSachDanhMucAsync();
        return tatCa.filter(dm => dm.loai === 'nhu_cau');
    },

    /**
     * 4. Thêm mới danh mục / thương hiệu (Dành cho Quản trị Admin)
     */
    async themDanhMuc(duLieu) {
        const res = await apiFetch('/danh-muc', {
            method: 'POST',
            body: JSON.stringify(duLieu)
        });
        await this.layDanhSachDanhMucAsync(); // Cập nhật lại bộ nhớ đệm
        return res;
    },

    /**
     * 5. Cập nhật danh mục (Dành cho Quản trị Admin)
     */
    async capNhatDanhMuc(id, duLieu) {
        const res = await apiFetch(`/danh-muc/${id}`, {
            method: 'PUT',
            body: JSON.stringify(duLieu)
        });
        await this.layDanhSachDanhMucAsync();
        return res;
    },

    /**
     * 6. Xóa danh mục (Dành cho Quản trị Admin)
     */
    async xoaDanhMuc(id) {
        const res = await apiFetch(`/danh-muc/${id}`, {
            method: 'DELETE'
        });
        await this.layDanhSachDanhMucAsync();
        return res;
    }
};

export default DanhMucService;
