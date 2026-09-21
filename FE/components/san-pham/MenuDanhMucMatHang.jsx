'use client';
import React, { useMemo } from 'react';
import { 
    Laptop, Gamepad2, Sparkles, Briefcase, Palette, 
    Backpack, Keyboard, Mouse, Headphones, Zap, HardDrive, 
    Layers, ChevronRight, ChevronLeft 
} from 'lucide-react';

/**
 * Menu Danh Mục Mặt Hàng Lớn - Chuẩn E-Commerce Thế Giới Di Động / Shopee Mall
 * Cho phép chuyển đổi nhanh chóng giữa các nhóm mặt hàng (Laptop, Phụ kiện, Linh kiện...)
 * Hiệu ứng Active nổi bật, rõ ràng, tương phản cao.
 */
export default function MenuDanhMucMatHang({
    danhMucHienTai = [],
    onChonDanhMuc,
    tatCaSanPham = []
}) {
    // Đếm số lượng sản phẩm động cho từng danh mục
    const soLuongMap = useMemo(() => {
        const dem = {};
        (tatCaSanPham || []).forEach(sp => {
            (sp.danh_muc || []).forEach(dm => {
                dem[dm] = (dem[dm] || 0) + 1;
            });
        });
        return dem;
    }, [tatCaSanPham]);

    const danhSachDanhMuc = [
        { ma: null, ten: 'Tất Cả Sản Phẩm', icon: Layers, count: tatCaSanPham.length, badge: 'Full' },
        { ma: 'ai-pc', ten: 'Laptop AI 2026', icon: Sparkles, count: soLuongMap['ai-pc'] || 0, badge: 'Hot' },
        { ma: 'gaming', ten: 'Laptop Gaming RTX', icon: Gamepad2, count: soLuongMap['gaming'] || 0, badge: '175W' },
        { ma: 'van-phong-mong-nhe', ten: 'Mỏng Nhẹ Văn Phòng', icon: Briefcase, count: soLuongMap['van-phong-mong-nhe'] || 0 },
        { ma: 'do-hoa-sang-tao', ten: 'Đồ Họa Kỹ Thuật', icon: Palette, count: soLuongMap['do-hoa-sang-tao'] || 0 },
        { ma: 'balo-tui-chong-soc', ten: 'Balo & Túi Chống Sốc', icon: Backpack, count: soLuongMap['balo-tui-chong-soc'] || 0 },
        { ma: 'ban-phim-co', ten: 'Bàn Phím Cơ Custom', icon: Keyboard, count: soLuongMap['ban-phim-co'] || 0 },
        { ma: 'chuot-lot-chuot', ten: 'Chuột & Pad Gaming', icon: Mouse, count: soLuongMap['chuot-lot-chuot'] || 0 },
        { ma: 'tai-nghe-loa', ten: 'Tai Nghe & Âm Thanh', icon: Headphones, count: soLuongMap['tai-nghe-loa'] || 0 },
        { ma: 'sac-cap-hub', ten: 'Củ Sạc GaN & Hub', icon: Zap, count: soLuongMap['sac-cap-hub'] || 0 },
        { ma: 'linh-kien-nang-cap', ten: 'Linh Kiện SSD / RAM', icon: HardDrive, count: soLuongMap['linh-kien-nang-cap'] || 0 }
    ];

    const cuonSangTrai = () => {
        const el = document.getElementById('menu-danh-muc-scroll');
        if (el) el.scrollBy({ left: -220, behavior: 'smooth' });
    };

    const cuonSangPhai = () => {
        const el = document.getElementById('menu-danh-muc-scroll');
        if (el) el.scrollBy({ left: 220, behavior: 'smooth' });
    };

    return (
        <div className="relative w-full bg-white dark:bg-slate-900 rounded-2xl p-2 sm:p-2.5 border border-slate-200/90 dark:border-slate-800 shadow-sm">
            {/* Nút cuộn trái */}
            <button
                onClick={cuonSangTrai}
                className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-transform active:scale-95 cursor-pointer"
                aria-label="Cuộn trái"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Dải Tabs Danh Mục */}
            <div
                id="menu-danh-muc-scroll"
                className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 px-1 scroll-smooth"
            >
                {danhSachDanhMuc.map((dm) => {
                    const IconComp = dm.icon;
                    const dangChon = (!dm.ma && (!danhMucHienTai || danhMucHienTai.length === 0)) ||
                        (dm.ma && danhMucHienTai?.includes(dm.ma));

                    return (
                        <button
                            key={dm.ma || 'tat-ca'}
                            onClick={() => onChonDanhMuc(dm.ma)}
                            className={`h-10 px-3.5 rounded-xl font-extrabold text-xs whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-2 border cursor-pointer select-none ${
                                dangChon
                                    ? 'bg-gradient-to-r from-blue-600 via-[#0052cc] to-indigo-600 border-blue-600 text-white shadow-md shadow-blue-500/25 ring-2 ring-blue-400/40 scale-[1.02]'
                                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600 hover:-translate-y-0.5'
                            }`}
                        >
                            <IconComp className={`w-4 h-4 shrink-0 ${dangChon ? 'text-white' : 'text-blue-600 dark:text-cyan-400'}`} />
                            <span className="text-[12.5px]">{dm.ten}</span>
                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5 ${
                                dangChon
                                    ? 'bg-white/25 text-white'
                                    : 'bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                            }`}>
                                {dm.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Nút cuộn phải */}
            <button
                onClick={cuonSangPhai}
                className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 shadow-md items-center justify-center text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700 transition-transform active:scale-95 cursor-pointer"
                aria-label="Cuộn phải"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
