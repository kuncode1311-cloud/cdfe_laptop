import { apiFetch } from './api-client';

/**
 * Service xử lý Khách Hàng / Tài Khoản Người Dùng
 */
export const NguoiDungService = {
    // 1. Lấy danh sách người dùng
    async layDanhSachNguoiDungAsync() {
        try {
            const res = await apiFetch('/nguoi-dung', { cache: 'no-store' }, []);
            return Array.isArray(res) ? res : [];
        } catch (loi) {
            console.error('Lỗi lấy người dùng:', loi);
            return [];
        }
    },

    // 2. Thêm mới tài khoản
    async themNguoiDung(duLieu) {
        return await apiFetch('/nguoi-dung', {
            method: 'POST',
            body: JSON.stringify(duLieu)
        });
    },

    // 3. Cập nhật thông tin / quyền hạn người dùng
    async capNhatNguoiDung(id, duLieu) {
        return await apiFetch(`/nguoi-dung/${id}`, {
            method: 'PUT',
            body: JSON.stringify(duLieu)
        });
    },

    // 4. Xóa người dùng
    async xoaNguoiDung(id) {
        return await apiFetch(`/nguoi-dung/${id}`, {
            method: 'DELETE'
        });
    }
};

export default NguoiDungService;
