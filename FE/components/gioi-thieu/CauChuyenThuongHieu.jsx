'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Users, 
  Settings, 
  ShieldCheck, 
  TrendingUp, 
  Star, 
  Heart, 
  ArrowRight,
  Quote
} from 'lucide-react';

const PILLARS = [
  {
    num: '01',
    letter: 'TRÍ',
    suffix: ' TUỆ',
    name: 'TRÍ TUỆ',
    sub: 'Tư vấn đúng nhu cầu',
    icon: Users,
    image: '/images/about/tntp-pillar-tri-tue.jpg',
    desc: 'Kế thừa chữ TRÍ từ CEO Lê Minh Trí: Am hiểu sâu sắc kiến trúc CPU/GPU, tư vấn cấu hình chính xác theo nhu cầu đồ họa, dựng phim, gaming, giúp tối ưu chi phí đầu tư.',
    founder: 'LÊ MINH TRÍ',
    role: 'CEO'
  },
  {
    num: '02',
    letter: 'NHẤT',
    suffix: ' TÂM',
    name: 'NHẤT TÂM',
    sub: 'Dịch vụ đệ nhất chuẩn 5★',
    icon: ShieldCheck,
    image: '/images/about/tntp-pillar-tan-tam.jpg',
    desc: 'Khởi nguồn chữ NHẤT từ COO Mai Thống Nhất: Nhất tâm phục vụ với chuẩn mực dịch vụ số 1, cam kết 100% nguyên seal nhà máy, 1 đổi 1 trong 30 ngày và hậu mãi chu đáo.',
    founder: 'MAI THỐNG NHẤT',
    role: 'COO'
  },
  {
    num: '03',
    letter: 'TÀI',
    suffix: ' NGHỆ',
    name: 'TÀI NGHỆ',
    sub: 'Kỹ thuật bo mạch đỉnh cao',
    icon: Settings,
    image: '/images/about/tntp-pillar-nhiet-huyet.jpg',
    desc: 'Bảo chứng chữ TÀI từ CTO Âu Lê Thành Tài: Tài nghệ kỹ thuật chuyên sâu, quy trình kiểm chuẩn bo mạch 5 bước khắt khe, spa và bảo dưỡng máy trọn đời 0đ.',
    founder: 'ÂU LÊ THÀNH TÀI',
    role: 'CTO'
  },
  {
    num: '04',
    letter: 'PHÚ',
    suffix: ' THỊNH',
    name: 'PHÚ THỊNH',
    sub: 'Hỗ trợ tài chính 0%',
    icon: TrendingUp,
    image: '/images/about/tntp-pillar-phat-trien.jpg',
    desc: 'Hiện thực hóa chữ PHÚ từ CFO Lâm Đường Phú: Đồng hành phát triển thịnh vượng, hợp tác trực tiếp 28 ngân hàng lớn hỗ trợ trả góp 0% duyệt nhanh trong 5 phút.',
    founder: 'LÂM ĐƯỜNG PHÚ',
    role: 'CFO'
  }
];

const STATS = [
  {
    icon: Users,
    val: '500.000+',
    label: 'Khách hàng tin tưởng',
    fill: false
  },
  {
    icon: ShieldCheck,
    val: '100%',
    label: 'Sản phẩm chính hãng',
    fill: false
  },
  {
    icon: Star,
    val: '4.9/5',
    label: 'Đánh giá từ khách hàng',
    fill: true
  },
  {
    icon: Heart,
    val: 'Trọn đời',
    label: 'Đồng hành cùng bạn',
    fill: true
  }
];

export default function CauChuyenThuongHieu() {
  return (
    <section className="relative w-full py-8 sm:py-10 lg:py-12 space-y-6 sm:space-y-7 bg-gradient-to-br from-[#DFEFFC] via-[#E8F3FD] to-[#D5E8F8] rounded-3xl border border-[#B8D7F2] p-5 sm:p-7 lg:p-9 overflow-hidden shadow-[0_16px_45px_-10px_rgba(0,82,204,0.14)]">
      
      {/* Background Ambient Glows */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-32 -left-20 w-[450px] h-[450px] rounded-full bg-blue-400/20 blur-[90px] z-0" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -bottom-32 -right-20 w-[450px] h-[450px] rounded-full bg-cyan-400/20 blur-[90px] z-0" 
      />

      {/* =========================================================================
          1. TOP-RIGHT SHOWROOM ATMOSPHERE (HÒA TRỘN TỰ NHIÊN - ZERO HARD EDGES)
          ========================================================================= */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute top-0 right-0 w-[46%] max-w-[580px] h-[310px] hidden lg:block overflow-hidden rounded-tr-3xl z-0"
        style={{
          maskImage: 'radial-gradient(ellipse 90% 85% at 85% 15%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 85% at 85% 15%, black 30%, rgba(0,0,0,0.6) 60%, transparent 88%)'
        }}
      >
        <Image
          src="/images/about/tntp-showroom-flagship.jpg"
          alt="Hệ thống Showroom TNTP LAPTOP"
          fill
          priority
          sizes="580px"
          className="object-cover object-center scale-105"
        />
        {/* Lớp gradient hòa tan đa hướng mượt mà vào nền xanh Icy Blue */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#DFEFFC] via-[#DFEFFC]/80 to-transparent w-full" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#E5F1FD] via-[#E5F1FD]/85 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#DFEFFC]/70 to-transparent" />
        <div className="absolute inset-0 bg-blue-600/5 mix-blend-multiply" />
      </div>

      {/* =========================================================================
          2. TOP INTRO (TIÊU ĐỀ BÊN TRÁI + KHỐI QUOTE THANH THOÁT CHUẨN REFERENCE)
          ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        
        {/* CỘT TRÁI: TIÊU ĐỀ & MÔ TẢ (~58% = 7 cols) */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3">
          {/* Nhãn định danh chuẩn Reference với thanh gạch ngang xanh */}
          <div className="flex items-center gap-2 text-[#0052cc] text-xs font-black uppercase tracking-wider">
            <span className="w-6 h-0.5 bg-[#0052cc] rounded-full inline-block" />
            <span>TRIẾT LÝ PHỤC VỤ // 4 TRỤ CỘT TNTP</span>
          </div>

          {/* Tiêu đề chính 2 dòng sắc nét bám sát Reference */}
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase tracking-tight text-slate-950 leading-[1.08]">
            CAM KẾT GIÁ TRỊ VÀNG<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] via-blue-600 to-cyan-600">
              TRÍ • NHẤT • TÀI • PHÚ
            </span>
          </h2>

          {/* Đoạn mô tả với độ tương phản cao, gắn kết trực tiếp 4 nhà sáng lập Trí - Nhất - Tài - Phú */}
          <p className="text-slate-700 text-xs sm:text-[13.5px] leading-relaxed font-medium max-w-xl">
            Không chỉ bán một chiếc laptop. TNTP LAPTOP hội tụ 4 giá trị vàng từ 4 nhà sáng lập: <strong className="text-[#0052cc] font-black">Trí</strong> tuệ am hiểu, <strong className="text-[#0052cc] font-black">Nhất</strong> tâm phục vụ, <strong className="text-[#0052cc] font-black">Tài</strong> nghệ chuẩn hóa và <strong className="text-[#0052cc] font-black">Phú</strong> thịnh bền lâu cho hơn{' '}
            <strong className="text-[#0052cc] font-extrabold underline decoration-blue-300 underline-offset-2">500.000 khách hàng</strong>.
          </p>
        </div>

        {/* CỘT GIỮA: THÔNG ĐIỆP TRIẾT LÝ (QUOTE) THANH LỊCH, NỔI BẬT KHÔNG BỊ TỆP MÀU */}
        <div className="lg:col-span-5 xl:col-span-5 relative z-10">
          <div className="relative p-4 sm:p-5 rounded-2xl bg-white/50 backdrop-blur-md border border-white/80 shadow-[0_8px_25px_-6px_rgba(0,82,204,0.08)] hover:bg-white/65 transition-all duration-300">
            {/* Dấu trích dẫn lớn đặc trưng màu xanh đậm */}
            <div className="text-3xl sm:text-4xl font-serif font-black text-[#0052cc] leading-none mb-1 select-none">
              &ldquo;
            </div>
            <p className="text-[13.5px] sm:text-[14.5px] text-slate-900 font-bold leading-relaxed italic -mt-2">
              Khách hàng là trung tâm trong mọi quyết định của chúng tôi.
            </p>
            <div className="flex items-center gap-2 pt-3 mt-2.5 border-t border-blue-200/60">
              <span className="text-xs font-black text-slate-950 uppercase tracking-wider">TNTP LAPTOP</span>
              <span className="w-5 h-0.5 bg-[#0052cc] rounded-full inline-block" />
              <span className="text-[11px] font-extrabold text-[#0052cc] tracking-widest uppercase">TRÍ • NHẤT • TÀI • PHÚ</span>
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================================
          3. BỐ CỤC 4 VALUE CARDS (HÒA QUYỆN ẢNH VÀO THÂN THẺ + HIỆU ỨNG HOVER XỊN)
          ========================================================================= */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {PILLARS.map((card, idx) => {
          const Icon = card.icon;

          return (
            <div
              key={idx}
              className="group relative rounded-2xl bg-white border border-white/90 shadow-[0_8px_25px_-4px_rgba(0,50,150,0.08)] hover:shadow-[0_20px_40px_-6px_rgba(0,82,204,0.18)] hover:border-blue-300 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden flex flex-col h-full"
            >
              {/* Vạch sáng ánh xanh trên đỉnh thẻ khi hover */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#0052cc] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />

              {/* 1. Ảnh thật photorealistic với lớp fade chuyển tiếp mượt mà vào thân thẻ */}
              <div className="relative w-full h-[155px] sm:h-[165px] overflow-hidden bg-slate-100">
                <Image
                  src={card.image}
                  alt={`${card.name} - ${card.sub}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                {/* Lớp gradient tan dần từ ảnh vào nền trắng phía dưới (xóa bỏ viền cạnh cứng) */}
                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* 2. Phần nội dung của Card */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 -mt-2 relative z-10">
                
                {/* Hàng Số thứ tự + Icon + Tên Trụ Cột Nổi Bật Chữ Cái Sáng Lập */}
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-950 tracking-tight group-hover:text-[#0052cc] transition-colors">
                    {card.num}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-900 font-black text-base sm:text-lg tracking-tight">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0052cc] border border-blue-100 flex items-center justify-center group-hover:bg-[#0052cc] group-hover:text-white transition-all duration-300 shadow-2xs">
                      <Icon className="w-4.5 h-4.5 stroke-[2.4]" />
                    </div>
                    <span>
                      <span className="text-[#0052cc] group-hover:text-blue-700 transition-colors">{card.letter}</span>
                      {card.suffix}
                    </span>
                  </div>
                </div>

                {/* Phụ đề màu TNT Blue nổi bật */}
                <div className="text-xs sm:text-[13px] font-bold text-[#0052cc] mt-2 leading-snug">
                  {card.sub}
                </div>

                {/* Đoạn mô tả chi tiết cam kết */}
                <p className="text-xs sm:text-[12px] text-slate-600 leading-relaxed font-normal mt-2.5 flex-1">
                  {card.desc}
                </p>

                {/* Footer chân Card (Founder / Role / Nút mũi tên tương tác có hiệu ứng) */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <div className="leading-tight">
                    <div className="text-xs font-black text-slate-900 tracking-wide uppercase">
                      {card.founder}
                    </div>
                    <div className="text-[10.5px] font-bold text-slate-400 mt-0.5">
                      {card.role}
                    </div>
                  </div>

                  <div className="w-7 h-7 rounded-full bg-blue-50 group-hover:bg-[#0052cc] text-[#0052cc] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-2xs group-hover:shadow-md">
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* =========================================================================
          4. STATS BAR NGANG ĐỒNG BỘ (CONTAINER TRẮNG NỔI BẬT + CALLIGRAPHY)
          ========================================================================= */}
      <div className="relative z-10 w-full bg-white rounded-2xl border border-white/90 shadow-[0_8px_25px_-4px_rgba(0,50,150,0.08)] hover:shadow-[0_12px_32px_-4px_rgba(0,82,204,0.12)] transition-all duration-300 px-4 sm:px-6 py-4 sm:py-5 flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 sm:gap-6">
        
        {/* 4 Cột Thống Kê Thẳng Hàng */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 flex-1 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;

            return (
              <div 
                key={idx} 
                className={`flex items-center gap-3 pt-2 sm:pt-0 group/stat ${idx !== 0 ? 'sm:pl-5 lg:pl-6' : ''}`}
              >
                {/* Nút icon nền xanh đậm đặc trưng 1:1 Reference với hiệu ứng hover */}
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0052cc] text-white flex items-center justify-center shrink-0 shadow-sm group-hover/stat:scale-108 transition-transform duration-300">
                  <Icon className={`w-5 h-5 text-white ${stat.fill ? 'fill-white' : ''} stroke-[2.2]`} />
                </div>
                <div className="leading-tight">
                  <div className="text-lg sm:text-xl font-black text-slate-950 tracking-tight">
                    {stat.val}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Chữ ký tay nghệ thuật bên góc phải: "Cùng bạn vươn xa hơn" */}
        <div 
          aria-hidden="true" 
          className="hidden xl:flex items-center justify-end pl-6 select-none shrink-0 pointer-events-none"
        >
          <div className="relative transform -rotate-3 text-right">
            <span 
              className="block text-[#60A5FA] font-serif italic text-lg tracking-wide font-light"
              style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Dancing Script", cursive' }}
            >
              Cùng bạn
            </span>
            <span 
              className="block text-[#60A5FA] font-serif italic text-base tracking-wide font-light -mt-1 pl-4"
              style={{ fontFamily: '"Brush Script MT", "Segoe Script", "Dancing Script", cursive' }}
            >
              vươn xa hơn
            </span>
          </div>
        </div>

      </div>

    </section>
  );
}



