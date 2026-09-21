'use client';
import React from 'react';
import { User, Phone, Mail, MapPin } from 'lucide-react';
export default function FormThongTinGiaoHang({ thongTin, onThayDoi }) {
    const capNhat = (truong, giaTri) => {
        onThayDoi({ ...thongTin, [truong]: giaTri });
    };
    return (<div className="glass-card rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-sky-500 dark:text-cyan-400"/>
        <span>1. THÔNG TIN NGƯỜI NHẬN HÀNG</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
        {/* Họ và Tên */}
        <div className="space-y-1 sm:col-span-2">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Họ và tên người nhận <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="text" required value={thongTin.ho_va_ten} onChange={(e) => capNhat('ho_va_ten', e.target.value)} placeholder="Nguyễn Văn A" className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          </div>
        </div>

        {/* Số Điện Thoại */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Số điện thoại nhận hàng <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="tel" required value={thongTin.so_dien_thoai} onChange={(e) => capNhat('so_dien_thoai', e.target.value)} placeholder="0912.345.678" className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Email nhận thông báo đơn hàng <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input type="email" required value={thongTin.email} onChange={(e) => capNhat('email', e.target.value)} placeholder="nguyenvana@gmail.com" className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
          </div>
        </div>

        {/* Tỉnh / Thành Phố */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Tỉnh / Thành phố <span className="text-red-500">*</span>
          </label>
          <input type="text" required value={thongTin.tinh_thanh} onChange={(e) => capNhat('tinh_thanh', e.target.value)} placeholder="TP. Hồ Chí Minh / Hà Nội / Đà Nẵng..." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        </div>

        {/* Quận / Huyện */}
        <div className="space-y-1">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Quận / Huyện <span className="text-red-500">*</span>
          </label>
          <input type="text" required value={thongTin.quan_huyen} onChange={(e) => capNhat('quan_huyen', e.target.value)} placeholder="Quận 10 / Bình Thạnh / Cầu Giấy..." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        </div>

        {/* Địa chỉ chi tiết */}
        <div className="space-y-1 sm:col-span-2">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Địa chỉ nhận hàng chi tiết (Số nhà, tên đường, tòa nhà) <span className="text-red-500">*</span>
          </label>
          <input type="text" required value={thongTin.dia_chi_chi_tiet} onChange={(e) => capNhat('dia_chi_chi_tiet', e.target.value)} placeholder="Số 29 Đường Tân Phước, Phường 8..." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        </div>

        {/* Ghi chú */}
        <div className="space-y-1 sm:col-span-2">
          <label className="font-semibold text-slate-700 dark:text-slate-300">
            Ghi chú giao hàng (Tùy chọn)
          </label>
          <textarea rows={2} value={thongTin.ghi_chu || ''} onChange={(e) => capNhat('ghi_chu', e.target.value)} placeholder="Ví dụ: Giao vào giờ hành chính, gọi trước khi đến 15 phút..." className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"/>
        </div>
      </div>
    </div>);
}
