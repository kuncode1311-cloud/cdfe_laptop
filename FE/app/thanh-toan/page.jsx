'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Home, 
    ChevronRight, 
    ShieldCheck, 
    Lock, 
    ArrowLeft, 
    Loader2, 
    Truck, 
    Sparkles, 
    Tag, 
    CheckCircle2 
} from 'lucide-react';
import { useGioHang } from '@/contexts/CartContext';
import { DonHangService } from '@/services/don-hang.service';
import { ThanhToanService } from '@/services/thanh-toan.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import FormThongTinGiaoHang from '@/components/thanh-toan/FormThongTinGiaoHang';
import PhuongThucThanhToanComponent from '@/components/thanh-toan/PhuongThucThanhToan';
import ModalThanhToanQR from '@/components/thanh-toan/ModalThanhToanQR';
import ModalDatHangThanhCong from '@/components/thanh-toan/ModalDatHangThanhCong';
import { useNguoiDung } from '@/contexts/AuthContext';
import { toast } from 'sonner';

function NoiDungTrangThanhToan() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { gio_hang, xoaSachGioHang } = useGioHang();
    const { nguoiDung } = useNguoiDung();

    const [thongTinGiaoHang, setThongTinGiaoHang] = useState({
        ho_va_ten: '',
        so_dien_thoai: '',
        email: '',
        tinh_thanh: '',
        quan_huyen: '',
        phuong_xa: '',
        dia_chi_chi_tiet: '',
        ghi_chu: ''
    });

    // Tự động điền thông tin nếu người dùng đã đăng nhập
    useEffect(() => {
        if (nguoiDung) {
            setThongTinGiaoHang(prev => ({
                ...prev,
                ho_va_ten: prev.ho_va_ten || nguoiDung.hoTen || nguoiDung.ho_va_ten || '',
                so_dien_thoai: prev.so_dien_thoai || nguoiDung.soDienThoai || nguoiDung.so_dien_thoai || '',
                email: prev.email || nguoiDung.email || '',
                tinh_thanh: prev.tinh_thanh || nguoiDung.tinh_thanh || '',
                quan_huyen: prev.quan_huyen || nguoiDung.quan_huyen || '',
                phuong_xa: prev.phuong_xa || nguoiDung.phuong_xa || '',
                dia_chi_chi_tiet: prev.dia_chi_chi_tiet || nguoiDung.diaChi || nguoiDung.dia_chi || ''
            }));
        }
    }, [nguoiDung]);

    const [laFormHopLe, setLaFormHopLe] = useState(false);
    const [phuongThucThanhToan, setPhuongThucThanhToan] = useState('chuyen_khoan_vietqr');
    const [dangXuLy, setDangXuLy] = useState(false);

    // Modal QR PayOS & Modal Thành công
    const [duLieuQRModal, setDuLieuQRModal] = useState(null);
    const [donHangHienTai, setDonHangHienTai] = useState(null);
    const [donHangThanhCong, setDonHangThanhCong] = useState(null);

    // Xử lý khi người dùng quay lại từ link redirect của PayOS (?status=PAID&orderCode=...)
    useEffect(() => {
        const status = searchParams.get('status');
        const orderCode = searchParams.get('orderCode');
        if (status === 'PAID' && orderCode) {
            toast.success('🎉 Cổng PayOS xác nhận đã thanh toán thành công!');
            // Tìm đơn hàng tương ứng
            const danhSach = DonHangService.layTatCaDonHang();
            const donHang = danhSach.find(d => 
                String(d.payos_order_code) === String(orderCode) || 
                String(d.ma_don_hang).includes(String(orderCode))
            );
            if (donHang) {
                setDonHangThanhCong(donHang);
                xoaSachGioHang();
            }
        }
    }, [searchParams]);

    const xuLyDatHang = async (e) => {
        e.preventDefault();

        if (gio_hang.danh_sach_muc.length === 0) {
            toast.error('Giỏ hàng đang trống! Vui lòng chọn laptop trước khi thanh toán.');
            return;
        }

        // Kiểm tra hợp lệ các trường cơ bản
        if (
            !thongTinGiaoHang.ho_va_ten.trim() ||
            !thongTinGiaoHang.so_dien_thoai.trim() ||
            !thongTinGiaoHang.email.trim() ||
            !thongTinGiaoHang.tinh_thanh.trim() ||
            !thongTinGiaoHang.dia_chi_chi_tiet.trim()
        ) {
            toast.error('Vui lòng điền đầy đủ các thông tin giao hàng có dấu * đỏ');
            return;
        }

        // Validate SĐT
        const sdtClean = thongTinGiaoHang.so_dien_thoai.replace(/\D/g, '');
        if (!/^(0[3|5|7|8|9])[0-9]{8}$/.test(sdtClean)) {
            toast.error('Số điện thoại không hợp lệ! Vui lòng nhập đúng 10 số di động Việt Nam.');
            return;
        }

        setDangXuLy(true);

        try {
            // 1. Tạo đơn hàng trong DB
            const donHangMoi = await DonHangService.taoDonHang(
                {
                    ...thongTinGiaoHang,
                    id_nguoi_dung: nguoiDung?.id || nguoiDung?._id || ''
                },
                gio_hang.danh_sach_muc,
                gio_hang.tam_tinh,
                gio_hang.tien_giam_gia,
                gio_hang.ma_giam_gia_da_dung,
                phuongThucThanhToan
            );

            if (!donHangMoi || !donHangMoi.ma_don_hang) {
                throw new Error('Không thể khởi tạo đơn hàng. Vui lòng thử lại.');
            }

            setDonHangHienTai(donHangMoi);

            // 2. Phân nhánh theo phương thức thanh toán
            if (phuongThucThanhToan === 'chuyen_khoan_vietqr') {
                // Tạo link thanh toán PayOS & mã QR VietQR chuẩn
                const paymentRes = await ThanhToanService.taoYeuCauThanhToan({
                    ma_don_hang: donHangMoi.ma_don_hang,
                    id_don_hang: donHangMoi.id,
                    tong_tien: donHangMoi.tong_tien_thanh_toan,
                    ten_khach_hang: thongTinGiaoHang.ho_va_ten
                });

                // Mở Modal QR PayOS với đồng hồ đếm ngược 15 phút
                setDuLieuQRModal({
                    ...paymentRes,
                    orderCode: paymentRes?.orderCode || donHangMoi.ma_don_hang,
                    amount: donHangMoi.tong_tien_thanh_toan,
                    description: paymentRes?.description || `TRIKUN ${donHangMoi.ma_don_hang.slice(-6)}`,
                    qrImageUrl: paymentRes?.qrImageUrl
                });
            } else {
                // Thanh toán COD: Hoàn tất đơn ngay lập tức
                xoaSachGioHang();
                setDonHangThanhCong(donHangMoi);
            }
        } catch (err) {
            console.error('Lỗi khi đặt hàng:', err);
            toast.error(`Có lỗi khi đặt hàng: ${err.message || 'Vui lòng kiểm tra lại kết nối mạng'}`);
        } finally {
            setDangXuLy(false);
        }
    };

    // Khi chuyển khoản PayOS thành công từ Modal QR
    const xuLyThanhToanThanhCongTuQR = async (donHangDaCapNhat) => {
        try {
            await DonHangService.capNhatDonHang(donHangDaCapNhat.id || donHangDaCapNhat.ma_don_hang, {
                da_thanh_toan: true,
                trang_thai_thanh_toan: 'da_thanh_toan'
            });
        } catch (e) {
            console.warn('Lỗi cập nhật trạng thái đơn:', e);
        }
        xoaSachGioHang();
        setDuLieuQRModal(null);
        setDonHangThanhCong(donHangDaCapNhat);
    };

    // Mở lại modal thanh toán QR cho đơn hàng chưa thanh toán
    const moLaiModalQR = () => {
        const dh = donHangThanhCong || donHangHienTai;
        if (!dh) return;
        setDonHangThanhCong(null);
        setDuLieuQRModal({
            orderCode: dh.ma_don_hang,
            amount: dh.tong_tien_thanh_toan,
            description: `TRIKUN ${String(dh.ma_don_hang || '').slice(-6)}`,
            qrImageUrl: `https://img.vietqr.io/image/970452-0345151438-compact2.png?amount=${dh.tong_tien_thanh_toan || 0}&addInfo=${encodeURIComponent(`TRIKUN ${String(dh.ma_don_hang || '').slice(-6)}`)}&accountName=LE%20MINH%20TRI`
        });
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-12">
            {/* 1. Breadcrumb điều hướng */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/gio-hang" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    Giỏ Hàng
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-900 dark:text-white">
                    Thanh Toán & Đặt Hàng
                </span>
            </nav>

            {/* 2. Tiêu đề trang nổi bật trong Card Sạch Sẽ Tách Biệt Với Nền */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap items-center gap-2.5">
                        <span>XÁC NHẬN THANH TOÁN</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-300 font-extrabold border border-blue-300 dark:border-blue-800 shadow-2xs">
                            Bảo mật SSL 256-bit
                        </span>
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Kiểm tra thông tin giao hàng & chọn phương thức thanh toán an toàn
                    </p>
                </div>

                <Link 
                    href="/gio-hang" 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#0052cc] dark:text-cyan-400 font-black text-xs border border-blue-200 dark:border-blue-800 transition-all shadow-2xs self-start sm:self-center shrink-0"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại giỏ hàng</span>
                </Link>
            </div>

            {/* 3. Form Thanh Toán & Cột Tóm Tắt Đơn */}
            <form onSubmit={xuLyDatHang} className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                {/* Cột Trái (7 Cột): Địa Chỉ Nhận Hàng & Hình Thức Thanh Toán */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Form Địa Chỉ & Người Nhận */}
                    <FormThongTinGiaoHang 
                        thongTin={thongTinGiaoHang} 
                        onThayDoi={setThongTinGiaoHang} 
                        onValidationChange={setLaFormHopLe}
                    />

                    {/* Phương Thức Thanh Toán: PayOS VietQR hoặc COD */}
                    <PhuongThucThanhToanComponent 
                        phuongThucChon={phuongThucThanhToan} 
                        onThayDoi={setPhuongThucThanhToan} 
                        tongTien={gio_hang.tong_thanh_toan} 
                    />
                </div>

                {/* Cột Phải (5 Cột): Tóm Tắt Đơn Hàng & Nút Hoàn Tất */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        {/* Header tóm tắt */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                            <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#0052cc]"></span>
                                <span>ĐƠN HÀNG CỦA BẠN</span>
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 text-[11px] font-extrabold">
                                    {gio_hang.tong_so_luong} máy
                                </span>
                            </h3>
                            <Link href="/gio-hang" className="text-[11px] font-bold text-[#0052cc] dark:text-cyan-400 hover:underline">
                                Chỉnh sửa
                            </Link>
                        </div>

                        {/* Danh sách các laptop rút gọn */}
                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-72 overflow-y-auto pr-1">
                            {gio_hang.danh_sach_muc.map((muc) => {
                                const cauHinh = muc.tuy_chon_chon?.ten_tuy_chon || muc.tuy_chon_chon?.ram || muc.san_pham?.ram;
                                return (
                                    <div key={muc.id_muc} className="py-3 flex items-center gap-3">
                                        <div className="relative w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 overflow-hidden shrink-0">
                                            <Image 
                                                src={muc.san_pham.hinh_anh_chinh} 
                                                alt={muc.san_pham.ten_san_pham} 
                                                fill 
                                                className="object-contain p-1" 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                                {muc.san_pham.ten_san_pham}
                                            </h4>
                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Số lượng: <strong className="text-slate-800 dark:text-slate-200">{muc.so_luong}</strong> {cauHinh ? `• ${cauHinh}` : ''}
                                            </div>
                                        </div>
                                        <div className="text-xs font-black text-red-600 dark:text-rose-400 shrink-0 font-mono">
                                            {dinhDangTienVND(muc.tong_tien_muc)}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Tóm tắt tính tiền */}
                        <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm">
                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span>Tạm tính tiền hàng:</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    {dinhDangTienVND(gio_hang.tam_tinh)}
                                </span>
                            </div>

                            {gio_hang.tien_giam_gia > 0 && (
                                <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                    <span className="flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        Voucher ({gio_hang.ma_giam_gia_da_dung}):
                                    </span>
                                    <span className="font-extrabold">-{dinhDangTienVND(gio_hang.tien_giam_gia)}</span>
                                </div>
                            )}

                            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Truck className="w-3.5 h-3.5 text-emerald-500" />
                                    Vận chuyển toàn quốc:
                                </span>
                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                    MIỄN PHÍ 100%
                                </span>
                            </div>

                            {/* Dòng tổng tiền thanh toán */}
                            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-baseline justify-between">
                                <div>
                                    <span className="font-black text-slate-900 dark:text-white text-sm">
                                        Tổng thanh toán:
                                    </span>
                                    <span className="block text-[10.5px] text-slate-400">
                                        (Đã bao gồm thuế VAT 10%)
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-rose-400 tracking-tight">
                                        {dinhDangTienVND(gio_hang.tong_thanh_toan)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nút Hoàn Tất Đặt Hàng */}
                        <button
                            type="submit"
                            disabled={dangXuLy || gio_hang.danh_sach_muc.length === 0}
                            className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-red-500/25 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {dangXuLy ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>ĐANG TẠO ĐƠN HÀNG...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>HOÀN TẤT ĐẶT HÀNG NGAY</span>
                                </>
                            )}
                        </button>

                        <div className="text-[11px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                            <span>Cam kết niêm phong chính hãng • Đổi mới 30 ngày nếu lỗi</span>
                        </div>
                    </div>
                </div>
            </form>

            {/* 4. Modal Quét QR Thanh Toán PayOS / VietQR (15 Phút Đếm Ngược & Polling) */}
            {duLieuQRModal && (
                <ModalThanhToanQR 
                    duLieuThanhToan={duLieuQRModal}
                    donHang={donHangHienTai}
                    onThanhToanThanhCong={xuLyThanhToanThanhCongTuQR}
                    onDong={() => {
                        // Người dùng chủ động đóng popup -> giữ nguyên trạng thái đơn hàng CHƯA thanh toán (Chờ chuyển khoản)
                        xoaSachGioHang();
                        setDuLieuQRModal(null);
                        setDonHangThanhCong({
                            ...donHangHienTai,
                            da_thanh_toan: false,
                            trang_thai_thanh_toan: 'cho_thanh_toan'
                        });
                    }}
                />
            )}

            {/* 5. Modal Thông Báo Đặt Hàng Thành Công (Pháo hoa Confetti & In Hóa Đơn) */}
            {donHangThanhCong && (
                <ModalDatHangThanhCong 
                    donHang={donHangThanhCong} 
                    onDong={() => setDonHangThanhCong(null)}
                    onMoLaiQR={moLaiModalQR}
                />
            )}
        </div>
    );
}

export default function TrangThanhToan() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
            </div>
        }>
            <NoiDungTrangThanhToan />
        </Suspense>
    );
}
