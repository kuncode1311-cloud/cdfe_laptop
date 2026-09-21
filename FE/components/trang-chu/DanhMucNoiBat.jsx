'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Gamepad2, ArrowUpRight } from 'lucide-react';
import { DanhMucService } from '@/services/danh-muc.service';

export default function DanhMucNoiBat() {
    const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);

    useEffect(() => {
        let daHuy = false;
        DanhMucService.layDanhSachNhuCauAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setDanhSachDanhMuc(data);
            }
        });
        return () => { daHuy = true; };
    }, []);

    // Nếu chưa tải xong hoặc danh mục rỗng, không làm vỡ layout
    const danhSachHienThi = danhSachDanhMuc.length > 0 ? danhSachDanhMuc : [
        { ma_danh_muc: 'gaming', ten_danh_muc: 'Laptop Gaming Cực Đỉnh', so_luong_san_pham: 12, hinh_anh: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&q=80' },
        { ma_danh_muc: 'ai-pc', ten_danh_muc: 'AI PC Siêu Trí Tuệ 2026', so_luong_san_pham: 8, hinh_anh: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=600&q=80' },
        { ma_danh_muc: 'do-hoa-sang-tao', ten_danh_muc: 'Đồ Họa & Sáng Tạo Studio', so_luong_san_pham: 10, hinh_anh: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=600&q=80' },
        { ma_danh_muc: 'van-phong-mong-nhe', ten_danh_muc: 'Mỏng Nhẹ & Sang Trọng', so_luong_san_pham: 14, hinh_anh: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' },
        { ma_danh_muc: 'doanh-nhan', ten_danh_muc: 'Laptop Doanh Nhân Cao Cấp', so_luong_san_pham: 9, hinh_anh: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80' },
        { ma_danh_muc: 'sinh-vien', ten_danh_muc: 'Học Tập & Sinh Viên Giá Tốt', so_luong_san_pham: 11, hinh_anh: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=600&q=80' }
    ];

    return (<section className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            DANH MỤC PHÂN KHÚC NỔI BẬT
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Chọn cỗ máy phù hợp nhất với nhu cầu làm việc và giải trí của bạn
          </p>
        </div>
        <Link href="/san-pham" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
          <span>Xem tất cả</span>
          <ArrowUpRight className="w-4 h-4"/>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {danhSachHienThi.map((dm) => (<Link key={dm.ma_danh_muc || dm.id} href={`/san-pham?danh_muc=${dm.ma_danh_muc}`} className="group relative rounded-2xl p-4 glass-card flex flex-col items-center text-center justify-between overflow-hidden hover:border-sky-500 dark:hover:border-cyan-400 transition-all duration-300">
            {/* Ảnh minh họa */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden my-2 group-hover:scale-110 transition-transform duration-300">
              {dm.hinh_anh ? (<Image src={dm.hinh_anh} alt={dm.ten_danh_muc} fill className="object-cover"/>) : (<div className="w-full h-full bg-sky-500/10 flex items-center justify-center text-sky-500">
                  <Gamepad2 className="w-8 h-8"/>
                </div>)}
            </div>

            {/* Tên danh mục */}
            <div className="space-y-1 mt-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-cyan-400 transition-colors line-clamp-1">
                {dm.ten_danh_muc}
              </h3>
              <p className="text-[10.5px] text-slate-400 font-medium">
                {dm.so_luong_san_pham}+ mẫu máy
              </p>
            </div>
          </Link>))}
      </div>
    </section>);
}
