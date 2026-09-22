'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home, ChevronRight, Flame, Ticket, ArrowRight,
    CheckCircle2, Copy, Check, Zap, Truck, ShieldCheck,
    Gift, Gamepad2, Laptop, Headphones, GraduationCap, Heart, Tag,
    CheckCheck, ShoppingCart, X, AlertTriangle, RefreshCw
} from 'lucide-react';
import { MaGiamGiaService } from '@/services/ma-giam-gia.service';
import { SanPhamService } from '@/services/san-pham.service';
import { useNguoiDung } from '@/contexts/AuthContext';
import { useGioHang } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import TheSanPham from '@/components/san-pham/TheSanPham';
import { CaiDatService } from '@/services/cai-dat.service';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

export default function TrangKhuyenMai() {
    const { daDangNhap, nguoiDung, moModalDangNhap, capNhatViVoucher } = useNguoiDung();
    const { themVaoGioHang } = useGioHang();
    const { chuyenDoiYeuThich, kiemTraDaThich } = useWishlist();

    const [danhSachVoucher, setDanhSachVoucher] = useState([]);
    const [danhSachGiamSau, setDanhSachGiamSau] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [loiKetNoi, setLoiKetNoi] = useState(null);

    const [tabHienTai, setTabHienTai] = useState('tat_ca');
    const [dangLocTab, setDangLocTab] = useState(false);
    const daMountTabRef = React.useRef(false);

    useEffect(() => {
        if (!daMountTabRef.current) {
            daMountTabRef.current = true;
            return;
        }
        setDangLocTab(true);
        const timer = setTimeout(() => setDangLocTab(false), 300);
        return () => clearTimeout(timer);
    }, [tabHienTai]);
    const [maDaSaoChep, setMaDaSaoChep] = useState(null);
    const [dangLuuMa, setDangLuuMa] = useState({});
    const [moModalViVoucher, setMoModalViVoucher] = useState(false);
    const [caiDatKm, setCaiDatKm] = useState(CaiDatService.layCaiDatKhuyenMai());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Khóa cuộn màn hình khi mở modal ví voucher
    useEffect(() => {
        if (moModalViVoucher) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        }
    }, [moModalViVoucher]);

    // Tải dữ liệu Voucher và Sản phẩm Giảm Sâu 100% từ MongoDB Atlas qua Service
    const taiDuLieuKhuyenMai = () => {
        setDangTai(true);
        setLoiKetNoi(null);

        Promise.all([
            MaGiamGiaService.layDanhSachMaGiamGiaAsync(),
            SanPhamService.layTatCaSanPhamAsync({ flash_sale: true })
        ])
            .then(([vouchers, products]) => {
                if (Array.isArray(vouchers) && vouchers.length > 0) {
                    setDanhSachVoucher(vouchers);
                }
                if (Array.isArray(products) && products.length > 0) {
                    setDanhSachGiamSau(products);
                }
                setLoiKetNoi(null);
            })
            .catch((err) => {
                console.error('Lỗi nạp khuyến mãi từ MongoDB Atlas:', err);
                setLoiKetNoi('Không thể kết nối đến máy chủ MongoDB Atlas. Vui lòng kiểm tra lại dịch vụ Backend.');
            })
            .finally(() => {
                setDangTai(false);
            });
    };

    useEffect(() => {
        taiDuLieuKhuyenMai();

        setCaiDatKm(CaiDatService.layCaiDatKhuyenMai());
        const xuLyCaiDatDoi = (e) => {
            if (e.detail) setCaiDatKm(e.detail);
        };
        window.addEventListener('tntp_khuyen_mai_cap_nhat', xuLyCaiDatDoi);

        return () => {
            window.removeEventListener('tntp_khuyen_mai_cap_nhat', xuLyCaiDatDoi);
        };
    }, []);

    // Danh sách các mã voucher người dùng đã lưu trong ví MongoDB
    const viVoucherNguoiDung = useMemo(() => {
        return Array.isArray(nguoiDung?.viVoucher) ? nguoiDung.viVoucher : [];
    }, [nguoiDung]);

    // Các Tab lọc Voucher khớp 100% giao diện reference
    const TABS_LOC = [
        { ma: 'tat_ca', nhan: 'Tất cả' },
        { ma: 'laptop', nhan: 'Laptop' },
        { ma: 'phu_kien', nhan: 'Phụ kiện' },
        { ma: 'sinh_vien', nhan: 'Sinh viên' },
        { ma: 'thuong_hieu', nhan: 'Thương hiệu' }
    ];

    // 4 mã Voucher chuẩn theo ảnh reference
    const MA_VOUCHER_UU_TIEN = ['TNTP3TR', 'TNTP2TR', 'TNTP500K', 'TNTPSV'];

    // Lọc Voucher theo tab (Ưu tiên đúng 4 mã ở tab Tất cả)
    const danhSachHienThi = useMemo(() => {
        if (!Array.isArray(danhSachVoucher)) return [];
        if (tabHienTai === 'tat_ca') {
            const bonMaChinh = MA_VOUCHER_UU_TIEN
                .map((code) => danhSachVoucher.find((v) => v.ma_code === code))
                .filter(Boolean);
            if (bonMaChinh.length === 4) return bonMaChinh;
            return danhSachVoucher.slice(0, 4);
        }
        const ketQua = danhSachVoucher.filter((vc) => vc.chuyen_muc === tabHienTai);
        return ketQua.length > 0 ? ketQua.slice(0, 4) : danhSachVoucher.slice(0, 4);
    }, [danhSachVoucher, tabHienTai]);

    // 5 sản phẩm giảm sâu chuẩn theo ảnh reference
    const MA_SAN_PHAM_GIAM_SAU = [
        'lenovo-legion-5-2024',
        'asus-vivobook-14',
        'acer-nitro-5',
        'macbook-air-m2-13',
        'dell-inspiron-14-5440'
    ];

    const danhSach5SanPham = useMemo(() => {
        if (!Array.isArray(danhSachGiamSau) || danhSachGiamSau.length === 0) return [];
        const namSanPhamChuan = MA_SAN_PHAM_GIAM_SAU
            .map((id) => danhSachGiamSau.find((sp) => sp.id === id))
            .filter(Boolean);
        if (namSanPhamChuan.length === 5) return namSanPhamChuan;
        return danhSachGiamSau.slice(0, 5);
    }, [danhSachGiamSau]);

    // Bắn pháo hoa Confetti khi lưu mã thành công
    const banPhaoHoa = () => {
        try {
            confetti({
                particleCount: 60,
                spread: 70,
                origin: { y: 0.65 }
            });
        } catch { }
    };

    // Xử lý sao chép mã code
    const saoChepMa = (maCode) => {
        navigator.clipboard.writeText(maCode);
        setMaDaSaoChep(maCode);
        toast.success(`Đã sao chép mã ${maCode} vào clipboard!`);
        setTimeout(() => setMaDaSaoChep(null), 2500);
    };

    // Xử lý Lưu mã vào Ví (Yêu cầu đăng nhập, lưu vào MongoDB)
    const xuLyLuuMa = async (voucher) => {
        if (!daDangNhap) {
            toast.error('Vui lòng đăng nhập để lưu mã ưu đãi này vào ví!', {
                description: 'Đăng nhập chỉ 1 chạm với Google hoặc tài khoản TNTP.'
            });
            moModalDangNhap();
            return;
        }

        const maCode = voucher.ma_code;
        if (viVoucherNguoiDung.includes(maCode)) {
            toast.info(`Mã ${maCode} đã có sẵn trong ví của bạn!`);
            return;
        }

        setDangLuuMa((cu) => ({ ...cu, [maCode]: true }));
        try {
            const ketQua = await MaGiamGiaService.luuMaVoucherAsync(maCode);
            const thanhCong = ketQua?.thanhCong || ketQua?.thanh_cong || ketQua?.da_luu;
            if (thanhCong) {
                capNhatViVoucher(ketQua.viVoucher || [...viVoucherNguoiDung, maCode]);
                banPhaoHoa();
                toast.success(ketQua.thongBao || ketQua.thong_diep || `Săn mã thành công: ${maCode}!`, {
                    description: 'Mã đã được lưu vào Ví Voucher trong tài khoản của bạn.'
                });
            } else {
                toast.error(ketQua?.thongBao || ketQua?.thong_diep || 'Không thể lưu mã vào ví lúc này.');
            }
        } catch (error) {
            toast.error(error.message || 'Lỗi khi lưu mã vào ví.');
        } finally {
            setDangLuuMa((cu) => ({ ...cu, [maCode]: false }));
        }
    };

    // Xử lý thêm sản phẩm giảm sâu vào giỏ hàng
    const xuLyThemVaoGio = (sp) => {
        try {
            themVaoGioHang(sp, 1);
            toast.success(`Đã thêm "${sp.ten_san_pham}" vào giỏ hàng!`);
        } catch {
            toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
        }
    };

    // Cuộn xuống danh sách voucher
    const cuonXuongVoucher = () => {
        const el = document.getElementById('khu-vuc-voucher');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Helper định dạng tiền tệ gọn gàng chuẩn reference
    const dinhDangGia = (soTien) => {
        if (!soTien) return '0đ';
        return `${new Intl.NumberFormat('vi-VN').format(soTien)}đ`;
    };

    // Helper dòng thông số chuẩn theo ảnh reference
    const layDongThongSo = (sp) => {
        if (sp.id === 'lenovo-legion-5-2024') return 'i7-14650HX | RTX 4060 | 16GB';
        if (sp.id === 'asus-vivobook-14') return 'i5-12450H | 16GB | 512GB';
        if (sp.id === 'acer-nitro-5') return 'i5-13420H | RTX 4050 | 16GB';
        if (sp.id === 'macbook-air-m2-13') return '8GB | 256GB | 2022';
        if (sp.id === 'dell-inspiron-14-5440') return 'i5-1335U | 16GB | 512GB';

        const ds = [sp.thong_so?.cpu, sp.thong_so?.card_do_hoa || sp.thong_so?.ram, sp.thong_so?.ram || sp.thong_so?.o_cung];
        return ds.filter(Boolean).join(' | ') || 'Chính hãng • Bảo hành đầy đủ';
    };

    // Helper icon Voucher
    const layIconVoucher = (vc) => {
        if (vc.mau_sac === 'red' || vc.ma_code === 'TNTP3TR' || vc.chuyen_muc === 'laptop-gaming') {
            return <Gamepad2 className="w-8 h-8 text-white/80" />;
        }
        if (vc.mau_sac === 'orange' || vc.ma_code === 'TNTP500K' || vc.chuyen_muc === 'phu_kien') {
            return <Headphones className="w-8 h-8 text-white/80" />;
        }
        if (vc.mau_sac === 'purple' || vc.ma_code === 'TNTPSV' || vc.chuyen_muc === 'sinh_vien') {
            return <GraduationCap className="w-8 h-8 text-white/80" />;
        }
        return <Laptop className="w-8 h-8 text-white/80" />;
    };

    // Helper màu sắc Card Voucher chuẩn 100% reference
    const layMauSacCard = (mauSac) => {
        switch (mauSac) {
            case 'red':
            case 'rose':
                return {
                    dauCard: 'bg-gradient-to-r from-[#DE1B45] via-[#E82C54] to-[#F43F5E]',
                    mauCode: 'text-[#DE1B45]',
                    pillBg: 'bg-[#FFF1F2]',
                    pillBorder: 'border-[#FECDD3]',
                    nutBam: 'bg-[#DE1B45] hover:bg-[#BD1236] shadow-[0_4px_12px_rgba(222,27,69,0.25)] hover:shadow-[0_6px_16px_rgba(222,27,69,0.35)]'
                };
            case 'blue':
            case 'sky':
                return {
                    dauCard: 'bg-gradient-to-r from-[#0060E6] via-[#0074F0] to-[#008CFF]',
                    mauCode: 'text-[#0060E6]',
                    pillBg: 'bg-[#EFF6FF]',
                    pillBorder: 'border-[#BFDBFE]',
                    nutBam: 'bg-[#0060E6] hover:bg-[#0051C2] shadow-[0_4px_12px_rgba(0,96,230,0.25)] hover:shadow-[0_6px_16px_rgba(0,96,230,0.35)]'
                };
            case 'orange':
            case 'amber':
                return {
                    dauCard: 'bg-gradient-to-r from-[#F57400] via-[#FA8200] to-[#FF9800]',
                    mauCode: 'text-[#F57400]',
                    pillBg: 'bg-[#FFF7ED]',
                    pillBorder: 'border-[#FED7AA]',
                    nutBam: 'bg-[#F57400] hover:bg-[#D96600] shadow-[0_4px_12px_rgba(245,116,0,0.25)] hover:shadow-[0_6px_16px_rgba(245,116,0,0.35)]'
                };
            case 'purple':
                return {
                    dauCard: 'bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7]',
                    mauCode: 'text-[#7C3AED]',
                    pillBg: 'bg-[#FAF5FF]',
                    pillBorder: 'border-[#E9D5FF]',
                    nutBam: 'bg-[#7C3AED] hover:bg-[#6D28D9] shadow-[0_4px_12px_rgba(124,58,237,0.25)] hover:shadow-[0_6px_16px_rgba(124,58,237,0.35)]'
                };
            default:
                return {
                    dauCard: 'bg-gradient-to-r from-[#0060E6] via-[#0074F0] to-[#008CFF]',
                    mauCode: 'text-[#0060E6]',
                    pillBg: 'bg-[#EFF6FF]',
                    pillBorder: 'border-[#BFDBFE]',
                    nutBam: 'bg-[#0060E6] hover:bg-[#0051C2] shadow-[0_4px_12px_rgba(0,96,230,0.25)] hover:shadow-[0_6px_16px_rgba(0,96,230,0.35)]'
                };
        }
    };

    return (
        <div className="space-y-8">

            {/* 1. Breadcrumb điều hướng */}
            <nav className="flex items-center gap-1.5 text-[13px] text-slate-500 mb-1">
                <Link href="/" className="inline-flex items-center gap-1 hover:text-[#0060E6] transition-colors">
                    <Home className="w-3.5 h-3.5 text-slate-400" />
                    <span>Trang chủ</span>
                </Link>
                    <ChevronRight className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-800">Khuyến mãi</span>
                </nav>

                {/* 2. Hero Banner "KHO ƯU ĐÃI TNTP" - 100% HTML & CSS VỚI ẢNH NỀN 3D RENDER MỚI ĐẲNG CẤP */}
                <section className="relative rounded-[24px] sm:rounded-[30px] overflow-hidden border border-[#CDE5FC] shadow-[0_8px_32px_rgba(0,102,255,0.08)] mb-8 min-h-[350px] md:min-h-[370px] lg:min-h-[385px] flex items-center select-none">
                    {/* Ảnh nền 3D Render Mới: Laptops ROG, Bục Neon Glow, Hộp Quà Vàng Kim & Bầu Trời Băng Tuyết */}
                    <div className="absolute inset-0 z-0 pointer-events-none select-none">
                        <Image
                            src="/images/khuyen-mai/hero_banner_3d_panoramic_perfect.png"
                            alt="Kho ưu đãi TNTP"
                            fill
                            sizes="(max-width: 1280px) 100vw, 1200px"
                            className="object-cover object-right lg:object-center select-none"
                            priority
                            unoptimized
                        />
                        {/* Lớp gradient mỏng ở màn hình nhỏ để chữ đọc rõ 100% */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#D7EAFD]/90 via-[#D7EAFD]/50 to-transparent sm:hidden" />
                    </div>

                    {/* Huy hiệu nổi 3D "TIẾT KIỆM ĐẾN 3.000.000đ" ở góc trên bên phải laptops */}
                    <div className="hidden sm:flex flex-col items-center absolute top-5 sm:top-6 right-6 lg:right-14 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-[0_8px_24px_rgba(0,96,230,0.15)] border border-[#D5E6F8] text-center z-10 pointer-events-none select-none">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0060E6]">
                            TIẾT KIỆM ĐẾN
                        </span>
                        <span className="text-[20px] font-black text-[#0060E6] leading-tight">
                            {caiDatKm.muc_giam_toi_da || '3.000.000đ'}
                        </span>
                    </div>

                    {/* Nội dung bên trái (~50%) - 100% Code HTML & CSS Chuẩn */}
                    <div className="relative z-10 p-6 sm:p-8 lg:py-8 lg:px-10 max-w-xl">
                        {/* Badge nhỏ */}
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#BEDBFE] text-[#0060E6] text-[11px] font-extrabold uppercase tracking-wide mb-3 shadow-[0_2px_8px_rgba(0,102,255,0.06)]">
                            <Gift className="w-3.5 h-3.5 text-[#0060E6]" />
                            <span>{caiDatKm.badge_noi_bat || 'ƯU ĐÃI CHÍNH HÃNG • TIẾT KIỆM THÔNG MINH'}</span>
                        </div>

                        {/* Tiêu đề chính */}
                        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0B1736] tracking-tight leading-tight mb-1.5">
                            {caiDatKm.tieu_de_chinh || (
                                <>KHO ƯU ĐÃI <span className="text-[#005AE0]">TNTP</span></>
                            )}
                        </h1>
                        <p className="text-[#334155] text-[15px] sm:text-[16px] font-semibold mb-5">
                            {caiDatKm.phu_de || 'Săn voucher ngay – Mua laptop giá tốt'}
                        </p>

                        {/* 4 Feature Benefits nhỏ */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5 max-w-[430px]">
                            {/* Benefit 1 */}
                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-[#D5E6F8] shadow-[0_2px_8px_rgba(0,102,255,0.03)] hover:shadow-md transition-all flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#EBF5FE] border border-[#D5E6F8] flex items-center justify-center shrink-0">
                                    <Ticket className="w-4 h-4 text-[#005AE0]" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#0F172A] text-[12px] leading-tight">Voucher mỗi ngày</div>
                                    <div className="text-[10px] text-[#64748B] mt-0.5">Nhiều ưu đãi hấp dẫn</div>
                                </div>
                            </div>

                            {/* Benefit 2 */}
                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-[#D5E6F8] shadow-[0_2px_8px_rgba(0,102,255,0.03)] hover:shadow-md transition-all flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#EBF5FE] border border-[#D5E6F8] flex items-center justify-center shrink-0">
                                    <CheckCircle2 className="w-4 h-4 text-[#005AE0]" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#0F172A] text-[12px] leading-tight">Áp dụng dễ dàng</div>
                                    <div className="text-[10px] text-[#64748B] mt-0.5">Chỉ 1 phút lưu mã</div>
                                </div>
                            </div>

                            {/* Benefit 3 */}
                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-[#D5E6F8] shadow-[0_2px_8px_rgba(0,102,255,0.03)] hover:shadow-md transition-all flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#EBF5FE] border border-[#D5E6F8] flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-[#005AE0]" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#0F172A] text-[12px] leading-tight">Sản phẩm chính hãng</div>
                                    <div className="text-[10px] text-[#64748B] mt-0.5">Bảo hành đầy đủ</div>
                                </div>
                            </div>

                            {/* Benefit 4 */}
                            <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 px-3.5 border border-[#D5E6F8] shadow-[0_2px_8px_rgba(0,102,255,0.03)] hover:shadow-md transition-all flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-[#EBF5FE] border border-[#D5E6F8] flex items-center justify-center shrink-0">
                                    <Tag className="w-4 h-4 text-[#005AE0]" />
                                </div>
                                <div>
                                    <div className="font-bold text-[#0F172A] text-[12px] leading-tight">Tiết kiệm hơn</div>
                                    <div className="text-[10px] text-[#64748B] mt-0.5">Giảm đến 3.000.000đ</div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={cuonXuongVoucher}
                            className="inline-flex items-center gap-2 bg-[#0060E6] hover:bg-[#0052CC] text-white font-bold text-[13px] px-6 py-2.5 rounded-xl shadow-[0_6px_20px_rgba(0,96,230,0.35)] hover:shadow-[0_8px_25px_rgba(0,96,230,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
                        >
                            <span>Khám phá ưu đãi</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </section>

                {/* 3. Khối "VOUCHER DÀNH CHO BẠN" */}
                <section id="khu-vuc-voucher" className="mb-8 scroll-mt-6">
                    {/* Header Khối Voucher */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-[20px] sm:text-[22px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Gift className="w-5 h-5 text-[#E11D48]" />
                                <span>VOUCHER DÀNH CHO BẠN</span>
                            </h2>
                            <p className="text-[13px] text-slate-500 mt-0.5">
                                Lưu mã ngay để nhận ưu đãi khi thanh toán
                            </p>
                        </div>

                        {/* Hàng nút lọc & Nút ví */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {TABS_LOC.map((tab) => (
                                <button
                                    key={tab.ma}
                                    onClick={() => setTabHienTai(tab.ma)}
                                    className={`px-3.5 py-1.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer ${tabHienTai === tab.ma
                                            ? 'bg-[#0060E6] text-white font-semibold shadow-xs'
                                            : 'bg-[#F1F5F9] text-slate-700 hover:bg-slate-200'
                                        }`}
                                >
                                    {tab.nhan}
                                </button>
                            ))}

                            {daDangNhap && (
                                <button
                                    onClick={() => setMoModalViVoucher(true)}
                                    className="ml-1 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                >
                                    <Ticket className="w-3 h-3" />
                                    <span>Ví của tôi ({viVoucherNguoiDung.length})</span>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Lưới 4 Thẻ Voucher 4 Màu Rực Rỡ Gọn Gàng Chuẩn Reference */}
                    <div className="relative min-h-[260px]">
                        <KhuVucDangTaiTable
                            dangTai={dangLocTab}
                            tieuDe="Đang lọc danh sách voucher..."
                            moTa="Hệ thống đang áp dụng phân mục khuyến mãi"
                        />
                        <div className={`transition-opacity duration-300 ${dangLocTab ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                            {loiKetNoi ? (
                                <div className="p-10 text-center rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-3 shadow-sm">
                                    <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 mx-auto flex items-center justify-center">
                                        <AlertTriangle className="w-7 h-7 text-red-600" />
                                    </div>
                                    <h3 className="text-base font-bold text-red-800 dark:text-red-300">
                                        Không Thể Kết Nối Máy Chủ MongoDB Atlas
                                    </h3>
                                    <p className="text-xs text-red-600/90 dark:text-red-400 max-w-md mx-auto leading-relaxed">
                                        {loiKetNoi}
                                    </p>
                                    <button
                                        onClick={taiDuLieuKhuyenMai}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" />
                                        <span>Thử Kết Nối Lại</span>
                                    </button>
                                </div>
                            ) : dangTai ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="rounded-[22px] p-4 bg-white border border-slate-100 animate-pulse space-y-4 min-h-[220px]">
                                            <div className="h-20 bg-slate-200 rounded-xl"></div>
                                            <div className="h-10 bg-slate-100 rounded-lg"></div>
                                            <div className="h-9 bg-slate-200 rounded-xl"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : danhSachHienThi.length === 0 ? (
                                <div className="py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                                    <p className="text-sm font-semibold">Chưa có mã giảm giá nào trong danh mục này.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
                                    {danhSachHienThi.map((vc) => {
                                        const mau = layMauSacCard(vc.mau_sac);
                                        const daLuu = viVoucherNguoiDung.includes(vc.ma_code);
                                        const dangLuu = dangLuuMa[vc.ma_code];

                                        return (
                                            <div
                                                key={vc.id || vc.ma_code}
                                                className="rounded-[22px] shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-300 border border-slate-100/80 flex flex-col justify-between bg-white relative group overflow-hidden"
                                            >
                                                {/* Mép đục lỗ răng cưa vé voucher (Scallop holes) bên trái chuẩn vé ưu đãi */}
                                                <div className="absolute -left-[5px] top-3 bottom-3 flex flex-col justify-between z-20 pointer-events-none">
                                                    {[...Array(10)].map((_, i) => (
                                                        <div
                                                            key={i}
                                                            className="w-2.5 h-2.5 rounded-full bg-[#f8fafc]"
                                                        />
                                                    ))}
                                                </div>

                                                {/* Nửa trên: Màu sắc chủ đạo + Badge ngày + Giá trị + Icon */}
                                                <div className={`${mau.dauCard} p-4 sm:p-4.5 text-white relative flex flex-col justify-between min-h-[135px]`}>
                                                    {/* Hàng trên: Giảm + Badge ngày còn lại */}
                                                    <div className="flex items-center justify-between z-10">
                                                        <span className="text-[12.5px] font-semibold text-white/95">
                                                            Giảm
                                                        </span>
                                                        <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-xs border border-white/30 px-2.5 py-0.5 rounded-full text-white shadow-2xs">
                                                            {vc.ngay_het_han || 'Còn 15 ngày'}
                                                        </span>
                                                    </div>

                                                    {/* Icon mờ lớn ở góc phải */}
                                                    <div className="absolute right-3.5 top-8 pointer-events-none">
                                                        {layIconVoucher(vc)}
                                                    </div>

                                                    {/* Nội dung giá trị giảm và điều kiện */}
                                                    <div className="z-10 mt-2">
                                                        <div className="text-[23px] sm:text-[25px] font-black tracking-tight leading-none text-white my-1">
                                                            {vc.loai_giam === 'phan_tram' ? `${vc.gia_tri_giam}%` : dinhDangGia(vc.gia_tri_giam)}
                                                        </div>
                                                        <div className="text-[12px] font-medium text-white/95 mt-1 leading-snug">
                                                            {vc.mo_ta || 'Cho sản phẩm áp dụng'}
                                                        </div>
                                                        <div className="text-[11px] text-white/80 mt-0.5 font-normal">
                                                            Đơn tối thiểu {dinhDangGia(vc.don_hang_toi_thieu)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Nửa dưới: Nền trắng + Hộp mã Code kèm nút Copy + Nút Lưu mã */}
                                                <div className="p-3.5 sm:p-4 bg-white space-y-2.5">
                                                    {/* Ô mã Code kèm nút Copy */}
                                                    <div className={`rounded-xl px-3 py-2 flex items-center justify-between border ${mau.pillBorder} ${mau.pillBg} transition-colors`}>
                                                        <span className={`font-mono font-black tracking-wider text-[13.5px] ${mau.mauCode}`}>
                                                            {vc.ma_code}
                                                        </span>
                                                        <button
                                                            onClick={() => saoChepMa(vc.ma_code)}
                                                            className="p-1 text-slate-400 hover:text-slate-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                                            title="Sao chép mã"
                                                            aria-label={`Sao chép mã ${vc.ma_code}`}
                                                        >
                                                            {maDaSaoChep === vc.ma_code ? (
                                                                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                                                    <Check className="w-3.5 h-3.5" />
                                                                    <span>Đã chép</span>
                                                                </span>
                                                            ) : (
                                                                <Copy className="w-3.5 h-3.5" />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {/* Nút hành động Lưu mã */}
                                                    {daLuu ? (
                                                        <Link
                                                            href="/san-pham"
                                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl shadow-[0_4px_12px_rgba(5,150,105,0.25)] flex items-center justify-center gap-2 text-[13px] transition-all hover:-translate-y-0.5 active:scale-98"
                                                        >
                                                            <CheckCheck className="w-4 h-4" />
                                                            <span>Đã lưu • Dùng ngay</span>
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            onClick={() => xuLyLuuMa(vc)}
                                                            disabled={dangLuu}
                                                            className={`w-full ${mau.nutBam} text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-[13px] transition-all hover:-translate-y-0.5 active:scale-98 cursor-pointer disabled:opacity-75`}
                                                        >
                                                            <ShoppingCart className="w-4 h-4" />
                                                            <span>{dangLuu ? 'Đang lưu...' : 'Lưu mã'}</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 4. Khối "SĂN DEAL THEO NHU CẦU" chuẩn 100% Reference */}
                <section className="mb-8">
                    <div className="mb-4">
                        <h2 className="text-[20px] sm:text-[22px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                            <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
                            <span>SĂN DEAL THEO NHU CẦU</span>
                        </h2>
                        <p className="text-[13px] text-slate-500 mt-0.5">
                            Chọn nhóm sản phẩm bạn quan tâm để xem ưu đãi phù hợp
                        </p>
                    </div>

                    {/* Lưới 4 Thẻ Banner Danh Mục Hàng Ngang Chuẩn 100% Reference Với HTML Typography & Ảnh 3D 4K Siêu Nét */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">

                        {/* Card 1: Laptop Gaming */}
                        <Link
                            href="/san-pham?danh_muc=gaming"
                            className="group relative rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(225,29,72,0.22)] hover:-translate-y-1.5 transition-all duration-300 block select-none border border-rose-900/10 bg-[#1A050B]"
                        >
                            <div className="relative w-full aspect-[167/110] sm:aspect-[3/2] flex flex-col justify-between overflow-hidden">
                                {/* Ảnh nền 3D ROG Gaming Laptop 4K không chữ siêu nét */}
                                <Image
                                    src="/images/khuyen-mai/deal_laptop_gaming_clean.png"
                                    alt="Laptop Gaming - Giảm đến 3.000.000đ"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 select-none z-0"
                                    priority
                                    unoptimized
                                />
                                {/* Lớp gradient mỏng nhẹ phía bên trái để chữ trắng nổi bật tuyệt đối */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/15 to-transparent z-1 pointer-events-none" />

                                {/* Nội dung chữ vector HTML sắc nét 100% */}
                                <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-between h-full">
                                    <div className="flex flex-col">
                                        <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                                            Laptop Gaming
                                        </span>
                                        <span className="text-[12px] sm:text-[13px] font-medium text-white/90 mt-0.5 drop-shadow-sm">
                                            Giảm đến
                                        </span>
                                        <span className="text-[20px] sm:text-[22px] lg:text-[24px] font-black text-white tracking-tight leading-none mt-1 drop-shadow-md">
                                            3.000.000đ
                                        </span>
                                    </div>

                                    {/* Nút mũi tên chuẩn squircle trắng */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#1E293B] group-hover:bg-[#E11D48] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card 2: Laptop Văn phòng */}
                        <Link
                            href="/san-pham?danh_muc=van-phong-mong-nhe"
                            className="group relative rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(0,96,230,0.22)] hover:-translate-y-1.5 transition-all duration-300 block select-none border border-blue-900/10 bg-[#003875]"
                        >
                            <div className="relative w-full aspect-[167/110] sm:aspect-[3/2] flex flex-col justify-between overflow-hidden">
                                {/* Ảnh nền 3D Ultrabook Siêu mỏng 4K không chữ siêu nét */}
                                <Image
                                    src="/images/khuyen-mai/deal_laptop_vanphong_clean.png"
                                    alt="Laptop Văn phòng - Giảm đến 15%"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 select-none z-0"
                                    priority
                                    unoptimized
                                />
                                {/* Lớp gradient mỏng nhẹ phía bên trái */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-1 pointer-events-none" />

                                {/* Nội dung chữ vector HTML sắc nét 100% */}
                                <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-between h-full">
                                    <div className="flex flex-col">
                                        <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                                            Laptop Văn phòng
                                        </span>
                                        <span className="text-[19px] sm:text-[21px] lg:text-[23px] font-black text-white tracking-tight leading-none mt-1 drop-shadow-md">
                                            Giảm đến 15%
                                        </span>
                                    </div>

                                    {/* Nút mũi tên chuẩn squircle trắng */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#1E293B] group-hover:bg-[#0060E6] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card 3: Ưu đãi Sinh viên */}
                        <Link
                            href="/san-pham?nhu_cau=sinh-vien-van-phong"
                            className="group relative rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(5,150,105,0.22)] hover:-translate-y-1.5 transition-all duration-300 block select-none border border-emerald-900/10 bg-[#044A37]"
                        >
                            <div className="relative w-full aspect-[167/110] sm:aspect-[3/2] flex flex-col justify-between overflow-hidden">
                                {/* Ảnh nền 3D Sinh viên Laptop & Balo 4K không chữ siêu nét */}
                                <Image
                                    src="/images/khuyen-mai/deal_sinh_vien_clean.png"
                                    alt="Ưu đãi Sinh viên - Giá tốt Quà xịn"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 select-none z-0"
                                    priority
                                    unoptimized
                                />
                                {/* Lớp gradient mỏng nhẹ phía bên trái */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-1 pointer-events-none" />

                                {/* Nội dung chữ vector HTML sắc nét 100% */}
                                <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-between h-full">
                                    <div className="flex flex-col">
                                        <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                                            Ưu đãi
                                        </span>
                                        <span className="text-[19px] sm:text-[21px] lg:text-[23px] font-black text-white tracking-tight leading-tight drop-shadow-md">
                                            Sinh viên
                                        </span>
                                        <span className="text-[12px] sm:text-[13px] font-medium text-white/90 mt-1 drop-shadow-sm">
                                            Giá tốt – Quà xịn
                                        </span>
                                    </div>

                                    {/* Nút mũi tên chuẩn squircle trắng */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#1E293B] group-hover:bg-[#059669] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                        {/* Card 4: Phụ kiện - Linh kiện */}
                        <Link
                            href="/san-pham?danh_muc=phu-kien-gear"
                            className="group relative rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_28px_rgba(124,58,237,0.22)] hover:-translate-y-1.5 transition-all duration-300 block select-none border border-purple-900/10 bg-[#320658]"
                        >
                            <div className="relative w-full aspect-[167/110] sm:aspect-[3/2] flex flex-col justify-between overflow-hidden">
                                {/* Ảnh nền 3D Gaming Gear 4K không chữ siêu nét */}
                                <Image
                                    src="/images/khuyen-mai/deal_phu_kien_clean.png"
                                    alt="Phụ kiện - Linh kiện - Giảm đến 30%"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 25vw"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 select-none z-0"
                                    priority
                                    unoptimized
                                />
                                {/* Lớp gradient mỏng nhẹ phía bên trái */}
                                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-1 pointer-events-none" />

                                {/* Nội dung chữ vector HTML sắc nét 100% */}
                                <div className="relative z-10 p-4 sm:p-4.5 flex flex-col justify-between h-full">
                                    <div className="flex flex-col">
                                        <span className="text-[15px] sm:text-[16px] lg:text-[17px] font-bold text-white tracking-tight leading-snug drop-shadow-sm">
                                            Phụ kiện - Linh kiện
                                        </span>
                                        <span className="text-[19px] sm:text-[21px] lg:text-[23px] font-black text-white tracking-tight leading-none mt-1 drop-shadow-md">
                                            Giảm đến 30%
                                        </span>
                                    </div>

                                    {/* Nút mũi tên chuẩn squircle trắng */}
                                    <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl sm:rounded-2xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.18)] flex items-center justify-center text-[#1E293B] group-hover:bg-[#7C3AED] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                                        <ArrowRight className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5]" />
                                    </div>
                                </div>
                            </div>
                        </Link>

                    </div>
                </section>

                {/* 5. Khối "SẢN PHẨM ĐANG GIẢM SÂU" chuẩn 100% Reference */}
                <section className="mb-10">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div>
                            <h2 className="text-[20px] sm:text-[22px] font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <Flame className="w-5 h-5 text-[#E11D48] fill-[#E11D48]" />
                                <span>SẢN PHẨM ĐANG GIẢM SÂU</span>
                            </h2>
                            <p className="text-[13px] text-slate-500 mt-0.5">
                                Những sản phẩm nổi bật với ưu đãi tốt nhất trong thời gian này
                            </p>
                        </div>
                        <Link
                            href="/san-pham"
                            className="text-[13px] font-semibold text-[#0060E6] hover:underline flex items-center gap-1 transition-colors"
                        >
                            <span>Xem tất cả sản phẩm khuyến mãi</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {/* Lưới Sản Phẩm Giảm Sâu Chuẩn Component TheSanPham & Kết Nối MongoDB */}
                    {dangTai ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200 animate-pulse space-y-3">
                                    <div className="w-full h-36 rounded-xl bg-slate-200"></div>
                                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : loiKetNoi ? (
                        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                            Không thể tải sản phẩm giảm sâu do kết nối máy chủ MongoDB gián đoạn.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
                            {danhSach5SanPham.map((sp) => (
                                <TheSanPham
                                    key={sp.id || sp._id}
                                    sanPham={sp}
                                    cheDoHienThi="luoi"
                                    hienThiThanhFlashSale={false}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* 6. Khối "VÌ SAO NÊN SĂN ƯU ĐÃI TẠI TNTP?" chuẩn 100% Reference */}
                <section className="mb-10">
                    <h2 className="text-[15px] sm:text-[16px] font-extrabold text-[#0060E6] text-center uppercase tracking-wider mb-4">
                        VÌ SAO NÊN SĂN ƯU ĐÃI TẠI TNTP?
                    </h2>

                    <div className="bg-[#EDF5FD] rounded-2xl border border-[#D5E6F8] p-5 sm:p-6 shadow-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                            {/* Mục 1: Sản phẩm chính hãng */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D8EAFC] flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-[#0060E6]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">Sản phẩm chính hãng</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Bảo hành đầy đủ</p>
                                </div>
                            </div>

                            {/* Mục 2: Ưu đãi cập nhật liên tục */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D8EAFC] flex items-center justify-center shrink-0">
                                    <Tag className="w-5 h-5 text-[#0060E6]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">Ưu đãi cập nhật liên tục</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Nhiều voucher mỗi ngày</p>
                                </div>
                            </div>

                            {/* Mục 3: Giao nhanh toàn quốc */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D8EAFC] flex items-center justify-center shrink-0">
                                    <Truck className="w-5 h-5 text-[#0060E6]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">Giao nhanh toàn quốc</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Nhận hàng từ 1 – 3 ngày</p>
                                </div>
                            </div>

                            {/* Mục 4: Hỗ trợ tận tâm 24/7 */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#D8EAFC] flex items-center justify-center shrink-0">
                                    <Headphones className="w-5 h-5 text-[#0060E6]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 text-[13px]">Hỗ trợ tận tâm 24/7</h4>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Tư vấn trước – sau mua hàng</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

            {/* 7. Modal Ví Voucher Của Tôi */}
            {mounted && typeof document !== 'undefined' && moModalViVoucher && createPortal(
                <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Ticket className="w-5 h-5 text-[#0060E6]" />
                                <h3 className="font-black text-slate-900 text-lg">Ví Voucher Của Tôi</h3>
                            </div>
                            <button
                                onClick={() => setMoModalViVoucher(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="py-4 max-h-[60vh] overflow-y-auto space-y-3">
                            {viVoucherNguoiDung.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <Ticket className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                    <p className="text-sm">Ví của bạn hiện chưa có voucher nào.</p>
                                    <p className="text-xs text-slate-400 mt-1">Hãy bấm "Lưu mã" tại trang khuyến mãi để nhận ưu đãi!</p>
                                </div>
                            ) : (
                                viVoucherNguoiDung.map((code) => {
                                    const vc = danhSachVoucher.find((v) => v.ma_code === code) || {
                                        ma_code: code,
                                        tieu_de: `Mã ưu đãi ${code}`,
                                        mo_ta: 'Áp dụng khi thanh toán đơn hàng laptop tại TNTP'
                                    };
                                    return (
                                        <div key={code} className="border border-blue-100 bg-blue-50/50 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                                            <div>
                                                <div className="font-mono font-bold text-[#0060E6] text-base">{code}</div>
                                                <div className="text-xs font-semibold text-slate-800">{vc.tieu_de}</div>
                                                <div className="text-[11px] text-slate-500 line-clamp-1">{vc.mo_ta}</div>
                                            </div>
                                            <button
                                                onClick={() => saoChepMa(code)}
                                                className="px-3 py-1.5 bg-white border border-blue-200 text-[#0060E6] font-semibold text-xs rounded-lg hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                                            >
                                                Sao chép
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-end">
                            <button
                                onClick={() => setMoModalViVoucher(false)}
                                className="px-5 py-2 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
