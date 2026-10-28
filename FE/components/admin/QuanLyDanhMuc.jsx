'use client';
import {
    Search,
    Plus,
    Tag,
    Loader2,
    Edit3,
    Trash2
} from 'lucide-react';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';
import PhanTrangAdmin, { usePhanTrang } from '@/components/admin/PhanTrangAdmin';

// Component Tab "Danh Mục / Thương Hiệu" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLyDanhMuc({
    danhMucHienThi,
    locLoaiDanhMuc,
    setLocLoaiDanhMuc,
    danhSachDanhMuc = [],
    danhSachSanPham,
    tuKhoaDanhMuc,
    setTuKhoaDanhMuc,
    moModalThemDanhMuc,
    dangTai,
    dangLocDanhMuc,
    dangXuLyDmId,
    dangLuuDanhMuc,
    xuLyToggleDanhMuc,
    moModalSuaDanhMuc,
    xuLyXoaDanhMuc
}) {
    const hangLaptop = danhSachDanhMuc.filter(d => d.loai === 'thuong_hieu' && d.nhom_hang !== 'phu_kien');
    const hangPhuKien = danhSachDanhMuc.filter(d => d.loai === 'thuong_hieu' && d.nhom_hang === 'phu_kien');
    const TAB_LOAI = [
        { ma: 'thuong_hieu', nhan: 'Thương hiệu', moTa: 'Hãng sản xuất: ASUS, Logitech...', soLuong: hangLaptop.length + hangPhuKien.length },
        { ma: 'loai_san_pham', nhan: 'Loại sản phẩm', moTa: 'Bàn phím, Chuột, Balo...', soLuong: danhSachDanhMuc.filter(d => d.loai === 'loai_san_pham').length },
        { ma: 'nhu_cau', nhan: 'Nhu cầu laptop', moTa: 'Gaming, Sinh viên, Doanh nhân...', soLuong: danhSachDanhMuc.filter(d => d.loai === 'nhu_cau').length }
    ];
    const tabHienTai = TAB_LOAI.find(t => t.ma === locLoaiDanhMuc) || TAB_LOAI[0];
    const tenLoai = locLoaiDanhMuc === 'loai_san_pham' ? 'loại sản phẩm' : locLoaiDanhMuc === 'nhu_cau' ? 'nhu cầu' : 'thương hiệu';

    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        danhSachTrenTrang
    } = usePhanTrang(danhMucHienThi, 12, [
        tuKhoaDanhMuc,
        locLoaiDanhMuc
    ]);

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* Chọn nhóm: Thương hiệu / Loại sản phẩm / Nhu cầu */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {TAB_LOAI.map(t => (
                    <button
                        key={t.ma}
                        onClick={() => setLocLoaiDanhMuc(t.ma)}
                        className={`text-left px-4 py-2.5 rounded-2xl border-2 transition-all cursor-pointer ${locLoaiDanhMuc === t.ma ? 'bg-purple-600 border-purple-600 !text-white shadow-lg shadow-purple-500/25' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-purple-400'}`}
                    >
                        <div className="font-black text-sm">{t.nhan} ({t.soLuong})</div>
                        <div className={`text-[11px] font-semibold ${locLoaiDanhMuc === t.ma ? 'text-purple-100' : 'text-slate-500'}`}>{t.moTa}</div>
                    </button>
                ))}
            </div>

            {/* 3 KPI Cards Thương Hiệu Gradient 3D */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-50/90 via-fuchsia-50/40 to-white dark:from-[#180924] dark:via-purple-950/30 dark:to-[#0b1120] border-2 border-purple-200/90 dark:border-purple-800/80 shadow-md shadow-purple-500/5 hover:shadow-xl hover:shadow-purple-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 via-fuchsia-600 to-indigo-600 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-purple-500/35 ring-4 ring-white/80 dark:ring-purple-900/40 group-hover:scale-110 transition-transform">
                            🏷️
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-purple-900 dark:text-purple-200 uppercase tracking-wider">Tổng Thương Hiệu</div>
                            <div className="text-base sm:text-lg font-black font-mono text-purple-950 dark:text-white leading-tight">
                                {hangLaptop.length + hangPhuKien.length} <span className="text-xs font-bold text-purple-600/80 dark:text-purple-400">Hãng Đối Tác</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-blue-50/90 via-sky-50/40 to-white dark:from-[#0a1526] dark:via-blue-950/30 dark:to-[#0b1120] border-2 border-blue-200/90 dark:border-blue-800/80 shadow-md shadow-blue-500/5 hover:shadow-xl hover:shadow-blue-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-600 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-blue-500/35 ring-4 ring-white/80 dark:ring-blue-900/40 group-hover:scale-110 transition-transform">
                            💻
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider">Hãng Laptop Chính Hãng</div>
                            <div className="text-base sm:text-lg font-black font-mono text-blue-700 dark:text-blue-400 leading-tight">
                                {hangLaptop.length} <span className="text-xs font-bold text-blue-500/80">{hangLaptop.slice(0, 7).map(h => h.ten_danh_muc).join(', ')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50/95 via-orange-50/60 to-rose-50/40 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-[#0d1527] border-2 border-amber-300 dark:border-amber-700/80 shadow-md shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-orange-500/35 ring-4 ring-white/80 dark:ring-amber-900/40 group-hover:scale-110 transition-transform">
                            🎮
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">Phụ Kiện & Custom Gear</div>
                            <div className="text-base sm:text-lg font-black font-mono text-amber-700 dark:text-amber-400 leading-tight">
                                {hangPhuKien.length} <span className="text-xs font-bold text-amber-600/80">{hangPhuKien.slice(0, 3).map(h => h.ten_danh_muc).join(', ')}...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/90 via-white to-purple-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#1a0f2b] p-5 rounded-3xl border-2 border-purple-100/90 dark:border-slate-800 shadow-md shadow-purple-500/5">
                <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                    <div>
                        <h2 className="text-base font-black text-slate-900 dark:text-white">{tabHienTai.nhan} ({danhMucHienThi.length})</h2>
                        <p className="text-xs text-slate-500 font-semibold">{tabHienTai.moTa}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={tuKhoaDanhMuc}
                            onChange={(e) => setTuKhoaDanhMuc(e.target.value)}
                            placeholder={`Tìm ${tenLoai}...`}
                            className="w-full pl-9 pr-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                        />
                    </div>

                    <button
                        onClick={moModalThemDanhMuc}
                        className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 !text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 cursor-pointer whitespace-nowrap shrink-0 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus className="w-4 h-4 !text-white" />
                        <span className="!text-white capitalize">Thêm {tenLoai}</span>
                    </button>
                </div>
            </div>

            {/* Bảng Danh Mục / Thương Hiệu (Excel-Style Grid Sắc Nét) */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-purple-200" />
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Danh sách {tenLoai}
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                            {danhMucHienThi.length} mục
                        </span>
                    </div>
                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Cập nhật trực tiếp</span>
                    </div>
                </div>

                <KhuVucDangTaiTable
                    dangTai={dangTai || dangLocDanhMuc}
                    tieuDe={dangLocDanhMuc ? "Đang lọc thương hiệu..." : "Đang tải danh sách thương hiệu..."}
                    moTa={dangLocDanhMuc ? `Tìm thấy ${danhMucHienThi.length} thương hiệu phù hợp` : "Đồng bộ danh sách thương hiệu đối tác trên hệ thống"}
                />

                <div className={`p-3 sm:p-4 transition-opacity duration-300 ${dangTai || dangLocDanhMuc ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    {danhMucHienThi.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
                            <Tag className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy {tenLoai} nào</div>
                            <div className="text-xs">Vui lòng thử tìm kiếm với từ khóa khác</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                            {danhSachTrenTrang.map((dm) => {
                                const soMauCuaHang = danhSachSanPham.filter(s => s.hang_san_xuat?.toLowerCase() === dm.ma_danh_muc?.toLowerCase() || s.danh_muc?.includes(dm.ma_danh_muc)).length;
                                const dmId = dm.id || dm._id || dm.ma_danh_muc;
                                const dangXuLyItem = dangXuLyDmId === dmId;
                                const dangXuLyChung = dangXuLyDmId !== null || dangLuuDanhMuc;
                                const daAnDm = dm.kich_hoat === false;

                                return (
                                    <div
                                        key={dmId}
                                        className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-2xl border transition-colors ${daAnDm ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900' : 'bg-slate-50/70 dark:bg-[#090f1d] border-slate-200 dark:border-slate-800 hover:border-purple-300 hover:bg-purple-50/40'}`}
                                    >
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`font-black text-sm truncate ${daAnDm ? 'text-rose-900 dark:text-rose-100' : 'text-slate-900 dark:text-white'}`}>{dm.ten_danh_muc}</span>
                                                {daAnDm && <span className="px-1.5 rounded text-[9px] font-black bg-rose-600 text-white shrink-0">ĐÃ ẨN</span>}
                                            </div>
                                            <div className="flex items-center gap-2 text-[11px] mt-0.5">
                                                <span className="font-mono font-bold text-blue-600 dark:text-cyan-400 truncate">@{dm.ma_danh_muc}</span>
                                                <span className="px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-black whitespace-nowrap">{soMauCuaHang} sp</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 shrink-0">
                                            <button
                                                onClick={() => xuLyToggleDanhMuc(dm)}
                                                disabled={dangXuLyChung}
                                                title={daAnDm ? 'Đang ẩn, bấm để bật lại' : 'Đang bán, bấm để ẩn'}
                                                className={`w-9 h-5 rounded-full relative transition-colors ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${daAnDm ? 'bg-rose-400' : 'bg-emerald-500'}`}
                                            >
                                                {dangXuLyItem
                                                    ? <Loader2 className="w-3 h-3 animate-spin absolute top-1 left-3 text-white" />
                                                    : <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${daAnDm ? 'left-0.5' : 'left-[18px]'}`} />}
                                            </button>
                                            <button
                                                onClick={() => moModalSuaDanhMuc(dm)}
                                                disabled={dangXuLyChung}
                                                title="Sửa"
                                                className={`p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-400 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <Edit3 className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => xuLyXoaDanhMuc(dm)}
                                                disabled={dangXuLyChung}
                                                title="Xóa"
                                                className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-400 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc={tenLoai}
                    tuyChonSoMuc={[12, 24, 48, 96]}
                />
            </div>
        </div>
    );
}
