'use client';

import React from 'react';
import Image from 'next/image';
import { Cpu, Zap, Activity, Layers, Sparkles, Flame, Gauge, Eye } from 'lucide-react';

export default function TechnologyExperience() {
  const specs = [
    {
      label: 'AI PC NPU ARCHITECTURE',
      val: '45+ TOPS',
      caption: 'Vi xử lý thần kinh thế hệ mới',
      detail: 'Tăng tốc tác vụ AI cục bộ offline, xử lý hình ảnh & render video thần tốc.',
      icon: Cpu,
      gradient: 'from-cyan-400 to-blue-500',
      borderGlow: 'hover:border-cyan-400 hover:shadow-cyan-500/25',
      iconBox: 'bg-cyan-500/15 text-cyan-400 border-cyan-400/30'
    },
    {
      label: 'THERMAL COOLING LAB',
      val: 'Vapor Chamber 3D',
      caption: 'Tản nhiệt buồng hơi kim loại lỏng',
      detail: 'Kiểm soát nhiệt độ mát hơn 15°C khi render đồ họa hoặc combat game 4K kéo dài.',
      icon: Flame,
      gradient: 'from-amber-400 to-rose-500',
      borderGlow: 'hover:border-amber-400 hover:shadow-amber-500/25',
      iconBox: 'bg-amber-500/15 text-amber-400 border-amber-400/30'
    },
    {
      label: 'NVME EXTREME STORAGE',
      val: 'PCIe Gen 5',
      caption: 'Băng thông đọc ghi 14.000 MB/s',
      detail: 'Mở các project nặng 100GB trong chớp mắt, không còn độ trễ giật lag dữ liệu.',
      icon: Gauge,
      gradient: 'from-emerald-400 to-teal-500',
      borderGlow: 'hover:border-emerald-400 hover:shadow-emerald-500/25',
      iconBox: 'bg-emerald-500/15 text-emerald-400 border-emerald-400/30'
    },
    {
      label: 'HOLLYWOOD DISPLAY STANDARD',
      val: '100% DCI-P3',
      caption: 'Màn hình OLED chuẩn màu điện ảnh',
      detail: 'Tần số quét 240Hz, Delta E < 1 chuẩn màu cho designer, editor và creator chuyên nghiệp.',
      icon: Eye,
      gradient: 'from-purple-400 to-pink-500',
      borderGlow: 'hover:border-purple-400 hover:shadow-purple-500/25',
      iconBox: 'bg-purple-500/15 text-purple-400 border-purple-400/30'
    }
  ];

  return (
    <section className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#030A17] via-[#061533] to-[#040C1E] text-white border border-cyan-500/30 border-t-2 border-t-cyan-400 shadow-2xl p-6 sm:p-10 lg:p-14 space-y-8 sm:space-y-10">
      
      {/* Background Graphic & Hardware Visual Overlay */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <Image
          src="/images/about-tech-chip.jpg"
          alt="TNTP Hardware Architecture Macro"
          fill
          sizes="100vw"
          className="object-cover object-center filter saturate-[1.5]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030A17] via-[#030A17]/80 to-transparent" />
      </div>

      {/* Ambient Lighting Orbs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />

      {/* Header Content */}
      <div className="relative z-10 space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-lg shadow-cyan-500/10">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>TNTP HARDWARE ARCHITECTURE // 2026 STANDARD</span>
        </div>

        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-[1.12] text-white">
          CHÚNG TÔI KHÔNG CHẠY THEO CÔNG NGHỆ. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300">
            CHÚNG TÔI ĐƯA NÓ ĐẾN GẦN BẠN HƠN.
          </span>
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
          Từng chiếc máy tính xách tay phân phối tại TNTP LAPTOP đều là tinh hoa của kỹ thuật phần cứng, được cân chỉnh tối ưu giữa sức mạnh vi xử lý và khả năng vận hành bền bỉ.
        </p>
      </div>

      {/* 4 Precision Hardware Highlights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {specs.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between space-y-4 group ${item.borderGlow}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl border ${item.iconBox} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                    BENCHMARK
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block">
                    {item.label}
                  </span>
                  <div className={`text-xl sm:text-2xl font-black uppercase tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${item.gradient}`}>
                    {item.val}
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-200">
                  {item.caption}
                </div>
              </div>

              <p className="text-[11.5px] text-slate-400 leading-relaxed pt-3 border-t border-white/10 font-normal">
                {item.detail}
              </p>
            </div>
          );
        })}
      </div>

    </section>
  );
}

