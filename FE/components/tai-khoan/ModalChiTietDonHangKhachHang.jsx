'use client';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import {
    FileText,
    X,
    Clock,
    Truck,
    Check,
    Copy,
    User,
    MapPin,
    CreditCard,
    PackageCheck,
    RotateCcw,
    Ticket,
    QrCode,
    Printer,
    ExternalLink,
    ShieldCheck
} from 'lucide-react';

// Modal Chi tiết đơn hàng (xem từ phía khách hàng) của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalChiTietDonHangKhachHang({
    daGanKetDOM,
    donHangDangXemChiTiet,
    setDonHangDangXemChiTiet,
    layThoiGianDonHang,
    saoChepMaVanDon,
    daSaoChepVanDon,
    tinhTienDoPhanTramDonHang,
    layDuongDanSanPham,
    layGiaSanPhamDonHang,
    layDonGiaSanPham,
    layHinhAnhSanPhamDonHang,
    xuLyMuaLai,
    kiemTraChuaThanhToan,
    setDonHangThanhToanQR
}) {
    if (!(daGanKetDOM && typeof document !== 'undefined' && donHangDangXemChiTiet)) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[999999] bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150"
            onClick={() => setDonHangDangXemChiTiet(null)}
        >
            <div
                className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-2xl border-2 border-slate-300 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-slate-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* 1. Modal Header Tinh Gọn (Gọn gàng, không choán diện tích màn hình) */}
                <div className="shrink-0 px-4 py-2.5 sm:px-5 sm:py-3 bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white border-b border-blue-800/60 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/30 text-amber-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap leading-tight">
                                <span className="text-[11px] font-bold text-blue-200 uppercase tracking-wide">Chi Tiết Đơn Hàng</span>
                                <span className={`px-2 py-0.2 rounded-full text-[10px] font-black border ${
                                    donHangDangXemChiTiet.trang_thai === 'da_giao'
                                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                                        : donHangDangXemChiTiet.trang_thai === 'dang_giao'
                                        ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                                        : donHangDangXemChiTiet.trang_thai === 'da_huy'
                                        ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                                        : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                }`}>
                                    {donHangDangXemChiTiet.trang_thai === 'da_giao' ? 'Giao Thành Công' : donHangDangXemChiTiet.trang_thai === 'dang_giao' ? 'Đang Vận Chuyển' : donHangDangXemChiTiet.trang_thai === 'da_huy' ? 'Đã Hủy Đơn' : 'Đang Đóng Gói'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-xs">
                                <span className="font-mono font-black text-amber-300">#{donHangDangXemChiTiet.ma_don_hang}</span>
                                <span className="text-white/40">•</span>
                                <span className="text-slate-300 text-[11px] flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-amber-400" />
                                    <span>{layThoiGianDonHang(donHangDangXemChiTiet) || 'Theo hệ thống'}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDonHangDangXemChiTiet(null)}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                        title="Đóng"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. Modal Body Cuộn Trơn Tru (Không bao giờ bị che nội dung) */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5">
                    {/* Thanh Thông Tin Vận Chuyển Tinh Gọn 1 Dòng */}
                    <div className="px-3 py-2 rounded-xl bg-blue-50/80 border border-blue-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
                                <Truck className="w-3 h-3" />
                            </div>
                            <span className="font-bold text-slate-800">Viettel Post Express:</span>
                            <span className="font-mono font-bold text-blue-700 bg-white px-1.5 py-0.2 rounded border border-blue-200 text-[11px]">
                                {donHangDangXemChiTiet.ma_van_don || 'Đang cập nhật'}
                            </span>
                            {donHangDangXemChiTiet.ma_van_don && (
                                <button
                                    type="button"
                                    onClick={() => saoChepMaVanDon(donHangDangXemChiTiet.ma_van_don)}
                                    className="text-[10.5px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer flex items-center gap-0.5"
                                >
                                    {daSaoChepVanDon ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                                    <span>{daSaoChepVanDon ? 'Đã chép' : 'Chép'}</span>
                                </button>
                            )}
                        </div>
                        <span className="text-[11px] font-black text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full border border-blue-300">
                            {donHangDangXemChiTiet.trang_thai === 'da_huy' ? 'Đã hủy' : `Tiến độ: ${tinhTienDoPhanTramDonHang(donHangDangXemChiTiet)}%`}
                        </span>
                    </div>

                    {/* Lưới 2 Cột: Người Nhận & Thanh Toán */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* Cột 1: Người nhận */}
                        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                            <div className="font-black text-blue-800 text-[11.5px] flex items-center gap-1.5 uppercase tracking-wide">
                                <User className="w-3.5 h-3.5 text-blue-600" />
                                <span>Người Nhận Hàng</span>
                            </div>
                            <div className="space-y-1 text-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-[11px]">Họ tên:</span>
                                    <strong className="text-slate-900 font-bold">
                                        {donHangDangXemChiTiet.thong_tin_giao_hang?.ho_ten || donHangDangXemChiTiet.thong_tin_giao_hang?.ho_va_ten || 'Khách Hàng TNTP'}
                                    </strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-[11px]">Điện thoại:</span>
                                    <strong className="text-slate-900 font-mono font-bold">
                                        {donHangDangXemChiTiet.thong_tin_giao_hang?.so_dien_thoai || '0988666555'}
                                    </strong>
                                </div>
                                <div className="flex items-start gap-1 pt-1 border-t border-slate-200 text-[11px]">
                                    <MapPin className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-800 leading-snug line-clamp-2">
                                        {[
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi_chi_tiet ||
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi_cu_the ||
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.dia_chi,
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.phuong_xa,
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.quan_huyen,
                                            donHangDangXemChiTiet.thong_tin_giao_hang?.tinh_thanh
                                        ].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cột 2: Thanh toán */}
                        <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                            <div className="font-black text-indigo-800 text-[11.5px] flex items-center gap-1.5 uppercase tracking-wide">
                                <CreditCard className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Thanh Toán & Chứng Từ</span>
                            </div>
                            <div className="space-y-1 text-slate-700">
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-[11px]">Phương thức:</span>
                                    <strong className="text-slate-900 font-bold text-[11.5px]">
                                        {(donHangDangXemChiTiet.hinh_thuc_thanh_toan === 'vnpay' || donHangDangXemChiTiet.phuong_thuc_thanh_toan === 'vnpay')
                                            ? 'Cổng VNPAY QR'
                                            : (donHangDangXemChiTiet.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr')
                                            ? 'Chuyển khoản VietQR'
                                            : 'Tiền mặt (COD)'}
                                    </strong>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 text-[11px]">Trạng thái:</span>
                                    {donHangDangXemChiTiet.da_thanh_toan ? (
                                        <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10.5px] border border-emerald-300">
                                            Đã thanh toán đủ
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.2 rounded-full bg-amber-100 text-amber-800 font-bold text-[10.5px] border border-amber-300">
                                            Thu tiền khi nhận máy
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 pt-1 border-t border-slate-200 text-[10.5px] text-emerald-700 font-bold">
                                    <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                                    <span>Hóa đơn điện tử VAT hợp lệ 100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Danh Sách Sản Phẩm (Gọn gàng) */}
                    <div className="space-y-1.5">
                        <div className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                                <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
                                <span>Sản phẩm trong đơn ({donHangDangXemChiTiet.danh_sach_san_pham?.length || 0})</span>
                            </span>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200 font-bold">
                                Bảo hành 24-36T
                            </span>
                        </div>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                            {donHangDangXemChiTiet.danh_sach_san_pham?.map((sp, idx) => {
                                const duongDanSP = layDuongDanSanPham(sp);
                                const giaTongMuc = layGiaSanPhamDonHang(sp);
                                const donGia = layDonGiaSanPham(sp);

                                return (
                                    <div key={idx} className="p-2 sm:p-2.5 flex items-center gap-3 text-xs hover:bg-slate-50/70 transition-colors">
                                        <Link
                                            href={duongDanSP}
                                            className="w-11 h-11 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-200 p-0.5 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                                            title="Bấm để xem sản phẩm"
                                        >
                                            <img
                                                src={layHinhAnhSanPhamDonHang(sp)}
                                                alt=""
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = '/images/sp/lenovo_legion_pro7.jpg';
                                                }}
                                                className="w-full h-full object-contain"
                                            />
                                        </Link>
                                        <div className="flex-1 min-w-0">
                                            <Link
                                                href={duongDanSP}
                                                className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-xs line-clamp-1 block cursor-pointer"
                                                title="Bấm để xem chi tiết sản phẩm và mua lại"
                                            >
                                                {sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop TNTP Gaming'}
                                            </Link>
                                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                                                <span className="text-slate-700 font-bold">SL: {sp.so_luong || 1}</span>
                                                {sp.tuy_chon_chon?.ten_tuy_chon && (
                                                    <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100 text-[10px]">
                                                        {sp.tuy_chon_chon?.ten_tuy_chon}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <div className="text-right">
                                                <div className="font-black text-rose-600 text-xs sm:text-sm font-mono whitespace-nowrap">
                                                    {dinhDangTienVND(giaTongMuc)}
                                                </div>
                                                {(sp.so_luong || 1) > 1 && donGia > 0 && (
                                                    <div className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                                        {dinhDangTienVND(donGia)}/máy
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => xuLyMuaLai(e, sp)}
                                                className="p-1 sm:px-2 sm:py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10.5px] font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                                title="Thêm máy này vào giỏ hàng"
                                            >
                                                <RotateCcw className="w-3 h-3 text-amber-600" />
                                                <span className="hidden sm:inline">Mua lại</span>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bảng Kê Chi Phí & Tổng Thanh Toán (Luôn hiện rõ, không bị che) */}
                    <div className="p-2.5 sm:p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-600">
                            <span>Tạm tính tiền hàng:</span>
                            <span className="font-mono font-bold text-slate-800">
                                {dinhDangTienVND(donHangDangXemChiTiet.tam_tinh || donHangDangXemChiTiet.tong_tien || 0)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-600">
                            <span>Phí giao hàng:</span>
                            <span className="font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded text-[10.5px]">
                                Miễn phí giao hàng hỏa tốc (0₫)
                            </span>
                        </div>
                        {(donHangDangXemChiTiet.tien_giam_gia > 0 || donHangDangXemChiTiet.giam_gia_voucher > 0) && (
                            <div className="flex items-center justify-between text-slate-600">
                                <span className="flex items-center gap-1">
                                    <Ticket className="w-3 h-3 text-rose-500" />
                                    <span>Giảm giá Voucher:</span>
                                    {donHangDangXemChiTiet.ma_giam_gia && (
                                        <span className="font-mono font-black text-rose-600 bg-rose-50 px-1 py-0.2 rounded border border-rose-200 text-[10px]">
                                            {donHangDangXemChiTiet.ma_giam_gia}
                                        </span>
                                    )}
                                </span>
                                <span className="font-bold text-rose-600 font-mono">
                                    -{dinhDangTienVND(donHangDangXemChiTiet.tien_giam_gia || donHangDangXemChiTiet.giam_gia_voucher || 0)}
                                </span>
                            </div>
                        )}
                        <div className="pt-1.5 border-t border-amber-200/90 flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wide">
                                Tổng Tiền Thanh Toán:
                            </span>
                            <span className="text-base sm:text-lg font-black text-rose-600 font-mono">
                                {dinhDangTienVND(donHangDangXemChiTiet.tong_tien_thanh_toan || donHangDangXemChiTiet.tong_tien || 0)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 3. Modal Footer Cố Định (Gọn gàng, không đè lên nội dung) */}
                <div className="shrink-0 px-4 py-2 sm:px-5 sm:py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        {kiemTraChuaThanhToan(donHangDangXemChiTiet) && (
                            <button
                                type="button"
                                onClick={() => {
                                    const dh = donHangDangXemChiTiet;
                                    setDonHangDangXemChiTiet(null);
                                    setDonHangThanhToanQR(dh);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-black transition-all cursor-pointer shadow-sm animate-pulse border border-amber-600"
                                title="Mở mã QR KienlongBank để thanh toán ngay"
                            >
                                <QrCode className="w-3.5 h-3.5 shrink-0" />
                                <span>Tiếp tục thanh toán</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                            title="In hóa đơn"
                        >
                            <Printer className="w-3.5 h-3.5 text-blue-600" />
                            <span>In Hóa Đơn</span>
                        </button>
                        <Link
                            href={`/don-hang?ma_don=${donHangDangXemChiTiet.ma_don_hang}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 hover:border-blue-400 text-blue-700 text-xs font-bold transition-all"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Tra cứu</span>
                        </Link>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDonHangDangXemChiTiet(null)}
                        className="px-5 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 text-center"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
