'use client';

import { DanhMucService } from '@/services/danh-muc.service';

// Xử lý nghiệp vụ DanhMuc; dữ liệu dùng chung được truyền từ controller chính.
export default function useDanhMucController(dependencies) {
    const { canhBao, danhSachDanhMuc, dmDangSua, formDm, hienThongBao, locLoaiDanhMuc, setDangLuuDanhMuc, setDangMoModalDanhMuc, setDangXuLyDmId, setDanhSachDanhMuc, setDmDangSua, setFormDm, taiDuLieuToanBo, thucHienToggleAdmin, thucHienXoaAdmin } = dependencies;
    const moModalThemDanhMuc = () => {
        setDmDangSua(null);
        setFormDm({
            ma_danh_muc: '',
            ten_danh_muc: '',
            loai: locLoaiDanhMuc,
            nhom_hang: 'phu_kien',
            logo: '💻',
            xuat_xu: 'Chính Hãng',
            mo_ta: '',
            kich_hoat: true,
            thu_tu_hien_thi: danhSachDanhMuc.length + 1
        });
        setDangMoModalDanhMuc(true);
    };

    const moModalSuaDanhMuc = (dm) => {
        setDmDangSua(dm);
        setFormDm({
            ma_danh_muc: dm.ma_danh_muc || '',
            ten_danh_muc: dm.ten_danh_muc || '',
            loai: dm.loai || 'thuong_hieu',
            logo: dm.logo || '💻',
            xuat_xu: dm.xuat_xu || 'Chính Hãng',
            mo_ta: dm.mo_ta || '',
            kich_hoat: dm.kich_hoat !== false,
            thu_tu_hien_thi: dm.thu_tu_hien_thi || 1
        });
        setDangMoModalDanhMuc(true);
    };

    const xuLyLuuDanhMuc = async (e) => {
        e.preventDefault();
        setDangLuuDanhMuc(true);
        try {
            const payload = {
                ...formDm,
                ma_danh_muc: formDm.ma_danh_muc.toLowerCase().trim(),
                ten_danh_muc: formDm.ten_danh_muc.trim(),
                thu_tu_hien_thi: Number(formDm.thu_tu_hien_thi) || 1
            };

            if (dmDangSua) {
                await DanhMucService.capNhatDanhMuc(dmDangSua.id || dmDangSua._id || dmDangSua.ma_danh_muc, payload);
                hienThongBao(`Đã cập nhật thương hiệu "${payload.ten_danh_muc}"!`);
            } else {
                payload.id = 'brand-' + payload.ma_danh_muc;
                await DanhMucService.themDanhMuc(payload);
                hienThongBao(`Đã thêm thương hiệu "${payload.ten_danh_muc}" vào hệ thống!`);
            }

            setDangMoModalDanhMuc(false);
            setDmDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Danh Mục', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuDanhMuc(false);
        }
    };

    const xuLyToggleDanhMuc = (dm) => thucHienToggleAdmin({
        item: dm,
        layId: (x) => x.id || x._id || x.ma_danh_muc,
        truong: 'kich_hoat',
        giaTriHienTai: dm.kich_hoat !== false,
        setDanhSach: setDanhSachDanhMuc,
        apiCapNhat: (id, patch) => DanhMucService.capNhatDanhMuc(id, patch),
        thongBaoBat: `Đã kích hoạt: "${dm.ten_danh_muc}"`,
        thongBaoTat: `Đã tạm ngưng: "${dm.ten_danh_muc}"`,
        nhom: 'Hãng & Phân Khúc'
    });

    const xuLyXoaDanhMuc = (dm) => thucHienXoaAdmin({
        id: dm.id || dm._id || dm.ma_danh_muc,
        tieuDeXacNhan: 'Xóa Thương Hiệu / Danh Mục?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa thương hiệu "${dm.ten_danh_muc}" khỏi hệ thống?`,
        nutXacNhan: 'Xóa Thương Hiệu',
        xoaApi: () => DanhMucService.xoaDanhMuc(dm.id || dm._id || dm.ma_danh_muc),
        thongBaoThanhCong: `Đã xóa thương hiệu "${dm.ten_danh_muc}"!`,
        tieuDeLoi: 'Không Thể Xóa Thương Hiệu',
        setDangXuLy: setDangXuLyDmId
    });
    return { moModalThemDanhMuc, moModalSuaDanhMuc, xuLyLuuDanhMuc, xuLyToggleDanhMuc, xuLyXoaDanhMuc };
}
