'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, 
  Crown,
  Laptop, 
  Users, 
  Store, 
  Heart, 
  Check, 
  ShieldCheck, 
  Cpu, 
  ShoppingBag, 
  Gem, 
  MapPin, 
  Info,
  Sparkles
} from 'lucide-react';
import { SanPhamService } from '@/services/san-pham.service';
import { DanhMucService } from '@/services/danh-muc.service';

/**
 * Component Hero Giới Thiệu Cửa Hàng & Băng Thống Kê TNT LAPTOP
 * Thiết kế bám sát 100% Reference Design Spec:
 * - Khung Hero Panorama núi băng AI Laptop công nghệ cao (min-h-[460px] lg:h-[480px])
 * - Phân chia bố cục Trái 55% / Phải 45% hòa trực tiếp vào cảnh nền
 * - Chữ mờ watermark "AI PC NEXT GEN" và chữ thư pháp "Power Your Future"
 * - 4 Trust Cards ngang tinh xảo (Nguyên Seal, Test Bo Mạch, 1 Đổi 1, Spa Trọn Đời)
 * - Nút Showroom góc phải dưới, Badge 100% Factory Seal góc phải trên
 * - Băng Thống Kê Stats Bar đơn khối màu trắng, 4 cột chia divider dọc
 */
export default function GioiThieuHero() {
  const [tongSoMay, setTongSoMay] = useState(12);
  const [tongSoHang, setTongSoHang] = useState(7);

  useEffect(() => {
    let daHuy = false;
    Promise.all([
      SanPhamService.layTatCaSanPhamAsync(),
      DanhMucService.layDanhSachThuongHieuAsync()
    ]).then(([sps, brands]) => {
      if (!daHuy) {
        if (Array.isArray(sps) && sps.length > 0) setTongSoMay(sps.length);
        if (Array.isArray(brands) && brands.length > 0) setTongSoHang(brands.length);
      }
    }).catch(() => {});
    return () => { daHuy = true; };
  }, []);

  return (
    <div className="space-y-4 sm:space-y-5 w-full">
      
      {/* =========================================================================
          1. HERO BANNER CHÍNH (BÁM SÁT 100% REFERENCE DESIGN SPEC)
          ========================================================================= */}
      <section className="relative w-full rounded-[24px] sm:rounded-[28px] overflow-hidden border border-[#cce0fb] shadow-[0_16px_45px_-12px_rgba(0,82,204,0.18)] bg-white min-h-[470px] lg:h-[490px] flex items-center">
        
        {/* =========================================================================
            LỚP NỀN TOÀN CẢNH HÒA QUYỆN (PANORAMIC SEAMLESS INTEGRATION NHƯ LÚC ĐẦU)
            - Ảnh trải dài toàn bộ banner (inset-0) tạo cảm giác không gian mở liên hoàn
            - Gradient sương mù trắng tuyết mượt mà chuyển tiếp từ trái sang phải
            - Không chia đôi, không tạo cảm giác 2 cột tách rời
            ========================================================================= */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/banners/hero-mountain-ai-laptop.jpg"
            alt="TNTP Laptop AI PC Flagship"
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-[75%_center] lg:object-right"
          />
          
          {/* Lớp chuyển tiếp tự nhiên: Trắng mờ ở vùng chữ rồi hòa dần vào không gian núi tuyết */}
          <div 
            aria-hidden="true" 
            className="absolute inset-0 bg-gradient-to-r from-white via-white/92 md:via-white/80 to-transparent w-full md:w-[72%] pointer-events-none" 
          />
          <div 
            aria-hidden="true" 
            className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/70 via-white/20 to-transparent pointer-events-none" 
          />
        </div>

        {/* CÁC THÀNH PHẦN NGHỆ THUẬT PHÍA PHẢI */}

        {/* 1. Official Badge Góc Phải Trên: "100% Factory Seal Phân Phối Chính Hãng" */}
        <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ebfbf2]/95 backdrop-blur-xs border border-[#a3e6be] text-[#0d8a4e] text-[11px] sm:text-xs font-bold shadow-xs">
            <span className="w-4 h-4 rounded-full bg-[#0d8a4e] text-white flex items-center justify-center shrink-0">
              <Check className="w-2.5 h-2.5 stroke-[3.5]" />
            </span>
            <span>100% Factory Seal Phân Phối Chính Hãng</span>
          </span>
        </div>

        {/* 2. Nút Showroom Góc Phải Dưới: "📍 SĂN HÀNG SHOWROOM →" */}
        <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-6 z-20">
          <a
            href="#he-thong-showroom"
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#0052cc] hover:bg-[#003da5] text-white text-xs font-black tracking-wider uppercase shadow-md shadow-blue-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>SĂN HÀNG SHOWROOM</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* CỘT TRÁI: NỘI DUNG CHÍNH HERO (HÒA QUYỆN LIÊN MẠCH TRÊN NỀN BANNER TOÀN CẢNH) */}
        <div className="relative z-20 w-full md:w-[62%] lg:w-[58%] p-5 sm:p-7 lg:p-9 space-y-3.5 sm:space-y-4">
          
          {/* Top Badge Định Danh */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50/90 backdrop-blur-xs border border-blue-200 text-[#0052cc] text-[11px] font-black uppercase tracking-wider shadow-2xs">
            <Crown className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>HỆ THỐNG TNTP LAPTOP // TRÍ - NHẤT - TÀI - PHÚ // EST. 2020</span>
          </div>

          {/* Eyebrow Tiêu Đề */}
          <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#0052cc]">
            <Crown className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>TIÊN PHONG CÔNG NGHỆ AI PC &amp; HIỆU NĂNG ĐỈNH CAO</span>
            <Info className="w-3 h-3 text-slate-400" />
          </div>

          {/* Heading H1 Chuẩn Spec */}
          <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black tracking-tight text-slate-950 uppercase leading-[1.18]">
            HỆ THỐNG BÁN LẺ LAPTOP CAO CẤP<br />
            <span className="text-[#0052cc]">
              &amp; GIẢI PHÁP AI PC CHÍNH HÃNG
            </span>
          </h1>

          {/* Đoạn giới thiệu súc tích - Chữ Đậm Rõ Nét Tuyệt Đối */}
          <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed font-normal max-w-xl">
            Thành lập năm 2020 bởi 4 nhà sáng lập kỹ thuật <strong className="text-slate-950 font-bold">Lê Minh Trí, Mai Thống Nhất, Âu Lê Thành Tài, Lâm Đường Phú</strong>. 
            TNTP LAPTOP mang đến chuẩn mực <strong className="text-[#0052cc] font-bold">100% máy nguyên seal xuất xưởng</strong>, kiểm chuẩn bo mạch 5 bước và dịch vụ bảo dưỡng trọn đời.
          </p>

          {/* 4 TRUST CARDS NẰM NGANG TRẢI DÀI (Hòa Nhập Liên Hoàn Giữa 2 Phía, Không Bị Chia 2 Cột) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 pt-1 w-full">
            
            {/* Card 1: 100% Nguyên Seal */}
            <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-emerald-50/90 backdrop-blur-md border border-emerald-200/90 shadow-2xs hover:bg-white transition-colors">
              <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">100% Nguyên Seal</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-600 font-medium leading-tight">Cam kết chính hãng</div>
              </div>
            </div>

            {/* Card 2: Test Bo Mạch 5 Bước */}
            <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-blue-50/90 backdrop-blur-md border border-blue-200/90 shadow-2xs hover:bg-white transition-colors">
              <div className="w-7 h-7 rounded-lg bg-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Test Bo Mạch 5 Bước</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-600 font-medium leading-tight">Kiểm tra kỹ thuật</div>
              </div>
            </div>

            {/* Card 3: 1 Đổi 1 30 Ngày */}
            <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-amber-50/90 backdrop-blur-md border border-amber-200/90 shadow-2xs hover:bg-white transition-colors">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShoppingBag className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">1 Đổi 1 30 Ngày</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-600 font-medium leading-tight">An tâm sử dụng</div>
              </div>
            </div>

            {/* Card 4: Spa Trọn Đời 0đ */}
            <div className="flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-xl bg-purple-50/90 backdrop-blur-md border border-purple-200/90 shadow-2xs hover:bg-white transition-colors">
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Gem className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight overflow-hidden">
                <div className="text-[11px] sm:text-xs font-black text-slate-900 leading-tight">Spa Trọn Đời 0đ</div>
                <div className="text-[9.5px] sm:text-[10px] text-slate-600 font-medium leading-tight">Bảo dưỡng trọn đời</div>
              </div>
            </div>

          </div>

          {/* HÀNG NÚT KÊU GỌI HÀNH ĐỘNG (CTA) */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1 sm:pt-2">
            <Link
              href="/san-pham"
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0052cc] hover:bg-[#003da5] text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <Laptop className="w-4 h-4" />
              <span>KHÁM PHÁ CỖ MÁY</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#doi-ngu-sang-lap"
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:border-[#0052cc] hover:text-[#0052cc] cursor-pointer shadow-2xs shrink-0"
            >
              <Users className="w-4 h-4 text-[#0052cc]" />
              <span>BAN SÁNG LẬP</span>
            </a>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-xs border border-slate-200/90 text-xs text-slate-700 font-medium shadow-2xs">
              <span className="text-amber-500 font-bold">⚡</span>
              <span>Hơn <strong className="text-slate-900 font-bold">5,000+</strong> khách hàng tin chọn</span>
            </div>
          </div>

        </div>

      </section>

      {/* =========================================================================
          2. BĂNG THỐNG KÊ (STATS BAR) ĐỒNG BỘ 100% REFERENCE DESIGN SPEC
          - Một White Horizontal Container duy nhất
          - 4 Cột phân cách bằng vertical divider
          ========================================================================= */}
      <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3 sm:p-4 grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
        
        {/* Cột 1: Mẫu Flagship */}
        <div className="flex items-center gap-3.5 p-2 sm:px-4 sm:py-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] border border-blue-100/80 flex items-center justify-center shrink-0">
            <Laptop className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{tongSoMay}+</div>
            <div className="text-xs font-bold text-slate-800">Mẫu Flagship</div>
            <div className="text-[10.5px] text-slate-400 font-medium">Cập nhật liên tục</div>
          </div>
        </div>

        {/* Cột 2: Hãng Tier-1 */}
        <div className="flex items-center gap-3.5 p-2 sm:px-4 sm:py-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] border border-blue-100/80 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{tongSoHang}</div>
            <div className="text-xs font-bold text-slate-800">Hãng Tier-1</div>
            <div className="text-[10.5px] text-slate-400 font-medium">Đối tác chiến lược</div>
          </div>
        </div>

        {/* Cột 3: Showroom */}
        <div className="flex items-center gap-3.5 p-2 sm:px-4 sm:py-1">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0052cc] border border-blue-100/80 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="leading-tight">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">03</div>
            <div className="text-xs font-bold text-slate-800">Showroom</div>
            <div className="text-[10.5px] text-slate-400 font-medium">Trải nghiệm thực tế</div>
          </div>
        </div>

        {/* Cột 4: Hài Lòng */}
        <div className="flex items-center gap-3.5 p-2 sm:px-4 sm:py-1">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 border border-rose-100/80 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 fill-rose-500" />
          </div>
          <div className="leading-tight">
            <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">99.8%</div>
            <div className="text-xs font-bold text-slate-800">Hài Lòng</div>
            <div className="text-[10.5px] text-slate-400 font-medium">Từ khách hàng</div>
          </div>
        </div>
      </div>
    </div>
  );
}
