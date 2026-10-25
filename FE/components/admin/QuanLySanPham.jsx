'use client';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
    Boxes,
    Laptop,
    Sparkles,
    PackageCheck,
    Search,
    X,
    Plus,
    Package,
    Flame,
    ExternalLink,
    Edit3,
    Trash2,
    Loader2
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

// Component Tab "Kho Sản Phẩm" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLySanPham({
    locNganhHang,
    setLocNganhHang,
    locHangSanPham,
    setLocHangSanPham,
    danhSachSanPham,
    thongKe,
    sanPhamHienThi,
    tuKhoaSanPham,
    setTuKhoaSanPham,
    moModalThemSp,
    locTonKhoSanPham,
    setLocTonKhoSanPham,
    sapXepSanPham,
    setSapXepSanPham,
    danhSachHangThucTe,
    dangTai,
    dangLocSanPham,
    layThongSoNhanhAdmin,
    dangXuLySpId,
    dangLuuSp,
    setModalXemAnh,
    xuLyToggleConHang,
    xuLyToggleFlashSale,
    moModalSuaSp,
    xuLyXoaSanPham
}) {
    const SO_SAN_PHAM_MOI_TRANG = 10;
    const [trangHienTai, setTrangHienTai] = useState(1);
    const tongSoTrang = Math.max(1, Math.ceil(sanPhamHienThi.length / SO_SAN_PHAM_MOI_TRANG));
    const danhSachTrenTrang = useMemo(() => {
        const batDau = (trangHienTai - 1) * SO_SAN_PHAM_MOI_TRANG;
        return sanPhamHienThi.slice(batDau, batDau + SO_SAN_PHAM_MOI_TRANG);
    }, [sanPhamHienThi, trangHienTai]);

    useEffect(() => {
        setTrangHienTai(1);
    }, [tuKhoaSanPham, locNganhHang, locHangSanPham, locTonKhoSanPham, sapXepSanPham]);

    useEffect(() => {
        if (trangHienTai > tongSoTrang) setTrangHienTai(tongSoTrang);
    }, [tongSoTrang, trangHienTai]);

    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* 4 KPI Cards Kho Sản Phẩm Gradient 3D Hiện Đại */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* Thẻ 1: Tổng Sản Phẩm */}
                <div
                    onClick={() => { setLocNganhHang('tat_ca'); setLocHangSanPham('tat_ca'); }}
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-cyan-50/90 via-teal-50/40 to-white dark:from-[#081a20] dark:via-teal-950/30 dark:to-[#0d1527] border-2 border-teal-200/90 dark:border-teal-900/60 shadow-md shadow-teal-500/5 hover:shadow-xl hover:shadow-teal-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
                >
                    <Boxes className="absolute -right-3 -bottom-3 w-24 h-24 text-teal-500/10 dark:text-teal-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 via-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/35 ring-4 ring-white/80 dark:ring-teal-900/40 group-hover:scale-110 transition-transform">
                            <Boxes className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300">
                                Kho Hàng
                            </span>
                            <div className="w-6 h-6 rounded-full bg-teal-100/80 text-teal-600 dark:bg-teal-900/60 dark:text-teal-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 relative z-10">
                        <div className="text-xs font-black text-teal-900 dark:text-teal-200 uppercase tracking-wider">Tổng Mẫu Máy</div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-teal-950 dark:text-white mt-0.5 tracking-tight">
                            {danhSachSanPham.length}
                        </div>
                        <div className="text-[11px] font-bold text-teal-700 dark:text-teal-400 mt-1">Đang quản lý trên website</div>
                    </div>
                </div>

                {/* Thẻ 2: Laptop & AI PC */}
                <div
                    onClick={() => setLocNganhHang('laptop')}
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-indigo-50/90 via-purple-50/40 to-white dark:from-[#0d1527] dark:via-purple-950/20 dark:to-[#0a0f1d] border-2 border-indigo-200/90 dark:border-indigo-900/60 shadow-md shadow-indigo-500/5 hover:shadow-xl hover:shadow-indigo-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
                >
                    <Laptop className="absolute -right-3 -bottom-3 w-24 h-24 text-indigo-500/10 dark:text-purple-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/35 ring-4 ring-white/80 dark:ring-purple-900/40 group-hover:scale-110 transition-transform">
                            <Laptop className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                                Chủ Lực
                            </span>
                            <div className="w-6 h-6 rounded-full bg-indigo-100/80 text-indigo-600 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 relative z-10">
                        <div className="text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider">Laptop Gaming & AI</div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-950 dark:text-white mt-0.5 tracking-tight">
                            {thongKe.soLuongLaptop || 0}
                        </div>
                        <div className="text-[11px] font-bold text-indigo-600/80 dark:text-indigo-400 mt-1">Dòng máy cao cấp & Gaming</div>
                    </div>
                </div>

                {/* Thẻ 3: Gear & Phụ Kiện */}
                <div
                    onClick={() => setLocNganhHang('phu-kien-gear')}
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-50/95 via-orange-50/60 to-rose-50/40 dark:from-amber-950/40 dark:via-orange-950/30 dark:to-[#0d1527] border-2 border-amber-300/80 dark:border-amber-700/80 shadow-md shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
                >
                    <Sparkles className="absolute -right-3 -bottom-3 w-24 h-24 text-amber-500/10 dark:text-amber-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 ring-4 ring-white/80 dark:ring-amber-900/40 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                Hệ Sinh Thái
                            </span>
                            <div className="w-6 h-6 rounded-full bg-orange-100/80 text-orange-600 dark:bg-orange-900/60 dark:text-orange-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                →
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 relative z-10">
                        <div className="text-xs font-black text-amber-950 dark:text-amber-200 uppercase tracking-wider">Gear & Phụ Kiện</div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-orange-950 dark:text-amber-100 mt-0.5 tracking-tight">
                            {(thongKe.soLuongGear || 0) + (thongKe.soLuongBanPhim || 0) + (thongKe.soLuongChuot || 0) + (thongKe.soLuongBalo || 0)}
                        </div>
                        <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-1">Phím cơ, chuột, balo, sạc</div>
                    </div>
                </div>

                {/* Thẻ 4: Tổng Tồn Kho Sẵn Sàng */}
                <div
                    className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-green-50/30 dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 border-emerald-200/90 dark:border-emerald-800/60 shadow-md shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/15 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between relative overflow-hidden group"
                >
                    <PackageCheck className="absolute -right-3 -bottom-3 w-24 h-24 text-emerald-500/10 dark:text-emerald-400/5 pointer-events-none group-hover:scale-110 group-hover:rotate-6 transition-all duration-500" />
                    <div className="flex items-center justify-between relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/35 ring-4 ring-white/80 dark:ring-emerald-900/40 group-hover:scale-110 transition-transform">
                            <PackageCheck className="w-5 h-5 stroke-[2.2]" />
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                                Sẵn Sàng Giao
                            </span>
                            <div className="w-6 h-6 rounded-full bg-emerald-100/80 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center justify-center text-xs font-black group-hover:translate-x-0.5 transition-transform">
                                ✓
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 relative z-10">
                        <div className="text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Tổng Tồn Kho Sẵn Có</div>
                        <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-950 dark:text-emerald-100 mt-0.5 tracking-tight">
                            {thongKe.tongTonKho || 0}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-1">Chiếc trong toàn hệ thống</div>
                    </div>
                </div>
            </div>

            {/* Toolbar & Filter Controls (Khối Gradient Sắc Nét) */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50/90 via-white to-cyan-50/30 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#0f1d2e] border-2 border-cyan-100/90 dark:border-slate-800 shadow-md shadow-cyan-500/5 space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="w-2.5 h-6 bg-cyan-600 rounded-full" />
                        <h2 className="text-base font-black text-slate-900 dark:text-white">Kho Sản Phẩm ({sanPhamHienThi.length} mẫu)</h2>
                        {sanPhamHienThi.filter(s => s.tuy_chon_phien_ban?.length > 0).length > 0 && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
                                🎨 {sanPhamHienThi.filter(s => s.tuy_chon_phien_ban?.length > 0).length} mẫu có biến thể màu
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 w-full md:w-auto">
                        {/* Ô tìm kiếm nhanh trực tiếp trong kho */}
                        <div className="relative flex-1 md:w-64">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Tìm tên, SKU, màu sắc..."
                                value={tuKhoaSanPham}
                                onChange={(e) => setTuKhoaSanPham(e.target.value)}
                                className="w-full pl-9 pr-8 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {tuKhoaSanPham && (
                                <button
                                    onClick={() => setTuKhoaSanPham('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        <button
                            onClick={moModalThemSp}
                            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 !text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-blue-500/30 cursor-pointer shrink-0 transition-all hover:scale-105 active:scale-95"
                        >
                            <Plus className="w-4 h-4 !text-white" />
                            <span className="!text-white">Thêm Sản Phẩm Mới</span>
                        </button>
                    </div>
                </div>

                {/* 4 Filter Dropdowns */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <select
                        value={locNganhHang}
                        onChange={(e) => setLocNganhHang(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                        <option value="tat_ca">📦 Tất cả ngành hàng ({danhSachSanPham.length})</option>
                        <option value="laptop">💻 Laptop Gaming & AI PC ({thongKe.soLuongLaptop})</option>
                        <option value="ban_phim">⌨️ Bàn Phím Cơ Custom ({thongKe.soLuongBanPhim})</option>
                        <option value="chuot">🖱️ Chuột Gaming Siêu Nhẹ ({thongKe.soLuongChuot})</option>
                        <option value="balo">🎒 Balo & Túi Chống Sốc ({thongKe.soLuongBalo})</option>
                        <option value="tai_nghe">🎧 Tai Nghe & Loa ({thongKe.soLuongTaiNghe})</option>
                        <option value="sac_hub">⚡ Củ Sạc GaN & Hub ({thongKe.soLuongSacHub})</option>
                        <option value="linh-kien">💾 Linh kiện RAM/SSD ({thongKe.soLuongLinhKien})</option>
                        <option value="phu-kien-gear">🎮 Gom toàn bộ Gear & Phụ Kiện ({thongKe.soLuongGear})</option>
                    </select>

                    <select
                        value={locHangSanPham}
                        onChange={(e) => setLocHangSanPham(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                        <option value="tat_ca">🏷️ Tất cả thương hiệu ({danhSachHangThucTe.length})</option>
                        {danhSachHangThucTe.map(h => (
                            <option key={h.ma} value={h.ma}>{h.ten}</option>
                        ))}
                    </select>

                    <select
                        value={locTonKhoSanPham}
                        onChange={(e) => setLocTonKhoSanPham(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                        <option value="tat_ca">📊 Tình trạng tồn kho</option>
                        <option value="con_hang">✅ Đang mở bán (Còn hàng)</option>
                        <option value="sap_het">⚠️ Sắp hết hàng (≤ 5)</option>
                        <option value="tam_an">🛑 Tạm ẩn / Hết kho</option>
                        <option value="flash_sale">🔥 Chỉ xem Flash Sale</option>
                    </select>

                    <select
                        value={sapXepSanPham}
                        onChange={(e) => setSapXepSanPham(e.target.value)}
                        className="w-full px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                        <option value="moi_nhat">✨ Mới cập nhật</option>
                        <option value="ban_chay">🔥 Bán chạy nhất</option>
                        <option value="gia_giam">💰 Giá cao → thấp</option>
                        <option value="gia_tang">💵 Giá thấp → cao</option>
                    </select>
                </div>
            </div>

            {/* Bảng Danh Sách Sản Phẩm (Excel-Style Grid Sắc Nét) */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2">
                        <Boxes className="w-4 h-4 text-blue-200" />
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Kho Hàng & Danh Sách Sản Phẩm
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                            {sanPhamHienThi.length} sản phẩm
                        </span>
                    </div>
                    <div className="text-[11px] text-blue-100 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Đồng bộ kho thực tế</span>
                    </div>
                </div>

                <KhuVucDangTaiTable
                    dangTai={dangTai || dangLocSanPham}
                    tieuDe={dangLocSanPham ? "Đang áp dụng bộ lọc kho máy..." : "Đang đồng bộ kho sản phẩm..."}
                    moTa={dangLocSanPham ? `Tìm thấy ${sanPhamHienThi.length} sản phẩm phù hợp` : "Hệ thống đang tải số lượng tồn kho, giá bán và cấu hình máy"}
                />

                <div className={`min-h-[380px] transition-opacity duration-300 ${dangTai || dangLocSanPham ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <table className="w-full text-left text-xs border-collapse table-fixed">
                        <thead className="bg-slate-100 dark:bg-slate-800 shadow-xs">
                            <tr className="text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-2.5 px-1 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700">#</th>
                                <th className="py-2.5 px-2.5 border-b-2 border-r border-slate-300 dark:border-slate-700">Sản phẩm & cấu hình</th>
                                <th className="py-2.5 px-2 w-[118px] text-right border-b-2 border-r border-slate-300 dark:border-slate-700">Giá bán</th>
                                <th className="py-2.5 px-1 w-14 text-center border-b-2 border-r border-slate-300 dark:border-slate-700">Kho</th>
                                <th className="py-2.5 px-1 w-[124px] text-center border-b-2 border-r border-slate-300 dark:border-slate-700">Trạng thái</th>
                                <th className="py-2.5 px-1 w-[104px] text-center border-b-2 border-slate-300 dark:border-slate-700">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sanPhamHienThi.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                            <div className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy sản phẩm nào</div>
                                            <div className="text-xs">Vui lòng thử đổi bộ lọc hoặc từ khóa tìm kiếm</div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSachTrenTrang.map((sp, idx) => {
                                    const thongTin = layThongSoNhanhAdmin(sp);
                                    const idSp = sp.id || sp._id;
                                    const dangXuLyItem = dangXuLySpId === idSp;
                                    const dangXuLyChung = dangXuLySpId !== null || dangLuuSp;
                                    const daAnSp = sp.con_hang === false;

                                    return (
                                        <tr
                                            key={idSp}
                                            className={`group transition-colors duration-150 ${
                                                daAnSp
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : 'odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50'
                                            }`}
                                        >
                                            <td className={`py-2 px-1 text-center font-bold border-b border-r whitespace-nowrap text-[11px] ${daAnSp ? 'border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 font-black' : 'border-slate-200 dark:border-slate-800 text-slate-400'}`}>
                                                #{(trangHienTai - 1) * SO_SAN_PHAM_MOI_TRANG + idx + 1}
                                            </td>
                                            <td className={`py-2 px-2.5 border-b border-r overflow-hidden ${daAnSp ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center gap-2.5 min-w-0">
                                                    <div
                                                        onClick={() => setModalXemAnh({
                                                            url: sp.hinh_anh_chinh,
                                                            ten: sp.ten_san_pham,
                                                            gia: sp.gia_khuyen_mai,
                                                            gia_goc: sp.gia_goc,
                                                            sku: sp.ma_san_pham,
                                                            hang: sp.hang_san_xuat,
                                                            variants: sp.tuy_chon_phien_ban || [],
                                                            activeVariantIndex: 0
                                                        })}
                                                        className="w-11 h-11 rounded-xl bg-white dark:bg-slate-800 relative border border-slate-200 dark:border-slate-700 shrink-0 shadow-2xs cursor-pointer hover:border-blue-500 transition-all hover:scale-105"
                                                        title="Bấm để phóng to xem ảnh sắc nét"
                                                    >
                                                        <Image src={sp.hinh_anh_chinh} alt={sp.ten_san_pham} fill className="object-contain p-1" />
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            {daAnSp && (
                                                                <span className="px-1.5 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shrink-0">Đã ẩn</span>
                                                            )}
                                                            <div className={`font-extrabold text-xs truncate ${daAnSp ? 'text-rose-950 dark:text-rose-100' : 'text-slate-900 dark:text-white'}`} title={sp.ten_san_pham}>
                                                                {sp.ten_san_pham}
                                                            </div>
                                                        </div>
                                                        <div className={`text-[11px] font-semibold truncate mt-0.5 ${daAnSp ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-500 dark:text-slate-400'}`} title={thongTin.text}>
                                                            {thongTin.icon} {thongTin.text}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1 min-w-0">
                                                            <span className="px-1.5 py-px rounded-md bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-black uppercase text-[10px] border border-indigo-100 dark:border-indigo-900 shrink-0">
                                                                {sp.hang_san_xuat}
                                                            </span>
                                                            {sp.ma_san_pham && (
                                                                <span className="text-[10px] font-mono font-semibold text-slate-400 truncate" title={`SKU: ${sp.ma_san_pham}`}>
                                                                    SKU: {sp.ma_san_pham}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 text-right border-b border-r whitespace-nowrap ${daAnSp ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="font-black text-xs text-red-600 dark:text-red-400">{dinhDangTienVND(sp.gia_khuyen_mai)}</div>
                                                {sp.gia_goc > sp.gia_khuyen_mai && (
                                                    <div className="flex items-center justify-end gap-1 mt-0.5">
                                                        <span className="text-[10px] text-slate-400 line-through font-semibold">{dinhDangTienVND(sp.gia_goc)}</span>
                                                        <span className="px-1 rounded bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-300 text-[9px] font-black">
                                                            -{Math.round((1 - sp.gia_khuyen_mai / sp.gia_goc) * 100)}%
                                                        </span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className={`py-2 px-1 text-center border-b border-r whitespace-nowrap ${daAnSp ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <span className={`inline-block min-w-[28px] px-1.5 py-0.5 rounded-full text-[11px] font-black ${sp.so_luong_ton_kho > 5 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : sp.so_luong_ton_kho > 0 ? 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
                                                    {sp.so_luong_ton_kho || 0}
                                                </span>
                                            </td>
                                            <td className={`py-2 px-1.5 border-b border-r ${daAnSp ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyToggleConHang(sp)}
                                                        className={`w-full px-2 py-0.5 rounded-full text-[10.5px] font-black inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer active:scale-95 border ${
                                                            sp.con_hang !== false
                                                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                                                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-800 hover:bg-rose-200'
                                                        }`}
                                                        title={sp.con_hang !== false ? 'Đang mở bán - Bấm để tạm ẩn' : 'Đang tạm ẩn - Bấm để mở bán'}
                                                    >
                                                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${sp.con_hang !== false ? 'bg-emerald-500' : 'bg-rose-600'}`} />
                                                        {sp.con_hang !== false ? 'Đang bán' : 'Tạm ẩn'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyToggleFlashSale(sp)}
                                                        className={`w-full px-2 py-0.5 rounded-full text-[10.5px] font-black inline-flex items-center justify-center gap-1 whitespace-nowrap transition-all cursor-pointer active:scale-95 border ${
                                                            sp.la_flash_sale
                                                                ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800 hover:bg-orange-100'
                                                                : 'bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                                                        }`}
                                                        title={sp.la_flash_sale ? 'Đang bật Flash Sale - Bấm để tắt' : 'Bấm để bật Flash Sale'}
                                                    >
                                                        <Flame className={`w-3 h-3 ${sp.la_flash_sale ? 'text-orange-500 fill-orange-500' : 'text-slate-400'}`} />
                                                        {sp.la_flash_sale ? 'Flash Sale' : 'Không Deal'}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className={`py-2 px-1 text-center border-b ${daAnSp ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center justify-center gap-1">
                                                    <Link
                                                        href={`/san-pham/${sp.id || sp.slug || sp._id}`}
                                                        target="_blank"
                                                        className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100 dark:bg-sky-950/40 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 transition-all hover:scale-105 active:scale-95 inline-flex items-center justify-center"
                                                        title="Xem ngoài website khách hàng"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => moModalSuaSp(sp)}
                                                        disabled={dangXuLyChung}
                                                        className={`w-7 h-7 rounded-lg bg-amber-500 hover:bg-amber-600 text-white inline-flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Sửa sản phẩm"
                                                    >
                                                        <Edit3 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyXoaSanPham(idSp, sp.ten_san_pham)}
                                                        disabled={dangXuLyChung}
                                                        className={`w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 text-white inline-flex items-center justify-center shadow-xs transition-all hover:scale-105 active:scale-95 ${dangXuLyChung ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                        title="Xóa vĩnh viễn sản phẩm"
                                                    >
                                                        {dangXuLyItem ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
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
                {sanPhamHienThi.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70 px-4 py-3">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            Hiển thị {(trangHienTai - 1) * SO_SAN_PHAM_MOI_TRANG + 1}-{Math.min(trangHienTai * SO_SAN_PHAM_MOI_TRANG, sanPhamHienThi.length)} / {sanPhamHienThi.length} sản phẩm
                        </span>
                        <div className="flex items-center gap-1">
                            <button type="button" onClick={() => setTrangHienTai((trang) => Math.max(1, trang - 1))} disabled={trangHienTai === 1} className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Trước</button>
                            {Array.from({ length: tongSoTrang }, (_, index) => index + 1).map((trang) => (
                                <button key={trang} type="button" onClick={() => setTrangHienTai(trang)} className={`h-8 min-w-8 px-2 rounded-lg text-xs font-black cursor-pointer ${trang === trangHienTai ? 'bg-blue-600 text-white shadow-sm' : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{trang}</button>
                            ))}
                            <button type="button" onClick={() => setTrangHienTai((trang) => Math.min(tongSoTrang, trang + 1))} disabled={trangHienTai === tongSoTrang} className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">Sau</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
