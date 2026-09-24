'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    ChevronRight,
    GitCompare,
    Trash2,
    Plus,
    ShoppingCart,
    Star,
    ShieldCheck,
    Gift,
    Cpu,
    Zap,
    HardDrive,
    Monitor,
    BatteryCharging,
    Radio,
    Sparkles,
    Check,
    X,
    Filter,
    ArrowUpDown
} from 'lucide-react';
import { useSoSanh, layLoaiSanPham, layTenLoaiSanPham, coTheSoSanh } from '@/contexts/CompareContext';
import { useGioHang } from '@/contexts/CartContext';
import { SanPhamService } from '@/services/san-pham.service';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { slugSanPham } from '@/utils/taoSlug';

export default function TrangSoSanh() {
    const {
        danh_sach_so_sanh,
        xoaKhoiSoSanh,
        xoaTatCaSoSanh,
        themVaoSoSanh,
        moModalChonThem,
        setMoModalChonThem
    } = useSoSanh();
    const { themVaoGioHang } = useGioHang();

    const [chiXemDiemKhacBiet, setChiXemDiemKhacBiet] = useState(false);
    const [tatCaSanPham, setTatCaSanPham] = useState([]);

    // Lọc sạch 100%: Tuyệt đối không cho phép Balo/Túi chống sốc xuất hiện, chỉ giữ các sản phẩm CÙNG LOẠI
    const danhSachChuan = useMemo(() => {
        const danhSachCoThe = (danh_sach_so_sanh || []).filter(sp => coTheSoSanh(sp));
        if (danhSachCoThe.length === 0) return [];
        const loaiDau = layLoaiSanPham(danhSachCoThe[0]);
        return danhSachCoThe.filter(sp => layLoaiSanPham(sp) === loaiDau);
    }, [danh_sach_so_sanh]);

    // Tự động phát hiện phân loại sản phẩm đang đối chiếu
    const loaiHienTai = danhSachChuan.length > 0 ? layLoaiSanPham(danhSachChuan[0]) : 'laptop';
    const tenLoaiHienTai = layTenLoaiSanPham(loaiHienTai);

    useEffect(() => {
        let daHuy = false;
        SanPhamService.layTatCaSanPhamAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                setTatCaSanPham(data);
            }
        });
        return () => { daHuy = true; };
    }, []);

    // Định nghĩa bảng tiêu chí kỹ thuật chuẩn xác theo từng loại sản phẩm
    const cacNhomTieuChi = useMemo(() => {
        // 1. Nếu đang so sánh CHUỘT GAMING
        if (loaiHienTai === 'chuot') {
            return [
                {
                    id: 'tong_quan_chuot',
                    tenNhom: 'ĐIỂM NỔI BẬT & CẢM BIẾN (DPI)',
                    icon: Zap,
                    mauSac: {
                        headerBg: 'bg-blue-500/10 dark:bg-blue-950/40 text-[#0052cc] dark:text-cyan-400 border-blue-300 dark:border-blue-800',
                        badge: 'bg-blue-100 dark:bg-blue-900/60 text-[#0052cc] dark:text-cyan-300'
                    },
                    hangs: [
                        { ten: 'Thương hiệu / Hãng', trichXuat: (sp) => (sp.hang_san_xuat || 'Chính hãng').toUpperCase(), noiBat: true },
                        { ten: 'Mức giá khuyến mãi', trichXuat: (sp) => dinhDangTienVND(sp.gia_khuyen_mai), laGia: true, noiBat: true },
                        { ten: 'Mắt đọc cảm biến', trichXuat: (sp) => sp.thong_so?.mat_doc_cam_bien || sp.thong_so?.cpu || 'PAW3395 / Focus Pro 30K Optical Sensor', noiBat: true },
                        { ten: 'Độ phân giải tối đa (DPI)', trichXuat: (sp) => sp.thong_so?.do_phan_giai_dpi || sp.thong_so?.card_do_hoa || 'Lên tới 26.000 - 35.000 DPI tùy chỉnh', noiBat: true },
                        { ten: 'Tốc độ theo dõi (IPS) & Gia tốc', trichXuat: (sp) => sp.thong_so?.toc_do_ips_gia_toc || '650 - 750 IPS / 50G - 70G Max Acceleration' }
                    ]
                },
                {
                    id: 'ket_noi_pin_chuot',
                    tenNhom: 'KẾT NỐI, POLLING RATE & PIN',
                    icon: BatteryCharging,
                    mauSac: {
                        headerBg: 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
                        badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                    },
                    hangs: [
                        { ten: 'Công nghệ kết nối', trichXuat: (sp) => sp.thong_so?.ket_noi || sp.thong_so?.chuan_wifi_bluetooth || 'Không dây 2.4GHz Wireless & Bluetooth 5.3 & Type-C', noiBat: true },
                        { ten: 'Tần số phản hồi (Polling Rate)', trichXuat: (sp) => sp.thong_so?.polling_rate || sp.thong_so?.ram || '1000Hz - 8000Hz (Độ trễ siêu thấp 0.125ms)', noiBat: true },
                        { ten: 'Thời lượng sử dụng Pin', trichXuat: (sp) => sp.thong_so?.dung_luong_pin || 'Lên tới 80 - 100 giờ liên tục', noiBat: true },
                        { ten: 'Cổng sạc & Dây cáp', trichXuat: (sp) => 'Type-C bọc dù siêu mềm Paracord' }
                    ]
                },
                {
                    id: 'thiet_ke_chuot',
                    tenNhom: 'TRỌNG LƯỢNG, SWITCH & BẢO HÀNH',
                    icon: ShieldCheck,
                    mauSac: {
                        headerBg: 'bg-purple-500/10 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800',
                        badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                    },
                    hangs: [
                        { ten: 'Trọng lượng siêu nhẹ', trichXuat: (sp) => sp.thong_so?.trong_luong ? `${sp.thong_so.trong_luong * 1000} gram` : '49 - 59 gram siêu nhẹ', noiBat: true },
                        { ten: 'Loại Switch chuột', trichXuat: (sp) => 'Optical Switch độ bền 90 triệu lần bấm, không double click' },
                        { ten: 'Form dáng thiết kế', trichXuat: (sp) => 'Công thái học đối xứng chuẩn eSports' },
                        { ten: 'Bảo hành chính hãng', trichXuat: (sp) => sp.thong_so?.che_do_bao_hanh || '24 tháng chính hãng 1 đổi 1 tại TNTP', noiBat: true }
                    ]
                }
            ];
        }

        // 2. Mặc định dành cho LAPTOP (Chuẩn chi tiết đầy đủ 100%)
        return [
            {
                id: 'tong_quan',
                tenNhom: 'SO SÁNH NHANH (TỔNG QUAN)',
                icon: Sparkles,
                mauSac: {
                    headerBg: 'bg-amber-500/10 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800',
                    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300'
                },
                hangs: [
                    {
                        ten: 'Thương hiệu / Hãng',
                        trichXuat: (sp) => sp.hang_san_xuat ? sp.hang_san_xuat.toUpperCase() : 'Chính hãng',
                        noiBat: true
                    },
                    {
                        ten: 'Mức giá khuyến mãi',
                        trichXuat: (sp) => dinhDangTienVND(sp.gia_khuyen_mai),
                        laGia: true,
                        noiBat: true
                    },
                    {
                        ten: 'Mức giảm giá',
                        trichXuat: (sp) => sp.phan_tram_giam_gia > 0 ? `Giảm ${sp.phan_tram_giam_gia}% (${dinhDangTienVND(sp.gia_goc - sp.gia_khuyen_mai)})` : 'Giá niêm yết'
                    },
                    {
                        ten: 'Đánh giá & Lượt bán',
                        trichXuat: (sp) => `⭐ ${sp.diem_danh_gia_tb?.toFixed(1) || '—'} (${sp.so_luong_danh_gia || 0} nhận xét)`
                    }
                ]
            },
            {
                id: 'cpu',
                tenNhom: 'BỘ XỬ LÝ (CPU)',
                icon: Cpu,
                mauSac: {
                    headerBg: 'bg-blue-500/10 dark:bg-blue-950/40 text-[#0052cc] dark:text-cyan-400 border-blue-300 dark:border-blue-800',
                    badge: 'bg-blue-100 dark:bg-blue-900/60 text-[#0052cc] dark:text-cyan-300'
                },
                hangs: [
                    {
                        ten: 'Công nghệ CPU',
                        trichXuat: (sp) => sp.thong_so?.cpu || 'Đang cập nhật',
                        noiBat: true
                    },
                    {
                        ten: 'Số nhân & Số luồng',
                        trichXuat: (sp) => sp.thong_so?.so_nhan_luong || 'Theo kiến trúc CPU'
                    },
                    {
                        ten: 'Tốc độ xung nhịp tối đa',
                        trichXuat: (sp) => sp.thong_so?.xung_nhip_toi_da || 'Tự động ép xung Turbo Boost'
                    },
                    {
                        ten: 'Bộ nhớ đệm (Cache)',
                        trichXuat: (sp) => sp.thong_so?.bo_nho_dem_cache || 'Smart Cache thế hệ mới'
                    }
                ]
            },
            {
                id: 'gpu',
                tenNhom: 'CARD ĐỒ HỌA & XỬ LÝ AI (GPU / NPU)',
                icon: Zap,
                mauSac: {
                    headerBg: 'bg-purple-500/10 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-300 dark:border-purple-800',
                    badge: 'bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300'
                },
                hangs: [
                    {
                        ten: 'Card đồ họa rời (GPU)',
                        trichXuat: (sp) => sp.thong_so?.card_do_hoa || 'GPU tích hợp tiết kiệm điện',
                        noiBat: true
                    },
                    {
                        ten: 'Dung lượng bộ nhớ VRAM',
                        trichXuat: (sp) => sp.thong_so?.dung_luong_vram || (sp.thong_so?.card_do_hoa?.includes('RTX') ? '6GB - 16GB GDDR6' : 'Chia sẻ cùng RAM')
                    },
                    {
                        ten: 'Công suất đồ họa TGP',
                        trichXuat: (sp) => sp.thong_so?.cong_suat_tgp ? `${sp.thong_so.cong_suat_tgp}W Max TGP` : 'Tự động điều chỉnh điện năng'
                    },
                    {
                        ten: 'Chip AI NPU & Hiệu năng TOPS',
                        trichXuat: (sp) => sp.thong_so?.chip_ai_npu || (sp.thong_so?.hieu_nang_ai_tops ? `${sp.thong_so.hieu_nang_ai_tops} TOPS AI Boost` : 'Hỗ trợ phần mềm AI'),
                        noiBat: true
                    }
                ]
            },
            {
                id: 'ram_o_cung',
                tenNhom: 'BỘ NHỚ RAM & Ổ CỨNG LƯU TRỮ',
                icon: HardDrive,
                mauSac: {
                    headerBg: 'bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
                    badge: 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                },
                hangs: [
                    {
                        ten: 'Dung lượng RAM',
                        trichXuat: (sp) => sp.thong_so?.ram || '16 GB',
                        noiBat: true
                    },
                    {
                        ten: 'Chuẩn RAM & Tốc độ Bus',
                        trichXuat: (sp) => sp.thong_so?.loai_ram || (sp.thong_so?.toc_do_bus ? `${sp.thong_so.toc_do_bus} MHz` : 'LPDDR5X / DDR5 tốc độ cao')
                    },
                    {
                        ten: 'Khả năng nâng cấp RAM',
                        trichXuat: (sp) => sp.thong_so?.nang_cap_ram_toi_da || 'Hỗ trợ nâng cấp tối đa 64GB'
                    },
                    {
                        ten: 'Ổ cứng SSD',
                        trichXuat: (sp) => sp.thong_so?.o_cung || '512 GB SSD NVMe PCIe',
                        noiBat: true
                    },
                    {
                        ten: 'Số khe cắm SSD mở rộng',
                        trichXuat: (sp) => sp.thong_so?.khe_cam_mo_rong || 'Hỗ trợ thêm 1 khe M.2 NVMe'
                    }
                ]
            },
            {
                id: 'man_hinh',
                tenNhom: 'MÀN HÌNH & HIỂN THỊ HÌNH ẢNH',
                icon: Monitor,
                mauSac: {
                    headerBg: 'bg-sky-500/10 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-300 dark:border-sky-800',
                    badge: 'bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300'
                },
                hangs: [
                    {
                        ten: 'Kích thước màn hình',
                        trichXuat: (sp) => sp.thong_so?.man_hinh || '15.6 inch',
                        noiBat: true
                    },
                    {
                        ten: 'Độ phân giải',
                        trichXuat: (sp) => sp.thong_so?.do_phan_giai || (sp.thong_so?.man_hinh?.includes('OLED') ? '3K OLED' : 'FHD / 2.5K'),
                        noiBat: true
                    },
                    {
                        ten: 'Tần số quét',
                        trichXuat: (sp) => sp.thong_so?.tan_so_quet ? `${sp.thong_so.tan_so_quet} Hz` : (sp.thong_so?.man_hinh?.includes('240Hz') ? '240 Hz' : '120Hz - 165Hz'),
                        noiBat: true
                    },
                    {
                        ten: 'Tấm nền & Độ phủ màu',
                        trichXuat: (sp) => sp.thong_so?.tam_nen || sp.thong_so?.do_phu_mau || '100% sRGB / DCI-P3 chuẩn đồ họa'
                    },
                    {
                        ten: 'Độ sáng tối đa',
                        trichXuat: (sp) => sp.thong_so?.do_sang_nits ? `${sp.thong_so.do_sang_nits} nits` : '400 - 500 nits chống chói'
                    }
                ]
            },
            {
                id: 'pin_kich_thuoc',
                tenNhom: 'PIN, KÍCH THƯỚC & TẢN NHIỆT',
                icon: BatteryCharging,
                mauSac: {
                    headerBg: 'bg-amber-600/10 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800',
                    badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300'
                },
                hangs: [
                    {
                        ten: 'Trọng lượng máy',
                        trichXuat: (sp) => sp.thong_so?.trong_luong ? `${sp.thong_so.trong_luong} kg` : '1.39 - 2.2 kg',
                        noiBat: true
                    },
                    {
                        ten: 'Dung lượng Pin',
                        trichXuat: (sp) => sp.thong_so?.dung_luong_pin || '70 - 90 Wh (Dùng 6-10 tiếng)'
                    },
                    {
                        ten: 'Công nghệ tản nhiệt',
                        trichXuat: (sp) => sp.thong_so?.he_thong_tan_nhiet || '2 quạt đồng + 4 ống dẫn nhiệt đối lưu'
                    },
                    {
                        ten: 'Chất liệu thân vỏ',
                        trichXuat: (sp) => sp.thong_so?.chat_lieu_vo || 'Hợp kim nhôm nguyên khối cao cấp'
                    }
                ]
            },
            {
                id: 'ket_noi_bao_hanh',
                tenNhom: 'KẾT NỐI, BÀN PHÍM & BẢO HÀNH',
                icon: Radio,
                mauSac: {
                    headerBg: 'bg-indigo-500/10 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-300 dark:border-indigo-800',
                    badge: 'bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300'
                },
                hangs: [
                    {
                        ten: 'Hệ điều hành',
                        trichXuat: (sp) => sp.thong_so?.he_dieu_hanh || 'Windows 11 Home bản quyền trọn đời'
                    },
                    {
                        ten: 'Cổng giao tiếp ngoại vi',
                        trichXuat: (sp) => Array.isArray(sp.thong_so?.cong_ket_noi) ? sp.thong_so.cong_ket_noi.join(' • ') : (sp.thong_so?.cong_ket_noi || 'Thunderbolt 4, USB-C, USB-A, HDMI 2.1')
                    },
                    {
                        ten: 'Bàn phím & Đèn nền',
                        trichXuat: (sp) => sp.thong_so?.ban_phim || 'Bàn phím LED RGB từng phím / Đèn nền trắng'
                    },
                    {
                        ten: 'Bảo hành chính hãng',
                        trichXuat: (sp) => sp.thong_so?.che_do_bao_hanh || '24 tháng chính hãng tại TNTP LAPTOP',
                        noiBat: true
                    }
                ]
            }
        ];
    }, []);

    // Kiểm tra hàng có sự khác biệt giữa các sản phẩm không
    const kiemTraHangKhacBiet = (hang) => {
        if (!danhSachChuan || danhSachChuan.length < 2) return false;
        const cacGiaTri = danhSachChuan.map((sp) => (hang.trichXuat(sp) || '').toString().trim().toLowerCase());
        return new Set(cacGiaTri).size > 1;
    };

    // Số lượng ô trống cần bổ sung để đủ 3 cột
    const soLuongTrong = Math.max(0, 3 - danhSachChuan.length);

    return (
        <div className="space-y-6 sm:space-y-8 pb-16">
            {/* 1. BREADCRUMB */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <Link href="/san-pham" className="hover:text-slate-900 dark:hover:text-white transition-colors">
                    <span>Laptop</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-slate-900 dark:text-white">So Sánh Chi Tiết</span>
            </nav>

            {/* 2. HEADER KHU VỰC SO SÁNH CHUẨN THẾ GIỚI DI ĐỘNG (media_1789284091198.png) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs">
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-2xl bg-blue-50 dark:bg-blue-950/80 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center shadow-xs">
                            <GitCompare className="w-5 h-5" />
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            So Sánh Chi Tiết {tenLoaiHienTai}
                        </h1>
                    </div>

                    {/* Dòng tên các máy đang so sánh */}
                    {danhSachChuan.length > 0 ? (
                        <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 flex-wrap">
                            {danhSachChuan.map((sp, idx) => (
                                <React.Fragment key={sp.id}>
                                    <span className="font-black text-[#0052cc] dark:text-cyan-400">
                                        {sp.ten_san_pham}
                                    </span>
                                    {idx < danhSachChuan.length - 1 && (
                                        <span className="text-slate-400 font-black px-1">&</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </p>
                    ) : (
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                            Chọn tối đa 3 mẫu {tenLoaiHienTai.toLowerCase()} để đối chiếu thông số và giá bán
                        </p>
                    )}

                    {/* Nút Toggle: Chỉ xem điểm khác biệt (Chuẩn TGDD media_1789284091198.png) */}
                    {danhSachChuan.length >= 2 && (
                        <div className="pt-2">
                            <label className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer select-none text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-blue-400 transition-all">
                                <input
                                    type="checkbox"
                                    checked={chiXemDiemKhacBiet}
                                    onChange={(e) => setChiXemDiemKhacBiet(e.target.checked)}
                                    className="w-4 h-4 rounded text-[#0052cc] focus:ring-[#0052cc] cursor-pointer"
                                />
                                <span className="flex items-center gap-1.5">
                                    <Filter className="w-3.5 h-3.5 text-[#0052cc] dark:text-cyan-400" />
                                    <span>Chỉ xem điểm khác biệt</span>
                                </span>
                                {chiXemDiemKhacBiet && (
                                    <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-[#0052cc] text-[10px] font-black">
                                        Đang lọc
                                    </span>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                {/* Các nút hành động */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        type="button"
                        onClick={() => setMoModalChonThem(true)}
                        className="px-4 py-2.5 rounded-2xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-blue-500/25 transition-all cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Thêm máy so sánh</span>
                    </button>

                    {danhSachChuan.length > 0 && (
                        <button
                            type="button"
                            onClick={xoaTatCaSoSanh}
                            className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 border border-slate-200 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                            title="Xóa tất cả sản phẩm"
                        >
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Xóa hết</span>
                        </button>
                    )}
                </div>
            </div>

            {/* 3. NẾU CHƯA CHỌN SẢN PHẨM NÀO */}
            {danhSachChuan.length === 0 ? (
                <div className="p-12 sm:p-16 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
                    <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/80 text-[#0052cc] dark:text-cyan-400 mx-auto flex items-center justify-center shadow-inner">
                        <GitCompare className="w-10 h-10" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-black text-slate-900 dark:text-white">
                            Chưa có sản phẩm nào trong danh sách so sánh
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                            Nhấn nút <span className="font-bold text-[#0052cc]">+ So sánh</span> ở bất kỳ card sản phẩm nào hoặc bấm nút bên dưới để chọn nhanh.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMoModalChonThem(true)}
                        className="px-6 py-3 rounded-2xl bg-[#0052cc] hover:bg-[#003da5] text-white font-black text-sm shadow-md transition-all cursor-pointer"
                    >
                        Chọn Sản Phẩm Để So Sánh Ngay
                    </button>
                </div>
            ) : (
                /* 4. KHU VỰC BẢNG SO SÁNH ĐỐI CHIẾU THÔNG MINH */
                <div className="space-y-6">
                    {/* HÀNG HEADER CÁC CỘT SẢN PHẨM (Side-by-side cards) */}
                    <div className="overflow-x-auto pb-2 scrollbar-thin">
                        <div className="min-w-[760px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6">
                            <div className="grid grid-cols-12 gap-4 items-stretch">
                                {/* Cột 0: Thẻ đối chiếu cấu hình chuẩn xịn, lấp đầy không gian */}
                                <div className="col-span-3 rounded-2xl bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-slate-50 dark:from-slate-800/90 dark:via-slate-900/90 dark:to-blue-950/40 border border-blue-200/80 dark:border-blue-900/50 p-4 sm:p-5 flex flex-col justify-between shadow-2xs">
                                    {/* Phần trên: Badge & Tiêu đề nổi bật */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0052cc] text-white text-[10.5px] font-black uppercase tracking-wide shadow-xs">
                                                <GitCompare className="w-3.5 h-3.5 text-cyan-300" />
                                                <span>So găng trực diện</span>
                                            </span>
                                            <span className="text-[11px] font-black text-[#0052cc] dark:text-cyan-400 bg-white/90 dark:bg-slate-800/90 px-2 py-0.5 rounded-md border border-blue-200/70 dark:border-blue-800/60 shadow-2xs">
                                                {danhSachChuan.length}/3 máy
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-snug">
                                                Đối Chiếu Cấu Hình
                                            </h3>
                                            <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                So sánh chi tiết thông số linh kiện phần cứng & giá bán
                                            </p>
                                        </div>

                                        {/* Danh sách 4 điểm nhấn đối chiếu nổi bật */}
                                        <div className="space-y-2 pt-1 border-t border-blue-100 dark:border-slate-800/80">
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center shrink-0">
                                                    <Cpu className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">CPU, Xung nhịp & Card đồ họa</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                                    <Zap className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">RAM DDR5 & Ổ cứng SSD PCIe</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                                    <Monitor className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">Màn hình, Tần số quét & Chuẩn màu</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                <div className="w-6 h-6 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                                                    <BatteryCharging className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">Pin, Trọng lượng & Tản nhiệt</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phần dưới: Nút thao tác nhanh hoặc Tip hướng dẫn */}
                                    <div className="pt-3 mt-3 border-t border-blue-100 dark:border-slate-800/80 space-y-2">
                                        {danhSachChuan.length < 3 ? (
                                            <button
                                                type="button"
                                                onClick={() => setMoModalChonThem(true)}
                                                className="w-full py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[#0052cc] dark:text-cyan-400 font-bold text-xs border border-blue-200 dark:border-slate-700 flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                <span>Thêm máy thứ {danhSachChuan.length + 1}</span>
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold">
                                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                <span>Đã chọn đủ 3 máy đối chiếu</span>
                                            </div>
                                        )}
                                        <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight flex items-start gap-1">
                                            <span className="text-amber-500 font-black shrink-0">💡</span>
                                            <span>Cuộn xuống bên dưới để tra cứu chi tiết từng thông số kỹ thuật</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Cột 1..N: Từng sản phẩm */}
                                <div className="col-span-9 grid grid-cols-3 gap-4">
                                    {danhSachChuan.map((sp) => (
                                        <div
                                            key={sp.id}
                                            className="relative rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 group hover:border-[#0052cc] transition-colors shadow-2xs"
                                        >
                                            {/* Nút Xóa Khỏi So Sánh */}
                                            <button
                                                type="button"
                                                onClick={() => xoaKhoiSoSanh(sp.id)}
                                                className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors cursor-pointer z-10"
                                                title="Xóa máy này"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>

                                            {/* Huy hiệu ưu đãi */}
                                            <div className="pr-6">
                                                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-black">
                                                    Trả chậm 0% trả trước 0đ
                                                </span>
                                            </div>

                                            {/* Ảnh Sản Phẩm */}
                                            <div className="relative w-full aspect-[16/10] bg-white dark:bg-slate-800/40 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                                                <Image
                                                    src={sp.hinh_anh_chinh}
                                                    alt={sp.ten_san_pham}
                                                    fill
                                                    className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                                                    unoptimized
                                                />
                                            </div>

                                            {/* Tên & Link */}
                                            <Link href={`/san-pham/${slugSanPham(sp)}`} className="block">
                                                <h3 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white line-clamp-2 group-hover:text-[#0052cc] dark:group-hover:text-cyan-400 transition-colors" title={sp.ten_san_pham}>
                                                    {sp.ten_san_pham}
                                                </h3>
                                            </Link>

                                            {/* Giá Khuyến Mãi & Giá Cũ */}
                                            <div className="space-y-0.5">
                                                <div className="text-base sm:text-lg font-black text-[#EA1E2C]">
                                                    {dinhDangTienVND(sp.gia_khuyen_mai)}
                                                </div>
                                                {sp.gia_goc > sp.gia_khuyen_mai && (
                                                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                                        <span className="line-through">{dinhDangTienVND(sp.gia_goc)}</span>
                                                        <span className="font-bold text-[#EA1E2C]">-{sp.phan_tram_giam_gia}%</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nút Thêm Giỏ Hàng */}
                                            <button
                                                type="button"
                                                onClick={() => themVaoGioHang(sp)}
                                                className="w-full py-2 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                                            >
                                                <ShoppingCart className="w-3.5 h-3.5" />
                                                <span>Thêm vào giỏ</span>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Các Ô Trống Còn Lại Cho Đủ 3 Cột */}
                                    {Array.from({ length: soLuongTrong }).map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setMoModalChonThem(true)}
                                            className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0052cc] dark:hover:border-cyan-400 p-4 flex flex-col items-center justify-center text-slate-400 hover:text-[#0052cc] dark:hover:text-cyan-400 transition-all cursor-pointer group min-h-[260px]"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-cyan-950 flex items-center justify-center transition-colors mb-2">
                                                <Plus className="w-6 h-6 text-slate-400 group-hover:text-[#0052cc] dark:group-hover:text-cyan-400" />
                                            </div>
                                            <span className="text-xs sm:text-sm font-bold">
                                                + Thêm sản phẩm
                                            </span>
                                            <span className="text-[11px] text-slate-400 mt-1">
                                                Để đối chiếu 2 hoặc 3 bên
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* BẢNG ĐỐI CHIẾU CHI TIẾT TỪNG PHÂN VÙNG MÀU SẮC & BORDER KẺ XỊN */}
                    <div className="overflow-x-auto pb-4 scrollbar-thin">
                        <div className="min-w-[760px] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
                            {cacNhomTieuChi.map((nhom) => {
                                const NhomIcon = nhom.icon;
                                // Lọc các hàng nếu bật "Chỉ xem điểm khác biệt"
                                const cacHangHienThi = chiXemDiemKhacBiet
                                    ? nhom.hangs.filter((hang) => kiemTraHangKhacBiet(hang))
                                    : nhom.hangs;

                                if (cacHangHienThi.length === 0) return null;

                                return (
                                    <div key={nhom.id} className="border-b border-slate-200 dark:border-slate-800 last:border-b-0">
                                        {/* Tiêu đề phân nhóm rực rỡ sắc nét */}
                                        <div className={`px-5 py-3 border-y border-slate-200/80 dark:border-slate-800 flex items-center justify-between ${nhom.mauSac.headerBg}`}>
                                            <div className="flex items-center gap-2">
                                                <NhomIcon className="w-4 h-4" />
                                                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider">
                                                    {nhom.tenNhom}
                                                </h4>
                                            </div>
                                            <span className="text-[11px] font-bold opacity-75">
                                                {cacHangHienThi.length} Tiêu chí
                                            </span>
                                        </div>

                                        {/* Bảng dữ liệu của nhóm */}
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                                            {cacHangHienThi.map((hang, hIdx) => {
                                                const coKhacBiet = kiemTraHangKhacBiet(hang);
                                                return (
                                                    <div
                                                        key={hIdx}
                                                        className={`grid grid-cols-12 items-center transition-colors ${
                                                            coKhacBiet
                                                                ? 'bg-blue-50/40 dark:bg-slate-800/40 hover:bg-blue-50/70 dark:hover:bg-slate-800/70'
                                                                : hIdx % 2 === 0
                                                                ? 'bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                                                                : 'bg-slate-50/40 dark:bg-slate-900/40 hover:bg-slate-50/70 dark:hover:bg-slate-800/30'
                                                        }`}
                                                    >
                                                        {/* Cột Tên Tiêu Chí (Cột 0) */}
                                                        <div className="col-span-3 p-3.5 sm:p-4 border-r border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-1">
                                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                                                {hang.ten}
                                                            </span>
                                                            {coKhacBiet && (
                                                                <span className="px-1.5 py-0.5 rounded text-[9.5px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 shrink-0">
                                                                    Khác biệt
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Cột Dữ Liệu 3 Sản Phẩm (Cột 1, 2, 3) */}
                                                        <div className="col-span-9 grid grid-cols-3 divide-x divide-slate-200/80 dark:divide-slate-800">
                                                            {danhSachChuan.map((sp) => {
                                                                const giaTri = hang.trichXuat(sp);
                                                                return (
                                                                    <div
                                                                        key={sp.id}
                                                                        className={`p-3.5 sm:p-4 text-xs ${
                                                                            hang.laGia
                                                                                ? 'font-black text-[#EA1E2C] text-sm'
                                                                                : hang.noiBat
                                                                                ? 'font-bold text-slate-900 dark:text-white'
                                                                                : 'font-medium text-slate-700 dark:text-slate-300'
                                                                        }`}
                                                                    >
                                                                        {giaTri}
                                                                    </div>
                                                                );
                                                            })}

                                                            {/* Các ô trống cho đủ 3 cột */}
                                                            {Array.from({ length: soLuongTrong }).map((_, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className="p-3.5 sm:p-4 text-xs text-slate-300 dark:text-slate-600 italic select-none"
                                                                >
                                                                    —
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
