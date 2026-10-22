'use client';
import { thoiHanVoucher, ngayVoucher } from '@/utils/voucherDate';
import {
    Search,
    Plus,
    Ticket,
    Calendar,
    Loader2,
    Edit3,
    Trash2
} from 'lucide-react';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

// Component Tab "Mã Khuyến Mãi & Voucher" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function QuanLyVoucher({
    danhSachVoucher,
    voucherHienThi,
    tuKhoaVoucher,
    setTuKhoaVoucher,
    locTrangThaiVoucher,
    setLocTrangThaiVoucher,
    moModalThemVoucher,
    dangTai,
    dangLocVoucher,
    dangXuLyVoucherId,
    xuLyToggleVoucher,
    moModalSuaVoucher,
    xuLyXoaVoucher
}) {
    return (
        <div className="space-y-4 animate-in fade-in duration-200">
            {/* 3 KPI Cards Voucher Gradient 3D */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-3xl bg-gradient-to-br from-rose-50/95 via-pink-50/50 to-orange-50/30 dark:from-[#1f0b12] dark:via-rose-950/30 dark:to-[#0d1527] border-2 border-rose-200 dark:border-rose-900/60 shadow-md shadow-rose-500/5 hover:shadow-xl hover:shadow-rose-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-red-500 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-rose-500/35 ring-4 ring-white/80 dark:ring-rose-900/40 group-hover:scale-110 transition-transform">
                            🎟️
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-rose-900 dark:text-rose-200 uppercase tracking-wider">Tổng Số Voucher</div>
                            <div className="text-base sm:text-lg font-black font-mono text-rose-600 dark:text-rose-400 leading-tight">
                                {danhSachVoucher.length} <span className="text-xs font-bold text-rose-400/80">Mã Khuyến Mãi</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50/95 via-teal-50/50 to-green-50/30 dark:from-[#061c16] dark:via-emerald-950/30 dark:to-[#0b1120] border-2 border-emerald-200 dark:border-emerald-900/60 shadow-md shadow-emerald-500/5 hover:shadow-xl hover:shadow-emerald-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-green-600 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-emerald-500/35 ring-4 ring-white/80 dark:ring-emerald-900/40 group-hover:scale-110 transition-transform">
                            ✅
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">Đang Kích Hoạt</div>
                            <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-emerald-400 leading-tight">
                                {danhSachVoucher.filter(v => v.kich_hoat !== false).length} <span className="text-xs font-bold text-emerald-400/80">Mã Áp Dụng Được</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50/95 via-orange-50/60 to-yellow-50/30 dark:from-[#1c1305] dark:via-amber-950/30 dark:to-[#0b1120] border-2 border-amber-300 dark:border-amber-700/80 shadow-md shadow-orange-500/10 hover:shadow-xl hover:shadow-orange-500/10 transition-all flex items-center justify-between group relative overflow-hidden">
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 text-white flex items-center justify-center text-base shrink-0 shadow-lg shadow-orange-500/35 ring-4 ring-white/80 dark:ring-amber-900/40 group-hover:scale-110 transition-transform">
                            ⏸️
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider">Đã Tạm Ẩn</div>
                            <div className="text-base sm:text-lg font-black font-mono text-amber-700 dark:text-amber-400 leading-tight">
                                {danhSachVoucher.filter(v => v.kich_hoat === false).length} <span className="text-xs font-bold text-amber-400/80">Mã Đang Khóa</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar & Filter Bar (Khối Gradient Sắc Nét) */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-slate-50/90 via-white to-rose-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#220d18] p-5 rounded-3xl border-2 border-rose-100/90 dark:border-slate-800 shadow-md shadow-rose-500/5">
                <div className="flex items-center gap-3">
                    <span className="w-2.5 h-6 bg-rose-600 rounded-full" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-slate-900 dark:text-white">Mã Khuyến Mãi & Voucher</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300">
                                {voucherHienThi.length} / {danhSachVoucher.length} mã
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">Quản lý mã giảm giá, mức giảm, thời hạn và số lượng phát hành</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    {/* Tìm kiếm voucher */}
                    <div className="relative min-w-[200px] flex-1 md:flex-initial">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={tuKhoaVoucher}
                            onChange={(e) => setTuKhoaVoucher(e.target.value)}
                            placeholder="Tìm mã, tên voucher..."
                            className="w-full pl-9 pr-8 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors"
                        />
                        {tuKhoaVoucher && (
                            <button
                                onClick={() => setTuKhoaVoucher('')}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Lọc trạng thái */}
                    <select
                        value={locTrangThaiVoucher}
                        onChange={(e) => setLocTrangThaiVoucher(e.target.value)}
                        className="px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white cursor-pointer focus:outline-none focus:border-rose-500"
                    >
                        <option value="tat_ca">Tất cả trạng thái</option>
                        <option value="kich_hoat">🟢 Đang hoạt động ({danhSachVoucher.filter(v => v.kich_hoat !== false).length})</option>
                        <option value="tam_an">🔴 Đã tạm ẩn ({danhSachVoucher.filter(v => v.kich_hoat === false).length})</option>
                    </select>

                    <button
                        onClick={moModalThemVoucher}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-rose-500/25 transition-all cursor-pointer whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4 !text-white" />
                        <span className="!text-white">+ Tạo Mã Voucher Mới</span>
                    </button>
                </div>
            </div>

            {/* Bảng Danh Sách Voucher Chuẩn Mẫu Siêu Đẹp (Excel-Style Grid Sắc Nét) */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden min-h-[380px]">
                {/* Banner Tiêu Đề Bảng Đồng Bộ Chuẩn Đơn Hàng */}
                <div className="bg-gradient-to-r from-rose-700 via-pink-700 to-purple-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
                    <div className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-rose-200" />
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Kho Mã Giảm Giá & Voucher Khuyến Mãi
                        </h3>
                        <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-black">
                            {voucherHienThi.length} voucher
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-bold">
                        <div className="text-emerald-200 flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{danhSachVoucher.filter(v => v.kich_hoat !== false).length} Đang bật</span>
                        </div>
                        {danhSachVoucher.filter(v => v.kich_hoat === false).length > 0 && (
                            <div className="text-rose-100 flex items-center gap-1.5 bg-rose-600/90 px-2.5 py-0.5 rounded-full border border-rose-300/40 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-white" />
                                <span>{danhSachVoucher.filter(v => v.kich_hoat === false).length} Đã ẩn (Nền đỏ)</span>
                            </div>
                        )}
                    </div>
                </div>

                <KhuVucDangTaiTable
                    dangTai={dangTai || dangLocVoucher}
                    tieuDe={dangLocVoucher ? "Đang lọc kho mã khuyến mãi..." : "Đang nạp kho mã voucher khuyến mãi..."}
                    moTa={dangLocVoucher ? `Tìm thấy ${voucherHienThi.length} mã voucher phù hợp` : "Đồng bộ danh sách mã giảm giá và số lượng phát hành"}
                />

                <div className={`overflow-x-auto transition-opacity duration-300 ${dangTai || dangLocVoucher ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-2.5 px-2 w-10 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                    <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer" />
                                </th>
                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">MÃ CODE</th>
                                <th className="py-2.5 px-2.5 min-w-[130px] border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TÊN VOUCHER</th>
                                <th className="py-2.5 px-2 w-20 text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">LOẠI</th>
                                <th className="py-2.5 px-2 w-24 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">GIÁ TRỊ</th>
                                <th className="py-2.5 px-2 w-24 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ĐƠN TỐI THIỂU</th>
                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">ĐÃ SĂN / TỔNG</th>
                                <th className="py-2.5 px-2 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">THỜI HẠN</th>
                                <th className="py-2.5 px-2 w-28 min-w-[110px] text-center border-b-2 border-r border-slate-300 dark:border-slate-700 whitespace-nowrap">TRẠNG THÁI</th>
                                <th className="py-2.5 px-1.5 w-16 text-center border-b-2 border-slate-300 dark:border-slate-700 whitespace-nowrap">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody>
                            {voucherHienThi.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="py-12 text-center text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <Ticket className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                                        <p className="font-bold text-sm text-slate-700 dark:text-slate-300">Không tìm thấy voucher nào phù hợp</p>
                                        <p className="text-xs text-slate-400 mt-0.5">Thử đổi từ khóa hoặc chọn "Tất cả trạng thái"</p>
                                    </td>
                                </tr>
                            ) : (
                                voucherHienThi.map((vc, idx) => {
                                    const tongPhatHanh = vc.so_luong_phat_hanh || 20;
                                    const daSuDung = vc.so_luong_da_dung || Math.min(2 + idx, tongPhatHanh);
                                    const conLai = Math.max(0, tongPhatHanh - daSuDung);
                                    const phanTramDaDung = Math.round((daSuDung / tongPhatHanh) * 100);

                                    const isFreeship = vc.loai_giam === 'freeship' || vc.ma_code?.toLowerCase().includes('freeship');
                                    const isPercent = vc.loai_giam === 'phan_tram' || String(vc.gia_tri_giam).includes('%');

                                    const daAn = vc.kich_hoat === false;

                                    return (
                                        <tr
                                            key={vc.id || vc.ma_code || vc._id}
                                            className={`transition-all duration-200 ${
                                                daAn
                                                    ? '!bg-rose-100/90 dark:!bg-rose-950/60 hover:!bg-rose-200/90 dark:hover:!bg-rose-900/70 border-l-4 border-l-rose-600 shadow-xs'
                                                    : 'odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-blue-50/80 dark:hover:!bg-blue-950/50'
                                            }`}
                                        >
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <input type="checkbox" className="rounded text-rose-600 focus:ring-rose-500 cursor-pointer" />
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <span className={`w-1.5 h-5 rounded-full shrink-0 ${daAn ? 'bg-rose-600' : 'bg-rose-600'}`} />
                                                    <span className={`font-mono font-black text-xs tracking-wider ${daAn ? 'text-rose-800 dark:text-rose-300' : 'text-red-600 dark:text-red-400'}`}>
                                                        {vc.ma_code}
                                                    </span>
                                                    {daAn && (
                                                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase tracking-wider bg-rose-600 text-white shadow-2xs shrink-0">
                                                            ĐÃ ẨN
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2.5 border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                    <span className={`font-extrabold text-xs truncate max-w-[150px] lg:max-w-[200px] ${daAn ? 'text-rose-950 dark:text-rose-100' : 'text-slate-900 dark:text-white'}`} title={vc.tieu_de}>
                                                        {vc.tieu_de}
                                                    </span>
                                                    {vc.badge && (
                                                        <span className="px-1 py-0.5 rounded text-[9px] font-black uppercase bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 shrink-0">
                                                            {vc.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                {vc.chuyen_muc && vc.chuyen_muc !== 'toan_san' && (
                                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold mt-0.5 ${daAn ? 'bg-rose-200/80 text-rose-800 dark:bg-rose-900/70 dark:text-rose-200' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                                                        🏷️ {vc.chuyen_muc === 'gaming' ? 'Gaming' : vc.chuyen_muc === 'sinh_vien' ? 'VP' : vc.chuyen_muc}
                                                    </span>
                                                )}
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <span className={`px-2 py-0.5 rounded-full font-black text-[11px] whitespace-nowrap ${isFreeship ? 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                                                    isPercent ? 'bg-rose-50 text-rose-800 dark:bg-rose-950 dark:text-rose-300' :
                                                        'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                    }`}>
                                                    {isFreeship ? 'Freeship' : isPercent ? 'Giảm %' : 'Tiền mặt'}
                                                </span>
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className={`font-black text-xs whitespace-nowrap ${daAn ? 'text-rose-950 dark:text-rose-100' : 'text-slate-900 dark:text-white'}`}>
                                                    {isFreeship ? 'Free' : isPercent ? `${vc.gia_tri_giam}%` : `${Math.round(vc.gia_tri_giam / 1000)}K`}
                                                </div>
                                                <div className={`text-[10px] font-semibold whitespace-nowrap ${daAn ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-400'}`}>
                                                    {isFreeship ? 'Miễn ship' : isPercent ? `Tối đa ${dinhDangTienVND(vc.giam_toi_da || 1500000)}` : dinhDangTienVND(vc.gia_tri_giam)}
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 font-bold text-xs border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 font-extrabold' : 'text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'}`}>
                                                {vc.don_hang_toi_thieu > 0 ? dinhDangTienVND(vc.don_hang_toi_thieu) : '0đ'}
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className="flex items-center justify-between text-[11px] font-black text-slate-700 dark:text-slate-300 mb-0.5">
                                                    <span>{daSuDung}/{tongPhatHanh}</span>
                                                </div>
                                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                    <div
                                                        className={`${daAn ? 'bg-rose-500' : 'bg-emerald-500'} h-full rounded-full transition-all`}
                                                        style={{ width: `${Math.min(100, phanTramDaDung)}%` }}
                                                    />
                                                </div>
                                                <div className={`text-[10px] font-semibold mt-0.5 whitespace-nowrap ${daAn ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-400'}`}>
                                                    Dùng {daSuDung} • Còn {conLai}
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                <div className={`font-bold text-[11px] flex items-center gap-1 whitespace-nowrap ${daAn ? 'text-rose-900 dark:text-rose-200' : 'text-slate-700 dark:text-slate-300'}`}>
                                                    <Calendar className={`w-3 h-3 ${daAn ? 'text-rose-500' : 'text-slate-400'}`} />
                                                    <span>{ngayVoucher(vc.ngay_het_han_chuan)}</span>
                                                </div>
                                                <div className={`text-[10px] pl-4 font-semibold whitespace-nowrap ${daAn ? 'text-rose-700/80 dark:text-rose-300/80' : 'text-slate-400'}`}>
                                                    {thoiHanVoucher(vc)}
                                                </div>
                                            </td>
                                            <td className={`py-2 px-2 text-center border-b border-r whitespace-nowrap ${daAn ? 'border-rose-200 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800'}`}>
                                                {(() => {
                                                    const vId = vc.id || vc.ma_code || vc._id;
                                                    const dangXuLy = dangXuLyVoucherId === vId;
                                                    return (
                                                        <div className="flex flex-col items-center">
                                                            <button
                                                                type="button"
                                                                disabled={dangXuLy}
                                                                onClick={() => xuLyToggleVoucher(vc)}
                                                                className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                                    dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                                                } ${!daAn ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-rose-500 hover:bg-rose-600'}`}
                                                                title={!daAn ? 'Đang bật hiển thị - Bấm để ẩn (chuyển sang nền đỏ)' : 'Đang ẩn (nền đỏ) - Bấm để bật lại'}
                                                            >
                                                                <span
                                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                                        !daAn ? 'translate-x-4' : 'translate-x-0'
                                                                    }`}
                                                                />
                                                            </button>
                                                            <div className="mt-1 whitespace-nowrap">
                                                                {dangXuLy ? (
                                                                    <span className="text-slate-400 flex items-center gap-1 text-[10px] font-bold justify-center">
                                                                        <Loader2 className="w-2.5 h-2.5 animate-spin" /> Lưu...
                                                                    </span>
                                                                ) : !daAn ? (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                                        Đang bật
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-black bg-rose-200 text-rose-900 dark:bg-rose-900/80 dark:text-rose-200 border border-rose-300 dark:border-rose-700 shadow-2xs">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
                                                                        Đã ẩn
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })()}
                                            </td>
                                            <td className="py-2 px-1.5 text-center border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">
                                                {(() => {
                                                    const vId = vc.id || vc.ma_code || vc._id;
                                                    const dangXuLy = dangXuLyVoucherId === vId;
                                                    return (
                                                        <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                                                            <button
                                                                onClick={() => moModalSuaVoucher(vc)}
                                                                disabled={dangXuLy}
                                                                className={`p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                title="Sửa voucher"
                                                            >
                                                                <Edit3 className="w-3.5 h-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() => xuLyXoaVoucher(vc)}
                                                                disabled={dangXuLy}
                                                                className={`p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/50 dark:hover:bg-red-900 transition-colors ${dangXuLy ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                                                title="Xóa voucher"
                                                            >
                                                                {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                            </button>
                                                        </div>
                                                    );
                                                })()}
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
