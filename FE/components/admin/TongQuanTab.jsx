'use client';
import React, { useMemo } from 'react';
import Image from 'next/image';
import {
    Plus,
    ShoppingBag,
    Newspaper,
    Ticket,
    Sparkles,
    DollarSign,
    Users,
    Package,
    ArrowUpRight,
    Eye
} from 'lucide-react';
import BieuDoTongQuan, { layTimestampDonHang } from '@/components/admin/BieuDoTongQuan';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

// Component Tab "Tổng Quan" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function TongQuanTab({
    nguoiDung,
    moModalThemSp,
    moModalTaoDonHang,
    moModalThemTinTuc,
    moModalThemVoucher,
    setTabHienTai,
    thongKe,
    dangTai,
    danhSachDonHang,
    danhSachSanPham,
    dinhDangTienVND,
    xacDinhLoaiSanPham,
    setDonHangChiTiet,
    topSanPhamBanChay
}) {
    // Luôn sắp xếp 5 đơn hàng mới nhất chuẩn xác theo thời gian thực (hỗ trợ cả ISO và DD/MM/YYYY)
    const donHangMoiNhat = useMemo(() => {
        return [...(danhSachDonHang || [])]
            .sort((a, b) => layTimestampDonHang(b) - layTimestampDonHang(a))
            .slice(0, 5);
    }, [danhSachDonHang]);

    return (
        <div className="space-y-6 animate-in fade-in duration-200">
            {/* Quick Action Bar: Thẻ Trắng Sáng Sang Trọng (Không Dùng Tone Tối) */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0d1527] border-2 border-slate-300 dark:border-slate-800 shadow-md shadow-slate-900/5 flex flex-wrap items-center justify-between gap-5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                            Xin chào, {nguoiDung?.hoTen || 'Quản Trị Viên Hệ Thống'} 👋
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300 text-xs font-black uppercase tracking-wider border border-blue-300 dark:border-blue-800">
                            Admin Control Center
                        </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-semibold">
                        Báo cáo toàn cảnh hoạt động kinh doanh, biến động kho hàng & tương tác thời gian thực
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={moModalThemSp}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4 !text-white" />
                        <span className="!text-white">+ Thêm Sản Phẩm</span>
                    </button>

                    <button
                        onClick={moModalTaoDonHang}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-orange-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <ShoppingBag className="w-4 h-4 !text-white" />
                        <span className="!text-white">+ Tạo Đơn Hàng</span>
                    </button>

                    <button
                        onClick={moModalThemTinTuc}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <Newspaper className="w-4 h-4 !text-white" />
                        <span className="!text-white">+ Viết Bài Tin Tức</span>
                    </button>

                    <button
                        onClick={moModalThemVoucher}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 !text-white font-black text-xs flex items-center gap-2 shadow-md shadow-rose-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <Ticket className="w-4 h-4 !text-white" />
                        <span className="!text-white">+ Tạo Voucher</span>
                    </button>

                    <button
                        onClick={() => setTabHienTai('khuyen_mai')}
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 font-black text-xs flex items-center gap-2 shadow-xs border border-slate-300 dark:border-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                        <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                        <span>⚙️ Banner Khuyến Mãi</span>
                    </button>
                </div>
            </div>

            {/* 4 Cards Thống Kê Nổi Bật Đậm Tone Sang & Trực Quan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Doanh Thu (Sapphire Tech) */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white dark:from-[#0a1526] dark:via-blue-950/30 dark:to-[#0b1120] border-2 border-blue-200/90 dark:border-blue-800/80 shadow-md shadow-blue-500/10 hover:shadow-xl hover:shadow-blue-500/20 hover:border-blue-500 hover:-translate-y-1 transition-all space-y-2 group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-blue-600" />
                            DOANH THU TOÀN SÀN
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-blue-500/30 group-hover:scale-110 transition-transform">
                            💰
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                        {dinhDangTienVND(thongKe.tongDoanhThu)}
                    </div>
                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="text-slate-600 font-bold">Đã thực thu:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-800">
                            {dinhDangTienVND(thongKe.doanhThuThanhCong)}
                        </span>
                    </div>
                </div>

                {/* Card 2: Đơn Hàng (Amber Flame) */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white dark:from-[#1c1305] dark:via-amber-950/30 dark:to-[#0b1120] border-2 border-amber-300 dark:border-amber-700/80 shadow-md shadow-amber-500/10 hover:shadow-xl hover:shadow-amber-500/20 hover:border-amber-500 hover:-translate-y-1 transition-all space-y-2 group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            TỔNG ĐƠN HÀNG
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center text-lg shadow-md shadow-orange-500/30 group-hover:scale-110 transition-transform">
                            🛍️
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                        {thongKe.tongDonHang} Đơn
                    </div>
                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="text-slate-600 font-bold">Cần xử lý:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-orange-100 text-orange-900 dark:bg-orange-950 dark:text-orange-300 font-black text-xs border border-orange-300 dark:border-orange-800">
                            {thongKe.donChoXacNhan} đơn chờ xác nhận
                        </span>
                    </div>
                </div>

                {/* Card 3: Khách Hàng (Royal Amethyst) */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white dark:from-[#180924] dark:via-purple-950/30 dark:to-[#0b1120] border-2 border-purple-200/90 dark:border-purple-800/80 shadow-md shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 hover:border-purple-500 hover:-translate-y-1 transition-all space-y-2 group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-pink-500" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-purple-600" />
                            KHÁCH HÀNG
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white flex items-center justify-center text-lg shadow-md shadow-purple-500/30 group-hover:scale-110 transition-transform">
                            👥
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                        {thongKe.tongKhachHang} Tài Khoản
                    </div>
                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="text-slate-600 font-bold">Phân loại:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300 font-black text-xs border border-purple-300 dark:border-purple-800">
                            Thành viên đã kích hoạt
                        </span>
                    </div>
                </div>

                {/* Card 4: Kho Hàng (Emerald Vault) */}
                <div className="relative overflow-hidden p-5 rounded-3xl bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 border-teal-200/90 dark:border-teal-800/80 shadow-md shadow-teal-500/10 hover:shadow-xl hover:shadow-teal-500/20 hover:border-teal-500 hover:-translate-y-1 transition-all space-y-2 group">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-teal-600" />
                            KHO HÀNG
                        </span>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 text-white flex items-center justify-center text-lg shadow-md shadow-teal-500/30 group-hover:scale-110 transition-transform">
                            📦
                        </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white tracking-tight">
                        {thongKe.tongSanPham} Mặt Hàng
                    </div>
                    <div className="text-xs font-semibold flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="text-slate-600 font-bold">Tồn kho khả dụng:</span>
                        <span className="px-2.5 py-1 rounded-xl bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300 font-black text-xs border border-teal-300 dark:border-teal-800">
                            {thongKe.tongTonKho} chiếc sẵn sàng
                        </span>
                    </div>
                </div>
            </div>

            {/* HỆ THỐNG BIỂU ĐỒ TRỰC QUAN ĐA CHIỀU (RECHARTS) */}
            <div className="relative min-h-[360px]">
                <KhuVucDangTaiTable
                    dangTai={dangTai}
                    tieuDe="Đang tải dữ liệu biểu đồ phân tích..."
                    moTa="Tính toán doanh thu, cơ cấu ngành hàng và phân phối đơn hàng"
                />
                <div className={`transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <BieuDoTongQuan
                        danhSachDonHang={danhSachDonHang}
                        danhSachSanPham={danhSachSanPham}
                        thongKe={thongKe}
                        dinhDangTienVND={dinhDangTienVND}
                        xacDinhLoaiSanPham={xacDinhLoaiSanPham}
                    />
                </div>
            </div>

            {/* Bảng Đơn Mới & Top Bán Chạy */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Đơn Hàng Mới Nhất */}
                <div className="lg:col-span-7 bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white dark:from-[#0a1526] dark:via-blue-950/20 dark:to-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-blue-200/80 dark:border-blue-900/60 shadow-lg shadow-blue-500/5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs" />
                            ĐƠN HÀNG MỚI NHẤT
                        </h3>
                        <button
                            onClick={() => setTabHienTai('don_hang')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <span>Xem tất cả ({danhSachDonHang.length})</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="relative overflow-x-auto rounded-2xl border-2 border-slate-300 dark:border-slate-700 min-h-[200px]">
                        <KhuVucDangTaiTable
                            dangTai={dangTai}
                            tieuDe="Đang tải đơn hàng mới nhất..."
                            moTa="Cập nhật nhanh 5 đơn hàng vừa phát sinh"
                        />
                        <table className={`w-full min-w-[540px] text-left text-xs border-collapse transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider">
                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Mã Đơn</th>
                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Khách Hàng</th>
                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Tổng Tiền</th>
                                    <th className="py-2.5 px-3 border-b-2 border-r border-slate-300 dark:border-slate-700">Trạng Thái</th>
                                    <th className="py-2.5 px-3 text-center border-b-2 border-slate-300 dark:border-slate-700">Xem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donHangMoiNhat.map((dh) => (
                                    <tr key={dh.id || dh._id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50 transition-colors">
                                        <td className="py-2.5 px-3 font-mono font-black text-blue-600 dark:text-cyan-400 border-b border-r border-slate-200 dark:border-slate-800">
                                             {dh.ma_don_hang}
                                        </td>
                                        <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                            <div className="font-bold text-slate-900 dark:text-white text-xs">{dh.thong_tin_giao_hang?.ho_ten}</div>
                                            <div className="text-[11px] text-slate-500 font-mono">{dh.thong_tin_giao_hang?.so_dien_thoai}</div>
                                        </td>
                                        <td className="py-2.5 px-3 font-black text-xs text-red-600 dark:text-red-400 border-b border-r border-slate-200 dark:border-slate-800">
                                            {dinhDangTienVND(dh.tong_tien_thanh_toan)}
                                        </td>
                                        <td className="py-2.5 px-3 border-b border-r border-slate-200 dark:border-slate-800">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${dh.trang_thai === 'da_giao' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300/80' :
                                                dh.trang_thai === 'dang_giao' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300/80' :
                                                    dh.trang_thai === 'da_huy' ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300/80' :
                                                        'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300/80'
                                                }`}>
                                                {dh.trang_thai === 'da_giao' ? 'Thành công' :
                                                    dh.trang_thai === 'dang_giao' ? 'Đang giao' :
                                                        dh.trang_thai === 'da_huy' ? 'Đã hủy' : 'Chờ duyệt'}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-center border-b border-slate-200 dark:border-slate-800">
                                            <button
                                                onClick={() => setDonHangChiTiet(dh)}
                                                className="p-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 dark:bg-slate-800 dark:hover:bg-blue-600 transition-colors cursor-pointer shadow-2xs"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Bán Chạy */}
                <div className="lg:col-span-5 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white dark:from-[#1c1305] dark:via-amber-950/20 dark:to-[#0d1527] rounded-3xl p-5 sm:p-6 border-2 border-amber-200/80 dark:border-amber-900/60 shadow-lg shadow-orange-500/5 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-black text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                            TOP BÁN CHẠY
                        </h3>
                        <button
                            onClick={() => setTabHienTai('san_pham')}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                            <span>Xem kho máy</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                    <div className="relative space-y-3 min-h-[200px]">
                        <KhuVucDangTaiTable
                            dangTai={dangTai}
                            tieuDe="Đang tải top sản phẩm bán chạy..."
                            moTa="Xếp hạng theo sản lượng tiêu thụ"
                        />
                        <div className={`space-y-3 transition-opacity duration-300 ${dangTai ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            {topSanPhamBanChay.map((sp, idx) => (
                                <div key={sp.id || sp._id} className="flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/60 dark:to-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 hover:shadow-sm transition-all">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className={`w-6 h-6 rounded-lg font-black text-xs flex items-center justify-center shrink-0 ${idx === 0 ? 'bg-amber-400 text-slate-950 shadow-xs' : idx === 1 ? 'bg-slate-300 text-slate-900' : idx === 2 ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'}`}>
                                            {idx + 1}
                                        </span>
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 p-0.5 relative border border-slate-200 dark:border-slate-700 shrink-0">
                                            <Image src={sp.hinh_anh_chinh} alt={sp.ten_san_pham} fill className="object-contain p-0.5" />
                                        </div>
                                        <div className="min-w-0 truncate">
                                            <div className="font-bold text-xs text-slate-900 dark:text-white truncate">{sp.ten_san_pham}</div>
                                            <div className="text-xs text-red-600 dark:text-red-400 font-extrabold">{dinhDangTienVND(sp.gia_khuyen_mai)}</div>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0 pl-2">
                                        <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                                            {sp.so_luong_da_ban || 0} đã bán
                                        </div>
                                        <div className="text-[11px] text-slate-500 font-semibold">
                                            Còn: {sp.so_luong_ton_kho || 0}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
