'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Home, 
  ChevronRight, 
  ShieldCheck, 
  RotateCcw, 
  Truck, 
  CreditCard, 
  Wrench,
  Clock, 
  Phone, 
  MessageSquare, 
  Headphones, 
  Gift, 
  CheckCircle2, 
  XCircle, 
  X,
  Building,
  Check,
  ThermometerSnowflake
} from 'lucide-react';

// Danh sách ngân hàng liên kết trả góp 0%
const NGAN_HANG_LIST = [
  { name: 'Vietcombank', code: 'VCB', bg: 'bg-[#005a3c]', color: 'text-white' },
  { name: 'Techcombank', code: 'TCB', bg: 'bg-[#e31837]', color: 'text-white' },
  { name: 'MB Bank', code: 'MB', bg: 'bg-[#1a3c87]', color: 'text-white' },
  { name: 'VPBank', code: 'VPB', bg: 'bg-[#00b04f]', color: 'text-white' },
  { name: 'ACB', code: 'ACB', bg: 'bg-[#005596]', color: 'text-white' },
  { name: 'TPBank', code: 'TPB', bg: 'bg-[#5e2d91]', color: 'text-white' },
  { name: 'BIDV', code: 'BIDV', bg: 'bg-[#006885]', color: 'text-white' },
  { name: 'Sacombank', code: 'STB', bg: 'bg-[#004b91]', color: 'text-white' }
];

// Danh sách thương hiệu laptop ủy quyền chính hãng
const LAPTOP_BRANDS = [
  { name: 'ASUS ROG', color: 'bg-black text-red-500' },
  { name: 'DELL', color: 'bg-[#007db8] text-white' },
  { name: 'LENOVO', color: 'bg-[#e2231a] text-white' },
  { name: 'APPLE', color: 'bg-slate-900 text-white' },
  { name: 'MSI', color: 'bg-[#ff0000] text-white' },
  { name: 'HP', color: 'bg-[#0096d6] text-white' },
  { name: 'ACER', color: 'bg-[#83b81a] text-white' }
];

// 4 Thẻ câu hỏi chính sách cốt lõi bám sát reference mockup
const POLICY_CARDS = [
  {
    id: 'tra-gop',
    anchorId: 'tra-gop',
    icon: CreditCard,
    iconBg: 'bg-blue-100 text-[#0052cc] dark:bg-blue-950 dark:text-cyan-400',
    badge: 'DUYỆT HỒ SƠ 3 PHÚT',
    badgeStyle: 'bg-blue-100/90 text-[#0052cc] dark:bg-blue-950 dark:text-cyan-300 font-extrabold border border-blue-200 dark:border-blue-800',
    question: 'TNTP Laptop hỗ trợ mua trả góp 0% lãi suất như thế nào? Cần giấy tờ gì?'
  },
  {
    id: 'doi-tra',
    anchorId: 'doi-tra',
    icon: RotateCcw,
    iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
    badge: 'ĐỔI MÁY MỚI 100% NGUYÊN SEAL',
    badgeStyle: 'bg-emerald-100/90 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold border border-emerald-200 dark:border-emerald-800',
    question: 'Chính sách "1 Đổi 1 Trong 30 Ngày Đầu" được áp dụng cụ thể ra sao?'
  },
  {
    id: 'van-chuyen',
    anchorId: 'van-chuyen',
    icon: Truck,
    iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
    badge: 'ĐỒNG KIỂM & BẬT TEST TẠI NHÀ',
    badgeStyle: 'bg-amber-100/90 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold border border-amber-200 dark:border-amber-800',
    question: 'Tôi ở xa đặt hàng online thì nhận máy như thế nào? Có được kiểm tra không?'
  },
  {
    id: 'bao-hanh',
    anchorId: 'bao-hanh',
    icon: Wrench,
    iconBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
    badge: 'SPA & VỆ SINH MÁY TRỌN ĐỜI',
    badgeStyle: 'bg-purple-100/90 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-extrabold border border-purple-200 dark:border-purple-800',
    question: 'Chế độ bảo hành chính hãng và bảo dưỡng "Spa Laptop" trọn đời gồm những gì?'
  }
];

// Dải bảo chứng 5 tiêu chuẩn
const TRUST_PILLARS = [
  { icon: Truck, title: 'Miễn phí vận chuyển', sub: 'Cho đơn từ 2.000.000đ', color: 'text-blue-600' },
  { icon: RotateCcw, title: '30 ngày đổi mới', sub: 'Lỗi NSX đổi máy mới 100%', color: 'text-emerald-600' },
  { icon: ShieldCheck, title: 'Bảo hành chính hãng', sub: 'Lên đến 36 tháng toàn quốc', color: 'text-indigo-600' },
  { icon: Headphones, title: 'Hỗ trợ 24/7', sub: 'Hotline: 1900.8946', color: 'text-purple-600' },
  { icon: Gift, title: 'Nhiều ưu đãi hấp dẫn', sub: 'Quà tặng kèm giá trị cao', color: 'text-amber-600' }
];

export default function TrangChinhSach() {
  const [modalPolicyId, setModalPolicyId] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const matched = POLICY_CARDS.find((c) => c.anchorId === hash);
        if (matched) {
          setModalPolicyId(matched.id);
        }
      }
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalPolicyId(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-3.5 max-w-5xl mx-auto pb-6">
      
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-semibold">
        <Link href="/" className="hover:text-[#0052cc] dark:hover:text-cyan-400 flex items-center gap-1 transition-colors">
          <Home className="w-3.5 h-3.5" />
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="font-extrabold text-slate-950 dark:text-white">Chính Sách &amp; Câu Hỏi Thường Gặp</span>
      </nav>

      {/* 2. KHỐI NỘI DUNG CHÍNH (HERO + 4 THẺ + CONTACT BAR) CHUẨN 100% THEO MOCKUP */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-200/70 dark:border-slate-800 rounded-3xl shadow-xl shadow-blue-500/5 p-4 sm:p-5 lg:p-6 space-y-3.5">
        
        {/* TOP HERO: TIÊU ĐỀ + 3 BADGES & LAPTOP 3D HD CỰC KỲ SẮC NÉT, KHÔNG BỊ MỜ, KHÔNG CÓ ĐƯỜNG CẮT */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#edf6fc] via-[#f4f9fe] to-[#e6f1fc] dark:from-slate-900/90 dark:via-slate-800/80 dark:to-slate-900/90 border border-blue-100/80 dark:border-slate-700/60 p-4 sm:p-5 flex flex-col lg:flex-row items-center justify-between min-h-[175px] sm:min-h-[190px]">
          
          {/* Ambient light glow mềm mịn */}
          <div aria-hidden="true" className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blue-400/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 right-32 w-56 h-56 rounded-full bg-cyan-400/15 blur-3xl" />

          {/* Nội dung bên trái */}
          <div className="relative z-10 space-y-2.5 max-w-xl sm:max-w-[55%]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 text-[11px] font-black border border-blue-200/80 dark:border-blue-800 tracking-wider">
              <Headphones className="w-3.5 h-3.5" />
              <span>HỖ TRỢ &amp; TƯ VẤN MUA HÀNG 24/7</span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-[27px] font-black text-slate-950 dark:text-white tracking-tight uppercase leading-[1.18]">
              CÂU HỎI THƯỜNG GẶP<br />
              KHI MUA LAPTOP TẠI{' '}
              <span className="text-[#0052cc] dark:text-cyan-400">TNTP LAPTOP</span>
            </h1>

            <p className="text-[11.5px] sm:text-xs text-slate-600 dark:text-slate-300 font-bold leading-relaxed">
              Giải đáp mọi thắc mắc để bạn yên tâm chọn mua và trải nghiệm laptop tốt nhất
            </p>

            {/* 3 Thẻ micro tính năng */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 pt-0.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-blue-100/80 dark:border-slate-700 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-[#0052cc] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-950 dark:text-white leading-tight">Tư vấn chuyên sâu</div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-semibold">Đội ngũ kỹ thuật viên</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-blue-100/80 dark:border-slate-700 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-[#0052cc] text-white flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-950 dark:text-white leading-tight">Hỗ trợ toàn quốc</div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-semibold">Giao nhanh, tận tâm</div>
                </div>
              </div>

              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/95 dark:bg-slate-800/95 border border-blue-100/80 dark:border-slate-700 shadow-2xs">
                <div className="w-7 h-7 rounded-md bg-[#0052cc] text-white flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-black text-slate-950 dark:text-white leading-tight">Phản hồi 3 phút</div>
                  <div className="text-[9.5px] text-slate-500 dark:text-slate-400 font-semibold">Hotline &amp; Zalo 24/7</div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Laptop 3D HD nét căng + Chữ nghệ thuật và Huy hiệu vector sắc nét 100% */}
          <div className="relative w-full lg:w-[45%] h-[170px] sm:h-[185px] flex items-center justify-end mt-3 lg:mt-0">
            
            {/* Slogan nghệ thuật bên trái màn hình laptop */}
            <div className="absolute left-0 sm:left-2 top-2 select-none pointer-events-none hidden sm:block text-right z-10">
              <span className="font-serif italic font-black text-[#0052cc] dark:text-cyan-400 text-xs sm:text-[12.5px] tracking-wide -rotate-6 leading-tight inline-block drop-shadow-2xs">
                Better Technology<br />
                <span className="text-blue-500 dark:text-cyan-300 font-bold">A Brighter You</span>
              </span>
            </div>

            {/* Laptop 3D HD Cutout siêu nét */}
            <div className="relative w-[310px] sm:w-[350px] lg:w-[370px] h-[160px] sm:h-[180px] transition-transform duration-300 hover:scale-102">
              <Image
                src="/images/faq-laptop-cutout-crisp.png"
                alt="TNTP Laptop AI PC High Definition"
                fill
                priority
                className="object-contain object-center drop-shadow-xl"
              />
            </div>

            {/* Huy hiệu 50.000+ khách hàng góc trên bên phải (VECTOR NÉT CĂNG 100%) */}
            <div className="absolute right-1 sm:right-2 top-1 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-white/95 dark:bg-slate-800/95 border border-blue-200/90 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 cursor-default">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="leading-tight text-left">
                <div className="text-[11px] font-black text-slate-900 dark:text-white">
                  Hơn 50.000+
                </div>
                <div className="text-[9px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  khách hàng tin tưởng
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#0052cc] dark:text-cyan-400" />
            </div>

            {/* Chữ viết tay "Luôn đồng hành cùng bạn" góc dưới bên phải */}
            <div className="absolute right-3 bottom-0.5 select-none pointer-events-none hidden sm:block text-right z-10">
              <span className="font-serif italic font-extrabold text-[#0052cc]/85 dark:text-cyan-400 text-[11px] tracking-wide -rotate-3 inline-block">
                Luôn đồng hành cùng bạn ✦
              </span>
            </div>

          </div>

        </div>

        {/* MIDDLE: 4 THẺ CÂU HỎI TRỰC QUAN GỌN GÀNG */}
        <div id="faq" className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
          {POLICY_CARDS.map((card) => {
            const IconComp = card.icon;

            return (
              <div
                key={card.id}
                id={card.anchorId}
                className="scroll-mt-28"
              >
                <button
                  type="button"
                  onClick={() => setModalPolicyId(card.id)}
                  className="w-full text-left p-3 sm:p-3.5 rounded-xl bg-white/95 dark:bg-slate-800/95 border border-slate-200/90 hover:border-[#0052cc] dark:border-slate-700 dark:hover:border-cyan-400 shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} transition-transform group-hover:scale-105`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div className="space-y-1 flex-1 min-w-0 pr-1">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9.5px] uppercase tracking-wider font-black ${card.badgeStyle}`}>
                        {card.badge}
                      </span>
                      <h3 className="font-black text-xs sm:text-[13.5px] text-slate-950 dark:text-white leading-snug group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {card.question}
                      </h3>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-slate-700 text-[#0052cc] dark:text-cyan-400 group-hover:bg-[#0052cc] group-hover:text-white border border-blue-200/60 dark:border-slate-600 transition-all flex items-center justify-center shrink-0 shadow-2xs">
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* CONTACT STRIP: THANH LIÊN HỆ GỌN GÀNG, SẮC NÉT */}
        <div className="rounded-xl bg-gradient-to-r from-blue-50/60 via-white/80 to-sky-50/60 dark:bg-slate-800/90 border border-blue-100/80 dark:border-slate-700 px-3.5 py-2.5 sm:px-4 sm:py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-9 h-9 rounded-full bg-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-black text-xs sm:text-sm text-slate-950 dark:text-white">
                Bạn vẫn còn câu hỏi?
              </h4>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                Chúng tôi luôn sẵn sàng tư vấn cấu hình phù hợp với nhu cầu của bạn.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            {/* Nút Hotline */}
            <a
              href="tel:19008946"
              className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-[#0052cc] hover:bg-blue-700 text-white font-black text-xs tracking-wide shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Hotline: 1900.8946</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>

            {/* Nút Gặp Kỹ Thuật Viên */}
            <Link
              href="/lien-he"
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-black dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-black text-xs tracking-wide shadow-xs transition-all flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-300" />
              <span>Gặp Kỹ Thuật Viên</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
          </div>
        </div>

      </div>

      {/* 3. DẢI BẢO CHỨNG 5 TIÊU CHUẨN */}
      <div className="max-w-5xl w-full mx-auto mt-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-white/90 dark:border-slate-800 py-2.5 px-4 sm:px-6 shadow-xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
          {TRUST_PILLARS.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={idx} 
                className={`flex items-center gap-2 ${idx > 0 ? 'sm:pl-3 lg:pl-3.5 pt-1.5 sm:pt-0' : ''}`}
              >
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center shrink-0 font-black">
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11.5px] font-black text-slate-950 dark:text-white leading-tight">
                    {pillar.title}
                  </div>
                  <div className="text-[10px] text-slate-600 dark:text-slate-400 font-semibold">
                    {pillar.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* =========================================================================
          4. MODAL DIALOG ĐÈ HOÀN TOÀN HEADER (z-[99999]), ĐỘ TƯƠNG PHẢN CAO, KHÔNG CUỘN
          ========================================================================= */}
      {modalPolicyId && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => setModalPolicyId(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-[#0052cc] dark:border-cyan-500 p-5 sm:p-6 text-slate-900 dark:text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Header Modal */}
            <div className="flex items-center justify-between gap-3 pb-3 border-b-2 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#0052cc] text-white shrink-0 shadow-xs">
                  {modalPolicyId === 'tra-gop' && 'TRẢ GÓP 0%'}
                  {modalPolicyId === 'doi-tra' && '1 ĐỔI 1 30 NGÀY'}
                  {modalPolicyId === 'van-chuyen' && 'GIAO 2H HỎA TỐC'}
                  {modalPolicyId === 'bao-hanh' && 'BẢO HÀNH & SPA 0Đ'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-slate-950 dark:text-white uppercase tracking-tight truncate">
                  {modalPolicyId === 'tra-gop' && 'Chính sách mua trả góp 0% // 28 Ngân hàng & CCCD'}
                  {modalPolicyId === 'doi-tra' && 'Chính sách 1 đổi 1 máy mới 100% nguyên seal trong 30 ngày'}
                  {modalPolicyId === 'van-chuyen' && 'Giao hàng hỏa tốc 2H & Đồng kiểm tại nhà trước thanh toán'}
                  {modalPolicyId === 'bao-hanh' && 'Bảo hành chính hãng 12-36T & Đặc quyền "Spa Laptop" 0đ'}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalPolicyId(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-100 hover:text-rose-600 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* NỘI DUNG INFOGRAPHIC TRỰC QUAN */}
            <div className="space-y-3 text-xs sm:text-sm">
              
              {/* MODAL 1: TRẢ GÓP 0% */}
              {modalPolicyId === 'tra-gop' && (
                <div className="space-y-3">
                  
                  {/* Khối Thẻ tín dụng */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200 dark:border-blue-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-black text-blue-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#0052cc]" />
                        <span>HÌNH THỨC 1: QUA THẺ TÍN DỤNG (VISA / MASTER / JCB)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-black text-[10px]">
                        0% Lãi Suất • 3 Phút
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      Kỳ hạn linh hoạt 3, 6, 9 hoặc 12 tháng. Không cần chứng minh thu nhập hay giữ giấy tờ. Quẹt thẻ lấy máy ngay tại Showroom hoặc thanh toán online an toàn.
                    </p>

                    {/* Logo ngân hàng thực tế */}
                    <div className="pt-1">
                      <div className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                        28 Ngân Hàng Hỗ Trợ:
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                        {NGAN_HANG_LIST.map((bank, i) => (
                          <div key={i} className="flex flex-col items-center justify-center p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xs">
                            <span className={`w-6 h-4 rounded ${bank.bg} ${bank.color} font-black text-[8px] flex items-center justify-center shrink-0`}>
                              {bank.code}
                            </span>
                            <span className="text-[9px] font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                              {bank.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Khối CCCD */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/80 border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-black text-emerald-900 dark:text-white text-xs sm:text-sm flex items-center gap-2">
                        <Building className="w-4 h-4 text-emerald-600" />
                        <span>HÌNH THỨC 2: QUA CCCD GẮN CHIP (TÀI CHÍNH CÔNG NGHỆ)</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">
                        Duyệt 10 Phút
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Từ 18 tuổi có CCCD chính chủ</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Trả trước từ 0đ đến 30%</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-slate-700 flex items-center gap-1.5 text-emerald-700">
                        <Check className="w-3.5 h-3.5 shrink-0" />
                        <span>Đối tác: Home Credit &amp; HD Saison</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* MODAL 2: 1 ĐỔI 1 TRONG 30 NGÀY */}
              {modalPolicyId === 'doi-tra' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/30 border-2 border-emerald-500 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>ĐƯỢC ĐỔI MÁY MỚI 100% NGUYÊN SEAL</span>
                    </div>
                    <ul className="text-xs font-bold text-slate-900 dark:text-slate-100 space-y-1.5 leading-relaxed">
                      <li>✔ Lỗi phần cứng do NSX: Bo mạch, CPU, GPU, bàn phím, sập nguồn, loa rè.</li>
                      <li>✔ Màn hình sọc chỉ, đốm sáng/tối vượt tiêu chuẩn hãng.</li>
                      <li>✔ Áp dụng trong 30 ngày tính từ thời điểm nhận máy.</li>
                      <li>✔ Còn giữ đầy đủ vỏ hộp trùng Serial, củ sạc và phụ kiện nguyên vẹn.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/30 border-2 border-rose-500 space-y-2">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-black text-xs sm:text-sm">
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>TRƯỜNG HỢP CHUYỂN SANG BẢO HÀNH</span>
                    </div>
                    <ul className="text-xs font-bold text-slate-900 dark:text-slate-100 space-y-1.5 leading-relaxed">
                      <li>✖ Máy rơi vỡ, móp méo cấn góc, nứt vỡ màn hình do lực ngoài.</li>
                      <li>✖ Máy ngấm chất lỏng, ẩm mốc, chập cháy điện.</li>
                      <li>✖ Tự ý tháo máy, sửa chữa ngoài trung tâm bảo hành ủy quyền.</li>
                      <li>✖ Mất vỏ hộp gốc hoặc phụ kiện gốc đi kèm theo máy.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* MODAL 3: VẬN CHUYỂN HỎA TỐC 2H */}
              {modalPolicyId === 'van-chuyen' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      01
                    </div>
                    <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase">
                      HỎA TỐC 2 GIỜ NỘI THÀNH
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                      Áp dụng nội thành TP.HCM &amp; Hà Nội. Miễn phí 100% cho đơn laptop từ 2 triệu. Shipper chuyên trách giao tận tay.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      02
                    </div>
                    <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase">
                      ĐÓNG GÓI BỌC KHÍ 4 LỚP
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                      Bọc xốp khí chống va đập chuyên dụng, dán tem vỡ niêm phong TNTP LAPTOP và bảo hiểm hàng hóa 100% toàn quốc.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border-2 border-amber-300 space-y-1.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500 text-white font-black text-xs flex items-center justify-center shadow-xs">
                      03
                    </div>
                    <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white uppercase">
                      ĐỒNG KIỂM TẬN TAY
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                      Khách hàng tự tay rạch seal, kiểm tra số Serial trùng khớp vỏ hộp và cắm sạc test máy rồi mới thanh toán COD.
                    </p>
                  </div>
                </div>
              )}

              {/* MODAL 4: BẢO HÀNH & SPA TRỌN ĐỜI */}
              {modalPolicyId === 'bao-hanh' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-800 space-y-2">
                    <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      <span>1. BẢO HÀNH CHÍNH HÃNG 12 – 36 THÁNG TOÀN QUỐC</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                      Tiếp nhận tại tất cả các Trung tâm Bảo hành Ủy Quyền chính thức của Hãng trên cả nước. Showroom TNTP tại TP.HCM &amp; Hà Nội hỗ trợ gửi hộ miễn phí 100%.
                    </p>

                    <div className="pt-1">
                      <div className="text-[10.5px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                        Hãng Sản Xuất Ủy Quyền Chính Thức:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {LAPTOP_BRANDS.map((brand, i) => (
                          <span key={i} className={`px-2.5 py-0.5 rounded font-black text-[11px] shadow-2xs ${brand.color}`}>
                            {brand.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-purple-50/80 dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-800 space-y-1.5">
                    <div className="font-black text-xs sm:text-sm text-slate-950 dark:text-white flex items-center gap-2">
                      <ThermometerSnowflake className="w-4 h-4 text-purple-600" />
                      <span>2. ĐẶC QUYỀN &ldquo;SPA LAPTOP 0Đ&rdquo; TRỌN ĐỜI MÁY</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700">
                        🧼 Vệ sinh quạt gió định kỳ 6 tháng/lần 0đ
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700">
                        ❄️ Tra keo Thermal Grizzly giảm 10 - 15°C
                      </div>
                      <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-slate-700">
                        🔒 Cam kết không can thiệp dữ liệu ổ cứng
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer Modal */}
            <div className="flex items-center justify-between pt-3 border-t-2 border-slate-100 dark:border-slate-800 text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400 text-xs">
                Tổng đài tư vấn: <strong className="text-slate-950 dark:text-white">1900.8946</strong>
              </span>
              
              <div className="flex items-center gap-2.5">
                <a
                  href="tel:19008946"
                  className="px-4 py-2.5 rounded-xl bg-[#0052cc] text-white font-black hover:bg-blue-700 transition-all flex items-center gap-1.5 shadow-md text-xs sm:text-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Gọi 1900.8946</span>
                </a>
                
                <button
                  type="button"
                  onClick={() => setModalPolicyId(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-slate-800 text-white font-black transition-all cursor-pointer text-xs sm:text-sm shadow-sm"
                >
                  Đóng cửa sổ ✕
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
