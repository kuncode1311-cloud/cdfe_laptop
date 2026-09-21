'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cpu, HardDrive, Keyboard, Mouse, ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { SanPhamService } from '@/services/san-pham.service';
import TheSanPham from '@/components/san-pham/TheSanPham';

export default function SectionLinhKienPhuKien() {
    const [danhSachLinhKien, setDanhSachLinhKien] = useState([]);
    const [dangTai, setDangTai] = useState(true);

    useEffect(() => {
        let daHuy = false;
        SanPhamService.layTatCaSanPhamAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                const linhKien = data.filter((sp) =>
                    sp.danh_muc && (sp.danh_muc.includes('linh-kien') || sp.danh_muc.includes('phu-kien-gear'))
                );
                // Nếu chưa có trong DB, fallback lấy 4 sản phẩm phụ kiện đại diện
                setDanhSachLinhKien(linhKien.length > 0 ? linhKien.slice(0, 4) : data.slice(0, 4));
            }
            if (!daHuy) setDangTai(false);
        }).catch(() => {
            if (!daHuy) setDangTai(false);
        });
        return () => { daHuy = true; };
    }, []);

    return (
        <section className="space-y-6">
            {/* 1. Header Khu Vực Linh Kiện & Gear */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200/90 dark:border-slate-800">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 text-[10.5px] font-black uppercase tracking-wider border border-purple-200/60 dark:border-purple-800/60 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-500" />
                            ECOSYSTEM & GAMING GEAR
                        </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span>LINH KIỆN NÂNG CẤP & PHỤ KIỆN GAMING GEAR</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Ổ cứng SSD NVMe Gen 4/5 7450 MB/s, RAM DDR5 6400MHz, Bàn phím cơ Custom OLED, Chuột siêu nhẹ 49g
                    </p>
                </div>

                <Link
                    href="/san-pham?danh_muc=linh-kien"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#0052cc] hover:text-[#003da5] dark:text-cyan-400 hover:underline shrink-0"
                >
                    <span>Xem tất cả linh kiện</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                </Link>
            </div>

            {/* 2. Banner Nhỏ Phân Loại Nhanh (Categories Badges) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                <Link
                    href="/san-pham?danh_muc=linh-kien"
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/80 to-white dark:from-slate-900 dark:to-slate-800/80 border border-blue-200/70 dark:border-slate-800 flex items-center gap-3 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <HardDrive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Ổ Cứng SSD NVMe</h3>
                        <p className="text-[10px] text-slate-400 truncate">Gen 4.0 / 5.0 Siêu Tốc</p>
                    </div>
                </Link>

                <Link
                    href="/san-pham?danh_muc=linh-kien"
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-white dark:from-slate-900 dark:to-slate-800/80 border border-emerald-200/70 dark:border-slate-800 flex items-center gap-3 hover:border-emerald-400 hover:shadow-md hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Bộ Nhớ RAM DDR5</h3>
                        <p className="text-[10px] text-slate-400 truncate">Bus 5600 - 6400MHz</p>
                    </div>
                </Link>

                <Link
                    href="/san-pham?danh_muc=phu-kien-gear"
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50/80 to-white dark:from-slate-900 dark:to-slate-800/80 border border-purple-200/70 dark:border-slate-800 flex items-center gap-3 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Keyboard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Bàn Phím Cơ Custom</h3>
                        <p className="text-[10px] text-slate-400 truncate">Gasket Mount • OLED</p>
                    </div>
                </Link>

                <Link
                    href="/san-pham?danh_muc=phu-kien-gear"
                    className="p-3.5 rounded-2xl bg-gradient-to-br from-rose-50/80 to-white dark:from-slate-900 dark:to-slate-800/80 border border-rose-200/70 dark:border-slate-800 flex items-center gap-3 hover:border-rose-400 hover:shadow-md hover:shadow-rose-500/10 hover:-translate-y-0.5 transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Mouse className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">Chuột Gaming Wireless</h3>
                        <p className="text-[10px] text-slate-400 truncate">Siêu nhẹ 49g • 26K DPI</p>
                    </div>
                </Link>
            </div>

            {/* 3. Lưới 4 Sản Phẩm Linh Kiện & Gear */}
            {dangTai ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px] animate-pulse">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[18px]">
                    {danhSachLinhKien.map((sp) => (
                        <TheSanPham key={sp.id || sp._id} sanPham={sp} cheDoHienThi="luoi" />
                    ))}
                </div>
            )}
        </section>
    );
}
