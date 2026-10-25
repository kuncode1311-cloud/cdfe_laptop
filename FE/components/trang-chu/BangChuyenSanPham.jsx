'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Băng chuyền ngang dùng chung cho các section trang chủ (Flash Sale, Bán chạy...).
 * - Mỗi lần bấm mũi tên trượt đúng 1 card.
 * - Tự ẩn mũi tên khi đã ở đầu / cuối danh sách.
 * - Truyền các card vào qua children; mỗi card tự được bọc để có độ rộng chuẩn.
 */
const KHOANG_CACH = 18; // px, khớp với gap-[18px]

export default function BangChuyenSanPham({ children }) {
    const khungRef = useRef(null);
    const [coTheLui, setCoTheLui] = useState(false);
    const [coTheTien, setCoTheTien] = useState(false);

    // Cập nhật trạng thái mũi tên theo vị trí cuộn hiện tại
    const capNhatMuiTen = useCallback(() => {
        const khung = khungRef.current;
        if (!khung) return;
        setCoTheLui(khung.scrollLeft > 4);
        setCoTheTien(khung.scrollLeft + khung.clientWidth < khung.scrollWidth - 4);
    }, []);

    useEffect(() => {
        capNhatMuiTen();
        window.addEventListener('resize', capNhatMuiTen);
        return () => window.removeEventListener('resize', capNhatMuiTen);
    }, [capNhatMuiTen, children]);

    // Trượt đúng 1 card: lấy bề rộng card đầu tiên + khoảng cách
    const truot = (huong) => {
        const khung = khungRef.current;
        const card = khung?.firstElementChild;
        if (!khung || !card) return;
        khung.scrollBy({ left: huong * (card.offsetWidth + KHOANG_CACH), behavior: 'smooth' });
    };

    const lopMuiTen =
        'absolute top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-700 dark:text-slate-100 hover:bg-[#0052cc] hover:text-white transition-colors cursor-pointer';

    return (
        <div className="relative">
            {coTheLui && (
                <button type="button" aria-label="Sản phẩm trước" onClick={() => truot(-1)} className={`${lopMuiTen} -left-3 sm:-left-5`}>
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}

            <div
                ref={khungRef}
                onScroll={capNhatMuiTen}
                className="flex gap-[18px] overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {React.Children.map(children, (con) => (
                    <div className="snap-start shrink-0 w-full sm:w-[calc((100%-18px)/2)] lg:w-[calc((100%-54px)/4)]">
                        {con}
                    </div>
                ))}
            </div>

            {coTheTien && (
                <button type="button" aria-label="Sản phẩm sau" onClick={() => truot(1)} className={`${lopMuiTen} -right-3 sm:-right-5`}>
                    <ChevronRight className="w-5 h-5" />
                </button>
            )}
        </div>
    );
}
