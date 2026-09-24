'use client';

import { apiFetch } from './api-client';

const KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI = 'tntp_cai_dat_khuyen_mai_2026';

export const CaiDatService = {
    layCaiDatKhuyenMai() {
        if (typeof window === 'undefined') return {};
        try {
            return JSON.parse(localStorage.getItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI) || '{}');
        } catch {
            return {};
        }
    },

    luuCaiDatKhuyenMai(duLieuMoi) {
        const capNhat = { ...this.layCaiDatKhuyenMai(), ...duLieuMoi };
        if (typeof window !== 'undefined') {
            localStorage.setItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI, JSON.stringify(capNhat));
            window.dispatchEvent(new CustomEvent('tntp_khuyen_mai_cap_nhat', { detail: capNhat }));
        }
        return capNhat;
    },

    khoiPhucMacDinh() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI);
            window.dispatchEvent(new CustomEvent('tntp_khuyen_mai_cap_nhat', { detail: {} }));
        }
        return {};
    },

    async layDanhSachShowroomAsync() {
        const data = await apiFetch('/cai-dat/showroom');
        return Array.isArray(data?.du_lieu) ? data.du_lieu : [];
    },

    async luuDanhSachShowroomAsync(danhSachMoi) {
        if (!Array.isArray(danhSachMoi) || danhSachMoi.length === 0) {
            throw new Error('Danh sách showroom không hợp lệ');
        }
        const data = await apiFetch('/cai-dat/showroom', {
            method: 'PUT',
            body: JSON.stringify({ danh_sach_showroom: danhSachMoi })
        });
        return data.du_lieu;
    },

    khoiPhucShowroomMacDinhAsync() {
        return Promise.reject(new Error('Dữ liệu showroom mẫu đã bị loại bỏ'));
    }
};

export default CaiDatService;
