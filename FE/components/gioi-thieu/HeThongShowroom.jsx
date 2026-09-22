'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  MapPin, 
  Clock, 
  Phone, 
  Navigation, 
  CheckCircle2, 
  Building2, 
  ExternalLink, 
  Sparkles,
  Award
} from 'lucide-react';

const SHOWROOMS = [
  {
    id: 'hcm-q10',
    tenNgan: 'Quận 10, TP.HCM',
    tag: 'Flagship Store',
    subTag: 'Trung tâm trải nghiệm lớn nhất',
    tenDayDu: 'Trung Tâm Trải Nghiệm Flagship Quận 10',
    hinhAnh: '/images/about/showroom-q10.jpg',
    diaChi: 'Số 29 Tân Phước, Phường 8, Quận 10, TP. Hồ Chí Minh',
    chiTietViTri: 'Gần ngã tư Nguyễn Tri Phương & Tân Phước, trung tâm Quận 10',
    gioMoCua: '08:30 - 21:30',
    ghiChuGio: 'Mở cửa cả tuần (kể cả Thứ 7, Chủ Nhật & Ngày Lễ)',
    hotline: '1900.8946 (Phím 1)',
    hotlineDiDong: '0948.37.79.79',
    telUrl: '19008946',
    dacDiem: [
      { tieuDe: 'Test máy & Benchmark', moTa: 'Chạy Cinebench & FurMark thực tế' },
      { tieuDe: 'Kỹ thuật Spa 15 phút', moTa: 'Vệ sinh & nâng cấp RAM/SSD lấy liền' },
      { tieuDe: 'AI PC & Gaming Hub', moTa: 'Trải nghiệm NPU TOPS & RTX 40 Series' },
      { tieuDe: 'Bãi đỗ xe an ninh', moTa: 'Có chỗ đỗ ô tô & xe máy rộng rãi miễn phí' }
    ],
    banDoUrl: 'https://maps.google.com/?q=29+Tan+Phuoc+Phuong+8+Quan+10+TPHCM'
  },
  {
    id: 'hcm-tan-phu',
    tenNgan: 'Tân Phú - ITC, TP.HCM',
    tag: 'ITC Campus & Creator Lab',
    subTag: 'Cơ sở trải nghiệm công nghệ sinh viên ITC',
    tenDayDu: 'Showroom TNTP LAPTOP Tân Phú - ITC',
    hinhAnh: '/images/about/showroom-binh-thanh.jpg',
    diaChi: 'Số 12 Trịnh Đình Thảo, Phường Hòa Thạnh, Quận Tân Phú, TP. Hồ Chí Minh',
    chiTietViTri: 'Khuôn viên Trường Cao Đẳng Công Nghệ Thông Tin TP.HCM (ITC)',
    gioMoCua: '08:00 - 21:30',
    ghiChuGio: 'Mở cửa tất cả các ngày trong tuần',
    hotline: '1900.8946 (Phím 2)',
    hotlineDiDong: '0922.37.79.79',
    telUrl: '19008946',
    dacDiem: [
      { tieuDe: 'Ưu đãi đặc quyền sinh viên ITC', moTa: 'Tặng balo chống sốc xịn, giảm thêm 500k khi xuất trình thẻ SV' },
      { tieuDe: 'Studio Coder & AI Laptop', moTa: 'Trưng bày chuyên sâu dòng máy lập trình, đồ họa chuẩn màu' },
      { tieuDe: 'Trả góp 0% duyệt 5p', moTa: 'Chỉ cần CCCD, thủ tục nhanh cho sinh viên & phụ huynh' },
      { tieuDe: 'Vệ sinh & Nâng cấp 0đ', moTa: 'Spa bảo dưỡng máy & thay keo tản nhiệt miễn phí tại trường' }
    ],
    banDoUrl: 'https://maps.google.com/?q=10.775093,106.634544'
  },
  {
    id: 'hn-cau-giay',
    tenNgan: 'Cầu Giấy, Hà Nội',
    tag: 'R&D & Tech Lab',
    subTag: 'Trung tâm công nghệ & kiểm chuẩn',
    tenDayDu: 'Trung Tâm Công Nghệ & Showroom Cầu Giấy',
    hinhAnh: '/images/about/showroom-cau-giay.jpg',
    diaChi: 'Số 120 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội',
    chiTietViTri: 'Khu công nghệ Duy Tân & đối diện chuỗi các trường ĐH lớn',
    gioMoCua: '08:30 - 21:00',
    ghiChuGio: 'Mở cửa tất cả các ngày trong tuần',
    hotline: '0911.37.79.79',
    hotlineDiDong: '0948.37.79.79',
    telUrl: '0911377979',
    dacDiem: [
      { tieuDe: 'Phòng Lab R&D phần cứng', moTa: 'Trang thiết bị kiểm chuẩn bo mạch 5 bước' },
      { tieuDe: 'Máy trạm 3D & AI PC', moTa: 'Trải nghiệm cỗ máy dựng phim khủng nhất' },
      { tieuDe: 'Tiếp nhận 1 đổi 1 30 ngày', moTa: 'Bảo hành siêu tốc & spa máy định kỳ 0đ' },
      { tieuDe: 'Hỗ trợ kỹ thuật Onsite', moTa: 'Chuyên viên kỹ thuật phục vụ doanh nghiệp' }
    ],
    banDoUrl: 'https://maps.google.com/?q=120+Tran+Thai+Tong+Cau+Giay+Ha+Noi'
  }
];

export default function HeThongShowroom() {
  const [selectedId, setSelectedId] = useState('hcm-q10');
  const current = SHOWROOMS.find((s) => s.id === selectedId) || SHOWROOMS[0];

  return (
    <section className="w-full pt-6 sm:pt-8 pb-0 space-y-6 sm:space-y-8">
      
      {/* =========================================================================
          1. HEADER TIÊU ĐỀ RÕ RÀNG, ĐẸP MẮT (KHÔNG BỊ TRÀN CHỮ / GÃY HÀNG)
          ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0052cc] text-xs font-black uppercase tracking-wider shadow-2xs">
            <Building2 className="w-3.5 h-3.5 text-[#0052cc]" />
            <span>HỆ THỐNG TRẢI NGHIỆM THỰC TẾ // TNTP LAPTOP</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-black tracking-tight uppercase text-slate-950 leading-[1.15]">
            SHOWROOM FLAGSHIP TẠI <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052cc] via-blue-600 to-cyan-600">TP.HCM &amp; HÀ NỘI</span>
          </h2>
        </div>
        <p className="text-xs sm:text-[13.5px] text-slate-600 max-w-md leading-relaxed font-medium">
          Mời bạn đến trực tiếp các showroom TNTP LAPTOP để tự tay rạch seal, trải nghiệm thực tế màn hình và nhận tư vấn cấu hình chuyên sâu.
        </p>
      </div>

      {/* =========================================================================
          2. BỘ CHỌN 3 ĐỊA ĐIỂM (TABS TƯƠNG TÁC CAO CẤP, RÕ RÀNG TỪNG PHẦN)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
        {SHOWROOMS.map((s, idx) => {
          const isSelected = selectedId === s.id;
          return (
            <button
              key={s.id}
              onClick={() => setSelectedId(s.id)}
              className={`relative p-4 sm:p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-br from-blue-50/90 via-white to-sky-50/60 border-[#0052cc] shadow-[0_10px_25px_-5px_rgba(0,82,204,0.18)] ring-2 ring-[#0052cc]/20 -translate-y-0.5'
                  : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50/70 shadow-2xs'
              }`}
            >
              {/* Dải vạch xanh trên đỉnh khi thẻ được chọn */}
              <div className={`absolute top-0 inset-x-0 h-1 transition-all duration-300 ${
                isSelected ? 'bg-gradient-to-r from-[#0052cc] to-cyan-500 opacity-100' : 'opacity-0'
              }`} />

              <div className="flex items-center justify-between w-full pb-3 border-b border-slate-100">
                <span className={`text-[10px] sm:text-[10.5px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider transition-colors ${
                  isSelected 
                    ? 'bg-[#0052cc] text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-700 group-hover:bg-blue-50 group-hover:text-[#0052cc]'
                }`}>
                  {s.tag}
                </span>

                <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Đang mở cửa</span>
                </span>
              </div>

              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <div className={`font-black text-base sm:text-lg tracking-tight transition-colors ${
                    isSelected ? 'text-[#0052cc]' : 'text-slate-900 group-hover:text-[#0052cc]'
                  }`}>
                    {s.tenNgan}
                  </div>
                  <span className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-blue-100 text-[#0052cc]' : 'bg-slate-100 text-slate-400'
                  }`}>
                    0{idx + 1}
                  </span>
                </div>

                <div className="text-xs font-semibold text-[#0052cc] mt-0.5">
                  {s.subTag}
                </div>

                <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
                  {s.diaChi}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          3. MAIN SHOWROOM SHOWCASE CARD (ẢNH THỰC TẾ CHUẨN TNTP + NỘI DUNG DỄ NHÌN)
          ========================================================================= */}
      <div className="rounded-3xl bg-white border border-[#D5E6F7] overflow-hidden shadow-[0_12px_40px_-8px_rgba(0,82,204,0.1)] grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Dải Gradient Accent Bar trên nóc card */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0052cc] via-cyan-500 to-blue-600 z-30" />
        
        {/* CỘT TRÁI: ẢNH SHOWROOM THỰC TẾ TNTP SẮC NÉT, RỰC RỠ, ĐẲNG CẤP */}
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[400px] lg:min-h-[480px] bg-slate-900 group overflow-hidden">
          <Image
            src={current.hinhAnh}
            alt={current.tenDayDu}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />
          
          {/* Lớp gradient dịu mắt làm nổi bật chữ */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-black/25 pointer-events-none" />
          
          {/* Badge Mở Cửa góc trên trái */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-emerald-700 shadow-md border border-white/80">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MỞ CỬA // {current.gioMoCua}</span>
          </div>

          {/* Badge Tag Showroom góc trên phải */}
          <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{current.tag}</span>
          </div>

          {/* Box thông tin vị trí góc dưới ảnh với hiệu ứng kính mờ */}
          <div className="absolute bottom-4 left-4 right-4 z-20 p-4 sm:p-5 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/20 text-white shadow-xl space-y-1.5">
            <div className="text-lg sm:text-2xl font-black text-white leading-tight tracking-tight drop-shadow-sm">
              {current.tenDayDu}
            </div>
            <p className="text-xs sm:text-[13px] text-slate-200 font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{current.chiTietViTri}</span>
            </p>
          </div>
        </div>

        {/* CỘT PHẢI: CHI TIẾT THÔNG TIN SHOWROOM & HÀNH ĐỘNG DỄ NHÌN */}
        <div className="lg:col-span-5 p-5 sm:p-7 lg:p-8 flex flex-col justify-between space-y-6 bg-gradient-to-b from-white to-slate-50/50">
          
          <div className="space-y-5">
            
            {/* 1. KHỐI THÔNG TIN ĐỊA CHỈ & LIÊN HỆ RÕ RÀNG */}
            <div className="space-y-3.5 pb-4 border-b border-slate-100">
              
              {/* Địa chỉ trải nghiệm */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-blue-50/60 border border-blue-100/80">
                <div className="p-2 rounded-lg bg-[#0052cc] text-white shrink-0 shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10.5px] font-extrabold text-[#0052cc] uppercase tracking-wider block">
                    ĐỊA CHỈ TRẢI NGHIỆM:
                  </span>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13.5px] mt-0.5 leading-snug">
                    {current.diaChi}
                  </div>
                </div>
              </div>

              {/* Giờ phục vụ */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <div className="p-2 rounded-lg bg-cyan-600 text-white shrink-0 shadow-2xs">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10.5px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    GIỜ PHỤC VỤ KHÁCH HÀNG:
                  </span>
                  <div className="font-bold text-slate-900 text-xs sm:text-[13px] mt-0.5">
                    {current.gioMoCua}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {current.ghiChuGio}
                  </div>
                </div>
              </div>

              {/* Hotline chi nhánh */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 shadow-2xs">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10.5px] font-extrabold text-rose-600 uppercase tracking-wider block">
                    HOTLINE HỖ TRỢ CHI NHÁNH:
                  </span>
                  <div className="font-black text-rose-600 text-sm sm:text-base mt-0.5 tracking-tight">
                    {current.hotline} — {current.hotlineDiDong}
                  </div>
                </div>
              </div>

            </div>

            {/* 2. KHỐI TIỆN ÍCH SẴN CÓ TẠI SHOWROOM (DỄ NHÌN, NỔI BẬT) */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider block flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#0052cc]" />
                <span>DỊCH VỤ SẴN CÓ TẠI SHOWROOM:</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {current.dacDiem.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-2.5 rounded-xl bg-white border border-slate-200/90 hover:border-blue-300 transition-colors shadow-2xs"
                  >
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {item.tieuDe}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 pl-5 leading-tight">
                      {item.moTa}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* 3. NÚT HÀNH ĐỘNG RÕ RÀNG, DỄ BẤM */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={`tel:${current.telUrl}`}
              className="flex-1 py-3.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-extrabold text-xs uppercase tracking-wider text-center shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Phone className="w-4 h-4" />
              <span>Gọi Trực Tiếp</span>
            </a>
            
            <a
              href={current.banDoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-3.5 px-4 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-[#0052cc] text-slate-800 font-extrabold text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Navigation className="w-4 h-4 text-[#0052cc]" />
              <span>Chỉ Đường</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>

        </div>

      </div>

    </section>
  );
}


