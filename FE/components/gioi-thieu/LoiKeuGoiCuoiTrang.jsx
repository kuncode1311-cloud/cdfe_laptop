'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Headphones, ShieldCheck, Zap, Award } from 'lucide-react';

export default function AboutFinalCTA() {
  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#030914] via-[#081F48] to-[#040E24] text-white border border-cyan-500/30 border-t-2 border-t-cyan-400 shadow-2xl">
      
      {/* Background glow and lighting effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 px-6 py-10 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left: Typography & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-cyan-500/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>SẴN SÀNG ĐỒNG HÀNH // TNTP LAPTOP</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.12] text-white">
                CHIẾC LAPTOP TIẾP THEO CỦA BẠN <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-200 to-indigo-300">
                  ĐANG CHỜ BẠN KHÁM PHÁ.
                </span>
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm lg:text-base max-w-lg font-normal leading-relaxed mx-auto lg:mx-0">
                Trải nghiệm sức mạnh xử lý vượt bậc cùng chính sách bảo hành 1 đổi 1 trong 30 ngày và dịch vụ bảo dưỡng spa trọn đời tại hệ thống TNTP LAPTOP.
              </p>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-300 pt-1">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>100% Nguyên Seal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>1 Đổi 1 30 Ngày</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Trả Góp 0% Lãi Suất</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <Link
                href="/san-pham"
                className="group px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center gap-2 cursor-pointer hover:shadow-cyan-500/40 hover:scale-105 active:scale-95"
              >
                <span>Khám Phá Toàn Bộ Máy</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-slate-950" />
              </Link>

              <Link
                href="/lien-he"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider backdrop-blur-md transition-all duration-300 flex items-center gap-2 cursor-pointer hover:border-cyan-400"
              >
                <Headphones className="w-4 h-4 text-cyan-300" />
                <span>Tư Vấn Kỹ Thuật</span>
              </Link>
            </div>

            <div className="pt-2 text-[11px] sm:text-xs text-slate-400 font-medium flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <span>Hotline Tư Vấn: <strong className="text-white">1900.8946</strong></span>
              <span>•</span>
              <span>Email Hỗ Trợ: <strong className="text-white">hotro@tntlaptop.vn</strong></span>
            </div>

          </div>

          {/* Right: Integrated Flagship Hardware Render */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/11] max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-400/30 bg-[#020B1D] group">
              <Image
                src="/images/about-cta-laptop.jpg"
                alt="TNTP LAPTOP Flagship Next-Gen System"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020B1D] via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-[#020B1D]/80 backdrop-blur-md border border-cyan-400/30 flex items-center justify-between text-xs">
                <span className="font-black text-white uppercase text-[11px] tracking-wider">TNTP FLAGSHIP LINEUP</span>
                <span className="text-cyan-400 font-bold text-[11px] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SẴN HÀNG TOÀN QUỐC</span>
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}

