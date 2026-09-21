'use client';

import React, { useState } from 'react';
import { TrendingUp, Sparkles, CheckCircle2, Award, ArrowRight } from 'lucide-react';

const MILESTONES = [
  {
    nam: '2020',
    tieuDe: 'Khởi Đầu Minh Bạch',
    noiDung: 'Lê Minh Trí, Mai Thống Nhất, Âu Lê Thành Tài và Lâm Đường Phú thành lập hệ thống TNTP LAPTOP với tuyên ngôn 100% nguyên seal.',
    tag: 'Thành Lập Hệ Thống',
    accent: 'from-blue-600 to-cyan-400',
    dotColor: 'bg-blue-600 text-white border-blue-400'
  },
  {
    nam: '2022',
    tieuDe: 'Đối Tác Tier-1 Toàn Cầu',
    noiDung: 'Ký kết phân phối ủy quyền trực tiếp ASUS ROG, Lenovo Legion, Dell Alienware, Apple MacBook, MSI và Acer Predator tại Việt Nam.',
    tag: 'Tier-1 Partnership',
    accent: 'from-rose-500 to-amber-400',
    dotColor: 'bg-rose-600 text-white border-rose-400'
  },
  {
    nam: '2024',
    tieuDe: 'Mở Rộng Flagship Store',
    noiDung: 'Khai trương 3 không gian trải nghiệm cao cấp tại Quận 10, Bình Thạnh (TP.HCM) và Cầu Giấy (Hà Nội) với phòng Lab kỹ thuật riêng.',
    tag: 'Phủ Sóng 2 Miền',
    accent: 'from-purple-600 to-pink-500',
    dotColor: 'bg-purple-600 text-white border-purple-400'
  },
  {
    nam: '2026+',
    tieuDe: 'Dẫn Đầu Kỷ Nguyên AI PC',
    noiDung: 'Tiên phong phân phối dòng laptop AI PC tích hợp NPU 45+ TOPS, cán mốc phục vụ hơn 500.000 khách hàng và doanh nghiệp.',
    tag: 'Next-Gen AI Era',
    accent: 'from-cyan-400 to-emerald-400',
    dotColor: 'bg-cyan-500 text-slate-950 border-cyan-300'
  }
];

export default function BrandJourney() {
  const [activeStep, setActiveStep] = useState(3);

  return (
    <section className="w-full py-8 sm:py-14 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider shadow-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>CHẶNG ĐƯỜNG PHÁT TRIỂN // TNTP LAPTOP</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
            HÀNH TRÌNH 2020 — 2026+
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Từ những bước đi khởi nguyên đến vị thế hệ thống bán lẻ laptop hiệu năng cao và giải pháp phần cứng AI PC hàng đầu.
        </p>
      </div>

      {/* Connected Timeline */}
      <div className="relative pt-4">
        
        {/* Continuous Baseline Line (Desktop) */}
        <div className="hidden lg:block absolute top-[42px] left-8 right-8 h-[3px] bg-slate-200 dark:bg-slate-800 rounded-full" />
        
        {/* Active Progress Overlay Bar (Desktop) */}
        <div 
          className="hidden lg:block absolute top-[42px] left-8 h-[3px] bg-gradient-to-r from-blue-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-500 shadow-md shadow-cyan-500/50" 
          style={{ width: `${(activeStep / (MILESTONES.length - 1)) * 88}%` }}
        />

        {/* Timeline Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 relative z-10">
          {MILESTONES.map((item, idx) => {
            const isSelected = activeStep === idx;
            const isPastOrCurrent = idx <= activeStep;

            return (
              <div
                key={item.nam}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={`group cursor-pointer rounded-3xl p-5 border transition-all duration-300 hover:-translate-y-1.5 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isSelected
                    ? 'bg-white dark:bg-slate-900 border-cyan-400 shadow-xl ring-2 ring-cyan-400/20'
                    : 'bg-white/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg'
                }`}
              >
                {/* Top Accent Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent}`} />

                {/* Node Dot / Year Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-black text-xs transition-all duration-300 shadow-md ${
                      isSelected
                        ? `${item.dotColor} scale-110 ring-4 ring-cyan-400/20`
                        : isPastOrCurrent
                        ? 'bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-600 dark:text-cyan-400'
                        : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
                    }`}>
                      {idx + 1}
                    </div>
                    
                    <span className={`text-xl font-black tracking-tight transition-colors ${
                      isSelected ? 'text-[#0052cc] dark:text-cyan-400' : 'text-slate-900 dark:text-white'
                    }`}>
                      {item.nam}
                    </span>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.tag}
                  </span>
                </div>

                {/* Milestone Info */}
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors">
                    {item.tieuDe}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                    {item.noiDung}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>Xem cột mốc</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#0052cc] dark:text-cyan-400" />
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </section>
  );
}

