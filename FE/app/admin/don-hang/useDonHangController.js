'use client';

import { DonHangService } from '@/services/don-hang.service';

// Xử lý nghiệp vụ DonHang; dữ liệu dùng chung được truyền từ controller chính.
export default function useDonHangController(dependencies) {
    const { canhBao, danhSachSanPham, danhSachVoucher, donHangDangSua, formDonHang, hienThongBao, setDangLuuDonHang, setDangMoModalDonHang, setDangXuLyDonHangId, setDonHangDangSua, setFormDonHang, taiDuLieuToanBo, thucHienXoaAdmin } = dependencies;
    const moModalTaoDonHang = () => {
        setDonHangDangSua(null);
        setFormDonHang({
            ho_ten: '',
            so_dien_thoai: '',
            email: '',
            tinh_thanh: '',
            phuong_xa: '',
            dia_chi_chi_tiet: '',
            ghi_chu: 'Khách mua trực tiếp tại quầy',
            cac_san_pham: [{ san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }],
            hinh_thuc_thanh_toan: 'chuyen_khoan_vietqr',
            da_thanh_toan: true,
            trang_thai: 'da_xac_nhan',
            ma_giam_gia: ''
        });
        setDangMoModalDonHang(true);
    };

    // Mở modal SỬA đơn hàng đã có (chỉ cho sửa thông tin giao hàng + trạng thái/thanh toán/ghi chú
    // để đảm bảo AN TOÀN dữ liệu: KHÔNG động vào danh sách sản phẩm/tồn kho/tiền đã phát sinh của đơn cũ)
    const moModalSuaDonHang = (dh) => {
        setDonHangDangSua(dh);
        setFormDonHang({
            ho_ten: dh.thong_tin_giao_hang?.ho_ten || '',
            so_dien_thoai: dh.thong_tin_giao_hang?.so_dien_thoai || '',
            email: dh.thong_tin_giao_hang?.email || '',
            tinh_thanh: dh.thong_tin_giao_hang?.tinh_thanh || '',
            phuong_xa: dh.thong_tin_giao_hang?.phuong_xa || '',
            dia_chi_chi_tiet: dh.thong_tin_giao_hang?.dia_chi_chi_tiet || '',
            ghi_chu: dh.thong_tin_giao_hang?.ghi_chu || '',
            cac_san_pham: Array.isArray(dh.danh_sach_san_pham) && dh.danh_sach_san_pham.length > 0
                ? dh.danh_sach_san_pham.map(sp => ({ san_pham_id: sp.san_pham_id, so_luong: sp.so_luong }))
                : [{ san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }],
            hinh_thuc_thanh_toan: dh.hinh_thuc_thanh_toan || 'chuyen_khoan_vietqr',
            da_thanh_toan: Boolean(dh.da_thanh_toan),
            trang_thai: dh.trang_thai || 'da_xac_nhan',
            ma_giam_gia: dh.ma_giam_gia || ''
        });
        setDangMoModalDonHang(true);
    };

    // Thêm 1 dòng sản phẩm mới vào đơn hàng đang tạo (chỉ áp dụng khi TẠO đơn mới)
    const themDongSanPhamDonHang = () => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: [...prev.cac_san_pham, { san_pham_id: danhSachSanPham[0]?.id || '', so_luong: 1 }]
        }));
    };

    // Xóa 1 dòng sản phẩm khỏi đơn hàng đang tạo
    const xoaDongSanPhamDonHang = (index) => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: prev.cac_san_pham.length > 1
                ? prev.cac_san_pham.filter((_, i) => i !== index)
                : prev.cac_san_pham
        }));
    };

    // Cập nhật giá trị 1 dòng sản phẩm (san_pham_id hoặc so_luong) trong đơn hàng đang tạo
    const capNhatDongSanPhamDonHang = (index, key, value) => {
        setFormDonHang(prev => ({
            ...prev,
            cac_san_pham: prev.cac_san_pham.map((dong, i) => (i === index ? { ...dong, [key]: value } : dong))
        }));
    };

    const xuLyLuuDonHang = async (e) => {
        e.preventDefault();
        setDangLuuDonHang(true);
        try {
            if (donHangDangSua) {
                // SỬA ĐƠN HÀNG ĐÃ CÓ: Vì lý do AN TOÀN dữ liệu (đơn cũ có thể đã trừ tồn kho, phát sinh
                // bảo hành, lịch sử thanh toán...), CHỈ cho phép cập nhật thông tin giao hàng + trạng thái
                // đơn hàng + hình thức/trạng thái thanh toán + ghi chú. KHÔNG động vào danh sách sản phẩm,
                // tạm tính, giảm giá, tổng tiền đã có của đơn hàng gốc để tránh làm sai lệch dữ liệu đã phát sinh.
                const payloadCapNhat = {
                    thong_tin_giao_hang: {
                        ho_ten: formDonHang.ho_ten,
                        so_dien_thoai: formDonHang.so_dien_thoai,
                        email: formDonHang.email,
                        tinh_thanh: formDonHang.tinh_thanh,
                        phuong_xa: formDonHang.phuong_xa,
                        dia_chi_chi_tiet: formDonHang.dia_chi_chi_tiet,
                        ghi_chu: formDonHang.ghi_chu
                    },
                    hinh_thuc_thanh_toan: formDonHang.hinh_thuc_thanh_toan,
                    da_thanh_toan: Boolean(formDonHang.da_thanh_toan),
                    trang_thai: formDonHang.trang_thai
                };

                await DonHangService.capNhatDonHang(donHangDangSua.id || donHangDangSua._id, payloadCapNhat);
                hienThongBao(`Đã cập nhật đơn hàng ${donHangDangSua.ma_don_hang}!`);
            } else {
                // TẠO ĐƠN HÀNG MỚI TẠI QUẦY: cho phép chọn nhiều sản phẩm (nhiều dòng) trong 1 đơn
                const dongHopLe = (formDonHang.cac_san_pham || []).filter(d => d.san_pham_id);
                if (dongHopLe.length === 0) {
                    throw new Error('Vui lòng chọn ít nhất 1 sản phẩm cho đơn hàng!');
                }

                const danhSachSpPayload = dongHopLe.map(dong => {
                    const spChon = danhSachSanPham.find(s => s.id === dong.san_pham_id || s._id === dong.san_pham_id);
                    const donGia = spChon ? spChon.gia_khuyen_mai : 20000000;
                    return {
                        san_pham_id: spChon ? spChon.id : dong.san_pham_id,
                        ten_san_pham: spChon ? spChon.ten_san_pham : 'Sản Phẩm TNTP Store',
                        hinh_anh: spChon ? spChon.hinh_anh_chinh : '/images/asus_rog_scar18.jpg',
                        gia_tai_thoi_diem_them: donGia,
                        so_luong: Math.max(1, Number(dong.so_luong) || 1)
                    };
                });

                const tamTinh = danhSachSpPayload.reduce((tong, sp) => tong + sp.gia_tai_thoi_diem_them * sp.so_luong, 0);

                let tienGiam = 0;
                if (formDonHang.ma_giam_gia) {
                    const vc = danhSachVoucher.find(v => v.ma_code === formDonHang.ma_giam_gia.toUpperCase().trim());
                    if (vc && vc.kich_hoat) {
                        tienGiam = vc.loai_giam === 'tien_mat' ? vc.gia_tri_giam : (tamTinh * vc.gia_tri_giam) / 100;
                    }
                }
                const tongTien = Math.max(0, tamTinh - tienGiam);

                const payloadDonHang = {
                    id: `dh_admin_${Date.now()}`,
                    ma_don_hang: `LPN-${Date.now().toString().slice(-4)}`,
                    id_nguoi_dung: 'admin_root',
                    thong_tin_giao_hang: {
                        ho_ten: formDonHang.ho_ten,
                        so_dien_thoai: formDonHang.so_dien_thoai,
                        email: formDonHang.email,
                        tinh_thanh: formDonHang.tinh_thanh,
                        phuong_xa: formDonHang.phuong_xa,
                        dia_chi_chi_tiet: formDonHang.dia_chi_chi_tiet,
                        ghi_chu: formDonHang.ghi_chu
                    },
                    danh_sach_san_pham: danhSachSpPayload,
                    tam_tinh: tamTinh,
                    tien_giam_gia: tienGiam,
                    ma_giam_gia: formDonHang.ma_giam_gia || '',
                    phi_van_chuyen: 0,
                    tong_tien_thanh_toan: tongTien,
                    hinh_thuc_thanh_toan: formDonHang.hinh_thuc_thanh_toan,
                    da_thanh_toan: Boolean(formDonHang.da_thanh_toan),
                    trang_thai: formDonHang.trang_thai,
                    lich_trinh_giao_hang: [
                        {
                            thoi_gian: new Date().toISOString(),
                            mo_ta: 'Đơn hàng được tạo bởi Quản Trị Viên'
                        }
                    ]
                };

                await DonHangService.taoDonHang(payloadDonHang);
                hienThongBao(`Đã tạo đơn hàng mới ${payloadDonHang.ma_don_hang}!`);
            }

            setDangMoModalDonHang(false);
            setDonHangDangSua(null);
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Đơn Hàng', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuDonHang(false);
        }
    };

    const xuLyDoiTrangThaiDonHang = async (id, trangThaiMoi) => {
        let lyDoHuy;
        if (trangThaiMoi === 'da_huy') {
            // Bắt buộc xác nhận qua prompt để tránh hủy nhầm khi chọn lố trong dropdown;
            // bấm Cancel (trả về null) sẽ hủy bỏ thao tác, không gọi API.
            lyDoHuy = window.prompt('Hủy đơn hàng này? Nhập lý do hủy (có thể để trống), bấm Cancel để không hủy:', '');
            if (lyDoHuy === null) return;
        }
        setDangXuLyDonHangId(id);
        try {
            await DonHangService.capNhatDonHang(id, {
                trang_thai: trangThaiMoi,
                da_thanh_toan: trangThaiMoi === 'da_giao' ? true : undefined,
                ...(trangThaiMoi === 'da_huy' ? { ly_do_huy: lyDoHuy, nguoi_huy: 'admin' } : {})
            });
            const thongBaoText = trangThaiMoi === 'da_giao'
                ? 'Giao hàng thành công! Đơn hàng đã hoàn tất.'
                : trangThaiMoi === 'da_huy'
                    ? 'Đã hủy đơn hàng! Tồn kho sản phẩm đã được hoàn trả.'
                    : 'Đã cập nhật trạng thái đơn hàng thành công!';
            const kieuThongBao = trangThaiMoi === 'da_giao' ? 'success' : trangThaiMoi === 'da_huy' ? 'warning' : 'info';
            hienThongBao(thongBaoText, kieuThongBao, 'Kho & Đơn Hàng');
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Đổi Trạng Thái Đơn Hàng', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    const xuLyDoiTrangThaiThanhToan = async (id, daThanhToanMoi, hinhThuc) => {
        setDangXuLyDonHangId(id);
        try {
            const trangThaiThanhToan = daThanhToanMoi
                ? 'da_thanh_toan'
                : hinhThuc === 'tien_mat_cod'
                ? 'thanh_toan_khi_nhan_hang'
                : 'cho_thanh_toan';

            await DonHangService.capNhatDonHang(id, {
                da_thanh_toan: daThanhToanMoi,
                trang_thai_thanh_toan: trangThaiThanhToan
            });

            const thongBaoText = daThanhToanMoi
                ? 'Đã xác nhận thanh toán thành công (Thủ công)!'
                : 'Đã chuyển đơn về trạng thái chưa thanh toán!';
            hienThongBao(thongBaoText, daThanhToanMoi ? 'success' : 'warning', 'Thanh Toán');
            taiDuLieuToanBo();
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Cập Nhật Thanh Toán', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangXuLyDonHangId(null);
        }
    };

    const xuLyXoaDonHang = (id, maDon) => thucHienXoaAdmin({
        id,
        tieuDeXacNhan: 'Xóa Đơn Hàng Này?',
        noiDungXacNhan: `Bạn có chắc chắn muốn xóa vĩnh viễn đơn hàng: "${maDon}"?`,
        nutXacNhan: 'Xóa Đơn Hàng',
        xoaApi: () => DonHangService.xoaDonHang(id),
        thongBaoThanhCong: `Đã xóa đơn hàng ${maDon}!`,
        tieuDeLoi: 'Không Thể Xóa Đơn Hàng',
        setDangXuLy: setDangXuLyDonHangId
    });
    return { moModalTaoDonHang, moModalSuaDonHang, themDongSanPhamDonHang, xoaDongSanPhamDonHang, capNhatDongSanPhamDonHang, xuLyLuuDonHang, xuLyDoiTrangThaiDonHang, xuLyDoiTrangThaiThanhToan, xuLyXoaDonHang };
}
