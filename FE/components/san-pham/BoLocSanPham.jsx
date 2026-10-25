'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    RotateCcw, X, SlidersHorizontal, Laptop, Tag, DollarSign,
    ShieldCheck, Search, Package, BadgePercent, Check
} from 'lucide-react';
import { useThongKeBoLoc } from './useThongKeBoLoc';
import { DanhSachTuyChon, KhoiLoc, CongTacGat, BIEU_TUONG_LOC } from './ThanhPhanBoLoc';
import BrandLogo from './BrandLogo';
import { demSoTieuChi, nhanGiaDangChon } from '@/utils/bo-loc';

const ICON_CONG_TAC = { ho_tro_tra_gop_0: ShieldCheck, dang_giam_gia: BadgePercent, con_hang_san: Check };
const MO_TA_CONG_TAC = {
    ho_tro_tra_gop_0: 'Mua trước trả sau, lãi suất 0%',
    dang_giam_gia: 'Sản phẩm có giá khuyến mãi hoặc Flash Sale',
    con_hang_san: 'Ẩn sản phẩm tạm hết hàng'
};

// Màu ô chữ cái đại diện cho thương hiệu (viết đủ class để Tailwind nhận diện)
const MAU_O_HANG = [
    'bg-blue-100 text-blue-700', 'bg-rose-100 text-rose-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700',
    'bg-violet-100 text-violet-700', 'bg-cyan-100 text-cyan-700', 'bg-pink-100 text-pink-700', 'bg-indigo-100 text-indigo-700'
];
const mauOHang = (ten) => MAU_O_HANG[[...String(ten)].reduce((t, c) => t + c.charCodeAt(0), 0) % MAU_O_HANG.length];
const HANG_CO_LOGO = new Set(['acer', 'anker', 'asus', 'dell', 'gigabyte', 'hp', 'kingston', 'keychron', 'lenovo', 'logitech', 'msi', 'razer', 'samsung', 'apple']);

// Gom tên các mục đã chọn thành một dòng ngắn để hiện ngay cả khi khối đang gập
const tomTatDaChon = (tuyChon, daChon) => {
    const ten = tuyChon.filter((x) => daChon.includes(x.ma)).map((x) => x.nhan);
    return ten.length ? ten.join(', ') : '';
};

/**
 * Drawer "Tất cả bộ lọc" (trượt từ phải).
 * - Vẽ qua portal ngay dưới <body> để luôn nằm trên nút chat, Zalo và thanh điều hướng.
 * - Mỗi nhóm là một khối có màu riêng, gập/mở được; chỉ mở sẵn Giá và Thương hiệu cho đỡ rối.
 * - Nhóm cấu hình máy và công tắc đọc từ utils/bo-loc.js nên thêm nhóm mới tự có mặt ở đây.
 */
export default function BoLocSanPhamComponent({
    mo = false,
    onDong = () => { },
    boLocHienTai,
    onThayDoiBoLoc,
    onDatLaiBoLoc,
    tatCaSanPham = [],
    tongKetQua = 0
}) {
    const [tuKhoaHang, setTuKhoaHang] = useState('');
    const [daGan, setDaGan] = useState(false);

    // Portal chỉ chạy được sau khi đã có document (tránh lỗi khi render trên server)
    useEffect(() => { setDaGan(true); }, []);

    // Đóng khi nhấn ESC
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && mo) onDong();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [mo, onDong]);

    // Khóa cuộn trang khi drawer đang mở
    useEffect(() => {
        document.body.style.overflow = mo ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mo]);

    // Thống kê theo DB + theo bộ lọc đang chọn (mục hết hàng tự ẩn)
    const thongKe = useThongKeBoLoc(boLocHienTai, tatCaSanPham);
    const danhSachHang = useMemo(() => {
        const kw = tuKhoaHang.toLowerCase().trim();
        return kw ? thongKe.danhSachHang.filter((h) => h.ten.toLowerCase().includes(kw) || h.ma.includes(kw)) : thongKe.danhSachHang;
    }, [thongKe.danhSachHang, tuKhoaHang]);

    // Bật/tắt một mã trong nhóm chọn nhiều
    const togglePhanTu = (khoa, giaTri) => {
        const hienTai = boLocHienTai[khoa] || [];
        onThayDoiBoLoc({
            ...boLocHienTai,
            [khoa]: hienTai.includes(giaTri) ? hienTai.filter((v) => v !== giaTri) : [...hienTai, giaTri]
        });
    };

    // Nhu cầu / loại phụ kiện chỉ chọn 1 mục: bấm lại để bỏ chọn
    const chonDanhMuc = (ma) => {
        const dangChon = boLocHienTai.danh_muc?.includes(ma);
        onThayDoiBoLoc({ ...boLocHienTai, danh_muc: dangChon ? [] : [ma] });
    };

    const chonGia = (min, max) => {
        const dangChon = boLocHienTai.muc_gia_toi_thieu === min && boLocHienTai.muc_gia_toi_da === max;
        onThayDoiBoLoc({
            ...boLocHienTai,
            muc_gia_toi_thieu: dangChon ? undefined : min,
            muc_gia_toi_da: dangChon ? undefined : max
        });
    };

    if (!mo || !daGan) return null;

    const soTieuChi = demSoTieuChi(boLocHienTai);
    const hangDaChon = boLocHienTai.hang_san_xuat || [];
    const danhMucDaChon = boLocHienTai.danh_muc || [];
    const nhanGia = nhanGiaDangChon(boLocHienTai);
    const nhuCauDaChon = thongKe.nhuCau.filter((x) => danhMucDaChon.includes(x.ma));
    const loaiDaChon = thongKe.loaiSanPham.filter((x) => danhMucDaChon.includes(x.ma));
    const congTacDangBat = thongKe.congTac.filter((t) => t.dangBat);

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end animate-in fade-in duration-200" role="dialog" aria-modal="true" aria-label="Tất cả bộ lọc">
            {/* Nền mờ: bấm để đóng */}
            <div onClick={onDong} className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs" />

            <div className="relative w-full max-w-md sm:max-w-lg h-full bg-slate-50 dark:bg-slate-950 shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                {/* 1. Tiêu đề */}
                <div className="flex items-center justify-between gap-3 px-4 py-3.5 shrink-0 bg-gradient-to-r from-[#0052cc] to-[#0a7cff] text-white">
                    <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                            <SlidersHorizontal className="w-5 h-5" />
                        </span>
                        <div className="min-w-0">
                            <h2 className="text-base font-black uppercase tracking-wide leading-tight">Tất cả bộ lọc</h2>
                            <p className="text-[11px] font-semibold text-white/80 truncate">
                                {soTieuChi > 0 ? `Đang chọn ${soTieuChi} tiêu chí` : 'Chọn tiêu chí để thu hẹp kết quả'}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onDong}
                        title="Đóng bộ lọc"
                        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* 2. Thân cuộn: các khối lọc */}
                <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2.5 scrollbar-thin">
                    {/* Mức giá */}
                    <KhoiLoc
                        tieuDe="Mức giá"
                        Icon={DollarSign}
                        mau="amber"
                        moMacDinh
                        soDaChon={nhanGia ? 1 : 0}
                        ghiChu={nhanGia || 'Tất cả mức giá'}
                        onBoChon={() => onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: undefined, muc_gia_toi_da: undefined })}
                    >
                        <DanhSachTuyChon
                            kieu="luoi"
                            soCot={2}
                            mau="amber"
                            chonMotMuc
                            daChon={thongKe.khoangGia
                                .filter((k) => k.nhanNgan !== null && k.min === boLocHienTai.muc_gia_toi_thieu && k.max === boLocHienTai.muc_gia_toi_da)
                                .map((k) => k.nhan)}
                            onToggle={(nhan) => {
                                const k = thongKe.khoangGia.find((x) => x.nhan === nhan);
                                chonGia(k.min, k.max);
                            }}
                            tuyChon={thongKe.khoangGia.filter((k) => k.nhanNgan !== null).map((k) => ({ ma: k.nhan, nhan: k.nhan, soLuong: k.soLuong }))}
                        />
                    </KhoiLoc>

                    {/* Thương hiệu */}
                    <KhoiLoc
                        tieuDe="Thương hiệu"
                        Icon={Tag}
                        mau="blue"
                        moMacDinh
                        soDaChon={hangDaChon.length}
                        ghiChu={tomTatDaChon(thongKe.danhSachHang.map((h) => ({ ma: h.ma, nhan: h.ten })), hangDaChon) || `${thongKe.danhSachHang.length} thương hiệu`}
                        onBoChon={() => onThayDoiBoLoc({ ...boLocHienTai, hang_san_xuat: [] })}
                    >
                        <div className="relative">
                            <input
                                type="text"
                                value={tuKhoaHang}
                                onChange={(e) => setTuKhoaHang(e.target.value)}
                                placeholder="Tìm nhanh thương hiệu..."
                                className="w-full pl-8 pr-8 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-blue-500"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            {tuKhoaHang && (
                                <button type="button" onClick={() => setTuKhoaHang('')} aria-label="Xóa từ khóa" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 cursor-pointer">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </div>
                        {danhSachHang.length === 0 ? (
                            <div className="text-xs text-slate-400 py-1">Không có thương hiệu phù hợp</div>
                        ) : (
                            <DanhSachTuyChon
                                kieu="luoi"
                                soCot={2}
                                cao="max-h-60"
                                mau="blue"
                                daChon={hangDaChon}
                                onToggle={(ma) => togglePhanTu('hang_san_xuat', ma)}
                                tuyChon={danhSachHang.map((h) => ({
                                    ma: h.ma,
                                    nhan: h.ten,
                                    soLuong: h.soLuong,
                                    anNhan: HANG_CO_LOGO.has(String(h.ma).toLowerCase())
                                }))}
                                renderTruoc={(x, dangChon) => HANG_CO_LOGO.has(String(x.ma).toLowerCase()) ? (
                                    <span className="w-14 h-6 flex items-center justify-start shrink-0 overflow-hidden [&>span]:block [&>span]:max-w-full [&>span]:overflow-hidden [&>span]:text-ellipsis [&>span]:whitespace-nowrap [&>div]:max-w-full [&>div]:overflow-hidden [&>div_span]:whitespace-nowrap" aria-hidden="true">
                                        <BrandLogo brand={x.ma} className={`max-w-14 h-4 ${dangChon ? 'text-blue-700' : 'text-slate-700'}`} active={dangChon} />
                                    </span>
                                ) : (
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0 ${mauOHang(x.nhan)}`}>
                                        {String(x.nhan).charAt(0).toUpperCase()}
                                    </span>
                                )}
                            />
                        )}
                    </KhoiLoc>

                    {/* Laptop theo nhu cầu (DB: nhu_cau) */}
                    {thongKe.nhuCau.length > 0 && (
                        <KhoiLoc
                            tieuDe="Laptop theo nhu cầu"
                            Icon={Laptop}
                            mau="purple"
                            soDaChon={nhuCauDaChon.length}
                            ghiChu={nhuCauDaChon.map((x) => x.ten).join(', ') || `${thongKe.nhuCau.length} nhóm`}
                            onBoChon={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [] })}
                        >
                            <DanhSachTuyChon
                                kieu="luoi"
                                mau="purple"
                                chonMotMuc
                                daChon={danhMucDaChon}
                                onToggle={chonDanhMuc}
                                tuyChon={thongKe.nhuCau.map((x) => ({ ma: x.ma, nhan: x.ten, soLuong: x.soLuong }))}
                            />
                        </KhoiLoc>
                    )}

                    {/* Phụ kiện & linh kiện (DB: loai_san_pham) */}
                    {thongKe.loaiSanPham.length > 0 && (
                        <KhoiLoc
                            tieuDe="Phụ kiện & linh kiện"
                            Icon={Package}
                            mau="teal"
                            soDaChon={loaiDaChon.length}
                            ghiChu={loaiDaChon.map((x) => x.ten).join(', ') || `${thongKe.loaiSanPham.length} loại`}
                            onBoChon={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [] })}
                        >
                            <DanhSachTuyChon
                                kieu="luoi"
                                mau="teal"
                                chonMotMuc
                                daChon={danhMucDaChon}
                                onToggle={chonDanhMuc}
                                tuyChon={thongKe.loaiSanPham.map((x) => ({ ma: x.ma, nhan: x.ten, soLuong: x.soLuong }))}
                            />
                        </KhoiLoc>
                    )}

                    {/* Cấu hình máy: CPU, RAM, ổ cứng, card, màn hình, tần số quét, tấm nền (chỉ hiện nhóm còn sản phẩm) */}
                    {thongKe.nhomMay.map((nhom) => {
                        const daChon = boLocHienTai[nhom.khoa] || [];
                        return (
                            <KhoiLoc
                                key={nhom.khoa}
                                tieuDe={nhom.nhan}
                                Icon={BIEU_TUONG_LOC[nhom.bieuTuong]}
                                mau={nhom.mau}
                                soDaChon={daChon.length}
                                ghiChu={tomTatDaChon(nhom.tuyChon, daChon) || `${nhom.tuyChon.length} lựa chọn`}
                                onBoChon={() => onThayDoiBoLoc({ ...boLocHienTai, [nhom.khoa]: [] })}
                            >
                                <DanhSachTuyChon
                                    kieu="luoi"
                                    soCot={nhom.tuyChon.length > 4 ? 3 : 2}
                                    mau={nhom.mau}
                                    daChon={daChon}
                                    onToggle={(ma) => togglePhanTu(nhom.khoa, ma)}
                                    tuyChon={nhom.tuyChon}
                                />
                            </KhoiLoc>
                        );
                    })}

                    {/* Ưu đãi & tình trạng */}
                    {thongKe.congTac.length > 0 && (
                        <KhoiLoc
                            tieuDe="Ưu đãi & tình trạng"
                            Icon={BadgePercent}
                            mau="emerald"
                            soDaChon={congTacDangBat.length}
                            ghiChu={congTacDangBat.map((t) => t.nhan).join(', ') || 'Trả góp, giảm giá, còn hàng'}
                        >
                            <div className="space-y-2">
                                {thongKe.congTac.map((t) => (
                                    <CongTacGat
                                        key={t.khoa}
                                        nhan={t.nhanDai}
                                        moTa={MO_TA_CONG_TAC[t.khoa]}
                                        soLuong={t.soLuong}
                                        dangBat={t.dangBat}
                                        Icon={ICON_CONG_TAC[t.khoa]}
                                        onDoi={() => onThayDoiBoLoc({ ...boLocHienTai, [t.khoa]: !t.dangBat })}
                                    />
                                ))}
                            </div>
                        </KhoiLoc>
                    )}
                </div>

                {/* 3. Chân drawer: thiết lập lại + xem kết quả */}
                <div className="p-3.5 border-t-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={onDatLaiBoLoc}
                        disabled={soTieuChi === 0}
                        className="h-11 px-4 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-red-400 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Thiết lập lại</span>
                    </button>

                    <button
                        type="button"
                        onClick={onDong}
                        className="flex-1 h-11 px-4 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#0a7cff] hover:from-[#003da5] hover:to-[#0052cc] text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98]"
                    >
                        <span>Xem {tongKetQua} sản phẩm</span>
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
