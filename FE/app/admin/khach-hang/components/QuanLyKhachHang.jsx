'use client';
import {
    Search,
    UserPlus,
    Users,
    Mail,
    Phone,
    Clock,
    Calendar,
    Lock,
    Unlock,
    CheckCircle2,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import KhuVucDangTaiTable from '@/components/dieu-huong/KhuVucDangTaiTable';
import PhanTrangAdmin, { usePhanTrang } from '@/app/admin/components/shared/PhanTrangAdmin';

// Component Tab "Quản Lý Khách Hàng" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLyKhachHang({
    danhSachNguoiDung,
    danhSachKhachHangKemDoanhThu,
    tuKhoaKhachHang,
    setTuKhoaKhachHang,
    locKhachHang,
    setLocKhachHang,
    sapXepKhachHang,
    setSapXepKhachHang,
    moModalThemUser,
    khachHangHienThi,
    dangTai,
    dangLocKhachHang,
    dangXuLyUserId,
    layChiTietThoiGianKhachHang,
    xuLyKhoaNguoiDung,
    xuLyDoiVaiTroNguoiDung,
    moModalSuaUser,
    xuLyXoaUser
}) {
    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        viTriBatDau,
        danhSachTrenTrang
    } = usePhanTrang(khachHangHienThi, 10, [
        tuKhoaKhachHang,
        locKhachHang,
        sapXepKhachHang
    ]);

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Insight Cards (3 KPI Cards Gradient 3D Hiện Đại) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white dark:from-[#0d1527] dark:via-purple-950/20 dark:to-[#0a0f1d] border-2 border-indigo-200/80 dark:border-indigo-800/60 shadow-md shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-purple-500/35 ring-4 ring-white/80 dark:ring-purple-900/40 group-hover:scale-110 transition-transform">
                            👥
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Tổng Khách Hàng</div>
                            <div className="text-base sm:text-lg font-black font-mono text-indigo-950 dark:text-white leading-tight">
                                {danhSachNguoiDung.length} <span className="text-xs font-bold text-indigo-600/80 dark:text-indigo-400">Thành Viên</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/95 via-pink-50/50 to-orange-50/30 dark:from-[#1f0b12] dark:via-rose-950/30 dark:to-[#0d1527] border-2 border-rose-200 dark:border-rose-900/60 shadow-md shadow-rose-500/5 hover:shadow-xl hover:shadow-rose-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-rose-500/35 ring-4 ring-white/80 dark:ring-rose-900/40 group-hover:scale-110 transition-transform">
                            🔥
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">Khách Tiềm Năng</div>
                            <div className="text-base sm:text-lg font-black font-mono text-rose-600 dark:text-rose-400 leading-tight">
                                {danhSachKhachHangKemDoanhThu.filter(u => u.laTiemNang).length} <span className="text-xs font-bold text-rose-400/80">Khách Tiềm Năng</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-green-50/30 dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 border-emerald-200 dark:border-emerald-900/60 shadow-md shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-emerald-500/35 ring-4 ring-white/80 dark:ring-emerald-900/40 group-hover:scale-110 transition-transform">
                            💰
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Doanh Thu Từ Khách</div>
                            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 leading-tight">
                                {dinhDangTienVND(danhSachKhachHangKemDoanhThu.reduce((s, u) => s + (u.tongChiTieu || 0), 0))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar & Filter (Mỏng Nhẹ - Tiết Kiệm Không Gian) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-gradient-to-r from-slate-50/90 via-white to-indigo-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#111c35] px-4 py-3 rounded-3xl border-2 border-indigo-100/90 dark:border-slate-800 shadow-md shadow-indigo-500/5">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                    <div className="relative flex-1 sm:max-w-xs min-w-[200px]">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={tuKhoaKhachHang}
                            onChange={(e) => setTuKhoaKhachHang(e.target.value)}
                            placeholder="Tìm theo tên, email, sđt..."
                            className="w-full pl-8.5 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-colors"
                        />
                    </div>

                    <select
                        value={locKhachHang}
                        onChange={(e) => setLocKhachHang(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                        <option value="tat_ca">Tất cả khách hàng</option>
                        <option value="hoat_dong">🟢 Đang Hoạt Động</option>
                        <option value="cho_kich_hoat">⏳ Chờ Kích Hoạt OTP</option>
                        <option value="bi_khoa">🔒 Tài Khoản Đang Khóa</option>
                        <option value="da_mua">🛍️ Đã Mua Hàng</option>
                        <option value="chua_mua">👤 Chưa Có Đơn Hàng</option>
                        <option value="tiem_nang">🔥 Khách Chi Tiêu Cao</option>
                        <option value="admin">👑 Quản Trị Viên</option>
                    </select>

                    <select
                        value={sapXepKhachHang}
                        onChange={(e) => setSapXepKhachHang(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-600 cursor-pointer"
                    >
                        <option value="ngay_tao_moi">📅 Mới đăng ký gần đây</option>
                        <option value="doanh_thu_giam">💰 Doanh thu cao → thấp</option>
                        <option value="diem_giam">⭐ Điểm tích lũy cao</option>
                        <option value="ten_az">🔤 Tên A - Z</option>
                    </select>
                </div>

                <button
                    onClick={moModalThemUser}
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 !text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/25 cursor-pointer whitespace-nowrap transition-all border border-emerald-800"
                >
                    <UserPlus className="w-3.5 h-3.5 !text-white" />
                    <span className="!text-white">+ Thêm Tài Khoản</span>
                </button>
            </div>

            {/* Bảng Khách Hàng Tinh Gọn - Trực Quan - Fit 1 Màn Hình */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-400 dark:border-slate-600 shadow-lg shadow-slate-900/10 overflow-hidden flex flex-col">
                {/* Banner Tiêu Đề Bảng */}
                <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-700 text-white px-4 py-3 flex items-center justify-between gap-2 shadow-md shrink-0">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-200" />
                        <h3 className="font-black text-xs uppercase tracking-wider text-white">
                            Danh Sách Tài Khoản Khách Hàng
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black">
                            {khachHangHienThi.length} tài khoản
                        </span>
                    </div>
                    <div className="text-[10px] text-blue-100 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Dữ liệu thời gian thực</span>
                    </div>
                </div>

                <KhuVucDangTaiTable
                    dangTai={dangTai || dangLocKhachHang}
                    tieuDe={dangLocKhachHang ? "Đang lọc danh sách khách hàng..." : "Đang nạp danh sách khách hàng & thành viên..."}
                    moTa={dangLocKhachHang ? `Tìm thấy ${khachHangHienThi.length} tài khoản phù hợp` : "Đồng bộ số liệu chi tiêu, đơn hàng và quyền hạn tài khoản"}
                />

                {/* Container Cuộn Nội Bộ Mượt Mà (Fit Trong 1 Màn Hình, Header Cố Định) */}
                <div className={`overflow-x-auto overflow-y-auto max-h-[calc(100vh-275px)] min-h-[350px] transition-opacity duration-300 ${dangTai || dangLocKhachHang ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                        <thead className="sticky top-0 z-10 bg-slate-200 dark:bg-slate-800 shadow-sm">
                            <tr className="text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">#</th>
                                <th className="py-2.5 px-3 min-w-[220px] border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">KHÁCH HÀNG & LIÊN HỆ</th>
                                <th className="py-2.5 px-3 w-40 text-center border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">NGÀY TẠO (GIỜ & NGÀY)</th>
                                <th className="py-2.5 px-3 w-44 border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">DOANH THU & ĐƠN HÀNG</th>
                                <th className="py-2.5 px-2.5 w-28 text-center border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">TRẠNG THÁI</th>
                                <th className="py-2.5 px-2.5 w-28 text-center border-b-2 border-r border-slate-400 dark:border-slate-600 whitespace-nowrap">PHÂN QUYỀN</th>
                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-slate-400 dark:border-slate-600 whitespace-nowrap">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {khachHangHienThi.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Users className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy khách hàng nào</div>
                                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSachTrenTrang.map((user, idx) => {
                                    const uId = user.id || user._id;
                                    const dangXuLy = dangXuLyUserId === uId;
                                    const daBiKhoa = Boolean(user.biKhoa || user.trangThai === 'bi_khoa');
                                    const chuaKichHoat = user.daKichHoat === false || user.trangThai === 'cho_kich_hoat';
                                    const thoiGian = layChiTietThoiGianKhachHang(user);
                                    return (
                                        <tr
                                            key={uId}
                                            className={`transition-all duration-150 ${
                                                daBiKhoa
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : chuaKichHoat
                                                    ? 'bg-amber-100/70 dark:bg-amber-950/35 hover:!bg-amber-200/70 dark:hover:!bg-amber-950/55'
                                                    : 'odd:bg-white even:bg-slate-100/80 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-100/80 dark:hover:!bg-blue-950/45'
                                            }`}
                                        >
                                            {/* Cột 1: STT */}
                                            <td className={`py-2 px-2 text-center font-bold border-b border-r whitespace-nowrap ${
                                                daBiKhoa ? 'border-rose-300 dark:border-rose-800/70 text-rose-700 dark:text-rose-300 font-black' : chuaKichHoat ? 'border-slate-300 dark:border-slate-700 text-amber-700 dark:text-amber-300 font-black' : 'border-slate-300 dark:border-slate-700 text-slate-500'
                                            }`}>
                                                #{viTriBatDau + idx + 1}
                                            </td>

                                            {/* Cột 2: KHÁCH HÀNG & LIÊN HỆ (Gom Tên + Email + SĐT) */}
                                            <td className={`py-2 px-3 border-b border-r ${daBiKhoa ? 'border-rose-300 dark:border-rose-800/70' : 'border-slate-300 dark:border-slate-700'}`}>
                                                <div className="flex items-center gap-2.5 min-w-[210px]">
                                                    <div className={`w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                                                        daBiKhoa ? 'bg-gradient-to-tr from-rose-600 to-red-500' : chuaKichHoat ? 'bg-gradient-to-tr from-amber-500 to-orange-400' : 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                                                    }`}>
                                                        {user.hoTen?.charAt(0)?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {daBiKhoa && (
                                                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs shrink-0">
                                                                    ĐÃ KHÓA
                                                                </span>
                                                            )}
                                                            <span className={`font-extrabold text-xs whitespace-nowrap ${daBiKhoa ? 'text-rose-950 dark:text-rose-100 line-through' : 'text-slate-900 dark:text-white'}`}>
                                                                {user.hoTen || 'Khách Hàng'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                                                            <span className="truncate max-w-[150px] lg:max-w-[190px] flex items-center gap-1" title={user.email}>
                                                                <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                                                                <span>{user.email}</span>
                                                            </span>
                                                            <span className="text-slate-300 dark:text-slate-600">•</span>
                                                            <span className="font-bold text-slate-700 dark:text-slate-300 shrink-0 flex items-center gap-1">
                                                                <Phone className="w-3 h-3 text-emerald-500 shrink-0" />
                                                                <span>{user.soDienThoai || 'Chưa có SĐT'}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 3: NGÀY TẠO (GIỜ & NGÀY CHUẨN VIỆT NAM) */}
                                            <td className="py-2 px-3 text-center border-b border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                <div className="flex flex-col items-center justify-center gap-0.5 font-mono" title={`Thời gian tạo: ${thoiGian.full}`}>
                                                    <div className="flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400">
                                                        <Clock className="w-3 h-3 text-blue-500 shrink-0" />
                                                        <span>{thoiGian.gio}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span>{thoiGian.ngay}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 4: DOANH THU & ĐƠN HÀNG (SẠCH SẼ - KHÔNG HẠNG THÀNH VIÊN) */}
                                            <td className="py-2 px-3 border-b border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                <div>
                                                    <div className="font-black text-xs text-red-600 dark:text-red-400">
                                                        {dinhDangTienVND(user.tongChiTieu || 0)}
                                                    </div>
                                                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-0.5 whitespace-nowrap">
                                                        {user.soDonHang > 0 ? `${user.soDonHang} đơn hàng đã mua` : 'Chưa có đơn hàng'}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột 5: TRẠNG THÁI */}
                                            <td className="py-2 px-2.5 text-center border-b border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                {chuaKichHoat ? (
                                                    <span
                                                        className="px-2 py-0.5 rounded-full text-[11px] font-black inline-flex items-center justify-center gap-1 whitespace-nowrap bg-amber-200 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-400 shadow-2xs"
                                                        title="Tài khoản chưa hoàn tất xác thực OTP"
                                                    >
                                                        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                                        <span>Chờ OTP</span>
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => xuLyKhoaNguoiDung(user)}
                                                        disabled={dangXuLy}
                                                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-black inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all shadow-2xs cursor-pointer ${
                                                            dangXuLy ? 'opacity-50 cursor-not-allowed' : ''
                                                        } ${
                                                            daBiKhoa
                                                                ? 'bg-red-200 text-red-800 hover:bg-red-300 dark:bg-red-950 dark:text-red-200 border border-red-300 dark:border-red-800'
                                                                : 'bg-emerald-200 text-emerald-900 hover:bg-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800'
                                                        }`}
                                                        title={daBiKhoa ? 'Tài khoản đang bị khóa tạm thời. Bấm để mở khóa!' : 'Tài khoản đang hoạt động bình thường. Bấm để tạm khóa!'}
                                                    >
                                                        {daBiKhoa ? (
                                                            <>
                                                                <Lock className="w-3 h-3 text-red-600 dark:text-red-400 shrink-0" />
                                                                <span>Tạm Khóa</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                                <span>Hoạt Động</span>
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="py-2 px-2.5 text-center border-b border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                <button
                                                    onClick={() => xuLyDoiVaiTroNguoiDung(user)}
                                                    disabled={dangXuLy}
                                                    className={`px-2 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all border ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${user.vaiTro === 'admin' ? 'bg-purple-200 text-purple-900 hover:bg-purple-300 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800' : 'bg-slate-200 text-slate-800 hover:bg-slate-300 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600'}`}
                                                    title="Bấm để đổi quyền quản trị"
                                                >
                                                    {dangXuLy && <Loader2 className="w-3 h-3 animate-spin shrink-0" />}
                                                    <span className="whitespace-nowrap">{user.vaiTro === 'admin' ? '👑 Quản Trị' : 'Khách Hàng'}</span>
                                                </button>
                                            </td>
                                            <td className="py-2 px-1.5 text-center border-b border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                    {/* Nút Khóa / Mở Khóa Nhanh */}
                                                    <button
                                                        onClick={() => xuLyKhoaNguoiDung(user)}
                                                        disabled={dangXuLy}
                                                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                                            daBiKhoa
                                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800'
                                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200 border border-amber-300 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800'
                                                        }`}
                                                        title={daBiKhoa ? 'Mở khóa tài khoản' : 'Khóa tài khoản tạm thời'}
                                                    >
                                                        {daBiKhoa ? (
                                                            <Unlock className="w-3.5 h-3.5" />
                                                        ) : (
                                                            <Lock className="w-3.5 h-3.5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => moModalSuaUser(user)}
                                                        disabled={dangXuLy}
                                                        className={`p-1.5 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300 dark:bg-blue-950/70 dark:text-blue-300 dark:border-blue-800 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Sửa tài khoản"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => xuLyXoaUser(user)}
                                                        disabled={dangXuLy}
                                                        className={`p-1.5 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 border border-red-300 dark:bg-red-950/70 dark:text-red-300 dark:border-red-800 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Xóa tài khoản"
                                                    >
                                                        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc="khách hàng"
                />
            </div>
        </div>
    );
}
