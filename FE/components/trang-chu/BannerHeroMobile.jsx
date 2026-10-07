'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, ShieldCheck, Cpu, Flame, ChevronLeft, ChevronRight } from 'lucide-react';

// Dữ liệu các slide banner công nghệ cao cấp dành riêng cho Mobile
const SLIDES_MOBILE = [
    {
        id: 'gaming-ai',
        chapter: '01 / AWAKEN',
        tag: 'THẾ HỆ MỚI • AI HYBRID',
        titlePart1: 'KHỞI ĐỘNG',
        titlePart2: 'SỨC MẠNH',
        sub: 'Trang bị GPU RTX 40-Series & NPU Intel Core Ultra. Mượt mà từ khung hình đầu tiên.',
        image: '/images/banners/banner_hero_mobile.jpg',
        ctaText: 'SĂN DEAL FLASH SALE',
        targetId: 'flash-sale',
        specs: ['RTX 40-Series', 'OLED 165Hz', 'AI Engine'],
        accentColor: 'from-cyan-400 to-blue-600'
    },
    {
        id: 'ultrabook-titanium',
        chapter: '02 / EVOLVE',
        tag: 'ULTRABOOK AI 2026',
        titlePart1: 'BỨT PHÁ',
        titlePart2: 'GIỚI HẠN',
        sub: 'Vỏ Titan siêu mỏng nhẹ 1.19kg, thời lượng pin 18h, chuẩn màu đồ họa 100% DCI-P3.',
        image: '/images/banners/banner_hero_ultrabook.jpg',
        ctaText: 'KHÁM PHÁ CẤU HÌNH',
        targetId: 'flash-sale',
        specs: ['Core Ultra 7', 'Pin 18h', 'Titan 1.19kg'],
        accentColor: 'from-amber-300 via-teal-300 to-blue-500'
    }
];

export default function BannerHeroMobile() {
    const [hienTai, setHienTai] = useState(0);

    // Tự động chuyển slide mượt mà mỗi 6s
    useEffect(() => {
        const timer = setInterval(() => {
            setHienTai((prev) => (prev + 1) % SLIDES_MOBILE.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slide = SLIDES_MOBILE[hienTai];

    const cuonToiSection = (id) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: 450, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative w-full rounded-3xl overflow-hidden bg-[#02060b] text-white border border-blue-900/30 shadow-2xl select-none"
            aria-label="Banner điện ảnh TNTP Laptop Mobile"
        >
            {/* 1. NỀN ẢNH VÀ HIỆU ỨNG ÁNH SÁNG CÔNG NGHỆ CHUẨN TỈ LỆ KHÔNG BỊ BÓ */}
            <div className="relative w-full h-[540px] overflow-hidden">
                {/* Lớp ảnh nền Render Laptop Siêu Nét */}
                <img
                    src={slide.image}
                    alt={`${slide.titlePart1} ${slide.titlePart2}`}
                    className="w-full h-full object-cover object-center transition-all duration-700 transform scale-100 ease-out"
                />

                {/* Gradient phủ đỉnh (giúp thanh điều hướng và chữ hiển thị trong trẻo) */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#02060b]/90 via-[#02060b]/40 to-[#02060b]/95 pointer-events-none" />

                {/* Vầng sáng Ambient Glow Neon */}
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* 2. NỘI DUNG CHÍNH (TYPOGRAPHY & CALL TO ACTION) */}
                <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
                    {/* Phần trên: Badge phân cảnh & Thông số */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 backdrop-blur-md shadow-sm">
                                <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                                {slide.chapter}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 tracking-wider">
                                {slide.tag}
                            </span>
                        </div>

                        {/* Tiêu đề chính lớn, đậm nét */}
                        <div className="pt-2">
                            <h2 className="text-3xl font-black tracking-tight leading-none text-white drop-shadow-md">
                                <span>{slide.titlePart1}</span>
                                <br />
                                <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                                    {slide.titlePart2}
                                </span>
                            </h2>
                        </div>
                    </div>

                    {/* Phần dưới: Mô tả, Chips thông số & Nút hành động */}
                    <div className="space-y-4">
                        {/* 3 Thẻ Specs thu nhỏ */}
                        <div className="flex flex-wrap items-center gap-2">
                            {slide.specs.map((item, idx) => (
                                <span
                                    key={idx}
                                    className="px-2.5 py-1 text-[10.5px] font-bold rounded-lg bg-slate-900/80 text-slate-200 border border-slate-700/60 backdrop-blur-md shadow-xs flex items-center gap-1"
                                >
                                    <Cpu className="w-3 h-3 text-cyan-400" />
                                    {item}
                                </span>
                            ))}
                        </div>

                        {/* Đoạn mô tả mượt mà */}
                        <p className="text-xs text-slate-300/90 leading-relaxed font-medium line-clamp-2 drop-shadow-sm">
                            {slide.sub}
                        </p>

                        {/* Nút hành động CTA & Chuyển slide */}
                        <div className="pt-1 flex items-center gap-2.5">
                            <button
                                type="button"
                                onClick={() => cuonToiSection(slide.targetId)}
                                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all cursor-pointer"
                            >
                                <span>{slide.ctaText}</span>
                                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                            </button>

                            {/* Nút lùi/tiến slide nhanh */}
                            <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
                                <button
                                    type="button"
                                    onClick={() => setHienTai((prev) => (prev === 0 ? SLIDES_MOBILE.length - 1 : prev - 1))}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg active:scale-90 transition-all cursor-pointer"
                                    aria-label="Slide trước"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHienTai((prev) => (prev + 1) % SLIDES_MOBILE.length)}
                                    className="p-2 text-slate-400 hover:text-white rounded-lg active:scale-90 transition-all cursor-pointer"
                                    aria-label="Slide kế tiếp"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chỉ báo Dots & Thanh tiến trình */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 font-semibold border-t border-slate-800/80">
                            <div className="flex items-center gap-1.5">
                                {SLIDES_MOBILE.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setHienTai(idx)}
                                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                            idx === hienTai ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-700'
                                        }`}
                                        aria-label={`Chuyển tới slide ${idx + 1}`}
                                    />
                                ))}
                            </div>
                            <span className="flex items-center gap-1 text-slate-400">
                                <span>TNTP LAPTOP // 2026</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. DẢI BẢO CHỨNG CÔNG NGHỆ BÊN DƯỚI */}
            <div className="grid grid-cols-3 divide-x divide-slate-800/80 bg-slate-950/90 border-t border-slate-900 text-center py-2.5 px-1">
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-cyan-400 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> 100%
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Chính Hãng</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-amber-400 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Giao 2H
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Siêu Tốc</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-emerald-400 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> 30 Ngày
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">1 Đổi 1</span>
                </div>
            </div>
        </section>
    );
}
