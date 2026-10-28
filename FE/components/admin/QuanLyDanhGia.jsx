'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    Star,
    Search,
    Trash2,
    Eye,
    EyeOff,
    Loader2,
    MessageSquare,
    ImageIcon,
    X,
    SlidersHorizontal,
    ChevronDown,
    ArrowUpDown,
    RotateCcw,
    Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { DanhGiaService } from '@/services/danh-gia.service';
import PhanTrangAdmin, { usePhanTrang } from '@/components/admin/PhanTrangAdmin';

// Helper format thời gian
const dinhDangNgay = (isoString) => {
    if (!isoString) return '--:--';
    try {
        const d = new Date(isoString);
        return d.toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        return isoString;
    }
};

export default function QuanLyDanhGia({ xacNhan }) {
    const [danhSach, setDanhSach] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [tuKhoa, setTuKhoa] = useState('');
    const [locSoSao, setLocSoSao] = useState('tat_ca');
    const [locTrangThai, setLocTrangThai] = useState('tat_ca');
    const [sapXep, setSapXep] = useState('moi_nhat');
    const [dangXuLyId, setDangXuLyId] = useState(null);

    const taiDuLieu = async () => {
        setDangTai(true);
        try {
            const res = await DanhGiaService.layDanhGiaChoAdminAsync();
            setDanhSach(Array.isArray(res) ? res : []);
        } catch (e) {
            console.error('[QuanLyDanhGia] Lỗi tải đánh giá:', e);
            toast.error('Không thể tải danh sách đánh giá');
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDuLieu();
    }, []);

    // Lọc client-side theo tên sản phẩm / tên khách
    const danhSachDaLoc = useMemo(() => {
        const tu = tuKhoa.trim().toLowerCase();
        const ketQua = danhSach.filter((dg) => {
            const ten = (dg.ten_san_pham || '').toLowerCase();
            const khach = (dg.ho_ten || '').toLowerCase();
            const dungTuKhoa = !tu || ten.includes(tu) || khach.includes(tu);
            const dungSoSao = locSoSao === 'tat_ca' || Number(dg.so_sao) === Number(locSoSao);
            const hienThi = dg.hien_thi !== false;
            const dungTrangThai = locTrangThai === 'tat_ca' || (locTrangThai === 'hien' ? hienThi : !hienThi);
            return dungTuKhoa && dungSoSao && dungTrangThai;
        });
        return ketQua.sort((a, b) => {
            if (sapXep === 'sao_cao') {
                return (Number(b.so_sao) || 0) - (Number(a.so_sao) || 0);
            }
            if (sapXep === 'sao_thap') {
                return (Number(a.so_sao) || 0) - (Number(b.so_sao) || 0);
            }
            const ngayA = new Date(a.createdAt || a.ngay_tao || 0).getTime();
            const ngayB = new Date(b.createdAt || b.ngay_tao || 0).getTime();
            return sapXep === 'cu_nhat' ? ngayA - ngayB : ngayB - ngayA;
        });
    }, [danhSach, tuKhoa, locSoSao, locTrangThai, sapXep]);

    // Thống kê số lượng theo sao & trạng thái để hiển thị trên bộ lọc
    const thongKe = useMemo(() => {
        let sao5 = 0;
        let sao4 = 0;
        let sao3 = 0;
        let sao12 = 0;
        let hien = 0;
        let an = 0;

        danhSach.forEach((dg) => {
            const sao = Number(dg.so_sao) || 0;
            if (sao === 5) sao5++;
            else if (sao === 4) sao4++;
            else if (sao === 3) sao3++;
            else if (sao <= 2) sao12++;

            if (dg.hien_thi !== false) hien++;
            else an++;
        });

        return { sao5, sao4, sao3, sao12, hien, an };
    }, [danhSach]);

    const dangLoc = tuKhoa.trim() !== '' || locSoSao !== 'tat_ca' || locTrangThai !== 'tat_ca' || sapXep !== 'moi_nhat';

    const datLaiBoLoc = () => {
        setTuKhoa('');
        setLocSoSao('tat_ca');
        setLocTrangThai('tat_ca');
        setSapXep('moi_nhat');
    };

    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        danhSachTrenTrang
    } = usePhanTrang(danhSachDaLoc, 10, [tuKhoa, locSoSao, locTrangThai, sapXep]);

    const layId = (dg) => dg._id || dg.id;

    // Xử lý Ẩn/Hiện đánh giá
    const xuLyAnHien = async (dg) => {
        const id = layId(dg);
        const hienThiMoi = !(dg.hien_thi !== false);
        setDangXuLyId(id);
        try {
            await DanhGiaService.anHienDanhGiaAsync(id, hienThiMoi);
            setDanhSach((prev) => prev.map((item) => (layId(item) === id ? { ...item, hien_thi: hienThiMoi } : item)));
            toast.success(hienThiMoi ? 'Đã hiện lại đánh giá trên trang sản phẩm' : 'Đã ẩn đánh giá khỏi trang sản phẩm');
        } catch (e) {
            console.error('[QuanLyDanhGia] Lỗi ẩn/hiện:', e);
            toast.error('Không thể cập nhật trạng thái hiển thị');
        } finally {
            setDangXuLyId(null);
        }
    };

    // Xử lý xóa đánh giá
    const xuLyXoa = async (dg) => {
        const id = layId(dg);
        const dongY = await xacNhan({
            tieuDe: 'Xóa Đánh Giá',
            noiDung: `Bạn có chắc chắn muốn xóa vĩnh viễn đánh giá của khách "${dg.ho_ten || 'Khách hàng'}" cho sản phẩm "${dg.ten_san_pham || ''}"? Hành động này không thể hoàn tác.`
        });
        if (!dongY) return;
        setDangXuLyId(id);
        try {
            await DanhGiaService.xoaDanhGiaAsync(id);
            setDanhSach((prev) => prev.filter((item) => layId(item) !== id));
            toast.success('Đã xóa đánh giá thành công');
        } catch (e) {
            console.error('[QuanLyDanhGia] Lỗi xóa:', e);
            toast.error('Không thể xóa đánh giá');
        } finally {
            setDangXuLyId(null);
        }
    };

    const renderSao = (soSao) => {
        const so = Number(soSao) || 0;
        return (
            <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                        key={idx}
                        className={`w-3.5 h-3.5 ${idx < so ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700'}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* SECTION BỘ LỌC ĐÁNH GIÁ (Chuẩn Tone Cam / Hổ Phách Sang Trọng, Đa Sắc Phân Biệt Sắc Nét & Đồng Bộ) */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-amber-100/70 dark:from-[#19140c] dark:via-[#16121f] dark:to-[#0f172a] rounded-3xl border-2 border-amber-300/80 dark:border-amber-800/80 shadow-md shadow-amber-500/5 p-3.5 sm:p-4 space-y-3">
                {/* Tầng 1: Tiêu đề + Thống kê số lượng + Nút Tải lại */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 pb-2.5 border-b border-amber-200/80 dark:border-amber-900/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-black shadow-md shadow-orange-500/30 shrink-0">
                            <SlidersHorizontal className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm sm:text-base font-black text-amber-950 dark:text-amber-100 tracking-tight">
                                    Bộ Lọc & Quản Lý Đánh Giá
                                </h2>
                                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-black text-[11px] shadow-xs">
                                    {danhSachDaLoc.length} / {danhSach.length} đánh giá
                                </span>
                            </div>
                            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 font-semibold mt-0.5 hidden sm:block">
                                Kiểm duyệt nội dung đánh giá của khách hàng, lọc đa chiều theo số sao và trạng thái hiển thị
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                        <button
                            type="button"
                            onClick={taiDuLieu}
                            disabled={dangTai}
                            className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-amber-300 dark:border-amber-700 hover:border-amber-500 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50 font-black text-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                            title="Tải lại danh sách đánh giá từ máy chủ"
                        >
                            <RotateCcw className={`w-3.5 h-3.5 ${dangTai ? 'animate-spin' : ''}`} />
                            <span>{dangTai ? 'Đang tải...' : 'Làm Mới'}</span>
                        </button>
                    </div>
                </div>

                {/* Tầng 2: Thanh Ribbon Bộ Lọc Màu Sắc Trực Quan (Từng ô đều có icon và màu sắc nhận diện đồng bộ Đơn Hàng) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 dark:bg-[#0c1222]/95 p-2.5 rounded-2xl border-2 border-amber-300/70 dark:border-amber-900/60 shadow-xs backdrop-blur-md">
                    <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto flex-1">
                        {/* 1. Ô Tìm Kiếm Sản Phẩm / Tên Khách Hàng */}
                        <div className="relative flex-1 min-w-[200px] sm:min-w-[240px]">
                            <Search className="w-4 h-4 text-amber-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                value={tuKhoa}
                                onChange={(e) => setTuKhoa(e.target.value)}
                                placeholder="Tìm tên máy, tên khách, nội dung..."
                                className="w-full pl-9 pr-8 py-2 text-xs font-bold rounded-xl border-2 border-amber-200 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-amber-500/20 transition-all shadow-2xs"
                            />
                            {tuKhoa && (
                                <button
                                    type="button"
                                    onClick={() => setTuKhoa('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-0.5"
                                    title="Xóa từ khóa tìm kiếm"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>

                        {/* 2. Lọc Số Sao (Màu Vàng Hổ Phách Amber) */}
                        <div className="relative min-w-[155px] flex-1 sm:flex-initial">
                            <select
                                value={locSoSao}
                                onChange={(e) => setLocSoSao(e.target.value)}
                                className="w-full appearance-none pl-8 pr-7 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border-2 border-amber-300 dark:border-amber-700 text-xs font-black text-amber-950 dark:text-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-2xs transition-all"
                                title="Lọc theo mức đánh giá sao"
                            >
                                <option value="tat_ca">⭐ Tất cả số sao ({danhSach.length})</option>
                                <option value="5">★★★★★ 5 sao ({thongKe.sao5})</option>
                                <option value="4">★★★★ 4 sao ({thongKe.sao4})</option>
                                <option value="3">★★★ 3 sao ({thongKe.sao3})</option>
                                <option value="2">★★ 2 sao ({thongKe.sao12})</option>
                                <option value="1">★ 1 sao</option>
                            </select>
                            <Star className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500 fill-amber-400 pointer-events-none" />
                            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-700 dark:text-amber-300 pointer-events-none stroke-[2.5]" />
                        </div>

                        {/* 3. Lọc Trạng Thái Hiển Thị (Màu Xanh Lá Emerald) */}
                        <div className="relative min-w-[160px] flex-1 sm:flex-initial">
                            <select
                                value={locTrangThai}
                                onChange={(e) => setLocTrangThai(e.target.value)}
                                className="w-full appearance-none pl-8 pr-7 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-300 dark:border-emerald-700 text-xs font-black text-emerald-950 dark:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-400 cursor-pointer shadow-2xs transition-all"
                                title="Lọc theo trạng thái kiểm duyệt"
                            >
                                <option value="tat_ca">👁️ Tất cả trạng thái</option>
                                <option value="hien">✅ Đang hiển thị ({thongKe.hien})</option>
                                <option value="an">🚫 Đã ẩn kiểm duyệt ({thongKe.an})</option>
                            </select>
                            <Eye className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 dark:text-emerald-400 pointer-events-none" />
                            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-700 dark:text-emerald-300 pointer-events-none stroke-[2.5]" />
                        </div>
                    </div>

                    {/* Cụm Bên Phải: Sắp Xếp & Nút Đặt Lại */}
                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                        {/* 4. Sắp Xếp (Màu Tím Purple / Indigo) */}
                        <div className="relative min-w-[160px]">
                            <select
                                value={sapXep}
                                onChange={(e) => setSapXep(e.target.value)}
                                className="w-full appearance-none pl-8 pr-7 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 border-2 border-purple-300 dark:border-purple-700 text-xs font-black text-purple-950 dark:text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer shadow-2xs transition-all"
                                title="Sắp xếp danh sách đánh giá"
                            >
                                <option value="moi_nhat">✨ Mới nhất trước</option>
                                <option value="cu_nhat">⏳ Cũ nhất trước</option>
                                <option value="sao_cao">⭐ Sao cao nhất (5→1)</option>
                                <option value="sao_thap">💔 Sao thấp nhất (1→5)</option>
                            </select>
                            <ArrowUpDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-600 dark:text-purple-400 pointer-events-none" />
                            <ChevronDown className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-700 dark:text-purple-300 pointer-events-none stroke-[2.5]" />
                        </div>

                        {/* 5. Nút Đặt Lại Bộ Lọc (Tone Đỏ Hồng Rose) */}
                        {dangLoc && (
                            <button
                                type="button"
                                onClick={datLaiBoLoc}
                                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 !text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-rose-600/25 cursor-pointer transition-all hover:scale-105 active:scale-95 shrink-0"
                                title="Đặt lại toàn bộ bộ lọc về mặc định"
                            >
                                <RotateCcw className="w-3.5 h-3.5 !text-white" />
                                <span className="!text-white whitespace-nowrap">Đặt lại</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bảng danh sách đánh giá */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-5 py-4 flex items-center gap-3 shadow-md">
                    <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                        <Star className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Danh Sách Đánh Giá Sản Phẩm
                        </h3>
                        <div className="text-[11px] text-amber-100 font-medium">
                            Kiểm duyệt nội dung & quản lý đánh giá từ khách hàng
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-3 px-3.5 w-64 border-b-2 border-r border-slate-300 dark:border-slate-700">SẢN PHẨM</th>
                                <th className="py-3 px-3.5 w-48 border-b-2 border-r border-slate-300 dark:border-slate-700">KHÁCH HÀNG</th>
                                <th className="py-3 px-3.5 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700">SỐ SAO</th>
                                <th className="py-3 px-3.5 min-w-[260px] border-b-2 border-r border-slate-300 dark:border-slate-700">NỘI DUNG</th>
                                <th className="py-3 px-3.5 w-36 border-b-2 border-r border-slate-300 dark:border-slate-700">NGÀY GỬI</th>
                                <th className="py-3 px-3.5 w-28 text-center border-b-2 border-r border-slate-300 dark:border-slate-700">TRẠNG THÁI</th>
                                <th className="py-3 px-3.5 w-32 text-right border-b-2 border-slate-300 dark:border-slate-700">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {dangTai ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
                                            <span className="font-bold">Đang tải danh sách đánh giá...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : danhSachDaLoc.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <MessageSquare className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {danhSach.length === 0 ? 'Chưa có đánh giá nào' : 'Không tìm thấy đánh giá phù hợp'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSachTrenTrang.map((dg) => {
                                    const id = layId(dg);
                                    const dangXuLy = dangXuLyId === id;
                                    const hienThi = dg.hien_thi !== false;
                                    return (
                                        <tr
                                            key={id}
                                            className="transition-colors duration-150 odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-amber-50/80 dark:hover:!bg-amber-950/30"
                                        >
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <div className="flex items-center gap-2.5">
                                                    {dg.hinh_anh_san_pham ? (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img
                                                            src={dg.hinh_anh_san_pham}
                                                            alt={dg.ten_san_pham || 'Sản phẩm'}
                                                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                                            <ImageIcon className="w-4 h-4 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-snug line-clamp-2 max-w-[180px]">
                                                        {dg.ten_san_pham || '(Sản phẩm đã bị xóa)'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <span className="font-extrabold text-slate-900 dark:text-white">{dg.ho_ten || 'Khách hàng'}</span>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                {renderSao(dg.so_sao)}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle min-w-[260px]">
                                                <p className="text-slate-700 dark:text-slate-300 text-xs italic font-medium leading-relaxed line-clamp-3">
                                                    "{dg.noi_dung || ''}"
                                                </p>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
                                                <div className="flex items-center gap-1.5 text-[11px]">
                                                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                                                    <span>{dinhDangNgay(dg.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle text-center whitespace-nowrap">
                                                {hienThi ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-xs shadow-emerald-500/20 whitespace-nowrap">
                                                        <Eye className="w-3 h-3 stroke-[2.5]" /> Đang Hiện
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                                                        <EyeOff className="w-3 h-3" /> Đã Ẩn
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-slate-200 dark:border-slate-800 align-middle text-right whitespace-nowrap">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyAnHien(dg)}
                                                        disabled={dangXuLy}
                                                        className={`p-2 rounded-xl border-2 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50 ${
                                                            hienThi
                                                                ? 'bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50'
                                                                : 'bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                                                        }`}
                                                        title={hienThi ? 'Ẩn đánh giá này khỏi web' : 'Hiện lại đánh giá này lên web'}
                                                    >
                                                        {dangXuLy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : hienThi ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyXoa(dg)}
                                                        disabled={dangXuLy}
                                                        className="p-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                                        title="Xóa vĩnh viễn đánh giá"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc="đánh giá"
                />
            </div>
        </div>
    );
}
