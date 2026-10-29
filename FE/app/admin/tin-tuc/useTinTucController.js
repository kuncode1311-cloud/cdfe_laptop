'use client';

import { TinTucService } from '@/services/tin-tuc.service';

// Xử lý nghiệp vụ TinTuc; dữ liệu dùng chung được truyền từ controller chính.
export default function useTinTucController(dependencies) {
    const { canhBao, formTinTuc, hienThongBao, rutGonTen, setDangLuuTinTuc, setDangMoModalTinTuc, setDangXuLyTinTucId, setDanhSachTinTuc, setFormTinTuc, setTinTucDangSua, taiDuLieuToanBo, thucHienToggleAdmin, thucHienXoaAdmin, tinTucDangSua } = dependencies;
    const moModalThemTinTuc = () => {
        setTinTucDangSua(null);
        setFormTinTuc({
            id: `tin-${Date.now().toString().slice(-6)}`,
            tieu_de: '',
            tom_tat: '',
            noi_dung: `### 1. Giới thiệu tổng quan\n\nNội dung chi tiết phân tích chuyên sâu...\n\n### 2. Đánh giá hiệu năng thực tế\n\nChi tiết kiểm nghiệm nhiệt độ và benchmark...\n\n> 💡 **Lời khuyên từ chuyên gia TNTP Laptop:**\n> Hãy chọn cấu hình phù hợp với nhu cầu công việc và ngân sách của bạn.`,
            hinh_anh: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
            chuyen_muc: 'Tư Vấn Mua Sắm',
            tac_gia: 'Chuyên Gia Công Nghệ TNTP Laptop',
            thoi_gian_doc: '5 phút đọc',
            la_tieu_diem: false,
            xuat_ban: true
        });
        setDangMoModalTinTuc(true);
    };

    const moModalSuaTinTuc = (tin) => {
        setTinTucDangSua(tin);
        setFormTinTuc({
            id: tin.id || '',
            tieu_de: tin.tieu_de || '',
            tom_tat: tin.tom_tat || '',
            noi_dung: tin.noi_dung || '',
            hinh_anh: tin.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
            chuyen_muc: tin.chuyen_muc || 'Tư Vấn Mua Sắm',
            tac_gia: tin.tac_gia || 'Ban Biên Tập',
            thoi_gian_doc: tin.thoi_gian_doc || '5 phút đọc',
            la_tieu_diem: Boolean(tin.la_tieu_diem),
            xuat_ban: tin.xuat_ban !== false
        });
        setDangMoModalTinTuc(true);
    };
    const moModalSuaTin = moModalSuaTinTuc;

    const xuLyLuuTinTuc = async (e) => {
        e.preventDefault();
        setDangLuuTinTuc(true);
        try {
            const payload = {
                ...formTinTuc,
                tieu_de: formTinTuc.tieu_de.trim(),
                tom_tat: formTinTuc.tom_tat.trim(),
                noi_dung: formTinTuc.noi_dung.trim(),
                hinh_anh: formTinTuc.hinh_anh.trim(),
                tac_gia: formTinTuc.tac_gia.trim()
            };

            if (tinTucDangSua) {
                await TinTucService.capNhatTinTuc(tinTucDangSua.id || tinTucDangSua._id, payload);
                hienThongBao(`Đã cập nhật bài viết "${payload.tieu_de}"!`);
            } else {
                await TinTucService.themTinTuc(payload);
                hienThongBao(`Đã xuất bản bài viết mới "${payload.tieu_de}"!`);
            }

            setDangMoModalTinTuc(false);
            setTinTucDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Bài Viết', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuTinTuc(false);
        }
    };

    const xuLyToggleXuatBanTinTuc = (tin) => thucHienToggleAdmin({
        item: tin,
        truong: 'xuat_ban',
        giaTriHienTai: tin.xuat_ban !== false,
        setDanhSach: setDanhSachTinTuc,
        apiCapNhat: (id, patch) => TinTucService.capNhatTinTuc(id, patch),
        thongBaoBat: `Đã xuất bản: "${rutGonTen(tin.tieu_de, 26)}"`,
        thongBaoTat: `Đã chuyển về bản nháp: "${rutGonTen(tin.tieu_de, 26)}"`,
        nhom: 'Tin Tức & Bài Viết'
    });

    const xuLyToggleTieuDiemTinTuc = (tin) => thucHienToggleAdmin({
        item: tin,
        truong: 'la_tieu_diem',
        giaTriHienTai: Boolean(tin.la_tieu_diem),
        setDanhSach: setDanhSachTinTuc,
        apiCapNhat: (id, patch) => TinTucService.capNhatTinTuc(id, patch),
        thongBaoBat: `Đã ghim Tiêu Điểm: "${rutGonTen(tin.tieu_de, 26)}"`,
        thongBaoTat: `Đã bỏ ghim Tiêu Điểm: "${rutGonTen(tin.tieu_de, 26)}"`,
        nhom: 'Tin Tiêu Điểm Hot',
        loaiBat: 'deal'
    });

    const xuLyXoaTinTuc = (tin, tieuDeThamKhao) => {
        const id = typeof tin === 'object' && tin !== null ? (tin.id || tin._id) : tin;
        const tieuDe = (typeof tin === 'object' && tin !== null ? tin.tieu_de : tieuDeThamKhao) || 'Bài viết';
        return thucHienXoaAdmin({
            id,
            tieuDeXacNhan: 'Xóa Bài Viết Tin Tức?',
            noiDungXacNhan: `Bạn có chắc muốn xóa bài viết: "${tieuDe}"?`,
            nutXacNhan: 'Xóa Bài Viết',
            xoaApi: () => TinTucService.xoaTinTuc(id),
            thongBaoThanhCong: `Đã xóa bài viết "${tieuDe}"!`,
            tieuDeLoi: 'Không Thể Xóa Bài Viết',
            setDangXuLy: setDangXuLyTinTucId
        });
    };
    return { moModalThemTinTuc, moModalSuaTinTuc, moModalSuaTin, xuLyLuuTinTuc, xuLyToggleXuatBanTinTuc, xuLyToggleTieuDiemTinTuc, xuLyXoaTinTuc };
}
