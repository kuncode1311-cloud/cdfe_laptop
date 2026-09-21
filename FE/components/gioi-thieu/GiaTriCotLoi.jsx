'use client';

import React from 'react';
import Image from 'next/image';
import { ShieldCheck, Cpu, CheckCircle2, Award, Zap, HeartHandshake, Sparkles } from 'lucide-react';

export default function CoreValuesBento() {
  return (
    <section className="w-full py-8 sm:py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[#0052cc] dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HỆ GIÁ TRỊ CỐT LÕI // TNTP 2026</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight uppercase text-slate-900 dark:text-white">
            CHUẨN MỰC PHẦN CỨNG <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#0052cc] to-cyan-500">TNTP</span>
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
          Mỗi cỗ máy xuất xưởng từ hệ thống TNTP LAPTOP đều tuân thủ nguyên tắc kiểm chuẩn đa tầng và bảo vệ trọn vẹn quyền lợi người dùng.
        </p>
      </div>

      {/* Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        
        {/* Tile 1: Large Statement Tile (Col 7) - Cyber Dark Mesh */}
        <div className="md:col-span-7 rounded-3xl bg-gradient-to-br from-[#060D1E] via-[#091E42] to-[#0A192F] text-white p-6 sm:p-8 border border-cyan-500/30 shadow-2xl flex flex-col justify-between relative overflow-hidden space-y-6 group hover:border-cyan-400 transition-colors">
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-bold uppercase tracking-wider border border-cyan-500/40 backdrop-blur-md">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>CTO HARDWARE QA STANDARD</span>
            </div>
            <h3 className="text-xl sm:text-3xl font-black tracking-tight text-white uppercase leading-tight">
              QUY TRÌNH KIỂM CHUẨN <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-blue-400">
                5 BƯỚC KHẮT KHE
              </span>
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Dưới sự giám sát trực tiếp của CTO Âu Lê Thành Tài, 100% thiết bị đều trải qua quy trình kiểm tra chuyên sâu trước khi bàn giao tới tay khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10 pt-4 border-t border-white/15">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Quét SKU & kiểm tra Factory Seal</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Zero Dead Pixel màn hình chuẩn màu</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Stress-test Cinebench & FurMark nhiệt độ</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Benchmark tốc độ SSD Gen 4/5 thực tế</span>
            </div>
          </div>
        </div>

        {/* Tile 2: Hardware Visual Tile (Col 5) */}
        <div className="md:col-span-5 rounded-3xl overflow-hidden relative min-h-[260px] border border-slate-200/80 dark:border-slate-800 shadow-xl group bg-slate-950">
          <Image
            src="/images/about-cooling-fan.jpg"
            alt="TNTP Hardware Architecture"
            fill
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-1.5 z-10">
            <div className="text-[10.5px] font-extrabold uppercase tracking-widest text-cyan-400">
              VI KIẾN TRÚC & PHẦN CỨNG
            </div>
            <h4 className="text-base sm:text-lg font-black uppercase text-white leading-snug">
              Tối Ưu Hiệu Năng & Tản Nhiệt
            </h4>
            <p className="text-xs text-slate-300 line-clamp-2">
              Đồng bộ vi mạch, buồng hơi 3D Vapor Chamber và kim loại lỏng cho độ bền vận hành tối đa.
            </p>
          </div>
        </div>

      </div>

      {/* 3 Value Cards Bên Dưới với dải màu sắc công nghệ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Minh Bạch (Blue/Cyan) */}
        <div className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-cyan-400 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden space-y-3">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-cyan-400" />
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 border border-blue-400/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
            100% NGUYÊN BẢN MINH BẠCH
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Nói không với hàng dựng, hàng tân trang tráo linh kiện. Khách hàng tự tay rạch seal tại showroom hoặc nhận video unbox nguyên thùng chuẩn hãng.
          </p>
        </div>

        {/* Card 2: Tài Chính (Emerald) */}
        <div className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-emerald-400 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden space-y-3">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <Zap className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            TỐI ƯU HÓA TÀI CHÍNH 0%
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Hợp tác trực tiếp 28 ngân hàng lớn, hỗ trợ trả góp 0% lãi suất với tỷ lệ duyệt hồ sơ 99%, không phát sinh phí ẩn, trợ giá nâng cấp RAM/SSD.
          </p>
        </div>

        {/* Card 3: Dịch Vụ 5 Sao (Purple) */}
        <div className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-purple-400 hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden space-y-3">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 to-pink-500" />
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-400/30 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
            DỊCH VỤ KHÁCH HÀNG 5 SAO
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            Kỹ thuật viên chuyên nghiệp am hiểu sâu vi kiến trúc, hỗ trợ sao lưu dữ liệu, cài đặt ứng dụng đồ họa và vệ sinh spa máy trọn đời miễn phí.
          </p>
        </div>
      </div>

    </section>
  );
}

