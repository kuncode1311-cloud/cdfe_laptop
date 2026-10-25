'use client';
import Link from 'next/link';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import {
    PackageCheck,
    Search,
    RefreshCw,
    ShoppingBag,
    ArrowRight,
    Package,
    Calendar,
    Check,
    Copy,
    ShieldCheck,
    Clock,
    Eye,
    X,
    QrCode,
    RotateCcw,
    ChevronDown,
    AlertCircle,
    Truck,
    CheckCircle2
} from 'lucide-react';

// Tab "Đơn Hàng Của Tôi & Tiến Độ Giao Hàng" của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function LichSuDonHang({
    CAC_TAB_TRANG_THAI_DON,
    boLocTrangThaiDon,
    setBoLocTrangThaiDon,
    soLuongTheoTrangThai,
    dangTaiDonHang,
    donHangDaLoc,
    danhSachDonHang,
    layChiTietTrangThaiDon,
    layDuongDanSanPham,
    layGiaSanPhamDonHang,
    layDonGiaSanPham,
    layHinhAnhSanPhamDonHang,
    danhSachMoTimeline,
    saoChepMaVanDon,
    daSaoChepVanDon,
    tinhTienDoPhanTramDonHang,
    layCacBuocDonHang,
    setDonHangDangXemChiTiet,
    xuLyKhachHuyDon,
    donDangHuy,
    kiemTraChuaThanhToan,
    setDonHangThanhToanQR,
    xuLyMuaLaiToanBoDon,
    toggleTimeline,
    layThoiGianDonHang
}) {
    return (
        <div className="rounded-3xl bg-white border-2 border-amber-300 shadow-xl overflow-hidden">
            {/* Ribbon Header Đơn Hàng Sặc Sỡ & Nổi Bật (Tinh gọn 1 màn hình) */}
            <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 p-4 sm:p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-amber-500 shadow-md">
                <div>
                    <h2 className="text-lg sm:text-xl font-black flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center shrink-0 shadow-inner">
                            <PackageCheck className="w-5 h-5 text-amber-100" />
                        </div>
                            <span>Đơn Hàng Của Tôi & Tiến Độ Giao Hàng</span>
                    </h2>
                    <p className="text-xs text-amber-100 mt-1 font-semibold">
                        Cập nhật thời gian thực từng khâu đóng gói niêm phong và bàn giao hỏa tốc.
                    </p>
                </div>

                <Link
                    href="/don-hang"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-amber-200 bg-white hover:bg-amber-50 text-amber-800 text-xs font-black shadow-sm hover:shadow-md transition-all self-start sm:self-auto"
                >
                    <Search className="w-3.5 h-3.5 text-orange-600" />
                    <span>Tra cứu mã khác</span>
                </Link>
            </div>

            <div className="p-4 sm:p-5 space-y-4">
                {/* Thanh Tab Bộ Lọc Trạng Thái Đơn Hàng: Vuốt ngang mượt mà trên mobile, dàn đều grid 6 cột trên tablet/desktop */}
                <div className="bg-slate-100 p-1 sm:p-1.5 rounded-xl border border-slate-300 shadow-2xs">
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full py-0.5 px-0.5 sm:grid sm:grid-cols-6 sm:gap-1.5">
                        {CAC_TAB_TRANG_THAI_DON.map((tab) => {
                            const isActive = boLocTrangThaiDon === tab.id;
                            const count = soLuongTheoTrangThai[tab.id] || 0;
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setBoLocTrangThaiDon(tab.id)}
                                    className={`py-2 px-3 sm:px-1.5 rounded-lg font-black text-[11px] sm:text-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-1 select-none active:scale-95 text-center shrink-0 sm:shrink min-w-fit sm:min-w-0 ${
                                        isActive
                                            ? 'bg-amber-500 text-white shadow-sm font-black'
                                            : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 shadow-2xs'
                                    }`}
                                >
                                    <span className="whitespace-nowrap sm:truncate">{tab.label}</span>
                                    {count > 0 && (
                                        <span
                                            className={`min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full text-[10.5px] font-mono font-black shrink-0 ${
                                                isActive
                                                    ? 'bg-white text-amber-800 shadow-xs'
                                                    : tab.id === 'chua_thanh_toan'
                                                    ? 'bg-rose-500 text-white'
                                                    : 'bg-slate-700 text-white'
                                            }`}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Danh sách đơn hàng */}
                {dangTaiDonHang ? (
                    <div className="py-12 text-center text-slate-400">
                        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-2" />
                        <p className="text-xs font-bold">Đang tải lịch sử đơn hàng realtime...</p>
                    </div>
                ) : donHangDaLoc.length === 0 ? (
                    <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl p-6">
                        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center">
                            <ShoppingBag className="w-8 h-8" />
                        </div>
                        <div className="text-sm font-black text-slate-800">
                            Chưa có đơn hàng nào trong trạng thái &quot;{CAC_TAB_TRANG_THAI_DON.find(t => t.id === boLocTrangThaiDon)?.label || 'này'}&quot;
                        </div>
                        <div className="flex items-center justify-center gap-3 flex-wrap pt-1">
                            {boLocTrangThaiDon !== 'tat_ca' && (
                                <button
                                    type="button"
                                    onClick={() => setBoLocTrangThaiDon('tat_ca')}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs shadow-md transition-all cursor-pointer"
                                >
                                    <span>Xem tất cả ({danhSachDonHang.length} đơn)</span>
                                </button>
                            )}
                            <Link
                                href="/san-pham"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-md shadow-amber-500/30 transition-all"
                            >
                                <span>Khám phá Laptop Gaming & AI PC</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {donHangDaLoc.map((dh) => {
                            const ttInfo = layChiTietTrangThaiDon(dh.trang_thai);

                            return (
                                <div
                                    key={dh.id || dh.ma_don_hang}
                                    className="rounded-2xl border-2 border-slate-400 hover:border-amber-500 bg-white shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
                                >
                                    {/* Header Đơn Hàng: Màu sắc đậm đà, tách biệt rõ ràng với phần thân */}
                                    <div className="bg-slate-200 px-4 py-2.5 sm:py-3 border-b-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                                        <div className="flex items-center gap-2.5 flex-wrap">
                                            <span className="font-mono font-black text-blue-950 bg-blue-100 px-3 py-1 rounded-lg border-2 border-blue-400 text-xs sm:text-sm tracking-wide shadow-xs flex items-center gap-1.5">
                                                <Package className="w-3.5 h-3.5 text-blue-700" />
                                                <span>#{dh.ma_don_hang}</span>
                                            </span>
                                            <span className="text-slate-400 font-bold">•</span>
                                            <span className="text-xs text-slate-800 font-black flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                                <span>{layThoiGianDonHang(dh) || dh.ngay_tao}</span>
                                            </span>
                                        </div>

                                        {/* Badge trạng thái đơn hàng: Duy nhất 1 badge rõ ràng, không mâu thuẫn */}
                                        <div className="flex items-center gap-2 self-start sm:self-auto">
                                            {kiemTraChuaThanhToan(dh) ? (
                                                <div className="px-3 py-1 rounded-full text-xs font-black border-2 bg-rose-100 text-rose-950 border-rose-400 flex items-center gap-1.5 shadow-xs select-none">
                                                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
                                                    <span>Chờ thanh toán (VietQR)</span>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`px-3 py-1 rounded-full text-xs font-black border-2 ${ttInfo.badgeBg} flex items-center gap-1.5 shadow-xs select-none`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${ttInfo.dotClass}`} />
                                                    <span>{ttInfo.ten}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                {/* Body Đơn Hàng: Nền xám nhạt làm nổi bật các khung sản phẩm nền trắng */}
                                <div className="bg-slate-100/70 p-3 sm:p-4 space-y-3">
                                    {/* 1. Danh sách máy trong đơn (Click vào máy xem chi tiết & hỗ trợ Mua lại ngay) */}
                                    <div className="space-y-2.5">
                                        {dh.danh_sach_san_pham?.map((sp, idx) => {
                                            const duongDanSP = layDuongDanSanPham(sp);
                                            const giaTongMuc = layGiaSanPhamDonHang(sp);
                                            const donGia = layDonGiaSanPham(sp);

                                            return (
                                                <div
                                                    key={idx}
                                                    className="group/item flex items-center gap-3 text-xs bg-white hover:bg-amber-50/50 p-3 rounded-xl border-2 border-slate-300 hover:border-amber-500 shadow-sm transition-all duration-150"
                                                >
                                                    {/* Ảnh sản phẩm: Click chuyển sang trang chi tiết */}
                                                    <Link
                                                        href={duongDanSP}
                                                        className="w-13 h-13 rounded-lg bg-white overflow-hidden shrink-0 border-2 border-slate-300 p-1 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform shadow-2xs"
                                                        title="Bấm để xem chi tiết sản phẩm"
                                                    >
                                                        <img
                                                            src={layHinhAnhSanPhamDonHang(sp)}
                                                            alt={sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop'}
                                                            onError={(e) => {
                                                                e.currentTarget.onerror = null;
                                                                e.currentTarget.src = '/images/sp/lenovo_legion_pro7.jpg';
                                                            }}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </Link>

                                                    {/* Tên & cấu hình sản phẩm: Click chuyển sang trang chi tiết */}
                                                    <div className="flex-1 min-w-0">
                                                        <Link
                                                            href={duongDanSP}
                                                            className="font-black text-slate-900 group-hover/item:text-blue-600 transition-colors text-xs sm:text-sm truncate block cursor-pointer"
                                                            title="Bấm để xem chi tiết sản phẩm và mua lại"
                                                        >
                                                            {sp.san_pham?.ten_san_pham || sp.ten_san_pham || 'Laptop Chính Hãng'}
                                                        </Link>
                                                        <div className="text-[11px] text-slate-600 font-bold mt-1 flex items-center gap-2 flex-wrap">
                                                            <span>Số lượng: <b className="text-slate-900 font-black">{sp.so_luong || 1}</b></span>
                                                            {sp.tuy_chon_chon?.ten_tuy_chon && (
                                                                <span className="text-blue-900 font-black bg-blue-100/90 px-2 py-0.5 rounded-md border border-blue-300 text-[10.5px]">
                                                                    {sp.tuy_chon_chon.ten_tuy_chon}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Giá tiền chuẩn xác */}
                                                    <div className="text-right shrink-0">
                                                        <div className="font-black text-rose-600 text-xs sm:text-sm font-mono whitespace-nowrap">
                                                            {dinhDangTienVND(giaTongMuc)}
                                                        </div>
                                                        {(sp.so_luong || 1) > 1 && donGia > 0 && (
                                                            <div className="text-[10px] text-slate-600 font-bold whitespace-nowrap">
                                                                {dinhDangTienVND(donGia)}/máy
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* 2. TIMELINE STEPPER: BUNG TỪ TỪ ÊM ÁI BÊN DƯỚI CÁC SẢN PHẨM */}
                                    <div
                                        className={`grid transition-all duration-300 ease-in-out ${
                                            danhSachMoTimeline[dh.id || dh.ma_don_hang]
                                                ? 'grid-rows-[1fr] opacity-100 pt-2'
                                                : 'grid-rows-[0fr] opacity-0 pt-0 pointer-events-none'
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="rounded-2xl bg-gradient-to-br from-blue-50/95 via-sky-50/80 to-indigo-50/95 border-2 border-blue-300 p-3.5 sm:p-4.5 space-y-3.5 shadow-sm">
                                                {/* 1. Thanh trạng thái & Mã vận đơn Viettel Post */}
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b-2 border-blue-200/80">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shrink-0 shadow-md ${dh.trang_thai === 'da_huy' ? 'bg-gradient-to-br from-rose-600 to-rose-700 shadow-rose-500/30' : 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-500/30'}`}>
                                                            {dh.trang_thai === 'da_giao' ? (
                                                                <CheckCircle2 className="w-5 h-5" />
                                                            ) : dh.trang_thai === 'dang_giao' ? (
                                                                <Truck className="w-5 h-5 animate-pulse" />
                                                            ) : dh.trang_thai === 'da_huy' ? (
                                                                <AlertCircle className="w-5 h-5" />
                                                            ) : (
                                                                <PackageCheck className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <div className="text-xs sm:text-sm font-black text-slate-900 truncate">
                                                                {dh.trang_thai === 'da_giao'
                                                                    ? 'Chặng 4/4: Giao hàng thành công trọn vẹn'
                                                                    : dh.trang_thai === 'dang_giao'
                                                                    ? 'Chặng 3/4: Đang vận chuyển hỏa tốc'
                                                                    : dh.trang_thai === 'da_huy'
                                                                    ? 'Đơn hàng đã bị hủy'
                                                                    : dh.trang_thai === 'cho_xac_nhan'
                                                                    ? 'Chặng 1/4: Hệ thống tiếp nhận đơn hàng'
                                                                    : 'Chặng 2/4: Đang đóng gói & chuẩn bị xuất kho'}
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-1 text-xs text-slate-600 font-bold flex-wrap">
                                                                <span>Viettel Post Express:</span>
                                                                <span className="font-mono font-black text-blue-800 bg-white px-2 py-0.5 rounded-md border border-blue-300 shadow-2xs text-[11px]">
                                                                    {dh.ma_van_don || 'Đang cập nhật mã vận đơn'}
                                                                </span>
                                                                {dh.ma_van_don && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => saoChepMaVanDon(dh.ma_van_don)}
                                                                        className="text-blue-600 hover:text-blue-800 font-black hover:underline cursor-pointer flex items-center gap-1 text-[11px] ml-0.5"
                                                                        title="Sao chép mã vận đơn"
                                                                    >
                                                                        {daSaoChepVanDon ? <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" /> : <Copy className="w-3.5 h-3.5" />}
                                                                        <span>{daSaoChepVanDon ? 'Đã chép' : 'Sao chép'}</span>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Tiến độ % badge */}
                                                    <div className="self-start sm:self-auto shrink-0 flex items-center gap-2">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-black border-2 flex items-center gap-1.5 shadow-2xs ${
                                                            dh.trang_thai === 'da_huy'
                                                                ? 'bg-rose-100 text-rose-950 border-rose-400'
                                                                : dh.trang_thai === 'da_giao'
                                                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                                                                : 'bg-blue-100 text-blue-950 border-blue-400'
                                                        }`}>
                                                            <span className={`w-2 h-2 rounded-full ${dh.trang_thai === 'da_huy' ? 'bg-rose-600' : dh.trang_thai === 'da_giao' ? 'bg-emerald-600' : 'bg-blue-600 animate-pulse'}`} />
                                                            <span>{dh.trang_thai === 'da_huy' ? 'Đã hủy' : `Tiến độ: ${tinhTienDoPhanTramDonHang(dh)}%`}</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 2. Stepper Trục Lộ Trình 4 Chặng với Icon riêng biệt */}
                                                <div className="relative pt-2 pb-2">
                                                    {/* Thanh ray nối tâm */}
                                                    <div className="absolute top-6 sm:top-7 left-[12.5%] right-[12.5%] h-2 -translate-y-1/2 bg-slate-200 rounded-full z-0 overflow-hidden border border-slate-300">
                                                        <div
                                                            className={`h-full transition-all duration-700 ease-out rounded-full ${dh.trang_thai === 'da_huy' ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-blue-600'}`}
                                                            style={{
                                                                width: `${dh.trang_thai === 'da_huy' ? 25 : tinhTienDoPhanTramDonHang(dh)}%`
                                                            }}
                                                        />
                                                    </div>

                                                    {/* 4 Trạm Mốc */}
                                                    <div className="grid grid-cols-4 relative z-10">
                                                        {layCacBuocDonHang(dh).map((st, i) => {
                                                            const IconComponent = st.icon || PackageCheck;
                                                            return (
                                                                <div key={i} className="flex flex-col items-center text-center px-0.5 sm:px-1">
                                                                    {/* Icon Box */}
                                                                    <div
                                                                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ring-4 ring-white ${
                                                                            st.huy
                                                                                ? 'bg-gradient-to-tr from-rose-600 to-rose-700 text-white shadow-lg shadow-rose-500/50 border-2 border-rose-700'
                                                                                : st.xong
                                                                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border-2 border-emerald-600'
                                                                                : st.hienTai
                                                                                ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50 border-2 border-blue-700 ring-4 ring-blue-300/60 ring-offset-2 ring-offset-white animate-pulse'
                                                                                : 'bg-white text-slate-400 border-2 border-slate-300 shadow-2xs'
                                                                        }`}
                                                                    >
                                                                        {st.xong ? (
                                                                            <Check className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                                                                        ) : (
                                                                            <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                                                                        )}
                                                                    </div>

                                                                    {/* Status Pill Tag */}
                                                                    <div className="mt-2">
                                                                        <span
                                                                            className={`inline-block px-1.5 sm:px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-black border tracking-tight ${
                                                                                st.huy
                                                                                    ? 'bg-rose-100 text-rose-800 border-rose-300 shadow-xs'
                                                                                    : st.xong
                                                                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300 shadow-2xs'
                                                                                    : st.hienTai
                                                                                    ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
                                                                                    : 'bg-slate-100 text-slate-500 border-slate-200'
                                                                            }`}
                                                                        >
                                                                            {st.huy ? '✕ Đã hủy' : st.xong ? '✓ Đã xong' : st.hienTai ? '● Đang xử lý' : 'Chờ chặng tới'}
                                                                        </span>
                                                                    </div>

                                                                    {/* Tên bước */}
                                                                    <div
                                                                        className={`text-xs sm:text-[13px] font-black mt-1 truncate max-w-full ${
                                                                            st.huy ? 'text-rose-700' : st.hienTai ? 'text-blue-700' : st.xong ? 'text-slate-900' : 'text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {st.ten}
                                                                    </div>

                                                                    {/* Mô tả bước */}
                                                                    <div className="text-[10px] text-slate-500 font-bold hidden sm:block truncate max-w-full mt-0.5">
                                                                        {st.moTa || ''}
                                                                    </div>

                                                                    {/* Thời gian */}
                                                                    <div
                                                                        className={`text-[9.5px] sm:text-[11px] font-extrabold mt-0.5 truncate max-w-full ${
                                                                            st.huy ? 'text-rose-600 font-black' : st.hienTai ? 'text-blue-600 font-black' : st.xong ? 'text-slate-600' : 'text-slate-400'
                                                                        }`}
                                                                    >
                                                                        {st.thoiGian}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* 3. Footer Cam Kết An Toàn & Hotline Hỗ Trợ */}
                                                <div className="pt-2.5 border-t-2 border-blue-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                                        <span>Đồng kiểm ngoại quan & phụ kiện khi nhận máy • Bảo hành điện tử kích hoạt tự động theo IMEI/Serial</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-slate-500 font-bold shrink-0">
                                                        <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                        <span>Hotline giao nhận: <b className="text-blue-700 font-black font-mono">1800.6922</b> (Miễn phí)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Đơn Hàng: Tối ưu thông thoáng, chỉ đúng 2 nút bấm thông minh theo ngữ cảnh */}
                                <div className="bg-slate-200/90 px-4 py-3 border-t-2 border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                                    {/* Cột trái: Người nhận & Tổng tiền không bao giờ bị cắt chữ */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 min-w-0">
                                        <div className="text-slate-800 text-[11.5px] sm:text-xs font-bold">
                                            <span className="text-slate-600 font-semibold">Người nhận:</span>{' '}
                                            <strong className="text-slate-900 font-black">{dh.thong_tin_giao_hang?.ho_ten || dh.thong_tin_giao_hang?.ho_va_ten || 'Khách hàng'}</strong>
                                            {dh.thong_tin_giao_hang?.so_dien_thoai && (
                                                <span className="text-slate-600 ml-1 font-semibold font-mono">({dh.thong_tin_giao_hang.so_dien_thoai})</span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline gap-1.5 whitespace-nowrap">
                                            <span className="text-slate-700 font-black text-[11px] uppercase tracking-wide">Tổng:</span>
                                            <span className="text-sm sm:text-base font-black text-rose-600 font-mono">
                                                {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cột phải: Chỉ đúng 2 nút bấm theo đúng ngữ cảnh thực tế */}
                                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                        {/* Nút 1: Luôn có nút Chi tiết đơn */}
                                        <button
                                            type="button"
                                            onClick={() => setDonHangDangXemChiTiet(dh)}
                                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-black border-2 border-slate-300 shadow-2xs hover:border-slate-400 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                                        >
                                            <Eye className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                            <span>Chi tiết</span>
                                        </button>

                                        {/* Hủy đơn: chỉ khi Admin chưa xác nhận và chưa thanh toán */}
                                        {dh.trang_thai === 'cho_xac_nhan' && !dh.da_thanh_toan && (
                                            <button
                                                type="button"
                                                onClick={(e) => xuLyKhachHuyDon(e, dh)}
                                                disabled={donDangHuy === (dh.id || dh.ma_don_hang)}
                                                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-black border-2 border-rose-300 hover:border-rose-500 transition-all cursor-pointer active:scale-95 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Hủy đơn hàng này (chỉ được hủy khi cửa hàng chưa xác nhận)"
                                            >
                                                <X className="w-3.5 h-3.5 shrink-0" />
                                                <span>{donDangHuy === (dh.id || dh.ma_don_hang) ? 'Đang hủy...' : 'Hủy đơn'}</span>
                                            </button>
                                        )}

                                        {/* Nút 2: Nút hành động chính chuẩn xác */}
                                        {kiemTraChuaThanhToan(dh) ? (
                                            <button
                                                type="button"
                                                onClick={() => setDonHangThanhToanQR(dh)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-xs shadow-md shadow-orange-500/30 transition-all cursor-pointer whitespace-nowrap active:scale-95 border-2 border-amber-600"
                                                title="Mở mã QR KienlongBank để quét và hoàn tất thanh toán"
                                            >
                                                <QrCode className="w-3.5 h-3.5 shrink-0" />
                                                <span>Thanh toán ngay</span>
                                            </button>
                                        ) : dh.trang_thai === 'da_giao' ? (
                                            <button
                                                type="button"
                                                onClick={(e) => xuLyMuaLaiToanBoDon(e, dh)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-amber-400 hover:border-amber-600 bg-amber-100/90 hover:bg-amber-200 text-amber-950 font-black text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                                title="Thêm tất cả sản phẩm trong đơn này vào giỏ hàng để mua lại"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                                                <span>Mua lại</span>
                                            </button>
                                        ) : dh.trang_thai === 'da_huy' ? (
                                            <button
                                                type="button"
                                                onClick={(e) => xuLyMuaLaiToanBoDon(e, dh)}
                                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-100 text-slate-800 font-black text-xs shadow-2xs transition-all cursor-pointer whitespace-nowrap active:scale-95"
                                                title="Đặt lại các sản phẩm trong đơn đã hủy"
                                            >
                                                <RotateCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                                                <span>Đặt lại</span>
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => toggleTimeline(dh.id || dh.ma_don_hang)}
                                                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl border-2 font-black text-xs transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                                                    danhSachMoTimeline[dh.id || dh.ma_don_hang]
                                                        ? 'bg-blue-600 text-white border-blue-700 shadow-md shadow-blue-600/25'
                                                        : 'bg-white hover:bg-blue-50 text-blue-800 border-blue-400 shadow-2xs'
                                                }`}
                                                title="Bấm để xem hoặc thu gọn tiến độ giao hàng"
                                            >
                                                <Truck className="w-3.5 h-3.5 shrink-0" />
                                                <span>{danhSachMoTimeline[dh.id || dh.ma_don_hang] ? 'Đóng tiến độ' : 'Xem tiến độ'}</span>
                                                <ChevronDown className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${danhSachMoTimeline[dh.id || dh.ma_don_hang] ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
