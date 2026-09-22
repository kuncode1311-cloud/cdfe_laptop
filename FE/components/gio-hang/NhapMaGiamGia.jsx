'use client';
import React, { useState, useEffect } from 'react';
import { Check, Ticket, Sparkles, AlertCircle, CheckCircle2, ArrowRight, Tag, Clock } from 'lucide-react';
import { useGioHang } from '@/contexts/CartContext';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';

export default function NhapMaGiamGia() {
    const { gio_hang, apDungVoucher, huyVoucher } = useGioHang();
    const [maNhap, setMaNhap] = useState('');
    const [danhSachVoucher, setDanhSachVoucher] = useState(() => MaGiamGiaService.layDanhSachMaGiamGia());
    const [dangXuLy, setDangXuLy] = useState(false);

    useEffect(() => {
        let daHuy = false;
        MaGiamGiaService.layDanhSachMaGiamGiaAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setDanhSachVoucher(data);
            }
        });
        return () => { daHuy = true; };
    }, []);

    const xuLyApDung = async (e) => {
        e.preventDefault();
        if (!maNhap.trim()) return;
        setDangXuLy(true);
        await apDungVoucher(maNhap.trim().toUpperCase());
        setDangXuLy(false);
    };

    const apDungNhanh = async (code) => {
        setMaNhap(code);
        setDangXuLy(true);
        await apDungVoucher(code);
        setDangXuLy(false);
    };

    // Bảng màu sang trọng, đậm đà, tinh tế và hài hòa với brand
    const layMauSacCard = (idx) => {
        const danhSachMau = [
            {
                gradient: 'from-[#0052cc] to-blue-700',
                borderActive: 'border-[#0052cc] ring-2 ring-[#0052cc]/20',
                badgeBg: 'bg-blue-50 dark:bg-blue-950/60 text-[#0052cc] dark:text-cyan-300 border-blue-200 dark:border-blue-800',
                btnColor: 'bg-[#0052cc] hover:bg-blue-700 text-white shadow-xs',
                accentText: 'text-[#0052cc] dark:text-cyan-400'
            },
            {
                gradient: 'from-emerald-600 to-teal-700',
                borderActive: 'border-emerald-600 ring-2 ring-emerald-500/20',
                badgeBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
                btnColor: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
                accentText: 'text-emerald-600 dark:text-emerald-400'
            },
            {
                gradient: 'from-amber-500 to-orange-600',
                borderActive: 'border-amber-500 ring-2 ring-amber-500/20',
                badgeBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
                btnColor: 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs',
                accentText: 'text-amber-600 dark:text-amber-400'
            },
            {
                gradient: 'from-indigo-600 to-purple-700',
                borderActive: 'border-indigo-600 ring-2 ring-indigo-500/20',
                badgeBg: 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
                btnColor: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs',
                accentText: 'text-indigo-600 dark:text-indigo-400'
            },
            {
                gradient: 'from-rose-600 to-pink-700',
                borderActive: 'border-rose-600 ring-2 ring-rose-500/20',
                badgeBg: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
                btnColor: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
                accentText: 'text-rose-600 dark:text-rose-400'
            },
            {
                gradient: 'from-cyan-600 to-blue-700',
                borderActive: 'border-cyan-600 ring-2 ring-cyan-500/20',
                badgeBg: 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
                btnColor: 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-xs',
                accentText: 'text-cyan-600 dark:text-cyan-400'
            }
        ];
        return danhSachMau[idx % danhSachMau.length];
    };

    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-0">
            {/* Dải Banner Gradient Đỉnh Khối Voucher */}
            <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/15 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
                        <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                            MÃ KHUYẾN MÃI & VOUCHER GIẢM GIÁ
                        </h3>
                        <p className="text-xs text-white/80">
                            Nhập mã code hoặc bấm chọn các vé ưu đãi bên dưới để giảm tiền trực tiếp
                        </p>
                    </div>
                </div>

                {gio_hang.ma_giam_gia_da_dung && (
                    <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-200 font-black text-xs border border-emerald-300/40 flex items-center gap-1.5 shadow-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Đang dùng 1 mã</span>
                    </span>
                )}
            </div>

            {/* Nội dung bên trong khối */}
            <div className="p-4 sm:p-5 space-y-4">
                {/* Form Nhập Mã Thủ Công */}
                {gio_hang.ma_giam_gia_da_dung ? (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-400 dark:border-emerald-700 gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Check className="w-5 h-5 stroke-[3]" />
                            </div>
                            <div>
                                <div className="font-black text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
                                    Voucher &quot;<span className="font-mono text-emerald-700 dark:text-emerald-300 font-black">{gio_hang.ma_giam_gia_da_dung}</span>&quot; đang được kích hoạt!
                                </div>
                                <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                    Giảm ngay <span className="font-black font-mono">{dinhDangTienVND(gio_hang.tien_giam_gia)}</span> vào tổng tiền thanh toán đơn này.
                                </div>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={huyVoucher}
                            className="px-3.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-extrabold cursor-pointer border border-rose-300 dark:border-rose-800 transition-all shadow-2xs shrink-0"
                        >
                            Hủy Áp Dụng
                        </button>
                    </div>
                ) : (
                    <form onSubmit={xuLyApDung} className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={maNhap}
                                onChange={(e) => setMaNhap(e.target.value.toUpperCase())}
                                placeholder="Nhập mã voucher (ví dụ: TNTP3TR, GAMING2026...)"
                                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white uppercase font-mono font-bold focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all shadow-2xs"
                            />
                            <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button
                            type="submit"
                            disabled={dangXuLy || !maNhap.trim()}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#0052cc] to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm transition-all shadow-md shadow-blue-600/25 cursor-pointer shrink-0 uppercase tracking-wide active:scale-98"
                        >
                            {dangXuLy ? 'Kiểm tra...' : 'ÁP DỤNG'}
                        </button>
                    </form>
                )}

            {/* Danh Sách Voucher Dạng Vé 3 Cột Gọn Đẹp, Nhỏ Xinh */}
            <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                    <div className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>Voucher Gợi Ý Phù Hợp ({danhSachVoucher.length} mã):</span>
                    </div>
                    <span className="text-[11px] text-slate-400 italic">
                        Bấm &quot;Áp Dụng&quot; để nhận ưu đãi ngay
                    </span>
                </div>

                {/* 3 cards 1 hàng theo đúng yêu cầu */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {danhSachVoucher.slice(0, 6).map((vc, idx) => {
                        const mau = layMauSacCard(idx);
                        const tongTienHienTai = Number(gio_hang.tam_tinh) || 0;
                        const mucToiThieu = Number(vc.don_hang_toi_thieu) || 0;
                        const duDieuKien = tongTienHienTai >= mucToiThieu;
                        const dangDung = gio_hang.ma_giam_gia_da_dung === vc.ma_code;
                        const conThieu = mucToiThieu - tongTienHienTai;

                        return (
                            <div
                                key={vc.ma_code}
                                className={`rounded-xl border-2 transition-all duration-200 overflow-hidden flex flex-col justify-between relative bg-white dark:bg-slate-800 shadow-2xs hover:shadow-md ${
                                    dangDung
                                        ? 'border-emerald-500 ring-2 ring-emerald-500/25'
                                        : duDieuKien
                                        ? 'border-slate-300 dark:border-slate-700 hover:border-blue-500'
                                        : 'border-slate-200 dark:border-slate-800 opacity-80'
                                }`}
                            >
                                {/* Lỗ răng cưa bán nguyệt 2 bên mép nối vé */}
                                <div className="absolute -left-2 top-[68px] w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 z-10 pointer-events-none" />
                                <div className="absolute -right-2 top-[68px] w-4 h-4 rounded-full bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 z-10 pointer-events-none" />

                                {/* Nửa trên vé: Nền dải màu Gradient, giá trị giảm & hạn dùng */}
                                <div className={`bg-gradient-to-r ${mau.gradient} p-3 text-white relative`}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-white/90 uppercase tracking-wider">
                                            VOUCHER LAPTOP
                                        </span>
                                        <span className="text-[9.5px] font-bold bg-black/20 backdrop-blur-xs px-1.5 py-0.5 rounded border border-white/20 text-white flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" />
                                            <span>{vc.ngay_het_han || 'Còn hạn'}</span>
                                        </span>
                                    </div>

                                    <div className="text-base sm:text-lg font-black tracking-tight mt-0.5 font-mono">
                                        {vc.loai_giam === 'phan_tram' ? `GIẢM ${vc.gia_tri_giam}%` : `GIẢM ${dinhDangTienVND(vc.gia_tri_giam)}`}
                                    </div>

                                    <div className="text-[11px] text-white/90 font-medium truncate mt-0.5">
                                        {vc.mo_ta || 'Áp dụng cho laptop chính hãng'}
                                    </div>

                                    <div className="text-[10px] text-white/80 mt-0.5">
                                        Đơn tối thiểu: <strong className="font-mono text-white">{dinhDangTienVND(mucToiThieu)}</strong>
                                    </div>
                                </div>

                                {/* Đường kẻ chấm đứt nối 2 nửa vé */}
                                <div className="border-b border-dashed border-slate-200 dark:border-slate-700" />

                                {/* Nửa dưới vé: Mã Code & Nút Thao Tác nhỏ gọn */}
                                <div className="p-2.5 bg-white dark:bg-slate-800 space-y-2">
                                    <div className={`px-2 py-1 rounded-lg border flex items-center justify-between ${mau.badgeBg}`}>
                                        <span className="font-mono font-black text-xs tracking-wider">
                                            {vc.ma_code}
                                        </span>
                                        {duDieuKien ? (
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                <Check className="w-3 h-3 stroke-[3]" />
                                                <span>Đủ điều kiện</span>
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                <span>Thiếu {dinhDangTienVND(conThieu)}</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Nút bấm hành động nhỏ gọn */}
                                    {dangDung ? (
                                        <button
                                            type="button"
                                            onClick={huyVoucher}
                                            className="w-full py-1.5 rounded-lg bg-emerald-50 hover:bg-rose-50 dark:bg-emerald-950/60 dark:hover:bg-rose-950/60 text-emerald-700 hover:text-rose-600 font-extrabold text-[11px] border border-emerald-300 hover:border-rose-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
                                        >
                                            <Check className="w-3 h-3 text-emerald-600" />
                                            <span>Đang dùng • Bấm để hủy</span>
                                        </button>
                                    ) : duDieuKien ? (
                                        <button
                                            type="button"
                                            onClick={() => apDungNhanh(vc.ma_code)}
                                            className={`w-full py-1.5 rounded-lg text-white font-extrabold text-[11.5px] transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-98 ${mau.btnColor}`}
                                        >
                                            <span>Áp Dụng Mã</span>
                                            <ArrowRight className="w-3 h-3" />
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled
                                            className="w-full py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700/50 text-slate-400 dark:text-slate-500 font-bold text-[10.5px] border border-slate-200 dark:border-slate-700 cursor-not-allowed text-center truncate px-1"
                                            title={`Cần thêm ${dinhDangTienVND(conThieu)} để áp dụng`}
                                        >
                                            Chưa đủ ĐK (Thiếu {dinhDangTienVND(conThieu)})
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    </div>
    );
}
