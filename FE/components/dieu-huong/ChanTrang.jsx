'use client';
import React from 'react';
import Link from 'next/link';
import { Phone, MapPin, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
export default function ChanTrang() {
    return (
        <footer className="w-full mt-10 sm:mt-12 transition-colors">
            {/* Thân Footer Cao Cấp Tone Xanh Đen Tương Phản Cao (High Contrast Navy) */}
            <div className="w-full bg-[#081126] text-slate-300 pt-12 pb-10 border-t border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Cột 1: Thông tin Doanh Nghiệp & Showroom (5 Cột) */}
            <div className="lg:col-span-5 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <div className="w-10 h-9 rounded-xl bg-[#0052cc] text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/30 text-xs tracking-tighter px-1">
                  TNTP
                </div>
                <span className="font-black text-xl text-white tracking-tight uppercase">
                  TNTP <span className="text-cyan-400">LAPTOP</span>
                </span>
              </Link>

              <div className="text-xs text-slate-400 leading-relaxed space-y-1">
                <p className="font-bold text-slate-200">CÔNG TY CỔ PHẦN CÔNG NGHỆ TNTP LAPTOP</p>
                <p>Hệ thống bán lẻ & phân phối Laptop Gaming, AI PC, Đồ họa cao cấp thành lập bởi 4 nhà sáng lập: Lê Minh Trí, Âu Lê Thành Tài, Mai Thống Nhất, Lâm Đường Phú.</p>
              </div>

              {/* Danh sách 3 Showroom lớn */}
              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/>
                  <div>
                    <strong className="text-white">Showroom 1:</strong> 29 Tân Phước, P.8, Quận 10, TP.HCM
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/>
                  <div>
                    <strong className="text-white">Showroom 2:</strong> 399 Bạch Đằng, P.14, Q.Bình Thạnh, TP.HCM
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5"/>
                  <div>
                    <strong className="text-white">Showroom 3:</strong> 120 Trần Thái Tông, Cầu Giấy, Hà Nội
                  </div>
                </div>
                <div className="flex items-center gap-2.5 pt-1 text-slate-400">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0"/>
                  <span>Giờ mở cửa: <strong className="text-white">8:30 - 21:30</strong> (Tất cả các ngày trong tuần)</span>
                </div>
              </div>
            </div>

            {/* Cột 2: Hỗ Trợ Khách Hàng (2 Cột) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h3 className="font-black text-white uppercase tracking-wider text-xs border-l-2 border-[#0052cc] pl-2.5">
                HỖ TRỢ KHÁCH HÀNG
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/chinh-sach" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Hướng dẫn mua hàng</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach#tra-gop" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Trả góp 0% lãi suất</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach#doi-tra" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Chính sách 1 đổi 1</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach#van-chuyen" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Vận chuyển & giao 2H</span>
                  </Link>
                </li>
                <li>
                  <Link href="/bao-hanh" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Tra cứu bảo hành</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 3: Về TNT LAPTOP (2 Cột) */}
            <div className="lg:col-span-2 space-y-3.5">
              <h3 className="font-black text-white uppercase tracking-wider text-xs border-l-2 border-[#0052cc] pl-2.5">
                VỀ TNTP LAPTOP
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-400">
                <li>
                  <Link href="/gioi-thieu" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Hội Đồng Sáng Lập</span>
                  </Link>
                </li>
                <li>
                  <Link href="/tuyen-dung" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Tuyển dụng nhân tài</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Chính sách bảo mật</span>
                  </Link>
                </li>
                <li>
                  <Link href="/chinh-sach" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Quy chế hoạt động</span>
                  </Link>
                </li>
                <li>
                  <Link href="/lien-he" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                    <ChevronRight className="w-3 h-3 text-slate-600"/>
                    <span>Hệ thống Showroom</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Cột 4: Tổng Đài & Phương Thức Thanh Toán (3 Cột) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="font-black text-white uppercase tracking-wider text-xs border-l-2 border-[#0052cc] pl-2.5">
                TỔNG ĐÀI HỖ TRỢ
              </h3>

              <div className="space-y-2 text-xs">
                {/* Hộp Hotline 1 */}
                <div className="p-3 rounded-2xl bg-[#0e1b38] border border-slate-700/80 space-y-0.5">
                  <div className="text-slate-400 text-[11px]">Tư vấn mua hàng (8:30 - 21:30):</div>
                  <a href="tel:19008946" className="text-base font-black text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-cyan-400"/>
                    <span>1900.8946</span>
                    <span className="text-[10px] font-normal text-slate-400">(1.000đ/p)</span>
                  </a>
                </div>

                {/* Hộp Hotline 2 */}
                <div className="p-3 rounded-2xl bg-[#0e1b38] border border-slate-700/80 space-y-0.5">
                  <div className="text-slate-400 text-[11px]">Kỹ thuật & Bảo hành:</div>
                  <a href="tel:0948377979" className="text-base font-black text-white hover:text-cyan-400 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-rose-400"/>
                    <span>0948.37.79.79</span>
                  </a>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="space-y-1.5 pt-1">
                <div className="font-bold text-slate-300 text-[11px]">Phương thức thanh toán:</div>
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#0e1b38] font-bold text-slate-300 border border-slate-700">
                    VietQR 24/7
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#0e1b38] font-bold text-slate-300 border border-slate-700">
                    VNPAY-QR
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#0e1b38] font-bold text-slate-300 border border-slate-700">
                    Visa / Master
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#0e1b38] font-bold text-slate-300 border border-slate-700">
                    Trả góp 0%
                  </span>
                </div>
              </div>

              {/* Chứng nhận Bộ Công Thương */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700/60 text-emerald-400 text-[11px] font-bold shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400"/>
                  <span>Đã thông báo Bộ Công Thương</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Dải Bản Quyền Đáy (Deepest Black Navy Bar) */}
      <div className="border-t border-slate-800/80 bg-[#050b18] py-4 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © 2026 <strong className="text-white">TNTP LAPTOP</strong> - Hệ Thống Bán Lẻ Laptop Gaming & AI PC Hàng Đầu.
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link href="/chinh-sach" className="hover:text-white transition-colors">
              Điều khoản sử dụng
            </Link>
            <span>•</span>
            <Link href="/chinh-sach" className="hover:text-white transition-colors">
              Chính sách bảo mật
            </Link>
            <span>•</span>
            <Link href="/lien-he" className="hover:text-white transition-colors">
              Liên hệ hợp tác
            </Link>
          </div>
        </div>
      </div>
    </footer>);
}
