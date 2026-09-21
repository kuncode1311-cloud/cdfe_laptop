'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Search, X, Plus, Check, Laptop, Sparkles } from 'lucide-react';
import { useSoSanh, layLoaiSanPham, layTenLoaiSanPham } from '@/contexts/CompareContext';
import { SanPhamService } from '@/services/san-pham.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';

export default function ModalChonSanPhamSoSanh({ isOpen, onClose }) {
    const { danh_sach_so_sanh, themVaoSoSanh, kiemTraDaCoTrongSoSanh } = useSoSanh();
    const [tatCaSanPham, setTatCaSanPham] = useState([]);
    const [tuKhoa, setTuKhoa] = useState('');
    const [hangChon, setHangChon] = useState('tat_ca');
    const [mounted, setMounted] = useState(false);

    // Xác định loại sản phẩm hiện tại đang được so sánh (Laptop, Chuột, Bàn phím...)
    const loaiHienTai = danh_sach_so_sanh.length > 0 ? layLoaiSanPham(danh_sach_so_sanh[0]) : 'laptop';
    const tenLoaiHienTai = layTenLoaiSanPham(loaiHienTai);

    useEffect(() => {
        setMounted(true);
        let daHuy = false;
        SanPhamService.layTatCaSanPhamAsync().then((data) => {
            if (!daHuy && Array.isArray(data)) {
                setTatCaSanPham(data);
            }
        });
        return () => { daHuy = true; };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Lọc danh sách hãng thực tế theo đúng sản phẩm của ngành hàng hiện tại
    const danhSachHang = useMemo(() => {
        const spCungLoai = tatCaSanPham.filter((sp) => layLoaiSanPham(sp) === loaiHienTai);
        const setHangs = new Set();
        spCungLoai.forEach((sp) => {
            if (sp.hang_san_xuat) {
                setHangs.add(sp.hang_san_xuat.trim().toUpperCase());
            }
        });
        return ['tat_ca', ...Array.from(setHangs).sort()];
    }, [tatCaSanPham, loaiHienTai]);

    // Tự động reset hãng và từ khóa khi mở modal hoặc khi danh mục thay đổi
    useEffect(() => {
        if (isOpen) {
            setTuKhoa('');
            setHangChon('tat_ca');
        }
    }, [isOpen, loaiHienTai]);

    useEffect(() => {
        if (hangChon !== 'tat_ca' && !danhSachHang.includes(hangChon)) {
            setHangChon('tat_ca');
        }
    }, [danhSachHang, hangChon]);

    const danhSachLoc = useMemo(() => {
        return tatCaSanPham.filter((sp) => {
            // BẮT BUỘC CÙNG LOẠI: Laptop chỉ hiển thị Laptop, Chuột chỉ hiển thị Chuột!
            const matchLoai = layLoaiSanPham(sp) === loaiHienTai;
            const matchHang = hangChon === 'tat_ca' || (sp.hang_san_xuat && sp.hang_san_xuat.toUpperCase() === hangChon);
            const searchStr = `${sp.ten_san_pham || ''} ${sp.hang_san_xuat || ''} ${sp.thong_so?.cpu || ''} ${sp.thong_so?.card_do_hoa || ''}`.toLowerCase();
            const matchTuKhoa = !tuKhoa.trim() || searchStr.includes(tuKhoa.toLowerCase().trim());
            return matchLoai && matchHang && matchTuKhoa;
        });
    }, [tatCaSanPham, hangChon, tuKhoa, loaiHienTai]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
            {/* Backdrop làm mờ toàn màn hình 100% bao trọn body */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Dialog */}
            <div className="relative w-full max-w-2xl max-h-[82vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200">
                {/* Header Modal */}
                <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center shadow-xs">
                            <Laptop className="w-4 h-4" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                    Chọn {tenLoaiHienTai} để so sánh
                                </h3>
                                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0052cc] dark:bg-blue-950 dark:text-cyan-400 text-[10px] font-bold border border-blue-200 dark:border-blue-800">
                                    Cùng ngành hàng
                                </span>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Đang chọn {danh_sach_so_sanh.length}/3 sản phẩm (Chỉ hiển thị các mẫu {tenLoaiHienTai})
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Thanh Tìm Kiếm & Lọc Hãng */}
                <div className="p-3 sm:p-4 space-y-2.5 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={tuKhoa}
                            onChange={(e) => setTuKhoa(e.target.value)}
                            placeholder={`Nhập tên ${tenLoaiHienTai.toLowerCase()}, hãng, thông số...`}
                            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#0052cc]"
                        />
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-thin">
                        {danhSachHang.map((hang) => (
                            <button
                                key={hang}
                                type="button"
                                onClick={() => setHangChon(hang)}
                                className={`px-3 py-1.5 rounded-xl font-bold text-xs shrink-0 transition-all cursor-pointer ${
                                    hangChon === hang
                                        ? 'bg-[#0052cc] text-white shadow-xs'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/50 dark:border-slate-700/50'
                                }`}
                            >
                                {hang === 'tat_ca' ? 'Tất cả hãng' : hang}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Danh sách sản phẩm cuộn mượt */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 divide-y divide-slate-100 dark:divide-slate-800/80">
                    {danhSachLoc.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center space-y-2.5">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
                            </p>
                            {(tuKhoa || hangChon !== 'tat_ca') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setTuKhoa('');
                                        setHangChon('tat_ca');
                                    }}
                                    className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-[#0052cc] hover:bg-blue-100 dark:bg-slate-800 dark:text-cyan-400 text-xs font-bold transition-colors cursor-pointer border border-blue-200 dark:border-slate-700"
                                >
                                    Xóa bộ lọc để xem tất cả {tenLoaiHienTai}
                                </button>
                            )}
                        </div>
                    ) : (
                        danhSachLoc.map((sp) => {
                            const daCo = kiemTraDaCoTrongSoSanh(sp.id);
                            return (
                                <div
                                    key={sp.id}
                                    className="pt-2 flex items-center justify-between gap-3 group"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="relative w-14 h-14 rounded-xl bg-slate-50 dark:bg-slate-800 p-1 shrink-0 border border-slate-200/80 dark:border-slate-700/80 overflow-hidden">
                                            <Image
                                                src={sp.hinh_anh_chinh}
                                                alt={sp.ten_san_pham}
                                                fill
                                                className="object-contain p-0.5"
                                                unoptimized
                                            />
                                        </div>

                                        <div className="min-w-0 space-y-0.5">
                                            <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#0052cc] transition-colors">
                                                {sp.ten_san_pham}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                                                <span className="font-bold text-[#EA1E2C]">
                                                    {dinhDangTienVND(sp.gia_khuyen_mai)}
                                                </span>
                                                {sp.thong_so?.cpu && (
                                                    <span className="truncate max-w-[160px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                                                        {sp.thong_so.cpu}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            themVaoSoSanh(sp);
                                            if (!daCo && danh_sach_so_sanh.length >= 2) {
                                                onClose();
                                            }
                                        }}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1 transition-all cursor-pointer shadow-xs ${
                                            daCo
                                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700'
                                                : 'bg-[#0052cc] hover:bg-[#003da5] text-white'
                                        }`}
                                    >
                                        {daCo ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Đã chọn</span>
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>So sánh</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer Modal */}
                <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                        {danh_sach_so_sanh.length >= 3 ? 'Đã đủ 3 sản phẩm để so sánh.' : `Có thể chọn thêm ${3 - danh_sach_so_sanh.length} sản phẩm nữa.`}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 font-bold hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
