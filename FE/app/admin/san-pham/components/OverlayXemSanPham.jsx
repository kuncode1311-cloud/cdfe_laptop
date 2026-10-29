'use client';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import TheSanPham from '@/components/san-pham/TheSanPham';
import BangThongSoKyThuat from '@/components/san-pham/BangThongSoKyThuat';
import ThuVienAnhSanPham from '@/components/san-pham/ThuVienAnhSanPham';
import KhoHangChiNhanh from '@/components/san-pham/KhoHangChiNhanh';
import {
    Check,
    CheckCircle2,
    ChevronRight,
    CreditCard,
    ExternalLink,
    Eye,
    FileText,
    GitCompare,
    Laptop,
    Layers,
    Palette,
    RotateCcw,
    ShieldCheck,
    ShoppingCart,
    Sparkles,
    Star,
    Truck,
    X,
} from 'lucide-react';

// Overlay Xem Trước (thẻ card & trang chi tiết) và Phóng To Ảnh của modal sản phẩm trong trang quản trị:
// tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện).
export default function OverlayXemSanPham({
    daSoSanhXemTruoc,
    dacDiemNoiBatXemTruoc,
    dangXemTruocCard,
    giaGocHienTaiXemTruoc,
    giaHienTaiXemTruoc,
    kieuXemTruoc,
    modalXemAnh,
    sanPhamXemTruoc,
    setDaSoSanhXemTruoc,
    setDangXemTruocCard,
    setKieuXemTruoc,
    setModalXemAnh,
    setTabChiTietXemTruoc,
    setTuyChonXemTruoc,
    tabChiTietXemTruoc,
    tienTietKiemXemTruoc,
    tuyChonHienTaiXemTruoc,
}) {
    return (
        <>
            {dangXemTruocCard && (
                <div
                    className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setDangXemTruocCard(false)}
                >
                    <div
                        className={`relative bg-white dark:bg-slate-900 rounded-3xl border-2 border-indigo-500/30 dark:border-indigo-500/30 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 animate-in zoom-in-95 ${
                            kieuXemTruoc === 'chi_tiet' ? 'w-full max-w-6xl' : 'w-full max-w-sm sm:max-w-md'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 1. Header Modal Xem Trước: Hiện Đại, Rõ Nét, Chuẩn Web Bán Lẻ */}
                        <div className="w-full p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-slate-50/90 dark:bg-slate-900/90 backdrop-blur-md">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                                    <Eye className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                                            {kieuXemTruoc === 'card' ? 'Xem Thẻ Card Sản Phẩm' : 'Xem Trang Chi Tiết Sản Phẩm'}
                                        </h4>
                                        <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 border border-blue-200 dark:border-blue-800">
                                            {kieuXemTruoc === 'card' ? 'Thẻ ngoài danh mục' : 'Trang chi tiết đầy đủ'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                        Giao diện khách hàng nhìn thấy thực tế ngoài website bán lẻ
                                    </p>
                                </div>
                            </div>

                            {/* Bộ chuyển đổi 2 chế độ xem trước */}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setKieuXemTruoc('card')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                            kieuXemTruoc === 'card'
                                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs border border-blue-200 dark:border-blue-800 scale-[1.02]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>1. Thẻ Card</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setKieuXemTruoc('chi_tiet')}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                                            kieuXemTruoc === 'chi_tiet'
                                                ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs border border-blue-200 dark:border-blue-800 scale-[1.02]'
                                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                                        }`}
                                    >
                                        <FileText className="w-3.5 h-3.5" />
                                        <span>2. Trang Chi Tiết</span>
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(false)}
                                    className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                                    title="Đóng xem trước"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* 2. Nội Dung Xem Trước (Cuộn Độc Lập) */}
                        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-100/70 dark:bg-slate-950/70 p-4 sm:p-6 space-y-6">
                            {kieuXemTruoc === 'card' ? (
                                /* CHẾ ĐỘ 1: XEM THẺ CARD SẢN PHẨM NGOÀI DANH MỤC */
                                <div className="py-8 flex flex-col items-center justify-center">
                                    <div className="relative max-w-[310px] sm:max-w-[330px] w-full">
                                        <TheSanPham sanPham={sanPhamXemTruoc} />
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-5 text-center max-w-md">
                                        💡 Đây là thẻ sản phẩm hiển thị trên Trang Chủ, Trang Danh Mục và Tìm Kiếm.
                                    </p>
                                </div>
                            ) : (
                                /* CHẾ ĐỘ 2: XEM TRANG CHI TIẾT SẢN PHẨM TOÀN DIỆN (1:1 VỚI BÁN LẺ) */
                                <div className="space-y-6">
                                    {/* Breadcrumb Điều Hướng */}
                                    <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
                                        <span className="flex items-center gap-1 font-medium">
                                            <Laptop className="w-3.5 h-3.5" />
                                            <span>Trang Chủ</span>
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span>Sản Phẩm</span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="uppercase font-bold text-[#0052cc] dark:text-cyan-400">
                                            {sanPhamXemTruoc.hang_san_xuat}
                                        </span>
                                        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                                        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
                                            {sanPhamXemTruoc.ten_san_pham}
                                        </span>
                                    </nav>

                                    {/* Khung Chi Tiết 2 Cột: Chuẩn Tỉ Lệ 5 - 7 */}
                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
                                        {/* CỘT TRÁI (5 Cột): Thư viện ảnh, 3 Cam kết vàng & Đặc điểm nổi bật */}
                                        <div className="lg:col-span-5 space-y-4">
                                            <ThuVienAnhSanPham
                                                danhSachAnh={sanPhamXemTruoc.thu_vien_hinh_anh}
                                                tenSanPham={sanPhamXemTruoc.ten_san_pham}
                                                videoDemo={sanPhamXemTruoc.video_demo}
                                                anhDaiDienTuyChon={tuyChonHienTaiXemTruoc?.hinh_anh}
                                            />

                                            {/* Cam kết Vàng Dưới Gallery */}
                                            <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-slate-600 dark:text-slate-400">
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">Chính Hãng 100%</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <RotateCcw className="w-4 h-4 text-blue-600 dark:text-cyan-400 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">1 Đổi 1 Trong 30N</span>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                                                    <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1" />
                                                    <span className="font-bold text-slate-800 dark:text-slate-200">Giao Hỏa Tốc 2H</span>
                                                </div>
                                            </div>

                                            {/* Đặc Điểm Nổi Bật Nằm Dưới Ảnh */}
                                            {dacDiemNoiBatXemTruoc.length > 0 && (
                                                <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
                                                    <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                                                        <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0052cc] dark:text-cyan-400">
                                                            <Sparkles className="w-3.5 h-3.5" />
                                                        </div>
                                                        <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                                            Đặc Điểm Nổi Bật Đáng Chú Ý
                                                        </h3>
                                                    </div>
                                                    <div className="space-y-2">
                                                        {dacDiemNoiBatXemTruoc.map((dd, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] dark:bg-cyan-400 mt-1.5 shrink-0" />
                                                                <span className="font-medium">{dd}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* CỘT PHẢI (7 Cột): Thông tin mua hàng, Giá, Cấu hình, Quà tặng, Chi nhánh */}
                                        <div className="lg:col-span-7 space-y-4">
                                            {/* Tên & Mã Sản Phẩm */}
                                            <div className="space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-lg bg-[#0052cc] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                                                        {sanPhamXemTruoc.hang_san_xuat}
                                                    </span>
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                                                        SKU: {sanPhamXemTruoc.ma_san_pham || 'CHÍNH HÃNG'}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 ml-auto text-xs">
                                                        <div className="flex items-center gap-0.5 text-amber-500">
                                                            <Star className="w-4 h-4 fill-amber-400" />
                                                            <span className="font-black text-slate-800 dark:text-slate-100">{sanPhamXemTruoc.diem_danh_gia_tb || 5}</span>
                                                        </div>
                                                        <span className="text-slate-400">({sanPhamXemTruoc.so_luong_danh_gia || 16} đánh giá)</span>
                                                        <span className="text-slate-300 dark:text-slate-700">•</span>
                                                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                                                            {sanPhamXemTruoc.con_hang ? 'Còn hàng trong kho' : 'Hết hàng'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
                                                    {sanPhamXemTruoc.ten_san_pham}
                                                </h1>
                                            </div>

                                            {/* Hộp Giá Bán & Tiết Kiệm */}
                                            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-50/60 via-slate-50/40 to-transparent dark:from-red-950/20 dark:via-slate-900/40 dark:to-transparent border border-red-200/80 dark:border-red-900/30 flex flex-wrap items-center justify-between gap-3">
                                                <div className="flex flex-wrap items-baseline gap-3">
                                                    <div className="text-2xl sm:text-3xl font-black text-[#dc2626] dark:text-[#f87171] tracking-tight">
                                                        {dinhDangTienVND(giaHienTaiXemTruoc)}
                                                    </div>

                                                    {giaGocHienTaiXemTruoc > giaHienTaiXemTruoc && (
                                                        <>
                                                            <div className="text-sm text-slate-400 line-through font-normal">
                                                                {dinhDangTienVND(giaGocHienTaiXemTruoc)}
                                                            </div>
                                                            <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs shadow-xs">
                                                                -{sanPhamXemTruoc.phan_tram_giam_gia || Math.round((1 - (giaHienTaiXemTruoc / giaGocHienTaiXemTruoc)) * 100)}%
                                                            </span>
                                                        </>
                                                    )}
                                                </div>

                                                {tienTietKiemXemTruoc > 0 && (
                                                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                                        Tiết kiệm {dinhDangTienVND(tienTietKiemXemTruoc)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chọn Phiên Bản Cấu Hình / Màu Sắc (Tương tác cập nhật giá trực tiếp) */}
                                            {sanPhamXemTruoc.tuy_chon_phien_ban && sanPhamXemTruoc.tuy_chon_phien_ban.length > 0 && (
                                                <div className="space-y-2">
                                                    <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                                                        <span>TÙY CHỌN PHIÊN BẢN & CẤU HÌNH:</span>
                                                        <span className="text-[11px] font-normal text-slate-400 lowercase">{sanPhamXemTruoc.tuy_chon_phien_ban.length} lựa chọn</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                        {sanPhamXemTruoc.tuy_chon_phien_ban.map((opt, oIdx) => {
                                                            const laChon = tuyChonHienTaiXemTruoc?.ma_tuy_chon
                                                                ? tuyChonHienTaiXemTruoc.ma_tuy_chon === opt.ma_tuy_chon
                                                                : (tuyChonHienTaiXemTruoc?.ten_tuy_chon === opt.ten_tuy_chon || oIdx === 0);
                                                            return (
                                                                <button
                                                                    key={opt.ma_tuy_chon || oIdx}
                                                                    type="button"
                                                                    onClick={() => setTuyChonXemTruoc(opt)}
                                                                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                                                                        laChon
                                                                            ? 'border-[#0052cc] bg-blue-50/60 dark:bg-blue-950/40 text-[#0052cc] ring-2 ring-blue-500/20 shadow-xs'
                                                                            : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 bg-white dark:bg-slate-900/60'
                                                                    }`}
                                                                >
                                                                    <div className="font-bold text-xs flex items-center justify-between gap-2">
                                                                        <span className={laChon ? 'text-[#0052cc] dark:text-cyan-400' : 'text-slate-900 dark:text-white'}>
                                                                            {opt.ten_tuy_chon}
                                                                        </span>
                                                                        {laChon && <Check className="w-4 h-4 text-[#0052cc] dark:text-cyan-400 shrink-0" />}
                                                                    </div>
                                                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                                                                        {Number(opt.chenh_lech_gia) === 0
                                                                            ? 'Giá niêm yết chuẩn'
                                                                            : Number(opt.chenh_lech_gia) > 0
                                                                            ? `+${dinhDangTienVND(opt.chenh_lech_gia)}`
                                                                            : `${dinhDangTienVND(opt.chenh_lech_gia)}`}
                                                                    </div>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Các Nút Mua Hàng Nhanh */}
                                            <div className="space-y-2.5 pt-1">
                                                {/* Nút MUA NGAY */}
                                                <div className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#dc2626] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 select-none cursor-default">
                                                    <span>MUA NGAY - GIAO HỎA TỐC 2H</span>
                                                </div>

                                                {/* Cặp Nút: Thêm Giỏ Hàng & Trả Góp 0% */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                                    <div className="py-2.5 px-4 rounded-xl bg-[#0052cc] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm select-none cursor-default">
                                                        <ShoppingCart className="w-4 h-4" />
                                                        <span>THÊM VÀO GIỎ HÀNG</span>
                                                    </div>

                                                    <div className="py-2.5 px-4 rounded-xl bg-slate-900 text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 text-center select-none cursor-default">
                                                        <CreditCard className="w-4 h-4 text-amber-400" />
                                                        <span>MUA TRẢ GÓP 0% LÃI SUẤT</span>
                                                    </div>
                                                </div>

                                                {/* Nút So Sánh Nhanh */}
                                                <div className="flex items-center gap-2.5 pt-0.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setDaSoSanhXemTruoc(!daSoSanhXemTruoc)}
                                                        className={`w-full py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                                                            daSoSanhXemTruoc
                                                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-[#0052cc] dark:text-cyan-400'
                                                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                                                        }`}
                                                    >
                                                        <GitCompare className="w-3.5 h-3.5 text-[#0052cc] dark:text-cyan-400" />
                                                        <span>{daSoSanhXemTruoc ? 'Đã Trong So Sánh' : 'So Sánh Sản Phẩm'}</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Tình Trạng Hàng Tại Showroom */}
                                            <KhoHangChiNhanh danhSachKho={sanPhamXemTruoc.ton_kho} />
                                        </div>
                                    </div>

                                    {/* Tabs Dưới: Mô tả | Thông số kỹ thuật | Đánh giá */}
                                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                                        <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('tong_quan')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'tong_quan'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Mô tả
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('thong_so')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'thong_so'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Thông số kỹ thuật
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setTabChiTietXemTruoc('danh_gia')}
                                                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                                                    tabChiTietXemTruoc === 'danh_gia'
                                                        ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                Đánh giá ({sanPhamXemTruoc.so_luong_danh_gia || 16})
                                            </button>
                                        </div>

                                        {tabChiTietXemTruoc === 'tong_quan' && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                                                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                                                    <Sparkles className="w-4 h-4 text-[#0052cc] dark:text-cyan-400" />
                                                    <span>Trải Nghiệm & Đánh Giá Chuyên Sâu Từ TNTP LAPTOP</span>
                                                </h3>
                                                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed whitespace-pre-line">
                                                    {sanPhamXemTruoc.mo_ta_chi_tiet || 'Sản phẩm chính hãng với cấu hình mạnh mẽ, hiệu năng xuất sắc và độ bền bỉ cao đáp ứng trọn vẹn mọi nhu cầu làm việc và giải trí.'}
                                                </p>
                                                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
                                                    <p className="font-bold">✦ Đặc quyền cam kết chất lượng dịch vụ TNTP:</p>
                                                    <p>
                                                        Toàn bộ thiết bị đều trải qua quy trình kiểm định 18 bước tiêu chuẩn trước khi tới tay khách hàng. Đổi mới 1-1 trong 30 ngày nếu phát sinh lỗi phần cứng, bảo hành chính hãng 24 tháng kèm dịch vụ bảo dưỡng, vệ sinh trọn đời trên toàn quốc.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {tabChiTietXemTruoc === 'thong_so' && (
                                            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 p-2 sm:p-4 bg-white dark:bg-slate-900 shadow-2xs">
                                                <BangThongSoKyThuat thongSo={sanPhamXemTruoc.thong_so} sanPham={sanPhamXemTruoc} />
                                            </div>
                                        )}

                                        {tabChiTietXemTruoc === 'danh_gia' && (
                                            <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-4 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                                                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                                                    <h4 className="font-black text-sm text-slate-900 dark:text-white uppercase">
                                                        Đánh Giá Thực Tế Từ Khách Hàng ({sanPhamXemTruoc.danh_gia?.length || 2})
                                                    </h4>
                                                    <div className="flex items-center gap-1 text-amber-500 font-black text-xs">
                                                        <Star className="w-4 h-4 fill-amber-400" />
                                                        <span>{sanPhamXemTruoc.diem_danh_gia_tb || 5} / 5</span>
                                                    </div>
                                                </div>
                                                <div className="space-y-3">
                                                    {(sanPhamXemTruoc.danh_gia || []).map((dg, idx) => (
                                                        <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-bold text-slate-900 dark:text-slate-100">{dg.ten_nguoi_dung}</span>
                                                                <span className="text-[11px] text-slate-400">{dg.ngay_danh_gia || 'Gần đây'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 text-amber-400">
                                                                {[...Array(dg.so_sao || 5)].map((_, i) => (
                                                                    <Star key={i} className="w-3 h-3 fill-amber-400" />
                                                                ))}
                                                            </div>
                                                            <p className="font-bold text-slate-800 dark:text-slate-200">{dg.tieu_de}</p>
                                                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{dg.noi_dung}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. Footer Modal Xem Trước */}
                        <div className="w-full px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-900 shrink-0">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Giao diện đang phản ánh chính xác các thông tin và thông số bạn vừa cập nhật</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDangXemTruocCard(false)}
                                    className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-black text-slate-700 dark:text-slate-300 cursor-pointer transition-all active:scale-95"
                                >
                                    Quay Lại Chỉnh Sửa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {modalXemAnh && (
                <div
                    className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
                    onClick={() => setModalXemAnh(null)}
                >
                    <div
                        className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/70 dark:bg-slate-800/40">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-black uppercase">
                                        {modalXemAnh.hang || 'Sản Phẩm'}
                                    </span>
                                    <span className="font-mono text-xs font-bold text-slate-400">
                                        {modalXemAnh.sku}
                                    </span>
                                </div>
                                <h3 className="font-black text-sm text-slate-900 dark:text-white truncate mt-0.5">
                                    {modalXemAnh.ten}
                                </h3>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {modalXemAnh.gia > 0 && (
                                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                                        {dinhDangTienVND(modalXemAnh.gia)}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setModalXemAnh(null)}
                                    className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 flex items-center justify-center text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Image Preview Container with high-res viewport */}
                        <div className="relative flex-1 bg-gradient-to-b from-slate-100 to-white dark:from-slate-950 dark:to-slate-900 p-6 flex items-center justify-center min-h-[320px] max-h-[500px] overflow-hidden">
                            <img
                                src={modalXemAnh.url}
                                alt={modalXemAnh.ten}
                                className="max-h-full max-w-full object-contain drop-shadow-2xl transition-transform duration-300 hover:scale-105"
                                onError={(e) => { e.currentTarget.src = '/images/sp/asus_rog_scar18.jpg'; }}
                            />
                        </div>

                        {/* Variant Switcher if product has colors/variants */}
                        {modalXemAnh.variants && modalXemAnh.variants.length > 0 && (
                            <div className="p-3.5 px-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
                                <div className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                                    <Palette className="w-3.5 h-3.5 text-purple-600" />
                                    <span>Chọn màu sắc / biến thể để xem ảnh riêng ({modalXemAnh.variants.length} màu):</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {modalXemAnh.variants.map((v, i) => (
                                        <button
                                            key={v.ma_tuy_chon || i}
                                            type="button"
                                            onClick={() => {
                                                if (v.hinh_anh) {
                                                    setModalXemAnh({ ...modalXemAnh, url: v.hinh_anh, tenBienThe: v.ten_tuy_chon });
                                                }
                                            }}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                                                modalXemAnh.url === v.hinh_anh
                                                    ? 'bg-purple-600 text-white border-purple-700 shadow-xs'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-purple-400'
                                            }`}
                                        >
                                            {v.hinh_anh && (
                                                <img src={v.hinh_anh} alt="" className="w-4 h-4 rounded-full object-cover shrink-0" />
                                            )}
                                            <span>{v.ten_tuy_chon}</span>
                                            {v.chenh_lech_gia !== 0 && (
                                                <span className="text-[10px] opacity-80">
                                                    ({v.chenh_lech_gia > 0 ? '+' : ''}{dinhDangTienVND(v.chenh_lech_gia)})
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Controls */}
                        <div className="p-3 px-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-slate-400 font-medium">
                                Phóng to chi tiết ảnh sản phẩm
                            </span>
                            <div className="flex items-center gap-2">
                                <a
                                    href={modalXemAnh.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-1.5 transition-colors"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Mở ảnh gốc</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={() => setModalXemAnh(null)}
                                    className="px-4 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:opacity-90 transition-opacity"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
