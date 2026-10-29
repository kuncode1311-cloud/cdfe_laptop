'use client';

import { CaiDatService } from '@/services/cai-dat.service';

// Xử lý nghiệp vụ KhuyenMai; dữ liệu dùng chung được truyền từ controller chính.
export default function useKhuyenMaiController(dependencies) {
    const { canhBao, formCaiDatKm, hienThongBao, setCaiDatKm, setDangLuuKm, setFormCaiDatKm, xacNhan } = dependencies;
    // Kiểm tra và lưu nội dung chương trình khuyến mãi.
    const xuLyLuuCaiDatKm = (e) => {
        if (e) e.preventDefault();
        setDangLuuKm(true);
        try {
            const daLuu = CaiDatService.luuCaiDatKhuyenMai(formCaiDatKm);
            setCaiDatKm(daLuu);
            setFormCaiDatKm(daLuu);
            hienThongBao('Đã lưu và áp dụng cấu hình Banner Khuyến Mãi thành công!');
        } catch (err) {
            canhBao({
                tieuDe: 'Lỗi Lưu Cấu Hình',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangLuuKm(false);
        }
    };

    // Khôi phục cấu hình khuyến mãi mặc định.
    const xuLyKhoiPhucCaiDatKm = async () => {
        const dongY = await xacNhan({
            tieuDe: 'Khôi Phục Cài Đặt Khuyến Mãi?',
            noiDung: 'Bạn có chắc muốn khôi phục cấu hình khuyến mãi về mặc định ban đầu không?',
            loai: 'warning',
            nutXacNhan: 'Khôi Phục Mặc Định',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const macDinh = CaiDatService.khoiPhucMacDinh();
        setCaiDatKm(macDinh);
        setFormCaiDatKm(macDinh);
        hienThongBao('Đã khôi phục cấu hình khuyến mãi về mặc định!');
    };

    // Hàm chọn nhanh mốc thời gian kết thúc khuyến mãi (1 click tiện lợi)
    const chonNhanhHanKetThuc = (soNgay) => {
        const d = new Date();
        d.setDate(d.getDate() + soNgay);
        d.setHours(23, 59, 0, 0);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
    };

    // Đặt thời điểm kết thúc vào cuối tuần này.
    const chonCuoiTuan = () => {
        const d = new Date();
        const day = d.getDay(); // 0: Chủ Nhật
        const soNgayDenChuNhat = day === 0 ? 7 : (7 - day);
        d.setDate(d.getDate() + soNgayDenChuNhat);
        d.setHours(23, 59, 0, 0);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
    };

    // Đặt thời điểm kết thúc vào cuối tháng.
    const chonCuoiThang = () => {
        const d = new Date();
        const ngayCuoiThang = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 0, 0);
        const tzOffset = ngayCuoiThang.getTimezoneOffset() * 60000;
        const localISOTime = new Date(ngayCuoiThang.getTime() - tzOffset).toISOString().slice(0, 16);
        setFormCaiDatKm((prev) => ({ ...prev, thoi_gian_ket_thuc: localISOTime }));
    };
    return { xuLyLuuCaiDatKm, xuLyKhoiPhucCaiDatKm, chonNhanhHanKetThuc, chonCuoiTuan, chonCuoiThang };
}
