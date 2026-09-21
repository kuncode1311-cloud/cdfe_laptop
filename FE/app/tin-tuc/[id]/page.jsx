'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import {
    Home,
    ChevronRight,
    UserCheck,
    Share2,
    Sparkles,
    Calendar,
    Clock,
    Eye,
    ArrowLeft,
    Check,
    Bookmark,
    Flame,
    Tag,
    ShoppingBag,
    ExternalLink
} from 'lucide-react';
import { TinTucService } from '@/services/tin-tuc.service';
import { SanPhamService } from '@/services/san-pham.service';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { slugTinTuc } from '@/utils/taoSlug';

export default function ChiTietTinTuc() {
    const params = useParams();
    const id = params?.id;

    const [baiViet, setBaiViet] = useState(null);
    const [tinLienQuan, setTinLienQuan] = useState([]);
    const [sanPhamLienQuan, setSanPhamLienQuan] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [daCopyLink, setDaCopyLink] = useState(false);

    useEffect(() => {
        const napDuLieu = async () => {
            if (!id) return;
            setDangTai(true);
            try {
                const [bv, allNews, allProducts] = await Promise.all([
                    TinTucService.layChiTietTinTucAsync(id),
                    TinTucService.layDanhSachTinTucAsync(),
                    SanPhamService.layTatCaSanPhamAsync()
                ]);

                if (bv) {
                    setBaiViet(bv);
                    const lq = (allNews || []).filter(t => (t.id || t._id) !== (bv.id || bv._id)).slice(0, 3);
                    setTinLienQuan(lq);
                }

                // Gợi ý sản phẩm phù hợp
                const sps = (allProducts || []).slice(0, 3);
                setSanPhamLienQuan(sps);
            } catch (err) {
                console.error('Lỗi tải bài viết chi tiết:', err);
            } finally {
                setDangTai(false);
            }
        };

        napDuLieu();
    }, [id]);

    const xuLyCopyLink = () => {
        if (typeof window !== 'undefined') {
            navigator.clipboard.writeText(window.location.href);
            setDaCopyLink(true);
            setTimeout(() => setDaCopyLink(false), 2500);
        }
    };

    if (dangTai) {
        return (
            <div className="max-w-5xl mx-auto py-16 px-4 text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-500">Đang tải bài viết công nghệ...</p>
            </div>
        );
    }

    if (!baiViet) {
        return (
            <div className="max-w-5xl mx-auto py-16 px-4 text-center space-y-4">
                <div className="text-5xl">📰</div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Không tìm thấy bài viết!</h2>
                <p className="text-xs text-slate-500 font-semibold">Bài viết có thể đã bị xóa hoặc tạm ẩn bởi quản trị viên.</p>
                <Link href="/tin-tuc" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-blue-600 text-white text-xs font-bold shadow-md">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Quay lại Trang Tin Tức</span>
                </Link>
            </div>
        );
    }

    // Render nội dung bài viết
    const renderNoiDung = (noiDung) => {
        if (!noiDung) {
            return (
                <div className="space-y-4">
                    <p>Nội dung chi tiết đang được ban biên tập TNTP Laptop cập nhật...</p>
                </div>
            );
        }

        const paragraphs = noiDung.split('\n\n');
        return paragraphs.map((block, idx) => {
            const trimmed = block.trim();
            if (trimmed.startsWith('### ')) {
                return (
                    <h3 key={idx} className="text-lg sm:text-xl font-black text-slate-900 dark:text-white pt-4 pb-1 border-b border-slate-100 dark:border-slate-800">
                        {trimmed.replace('### ', '')}
                    </h3>
                );
            }
            if (trimmed.startsWith('## ')) {
                return (
                    <h2 key={idx} className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-5 pb-1">
                        {trimmed.replace('## ', '')}
                    </h2>
                );
            }
            if (trimmed.startsWith('> ')) {
                return (
                    <div key={idx} className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border-l-4 border-blue-600 my-4 text-slate-800 dark:text-blue-100 text-xs sm:text-sm font-semibold leading-relaxed">
                        {trimmed.replace(/^>\s*/gm, '')}
                    </div>
                );
            }
            return (
                <p key={idx} className="leading-relaxed text-slate-700 dark:text-slate-300 font-medium">
                    {trimmed}
                </p>
            );
        });
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-4">
            {/* 1. Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-hidden">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 shrink-0">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <Link href="/tin-tuc" className="hover:text-blue-600 dark:hover:text-cyan-400 shrink-0">
                    Tin Tức Công Nghệ
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-bold text-slate-900 dark:text-white truncate">{baiViet.tieu_de}</span>
            </nav>

            {/* 2. Header Bài Viết */}
            <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-black uppercase shadow-md shadow-blue-500/20">
                        {baiViet.chuyen_muc}
                    </span>
                    {baiViet.la_tieu_diem && (
                        <span className="px-3 py-1 rounded-xl bg-red-600 text-white text-xs font-black uppercase shadow-md flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 fill-current" />
                            <span>Tiêu Điểm 2026</span>
                        </span>
                    )}
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {baiViet.ngay_dang || '24/08/2026'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {baiViet.thoi_gian_doc || '5 phút đọc'}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {baiViet.luot_xem || 120} lượt xem
                    </span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">
                    {baiViet.tieu_de}
                </h1>

                {/* Author & Share Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-y border-slate-200 dark:border-slate-800 py-3.5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-base shadow-md">
                            ✍️
                        </div>
                        <div>
                            <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                {baiViet.tac_gia || 'Ban Biên Tập TNTP Laptop'}
                            </div>
                            <div className="text-[11px] font-bold text-blue-600 dark:text-cyan-400">
                                Chuyên Gia Công Nghệ & Phần Cứng
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={xuLyCopyLink}
                            className="px-4 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                            {daCopyLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                            <span>{daCopyLink ? 'Đã sao chép link!' : 'Chia sẻ bài viết'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Ảnh Bìa 16:9 Sắc Nét */}
            <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800">
                <Image
                    src={baiViet.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                    alt={baiViet.tieu_de}
                    fill
                    priority
                    className="object-cover"
                />
            </div>

            {/* 4. Nội Dung Bài Viết Chi Tiết */}
            <article className="bg-white dark:bg-[#0d1527] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
                {/* Trích dẫn tóm tắt Lead Quote */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border-l-4 border-blue-600 text-slate-900 dark:text-slate-100 font-bold text-base sm:text-lg leading-relaxed shadow-xs">
                    {baiViet.tom_tat}
                </div>

                {/* Khối Nội Dung */}
                <div className="space-y-4">
                    {renderNoiDung(baiViet.noi_dung)}
                </div>

                {/* Footer Tag */}
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Tag className="w-4 h-4 text-blue-600" />
                        <span>Chủ đề:</span>
                        <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black">
                            #{baiViet.chuyen_muc}
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black">
                            #TNTPLaptop2026
                        </span>
                    </div>

                    <Link
                        href="/tin-tuc"
                        className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Xem thêm các bài viết khác</span>
                    </Link>
                </div>
            </article>

            {/* 5. Khối Sản Phẩm Đề Xuất Cho Bài Viết */}
            {sanPhamLienQuan.length > 0 && (
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                            <span className="w-2.5 h-6 bg-orange-500 rounded-full" />
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                SẢN PHẨM ĐỀ XUẤT CHO BÀI VIẾT NÀY
                            </h3>
                        </div>
                        <Link href="/" className="text-xs font-bold text-blue-600 hover:underline">
                            Xem tất cả kho máy →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sanPhamLienQuan.map((sp) => (
                            <TheSanPham key={sp.id || sp._id} sanPham={sp} />
                        ))}
                    </div>
                </div>
            )}

            {/* 6. Bài Viết Liên Quan Khác */}
            {tinLienQuan.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2.5 pb-2">
                        <span className="w-2.5 h-6 bg-purple-600 rounded-full" />
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            BÀI VIẾT CÙNG CHỦ ĐỀ
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        {tinLienQuan.map((tin) => (
                            <Link
                                key={tin.id || tin._id}
                                href={`/tin-tuc/${slugTinTuc(tin)}`}
                                className="group bg-white dark:bg-[#0d1527] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:border-blue-500 transition-all p-3.5 flex flex-col justify-between"
                            >
                                <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden mb-3 bg-slate-950">
                                    <Image
                                        src={tin.hinh_anh || 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'}
                                        alt={tin.tieu_de}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform"
                                    />
                                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-lg bg-blue-600 text-white text-[10px] font-black">
                                        {tin.chuyen_muc}
                                    </span>
                                </div>

                                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 line-clamp-2 leading-snug">
                                        {tin.tieu_de}
                                    </h4>
                                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold pt-2">
                                        <span>📅 {tin.ngay_dang}</span>
                                        <span>•</span>
                                        <span>{tin.thoi_gian_doc}</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
