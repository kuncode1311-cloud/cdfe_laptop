'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Sparkles,
    RotateCcw,
    ExternalLink,
    Save,
    Tag,
    Flame,
    Clock,
    Loader2,
    Eye,
    Gift,
    ArrowRight
} from 'lucide-react';

// Component Tab "Cấu Hình Banner & Khuyến Mãi" của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function CauHinhKhuyenMai({
    xuLyKhoiPhucCaiDatKm,
    xuLyLuuCaiDatKm,
    formCaiDatKm,
    setFormCaiDatKm,
    conLaiKm,
    chonNhanhHanKetThuc,
    chonCuoiTuan,
    chonCuoiThang,
    dangLuuKm
}) {
    return (
        <div className="space-y-5 animate-in fade-in duration-200">
            {/* Toolbar Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-gradient-to-r from-amber-50/90 via-orange-50/40 to-white dark:from-[#1c1305] dark:via-amber-950/20 dark:to-[#0d1527] p-5 rounded-3xl border-2 border-amber-200/80 dark:border-amber-800/60 shadow-md shadow-amber-500/5">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-orange-500/35 ring-4 ring-white/80 dark:ring-amber-900/40">
                        <Sparkles className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-black text-slate-900 dark:text-white">Cấu Hình Banner & Khuyến Mãi</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Sync
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold">Tùy biến tiêu đề hero, ảnh nền 3D, mức giảm, đồng hồ đếm ngược và thông báo chạy thời gian thực</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        type="button"
                        onClick={xuLyKhoiPhucCaiDatKm}
                        className="px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Khôi phục về cấu hình mẫu ban đầu"
                    >
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                        <span>Khôi Phục Mặc Định</span>
                    </button>

                    <Link
                        href="/khuyen-mai"
                        target="_blank"
                        className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                        title="Mở trang khuyến mãi xem trực tiếp"
                    >
                        <ExternalLink className="w-4 h-4 text-slate-500" />
                        <span>Xem Trang Live ↗</span>
                    </Link>

                    <button
                        type="button"
                        onClick={xuLyLuuCaiDatKm}
                        className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-rose-500/25 cursor-pointer transition-all hover:scale-[1.02]"
                    >
                        <Save className="w-4 h-4" />
                        <span>Lưu & Áp Dụng Ngay</span>
                    </button>
                </div>
            </div>

            {/* Layout 2 Cột: Bên Trái là Form Cấu Hình Dễ Thao Tác - Bên Phải là Live Preview 2 Trang */}
            {/* Layout 2 Cột: Bên Trái là Form Cấu Hình Tối Giản - Bên Phải là 2 Demo Giao Diện Thật 100% */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
                {/* CỘT TRÁI (5/12): FORM THAO TÁC TỐI GIẢN, GỌN GÀNG, KHÔNG DƯ THỪA CHỮ */}
                <form onSubmit={xuLyLuuCaiDatKm} noValidate className="xl:col-span-5 space-y-4">
                    <div className="bg-white dark:bg-[#0d1527] p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-black">
                                    <Tag className="w-4 h-4" />
                                </div>
                                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">Cấu Hình Khuyến Mãi</h3>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                                Đồng bộ 2 trang
                            </span>
                        </div>

                        {/* Tiêu đề chính */}
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                                Tiêu đề chiến dịch (Tùy chọn)
                            </label>
                            <input
                                type="text"

                                value={formCaiDatKm.tieu_de_chinh || ''}
                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, tieu_de_chinh: e.target.value })}
                                placeholder="VD: ĐẠI TIỆC LAPTOP GAMING & AI PC 2026..."
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 font-bold text-xs sm:text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                            />
                        </div>

                        {/* Phụ đề */}
                        <div className="space-y-1.5">
                            <label className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                                Phụ đề / Lời nhắn ưu đãi
                            </label>
                            <textarea
                                rows="2"
                                value={formCaiDatKm.phu_de || ''}
                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, phu_de: e.target.value })}
                                placeholder="VD: Săn Deal Khủng Đến 35% - Tặng Balo ROG, Chuột Gaming & Voucher 3 Triệu..."
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 font-medium text-xs sm:text-sm text-slate-900 dark:text-white focus:border-rose-500 focus:bg-white dark:focus:bg-slate-950 focus:outline-none transition-all"
                            />
                        </div>

                        {/* 2 trường Badge và Mức giảm trên 1 hàng */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                                    <Flame className="w-3.5 h-3.5 text-red-500" />
                                    <span>Badge nhãn</span>
                                </label>
                                <input
                                    type="text"
                                    value={formCaiDatKm.badge_noi_bat || ''}
                                    onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, badge_noi_bat: e.target.value.toUpperCase() })}
                                    placeholder="SIÊU KHUYẾN MÃI"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 font-bold text-xs text-red-600 dark:text-red-400 uppercase focus:border-rose-500 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1">
                                    <Tag className="w-3.5 h-3.5 text-amber-500" />
                                    <span>Mức giảm</span>
                                </label>
                                <input
                                    type="text"
                                    value={formCaiDatKm.muc_giam_toi_da || ''}
                                    onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, muc_giam_toi_da: e.target.value })}
                                    placeholder="GIẢM ĐẾN 35%"
                                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900 font-bold text-xs text-amber-600 dark:text-amber-400 focus:border-rose-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Hạn kết thúc đếm ngược (áp dụng cả 2 trang) */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                                <label className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-amber-500" />
                                    <span>Hạn kết thúc đếm ngược</span>
                                </label>
                                {conLaiKm.hetHan ? (
                                    <span className="text-[11px] font-bold text-red-600 bg-red-50 dark:bg-red-950/50 px-2 py-0.5 rounded-lg border border-red-200 dark:border-red-800">
                                        ⚠️ Đã hết hạn
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-mono">
                                        ⏱️ Còn: {conLaiKm.chuoi}
                                    </span>
                                )}
                            </div>

                            <input
                                type="datetime-local"

                                value={typeof formCaiDatKm?.thoi_gian_ket_thuc === 'string' ? formCaiDatKm.thoi_gian_ket_thuc.substring(0, 16) : '2026-09-30T23:59'}
                                onChange={(e) => setFormCaiDatKm({ ...formCaiDatKm, thoi_gian_ket_thuc: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-black text-sm sm:text-base font-mono text-slate-900 dark:text-white focus:border-amber-500 focus:outline-none cursor-pointer"
                            />

                            {/* Nút bấm chọn nhanh thời hạn */}
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                                <button
                                    type="button"
                                    onClick={() => chonNhanhHanKetThuc(1)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                    +1 Ngày
                                </button>
                                <button
                                    type="button"
                                    onClick={() => chonNhanhHanKetThuc(3)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                    +3 Ngày
                                </button>
                                <button
                                    type="button"
                                    onClick={() => chonNhanhHanKetThuc(7)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                    +7 Ngày
                                </button>
                                <button
                                    type="button"
                                    onClick={chonCuoiTuan}
                                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                    Cuối tuần
                                </button>
                                <button
                                    type="button"
                                    onClick={chonCuoiThang}
                                    className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 text-[11px] font-bold cursor-pointer transition-colors"
                                >
                                    Cuối tháng
                                </button>
                            </div>
                        </div>

                        {/* Nút Submit Lưu */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={dangLuuKm}
                                className={`w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 hover:from-red-700 hover:to-amber-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] ${dangLuuKm ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {dangLuuKm ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                <span>{dangLuuKm ? 'ĐANG LƯU CẤU HÌNH...' : 'LƯU & ÁP DỤNG NGAY'}</span>
                            </button>
                        </div>
                    </div>
                </form>

                {/* CỘT PHẢI (7/12): 2 BẢN DEMO RENDER TỪ GIAO DIỆN THẬT 100% */}
                <div className="xl:col-span-7 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-blue-500" />
                            <h3 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                Xem Trước Giao Diện Thật (Live Demo)
                            </h3>
                        </div>
                        <span className="text-[11px] font-bold text-slate-400">Tự động cập nhật tức thì</span>
                    </div>

                    {/* 1. DEMO BANNER FLASH SALE TRANG CHỦ (Render chuẩn 100% component FlashSaleDemNguoc) */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Flame className="w-4 h-4 fill-red-500 text-red-500" />
                                1. Hiển thị thực tế tại TRANG CHỦ (Banner Flash Sale)
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                                Trang Chủ
                            </span>
                        </div>

                        <div className="relative w-full rounded-2xl overflow-hidden text-white shadow-md border border-white/20 p-4 sm:p-5 bg-gradient-to-r from-[#D00A24] via-[#EB2818] to-[#F55208] min-h-[170px] flex items-center">
                            {/* Lớp nền ảnh 3D thật của Flash Sale */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/images/flash_sale_vivid_bright.jpg"
                                    alt="Flash Sale Preview"
                                    fill
                                    sizes="(max-width: 1200px) 100vw, 700px"
                                    className="object-cover object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D00A24]/90 via-[#EB2818]/65 to-[#F55208]/40" />
                            </div>

                            <div className="relative z-10 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div className="space-y-1.5 max-w-[58%]">
                                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#450007]/80 backdrop-blur-md border border-white/30 text-amber-300 text-[10px] font-bold uppercase">
                                        <Flame className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        <span>{formCaiDatKm.badge_noi_bat || 'ƯU ĐÃI CÓ HẠN'}</span>
                                    </div>
                                    <h3 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white [text-shadow:_0_2px_0_#990014,_0_3px_6px_rgba(0,0,0,0.5)] leading-none">
                                        FLASH SALE
                                    </h3>
                                    <p className="text-xs font-bold text-white uppercase tracking-wide line-clamp-1 drop-shadow-sm">
                                        {formCaiDatKm.phu_de || 'SĂN DEAL CỰC SỐC - GIÁ TỐT NHẤT NĂM'}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-white/90 font-medium pt-0.5">
                                        <span>🚚 Miễn phí VC</span>
                                        <span>•</span>
                                        <span>🛡️ BH 3 năm</span>
                                        <span>•</span>
                                        <span>🎁 Quà VIP</span>
                                    </div>
                                </div>

                                {/* Hộp đếm ngược chuẩn giao diện thật (Quy ra Ngày nếu >= 24h) */}
                                <div className="flex flex-col items-end gap-1.5 shrink-0 self-end sm:self-center">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-white drop-shadow-xs">
                                        KẾT THÚC TRONG
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {(conLaiKm.d > 0
                                            ? [{ val: conLaiKm.d, nhan: 'Ngày' }, { val: conLaiKm.h, nhan: 'Giờ' }, { val: conLaiKm.m, nhan: 'Phút' }, { val: conLaiKm.s, nhan: 'Giây' }]
                                            : [{ val: conLaiKm.h, nhan: 'Giờ' }, { val: conLaiKm.m, nhan: 'Phút' }, { val: conLaiKm.s, nhan: 'Giây' }]
                                        ).map((b, i, arr) => (
                                            <React.Fragment key={b.nhan}>
                                                <div className="flex flex-col items-center">
                                                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-b from-[#6A0C16]/95 via-[#48040C]/95 to-[#2A0105]/95 backdrop-blur-md rounded-xl border border-white/30 flex items-center justify-center text-white font-black text-xs font-mono shadow-md">
                                                        {b.val.toString().padStart(2, '0')}
                                                    </div>
                                                    <span className="text-[8px] text-white font-bold uppercase mt-0.5">{b.nhan}</span>
                                                </div>
                                                {i < arr.length - 1 && <span className="text-white font-black text-xs pb-3">:</span>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="px-3 py-1 rounded-full bg-white text-[#D31828] font-black text-[10px] uppercase shadow-sm flex items-center gap-1 mt-0.5">
                                        <span>SĂN DEAL NGAY</span>
                                        <ArrowRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. DEMO HERO BANNER TRANG KHUYẾN MÃI (Render chuẩn 100% component TrangKhuyenMai) */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                                <Gift className="w-4 h-4 text-blue-500" />
                                2. Hiển thị thực tế tại TRANG KHUYẾN MÃI (/khuyen-mai)
                            </span>
                            <Link
                                href="/khuyen-mai"
                                target="_blank"
                                className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                                <span>Mở trang ↗</span>
                            </Link>
                        </div>

                        <div className="relative w-full rounded-2xl overflow-hidden border border-[#CDE5FC] shadow-sm p-4 sm:p-5 min-h-[170px] flex items-center bg-[#D7EAFD]">
                            {/* Lớp nền ảnh 3D thật của Trang Khuyến Mãi */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src="/images/khuyen-mai/hero_banner_3d_panoramic_perfect.png"
                                    alt="Khuyến Mãi Preview"
                                    fill
                                    sizes="(max-width: 1200px) 100vw, 700px"
                                    className="object-cover object-right sm:object-center"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#D7EAFD]/95 via-[#D7EAFD]/75 to-transparent sm:max-w-[70%]" />
                            </div>

                            {/* Huy hiệu nổi 3D "TIẾT KIỆM ĐẾN" ở góc trên bên phải */}
                            <div className="hidden sm:flex flex-col items-center absolute top-3 right-4 bg-white/95 backdrop-blur-md rounded-xl px-3 py-1 shadow-sm border border-[#D5E6F8] text-center z-10">
                                <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#0060E6]">
                                    TIẾT KIỆM ĐẾN
                                </span>
                                <span className="text-sm font-black text-[#0060E6] leading-tight">
                                    {formCaiDatKm.muc_giam_toi_da || '3.000.000đ'}
                                </span>
                            </div>

                            <div className="relative z-10 max-w-[65%] space-y-1.5">
                                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md border border-[#BEDBFE] text-[#0060E6] text-[10px] font-extrabold uppercase">
                                    <Gift className="w-3 h-3 text-[#0060E6]" />
                                    <span>{formCaiDatKm.badge_noi_bat || 'ƯU ĐÃI CHÍNH HÃNG • TIẾT KIỆM THÔNG MINH'}</span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-black text-[#0B1736] tracking-tight leading-tight line-clamp-1">
                                    {formCaiDatKm.tieu_de_chinh || 'KHO ƯU ĐÃI TNTP'}
                                </h3>
                                <p className="text-xs text-[#334155] font-semibold line-clamp-1">
                                    {formCaiDatKm.phu_de || 'Săn voucher ngay – Mua laptop giá tốt'}
                                </p>
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="inline-flex items-center gap-1 bg-[#0060E6] text-white font-bold text-[10px] px-3 py-1 rounded-lg shadow-sm">
                                        <span>Khám phá ưu đãi</span>
                                        <ArrowRight className="w-2.5 h-2.5" />
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-medium">
                                        ⏳ Hạn: {(() => {
                                            try {
                                                if (!formCaiDatKm?.thoi_gian_ket_thuc) return '—';
                                                const d = new Date(formCaiDatKm.thoi_gian_ket_thuc);
                                                return isNaN(d.getTime()) ? '—' : d.toLocaleDateString('vi-VN');
                                            } catch {
                                                return '—';
                                            }
                                        })()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
