'use client';
import { useMemo } from 'react';

import { MaGiamGiaService } from '@/services/ma-giam-gia.service';

// Xử lý nghiệp vụ Voucher; dữ liệu dùng chung được truyền từ controller chính.
export default function useVoucherController(dependencies) {
    const { canhBao, formVoucher, hienThongBao, setDangLuuVoucher, setDangMoModalVoucher, setDangXuLyVoucherId, setDanhSachVoucher, setFormVoucher, setVoucherDangSua, taiDuLieuToanBo, thucHienToggleAdmin, thucHienXoaAdmin, voucherDangSua } = dependencies;
    const { danhSachVoucher, tuKhoaVoucher, locTrangThaiVoucher } = dependencies;
    const moModalThemVoucher = () => {
        setVoucherDangSua(null);
        setFormVoucher({
            ma_code: '',
            tieu_de: '',
            mo_ta: '',
            loai_giam: 'tien_mat',
            gia_tri_giam: 500000,
            giam_toi_da: 0,
            don_hang_toi_thieu: 20000000,
            so_luong_phat_hanh: 20,
            ngay_bat_dau: '2026-08-01',
            ngay_het_han: '2026-12-31',
            chuyen_muc: 'toan_san',
            mau_sac: 'rose',
            badge: 'HOT DEAL',
            kich_hoat: true
        });
        setDangMoModalVoucher(true);
    };

    const moModalSuaVoucher = (vc) => {
        setVoucherDangSua(vc);
        setFormVoucher({
            ma_code: vc.ma_code || '',
            tieu_de: vc.tieu_de || '',
            mo_ta: vc.mo_ta || '',
            loai_giam: vc.loai_giam || 'tien_mat',
            gia_tri_giam: vc.gia_tri_giam || 0,
            giam_toi_da: vc.giam_toi_da || 0,
            don_hang_toi_thieu: vc.don_hang_toi_thieu || 0,
            so_luong_phat_hanh: vc.so_luong_phat_hanh || 20,
            ngay_bat_dau: vc.ngay_bat_dau || '',
            ngay_het_han: vc.ngay_het_han_chuan || '',
            chuyen_muc: vc.chuyen_muc || 'toan_san',
            mau_sac: vc.mau_sac || 'rose',
            badge: vc.badge || 'HOT DEAL',
            kich_hoat: vc.kich_hoat !== false
        });
        setDangMoModalVoucher(true);
    };

    const xuLyLuuVoucher = async (e) => {
        e.preventDefault();
        setDangLuuVoucher(true);
        try {
            const payload = {
                ...formVoucher,
                ma_code: formVoucher.ma_code.toUpperCase().trim(),
                gia_tri_giam: Number(formVoucher.gia_tri_giam),
                don_hang_toi_thieu: Number(formVoucher.don_hang_toi_thieu),
                giam_toi_da: Number(formVoucher.giam_toi_da),
                so_luong_phat_hanh: Number(formVoucher.so_luong_phat_hanh) || 20,
                chuyen_muc: formVoucher.chuyen_muc || 'toan_san',
                mau_sac: formVoucher.mau_sac || 'rose',
                badge: formVoucher.badge || 'HOT DEAL'
            };

            if (voucherDangSua) {
                await MaGiamGiaService.capNhatMaGiamGia(voucherDangSua.id || voucherDangSua.ma_code || voucherDangSua._id, payload);
                hienThongBao(`Đã cập nhật mã giảm giá "${payload.ma_code}"!`);
            } else {
                await MaGiamGiaService.themMaGiamGia(payload);
                hienThongBao(`Đã tạo mã giảm giá "${payload.ma_code}" thành công!`);
            }

            setDangMoModalVoucher(false);
            setVoucherDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Mã Giảm Giá', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuVoucher(false);
        }
    };

    const xuLyToggleVoucher = (voucher) => thucHienToggleAdmin({
        item: voucher,
        layId: (x) => x.id || x.ma_code || x._id,
        truong: 'kich_hoat',
        giaTriHienTai: voucher.kich_hoat !== false,
        setDanhSach: setDanhSachVoucher,
        apiCapNhat: (id, patch) => MaGiamGiaService.capNhatMaGiamGia(id, patch),
        thongBaoBat: `Đã kích hoạt mã: "${voucher.ma_code}"`,
        thongBaoTat: `Đã tạm ẩn mã: "${voucher.ma_code}"`,
        nhom: 'Mã Khuyến Mãi'
    });

    const xuLyXoaVoucher = (voucher) => thucHienXoaAdmin({
        id: voucher.id || voucher.ma_code || voucher._id,
        tieuDeXacNhan: 'Xóa Mã Giảm Giá?',
        noiDungXacNhan: `Bạn có chắc muốn xóa mã voucher: "${voucher.ma_code}"?`,
        nutXacNhan: 'Xóa Voucher',
        xoaApi: () => MaGiamGiaService.xoaMaGiamGia(voucher.id || voucher.ma_code || voucher._id),
        thongBaoThanhCong: `Đã xóa voucher "${voucher.ma_code}"!`,
        tieuDeLoi: 'Không Thể Xóa Voucher',
        setDangXuLy: setDangXuLyVoucherId
    });
    // Voucher hiển thị kèm bộ lọc tìm kiếm & trạng thái
    // Tìm và lọc voucher theo trạng thái để hiển thị trong bảng.
    const voucherHienThi = useMemo(() => {
        return danhSachVoucher.filter(vc => {
            const key = (tuKhoaVoucher || '').toLowerCase().trim();
            const matchTuKhoa = !key ||
                vc.ma_code?.toLowerCase().includes(key) ||
                vc.tieu_de?.toLowerCase().includes(key) ||
                vc.mo_ta?.toLowerCase().includes(key);

            let matchTrangThai = true;
            if (locTrangThaiVoucher === 'kich_hoat') {
                matchTrangThai = vc.kich_hoat !== false;
            } else if (locTrangThaiVoucher === 'tam_an') {
                matchTrangThai = vc.kich_hoat === false;
            }

            return matchTuKhoa && matchTrangThai;
        });
    }, [danhSachVoucher, tuKhoaVoucher, locTrangThaiVoucher]);

    return { voucherHienThi, moModalThemVoucher, moModalSuaVoucher, xuLyLuuVoucher, xuLyToggleVoucher, xuLyXoaVoucher };
}
