'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Gamepad2, Cpu, Palette, Feather, GraduationCap, Phone, HardDrive, Keyboard } from 'lucide-react';
import { DanhMucService } from '@/services/danh-muc.service';
export default function MenuDiDong({ dangMo, onDong }) {
    const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([
        { ma_hang: 'asus', ten_hang: 'ASUS' },
        { ma_hang: 'lenovo', ten_hang: 'Lenovo' },
        { ma_hang: 'dell', ten_hang: 'Dell' },
        { ma_hang: 'apple', ten_hang: 'MacBook' },
        { ma_hang: 'msi', ten_hang: 'MSI' },
        { ma_hang: 'acer', ten_hang: 'Acer' },
        { ma_hang: 'hp', ten_hang: 'HP' }
    ]);

    useEffect(() => {
        let daHuy = false;
        DanhMucService.layDanhSachThuongHieuAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                const chuanHoa = data.map(item => ({
                    ma_hang: item.ma_danh_muc || item.ma_hang || item.slug,
                    ten_hang: (item.ten_danh_muc || item.ten_hang || '').split('/')[0].trim()
                }));
                setDanhSachThuongHieu(chuanHoa);
            }
        });
        return () => { daHuy = true; };
    }, []);
    if (!dangMo)
        return null;
    return (<div className="fixed inset-0 z-[999] lg:hidden flex">
      {/* Lớp phủ Backdrop */}
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onDong}/>

      {/* Nội dung Drawer Menu */}
      <div className="relative w-4/5 max-w-sm bg-white dark:bg-slate-900 h-full p-5 overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">
              TNTP <span className="text-[#0052cc] dark:text-cyan-400">LAPTOP</span>
            </span>
            <button onClick={onDong} className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Nhóm Nhu Cầu */}
          <div className="py-4 space-y-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Danh Mục Nhu Cầu
            </div>
            <Link href="/san-pham?danh_muc=gaming" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Gamepad2 className="w-4 h-4 text-purple-500"/>
              <span>Laptop Gaming RTX</span>
            </Link>
            <Link href="/san-pham?danh_muc=ai-pc" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Cpu className="w-4 h-4 text-cyan-500"/>
              <span>AI PC 2026</span>
            </Link>
            <Link href="/san-pham?danh_muc=do-hoa-sang-tao" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Palette className="w-4 h-4 text-rose-500"/>
              <span>Đồ Họa & Sáng Tạo</span>
            </Link>
            <Link href="/san-pham?danh_muc=van-phong-mong-nhe" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Feather className="w-4 h-4 text-emerald-500"/>
              <span>Mỏng Nhẹ Cao Cấp</span>
            </Link>
            <Link href="/san-pham?danh_muc=linh-kien" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <HardDrive className="w-4 h-4 text-blue-500"/>
              <span>Linh Kiện (SSD / RAM)</span>
            </Link>
            <Link href="/san-pham?danh_muc=phu-kien-gear" onClick={onDong} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-800 dark:text-slate-200">
              <Keyboard className="w-4 h-4 text-indigo-500"/>
              <span>Phụ Kiện & Gaming Gear</span>
            </Link>
          </div>

          {/* Nhóm Hãng Laptop */}
          <div className="py-3 border-t border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2">
              Thương Hiệu Hàng Đầu
            </div>
            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {danhSachThuongHieu.map((th) => (<Link key={th.ma_hang} href={`/san-pham?hang=${th.ma_hang}`} onClick={onDong} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs font-semibold text-slate-700 dark:text-slate-200 text-center hover:bg-sky-50 dark:hover:bg-slate-800">
                  {th.ten_hang}
                </Link>))}
            </div>
          </div>
        </div>

        {/* Footer Drawer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-xs">
          <a href="tel:0948377979" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-red-500 text-white font-bold">
            <Phone className="w-4 h-4"/>
            <span>Gọi Hotline: 0948.37.79.79</span>
          </a>
        </div>
      </div>
    </div>);
}
