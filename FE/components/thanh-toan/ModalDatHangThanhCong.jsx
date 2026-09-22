'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { 
    CheckCircle2, 
    PackageCheck, 
    Copy, 
    ShieldCheck, 
    Printer, 
    ShoppingBag, 
    MapPin, 
    Phone, 
    Sparkles,
    Clock,
    QrCode,
    X
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { toast } from 'sonner';

export default function ModalDatHangThanhCong({ donHang, onDong, onMoLaiQR }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            setMounted(false);
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    // Kiểm tra chính xác trạng thái thanh toán
    const daThanhToan = Boolean(
        donHang?.da_thanh_toan === true || 
        donHang?.trang_thai_thanh_toan === 'da_thanh_toan'
    );
    const laChuyenKhoan = donHang?.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr';
    const laCOD = donHang?.hinh_thuc_thanh_toan === 'tien_mat_cod' || !laChuyenKhoan;

    // Chỉ bắn pháo hoa Confetti khi đơn hàng THỰC SỰ đã thanh toán hoặc đặt đơn COD
    useEffect(() => {
        if (!daThanhToan && laChuyenKhoan) {
            // Trường hợp chờ chuyển khoản: không bắn pháo hoa
            return;
        }

        try {
            confetti({
                particleCount: 60,
                spread: 60,
                origin: { y: 0.6 }
            });

            const timer = setTimeout(() => {
                confetti({
                    particleCount: 40,
                    spread: 80,
                    origin: { y: 0.6 }
                });
            }, 300);

            return () => clearTimeout(timer);
        } catch (e) {
            console.error('Confetti error:', e);
        }
    }, [daThanhToan, laChuyenKhoan]);

    const saoChepMaDon = () => {
        if (!donHang?.ma_don_hang) return;
        navigator.clipboard.writeText(donHang.ma_don_hang);
        toast.success(`Đã sao chép: ${donHang.ma_don_hang}`);
    };

    const inHoaDon = () => {
        window.print();
    };

    const diaChiDayDu = [
        donHang?.thong_tin_giao_hang?.dia_chi_chi_tiet,
        donHang?.thong_tin_giao_hang?.phuong_xa || donHang?.thong_tin_giao_hang?.phuongXa,
        donHang?.thong_tin_giao_hang?.quan_huyen || donHang?.thong_tin_giao_hang?.quanHuyen,
        donHang?.thong_tin_giao_hang?.tinh_thanh || donHang?.thong_tin_giao_hang?.tinhThanh
    ].filter(Boolean).join(', ');

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0">
            {/* Backdrop làm mờ toàn màn hình 100%, làm chìm topbar và toàn bộ trang */}
            <div 
                onClick={onDong}
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 print:hidden" 
            />

            {/* Modal Card - Thiết kế gọn gàng vừa vặn trong 1 màn hình máy tính & di động */}
            <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border-2 border-slate-200 dark:border-slate-700 shadow-2xl z-10 space-y-2.5 sm:space-y-3 animate-in zoom-in-95 duration-200 my-auto overflow-y-auto print:border-none print:shadow-none print:m-0 print:p-0">
                {/* Nút đóng góc phải */}
                <button
                    type="button"
                    onClick={onDong}
                    className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors cursor-pointer print:hidden"
                    title="Đóng cửa sổ"
                >
                    <X className="w-3.5 h-3.5" />
                </button>

                {/* Phần Tiêu Đề & Icon Trạng Thái - Kích thước tinh gọn */}
                <div className="text-center space-y-2 pt-1">
                    {daThanhToan ? (
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/25">
                            <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                                <Sparkles className="w-2.5 h-2.5 fill-amber-950" />
                            </div>
                        </div>
                    ) : laChuyenKhoan ? (
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25">
                            <Clock className="w-7 h-7 stroke-[2.2] animate-pulse" />
                        </div>
                    ) : (
                        <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <PackageCheck className="w-7 h-7 stroke-[2.2]" />
                        </div>
                    )}

                    <div className="space-y-0.5">
                        <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight uppercase">
                            {daThanhToan 
                                ? 'ĐẶT HÀNG & THANH TOÁN THÀNH CÔNG!' 
                                : 'ĐẶT HÀNG THÀNH CÔNG!'}
                        </h2>
                        <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                            {daThanhToan 
                                ? 'Hệ thống đã xác nhận thanh toán. Đơn hàng sẽ được xuất kho và giao ngay.' 
                                : laChuyenKhoan 
                                    ? 'Đơn hàng đã được lưu trên hệ thống. Quý khách vui lòng chuyển khoản để xuất kho.' 
                                    : 'Hệ thống đã ghi nhận đơn hàng và chuẩn bị đóng gói chuyển phát hỏa tốc.'}
                        </p>
                    </div>
                </div>

                {/* Khối Nhắc Nhở Chuyển Khoản - Gọn gàng 1 dòng thanh thoát */}
                {!daThanhToan && laChuyenKhoan && (
                    <div className="p-2.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 flex items-center justify-between gap-2.5 text-left">
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                                <QrCode className="w-4 h-4 text-amber-600 dark:text-amber-300" />
                            </div>
                            <div className="min-w-0">
                                <div className="text-[11px] font-black text-amber-950 dark:text-amber-200 uppercase leading-tight truncate">
                                    Đơn hàng chưa thanh toán
                                </div>
                                <div className="text-[10.5px] text-amber-700 dark:text-amber-400 truncate">
                                    Quét mã QR bất kỳ lúc nào để hoàn tất
                                </div>
                            </div>
                        </div>

                        {onMoLaiQR && (
                            <button
                                type="button"
                                onClick={onMoLaiQR}
                                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer shrink-0 active:scale-95"
                            >
                                <QrCode className="w-3.5 h-3.5 text-yellow-300" />
                                <span>Mở Lại QR</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Hộp Thông Tin Chi Tiết Đơn Hàng - Bố cục tối ưu, tiết kiệm diện tích */}
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    {/* Hàng 1: Mã đơn & Trạng thái thanh toán gộp chung 1 hàng */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700">
                        <div className="flex items-center gap-1.5">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Mã đơn:</span>
                            <span className="font-mono font-black text-xs sm:text-sm text-blue-600 dark:text-cyan-400">
                                #{donHang?.ma_don_hang}
                            </span>
                            <button
                                type="button"
                                onClick={saoChepMaDon}
                                className="p-1 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Sao chép mã đơn"
                            >
                                <Copy className="w-3 h-3" />
                            </button>
                        </div>

                        {/* Badge trạng thái */}
                        {daThanhToan ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-black text-[10px] border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shrink-0">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                                Đã Thanh Toán
                            </span>
                        ) : laChuyenKhoan ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black text-[10px] border border-amber-300 dark:border-amber-800 flex items-center gap-1 shrink-0">
                                <Clock className="w-3 h-3 text-amber-600 stroke-[2.5] animate-pulse" />
                                Chờ Chuyển Khoản
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-black text-[10px] border border-blue-300 dark:border-blue-800 flex items-center gap-1 shrink-0">
                                <PackageCheck className="w-3 h-3 text-blue-600 stroke-[2.5]" />
                                Thanh Toán COD
                            </span>
                        )}
                    </div>

                    {/* Hàng 2: Người nhận & Số Điện Thoại */}
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700 text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0">Người nhận:</span>
                        <div className="flex items-center gap-2 text-right">
                            <span className="font-bold text-slate-900 dark:text-white">
                                {donHang?.thong_tin_giao_hang?.ho_va_ten || donHang?.thong_tin_giao_hang?.ho_ten}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px] flex items-center gap-0.5">
                                <Phone className="w-2.5 h-2.5 text-blue-500" />
                                {donHang?.thong_tin_giao_hang?.so_dien_thoai}
                            </span>
                        </div>
                    </div>

                    {/* Hàng 3: Nơi nhận hàng */}
                    <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-700 text-[11.5px]">
                        <span className="text-slate-500 dark:text-slate-400 font-medium shrink-0 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500" /> Nơi nhận:
                        </span>
                        <span className="text-right text-slate-800 dark:text-slate-200 font-medium truncate max-w-[280px]" title={diaChiDayDu}>
                            {diaChiDayDu || 'Giao hàng tận nơi'}
                        </span>
                    </div>

                    {/* Hàng 4: Tổng Thanh Toán */}
                    <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-slate-900 dark:text-white font-bold text-xs sm:text-sm">
                            {daThanhToan 
                                ? 'Tổng đã thanh toán:' 
                                : laChuyenKhoan 
                                    ? 'Số tiền cần chuyển:' 
                                    : 'Thu khi nhận (COD):'}
                        </span>
                        <div className="text-right">
                            <span className="text-base sm:text-lg font-black text-red-600 dark:text-rose-400">
                                {dinhDangTienVND(donHang?.tong_tien_thanh_toan || 0)}
                            </span>
                            <span className="block text-[9.5px] text-slate-400 -mt-0.5">
                                (Đã gồm VAT & Miễn phí vận chuyển)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Cam kết xác nhận nhanh */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/80 dark:bg-emerald-950/30 py-1.5 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>Kỹ thuật viên LaptopNew sẽ gọi xác nhận kiện hàng trong vòng 15 phút</span>
                </div>

                {/* Nút Điều Hướng & Hành Động - Luôn hiển thị trọn vẹn trong màn hình */}
                <div className="grid grid-cols-3 gap-2 pt-1 print:hidden">
                    <Link
                        href={`/don-hang?ma=${donHang?.ma_don_hang || ''}`}
                        className="py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                    >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Tra Cứu Đơn</span>
                    </Link>

                    <button
                        type="button"
                        onClick={inHoaDon}
                        className="py-2.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                    >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>In Hóa Đơn</span>
                    </button>

                    <Link
                        href="/san-pham"
                        onClick={onDong}
                        className="py-2.5 px-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Tiếp Tục Mua</span>
                    </Link>
                </div>
            </div>
        </div>,
        document.body
    );
}
