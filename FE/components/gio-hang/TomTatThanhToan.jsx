'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Truck, Lock, Sparkles, CheckCircle2, Award, Zap } from 'lucide-react';
import { useGioHang } from '@/contexts/CartContext';
import { dinhDangTienVND } from '@/utils/formatCurrency';

export default function TomTatThanhToan() {
    const { gio_hang } = useGioHang();

    return (
        <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-800 shadow-md overflow-hidden bg-white dark:bg-slate-900">
            {/* Header Dải Màu Xanh Dương Tươi Sáng & Sang Trọng (Không bị tối) */}
            <div className="bg-gradient-to-r from-[#0052cc] via-blue-600 to-indigo-600 text-white p-4 sm:p-5 flex items-center justify-between relative shadow-xs">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs text-white flex items-center justify-center border border-white/25 shadow-xs">
                        <Lock className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-black text-xs sm:text-sm tracking-wider uppercase text-white">
                            TÓM TẮT ĐƠN HÀNG
                        </h3>
                        <p className="text-[10.5px] text-white/85">
                            Bảo mật thanh toán SSL 256-bit
                        </p>
                    </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-white/20 text-white font-black text-xs border border-white/30 shadow-xs">
                    {gio_hang.tong_so_luong} sản phẩm
                </span>
            </div>

            {/* Thân Khối Tóm Tắt */}
            <div className="p-5 sm:p-6 space-y-5">
                {/* Chi Tiết Các Khoản */}
                <div className="space-y-3 text-xs sm:text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="font-medium">Tạm tính tiền hàng:</span>
                        <span className="font-black text-slate-900 dark:text-white font-mono text-sm sm:text-base">
                            {dinhDangTienVND(gio_hang.tam_tinh)}
                        </span>
                    </div>

                    {/* Voucher giảm giá nếu đã kích hoạt */}
                    {gio_hang.tien_giam_gia > 0 && (
                        <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-200 font-bold bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/60 dark:to-teal-950/60 p-3 rounded-xl border border-emerald-300 dark:border-emerald-700 shadow-2xs">
                            <span className="flex items-center gap-1.5 text-xs">
                                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span>Voucher (<strong className="font-mono text-emerald-700 dark:text-emerald-300">{gio_hang.ma_giam_gia_da_dung}</strong>):</span>
                            </span>
                            <span className="font-mono font-black text-sm sm:text-base text-emerald-700 dark:text-emerald-300">
                                -{dinhDangTienVND(gio_hang.tien_giam_gia)}
                            </span>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 font-medium">
                            <Truck className="w-4 h-4 text-[#0052cc]" />
                            <span>Vận chuyển toàn quốc:</span>
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-800">
                            MIỄN PHÍ 100%
                        </span>
                    </div>

                    {/* Hộp Tổng Tiền Thanh Toán Nổi Bật Siêu Đậm */}
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 via-red-50/70 to-amber-50/40 dark:from-rose-950/50 dark:via-red-950/30 dark:to-slate-900 border-2 border-red-300 dark:border-rose-900/80 space-y-1 shadow-xs">
                        <div className="flex items-baseline justify-between">
                            <div>
                                <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm uppercase tracking-wide block">
                                    TỔNG TIỀN THANH TOÁN:
                                </span>
                                <span className="text-[10.5px] text-slate-500 dark:text-slate-400">
                                    (Đã gồm thuế VAT 10% & Phiếu bảo hành)
                                </span>
                            </div>
                            <div className="text-right">
                                <div className="text-xl sm:text-2xl font-black text-red-600 dark:text-rose-400 font-mono tracking-tight">
                                    {dinhDangTienVND(gio_hang.tong_thanh_toan)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút Tiến Hành Thanh Toán To Bự Rực Rỡ */}
                {gio_hang.danh_sach_muc.length > 0 ? (
                    <Link
                        href="/thanh-toan"
                        className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-xl shadow-red-500/30 transition-all hover:scale-[1.01] text-center cursor-pointer active:scale-98"
                    >
                        <Lock className="w-4 h-4" />
                        <span>TIẾN HÀNH THANH TOÁN</span>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                ) : (
                    <button
                        disabled
                        className="w-full py-4 px-4 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-400 font-bold text-sm cursor-not-allowed text-center"
                    >
                        Giỏ Hàng Đang Trống
                    </button>
                )}

                {/* 3 Cam Kết Đậm Màu Sắc Công Nghệ */}
                <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Mở hộp test máy kỹ trước khi thanh toán</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-300 text-xs font-bold">
                        <Truck className="w-4 h-4 text-[#0052cc] shrink-0" />
                        <span>Bọc chống sốc 4 lớp & niêm phong an toàn 100%</span>
                    </div>

                    <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs font-bold">
                        <Award className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>Bảo hành chính hãng 12-24 tháng toàn quốc</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
