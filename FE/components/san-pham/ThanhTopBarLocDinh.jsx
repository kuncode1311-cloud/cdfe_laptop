'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUp, Laptop, Package, Sparkles, SlidersHorizontal } from 'lucide-react';

// Danh sách mã nhóm
const MA_DANH_MUC_LAPTOP = ['ai-pc', 'gaming', 'van-phong-mong-nhe', 'do-hoa-sang-tao'];
const MA_DANH_MUC_PHU_KIEN = ['balo-tui-chong-soc', 'ban-phim-co', 'chuot-lot-chuot', 'tai-nghe-loa', 'sac-cap-hub', 'linh-kien-nang-cap'];

// Danh sách danh mục con Laptop
const DANH_MUC_CON_LAPTOP = [
    { ma: 'ai-pc',              ten: 'Laptop AI',   hinhAnh: '/images/sp/asus_zenbook_oled.jpg' },
    { ma: 'gaming',             ten: 'Gaming RTX',  hinhAnh: '/images/sp/asus_rog_scar18.jpg' },
    { ma: 'van-phong-mong-nhe', ten: 'Mỏng Nhẹ',   hinhAnh: '/images/sp/zenbook_oled.jpg' },
    { ma: 'do-hoa-sang-tao',    ten: 'Đồ Họa 3D',  hinhAnh: '/images/sp/dell_xps_16.jpg' },
];

// Danh sách danh mục con Phụ Kiện
const DANH_MUC_CON_PHU_KIEN = [
    { ma: 'balo-tui-chong-soc', ten: 'Balo & Túi',  hinhAnh: '/images/sp/balo_gaming_rog.jpg' },
    { ma: 'ban-phim-co',        ten: 'Phím Cơ',     hinhAnh: '/images/sp/gaming_keyboard_rgb.jpg' },
    { ma: 'chuot-lot-chuot',    ten: 'Chuột & Pad', hinhAnh: '/images/sp/gaming_mouse_wireless.jpg' },
    { ma: 'tai-nghe-loa',       ten: 'Tai Nghe',    hinhAnh: '/images/sp/tai_nghe_gaming_pro.jpg' },
    { ma: 'sac-cap-hub',        ten: 'Sạc & Hub',   hinhAnh: '/images/sp/cu_sac_gan_140w.jpg' },
    { ma: 'linh-kien-nang-cap', ten: 'Linh Kiện',   hinhAnh: '/images/sp/samsung_990_ssd.jpg' },
];

export default function ThanhTopBarLocDinh({
    boLocHienTai,
    onThayDoiBoLoc,
    danhSachDanhMuc = [],
    daCuonXuong = false,
    onCuonLenDauTrang = () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    onMoBoLocToanDien = () => { },
    soLuongDangLoc = 0,
    tongKetQua = 0
}) {
    const [tabChonThuCong, setTabChonThuCong] = useState(null);

    // Map mã danh mục -> số lượng
    const demCount = useMemo(() => {
        const map = {};
        danhSachDanhMuc.forEach(dm => {
            if (dm.ma) map[dm.ma] = dm.count || 0;
        });
        return map;
    }, [danhSachDanhMuc]);

    const danhMucHienTai = boLocHienTai?.danh_muc || [];

    // Tổng số sản phẩm toàn sàn
    const tongTatCa = useMemo(() => {
        const itemAll = danhSachDanhMuc.find(d => !d.ma);
        return itemAll?.count || 26;
    }, [danhSachDanhMuc]);

    // Tổng số laptop
    const tongLaptop = useMemo(() => {
        return MA_DANH_MUC_LAPTOP.reduce((sum, ma) => sum + (demCount[ma] || 0), 0);
    }, [demCount]);

    // Tổng số phụ kiện
    const tongPhuKien = useMemo(() => {
        return MA_DANH_MUC_PHU_KIEN.reduce((sum, ma) => sum + (demCount[ma] || 0), 0);
    }, [demCount]);

    // Nhận diện tab nào đang active dựa trên bộ lọc
    const tabHienTai = useMemo(() => {
        if (tabChonThuCong) return tabChonThuCong;
        if (danhMucHienTai.length === 0) return 'tat-ca';
        const coLaptop = danhMucHienTai.some(m => MA_DANH_MUC_LAPTOP.includes(m));
        const coPhuKien = danhMucHienTai.some(m => MA_DANH_MUC_PHU_KIEN.includes(m));
        if (coLaptop && !coPhuKien) return 'laptop';
        if (coPhuKien && !coLaptop) return 'phu-kien';
        return 'tat-ca';
    }, [danhMucHienTai, tabChonThuCong]);

    // Kiểm tra trạng thái active của từng nút
    const laToanBoHang = danhMucHienTai.length === 0;
    const laTatCaLaptop = danhMucHienTai.length === MA_DANH_MUC_LAPTOP.length &&
        MA_DANH_MUC_LAPTOP.every(m => danhMucHienTai.includes(m));
    const laTatCaPhuKien = danhMucHienTai.length === MA_DANH_MUC_PHU_KIEN.length &&
        MA_DANH_MUC_PHU_KIEN.every(m => danhMucHienTai.includes(m));

    // Xử lý khi bấm nút Tab bên trái
    const xuLyChonTab = (tabKey) => {
        setTabChonThuCong(tabKey);
        if (tabKey === 'tat-ca') {
            onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [] });
        } else if (tabKey === 'laptop') {
            onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_LAPTOP] });
        } else if (tabKey === 'phu-kien') {
            onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_PHU_KIEN] });
        }
    };

    return (
        <nav
            aria-label="Thanh điều hướng danh mục thông minh"
            className={`fixed top-0 left-0 right-0 z-[120] select-none transition-all duration-300 ease-out shadow-lg shadow-blue-950/20 border-b-2 border-[#003da5] ${
                daCuonXuong
                    ? 'translate-y-0 opacity-100 pointer-events-auto'
                    : '-translate-y-full opacity-0 pointer-events-none'
            }`}
            style={{
                background: 'linear-gradient(90deg, #0052cc 0%, #0047b3 50%, #003da5 100%)'
            }}
        >
            <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1.5 flex items-center justify-between gap-2">

                {/* ===== BÊN TRÁI: 3 TAB CHÍNH (TẤT CẢ / LAPTOP / PHỤ KIỆN) ===== */}
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 bg-white/10 border border-white/20 p-0.5 rounded-xl">
                    {/* Tab Tất Cả */}
                    <button
                        onClick={() => xuLyChonTab('tat-ca')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all duration-150 cursor-pointer ${
                            tabHienTai === 'tat-ca'
                                ? 'bg-white text-[#0052cc] shadow-sm'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-300" />
                        <span>Tất Cả</span>
                    </button>

                    {/* Tab Laptop */}
                    <button
                        onClick={() => xuLyChonTab('laptop')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all duration-150 cursor-pointer ${
                            tabHienTai === 'laptop'
                                ? 'bg-white text-[#0052cc] shadow-sm'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Laptop className="w-3.5 h-3.5 shrink-0" />
                        <span>Laptop</span>
                    </button>

                    {/* Tab Phụ Kiện */}
                    <button
                        onClick={() => xuLyChonTab('phu-kien')}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-black transition-all duration-150 cursor-pointer ${
                            tabHienTai === 'phu-kien'
                                ? 'bg-white text-[#0052cc] shadow-sm'
                                : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <Package className="w-3.5 h-3.5 shrink-0" />
                        <span>Phụ Kiện</span>
                    </button>
                </div>

                {/* ĐƯỜNG PHÂN CÁCH ĐỨNG */}
                <div className="w-px h-7 bg-white/20 shrink-0" />

                {/* ===== Ở GIỮA: CÁC NÚT DANH MỤC GỌN ĐẸP, KHÔNG BỊ CẮT XÉN ===== */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5 px-0.5 flex-1 justify-center">

                    {/* --- 1. KHI ĐANG Ở TAB TẤT CẢ --- */}
                    {tabHienTai === 'tat-ca' && (
                        <>
                            {/* Nút Toàn Bộ Kho */}
                            <button
                                onClick={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [] })}
                                className={`relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border ${
                                    laToanBoHang
                                        ? 'bg-white border-white text-[#0052cc] shadow-md scale-105'
                                        : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                }`}
                                style={{ minWidth: '72px' }}
                            >
                                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                    <Image src="/images/sp/hero-3d-laptop.jpg" alt="Toàn Bộ" fill sizes="24px" className="object-cover" />
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">Toàn Bộ</span>
                                    <span className={`text-[9px] font-black px-1 rounded-full leading-tight ${laToanBoHang ? 'bg-[#0052cc] text-white' : 'bg-white/25 text-white'}`}>
                                        {tongTatCa}
                                    </span>
                                </div>
                            </button>

                            {/* Nút Tất Cả Laptop */}
                            <button
                                onClick={() => {
                                    setTabChonThuCong('laptop');
                                    onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_LAPTOP] });
                                }}
                                className="relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border bg-white/15 border-white/25 text-white hover:bg-white/25 hover:scale-102"
                                style={{ minWidth: '72px' }}
                            >
                                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                    <Image src="/images/sp/asus_zenbook_oled.jpg" alt="Laptop" fill sizes="24px" className="object-cover" />
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">Laptop</span>
                                    <span className="text-[9px] font-black px-1 rounded-full leading-tight bg-white/25 text-white">
                                        {tongLaptop}
                                    </span>
                                </div>
                            </button>

                            {/* Nút Tất Cả Phụ Kiện */}
                            <button
                                onClick={() => {
                                    setTabChonThuCong('phu-kien');
                                    onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_PHU_KIEN] });
                                }}
                                className="relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border bg-white/15 border-white/25 text-white hover:bg-white/25 hover:scale-102"
                                style={{ minWidth: '72px' }}
                            >
                                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                    <Image src="/images/sp/gaming_keyboard_rgb.jpg" alt="Phụ Kiện" fill sizes="24px" className="object-cover" />
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">Phụ Kiện</span>
                                    <span className="text-[9px] font-black px-1 rounded-full leading-tight bg-white/25 text-white">
                                        {tongPhuKien}
                                    </span>
                                </div>
                            </button>
                        </>
                    )}

                    {/* --- 2. KHI ĐANG Ở TAB LAPTOP --- */}
                    {tabHienTai === 'laptop' && (
                        <>
                            {/* Nút Tất Cả Laptop */}
                            <button
                                onClick={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_LAPTOP] })}
                                className={`relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border ${
                                    laTatCaLaptop
                                        ? 'bg-white border-white text-[#0052cc] shadow-md scale-105'
                                        : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                }`}
                                style={{ minWidth: '68px' }}
                            >
                                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                    <Image src="/images/sp/hero-3d-laptop.jpg" alt="Tất Cả" fill sizes="24px" className="object-cover" />
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">Tất Cả</span>
                                    <span className={`text-[9px] font-black px-1 rounded-full leading-tight ${laTatCaLaptop ? 'bg-[#0052cc] text-white' : 'bg-white/25 text-white'}`}>
                                        {tongLaptop}
                                    </span>
                                </div>
                            </button>

                            {/* Các danh mục con của Laptop */}
                            {DANH_MUC_CON_LAPTOP.map((dm) => {
                                const dangChon = danhMucHienTai.length === 1 && danhMucHienTai[0] === dm.ma;
                                const count = demCount[dm.ma] ?? 0;

                                return (
                                    <button
                                        key={dm.ma}
                                        onClick={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [dm.ma] })}
                                        className={`relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border ${
                                            dangChon
                                                ? 'bg-white border-white text-[#0052cc] shadow-md scale-105'
                                                : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                        }`}
                                        style={{ minWidth: '66px' }}
                                    >
                                        <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                            <Image src={dm.hinhAnh} alt={dm.ten} fill sizes="24px" className="object-cover" />
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1">
                                            <span className="text-[11px] font-black leading-tight whitespace-nowrap">{dm.ten}</span>
                                            {count > 0 && (
                                                <span className={`text-[9px] font-black px-1 rounded-full leading-tight ${dangChon ? 'bg-[#0052cc] text-white' : 'bg-white/25 text-white'}`}>
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}

                    {/* --- 3. KHI ĐANG Ở TAB PHỤ KIỆN --- */}
                    {tabHienTai === 'phu-kien' && (
                        <>
                            {/* Nút Tất Cả Phụ Kiện */}
                            <button
                                onClick={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [...MA_DANH_MUC_PHU_KIEN] })}
                                className={`relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border ${
                                    laTatCaPhuKien
                                        ? 'bg-white border-white text-[#0052cc] shadow-md scale-105'
                                        : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                }`}
                                style={{ minWidth: '66px' }}
                            >
                                <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                    <Image src="/images/sp/balo_gaming_rog.jpg" alt="Tất Cả" fill sizes="24px" className="object-cover" />
                                </div>
                                <div className="mt-0.5 flex items-center gap-1">
                                    <span className="text-[11px] font-black leading-tight whitespace-nowrap">Tất Cả</span>
                                    <span className={`text-[9px] font-black px-1 rounded-full leading-tight ${laTatCaPhuKien ? 'bg-[#0052cc] text-white' : 'bg-white/25 text-white'}`}>
                                        {tongPhuKien}
                                    </span>
                                </div>
                            </button>

                            {/* Các danh mục con của Phụ Kiện */}
                            {DANH_MUC_CON_PHU_KIEN.map((dm) => {
                                const dangChon = danhMucHienTai.length === 1 && danhMucHienTai[0] === dm.ma;
                                const count = demCount[dm.ma] ?? 0;

                                return (
                                    <button
                                        key={dm.ma}
                                        onClick={() => onThayDoiBoLoc({ ...boLocHienTai, danh_muc: [dm.ma] })}
                                        className={`relative flex flex-col items-center justify-center pt-1 pb-1 px-2.5 sm:px-3 rounded-xl cursor-pointer shrink-0 transition-all duration-150 border ${
                                            dangChon
                                                ? 'bg-white border-white text-[#0052cc] shadow-md scale-105'
                                                : 'bg-white/15 border-white/25 text-white hover:bg-white/25'
                                        }`}
                                        style={{ minWidth: '64px' }}
                                    >
                                        <div className="relative w-6 h-6 rounded-md overflow-hidden shrink-0 border border-white/30 bg-white/10">
                                            <Image src={dm.hinhAnh} alt={dm.ten} fill sizes="24px" className="object-cover" />
                                        </div>
                                        <div className="mt-0.5 flex items-center gap-1">
                                            <span className="text-[11px] font-black leading-tight whitespace-nowrap">{dm.ten}</span>
                                            {count > 0 && (
                                                <span className={`text-[9px] font-black px-1 rounded-full leading-tight ${dangChon ? 'bg-[#0052cc] text-white' : 'bg-white/25 text-white'}`}>
                                                    {count}
                                                </span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </>
                    )}

                </div>

                {/* ĐƯỜNG PHÂN CÁCH ĐỨNG */}
                <div className="w-px h-7 bg-white/20 shrink-0" />

                {/* ===== BÊN PHẢI: BỘ LỌC + ĐẦU TRANG ===== */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Nút Bộ Lọc Nhanh */}
                    <button
                        onClick={onMoBoLocToanDien}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl cursor-pointer transition-all duration-150 font-black text-xs border shadow-xs ${
                            soLuongDangLoc > 0
                                ? 'bg-white text-[#0052cc] border-white shadow-md'
                                : 'bg-white/15 hover:bg-white text-white hover:text-[#0052cc] border-white/25'
                        }`}
                        title="Mở bảng bộ lọc chi tiết"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span className="hidden md:inline">Bộ lọc</span>
                        {soLuongDangLoc > 0 && (
                            <span className="w-4 h-4 rounded-full bg-[#0052cc] text-white font-black text-[10px] flex items-center justify-center">
                                {soLuongDangLoc}
                            </span>
                        )}
                    </button>

                    {/* Nút Đầu trang */}
                    <button
                        onClick={onCuonLenDauTrang}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl cursor-pointer transition-all duration-150 font-black text-xs bg-white/15 hover:bg-white text-white hover:text-[#0052cc] border border-white/25 shadow-xs hover:scale-105"
                        title="Cuộn lên đầu trang"
                    >
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span className="hidden sm:inline whitespace-nowrap text-[11px]">Đầu trang</span>
                    </button>
                </div>

            </div>
        </nav>
    );
}
