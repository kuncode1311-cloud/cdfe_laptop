'use client';
import React, { useMemo } from 'react';
import { SlidersHorizontal, Check, ShieldCheck, DollarSign, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

/**
 * Thanh Lọc Nhanh Thông Minh Chuẩn Thế Giới Di Động (TGDD Style Cao Cấp)
 * - Tương phản cao, chữ to rõ, không bị tệp màu
 * - Nút Hãng to bản 42px, Logo thương hiệu chính xác, không trùng lặp chữ
 * - Hiệu ứng Hover & Active sống động, nổi bật nhận diện
 */
export default function BoLocNhanhTGDD({
    boLocHienTai,
    onThayDoiBoLoc,
    onMoBoLocToanDien,
    soLuongDangLoc = 0,
    tatCaSanPham = []
}) {
    // Thống kê số lượng sản phẩm theo từng hãng
    const thongKeHang = useMemo(() => {
        const dem = {};
        (tatCaSanPham || []).forEach(sp => {
            if (sp.hang_san_xuat) {
                const h = sp.hang_san_xuat.toLowerCase();
                dem[h] = (dem[h] || 0) + 1;
            }
        });
        return dem;
    }, [tatCaSanPham]);

    // Danh sách các thương hiệu máy tính chủ lực chuẩn Thế Giới Di Động
    const danhSachHang = [
        { ma: 'asus', ten: 'ASUS', count: thongKeHang['asus'] || 0 },
        { ma: 'apple', ten: 'MacBook', count: thongKeHang['apple'] || 0 },
        { ma: 'hp', ten: 'HP', count: thongKeHang['hp'] || 0 },
        { ma: 'dell', ten: 'DELL', count: thongKeHang['dell'] || 0 },
        { ma: 'lenovo', ten: 'Lenovo', count: thongKeHang['lenovo'] || 0 },
        { ma: 'acer', ten: 'Acer', count: thongKeHang['acer'] || 0 },
        { ma: 'msi', ten: 'MSI', count: thongKeHang['msi'] || 0 },
        { ma: 'gigabyte', ten: 'GIGABYTE', count: thongKeHang['gigabyte'] || 0 }
    ];

    // Khoảng giá nhanh phổ biến
    const cacKhoangGiaNhanh = [
        { nhan: 'Dưới 15 Triệu', min: 0, max: 15000000 },
        { nhan: '15 - 25 Triệu', min: 15000000, max: 25000000 },
        { nhan: '25 - 50 Triệu', min: 25000000, max: 50000000 },
        { nhan: 'Trên 50 Triệu', min: 50000000, max: undefined }
    ];

    // Toggle Hãng
    const toggleHang = (maHang) => {
        const ds = boLocHienTai.hang_san_xuat || [];
        const moi = ds.includes(maHang) ? ds.filter(h => h !== maHang) : [...ds, maHang];
        onThayDoiBoLoc({ ...boLocHienTai, hang_san_xuat: moi });
    };

    // Toggle Khoảng giá nhanh
    const chonKhoangGia = (min, max) => {
        const dangChon = boLocHienTai.muc_gia_toi_thieu === min && boLocHienTai.muc_gia_toi_da === max;
        onThayDoiBoLoc({
            ...boLocHienTai,
            muc_gia_toi_thieu: dangChon ? undefined : min,
            muc_gia_toi_da: dangChon ? undefined : max
        });
    };

    return (
        <div className="w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/80 dark:border-slate-800 p-3 sm:p-4 shadow-sm space-y-3.5">
            {/* Hàng 1: Nút Mở Bộ Lọc + Các Tile Thương Hiệu Logo Sắc Nét */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {/* Nút Mở Drawer Tất Cả Bộ Lọc - Nổi Bật Chuẩn TGDD */}
                <button
                    onClick={onMoBoLocToanDien}
                    className={`h-11 px-4 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center gap-2 border-2 shadow-sm ${
                        soLuongDangLoc > 0
                            ? 'bg-[#0052cc] text-white border-[#0052cc] shadow-blue-500/30 scale-[1.02]'
                            : 'bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 hover:bg-blue-700 hover:border-blue-700 hover:-translate-y-0.5'
                    }`}
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="tracking-wide">BỘ LỌC</span>
                    {soLuongDangLoc > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black leading-none">
                            {soLuongDangLoc}
                        </span>
                    )}
                </button>

                <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 shrink-0 mx-0.5" />

                {/* Các Tile Hãng có Logo chuẩn nét - Không lặp chữ */}
                {danhSachHang.map((th) => {
                    const dangChon = boLocHienTai.hang_san_xuat?.includes(th.ma);
                    return (
                        <button
                            key={th.ma}
                            onClick={() => toggleHang(th.ma)}
                            className={`h-11 px-4 rounded-xl font-black transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 flex items-center justify-center gap-2 border-2 select-none relative ${
                                dangChon
                                    ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/80 text-blue-700 dark:text-cyan-300 shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40 scale-[1.03]'
                                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200 hover:border-blue-500 hover:bg-blue-50/40 hover:-translate-y-0.5 hover:shadow-sm'
                            }`}
                            title={`Lọc theo thương hiệu ${th.ten}`}
                        >
                            <BrandLogo brand={th.ma} className="h-4.5 w-auto" active={dangChon} />
                            
                            {/* Dấu tick đã chọn hoặc số lượng đếm thật */}
                            {dangChon ? (
                                <div className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                                </div>
                            ) : (
                                <span className="text-[10.5px] font-extrabold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                    {th.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Hàng 2: Lọc Nhanh Mức Giá & Ưu Đãi Trả Góp */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800 pb-0.5 scrollbar-none text-xs">
                <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-extrabold text-xs shrink-0 mr-1">
                    <DollarSign className="w-3.5 h-3.5 text-amber-500" />
                    Khoảng giá:
                </span>

                {/* Các nút Giá To Rõ, Nổi Bật Khi Chọn */}
                {cacKhoangGiaNhanh.map((kg, idx) => {
                    const dangChon = boLocHienTai.muc_gia_toi_thieu === kg.min && boLocHienTai.muc_gia_toi_da === kg.max;
                    return (
                        <button
                            key={idx}
                            onClick={() => chonKhoangGia(kg.min, kg.max)}
                            className={`h-8.5 px-3.5 rounded-xl font-black transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border-2 text-[12px] flex items-center gap-1.5 ${
                                dangChon
                                    ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/25 scale-[1.03]'
                                    : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-amber-400 hover:bg-amber-50/50 hover:text-amber-700'
                            }`}
                        >
                            <span>{kg.nhan}</span>
                            {dangChon && <Check className="w-3 h-3 stroke-[3]" />}
                        </button>
                    );
                })}

                <div className="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 mx-1" />

                {/* Nút Ưu Đãi Trả Góp 0% */}
                <button
                    onClick={() => onThayDoiBoLoc({ ...boLocHienTai, ho_tro_tra_gop_0: !boLocHienTai.ho_tro_tra_gop_0 })}
                    className={`h-8.5 px-3 rounded-xl font-black transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 border-2 text-[12px] flex items-center gap-1.5 ml-auto ${
                        boLocHienTai.ho_tro_tra_gop_0
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/25 scale-[1.03]'
                            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 hover:text-emerald-700'
                    }`}
                >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 group-hover:text-emerald-600" />
                    <span>Trả góp 0%</span>
                    {boLocHienTai.ho_tro_tra_gop_0 && <Check className="w-3 h-3 stroke-[3]" />}
                </button>
            </div>
        </div>
    );
}
