'use client';

import { toast } from 'sonner';
import { apiFetch, TOKEN_STORAGE_KEY } from './api-client';
import { dangKyKhiDoi, thongBaoThayDoi } from './dong-bo.service';

const KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI = 'tntp_cai_dat_khuyen_mai_2026';
const SU_KIEN_KHUYEN_MAI = 'tntp_khuyen_mai_cap_nhat';

/**
 * Cấu hình Banner / Flash Sale.
 * NGUỒN ĐÚNG nằm trên server (MongoDB) để mọi khách đều thấy thay đổi của Admin;
 * bộ nhớ + localStorage chỉ là bản sao để hiển thị ngay khi mở trang.
 * (Trước đây chỉ lưu localStorage nên khách ở máy khác không bao giờ thấy.)
 */
let boNhoDemKhuyenMai = null;

const docBanSaoLocal = () => {
    if (typeof window === 'undefined') return {};
    try {
        return JSON.parse(localStorage.getItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI) || '{}');
    } catch {
        return {};
    }
};

const ghiBanSaoLocal = (duLieu) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI, JSON.stringify(duLieu));
    } catch {
        /* bộ nhớ trình duyệt đầy / bị chặn: bỏ qua */
    }
};

const phatSuKienKhuyenMai = (duLieu) => {
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SU_KIEN_KHUYEN_MAI, { detail: duLieu }));
    }
};

const coDangNhap = () => typeof window !== 'undefined' && Boolean(localStorage.getItem(TOKEN_STORAGE_KEY));

// Gửi toàn bộ cấu hình lên server (chỉ Admin được ghi), rồi báo các trang của khách tự làm mới
const luuLenServer = async (duLieu) => {
    await apiFetch('/cai-dat/khuyen-mai', {
        method: 'PUT',
        body: JSON.stringify({ khuyen_mai: duLieu })
    });
    thongBaoThayDoi('cai_dat');
};

export const CaiDatService = {
    layCaiDatKhuyenMai() {
        if (boNhoDemKhuyenMai === null) boNhoDemKhuyenMai = docBanSaoLocal();
        return boNhoDemKhuyenMai;
    },

    luuCaiDatKhuyenMai(duLieuMoi) {
        const capNhat = { ...this.layCaiDatKhuyenMai(), ...duLieuMoi };
        boNhoDemKhuyenMai = capNhat;
        ghiBanSaoLocal(capNhat);
        phatSuKienKhuyenMai(capNhat);
        luuLenServer(capNhat).catch((loi) => {
            console.error('[CaiDat] Không lưu được cấu hình khuyến mãi lên máy chủ:', loi);
            toast.error(`Chưa lưu được cấu hình khuyến mãi lên máy chủ: ${loi.message}`);
        });
        return capNhat;
    },

    khoiPhucMacDinh() {
        boNhoDemKhuyenMai = {};
        if (typeof window !== 'undefined') localStorage.removeItem(KHOA_LUU_TRU_CAI_DAT_KHUYEN_MAI);
        phatSuKienKhuyenMai({});
        luuLenServer({}).catch((loi) => {
            console.error('[CaiDat] Không khôi phục được cấu hình khuyến mãi trên máy chủ:', loi);
            toast.error(`Chưa khôi phục được trên máy chủ: ${loi.message}`);
        });
        return {};
    },

    /** Nạp cấu hình mới nhất từ server; nếu khác bản đang hiển thị thì cập nhật và báo các trang. */
    async taiCaiDatKhuyenMaiAsync() {
        try {
            const ketQua = await apiFetch('/cai-dat/khuyen-mai', { cache: 'no-store' });
            const tuServer = ketQua?.du_lieu && typeof ketQua.du_lieu === 'object' ? ketQua.du_lieu : {};
            const tuLocal = this.layCaiDatKhuyenMai();

            // Máy này còn cấu hình cũ trong localStorage mà server chưa có (thường là máy Admin từ trước khi
            // chuyển lưu lên server): đẩy lên một lần. Khách thường sẽ bị từ chối (401/403) → làm theo server.
            if (Object.keys(tuServer).length === 0 && Object.keys(tuLocal).length > 0 && coDangNhap()) {
                try {
                    await luuLenServer(tuLocal);
                    return tuLocal;
                } catch {
                    /* không phải Admin → dùng dữ liệu của server */
                }
            }

            if (JSON.stringify(tuServer) !== JSON.stringify(tuLocal)) {
                boNhoDemKhuyenMai = tuServer;
                ghiBanSaoLocal(tuServer);
                phatSuKienKhuyenMai(tuServer);
            }
            return tuServer;
        } catch {
            return this.layCaiDatKhuyenMai(); // mất mạng: giữ bản đang có
        }
    },

    async layDanhSachShowroomAsync() {
        const data = await apiFetch('/cai-dat/showroom', { cache: 'no-store' });
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
        thongBaoThayDoi('cai_dat');
        return data.du_lieu;
    },

    khoiPhucShowroomMacDinhAsync() {
        return Promise.reject(new Error('Dữ liệu showroom mẫu đã bị loại bỏ'));
    }
};

// Khi mở trang: lấy cấu hình từ server; sau đó cứ mỗi lần bảng cai_dat đổi thì nạp lại
if (typeof window !== 'undefined') {
    CaiDatService.taiCaiDatKhuyenMaiAsync();
    dangKyKhiDoi('cai_dat', () => CaiDatService.taiCaiDatKhuyenMaiAsync());
}

export default CaiDatService;
