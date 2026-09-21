'use client';
import React from 'react';
import Link from 'next/link';
const BRAND_MARQUEE_LIST = [
    {
        id: 'asus',
        name: 'ASUS ROG',
        sub: 'Republic of Gamers',
        accent: 'hover:text-red-500 hover:border-red-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-red-600">
        <path d="M12 25 L88 20 C92 20 95 24 93 28 L72 65 C68 72 58 75 50 72 L18 60 C12 58 10 52 14 48 L48 38 L16 35 C12 34 10 28 12 25 Z M52 46 L78 36 L64 58 C62 61 58 62 55 60 L42 54 L52 46 Z"/>
      </svg>)
    },
    {
        id: 'lenovo',
        name: 'Lenovo Legion',
        sub: 'Top 1 AI PC',
        accent: 'hover:text-sky-500 hover:border-sky-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-sky-500">
        <path d="M50 12 L59 40 L88 34 L66 57 L79 86 L50 68 L21 86 L34 57 L12 34 L41 40 Z"/>
      </svg>)
    },
    {
        id: 'dell',
        name: 'Dell Alienware',
        sub: 'High-End Gaming',
        accent: 'hover:text-cyan-500 hover:border-cyan-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-cyan-500">
        <path d="M50 10 C32 10 18 26 18 48 C18 70 32 88 50 88 C68 88 82 70 82 48 C82 26 68 10 50 10 Z M35 52 C31.5 52 28 47 28 41 C28 35 31.5 30 35 30 C38.5 30 42 35 42 41 C42 47 38.5 52 35 52 Z M65 52 C61.5 52 58 47 58 41 C58 35 61.5 30 65 30 C68.5 30 72 35 72 41 C72 47 68.5 52 65 52 Z M50 76 C44 76 40 74 40 72 C40 70 44 68 50 68 C56 68 60 70 60 72 C60 74 56 76 50 76 Z"/>
      </svg>)
    },
    {
        id: 'apple',
        name: 'Apple MacBook',
        sub: 'Apple Authorized',
        accent: 'hover:text-slate-900 dark:hover:text-white hover:border-slate-400',
        logo: (<svg viewBox="0 0 170 170" fill="currentColor" className="w-6 h-6 text-slate-800 dark:text-white">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.7-14.44-6.41-10.22-11.45-21.84-15.12-34.87-3.67-13.03-5.51-25.29-5.51-36.78 0-14.57 3.58-26.68 10.74-36.33 7.16-9.65 16.32-14.65 27.48-15 4.35 0 9.4 1.16 15.15 3.48 5.75 2.32 9.53 3.53 11.35 3.63 1.41-.1 5.37-1.36 11.87-3.78 6.5-2.42 11.83-3.53 15.98-3.33 13.92.74 24.89 5.86 32.9 15.35-12.18 7.37-18.17 17.55-17.97 30.54.2 10.42 4.14 19.14 11.82 26.16 7.68 7.02 16.64 11.08 26.88 12.18-2.61 7.74-5.69 15.54-9.23 23.39zM119.22 33.15c0-7.39 2.65-14.34 7.95-20.85 5.3-6.51 11.88-10.84 19.74-12 1.09 7.72-1.31 14.85-7.21 21.39-5.9 6.54-12.73 10.37-20.48 11.46z"/>
      </svg>)
    },
    {
        id: 'msi',
        name: 'MSI Gaming',
        sub: 'Dragon Shield',
        accent: 'hover:text-rose-500 hover:border-rose-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-rose-600">
        <path d="M50 10 C72 10 86 22 86 46 C86 70 66 86 50 92 C34 86 14 70 14 46 C14 22 28 10 50 10 Z M50 26 C42 26 36 32 36 40 C36 48 42 54 50 54 C58 54 64 48 64 40 C64 32 58 26 50 26 Z M36 62 L64 62 L50 76 Z"/>
      </svg>)
    },
    {
        id: 'acer',
        name: 'Acer Predator',
        sub: 'Helios & Nitro',
        accent: 'hover:text-teal-500 hover:border-teal-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-teal-600">
        <path d="M22 15 L38 48 L28 85 L42 62 L50 88 L58 62 L72 85 L62 48 L78 15 L58 35 L50 22 L42 35 Z"/>
      </svg>)
    },
    {
        id: 'hp',
        name: 'HP OMEN',
        sub: 'Power Gaming',
        accent: 'hover:text-amber-500 hover:border-amber-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-amber-500">
        <rect x="25" y="25" width="50" height="50" rx="8" transform="rotate(45 50 50)"/>
      </svg>)
    },
    {
        id: 'gigabyte',
        name: 'Gigabyte AORUS',
        sub: 'Team Up. Fight On.',
        accent: 'hover:text-orange-500 hover:border-orange-500/40',
        logo: (<svg viewBox="0 0 100 100" fill="currentColor" className="w-6 h-6 text-orange-500">
        <path d="M20 70 L46 24 L82 18 L62 44 L86 50 L42 82 L54 58 L30 66 Z"/>
      </svg>)
    }
];
export default function ThuongHieuDoiTac() {
    // Nhân đôi danh sách để tạo luồng chạy liên tục không bị đứt đoạn (Seamless Infinite Loop)
    const danhSachLapLai = [...BRAND_MARQUEE_LIST, ...BRAND_MARQUEE_LIST];
    return (<section className="w-full space-y-3">
      {/* Tiêu đề ngắn gọn, thanh lịch */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
          <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            ĐỐI TÁC THƯƠNG HIỆU ỦY QUYỀN CHÍNH HÃNG
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          100% Phân Phối Trực Tiếp Từ Nhà Máy
        </span>
      </div>

      {/* Băng Chuyền Marquee Tự Động Chạy Ngang Vô Hạn */}
      <div className="relative w-full overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="animate-marquee-smooth flex items-center gap-4">
          {danhSachLapLai.map((brand, index) => (<Link key={`${brand.id}-${index}`} href={`/san-pham?hang=${brand.id}`} className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-300 group shrink-0 ${brand.accent}`}>
              <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                {brand.logo}
              </div>
              <div className="text-left">
                <div className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors">
                  {brand.name}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {brand.sub}
                </div>
              </div>
            </Link>))}
        </div>
      </div>
    </section>);
}
