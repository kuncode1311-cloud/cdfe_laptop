'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Home, ChevronRight, MapPin, Phone, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
export default function TrangLienHe() {
    const [hoTen, setHoTen] = useState('');
    const [sdt, setSdt] = useState('');
    const [email, setEmail] = useState('');
    const [noiDung, setNoiDung] = useState('');
    const [daGui, setDaGui] = useState(false);
    const xuLyGui = (e) => {
        e.preventDefault();
        if (!hoTen.trim() || !sdt.trim() || !noiDung.trim()) {
            toast.error('Vui lòng điền các trường bắt buộc!');
            return;
        }
        setDaGui(true);
        toast.success('Cảm ơn bạn đã liên hệ! Chuyên viên LaptopNew sẽ gọi lại trong 10 phút.');
        setHoTen('');
        setSdt('');
        setEmail('');
        setNoiDung('');
    };
    return (<div className="space-y-10">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Liên Hệ & Showroom</span>
      </nav>

      {/* 2. Tiêu đề */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          LIÊN HỆ VỚI HỆ THỐNG LAPTOPNEW
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Chúng tôi luôn sẵn sàng hỗ trợ tư vấn cấu hình, giải đáp thắc mắc và tiếp nhận yêu cầu bảo hành của quý khách 24/7
        </p>
      </div>

      {/* 3. Bố Cục Showroom & Form Gửi Phản Hồi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột Trái (7 Cột): Danh Sách Chi Nhánh Showroom */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white">
            HỆ THỐNG CHI NHÁNH SHOWROOM
          </h2>

          <div className="space-y-3.5 text-xs">
            {/* Showroom 1 */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-black text-sm text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                <span>SHOWROOM QUẬN 10 (TRỤ SỞ CHÍNH)</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Địa chỉ: Số 29 Tân Phước, Phường 8, Quận 10, TP. Hồ Chí Minh
              </p>
              <div className="flex flex-wrap gap-4 text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500"/>
                  <span>08h00 - 21h30 (Tất cả các ngày)</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-red-500">
                  <Phone className="w-3.5 h-3.5"/>
                  <span>0948.37.79.79</span>
                </span>
              </div>
            </div>

            {/* Showroom 2 */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-black text-sm text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                <span>SHOWROOM BÌNH THẠNH, TP.HCM</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Địa chỉ: Số 399 Bạch Đằng, Phường 14, Quận Bình Thạnh, TP. Hồ Chí Minh
              </p>
              <div className="flex flex-wrap gap-4 text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500"/>
                  <span>08h00 - 21h30</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-red-500">
                  <Phone className="w-3.5 h-3.5"/>
                  <span>0922.37.79.79</span>
                </span>
              </div>
            </div>

            {/* Showroom 3 */}
            <div className="glass-card rounded-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="font-black text-sm text-blue-600 dark:text-cyan-400 flex items-center gap-2">
                <MapPin className="w-4 h-4"/>
                <span>SHOWROOM CẦU GIẤY, HÀ NỘI</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Địa chỉ: Số 120 Trần Thái Tông, Dịch Vọng Hậu, Cầu Giấy, Hà Nội
              </p>
              <div className="flex flex-wrap gap-4 text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-500"/>
                  <span>08h30 - 21h00</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-red-500">
                  <Phone className="w-3.5 h-3.5"/>
                  <span>0911.37.79.79</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải (5 Cột): Form Gửi Tin Nhắn / Yêu Cầu Tư Vấn */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-cyan-400"/>
              <span>GỬI YÊU CẦU TƯ VẤN NHANH</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Điền thông tin của bạn để nhận báo giá ưu đãi và quà tặng tốt nhất
            </p>
          </div>

          <form onSubmit={xuLyGui} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Họ và tên của bạn <span className="text-red-500">*</span>
              </label>
              <input type="text" required value={hoTen} onChange={(e) => setHoTen(e.target.value)} placeholder="Nguyễn Văn A" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Số điện thoại liên hệ <span className="text-red-500">*</span>
              </label>
              <input type="tel" required value={sdt} onChange={(e) => setSdt(e.target.value)} placeholder="0912.345.678" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Email nhận báo giá
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nguyenvana@gmail.com" className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Nội dung yêu cầu / Dòng laptop quan tâm <span className="text-red-500">*</span>
              </label>
              <textarea rows={3} required value={noiDung} onChange={(e) => setNoiDung(e.target.value)} placeholder="Ví dụ: Tôi cần tư vấn laptop gaming tầm giá 30 triệu để chơi game và làm đồ họa..." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <button type="submit" className="w-full py-3 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer transition-colors">
              <Send className="w-3.5 h-3.5"/>
              <span>GỬI YÊU CẦU NGAY</span>
            </button>
          </form>
        </div>
      </div>
    </div>);
}
