'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, Sparkles, Cpu, Zap, ShieldCheck } from 'lucide-react';

// Dữ liệu 4 phân đoạn (Chapters) đồng bộ với bản Desktop Cinematic nhưng tối ưu hoàn hảo cho Mobile
const CHAPTERS_MOBILE = [
    {
        code: '01 / AWAKEN',
        title1: 'KHỞI ĐỘNG',
        title2: 'SỨC MẠNH',
        cta: 'KHÁM PHÁ THIẾT KẾ',
        line1: 'Hiệu năng thế hệ mới.',
        line2: 'Sẵn sàng ngay khi bạn chạm tới.',
        specs: ['Intel Core Ultra', 'RTX 40-Series', 'OLED 120Hz']
    },
    {
        code: '02 / POWER',
        title1: 'SỨC MẠNH',
        title2: 'THỨC TỈNH',
        cta: 'XEM SỨC MẠNH',
        line1: 'Tốc độ phản hồi tức thì.',
        line2: 'Mọi chuyển động đều liền mạch.',
        specs: ['NPU AI 45 TOPS', 'RAM 32GB LPDDR5X', 'SSD Gen4 7000MB/s']
    },
    {
        code: '03 / EVOLVE',
        title1: 'BỨT PHÁ',
        title2: 'GIỚI HẠN',
        cta: 'CHẠM VÀO HIỆU NĂNG',
        line1: 'Thiết kế cho công việc đỉnh cao.',
        line2: 'Tối ưu cho sáng tạo & gaming.',
        specs: ['Vỏ Titan 1.19kg', 'Pin 18 Giờ', 'Chuẩn màu 100% DCI-P3']
    },
    {
        code: '04 / EXPERIENCE',
        title1: 'SẴN SÀNG',
        title2: 'BỨT PHÁ',
        cta: 'SĂN DEAL FLASH SALE',
        line1: 'Một trải nghiệm laptop mới.',
        line2: 'Mượt mà từ khung hình đầu tiên.',
        specs: ['Bảo hành 3 năm', 'Đổi mới 30 ngày', 'Trả góp 0%']
    }
];

export default function BannerHeroMobile() {
    const [activeIdx, setActiveIdx] = useState(0);

    // Tự động chuyển chapter mỗi 5.5 giây
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIdx((prev) => (prev + 1) % CHAPTERS_MOBILE.length);
        }, 5500);
        return () => clearInterval(interval);
    }, []);

    const cur = CHAPTERS_MOBILE[activeIdx];

    const cuonToiSection = (id = 'flash-sale') => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.scrollBy({ top: 520, behavior: 'smooth' });
        }
    };

    return (
        <section
            className="relative w-screen -mx-4 sm:-mx-6 -mt-6 sm:-mt-8 overflow-hidden bg-[#02060b] text-white select-none"
            style={{ minHeight: '480px', height: '68vh', maxHeight: '560px' }}
            aria-label="Banner trải nghiệm laptop điện ảnh Mobile"
        >
            {/* 1. ẢNH NỀN RENDER LAPTOP 3D TRUNG TÂM CỰC KỲ SẮC NÉT (KHÔNG BỊ CHE BỞI CHỮ) */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/banners/banner_hero_mobile_v2.jpg"
                    alt="TNTP Laptop Flagship"
                    className="w-full h-full object-cover object-center pointer-events-none transform scale-100 transition-transform duration-1000 ease-out"
                />

                {/* Gradient phủ đỉnh giúp thanh điều hướng trong trẻo và chữ nổi bật */}
                <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#02060b]/95 via-[#02060b]/60 to-transparent pointer-events-none" />

                {/* Vầng sáng Ambient Cyan phát ra từ laptop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

                {/* Lớp chuyển màu đáy mượt mà (Seamless Edge Blend) nối liền với trang web */}
                <div
                    className="absolute inset-x-0 bottom-0 h-36 pointer-events-none"
                    style={{
                        background: 'linear-gradient(to bottom, rgba(2, 6, 11, 0) 0%, rgba(2, 6, 11, 0.45) 40%, rgba(2, 6, 11, 0.85) 75%, var(--bg-primary, #f1f5f9) 100%)'
                    }}
                />
            </div>

            {/* 2. CẤU TRÚC NỘI DUNG 3 PHẦN: TOP (TIÊU ĐỀ & CTA) - CENTER (LAPTOP TỰ DO) - BOTTOM (SUBTITLE & SPECS) */}
            <div className="relative z-10 w-full h-full flex flex-col justify-between pt-5 pb-7 px-4">
                {/* PHẦN ĐỈNH: Badge, Tiêu đề lớn & Nút CTA chuẩn flagship */}
                <div className="flex flex-col items-center text-center space-y-1.5 animate-in fade-in duration-500">
                    {/* Badge Chương (Chapter Code) */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-cyan-950/70 border border-cyan-400/30 text-cyan-300 text-[10.5px] font-extrabold tracking-[0.22em] uppercase backdrop-blur-md shadow-sm">
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
                        <span>{cur.code}</span>
                    </div>

                    {/* Tiêu đề chính lớn, đậm nét, hiệu ứng neon điện ảnh */}
                    <h1 className="text-[32px] font-black tracking-tight leading-[1.05] text-white drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)]">
                        <span>{cur.title1}</span>
                        <br />
                        <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-400 bg-clip-text text-transparent">
                            {cur.title2}
                        </span>
                    </h1>

                    {/* Nút Call To Action dạng Pill Frosted phát sáng sang trọng */}
                    <button
                        type="button"
                        onClick={() => cuonToiSection('flash-sale')}
                        className="mt-2.5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-400 text-slate-950 font-black text-[11px] tracking-wider uppercase shadow-[0_4px_22px_rgba(56,217,255,0.42)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer border border-white/60"
                    >
                        <span>{cur.cta}</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                    </button>
                </div>

                {/* PHẦN GIỮA: KHOẢNG KHÔNG GIAN ĐỂ LAPTOP TỎA SÁNG TỰ NHIÊN, KHÔNG BỊ CHỮ CHE */}
                <div className="flex-1 w-full pointer-events-none" />

                {/* PHẦN ĐÁY: 2 dòng mô tả điện ảnh, 3 chip thông số & Chấm chuyển phân cảnh */}
                <div className="flex flex-col items-center text-center space-y-3">
                    {/* 2 dòng mô tả điện ảnh nguyên bản */}
                    <div className="space-y-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                        <p className="text-[13px] font-medium text-slate-200 leading-snug">
                            {cur.line1}
                        </p>
                        <p className="text-[13px] font-semibold text-cyan-300 leading-snug">
                            {cur.line2}
                        </p>
                    </div>

                    {/* 3 Thẻ Specs Pill Frosted siêu mỏng & tinh tế */}
                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {cur.specs.map((spec, i) => (
                            <span
                                key={i}
                                className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/60 text-slate-200 border border-cyan-500/20 backdrop-blur-md shadow-xs"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>

                    {/* Bộ chuyển 4 Chapter dạng Dots thanh lịch */}
                    <div className="flex items-center gap-2 pt-1">
                        {CHAPTERS_MOBILE.map((ch, idx) => (
                            <button
                                key={ch.code}
                                type="button"
                                onClick={() => setActiveIdx(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                                    idx === activeIdx
                                        ? 'w-7 bg-cyan-400 shadow-[0_0_8px_rgba(56,217,255,0.8)]'
                                        : 'w-2 bg-slate-700/80 hover:bg-slate-500'
                                }`}
                                aria-label={`Chuyển tới cảnh ${ch.code}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
