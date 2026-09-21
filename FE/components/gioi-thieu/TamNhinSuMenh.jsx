'use client';

import React from 'react';
import { ShieldCheck, RefreshCw, Award, HeartPulse, Sparkles, Target, Compass } from 'lucide-react';

export default function VisionMission() {
  const commitments = [
    {
      icon: ShieldCheck,
      title: '100% NGUYÊN SEAL',
      color: 'text-cyan-400 bg-cyan-500/15 border-cyan-400/30',
      caption: 'Tem niêm phong chính hãng nhà máy'
    },
    {
      icon: RefreshCw,
      title: '1 ĐỔI 1 TRONG 30 NGÀY',
      color: 'text-amber-400 bg-amber-500/15 border-amber-400/30',
      caption: 'Lỗi phần cứng đổi máy mới ngay'
    },
    {
      icon: Award,
      title: 'KỸ THUẬT CHUẨN HÃNG',
      color: 'text-blue-400 bg-blue-500/15 border-blue-400/30',
      caption: 'Tư vấn chuyên sâu theo vi kiến trúc'
    },
    {
      icon: HeartPulse,
      title: 'SPA MÁY TRỌN ĐỜI',
      color: 'text-rose-400 bg-rose-500/15 border-rose-400/30',
      caption: 'Vệ sinh & tra keo tản nhiệt gốm 0đ'
    }
  ];

  return (
    <section className="w-full rounded-3xl bg-gradient-to-br from-[#060D1E] via-[#091E42] to-[#0A192F] text-white p-6 sm:p-10 lg:p-14 border border-cyan-500/30 border-t-2 border-t-cyan-400 shadow-2xl relative overflow-hidden space-y-10 sm:space-y-12">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Top: 2-Column Bold Vision & Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 relative z-10">
        
        {/* 01 TẦM NHÌN */}
        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-cyan-400/40 transition-colors">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-cyan-300 to-blue-600 tracking-tighter">
              01
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                <span>TẦM NHÌN CHIẾN LƯỢC</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
                DẪN ĐẦU KỶ NGUYÊN AI PC
              </h3>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Trở thành hệ sinh thái bán lẻ laptop và giải pháp phần cứng AI PC hàng đầu Việt Nam. Giúp 100% người dùng sáng tạo, kỹ sư lập trình và game thủ tiếp cận sức mạnh xử lý NPU thế hệ mới với chi phí và hiệu suất tối ưu nhất.
          </p>
        </div>

        {/* 02 SỨ MỆNH */}
        <div className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-blue-400/40 transition-colors">
          <div className="flex items-baseline gap-4">
            <span className="text-5xl sm:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-400 to-indigo-600 tracking-tighter">
              02
            </span>
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-300 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-blue-400" />
                <span>SỨ MỆNH PHỤC VỤ</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight uppercase text-white">
                BẢO VỆ TỪNG ĐỒNG VỐN ĐẦU TƯ
              </h3>
            </div>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
            Bảo vệ khoản đầu tư công nghệ của khách hàng bằng 100% sản phẩm nguyên seal, chính sách bảo hành 1 đổi 1 trong 30 ngày minh bạch cùng dịch vụ bảo dưỡng spa máy hoàn toàn miễn phí trọn đời.
          </p>
        </div>

      </div>

      {/* Bottom: Horizontal Typographic Service Ribbon */}
      <div className="pt-6 sm:pt-8 border-t border-white/10 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-start gap-3 group p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-cyan-400/50 hover:bg-white/10 transition-all duration-300">
                <div className={`p-2.5 rounded-xl border ${item.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs sm:text-sm font-black tracking-wide text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </div>
                  <div className="text-[11px] text-slate-400 font-normal truncate">
                    {item.caption}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
