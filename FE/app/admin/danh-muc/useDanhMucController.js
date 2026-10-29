'use client';
import { useMemo } from 'react';

import { DanhMucService } from '@/services/danh-muc.service';

// Xử lý nghiệp vụ DanhMuc; dữ liệu dùng chung được truyền từ controller chính.
export default function useDanhMucController(dependencies) {
    const { canhBao, danhSachDanhMuc, dmDangSua, formDm, hienThongBao, locLoaiDanhMuc, setDangLuuDanhMuc, setDangMoModalDanhMuc, setDangXuLyDmId, setDanhSachDanhMuc, setDmDangSua, setFormDm, taiDuLieuToanBo, thucHienToggleAdmin, thucHienXoaAdmin } = dependencies;
    const { tuKhoaDanhMuc } = dependencies;
    // Mở form tạo danh mục theo nhóm đang xem.
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

    // Đưa danh mục được chọn vào form chỉnh sửa.
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

    // Kiểm tra và lưu danh mục.
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
                const idDm = dmDangSua.id || dmDangSua._id || dmDangSua.ma_danh_muc;
                const dmDaLuu = await DanhMucService.capNhatDanhMuc(idDm, payload);
                setDanhSachDanhMuc((cu) => cu.map((dm) =>
                    (dm.id || dm._id || dm.ma_danh_muc) === idDm ? dmDaLuu : dm
                ));
                hienThongBao(`Đã cập nhật thương hiệu "${payload.ten_danh_muc}"!`);
            } else {
                payload.id = 'brand-' + payload.ma_danh_muc;
                const dmDaLuu = await DanhMucService.themDanhMuc(payload);
                setDanhSachDanhMuc((cu) => [dmDaLuu, ...cu]);
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

    // Bật hoặc tạm ngưng danh mục.
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

    // Xác nhận rồi xóa danh mục.
    const xuLyXoaDanhMuc = (dm) => thucHienXoaAdmin({
        id: dm.id || dm._id || dm.ma_danh_muc,
        tieuDeXacNhan: 'Xóa Thương Hiệu / Danh Mục?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa thương hiệu "${dm.ten_danh_muc}" khỏi hệ thống?`,
        nutXacNhan: 'Xóa Thương Hiệu',
        xoaApi: async () => {
            const idDm = dm.id || dm._id || dm.ma_danh_muc;
            await DanhMucService.xoaDanhMuc(idDm);
            setDanhSachDanhMuc((cu) => cu.filter((x) => (x.id || x._id || x.ma_danh_muc) !== idDm));
        },
        thongBaoThanhCong: `Đã xóa thương hiệu "${dm.ten_danh_muc}"!`,
        tieuDeLoi: 'Không Thể Xóa Thương Hiệu',
        setDangXuLy: setDangXuLyDmId
    });
    // Tìm danh mục theo tên, mã và nhóm loại đang chọn.
    const danhMucHienThi = useMemo(() => {
        return danhSachDanhMuc.filter(dm => {
            const key = tuKhoaDanhMuc.toLowerCase().trim();
            const matchTuKhoa = !key ||
                dm.ten_danh_muc?.toLowerCase().includes(key) ||
                dm.ma_danh_muc?.toLowerCase().includes(key) ||
                dm.xuat_xu?.toLowerCase().includes(key);

            const matchLoai = locLoaiDanhMuc === 'thuong_hieu'
                ? (dm.loai === 'thuong_hieu' || !dm.loai)
                : dm.loai === locLoaiDanhMuc;

            return matchTuKhoa && matchLoai;
        });
    }, [danhSachDanhMuc, tuKhoaDanhMuc, locLoaiDanhMuc]);

    return { danhMucHienThi, moModalThemDanhMuc, moModalSuaDanhMuc, xuLyLuuDanhMuc, xuLyToggleDanhMuc, xuLyXoaDanhMuc };
}
