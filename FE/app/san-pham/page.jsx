'use client';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Home, ChevronRight, Laptop, AlertTriangle, RefreshCw } from 'lucide-react';
import { SanPhamService } from '@/services/san-pham.service';
import { DANH_SACH_DANH_MUC_ANH } from '@/components/san-pham/BoLocThongMinhAllInOne';
import ThanhTopBarLocDinh from '@/components/san-pham/ThanhTopBarLocDinh';
import BannerDanhMucManh from '@/components/san-pham/BannerDanhMucManh';
import ThanhBoLocTinhGon from '@/components/san-pham/ThanhBoLocTinhGon';
import BoLocSanPhamComponent from '@/components/san-pham/BoLocSanPham';
import TheSanPham from '@/components/san-pham/TheSanPham';
import KhuVucDangTaiTable from '@/components/admin/KhuVucDangTaiTable';

function NoiDungDanhSachSanPham() {
    const searchParams = useSearchParams();

    // Đọc params từ URL
    const hangParam = searchParams.get('hang');
    const danhMucParam = searchParams.get('danh_muc');
    const tuKhoaParam = searchParams.get('tu_khoa') || '';

    const [boLoc, setBoLoc] = useState({
        tu_khoa: tuKhoaParam,
        hang_san_xuat: hangParam ? [hangParam] : [],
        danh_muc: danhMucParam ? [danhMucParam] : [],
        card_do_hoa: [],
        cpu_dong: [],
        ram_dung_luong: [],
        muc_gia_toi_thieu: undefined,
        muc_gia_toi_da: undefined,
        ho_tro_tra_gop_0: false,
        sap_xep: 'moi_nhat'
    });

    const [dangLoc, setDangLoc] = useState(false);
    const daMountBoLocRef = React.useRef(false);

    useEffect(() => {
        if (!daMountBoLocRef.current) {
            daMountBoLocRef.current = true;
            return;
        }
        setDangLoc(true);
        const timer = setTimeout(() => setDangLoc(false), 320);
        return () => clearTimeout(timer);
    }, [boLoc]);

    const [cheDoHienThi, setCheDoHienThi] = useState('luoi');
    const [moBoLocToanDien, setMoBoLocToanDien] = useState(false);
    const [daCuonXuong, setDaCuonXuong] = useState(false);

    // Theo dõi cuộn trang: Cuộn nhẹ > 70px là ẩn Header chính và hiện ngay Topbar danh mục
    useEffect(() => {
        const xuLyCuon = () => {
            const daCuon = window.scrollY > 70;
            setDaCuonXuong(daCuon);
            if (daCuon) {
                document.body.classList.add('an-topbar-chinh');
            } else {
                document.body.classList.remove('an-topbar-chinh');
            }
        };

        window.addEventListener('scroll', xuLyCuon, { passive: true });
        xuLyCuon(); // Kiểm tra tức thì khi tải trang

        return () => {
            window.removeEventListener('scroll', xuLyCuon);
            document.body.classList.remove('an-topbar-chinh');
        };
    }, []);

    // Đồng bộ khi URL thay đổi
    useEffect(() => {
        setBoLoc((cu) => ({
            ...cu,
            tu_khoa: tuKhoaParam,
            hang_san_xuat: hangParam ? [hangParam] : cu.hang_san_xuat,
            danh_muc: danhMucParam ? [danhMucParam] : cu.danh_muc
        }));
    }, [hangParam, danhMucParam, tuKhoaParam]);

    // Đồng bộ sản phẩm 100% từ MongoDB Atlas qua API
    const [tatCaSanPham, setTatCaSanPham] = useState([]);
    const [dangTaiSanPham, setDangTaiSanPham] = useState(true);
    const [loiKetNoi, setLoiKetNoi] = useState(null);

    const taiLaiDuLieu = () => {
        setDangTaiSanPham(true);
        setLoiKetNoi(null);
        SanPhamService.layTatCaSanPhamAsync()
            .then((data) => {
                setTatCaSanPham(Array.isArray(data) ? data : []);
                setLoiKetNoi(null);
                setDangTaiSanPham(false);
            })
            .catch((err) => {
                console.error('Lỗi kết nối MongoDB Atlas:', err);
                setLoiKetNoi('Không thể kết nối đến máy chủ MongoDB Atlas. Vui lòng kiểm tra lại dịch vụ Backend.');
                setDangTaiSanPham(false);
            });
    };

    useEffect(() => {
        let daHuy = false;
        // Kiểm tra bộ nhớ đệm nếu đã có
        const cache = SanPhamService.layTatCaSanPham();
        if (cache && cache.length > 0) {
            setTatCaSanPham(cache);
            setDangTaiSanPham(false);
        }

        SanPhamService.layTatCaSanPhamAsync()
            .then((data) => {
                if (!daHuy) {
                    if (Array.isArray(data) && data.length > 0) {
                        setTatCaSanPham(data);
                    }
                    setLoiKetNoi(null);
                    setDangTaiSanPham(false);
                }
            })
            .catch((err) => {
                if (!daHuy) {
                    console.error('Lỗi kết nối MongoDB Atlas:', err);
                    setLoiKetNoi('Không thể kết nối đến máy chủ MongoDB Atlas. Vui lòng kiểm tra lại dịch vụ Backend.');
                    setDangTaiSanPham(false);
                }
            });
        return () => { daHuy = true; };
    }, []);

    // Thống kê số lượng theo danh mục cho Topbar
    const danhSachDanhMucTopbar = useMemo(() => {
        const demDanhMuc = {};
        (tatCaSanPham || []).forEach(sp => {
            if (!sp) return;
            const dsDm = Array.isArray(sp.danh_muc) ? sp.danh_muc : (typeof sp.danh_muc === 'string' ? [sp.danh_muc] : []);
            dsDm.forEach(dm => {
                demDanhMuc[dm] = (demDanhMuc[dm] || 0) + 1;
            });
        });
        return DANH_SACH_DANH_MUC_ANH.map(dm => ({
            ...dm,
            count: dm.ma ? (demDanhMuc[dm.ma] || 0) : (tatCaSanPham?.length || 0)
        }));
    }, [tatCaSanPham]);

    // Thực hiện lọc dữ liệu
    const danhSachLoc = useMemo(() => {
        return SanPhamService.locSanPham(boLoc, tatCaSanPham);
    }, [boLoc, tatCaSanPham]);

    // Đặt lại toàn bộ bộ lọc
    const datLaiBoLoc = () => {
        setBoLoc({
            tu_khoa: '',
            hang_san_xuat: [],
            danh_muc: [],
            card_do_hoa: [],
            cpu_dong: [],
            ram_dung_luong: [],
            muc_gia_toi_thieu: undefined,
            muc_gia_toi_da: undefined,
            tam_nen: [],
            ho_tro_tra_gop_0: false,
            sap_xep: 'moi_nhat'
        });
    };

    // Đếm số lượng tiêu chí đang chọn
    const soLuongDangLoc =
        (boLoc.hang_san_xuat?.length || 0) +
        (boLoc.card_do_hoa?.length || 0) +
        (boLoc.cpu_dong?.length || 0) +
        (boLoc.ram_dung_luong?.length || 0) +
        (boLoc.muc_gia_toi_thieu !== undefined || boLoc.muc_gia_toi_da !== undefined ? 1 : 0) +
        (boLoc.ho_tro_tra_gop_0 ? 1 : 0) +
        (boLoc.tu_khoa?.trim() ? 1 : 0);

    return (
        <div className="space-y-3 sm:space-y-3.5">
            {/* 1. THANH TOPBAR DANH MỤC TINH GỌN (Luôn hiển thị trên đỉnh trang, có ảnh thumbnail và nút lên đầu) */}
            <ThanhTopBarLocDinh
                boLocHienTai={boLoc}
                onThayDoiBoLoc={setBoLoc}
                danhSachDanhMuc={danhSachDanhMucTopbar}
                daCuonXuong={daCuonXuong}
                onCuonLenDauTrang={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                onMoBoLocToanDien={() => setMoBoLocToanDien(true)}
                soLuongDangLoc={soLuongDangLoc}
                tongKetQua={danhSachLoc.length}
            />

            {/* 2. Breadcrumb Tinh Gọn */}
            <nav className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    <span>Trang Chủ</span>
                </Link>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="font-bold text-slate-800 dark:text-slate-200">Cửa Hàng</span>
                {boLoc.danh_muc && boLoc.danh_muc.length > 0 && (
                    <>
                        <ChevronRight className="w-3 h-3 text-slate-300" />
                        <span className="font-extrabold text-[#0052cc] dark:text-cyan-400 uppercase">
                            {DANH_SACH_DANH_MUC_ANH.find(d => d.ma === boLoc.danh_muc[0])?.ten || boLoc.danh_muc[0]}
                        </span>
                    </>
                )}
            </nav>

            {/* 3. TIÊU ĐỀ & BANNER DANH MỤC MẢNH MAI (Có ảnh đại diện, tên danh mục và mô tả ngắn) */}
            <BannerDanhMucManh
                danhMucHienTai={boLoc.danh_muc}
                tongSoLuong={danhSachLoc.length}
            />

            {/* 4. THANH BỘ LỌC 1 DÒNG TINH GỌN (Dropdown Thương hiệu, Giá, CPU, GPU, Trả góp 0%, Sắp xếp) */}
            <ThanhBoLocTinhGon
                boLocHienTai={boLoc}
                onThayDoiBoLoc={setBoLoc}
                onMoBoLocToanDien={() => setMoBoLocToanDien(true)}
                soLuongDangLoc={soLuongDangLoc}
                tatCaSanPham={tatCaSanPham}
                tongKetQua={danhSachLoc.length}
                cheDoHienThi={cheDoHienThi}
                onThayDoiCheDoHienThi={setCheDoHienThi}
                onDatLaiBoLoc={datLaiBoLoc}
            />

            {/* 5. LƯỚI SẢN PHẨM 4 CỘT HIỂN THỊ RỘNG RÃI NGAY TRÊN ĐẦU TRANG */}
            <div className="relative min-h-[400px]">
                <KhuVucDangTaiTable
                    dangTai={dangLoc}
                    tieuDe="Đang áp dụng bộ lọc sản phẩm..."
                    moTa={`Tìm thấy ${danhSachLoc.length} laptop & phụ kiện phù hợp`}
                />
                <div className={`transition-opacity duration-300 ${dangLoc ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
                    {loiKetNoi ? (
                        /* Trạng thái lỗi kết nối MongoDB Atlas thật */
                        <div className="p-12 text-center rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 space-y-4 shadow-sm">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/40 text-red-600 mx-auto flex items-center justify-center">
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-base font-bold text-red-800 dark:text-red-300">
                                Không Thể Kết Nối Máy Chủ MongoDB Atlas
                            </h3>
                            <p className="text-xs text-red-600/90 dark:text-red-400 max-w-md mx-auto leading-relaxed">
                                {loiKetNoi}
                            </p>
                            <button
                                onClick={taiLaiDuLieu}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-sm"
                            >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Thử Kết Nối Lại</span>
                            </button>
                        </div>
                    ) : dangTaiSanPham ? (
                        /* Trạng thái đang tải sản phẩm từ MongoDB */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 animate-pulse space-y-3">
                                    <div className="w-full h-44 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                                    <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : danhSachLoc.length > 0 ? (
                        <div className={cheDoHienThi === 'luoi'
                            ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4'
                            : 'space-y-3.5'}>
                            {danhSachLoc.map((sp) => (
                                <TheSanPham key={sp.id} sanPham={sp} cheDoHienThi={cheDoHienThi} />
                            ))}
                        </div>
                    ) : (
                        /* Trạng thái không tìm thấy sản phẩm */
                        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-600 mx-auto flex items-center justify-center">
                                <Laptop className="w-8 h-8" />
                            </div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                                Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn
                            </h3>
                            <p className="text-xs text-slate-400 max-w-md mx-auto">
                                Quý khách vui lòng thử bỏ bớt tiêu chí lọc hoặc xóa bộ lọc để xem toàn bộ danh mục.
                            </p>
                            <button
                                onClick={datLaiBoLoc}
                                className="px-5 py-2.5 rounded-xl bg-[#0052cc] text-white text-xs font-bold cursor-pointer hover:bg-[#003da5] transition-colors shadow-sm"
                            >
                                Xóa Bộ Lọc &amp; Xem Tất Cả
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 6. Drawer Bộ Lọc Toàn Diện (Mở trượt khi người dùng bấm nút "BỘ LỌC") */}
            <BoLocSanPhamComponent
                mo={moBoLocToanDien}
                onDong={() => setMoBoLocToanDien(false)}
                boLocHienTai={boLoc}
                onThayDoiBoLoc={setBoLoc}
                onDatLaiBoLoc={datLaiBoLoc}
                tatCaSanPham={tatCaSanPham}
                tongKetQua={danhSachLoc.length}
            />
        </div>
    );
}

export default function TrangDanhSachSanPham() {
    return (
        <Suspense fallback={<div className="py-20 text-center text-slate-400">Đang tải danh mục sản phẩm...</div>}>
            <NoiDungDanhSachSanPham />
        </Suspense>
    );
}
