'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { 
    Clock, 
    Copy, 
    Check, 
    CheckCircle2, 
    AlertTriangle, 
    X, 
    ShieldCheck, 
    Loader2, 
    QrCode, 
    Zap 
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { ThanhToanService } from '@/services/thanh-toan.service';
import { toast } from 'sonner';

export default function ModalThanhToanQR({ 
    duLieuThanhToan, 
    donHang, 
    onThanhToanThanhCong, 
    onDong 
}) {
    const [mounted, setMounted] = useState(false);
    // Thời gian đếm ngược 15 phút = 900 giây
    const [giayConLai, setGiayConLai] = useState(15 * 60);
    const [daSaoChep, setDaSaoChep] = useState({});
    const [dangKiemTra, setDangKiemTra] = useState(false);
    const [daXacNhanThanhCong, setDaXacNhanThanhCong] = useState(false);
    const timerRef = useRef(null);
    const pollingRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            setMounted(false);
            document.body.style.overflow = prevOverflow;
        };
    }, []);

    const orderCode = duLieuThanhToan?.orderCode || donHang?.ma_don_hang;
    const amount = duLieuThanhToan?.amount || donHang?.tong_tien_thanh_toan || 0;
    const description = duLieuThanhToan?.description || `TRIKUN ${String(donHang?.ma_don_hang || '').slice(-6)}`;
    const qrImageUrl = duLieuThanhToan?.qrImageUrl || `https://img.vietqr.io/image/970452-0345151438-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=LE%20MINH%20TRI`;

    const bankInfo = {
        nganHang: duLieuThanhToan?.thongTinNganHang?.nganHang || 'KienlongBank (Ngân Hàng Kiên Long)',
        bin: duLieuThanhToan?.thongTinNganHang?.bin || '970452',
        soTaiKhoan: duLieuThanhToan?.thongTinNganHang?.soTaiKhoan || '0345151438',
        chuTaiKhoan: duLieuThanhToan?.thongTinNganHang?.tenChuTaiKhoan || 'LE MINH TRI',
        soTien: amount,
        noiDung: description
    };

    // 1. Đồng hồ đếm ngược 15:00
    useEffect(() => {
        timerRef.current = setInterval(() => {
            setGiayConLai(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // 2. Tự động kiểm tra trạng thái thanh toán mỗi 2.5 giây
    useEffect(() => {
        if (!orderCode || daXacNhanThanhCong) return;

        const kiemTra = async () => {
            try {
                const res = await ThanhToanService.kiemTraTrangThai(orderCode);
                if (res && res.da_thanh_toan) {
                    setDaXacNhanThanhCong(true);
                    if (pollingRef.current) clearInterval(pollingRef.current);
                    if (timerRef.current) clearInterval(timerRef.current);
                    toast.success('🎉 Thanh toán thành công! Hệ thống đang cập nhật...');
                    setTimeout(() => {
                        onThanhToanThanhCong({
                            ...donHang,
                            da_thanh_toan: true,
                            trang_thai_thanh_toan: 'da_thanh_toan'
                        });
                    }, 1000);
                }
            } catch (err) {
                // Polling lặp lại trong im lặng
            }
        };

        pollingRef.current = setInterval(kiemTra, 2500);

        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
    }, [orderCode, daXacNhanThanhCong, donHang, onThanhToanThanhCong]);

    // Định dạng mm:ss
    const phut = Math.floor(giayConLai / 60);
    const giay = giayConLai % 60;
    const chuoiThoiGian = `${String(phut).padStart(2, '0')}:${String(giay).padStart(2, '0')}`;

    // Hàm copy với visual feedback
    const saoChep = (khoa, noiDung) => {
        navigator.clipboard.writeText(String(noiDung));
        setDaSaoChep(prev => ({ ...prev, [khoa]: true }));
        toast.success(`Đã sao chép: ${noiDung}`);
        setTimeout(() => {
            setDaSaoChep(prev => ({ ...prev, [khoa]: false }));
        }, 2000);
    };

    // Kiểm tra thanh toán thủ công khi bấm nút
    const kiemTraThuCong = async () => {
        if (dangKiemTra) return;
        setDangKiemTra(true);
        try {
            const res = await ThanhToanService.kiemTraTrangThai(orderCode);
            if (res && res.da_thanh_toan) {
                setDaXacNhanThanhCong(true);
                toast.success('🎉 Xác nhận thanh toán thành công!');
                setTimeout(() => {
                    onThanhToanThanhCong({
                        ...donHang,
                        da_thanh_toan: true,
                        trang_thai_thanh_toan: 'da_thanh_toan'
                    });
                }, 1000);
            } else {
                toast.info('Hệ thống chưa ghi nhận tiền về từ ngân hàng. Quý khách vui lòng kiểm tra đã chuyển khoản trên app chưa nhé!');
            }
        } catch (err) {
            toast.error('Lỗi khi kiểm tra trạng thái thanh toán.');
        } finally {
            setDangKiemTra(false);
        }
    };

    if (!mounted || typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
            {/* Backdrop làm mờ toàn màn hình 100%, bao trọn toàn bộ topbar, navbar và footer */}
            <div 
                onClick={onDong} 
                className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity animate-in fade-in"
            />

            {/* Modal Container: Kích thước phóng to max-w-3xl rộng rãi, đẹp mắt, vừa vặn 1 màn hình */}
            <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl z-10 overflow-y-auto animate-in zoom-in-95 duration-200 my-auto">
                {/* Header Gradient Xanh Hoàng Gia Tươi Sáng */}
                <div className="bg-gradient-to-r from-[#0052cc] via-blue-600 to-indigo-600 p-4 sm:p-5 text-white relative">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold border border-white/30 shadow-xs">
                                <QrCode className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">
                                    QUÉT MÃ VIETQR ĐỂ THANH TOÁN
                                </h3>
                                <p className="text-xs sm:text-sm text-white/90">
                                    Đơn hàng: <span className="font-mono font-bold text-yellow-300">#{donHang?.ma_don_hang}</span>
                                </p>
                            </div>
                        </div>

                        {/* Nút đóng */}
                        <button
                            type="button"
                            onClick={onDong}
                            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Đóng popup"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Thanh đồng hồ đếm ngược SIÊU NỔI BẬT (Tone Vàng Rực Rỡ & Đồng Hồ LED Điện Tử) */}
                    <div className={`mt-3 flex items-center justify-between px-3.5 sm:px-4 py-2.5 rounded-2xl transition-all shadow-md ${
                        giayConLai < 180 
                            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white shadow-red-500/30 border-2 border-red-400 animate-pulse' 
                            : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 shadow-amber-500/25 border-2 border-yellow-200'
                    }`}>
                        <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                                giayConLai < 180 ? 'bg-white text-red-600 animate-bounce' : 'bg-slate-950 text-amber-300'
                            }`}>
                                <Clock className="w-4.5 h-4.5 stroke-[2.8]" />
                            </div>
                            <div className="min-w-0">
                                <div className={`text-xs sm:text-sm font-black uppercase tracking-tight truncate ${
                                    giayConLai < 180 ? 'text-white' : 'text-slate-950'
                                }`}>
                                    Thời gian giữ đơn & thanh toán còn lại:
                                </div>
                                <div className={`text-[10.5px] font-bold hidden sm:block truncate ${
                                    giayConLai < 180 ? 'text-red-100' : 'text-slate-800'
                                }`}>
                                    Vui lòng hoàn tất chuyển khoản trước khi đồng hồ về 00:00
                                </div>
                            </div>
                        </div>

                        {/* Hộp số đếm ngược cực to kiểu LED điện tử */}
                        <div className={`flex items-center gap-1.5 px-3.5 py-1 sm:py-1.5 rounded-xl border-2 shadow-inner font-mono font-black text-base sm:text-xl tracking-widest shrink-0 ${
                            giayConLai < 180 
                                ? 'bg-white text-red-600 border-white animate-bounce' 
                                : 'bg-slate-950 text-yellow-300 border-yellow-200'
                        }`}>
                            <span>{chuoiThoiGian}</span>
                        </div>
                    </div>
                </div>

                {/* Body Content - Phóng to vừa vặn & Dễ đọc */}
                <div className="p-4 sm:p-6 space-y-4">
                    {/* Trạng thái hết hạn hoặc thành công */}
                    {giayConLai === 0 && (
                        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2.5">
                            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-500" />
                            <div className="flex-1 text-xs">
                                Đã hết 15 phút chờ. Quý khách bấm &quot;Gia Hạn&quot; để tiếp tục thanh toán đơn này.
                            </div>
                            <button
                                type="button"
                                onClick={() => setGiayConLai(15 * 60)}
                                className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 shrink-0 cursor-pointer shadow-sm"
                            >
                                Gia Hạn 15 Phút
                            </button>
                        </div>
                    )}

                    {daXacNhanThanhCong && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                            <div className="font-bold text-sm">
                                Đã xác nhận thanh toán thành công! Đang chuyển hướng...
                            </div>
                        </div>
                    )}

                    {/* Grid 2 cột: Cột QR Phóng To & Cột Bảng Thông Tin KienlongBank */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                        {/* Cột Trái: Ảnh QR To Rõ, Quét 1 Giây Nhận Ngay */}
                        <div className="sm:col-span-5 flex flex-col items-center text-center space-y-2">
                            <div className="relative p-3 rounded-2xl bg-white border-2 border-blue-400 dark:border-cyan-400 shadow-lg shadow-blue-500/15">
                                {/* Khung góc định vị QR */}
                                <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#0052cc] rounded-tl pointer-events-none" />
                                <div className="absolute top-1.5 right-1.5 w-4 h-4 border-t-2 border-r-2 border-[#0052cc] rounded-tr pointer-events-none" />
                                <div className="absolute bottom-1.5 left-1.5 w-4 h-4 border-b-2 border-l-2 border-[#0052cc] rounded-bl pointer-events-none" />
                                <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#0052cc] rounded-br pointer-events-none" />

                                <div className="relative w-48 h-48 sm:w-52 sm:h-52 overflow-hidden rounded-xl">
                                    <Image
                                        src={qrImageUrl}
                                        alt="Mã VietQR thanh toán KienlongBank 24/7"
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                    {/* Tia quét Laser Scan Line */}
                                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/80 animate-[scan_2.5s_ease-in-out_infinite] pointer-events-none" />
                                </div>
                            </div>

                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                                Mở app Ngân hàng bất kỳ để quét mã VietQR tự động
                            </p>
                        </div>

                        {/* Cột Phải: Bảng thông tin chuyển khoản Ngân Hàng Kiên Long */}
                        <div className="sm:col-span-7 space-y-3">
                            <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-4 space-y-3 text-xs sm:text-sm">
                                {/* Ngân hàng Kiên Long */}
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Ngân hàng thụ hưởng:</span>
                                    <strong className="text-slate-900 dark:text-white font-bold text-right text-xs sm:text-sm text-blue-700 dark:text-cyan-300">
                                        {bankInfo.nganHang}
                                    </strong>
                                </div>

                                {/* Số tài khoản */}
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Số tài khoản:</span>
                                    <div className="flex items-center gap-2">
                                        <strong className="font-mono text-sm sm:text-base font-black text-[#0052cc] dark:text-cyan-400 tracking-wider">
                                            {bankInfo.soTaiKhoan}
                                        </strong>
                                        <button
                                            type="button"
                                            onClick={() => saoChep('stk', bankInfo.soTaiKhoan)}
                                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#0052cc] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                        >
                                            {daSaoChep['stk'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            <span>{daSaoChep['stk'] ? 'Đã chép' : 'Sao chép'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Chủ tài khoản */}
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Chủ tài khoản:</span>
                                    <strong className="text-slate-900 dark:text-white font-black text-xs sm:text-sm uppercase tracking-wide">
                                        {bankInfo.chuTaiKhoan}
                                    </strong>
                                </div>

                                {/* Số tiền */}
                                <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs">Số tiền thanh toán:</span>
                                    <div className="flex items-center gap-2">
                                        <strong className="text-red-600 dark:text-rose-400 font-black text-base sm:text-xl font-mono">
                                            {dinhDangTienVND(bankInfo.soTien)}
                                        </strong>
                                        <button
                                            type="button"
                                            onClick={() => saoChep('tien', bankInfo.soTien)}
                                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#0052cc] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                        >
                                            {daSaoChep['tien'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            <span>{daSaoChep['tien'] ? 'Đã chép' : 'Sao chép'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Nội dung chuyển khoản */}
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 text-xs block">Nội dung CK:</span>
                                        <span className="text-[10px] text-amber-600 dark:text-amber-400 italic">
                                            * Giữ nguyên để tự động duyệt
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <strong className="font-mono text-xs sm:text-sm font-black px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-2 border-amber-300 dark:border-amber-800 tracking-wide">
                                            {bankInfo.noiDung}
                                        </strong>
                                        <button
                                            type="button"
                                            onClick={() => saoChep('noidung', bankInfo.noiDung)}
                                            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:text-[#0052cc] text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                                        >
                                            {daSaoChep['noidung'] ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                                            <span>{daSaoChep['noidung'] ? 'Đã chép' : 'Sao chép'}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Ghi chú tự động kiểm tra */}
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                                <span>Hệ thống tự động kích hoạt đơn hàng ngay khi tiền vào tài khoản.</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions: Nút Kiểm Tra & Đóng */}
                    <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            type="button"
                            onClick={kiemTraThuCong}
                            disabled={dangKiemTra}
                            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer disabled:opacity-70 active:scale-98"
                        >
                            {dangKiemTra ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Đang kiểm tra giao dịch...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    <span>TÔI ĐÃ CHUYỂN KHOẢN XONG - KIỂM TRA NGAY</span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={onDong}
                            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                        >
                            Thanh Toán Sau / Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
