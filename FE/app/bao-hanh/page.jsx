'use client';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import {
    Home,
    ChevronRight,
    ShieldCheck,
    Search,
    AlertCircle,
    CheckCircle2,
    Calendar,
    Phone,
    MapPin,
    Clock,
    Printer,
    Sparkles,
    ShieldAlert,
    HelpCircle,
    X,
    Laptop,
    Receipt,
    Smartphone,
    Terminal,
    Copy,
    Check
} from 'lucide-react';
import { apiFetch } from '@/services/api-client';
import { DonHangService } from '@/services/don-hang.service';

export default function TrangBaoHanh() {
    const [soSerial, setSoSerial] = useState('');
    const [dangTraCuu, setDangTraCuu] = useState(false);
    const [daTraCuu, setDaTraCuu] = useState(false);
    const [ketQua, setKetQua] = useState(null);
    const [thongBaoLoi, setThongBaoLoi] = useState('');
    const [hienModalHuongDan, setHienModalHuongDan] = useState(false);
    const [tabHuongDan, setTabHuongDan] = useState('serial');
    const [daCopy, setDaCopy] = useState('');



    const [hienModalKetQua, setHienModalKetQua] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Khóa cuộn trang nền khi mở popup kết quả hoặc popup hướng dẫn
    useEffect(() => {
        if (hienModalKetQua || hienModalHuongDan) {
            const prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = prevOverflow;
            };
        }
    }, [hienModalKetQua, hienModalHuongDan]);

    const copyToClipboard = (text, id) => {
        navigator.clipboard?.writeText(text);
        setDaCopy(id);
        setTimeout(() => setDaCopy(''), 2000);
    };

    const thucHienTraCuu = async (tuKhoa) => {
        const q = (tuKhoa !== undefined ? tuKhoa : soSerial).trim();
        if (!q) return;

        setDangTraCuu(true);
        setDaTraCuu(true);
        setThongBaoLoi('');
        setKetQua(null);

        // Kiểm tra tối thiểu 3 ký tự
        if (q.length < 3) {
            setThongBaoLoi(`Từ khóa "${q}" quá ngắn. Quý khách vui lòng nhập chính xác Số Serial máy, Mã đơn hàng hoặc Số điện thoại mua hàng.`);
            setDangTraCuu(false);
            setHienModalKetQua(true);
            return;
        }

        try {
            // 1. Gọi REST API tra cứu bảo hành từ Database Backend (Express + MongoDB Atlas)
            const res = await apiFetch(`/bao-hanh/tra-cuu?tu_khoa=${encodeURIComponent(q)}`);

            if (res && res.hop_le && Array.isArray(res.danh_sach) && res.danh_sach.length > 0) {
                setKetQua(res.danh_sach);
                setDangTraCuu(false);
                setHienModalKetQua(true);
                return;
            }

            // 2. Dự phòng: Kiểm tra đơn hàng mới đặt lưu trong LocalStorage của trình duyệt (Khớp CHÍNH XÁC)
            const donHangLocal = DonHangService.layTatCaDonHang();
            const qUpper = q.toUpperCase();
            const qDigits = q.replace(/\D/g, '');

            const khopLocal = donHangLocal.find(dh => {
                const maDon = (dh.ma_don_hang || '').toUpperCase();
                const idDon = (dh.id || '').toUpperCase();
                const sdt = (dh.thong_tin_giao_hang?.so_dien_thoai || '').replace(/\D/g, '');

                if (maDon === qUpper || idDon === qUpper) return true;
                if (qDigits.length >= 9 && sdt === qDigits) return true;

                return (dh.danh_sach_san_pham || []).some(item => {
                    const sku = (item.san_pham?.ma_san_pham || '').toUpperCase();
                    const sn = (item.so_serial || '').toUpperCase();
                    return (sku && sku === qUpper) || (sn && sn === qUpper);
                });
            });

            if (khopLocal) {
                const sp = khopLocal.danh_sach_san_pham?.[0]?.san_pham || {};
                const ngayTao = khopLocal.ngay_tao || 'Hôm nay';
                const ngayHetHan = new Date();
                ngayHetHan.setMonth(ngayHetHan.getMonth() + 24);

                setKetQua([{
                    hop_le: true,
                    loai_tra_cuu: 'don_hang_local',
                    ma_don_hang: khopLocal.ma_don_hang || 'LPN-LOCAL',
                    so_serial: sp.ma_san_pham || 'LPN-SN-LOCAL',
                    ma_san_pham: sp.ma_san_pham || 'CHÍNH HÃNG',
                    ten_san_pham: sp.ten_san_pham || 'Sản phẩm tại LaptopNew',
                    hinh_anh: sp.hinh_anh_chinh || '/images/asus_rog_scar18.jpg',
                    hang_san_xuat: (sp.hang_san_xuat || 'TNTP').toUpperCase(),
                    khach_hang: khopLocal.thong_tin_giao_hang?.ho_ten || 'Quý Khách Hàng',
                    so_dien_thoai: khopLocal.thong_tin_giao_hang?.so_dien_thoai || '0912***678',
                    ngay_kich_hoat: ngayTao,
                    ngay_het_han: ngayHetHan.toLocaleDateString('vi-VN'),
                    thoi_gian_bao_hanh: '24 Tháng Chính Hãng',
                    con_hieu_luc: true,
                    so_thang_con_lai: 24,
                    trang_thai: 'Còn hiệu lực bảo hành chính hãng (24 tháng còn lại)',
                    goi_dich_vu: 'Bảo hành vàng On-site tận nơi 24 tháng chính hãng tại hệ thống TNTP Laptop',
                    trung_tam_bao_hanh: [
                        'Chi nhánh 1: 29 Tân Phước, P.8, Q.10, TP.HCM (Hotline: 0948.37.79.79)',
                        'Chi nhánh 2: 12 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, TP.HCM (Trường ITC)'
                    ]
                }]);
                setDangTraCuu(false);
                setHienModalKetQua(true);
                return;
            }

            // 3. Nếu KHÔNG TÌM THẤY trong bất kỳ DB nào -> Báo lỗi lịch sự, rõ ràng qua Popup
            setThongBaoLoi(
                res?.thong_diep || `Không tìm thấy thông tin bảo hành cho mã "${q}". Quý khách vui lòng kiểm tra lại Số Serial, Mã đơn hàng hoặc Số điện thoại mua hàng.`
            );
            setHienModalKetQua(true);
        } catch (err) {
            console.error('Lỗi khi tra cứu bảo hành:', err);
            setThongBaoLoi(`Không thể kết nối đến máy chủ bảo hành. Quý khách vui lòng thử lại sau hoặc gọi hotline 0948.37.79.79.`);
            setHienModalKetQua(true);
        } finally {
            setDangTraCuu(false);
        }
    };

    const xuLyTraCuu = (e) => {
        e.preventDefault();
        thucHienTraCuu(soSerial);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-16">
            {/* 1. Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
                    <Home className="w-3.5 h-3.5" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-bold text-slate-900 dark:text-white">Tra Cứu Bảo Hành Điện Tử</span>
            </nav>

            {/* 2. Hero Search Box Hiện Đại & Trực Quan */}
            <div className="relative overflow-hidden rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-300 dark:border-slate-700 shadow-xl shadow-slate-900/5 p-6 sm:p-9 text-center space-y-5">
                {/* Background Glow trang trí */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-gradient-to-r from-red-500/10 via-blue-500/10 to-emerald-500/10 blur-3xl pointer-events-none rounded-full" />

                {/* Badge & Tiêu đề */}
                <div className="relative space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#EA1E2C] dark:text-red-400 text-xs font-black tracking-wide uppercase">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Hệ Thống Bảo Hành Điện Tử TNTP</span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                        TRA CỨU THỜI HẠN BẢO HÀNH
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                        Kiểm tra nhanh tình trạng bảo hành, nguồn gốc chính hãng và quyền lợi hỗ trợ kỹ thuật
                    </p>
                </div>

                {/* Form Tra cứu */}
                <form onSubmit={xuLyTraCuu} className="relative max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            required
                            value={soSerial}
                            onChange={(e) => setSoSerial(e.target.value)}
                            placeholder="Nhập Serial máy, Mã đơn (LPN-...), hoặc SĐT mua hàng..."
                            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/90 border-2 border-slate-300 dark:border-slate-600 text-xs sm:text-sm text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-[#0052cc]/20 focus:border-[#0052cc] transition-all shadow-xs uppercase placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                        />
                        {soSerial && (
                            <button
                                type="button"
                                onClick={() => { setSoSerial(''); setThongBaoLoi(''); setKetQua(null); }}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={dangTraCuu}
                        className="px-7 py-3.5 rounded-2xl bg-[#EA1E2C] hover:bg-[#c91824] active:scale-95 text-white font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md shadow-red-500/20 disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
                    >
                        {dangTraCuu ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Đang kiểm tra...</span>
                            </>
                        ) : (
                            <>
                                <Search className="w-4 h-4" />
                                <span>Tra Cứu Ngay</span>
                            </>
                        )}
                    </button>
                </form>

                {/* Nút Mở Popup Hướng Dẫn */}
                <div className="relative pt-1 flex items-center justify-center text-xs">
                    <button
                        type="button"
                        onClick={() => setHienModalHuongDan(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-blue-50 hover:text-[#0052cc] dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs border-2 border-slate-300 dark:border-slate-600 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                        <HelpCircle className="w-4 h-4 text-[#0052cc] dark:text-cyan-400" />
                        <span>Xem hướng dẫn tìm Số Serial, Mã đơn hàng hoặc tra theo SĐT</span>
                    </button>
                </div>
            </div>

            {/* 3. Khối Chính Sách Cam Kết Dịch Vụ - Giúp trang cân đối, chuyên nghiệp */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-300/90 dark:border-slate-700 shadow-md shadow-slate-900/5 hover:shadow-lg hover:border-blue-400 dark:hover:border-slate-600 transition-all duration-200 space-y-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center border border-blue-200/80 dark:border-blue-800/80 shadow-xs">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Bảo Hành 24 Tháng Chính Hãng</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Toàn bộ sản phẩm phân phối tại LaptopNew đều được bảo hành chính hãng theo tiêu chuẩn của nhà sản xuất.
                    </p>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-300/90 dark:border-slate-700 shadow-md shadow-slate-900/5 hover:shadow-lg hover:border-emerald-400 dark:hover:border-slate-600 transition-all duration-200 space-y-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/80 dark:border-emerald-800/80 shadow-xs">
                        <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">1 Đổi 1 Trong 30 Ngày</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Nếu phát sinh lỗi phần cứng từ nhà sản xuất trong 30 ngày đầu, quý khách được đổi mới sản phẩm tương đương ngay.
                    </p>
                </div>

                <div className="p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 border-2 border-slate-300/90 dark:border-slate-700 shadow-md shadow-slate-900/5 hover:shadow-lg hover:border-red-400 dark:hover:border-slate-600 transition-all duration-200 space-y-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#EA1E2C] dark:text-red-400 flex items-center justify-center border border-red-200/80 dark:border-red-800/80 shadow-xs">
                        <Phone className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Hỗ Trợ Kỹ Thuật Tận Nơi</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Đội ngũ kỹ thuật viên giàu kinh nghiệm hỗ trợ kiểm tra, vệ sinh máy và tiếp nhận bảo hành tận nơi qua tổng đài 0948.37.79.79.
                    </p>
                </div>
            </div>

            {/* 4. POPUP MODAL HIỂN THỊ KẾT QUẢ TRA CỨU (KHI TRA CỨU XONG SẼ BẬT POPUP NGAY) */}
            {mounted && typeof document !== 'undefined' && hienModalKetQua && createPortal(
                <div
                    onClick={() => setHienModalKetQua(false)}
                    className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
                >
                    <div
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* TRƯỜNG HỢP 1: KHÔNG TÌM THẤY (LỖI HOẶC CHƯA CÓ DỮ LIỆU) */}
                        {thongBaoLoi && (
                            <div className="space-y-0">
                                {/* Header Modal Lỗi Cao Cấp & Trực Quan */}
                                <div className="p-5 sm:p-6 bg-gradient-to-r from-rose-500/15 via-red-500/10 to-amber-500/10 dark:from-rose-950/50 dark:via-red-950/40 dark:to-slate-900 border-b border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-red-500/30">
                                            <ShieldAlert className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-tight">
                                                    KẾT QUẢ TRA CỨU BẢO HÀNH
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[11px] font-black uppercase shadow-xs">
                                                    Không khớp
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Hồ sơ thiết bị chưa được kích hoạt trong hệ thống
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHienModalKetQua(false)}
                                        className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Nội dung lỗi - Phân vùng màu sắc sắc nét & Cực kỳ dễ hiểu */}
                                <div className="p-5 sm:p-6 space-y-4">
                                    {/* Vùng 1: Thẻ thông báo nổi bật */}
                                    <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-r from-rose-50 via-red-50/60 to-orange-50/30 dark:from-rose-950/40 dark:via-red-950/30 dark:to-slate-900 border-2 border-rose-200 dark:border-rose-900/60 flex items-start gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0 animate-ping" />
                                        <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                                            <span>Không tìm thấy thông tin bảo hành cho mã: </span>
                                            <span className="inline-block px-2.5 py-0.5 bg-red-600 text-white font-mono font-black rounded-lg shadow-xs uppercase tracking-wider mx-1">
                                                {soSerial}
                                            </span>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                Mã này chưa được đăng ký trong hệ thống hoặc chưa phát sinh đơn hàng thực tế tại TNTP Laptop.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Tiêu đề nhóm gợi ý */}
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">
                                        <Sparkles className="w-4 h-4 text-amber-500" />
                                        <span>Gợi ý cách tra cứu chính xác theo 3 phương thức:</span>
                                    </div>

                                    {/* Vùng 2: 3 Khối Gợi Ý Màu Sắc Trực Quan (3 Vùng Riêng Biệt, Dễ Hiểu) */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {/* Khối 1: Serial Laptop (Xanh Dương) */}
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/60 dark:from-blue-950/40 dark:to-slate-900 border-2 border-blue-200/90 dark:border-blue-800/80 space-y-2 hover:border-blue-400 transition-all">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-xl bg-[#0052cc] text-white flex items-center justify-center shadow-xs">
                                                    <Laptop className="w-4 h-4" />
                                                </div>
                                                <span className="text-[#0052cc] dark:text-cyan-400 font-black text-xs">
                                                    SỐ SERIAL (S/N)
                                                </span>
                                            </div>
                                            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Xem tem nhãn dán ở <strong className="text-slate-800 dark:text-white">mặt đáy laptop</strong> hoặc vào <code className="font-mono text-[11px] bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded">Settings &gt; About</code>.
                                            </p>
                                        </div>

                                        {/* Khối 2: Số Điện Thoại (Xanh Lá) */}
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/40 dark:to-slate-900 border-2 border-emerald-200/90 dark:border-emerald-800/80 space-y-2 hover:border-emerald-400 transition-all">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                                    <Smartphone className="w-4 h-4" />
                                                </div>
                                                <span className="text-emerald-700 dark:text-emerald-400 font-black text-xs">
                                                    SỐ ĐIỆN THOẠI
                                                </span>
                                            </div>
                                            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Nhập đúng <strong className="text-slate-800 dark:text-white">10 số điện thoại</strong> bạn đã cung cấp khi mua máy tại cửa hàng hoặc đặt online.
                                            </p>
                                        </div>

                                        {/* Khối 3: Mã Đơn Hàng (Tím) */}
                                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50/60 dark:from-purple-950/40 dark:to-slate-900 border-2 border-purple-200/90 dark:border-purple-800/80 space-y-2 hover:border-purple-400 transition-all">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                                                    <Receipt className="w-4 h-4" />
                                                </div>
                                                <span className="text-purple-700 dark:text-purple-400 font-black text-xs">
                                                    MÃ ĐƠN HÀNG
                                                </span>
                                            </div>
                                            <p className="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed">
                                                Kiểm tra mã dạng <code className="font-mono text-[11px] bg-purple-100 dark:bg-purple-900/50 px-1 py-0.5 rounded text-purple-700 dark:text-purple-300">LPN-...</code> trong tin nhắn SMS hoặc Email sau khi mua.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Modal Lỗi - Nút bấm rõ ràng, tương phản cao */}
                                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => { setHienModalKetQua(false); setHienModalHuongDan(true); }}
                                            className="px-4 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/20 active:scale-95"
                                        >
                                            <HelpCircle className="w-4 h-4" />
                                            <span>Xem hướng dẫn chi tiết vị trí Serial</span>
                                        </button>
                                        <a
                                            href="tel:0948377979"
                                            className="px-4 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 hover:bg-red-100 text-[#EA1E2C] dark:text-red-400 font-bold transition-colors flex items-center gap-1.5 border border-red-200 dark:border-red-900"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>Hotline: 0948.37.79.79</span>
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHienModalKetQua(false)}
                                        className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold transition-all cursor-pointer active:scale-95"
                                    >
                                        ✕ Đóng & Thử lại
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* TRƯỜNG HỢP 2: TÌM THẤY BẢO HÀNH CHÍNH HÃNG HỢP LỆ */}
                        {ketQua && ketQua.length > 0 && (
                            <div className="space-y-0">
                                {/* Header Modal Thành Công */}
                                <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/15 via-blue-500/10 to-teal-500/10 dark:from-emerald-950/50 dark:via-blue-950/40 dark:to-slate-900 border-b border-emerald-200/80 dark:border-emerald-900/50 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 shrink-0">
                                            <ShieldCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase tracking-tight">
                                                    Chứng Nhận Bảo Hành Điện Tử
                                                </h3>
                                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    <span>Chính Hãng</span>
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                Dữ liệu được xác thực trực tiếp từ hệ thống TNTP Laptop
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHienModalKetQua(false)}
                                        className="w-9 h-9 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Danh sách sản phẩm bảo hành */}
                                <div className="p-5 sm:p-6 space-y-4 max-h-[62vh] overflow-y-auto">
                                    {ketQua.map((item, idx) => (
                                        <div key={idx} className="space-y-4">
                                            {/* Thông tin máy */}
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/40 dark:from-slate-800/80 dark:to-slate-800/40 border-2 border-slate-200 dark:border-slate-700">
                                                <div className="relative w-20 h-16 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                                                    <Image
                                                        src={item.hinh_anh}
                                                        alt={item.ten_san_pham}
                                                        fill
                                                        className="object-contain p-1"
                                                        unoptimized
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white line-clamp-2">
                                                        {item.ten_san_pham}
                                                    </h4>
                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono">
                                                        <span>Serial: <strong className="text-[#0052cc] dark:text-cyan-400">{item.so_serial}</strong></span>
                                                        <span>•</span>
                                                        <span>Chủ sở hữu: <strong className="text-slate-700 dark:text-slate-300 font-sans">{item.khach_hang}</strong> ({item.so_dien_thoai})</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Lưới Thời Hạn Bảo Hành - 3 Màu Sắc Nổi Bật */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/40 dark:to-slate-900 border-2 border-blue-200 dark:border-blue-800/80 space-y-1">
                                                    <span className="text-[11px] font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span>Ngày Kích Hoạt</span>
                                                    </span>
                                                    <div className="font-black text-slate-900 dark:text-white text-sm">
                                                        {item.ngay_kich_hoat}
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/40 dark:to-slate-900 border-2 border-emerald-200 dark:border-emerald-800/80 space-y-1">
                                                    <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        <span>Hạn Bảo Hành</span>
                                                    </span>
                                                    <div className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                                        {item.ngay_het_han}
                                                    </div>
                                                </div>

                                                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 dark:from-amber-950/40 dark:to-slate-900 border-2 border-amber-200 dark:border-amber-800/80 space-y-1">
                                                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                                        <ShieldCheck className="w-3.5 h-3.5" />
                                                        <span>Thời Gian Còn Lại</span>
                                                    </span>
                                                    <div className="font-black text-amber-600 dark:text-amber-400 text-xs">
                                                        {item.trang_thai}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Gói Dịch Vụ Vàng */}
                                            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50/40 to-amber-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-slate-900 border-2 border-amber-300/80 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 font-semibold flex items-center gap-2.5">
                                                <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                                                    <Sparkles className="w-4 h-4" />
                                                </div>
                                                <span>{item.goi_dich_vu}</span>
                                            </div>

                                            {/* Trung Tâm Bảo Hành */}
                                            <div className="space-y-1.5 text-xs pt-1">
                                                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                                    <span>Địa chỉ trung tâm tiếp nhận chính hãng:</span>
                                                </span>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    {item.trung_tam_bao_hanh?.map((tt, tIdx) => (
                                                        <div key={tIdx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11.5px] flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                            <span>{tt}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Modal Thành Công */}
                                <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => window.print()}
                                            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                                        >
                                            <Printer className="w-3.5 h-3.5" />
                                            <span>In phiếu xác nhận</span>
                                        </button>
                                        <a
                                            href="tel:0948377979"
                                            className="px-4 py-2 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                                        >
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>Tổng đài: 0948.37.79.79</span>
                                        </a>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setHienModalKetQua(false)}
                                        className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 font-bold transition-colors cursor-pointer"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* 5. POPUP MODAL HƯỚNG DẪN TRA CỨU BẢO HÀNH (TRỰC QUAN, KHÔNG BỊ CHE KHUẤT) */}
            {mounted && typeof document !== 'undefined' && hienModalHuongDan && createPortal(
                <div
                    onClick={() => setHienModalHuongDan(false)}
                    className="fixed inset-0 z-[999999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
                >
                    <div
                        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header Modal */}
                        <div className="p-5 sm:p-6 bg-gradient-to-r from-red-50 via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-blue-950/30 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-[#EA1E2C] text-white flex items-center justify-center shadow-sm">
                                    <HelpCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white uppercase">
                                        Hướng Dẫn Tìm Thông Tin Tra Cứu
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Chọn phương thức phù hợp để xác định nhanh thông tin bảo hành
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setHienModalHuongDan(false)}
                                className="w-9 h-9 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs Chọn Loại Tra Cứu */}
                        <div className="grid grid-cols-3 p-2 bg-slate-100/70 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 gap-1.5 text-xs">
                            <button
                                type="button"
                                onClick={() => setTabHuongDan('serial')}
                                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    tabHuongDan === 'serial'
                                        ? 'bg-white dark:bg-slate-900 text-[#EA1E2C] shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Laptop className="w-4 h-4" />
                                <span className="hidden sm:inline">Số Serial / IMEI</span>
                                <span className="sm:hidden">Serial</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTabHuongDan('order')}
                                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    tabHuongDan === 'order'
                                        ? 'bg-white dark:bg-slate-900 text-[#0052cc] dark:text-cyan-400 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Receipt className="w-4 h-4" />
                                <span className="hidden sm:inline">Mã Hoá Đơn</span>
                                <span className="sm:hidden">Mã Đơn</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setTabHuongDan('phone')}
                                className={`py-2.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                                    tabHuongDan === 'phone'
                                        ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                                }`}
                            >
                                <Smartphone className="w-4 h-4" />
                                <span className="hidden sm:inline">Số Điện Thoại</span>
                                <span className="sm:hidden">SĐT</span>
                            </button>
                        </div>

                        {/* Nội Dung Từng Tab */}
                        <div className="p-5 sm:p-6 space-y-4 max-h-[62vh] overflow-y-auto">
                            {/* TAB 1: SỐ SERIAL / IMEI */}
                            {tabHuongDan === 'serial' && (
                                <div className="space-y-3 text-xs animate-in fade-in duration-150">
                                    {/* Cách 1 */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-950 text-[#EA1E2C] flex items-center justify-center text-[11px] font-bold">1</span>
                                            Xem tại tem dán ở mặt đáy Laptop / Thân thiết bị (Chuẩn nhất)
                                        </span>
                                        <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                                            Lật mặt dưới của laptop lên, tìm tem nhãn của nhà sản xuất (ASUS, Acer, Dell, HP, Lenovo...) có in dòng chữ <strong className="text-slate-900 dark:text-white font-mono">S/N</strong>, <strong className="text-slate-900 dark:text-white font-mono">Serial Number</strong> hoặc <strong className="text-slate-900 dark:text-white font-mono">Service Tag</strong> (gồm 8 - 15 ký tự chữ & số).
                                        </p>
                                    </div>

                                    {/* Cách 2 */}
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] flex items-center justify-center text-[11px] font-bold">2</span>
                                            Xem trên vỏ hộp máy hoặc Phiếu xuất kho
                                        </span>
                                        <p className="text-slate-600 dark:text-slate-400 pl-7 leading-relaxed">
                                            Tại cạnh bên của thùng hộp đóng gói thiết bị luôn có tem dán mã vạch in sẵn số Serial của máy.
                                        </p>
                                    </div>

                                    {/* Cách 3: Xem trực tiếp trong Cài đặt Windows (Dễ nhất, không cần gõ lệnh) */}
                                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/40 space-y-2">
                                        <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 flex items-center justify-center text-[11px] font-bold">3</span>
                                            Xem trực tiếp trong Cài đặt Windows (Cực nhanh, áp dụng cho Windows 10 & 11)
                                        </span>
                                        <div className="text-slate-600 dark:text-slate-300 pl-7 space-y-1">
                                            <p>1. Bấm phím <strong>Windows</strong> trên bàn phím &rarr; Mở <strong>Settings (Cài đặt)</strong>.</p>
                                            <p>2. Chọn mục <strong>System (Hệ thống)</strong> &rarr; Chọn <strong>About (Giới thiệu / Thông tin thiết bị)</strong>.</p>
                                            <p>3. Tìm dòng <strong className="text-emerald-700 dark:text-emerald-400">"Serial number"</strong> là thấy ngay số Serial của máy!</p>
                                        </div>
                                    </div>

                                    {/* Cách 4: Lệnh PowerShell chính thức trên Windows (Thay thế wmic cũ) */}
                                    <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 space-y-2 border border-slate-800">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold flex items-center gap-2 text-white text-xs">
                                                <Terminal className="w-4 h-4 text-cyan-400" />
                                                Lệnh PowerShell lấy Serial (Chuẩn 100% mọi phiên bản Windows)
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copyToClipboard('Get-CimInstance Win32_BIOS | Select-Object -ExpandProperty SerialNumber', 'ps')}
                                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                                            >
                                                {daCopy === 'ps' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                                <span>{daCopy === 'ps' ? 'Đã chép lệnh' : 'Sao chép lệnh'}</span>
                                            </button>
                                        </div>
                                        <p className="text-[11px] text-slate-400">
                                            Mở <strong>PowerShell</strong> hoặc <strong>Terminal</strong> trên Windows và chạy lệnh sau:
                                        </p>
                                        <div className="p-2 rounded-xl bg-slate-950 font-mono text-cyan-300 text-xs select-all overflow-x-auto">
                                            Get-CimInstance Win32_BIOS | Select-Object -ExpandProperty SerialNumber
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: MÃ HOÁ ĐƠN / ĐƠN HÀNG */}
                            {tabHuongDan === 'order' && (
                                <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
                                    <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 space-y-2">
                                        <span className="font-bold text-[#0052cc] dark:text-cyan-400 flex items-center gap-2">
                                            <Receipt className="w-4 h-4" />
                                            Định dạng Mã đơn hàng: LPN-YYYY-XXXX
                                        </span>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Mỗi đơn hàng thành công tại LaptopNew đều được cấp một mã hoá đơn duy nhất (ví dụ: <strong className="font-mono text-blue-600 dark:text-cyan-400">LPN-2026-8899</strong>).
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-100">
                                            Nơi tìm mã đơn hàng:
                                        </span>
                                        <ul className="list-disc list-inside space-y-1.5 text-slate-500 dark:text-slate-400 pl-1">
                                            <li>Tin nhắn SMS hoặc Zalo OA xác nhận đặt hàng thành công.</li>
                                            <li>Email biên nhận hoá đơn điện tử gửi về hòm thư của quý khách.</li>
                                            <li>Phiếu xuất kho kiêm bảo hành in kèm theo thùng hàng khi nhận máy.</li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: SỐ ĐIỆN THOẠI MUA HÀNG */}
                            {tabHuongDan === 'phone' && (
                                <div className="space-y-3.5 text-xs animate-in fade-in duration-150">
                                    <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-2">
                                        <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" />
                                            Cách đơn giản nhất: Tra cứu bằng Số điện thoại
                                        </span>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            Quý khách chỉ cần nhập chính xác <strong className="text-slate-900 dark:text-white">10 số điện thoại</strong> đã cung cấp khi đặt hàng.
                                        </p>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                                        <span className="font-bold text-slate-800 dark:text-slate-100">
                                            Ưu điểm:
                                        </span>
                                        <p className="text-slate-500 dark:text-slate-400">
                                            Hệ thống sẽ tự động tổng hợp danh sách tất cả thiết bị mà quý khách đã từng mua tại hệ thống TNTP Laptop kèm thời hạn bảo hành tương ứng.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                                Hotline hỗ trợ: <strong className="text-[#EA1E2C]">0948.37.79.79</strong>
                            </span>
                            <button
                                type="button"
                                onClick={() => setHienModalHuongDan(false)}
                                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                            >
                                Đã hiểu & Quay lại tra cứu
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}

