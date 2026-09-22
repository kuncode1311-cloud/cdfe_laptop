import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, MapPin, DollarSign, Clock, ArrowRight } from 'lucide-react';
export default function TrangTuyenDung() {
    const danhSachViTri = [
        {
            id: 'td-1',
            viTri: 'Chuyên Viên Tư Vấn Bán Hàng Laptop Gaming & Cao Cấp',
            diaDiem: 'Showroom Quận 10 & Tân Phú - ITC, TP.HCM',
            mucLuong: '12 - 25 Triệu (Lương cứng + Thưởng doanh số)',
            hinhThuc: 'Toàn thời gian (Xoay ca)',
            soLuong: '03 người'
        },
        {
            id: 'td-2',
            viTri: 'Kỹ Thuật Viên Phần Cứng & Cài Đặt Laptop Chuyên Nghiệp',
            diaDiem: 'Showroom Cầu Giấy, Hà Nội & Q.10 TP.HCM',
            mucLuong: '14 - 22 Triệu + Phụ cấp kỹ thuật',
            hinhThuc: 'Toàn thời gian',
            soLuong: '02 người'
        },
        {
            id: 'td-3',
            viTri: 'Chuyên Viên Sáng Tạo Nội Dung & Review Công Nghệ (Content / Video)',
            diaDiem: 'Văn phòng trụ sở TP.HCM',
            mucLuong: '15 - 28 Triệu',
            hinhThuc: 'Toàn thời gian',
            soLuong: '02 người'
        }
    ];
    return (<div className="space-y-10">
      {/* 1. Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5"/>
        <span className="font-semibold text-slate-900 dark:text-white">Cơ Hội Nghề Nghiệp // Tuyển Dụng</span>
      </nav>

      {/* 2. Tiêu đề */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          GIA NHẬP ĐỘI NGŨ CHUYÊN GIA LAPTOPNEW
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Môi trường làm việc năng động, tiếp xúc với những công nghệ máy tính tối tân nhất cùng chế độ đãi ngộ vượt trội
        </p>
      </div>

      {/* 3. Danh Sách Vị Trí Tuyển Dụng */}
      <div className="space-y-4">
        {danhSachViTri.map((vt) => (<div key={vt.id} className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 hover:border-blue-500 transition-all shadow-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-400 text-[10.5px] font-black uppercase">
                  Tuyển Dụng Mới
                </span>
                <span className="text-xs text-slate-400">Số lượng: {vt.soLuong}</span>
              </div>

              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {vt.viTri}
              </h2>

              <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500"/>
                  <span>{vt.diaDiem}</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <DollarSign className="w-3.5 h-3.5"/>
                  <span>{vt.mucLuong}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-purple-500"/>
                  <span>{vt.hinhThuc}</span>
                </div>
              </div>
            </div>

            <Link href="/lien-he" className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0">
              <span>Ứng Tuyển Ngay</span>
              <ArrowRight className="w-4 h-4"/>
            </Link>
          </div>))}
      </div>
    </div>);
}
