'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy } from 'lucide-react';
import { SanPhamService } from '@/services/san-pham.service';
import TheSanPham from '@/components/san-pham/TheSanPham';
export default function SectionSanPhamBanChay() {
    const [tabHienTai, setTabHienTai] = useState('tat_ca');
    const [tatCaSanPham, setTatCaSanPham] = useState(() => SanPhamService.layTatCaSanPham() || []);
    const [dangTai, setDangTai] = useState(tatCaSanPham.length === 0);

    // Đồng bộ danh sách sản phẩm từ MongoDB Atlas theo thời gian thực
    useEffect(() => {
        let daHuy = false;
        SanPhamService.layTatCaSanPhamAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setTatCaSanPham(data);
            }
            if (!daHuy) setDangTai(false);
        }).catch(() => {
            if (!daHuy) setDangTai(false);
        });
        return () => { daHuy = true; };
    }, []);
    // Lọc sản phẩm bán chạy theo tab và sắp xếp theo lượt bán thực tế từ MongoDB
    const danhSachLoc = tatCaSanPham
        .filter((sp) => {
            if (tabHienTai === 'tat_ca')
                return sp.la_ban_chay;
            if (tabHienTai === 'gaming')
                return sp.danh_muc && sp.danh_muc.includes('gaming');
            if (tabHienTai === 'ai_pc')
                return sp.danh_muc && (sp.danh_muc.includes('ai-pc') || sp.danh_muc.includes('do-hoa-sang-tao'));
            if (tabHienTai === 'mong_nhe')
                return sp.danh_muc && (sp.danh_muc.includes('van-phong-mong-nhe') || sp.danh_muc.includes('doanh-nhan'));
            if (tabHienTai === 'linh_kien')
                return sp.danh_muc && (sp.danh_muc.includes('linh-kien') || sp.danh_muc.includes('phu-kien-gear'));
            return true;
        })
        .sort((a, b) => (b.so_luong_da_ban || 0) - (a.so_luong_da_ban || 0))
        .slice(0, 4);
    return (<section className="space-y-6">
      {/* 1. Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              <Trophy className="w-5 h-5 text-amber-500"/>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              TOP SẢN PHẨM BÁN CHẠY NHẤT
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Được hàng nghìn khách hàng tin chọn nhiều nhất trong tháng qua tại LaptopNew
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button onClick={() => setTabHienTai('tat_ca')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${tabHienTai === 'tat_ca'
            ? 'bg-[#0052cc] text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            🔥 Tất Cả Bán Chạy
          </button>
          <button onClick={() => setTabHienTai('gaming')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${tabHienTai === 'gaming'
            ? 'bg-[#0052cc] text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            🎮 Laptop Gaming
          </button>
          <button onClick={() => setTabHienTai('ai_pc')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${tabHienTai === 'ai_pc'
            ? 'bg-[#0052cc] text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            ⚡ AI PC & Đồ Họa
          </button>
          <button onClick={() => setTabHienTai('mong_nhe')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${tabHienTai === 'mong_nhe'
            ? 'bg-[#0052cc] text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            💻 Mỏng Nhẹ Cao Cấp
          </button>
          <button onClick={() => setTabHienTai('linh_kien')} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${tabHienTai === 'linh_kien'
            ? 'bg-[#0052cc] text-white shadow-md'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            ⚙️ Linh Kiện & Gear
          </button>
        </div>
      </div>

      {/* 2. Lưới Sản Phẩm Bán Chạy */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {dangTai ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3 h-[410px]">
              <div className="w-full h-48 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mt-4"></div>
            </div>
          ))
        ) : danhSachLoc.length > 0 ? (
          danhSachLoc.map((sp) => (<TheSanPham key={sp.id || sp._id} sanPham={sp} cheDoHienThi="luoi"/>))
        ) : null}
      </div>

      {/* 3. Nút Xem Thêm */}
      <div className="text-center pt-2">
        <Link href="/san-pham" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-xs hover:border-[#0052cc] hover:text-[#0052cc] transition-colors shadow-sm">
          <span>Xem thêm toàn bộ sản phẩm bán chạy</span>
          <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>
    </section>);
}
