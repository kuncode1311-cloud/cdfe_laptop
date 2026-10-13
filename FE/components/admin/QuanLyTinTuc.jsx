'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
    Search,
    Plus,
    Newspaper,
    Flame,
    Eye,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react';
import { slugTinTuc } from '@/utils/taoSlug';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

// Component Tab "Tin Tức & Bài Viết" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLyTinTuc({
    danhSachTinTuc,
    thongKe,
    tuKhoaTinTuc,
    setTuKhoaTinTuc,
    locChuyenMucTinTuc,
    setLocChuyenMucTinTuc,
    locTrangThaiTinTuc,
    setLocTrangThaiTinTuc,
    moModalThemTinTuc,
    tinTucHienThi,
    dangTai,
    dangLocTinTuc,
    dangXuLyTinTucId,
    xuLyToggleTieuDiemTinTuc,
    xuLyToggleXuatBanTinTuc,
    moModalSuaTinTuc,
    xuLyXoaTinTuc
}) {
    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Insight Cards (3 KPI Cards Gradient 3D Hiện Đại) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-teal-50/40 to-white dark:from-[#081a20] dark:via-teal-950/30 dark:to-[#0d1527] border-2 border-teal-200 dark:border-teal-900/60 shadow-md shadow-teal-500/5 hover:shadow-xl hover:shadow-teal-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-xs font-black text-teal-900 dark:text-teal-200 uppercase tracking-wider">Tổng Bài Viết</div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-teal-950 dark:text-white mt-1">{danhSachTinTuc.length} Bài Đăng</div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center text-xl shadow-lg shadow-teal-500/35 ring-4 ring-white/80 dark:ring-teal-900/40 shrink-0 group-hover:scale-110 transition-transform">
                        📰
                    </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/95 via-orange-50/50 to-amber-50/30 dark:from-[#1f0b12] dark:via-rose-950/30 dark:to-[#0d1527] border-2 border-rose-200 dark:border-rose-900/60 shadow-md shadow-rose-500/5 hover:shadow-xl hover:shadow-rose-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-xs font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">Bài Tiêu Điểm 2026</div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-rose-600 dark:text-rose-400 mt-1">
                            {danhSachTinTuc.filter(t => t.la_tieu_diem).length} Bài Hot
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 text-white flex items-center justify-center text-xl shadow-lg shadow-rose-500/35 ring-4 ring-white/80 dark:ring-rose-900/40 shrink-0 group-hover:scale-110 transition-transform">
                        🔥
                    </div>
                </div>

                <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-green-50/30 dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 border-emerald-200 dark:border-emerald-900/60 shadow-md shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Tổng Lượt Xem Đọc</div>
                        <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                            {thongKe.tongLuotXemTin.toLocaleString('vi-VN')} Lượt
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 text-white flex items-center justify-center text-xl shadow-lg shadow-emerald-500/35 ring-4 ring-white/80 dark:ring-emerald-900/40 shrink-0 group-hover:scale-110 transition-transform">
                        👁️
                    </div>
                </div>
            </div>

            {/* Toolbar & Filter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/90 via-white to-teal-50/40 dark:from-[#081a20] dark:via-slate-900 dark:to-[#111c35] p-5 rounded-3xl border-2 border-teal-100/90 dark:border-slate-800 shadow-md shadow-teal-500/5">
                <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={tuKhoaTinTuc}
                            onChange={(e) => setTuKhoaTinTuc(e.target.value)}
                            placeholder="Tìm theo tiêu đề, tác giả..."
                            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                        />
                    </div>

                    <select
                        value={locChuyenMucTinTuc}
                        onChange={(e) => setLocChuyenMucTinTuc(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                        <option value="tat_ca">Tất cả chuyên mục</option>
                        <option value="Tư Vấn Mua Sắm">Tư Vấn Mua Sắm</option>
                        <option value="Xu Hướng Công Nghệ">Xu Hướng Công Nghệ</option>
                        <option value="Đánh Giá & So Sánh">Đánh Giá & So Sánh</option>
                        <option value="Tin Tức Công Nghệ">Tin Tức Công Nghệ</option>
                        <option value="Chia Sẻ Kinh Nghiệm">Chia Sẻ Kinh Nghiệm</option>
                    </select>

                    <select
                        value={locTrangThaiTinTuc}
                        onChange={(e) => setLocTrangThaiTinTuc(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                    >
                        <option value="tat_ca">Tất cả trạng thái</option>
                        <option value="xuat_ban">🟢 Đã xuất bản</option>
                        <option value="ban_nhap">⚪ Bản nháp / Tạm ẩn</option>
                    </select>
                </div>

                <button
                    onClick={moModalThemTinTuc}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-teal-500/25 transition-all cursor-pointer whitespace-nowrap"
                >
                    <Plus className="w-4 h-4 !text-white" />
                    <span className="!text-white">+ Viết Bài Tin Tức Mới</span>
                </button>
            </div>

            {/* Bảng Danh Sách Bài Viết Chuẩn Magazine (Excel-Style Grid Sắc Nét) */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-2">
                        <Newspaper className="w-4 h-4 text-teal-200" />
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Danh Sách Bài Viết & Tin Tức Công Nghệ
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                            {tinTucHienThi.length} bài viết
                        </span>
                    </div>
                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Xuất bản trực tiếp</span>
                    </div>
                </div>

                <KhuVucDangTaiTable
                    dangTai={dangTai || dangLocTinTuc}
                    tieuDe={dangLocTinTuc ? "Đang lọc danh sách bài viết..." : "Đang tải danh sách bài viết & tin tức..."}
                    moTa={dangLocTinTuc ? `Tìm thấy ${tinTucHienThi.length} bài viết phù hợp` : "Đồng bộ nội dung công nghệ, lượt xem và bài viết tiêu điểm"}
                />

                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocTinTuc ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">#</th>
                                <th className="py-2.5 px-2 w-14 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ẢNH</th>
                                <th className="py-2.5 px-2.5 min-w-[150px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TIÊU ĐỀ & TÓM TẮT BÀI VIẾT</th>
                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">CHUYÊN MỤC</th>
                                <th className="py-2.5 px-2 w-32 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TÁC GIẢ & NGÀY</th>
                                <th className="py-2.5 px-2 w-16 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">LƯỢT XEM</th>
                                <th className="py-2.5 px-2 w-24 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TIÊU ĐIỂM</th>
                                <th className="py-2.5 px-2 w-28 min-w-[110px] text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                <th className="py-2.5 px-1.5 w-16 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tinTucHienThi.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy bài viết nào</div>
                                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                tinTucHienThi.map((tin, idx) => {
                                    const tinId = tin.id || tin._id;
                                    const dangXuLy = dangXuLyTinTucId === tinId;
                                    const daAnTin = tin.xuat_ban === false;
                                    return (
                                        <tr
                                            key={tinId}
                                            className={`transition-colors duration-150 ${
                                                daAnTin
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : 'odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50'
                                            }`}
                                        >
                                            <td className={`py-2 px-2 text-center font-bold border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-black' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                                                #{idx + 1}
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="w-10 h-7 rounded-lg bg-slate-950 overflow-hidden relative mx-auto border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs">
                                                    <Image src={tin.hinh_anh} alt={tin.tieu_de} fill className="object-cover" />
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2.5 max-w-sm border-b border-r ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {daAnTin && (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs shrink-0">
                                                            ĐÃ ẨN
                                                        </span>
                                                    )}
                                                    <div className={`font-extrabold text-xs line-clamp-1 ${daAnTin ? 'text-rose-950 dark:text-rose-100' : 'text-slate-900 dark:text-white'}`} title={tin.tieu_de}>
                                                        {tin.tieu_de}
                                                    </div>
                                                </div>
                                                <div className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${daAnTin ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-500'}`} title={tin.tom_tat}>
                                                    {tin.tom_tat}
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <span className="inline-block px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-black text-xs whitespace-nowrap">
                                                    {tin.chuyen_muc}
                                                </span>
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">{tin.tac_gia}</span>
                                                    <span className="text-[11px] text-slate-400 font-semibold">({tin.ngay_dang || '24/08/2026'})</span>
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <span className="font-black text-xs text-emerald-600 dark:text-emerald-400">
                                                    {tin.luot_xem || 120}
                                                </span>
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => xuLyToggleTieuDiemTinTuc(tin)}
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                        tin.la_tieu_diem
                                                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800 ring-1 ring-rose-500/20 hover:bg-rose-100'
                                                            : 'bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200'
                                                    }`}
                                                    title={tin.la_tieu_diem ? 'Đang là tin tiêu điểm - Bấm để bỏ ghim' : 'Bấm để ghim tin tiêu điểm'}
                                                >
                                                    <Flame className={`w-3 h-3 ${tin.la_tieu_diem ? 'text-rose-600 fill-rose-600 animate-pulse' : 'text-slate-400'}`} />
                                                    <span className="whitespace-nowrap">{tin.la_tieu_diem ? 'Tiêu điểm' : 'Thường'}</span>
                                                </button>
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <button
                                                    type="button"
                                                    onClick={() => xuLyToggleXuatBanTinTuc(tin)}
                                                    className={`px-2.5 py-0.5 rounded-full text-xs font-black inline-flex items-center justify-center gap-1.5 whitespace-nowrap transition-all cursor-pointer shadow-2xs active:scale-95 ${
                                                        tin.xuat_ban !== false
                                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 ring-1 ring-emerald-500/20 hover:bg-emerald-100'
                                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border border-rose-300 dark:border-rose-800 hover:bg-rose-200'
                                                    }`}
                                                    title={tin.xuat_ban !== false ? 'Đang xuất bản - Bấm để chuyển về bản nháp (nền đỏ)' : 'Bản nháp (nền đỏ) - Bấm để xuất bản ngay'}
                                                >
                                                    <span className={`w-2 h-2 rounded-full shrink-0 ${tin.xuat_ban !== false ? 'bg-emerald-500 animate-pulse' : 'bg-rose-600'}`} />
                                                    <span className="whitespace-nowrap">{tin.xuat_ban !== false ? 'Xuất bản' : 'Bản nháp (Đã ẩn)'}</span>
                                                </button>
                                            </td>
                                            <td className={`py-2 px-1.5 text-center border-b whitespace-nowrap ${daAnTin ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                    <Link
                                                        href={`/tin-tuc/${slugTinTuc(tin)}`}
                                                        target="_blank"
                                                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 cursor-pointer transition-colors"
                                                        title="Xem bài viết ngoài trang chủ"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => moModalSuaTinTuc(tin)}
                                                        disabled={dangXuLy}
                                                        className={`p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Chỉnh sửa bài viết"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => xuLyXoaTinTuc(tin)}
                                                        disabled={dangXuLy}
                                                        className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Xóa bài viết"
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
            </div>
        </div>
    );
}
