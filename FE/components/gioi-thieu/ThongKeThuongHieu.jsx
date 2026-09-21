'use client';

import React, { useState, useEffect } from 'react';
import { SanPhamService } from '@/services/san-pham.service';
import { DanhMucService } from '@/services/danh-muc.service';

export default function BrandStats() {
  const [counts, setCounts] = useState({
    totalLaptops: 12,
    totalBrands: 8,
    totalCategories: 6
  });

  useEffect(() => {
    let daHuy = false;
    Promise.all([
      SanPhamService.layTatCaSanPhamAsync(),
      DanhMucService.layDanhSachThuongHieuAsync(),
      DanhMucService.layDanhSachNhuCauAsync()
    ]).then(([laptops, brands, categories]) => {
      if (!daHuy) {
        setCounts({
          totalLaptops: Array.isArray(laptops) && laptops.length > 0 ? laptops.length : 12,
          totalBrands: Array.isArray(brands) && brands.length > 0 ? brands.length : 8,
          totalCategories: Array.isArray(categories) && categories.length > 0 ? categories.length : 6
        });
      }
    }).catch(() => {});
    return () => { daHuy = true; };
  }, []);

  const stats = [
    {
      value: `${counts.totalLaptops}+`,
      label: 'MẪU MÁY',
      caption: 'Sẵn sàng phục vụ'
    },
    {
      value: `0${counts.totalBrands}`,
      label: 'TẬP ĐOÀN',
      caption: 'Đối tác chiến lược'
    },
    {
      value: `0${counts.totalCategories}`,
      label: 'PHÂN KHÚC',
      caption: 'Sản phẩm đa dạng'
    },
    {
      value: '99.8%',
      label: 'HÀI LÒNG',
      caption: 'Khách hàng chứng thực'
    }
  ];

  return (
    <section className="w-full rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-800">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`space-y-1 ${idx > 0 ? 'sm:pl-6 lg:pl-8 pt-4 sm:pt-0' : ''}`}
          >
            <div className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight text-[#071426] dark:text-white">
              {stat.value}
            </div>
            <div className="text-xs font-black uppercase tracking-wider text-[#0866FF] dark:text-cyan-400">
              {stat.label}
            </div>
            <p className="text-xs text-[#45556C] dark:text-slate-400 font-normal leading-relaxed">
              {stat.caption}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
