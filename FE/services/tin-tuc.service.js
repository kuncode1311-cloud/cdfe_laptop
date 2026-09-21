import { DANH_SACH_TIN_TUC } from '@/du-lieu/danh-sach-tin-tuc';
import { apiFetch } from './api-client';
import { taoSlug } from '@/utils/taoSlug';

let boNhoDemTinTuc = [...DANH_SACH_TIN_TUC];

if (typeof window !== 'undefined') {
    apiFetch('/tin-tuc', { cache: 'no-store' }, DANH_SACH_TIN_TUC)
        .then((res) => {
            const list = res?.duLieu || res;
            if (Array.isArray(list) && list.length > 0) {
                boNhoDemTinTuc = list;
            }
        })
        .catch(() => { });
}

export const TinTucService = {
    /**
     * Lấy toàn bộ danh sách tin tức từ cache (Sync)
     */
    layDanhSachTinTuc(chiLayXuatBan = true) {
        if (!chiLayXuatBan) return boNhoDemTinTuc;
        return boNhoDemTinTuc.filter(t => t.xuat_ban !== false);
    },

    /**
     * Lấy danh sách tin tức từ Express API / MongoDB (Async)
     */
    async layDanhSachTinTucAsync(params = {}) {
        const query = new URLSearchParams();
        if (params.chuyen_muc && params.chuyen_muc !== 'all' && params.chuyen_muc !== 'tat_ca') {
            query.append('chuyen_muc', params.chuyen_muc);
        }
        if (params.q) query.append('q', params.q);
        if (params.la_tieu_diem) query.append('la_tieu_diem', 'true');
        if (params.tat_ca) query.append('tat_ca', 'true');

        const url = `/tin-tuc${query.toString() ? `?${query.toString()}` : ''}`;
        const res = await apiFetch(url, { cache: 'no-store' }, DANH_SACH_TIN_TUC);
        const list = res?.duLieu || (Array.isArray(res) ? res : DANH_SACH_TIN_TUC);

        if (Array.isArray(list) && list.length > 0) {
            boNhoDemTinTuc = list;
        }
        return Array.isArray(list) ? list : boNhoDemTinTuc;
    },

    /**
     * Lấy chi tiết bài viết theo ID hoặc Slug
     */
    async layChiTietTinTucAsync(id) {
        try {
            const res = await apiFetch(`/tin-tuc/${id}`, { cache: 'no-store' }, null);
            const tin = res?.duLieu || (res?.tieu_de ? res : null);
            if (tin) return tin;
        } catch (e) {
            console.warn('Lỗi lấy bài viết từ API, tìm trong cache:', e);
        }
        return (
            boNhoDemTinTuc.find(t => t.id === id || t._id === id || t.slug === id || taoSlug(t.tieu_de) === id) ||
            DANH_SACH_TIN_TUC.find(t => t.id === id || t._id === id || t.slug === id || taoSlug(t.tieu_de) === id) ||
            null
        );
    },

    /**
     * Thêm bài viết mới
     */
    async themTinTuc(duLieu) {
        const json = await apiFetch('/tin-tuc', {
            method: 'POST',
            body: JSON.stringify(duLieu)
        });
        const itemMoi = json?.duLieu || json;
        if (itemMoi) {
            boNhoDemTinTuc.unshift(itemMoi);
        }
        return itemMoi;
    },

    /**
     * Cập nhật bài viết
     */
    async capNhatTinTuc(id, duLieu) {
        const json = await apiFetch(`/tin-tuc/${id}`, {
            method: 'PUT',
            body: JSON.stringify(duLieu)
        });
        const itemSua = json?.duLieu || json;
        if (itemSua) {
            const idx = boNhoDemTinTuc.findIndex(t => t.id === id || t._id === id);
            if (idx !== -1) boNhoDemTinTuc[idx] = itemSua;
        }
        return itemSua;
    },

    /**
     * Xóa bài viết
     */
    async xoaTinTuc(id) {
        await apiFetch(`/tin-tuc/${id}`, {
            method: 'DELETE'
        });
        boNhoDemTinTuc = boNhoDemTinTuc.filter(t => t.id !== id && t._id !== id);
        return true;
    }
};
