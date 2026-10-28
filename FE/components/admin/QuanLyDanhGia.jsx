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
    X
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
            const ngayA = new Date(a.createdAt || a.ngay_tao || 0).getTime();
            const ngayB = new Date(b.createdAt || b.ngay_tao || 0).getTime();
            return sapXep === 'cu_nhat' ? ngayA - ngayB : ngayB - ngayA;
        });
    }, [danhSach, tuKhoa, locSoSao, locTrangThai, sapXep]);

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
            {/* Thanh công cụ tìm kiếm */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50/90 via-white to-amber-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#1c1409] border-2 border-amber-100/90 dark:border-slate-800 shadow-md shadow-amber-500/5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="relative flex-1 max-w-lg">
                    <Search className="w-4 h-4 text-amber-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        placeholder="Tìm theo tên sản phẩm hoặc tên khách hàng..."
                        className="w-full pl-9 pr-8 py-2.5 text-xs font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 transition-all shadow-2xs"
                    />
                    {tuKhoa && (
                        <button
                            type="button"
                            onClick={() => setTuKhoa('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                    </div>
                    <span className="px-3 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-black whitespace-nowrap">
                        {danhSachDaLoc.length} / {danhSach.length} đánh giá
                    </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <select value={locSoSao} onChange={(e) => setLocSoSao(e.target.value)} className="h-9 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <option value="tat_ca">Tất cả số sao</option><option value="5">★★★★★ 5 sao</option><option value="4">★★★★ 4 sao</option><option value="3">★★★ 3 sao</option><option value="2">★★ 2 sao</option><option value="1">★ 1 sao</option>
                    </select>
                    <select value={locTrangThai} onChange={(e) => setLocTrangThai(e.target.value)} className="h-9 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <option value="tat_ca">Tất cả trạng thái</option><option value="hien">Đang hiển thị</option><option value="an">Đã ẩn</option>
                    </select>
                    <select value={sapXep} onChange={(e) => setSapXep(e.target.value)} className="h-9 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                        <option value="moi_nhat">Mới nhất trước</option><option value="cu_nhat">Cũ nhất trước</option>
                    </select>
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
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap text-slate-500 font-semibold">
                                                {dinhDangNgay(dg.createdAt)}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle text-center">
                                                {hienThi ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap">
                                                        <Eye className="w-3 h-3" /> Hiện
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400 whitespace-nowrap">
                                                        <EyeOff className="w-3 h-3" /> Đã ẩn
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-slate-200 dark:border-slate-800 align-middle text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyAnHien(dg)}
                                                        disabled={dangXuLy}
                                                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-500 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                                        title={hienThi ? 'Ẩn đánh giá này' : 'Hiện lại đánh giá này'}
                                                    >
                                                        {dangXuLy ? <Loader2 className="w-4 h-4 animate-spin" /> : hienThi ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => xuLyXoa(dg)}
                                                        disabled={dangXuLy}
                                                        className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/60 hover:border-rose-500 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                                                        title="Xóa đánh giá"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
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
