'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, ArrowRight, Truck, ShieldCheck, Gift } from 'lucide-react';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { SanPhamService } from '@/services/san-pham.service';

export default function FlashSaleDemNguoc({ danhSachSanPham }) {
    const [danhSach, setDanhSach] = useState(danhSachSanPham || []);
    const [dangTai, setDangTai] = useState(!danhSachSanPham || danhSachSanPham.length === 0);

    // Nạp danh sách Flash Sale từ MongoDB Atlas qua API
    useEffect(() => {
        if (!danhSachSanPham) {
            let daHuy = false;
            // Kiểm tra cache nếu đã có
            const cache = SanPhamService.layDanhSachFlashSale();
            if (cache && cache.length > 0) {
                setDanhSach(cache);
                setDangTai(false);
            }

            SanPhamService.layTatCaSanPhamAsync({ flash_sale: true }).then((data) => {
                if (!daHuy && Array.isArray(data) && data.length > 0) {
                    const danhSachSale = data.filter(sp => sp.la_flash_sale);
                    setDanhSach(danhSachSale.length > 0 ? danhSachSale : data);
                }
                if (!daHuy) setDangTai(false);
            }).catch(() => {
                if (!daHuy) setDangTai(false);
            });
            return () => { daHuy = true; };
        }
    }, [danhSachSanPham]);

    // Đồng hồ đếm ngược Flash Sale 24h
    const [gio, setGio] = useState(14);
    const [phut, setPhut] = useState(36);
    const [giay, setGiay] = useState(46);

    useEffect(() => {
        const timer = setInterval(() => {
            setGiay((g) => {
                if (g > 0) return g - 1;
                setPhut((p) => {
                    if (p > 0) return p - 1;
                    setGio((h) => (h > 0 ? h - 1 : 23));
                    return 59;
                });
                return 59;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    if (danhSach.length === 0 && !dangTai) return null;

    return (
        <section id="flash-sale" className="w-full">
            {/* ========================================================================= */}
            {/* 1. HERO BANNER FLASH SALE (Vivid Red-Coral-Orange Gradient & 3D Glass Art)*/}
            {/* ========================================================================= */}
            <div className="relative w-full rounded-[24px] overflow-hidden text-white shadow-[0_20px_45px_-12px_rgba(235,30,45,0.45)] border border-white/30 min-h-[225px] lg:h-[245px] flex items-center p-5 sm:px-8 sm:py-6 bg-gradient-to-r from-[#D00A24] via-[#EB2818] to-[#F55208]">
                {/* LỚP NỀN 3D PANORAMIC (Sáng rực rỡ, voucher 3D chuẩn reference, không bị tối) */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/flash_sale_vivid_bright.jpg"
                        alt="Flash Sale TNTP Laptop"
                        fill
                        priority
                        unoptimized
                        className="object-cover object-center"
                    />
                    {/* Radial highlight nhẹ nhàng tăng cường độ sáng ấm, không có mảng đen */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_45%,rgba(255,255,255,0.18)_0%,transparent_65%)] pointer-events-none" />
                </div>

                {/* NỘI DUNG 3 KHU VỰC: LEFT (48%) - CENTER ART (24%) - RIGHT COUNTDOWN (28%) */}
                <div className="relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-6">
                    {/* CỘT TRÁI (~48%): Heading 3D, Subtitle & 3 Benefits TRÊN CÙNG 1 HÀNG */}
                    <div className="space-y-2.5 lg:w-[48%] text-center lg:text-left">
                        {/* Small Badge: ƯU ĐÃI CÓ HẠN */}
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#450007]/70 backdrop-blur-md border border-white/30 text-amber-300 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider shadow-sm">
                            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>ƯU ĐÃI CÓ HẠN</span>
                        </div>

                        {/* Heading Display Typography 58-62px italic 3D chuẩn promotional electronics */}
                        <div>
                            <h2 className="text-4xl sm:text-5xl lg:text-[58px] xl:text-[62px] font-black italic uppercase tracking-tighter text-white [text-shadow:_0_2px_0_#990014,_0_4px_0_#75000f,_0_6px_12px_rgba(0,0,0,0.5)] leading-none select-none">
                                FLASH SALE
                            </h2>
                            <p className="text-[15px] sm:text-[16px] font-extrabold text-white uppercase tracking-wide mt-2 [text-shadow:_0_2px_4px_rgba(0,0,0,0.6)]">
                                SĂN DEAL CỰC SỐC - GIÁ TỐT NHẤT NĂM
                            </p>
                        </div>

                        {/* 3 Benefits nằm TRÊN CÙNG MỘT HÀNG DUY NHẤT */}
                        <div className="pt-2 flex items-center justify-center lg:justify-start gap-3 sm:gap-4.5 text-white text-[12px] sm:text-[12.5px] lg:text-[13px] whitespace-nowrap overflow-x-auto scrollbar-none font-semibold [text-shadow:_0_1px_3px_rgba(0,0,0,0.4)]">
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm border border-white/30">
                                    <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </div>
                                <span>Miễn phí vận chuyển</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm border border-white/30">
                                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </div>
                                <span>Bảo hành chính hãng 3 năm</span>
                            </div>
                            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                <div className="w-5.5 h-5.5 sm:w-6 sm:h-6 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shrink-0 shadow-sm border border-white/30">
                                    <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" />
                                </div>
                                <span>Quà tặng hấp dẫn</span>
                            </div>
                        </div>
                    </div>

                    {/* CỘT GIỮA: Khoảng thở tự nhiên cho 3D Glass Artwork */}
                    <div className="hidden lg:block lg:w-[24%]" />

                    {/* CỘT PHẢI (~28%): COUNTDOWN BOXES & CTA PILL BUTTON */}
                    <div className="flex flex-col items-center lg:items-end gap-3 lg:w-[28%] shrink-0">
                        <span className="text-[13px] sm:text-[14px] font-black uppercase tracking-wider text-white [text-shadow:_0_2px_4px_rgba(0,0,0,0.4)]">
                            KẾT THÚC TRONG
                        </span>

                        {/* 3 Sleek Glossy Burgundy 3D Glass Boxes: [14] : [36] : [46] */}
                        <div className="flex items-center gap-2 sm:gap-2.5">
                            {/* Box Giờ */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] bg-gradient-to-b from-[#6A0C16]/90 via-[#48040C]/90 to-[#2A0105]/95 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_10px_22px_rgba(0,0,0,0.35)] overflow-hidden">
                                    <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    <span className="text-[28px] sm:text-[32px] font-black tracking-tight tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                        {gio.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[11px] text-white/95 font-bold uppercase tracking-wider drop-shadow-xs">Giờ</span>
                            </div>

                            <span className="text-white font-black text-2xl pb-6 drop-shadow-sm select-none">:</span>

                            {/* Box Phút */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] bg-gradient-to-b from-[#6A0C16]/90 via-[#48040C]/90 to-[#2A0105]/95 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_10px_22px_rgba(0,0,0,0.35)] overflow-hidden">
                                    <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    <span className="text-[28px] sm:text-[32px] font-black tracking-tight tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                        {phut.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[11px] text-white/95 font-bold uppercase tracking-wider drop-shadow-xs">Phút</span>
                            </div>

                            <span className="text-white font-black text-2xl pb-6 drop-shadow-sm select-none">:</span>

                            {/* Box Giây */}
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="relative w-[58px] h-[58px] sm:w-[64px] sm:h-[64px] bg-gradient-to-b from-[#6A0C16]/90 via-[#48040C]/90 to-[#2A0105]/95 backdrop-blur-md rounded-2xl border border-white/30 flex items-center justify-center text-white shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_10px_22px_rgba(0,0,0,0.35)] overflow-hidden">
                                    <div className="absolute top-0 inset-x-2 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                                    <span className="text-[28px] sm:text-[32px] font-black tracking-tight tabular-nums leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                                        {giay.toString().padStart(2, '0')}
                                    </span>
                                </div>
                                <span className="text-[11px] text-white/95 font-bold uppercase tracking-wider drop-shadow-xs">Giây</span>
                            </div>
                        </div>

                        {/* CTA White Pill Button (width ~215-225px, height ~48px) */}
                        <a
                            href="#danh-sach-flash-sale"
                            className="mt-1 group w-[215px] sm:w-[225px] h-[48px] rounded-full bg-white hover:bg-slate-50 text-[#D31828] font-black text-[15px] sm:text-[16px] uppercase tracking-wider shadow-[0_10px_25px_rgba(0,0,0,0.25)] hover:shadow-[0_14px_30px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <span>SĂN DEAL NGAY</span>
                            <ArrowRight className="w-4 h-4 text-[#D31828] group-hover:translate-x-1.5 transition-transform duration-300" />
                        </a>
                    </div>
                </div>
            </div>

            {/* ========================================================================= */}
            {/* 2. SECTION HEADING (Khoảng cách mt-7 banner -> title, mt-4 title -> cards) */}
            {/* ========================================================================= */}
            <div id="danh-sach-flash-sale" className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div>
                    <h3 className="text-2xl sm:text-[26px] font-black text-[#0F172A] dark:text-white uppercase tracking-tight flex items-center gap-2.5">
                        <Flame className="w-6 h-6 fill-[#E11D48] text-[#E11D48]" />
                        <span>SẢN PHẨM FLASH SALE</span>
                    </h3>
                    <p className="text-[13px] sm:text-[14px] text-[#64748B] dark:text-slate-400 mt-1 font-normal">
                        Số lượng có hạn – Đừng bỏ lỡ cơ hội sở hữu laptop với giá cực tốt!
                    </p>
                </div>

                <Link
                    href="/khuyen-mai"
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0052cc] hover:text-[#003da5] dark:text-cyan-400 hover:underline transition-colors shrink-0"
                >
                    <span>Xem tất cả</span>
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* ========================================================================= */}
            {/* 3. 4 COMPACT PRODUCT CARDS (Gap 18px, Card height ~410-430px)             */}
            {/* ========================================================================= */}
            <div className="mt-3.5 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
                {dangTai ? (
                    [...Array(4)].map((_, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3 h-[410px]">
                            <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                            <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-4"></div>
                        </div>
                    ))
                ) : (
                    danhSach.slice(0, 4).map((sp) => (
                        <TheSanPham
                            key={sp.id || sp._id}
                            sanPham={sp}
                            cheDoHienThi="luoi"
                            hienThiThanhFlashSale={true}
                        />
                    ))
                )}
            </div>
        </section>
    );
}
