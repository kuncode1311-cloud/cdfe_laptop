'use client';

import Link from 'next/link';

import { LayoutDashboard, ShoppingBag, Star, Laptop, Layers, Users, Ticket, Newspaper, Search, Moon, Sun, Menu, ChevronRight, ChevronLeft, CheckCircle2, XCircle, Trash2, X, RotateCcw, MapPin, Sparkles, ExternalLink, AlertTriangle, ShieldCheck, Tag, Headphones, Info } from 'lucide-react';

import ModalThuongHieu from '@/app/admin/danh-muc/components/ModalThuongHieu';
import ModalVoucher from '@/app/admin/voucher/components/ModalVoucher';
import ModalKhachHang from '@/app/admin/khach-hang/components/ModalKhachHang';
import ModalTinTuc from '@/app/admin/tin-tuc/components/ModalTinTuc';
import ModalDonHang from '@/app/admin/don-hang/components/ModalDonHang';
import ModalChiTietDonHang from '@/app/admin/don-hang/components/ModalChiTietDonHang';
import ModalSanPham from '@/app/admin/san-pham/components/ModalSanPham';
import OverlayXemSanPham from '@/app/admin/san-pham/components/OverlayXemSanPham';

import { AdminContext } from '@/app/admin/context/AdminContext';
import useAdminController from '@/app/admin/hooks/useAdminController';

// Khung chung giữ dữ liệu và modal khi chuyển giữa các route con.
export default function KhungQuanTri({ children }) {
    const controller = useAdminController();
    const { nguoiDung, dangXuat, chu_de, chuyenDoiChuDe, khungNoiDungChinhRef, sidebarThuGon, setSidebarThuGon, sidebarMoMobile, setSidebarMoMobile, danhSachSanPham, danhSachDonHang, danhSachVoucher, danhSachDanhMuc, danhSachNguoiDung, danhSachTinTuc, dangTai, tuKhoaGlobal, setTuKhoaGlobal, danhSachShowroomAdmin, soLuongChuaXuLyLienHe, hopThoai, taiDuLieuToanBo, thongKe, thongSoModalThuongHieu, thongSoModalVoucher, thongSoModalTinTuc, thongSoModalDonHang, thongSoModalChiTietDonHang, thongSoModalSanPham, thongSoOverlayXemSanPham, thongSoModalKhachHang, tabHienTai, setTabHienTai } = controller;
    return <AdminContext.Provider value={controller}><GiaoDienQuanTri {...{ nguoiDung, dangXuat, chu_de, chuyenDoiChuDe, khungNoiDungChinhRef, sidebarThuGon, setSidebarThuGon, sidebarMoMobile, setSidebarMoMobile, danhSachSanPham, danhSachDonHang, danhSachVoucher, danhSachDanhMuc, danhSachNguoiDung, danhSachTinTuc, dangTai, tuKhoaGlobal, setTuKhoaGlobal, danhSachShowroomAdmin, soLuongChuaXuLyLienHe, hopThoai, taiDuLieuToanBo, thongKe, thongSoModalThuongHieu, thongSoModalVoucher, thongSoModalTinTuc, thongSoModalDonHang, thongSoModalChiTietDonHang, thongSoModalSanPham, thongSoOverlayXemSanPham, thongSoModalKhachHang, tabHienTai, setTabHienTai }} >{children}</GiaoDienQuanTri></AdminContext.Provider>;
}

function GiaoDienQuanTri({ children, nguoiDung, dangXuat, chu_de, chuyenDoiChuDe, khungNoiDungChinhRef, sidebarThuGon, setSidebarThuGon, sidebarMoMobile, setSidebarMoMobile, danhSachSanPham, danhSachDonHang, danhSachVoucher, danhSachDanhMuc, danhSachNguoiDung, danhSachTinTuc, dangTai, tuKhoaGlobal, setTuKhoaGlobal, danhSachShowroomAdmin, soLuongChuaXuLyLienHe, hopThoai, taiDuLieuToanBo, thongKe, thongSoModalThuongHieu, thongSoModalVoucher, thongSoModalTinTuc, thongSoModalDonHang, thongSoModalChiTietDonHang, thongSoModalSanPham, thongSoOverlayXemSanPham, thongSoModalKhachHang, tabHienTai, setTabHienTai }) {
    return (
        <div className="admin-shell h-screen w-full overflow-hidden bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans antialiased">
            {/* Custom Dialog Box (Hộp thoại xác nhận & cảnh báo thay thế alert / confirm trình duyệt) */}
            {hopThoai.hien && (
                <div
                    className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={(e) => {
                        if (e.target === e.currentTarget && hopThoai.kieu === 'alert') {
                            hopThoai.onHuy();
                        }
                    }}
                >
                    <div
                        className={`bg-white dark:bg-[#0f172a] rounded-3xl w-full max-w-md border-2 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200 transition-all ${
                            hopThoai.loai === 'danger'
                                ? 'border-rose-400/80 dark:border-rose-700/80 shadow-rose-950/20'
                                : hopThoai.loai === 'warning'
                                    ? 'border-amber-400/80 dark:border-amber-600/80 shadow-amber-950/20'
                                    : hopThoai.loai === 'success'
                                        ? 'border-emerald-400/80 dark:border-emerald-600/80 shadow-emerald-950/20'
                                        : 'border-blue-400/80 dark:border-blue-600/80 shadow-blue-950/20'
                        }`}
                    >
                        {/* Header icon + text */}
                        <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                                hopThoai.loai === 'danger'
                                    ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 ring-4 ring-rose-500/10'
                                    : hopThoai.loai === 'warning'
                                        ? 'bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-300 dark:border-amber-800 ring-4 ring-amber-500/10'
                                        : hopThoai.loai === 'success'
                                            ? 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 ring-4 ring-emerald-500/10'
                                            : 'bg-blue-100 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-800 ring-4 ring-blue-500/10'
                            }`}>
                                {hopThoai.loai === 'danger' && <Trash2 className="w-6 h-6" />}
                                {hopThoai.loai === 'warning' && <AlertTriangle className="w-6 h-6" />}
                                {hopThoai.loai === 'success' && <CheckCircle2 className="w-6 h-6" />}
                                {(!hopThoai.loai || hopThoai.loai === 'info') && <Info className="w-6 h-6" />}
                            </div>
                            <div className="flex-1 min-w-0 pt-0.5">
                                <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight">
                                    {hopThoai.tieuDe}
                                </h3>
                                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed whitespace-pre-line font-medium">
                                    {hopThoai.noiDung}
                                </p>
                            </div>
                        </div>

                        {/* Button Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                            {hopThoai.kieu === 'confirm' && (
                                <button
                                    type="button"
                                    onClick={hopThoai.onHuy}
                                    className="px-4 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                                >
                                    {hopThoai.nutHuy || 'Hủy bỏ'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={hopThoai.onXacNhan}
                                autoFocus
                                className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95 ${
                                    hopThoai.loai === 'danger'
                                        ? 'bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 shadow-rose-500/30'
                                        : hopThoai.loai === 'warning'
                                            ? 'bg-gradient-to-r from-amber-500 via-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/30'
                                            : hopThoai.loai === 'success'
                                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30'
                                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-500/30'
                                }`}
                            >
                                {hopThoai.kieu === 'confirm' && hopThoai.loai === 'danger' && <Trash2 className="w-4 h-4" />}
                                <span>{hopThoai.nutXacNhan || 'Xác Nhận'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop làm mờ khi mở Sidebar trên Mobile */}
            {sidebarMoMobile && (
                <div
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-30 md:hidden animate-in fade-in duration-200"
                    onClick={() => setSidebarMoMobile(false)}
                    aria-hidden="true"
                />
            )}

            {/* SIDEBAR ĐIỀU HƯỚNG QUẢN TRỊ (CỐ ĐỊNH 100% CHIỀU CAO - KHÔNG BỊ CUỘN THEO TRANG VÀ KHÔNG BỊ TRỐNG ĐÁY) */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0d1527] border-r-2 border-slate-300 dark:border-slate-800 flex flex-col h-full justify-between transition-all duration-300 md:static md:shrink-0 ${sidebarMoMobile ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
                    } ${sidebarThuGon ? 'md:w-20' : 'md:w-64'}`}
            >
                {/* 1. Header & Logo với nút thu gọn trực tiếp */}
                <div className="p-4 pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                    {!sidebarThuGon ? (
                        <div className="flex items-center justify-between">
                            <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                                    💻
                                </div>
                                <div className="truncate">
                                    <div className="font-black text-base text-slate-950 dark:text-white tracking-tight">TNTP LAPTOP</div>
                                    <div className="text-[10px] font-extrabold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">Hệ Thống Quản Trị</div>
                                </div>
                            </Link>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setSidebarThuGon(true)}
                                    className="hidden md:flex p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
                                    title="Thu gọn menu thanh bên"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setSidebarMoMobile(false)}
                                    className="md:hidden p-1.5 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Link href="/admin" title="TNTP LAPTOP Quản Trị">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                                    💻
                                </div>
                            </Link>
                            <button
                                onClick={() => setSidebarThuGon(false)}
                                className="hidden md:flex p-1.5 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-slate-800 dark:text-cyan-400 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                                title="Mở rộng menu thanh bên"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Menu Điều Hướng Cuộn Độc Lập & Nhóm Rõ Ràng */}
                <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-3 space-y-4">
                    {/* Nhóm 1: Quản lý Cửa Hàng & Kho */}
                    <div className="space-y-1">
                        {!sidebarThuGon && (
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1">
                                KHO & KINH DOANH
                            </div>
                        )}
                        <nav className="space-y-1 text-sm font-bold">
                            {/* 1. Tổng quan */}
                            <button
                                onClick={() => { setTabHienTai('tong_quan'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'tong_quan'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Tổng Quan"
                            >
                                <LayoutDashboard className="w-5 h-5 shrink-0" />
                                {!sidebarThuGon && <span>Tổng Quan</span>}
                            </button>

                            {/* 2. Đơn hàng */}
                            <button
                                onClick={() => { setTabHienTai('don_hang'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'don_hang'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-orange-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Đơn Hàng"
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Quản Lý Đơn Hàng</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'don_hang' ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-950 dark:bg-orange-950 dark:text-orange-300'}`}>
                                        {danhSachDonHang.length}
                                    </span>
                                )}
                            </button>

                            {/* 3. Sản phẩm */}
                            <button
                                onClick={() => { setTabHienTai('san_pham'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'san_pham'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-cyan-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Kho Hàng & Danh Sách Sản Phẩm"
                            >
                                <div className="flex items-center gap-3">
                                    <Laptop className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Kho Sản Phẩm</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'san_pham' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-950 dark:bg-cyan-950 dark:text-cyan-300'}`}>
                                        {danhSachSanPham.length}
                                    </span>
                                )}
                            </button>

                            {/* 4. Hãng & Thương hiệu */}
                            <button
                                onClick={() => { setTabHienTai('danh_muc'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'danh_muc'
                                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-purple-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Hãng & Danh Mục"
                            >
                                <div className="flex items-center gap-3">
                                    <Layers className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Hãng & Danh Mục</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'danh_muc' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-950 dark:bg-purple-950 dark:text-purple-300'}`}>
                                        {danhSachDanhMuc.length}
                                    </span>
                                )}
                            </button>
                        </nav>
                    </div>

                    {/* Nhóm 2: Vận Hành & Nội Dung */}
                    <div className="space-y-1">
                        {!sidebarThuGon && (
                            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2.5 pb-1">
                                VẬN HÀNH & NỘI DUNG
                            </div>
                        )}
                        <nav className="space-y-1 text-sm font-bold">
                            {/* 5. Khách hàng */}
                            <button
                                onClick={() => { setTabHienTai('khach_hang'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'khach_hang'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Tài Khoản Khách Hàng"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Khách Hàng</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'khach_hang' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                                        {danhSachNguoiDung.length}
                                    </span>
                                )}
                            </button>

                            {/* 6. Mã giảm giá */}
                            <button
                                onClick={() => { setTabHienTai('voucher'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'voucher'
                                    ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-lg shadow-rose-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-rose-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Mã Khuyến Mãi"
                            >
                                <div className="flex items-center gap-3">
                                    <Ticket className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Mã Khuyến Mãi</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'voucher' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-950 dark:bg-rose-950 dark:text-rose-300'}`}>
                                        {danhSachVoucher.length}
                                    </span>
                                )}
                            </button>

                            {/* 7. Tin Tức & Bài Viết */}
                            <button
                                onClick={() => { setTabHienTai('tin_tuc'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'tin_tuc'
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-teal-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Tin Tức & Bài Viết"
                            >
                                <div className="flex items-center gap-3">
                                    <Newspaper className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Tin Tức & Bài Viết</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'tin_tuc' ? 'bg-white/20 text-white' : 'bg-teal-100 text-teal-950 dark:bg-teal-950 dark:text-teal-300'}`}>
                                        {danhSachTinTuc.length}
                                    </span>
                                )}
                            </button>

                            {/* 8. Banner & Khuyến Mãi */}
                            <button
                                onClick={() => { setTabHienTai('khuyen_mai'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'khuyen_mai'
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-pink-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Banner & Khuyến Mãi"
                            >
                                <div className="flex items-center gap-3">
                                    <Sparkles className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Banner & Khuyến Mãi</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-pink-100 text-pink-950 dark:bg-pink-950 dark:text-pink-300">
                                        LIVE
                                    </span>
                                )}
                            </button>

                            {/* 9. Hệ Thống Showroom & Bản Đồ */}
                            <button
                                onClick={() => { setTabHienTai('showroom'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'showroom'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Hệ Thống Showroom & Tọa Độ Bản Đồ"
                            >
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Showroom & Bản Đồ</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${tabHienTai === 'showroom' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-950 dark:bg-blue-950 dark:text-blue-300'}`}>
                                        {danhSachShowroomAdmin.length}
                                    </span>
                                )}
                            </button>

                            {/* 10. Yêu Cầu Tư Vấn & CSKH */}
                            <button
                                onClick={() => { setTabHienTai('lien_he'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'lien_he'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-blue-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Yêu Cầu Tư Vấn & CSKH"
                            >
                                <div className="relative flex items-center gap-3">
                                    <Headphones className="w-5 h-5 shrink-0" />
                                    {soLuongChuaXuLyLienHe > 0 && sidebarThuGon && (
                                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900 animate-ping"></span>
                                    )}
                                    {!sidebarThuGon && <span>Yêu Cầu Tư Vấn</span>}
                                </div>
                                {!sidebarThuGon && (
                                    <span className={`px-2 py-0.5 rounded-full text-xs font-black ${
                                        soLuongChuaXuLyLienHe > 0
                                            ? 'bg-amber-500 text-white animate-pulse'
                                            : tabHienTai === 'lien_he'
                                            ? 'bg-white/20 text-white'
                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                    }`}>
                                        {soLuongChuaXuLyLienHe > 0 ? `${soLuongChuaXuLyLienHe} mới` : 'CSKH'}
                                    </span>
                                )}
                            </button>

                            {/* 11. Quản Lý Đánh Giá Sản Phẩm */}
                            <button
                                onClick={() => { setTabHienTai('danh_gia'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'danh_gia'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-amber-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Đánh Giá Sản Phẩm"
                            >
                                <div className="flex items-center gap-3">
                                    <Star className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Đánh Giá</span>}
                                </div>
                            </button>

                            {/* 12. Quản Lý Bảo Hành */}
                            <button
                                onClick={() => { setTabHienTai('bao_hanh'); setSidebarMoMobile(false); }}
                                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all cursor-pointer ${tabHienTai === 'bao_hanh'
                                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 font-black scale-[1.02]'
                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600'
                                    } ${sidebarThuGon ? 'justify-center px-0' : ''}`}
                                title="Quản Lý Bảo Hành"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 shrink-0" />
                                    {!sidebarThuGon && <span>Bảo Hành</span>}
                                </div>
                            </button>
                        </nav>
                    </div>

                    {/* Widget Trạng Thái Hệ Thống (Lấp đầy không gian, cực kỳ chuyên nghiệp) */}
                    {!sidebarThuGon && (
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800/60 dark:to-blue-950/20 border border-slate-200/80 dark:border-slate-700/60 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Hệ Thống Online
                                </span>
                                <span className="text-[10px] font-black text-blue-600 dark:text-cyan-400">Port 5000</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                                <div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Tồn kho:</div>
                                    <div className="font-black text-slate-800 dark:text-slate-200">{thongKe.tongTonKho} máy</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 font-semibold">Đơn chờ:</div>
                                    <div className="font-black text-amber-600 dark:text-amber-400">{thongKe.donChoXacNhan} đơn</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 3. Bottom Footer Links & Nút Thu Gọn Sidebar */}
                <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2 shrink-0 bg-white dark:bg-[#0d1527]">
                    <Link
                        href="/khuyen-mai"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold text-xs transition-colors border border-rose-200 dark:border-rose-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Khuyến Mãi"
                    >
                        <Tag className="w-4 h-4 shrink-0 text-rose-600" />
                        {!sidebarThuGon && <span>Xem Trang Khuyến Mãi</span>}
                    </Link>
                    <Link
                        href="/tin-tuc"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 font-bold text-xs transition-colors border border-teal-200 dark:border-teal-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Tin Tức"
                    >
                        <Newspaper className="w-4 h-4 shrink-0 text-teal-600" />
                        {!sidebarThuGon && <span>Xem Trang Tin Tức</span>}
                    </Link>
                    <Link
                        href="/lien-he"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-bold text-xs transition-colors border border-indigo-200 dark:border-indigo-800 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Trang Liên Hệ & Bản Đồ"
                    >
                        <MapPin className="w-4 h-4 shrink-0 text-indigo-600" />
                        {!sidebarThuGon && <span>Xem Trang Liên Hệ</span>}
                    </Link>
                    <Link
                        href="/"
                        target="_blank"
                        className={`w-full flex items-center gap-2 py-2 rounded-2xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200 dark:border-slate-700 ${sidebarThuGon ? 'justify-center px-0' : 'px-3'}`}
                        title="Xem Cửa Hàng Bán Lẻ"
                    >
                        <ExternalLink className="w-4 h-4 text-blue-600 shrink-0" />
                        {!sidebarThuGon && <span>Xem Cửa Hàng Bán Lẻ</span>}
                    </Link>

                    {/* Nút Thu Gọn / Mở Rộng Chân Sidebar */}
                    <button
                        onClick={() => setSidebarThuGon(!sidebarThuGon)}
                        className={`w-full hidden md:flex items-center gap-2.5 py-2 rounded-2xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-cyan-400 font-bold text-xs transition-colors cursor-pointer ${
                            sidebarThuGon ? 'justify-center px-0' : 'px-3 border border-dashed border-slate-200 dark:border-slate-700'
                        }`}
                        title={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                    >
                        {sidebarThuGon ? (
                            <ChevronRight className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4 text-slate-500 shrink-0" />
                                <span>Thu gọn thanh bên</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT AREA (PINNED HEADER & SCROLLABLE BODY) */}
            <div ref={khungNoiDungChinhRef} className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
                {/* TOPBAR RỰC RỠ & SANG TRỌNG (LUÔN GHIM CỐ ĐỊNH Ở ĐỈNH) */}
                <header className="sticky top-0 h-16 bg-white dark:bg-[#0d1527] border-b-2 border-slate-300 dark:border-slate-700 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm z-30">
                    <div className="flex items-center gap-3.5">
                        <button
                            onClick={() => {
                                if (window.innerWidth < 768) setSidebarMoMobile(true);
                                else setSidebarThuGon(!sidebarThuGon);
                            }}
                            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            title={sidebarThuGon ? "Mở rộng thanh bên" : "Thu gọn thanh bên"}
                        >
                            <Menu className="w-4 h-4" />
                        </button>

                        <div>
                            <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                HỆ THỐNG CỬA HÀNG //
                            </div>
                            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight">
                                {tabHienTai === 'tong_quan' ? 'Bảng Thống Kê Tổng Quan' :
                                    tabHienTai === 'don_hang' ? 'Quản Lý Đơn Hàng' :
                                        tabHienTai === 'san_pham' ? 'Kho Hàng & Danh Sách Sản Phẩm' :
                                            tabHienTai === 'danh_muc' ? 'Hãng Sản Xuất & Danh Mục Phân Khúc' :
                                                tabHienTai === 'khach_hang' ? 'Danh Sách Tài Khoản Khách Hàng' :
                                                    tabHienTai === 'voucher' ? 'Mã Giảm Giá & Voucher' :
                                                        tabHienTai === 'khuyen_mai' ? 'Cấu Hình Banner & Khuyến Mãi' :
                                                            tabHienTai === 'showroom' ? 'Hệ Thống Showroom & Tọa Độ Bản Đồ' :
                                                                tabHienTai === 'lien_he' ? 'Quản Lý Yêu Cầu Tư Vấn & CSKH' :
                                                                    tabHienTai === 'danh_gia' ? 'Quản Lý Đánh Giá Sản Phẩm' :
                                                                        tabHienTai === 'bao_hanh' ? 'Quản Lý Bảo Hành' :
                                                                            'Quản Lý Tin Tức & Cẩm Nang Công Nghệ'}
                            </h1>
                        </div>
                    </div>

                    {/* Right Tools */}
                    <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative hidden md:block w-64 lg:w-72">
                            <input
                                type="text"
                                value={tuKhoaGlobal}
                                onChange={(e) => setTuKhoaGlobal(e.target.value)}
                                placeholder="Tìm kiếm tên, SKU, hãng, bài viết..."
                                className="w-full pl-4 pr-9 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600"
                            />
                            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        </div>

                        {/* Reload */}
                        <button
                            onClick={taiDuLieuToanBo}
                            disabled={dangTai}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                            title="Tải lại dữ liệu"
                        >
                            <RotateCcw className={`w-4 h-4 ${dangTai ? 'animate-spin text-blue-600' : ''}`} />
                        </button>

                        {/* Theme Toggle */}
                        <button
                            onClick={chuyenDoiChuDe}
                            className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                        >
                            {chu_de === 'sang' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
                        </button>

                        {/* Admin Badge Pill */}
                        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800">
                            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md">
                                👑
                            </div>
                            <div className="hidden lg:block text-left">
                                <div className="font-extrabold text-xs text-slate-900 dark:text-white leading-tight">
                                    {nguoiDung?.hoTen || 'Quản Trị Viên Hệ Thống'}
                                </div>
                                <div className="text-[10px] text-slate-500 font-semibold">
                                    {nguoiDung?.email || 'admin@laptopnew.vn'}
                                </div>
                            </div>
                            <button
                                onClick={dangXuat}
                                className="p-1.5 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                                title="Đăng xuất"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* SCROLLABLE VIEWPORT */}
                <main className="flex-1 min-h-0 p-4 sm:p-6 pb-24 space-y-6 bg-slate-100 dark:bg-slate-950">
                    {children}
                </main>
            </div>

            <ModalSanPham {...thongSoModalSanPham} />

            <OverlayXemSanPham {...thongSoOverlayXemSanPham} />

            <ModalDonHang {...thongSoModalDonHang} />

            <ModalThuongHieu {...thongSoModalThuongHieu} />

            <ModalKhachHang {...thongSoModalKhachHang} />

            <ModalVoucher {...thongSoModalVoucher} />

            <ModalChiTietDonHang {...thongSoModalChiTietDonHang} />

            <ModalTinTuc {...thongSoModalTinTuc} />
        </div>
    );
}
