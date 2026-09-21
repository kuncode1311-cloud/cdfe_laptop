'use client';
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Home, ChevronRight, Star, ShieldCheck, Truck, RotateCcw, Gift, ShoppingCart, GitCompare, Heart, Check, CreditCard, Sparkles } from 'lucide-react';
import { SanPhamService } from '@/services/san-pham.service';
import { formatCurrency, dinhDangTienVND, calculateSavings, tinhTienTietKiem } from '@/utils/formatCurrency';
import { useCart, useGioHang } from '@/contexts/CartContext';
import { useCompare, useSoSanh } from '@/contexts/CompareContext';
import { useWishlist, useYeuThich } from '@/contexts/WishlistContext';
import ThuVienAnhSanPham from '@/components/san-pham/ThuVienAnhSanPham';
import BangThongSoKyThuat from '@/components/san-pham/BangThongSoKyThuat';
import KhoHangChiNhanh from '@/components/san-pham/KhoHangChiNhanh';
import DanhGiaSanPham from '@/components/san-pham/DanhGiaSanPham';
import TheSanPham from '@/components/san-pham/TheSanPham';
export default function TrangChiTietSanPham({ params }) {
    const router = useRouter();
    const rawParams = use(params);
    const id = rawParams?.id ? decodeURIComponent(rawParams.id).trim() : '';

    const [sanPham, setSanPham] = useState(() => SanPhamService.laySanPhamTheoId(id));
    const [dangTai, setDangTai] = useState(!sanPham);

    // Nạp dữ liệu sản phẩm mới nhất từ MongoDB Atlas qua RESTful API
    useEffect(() => {
        let daHuy = false;
        if (!id) {
            setDangTai(false);
            return;
        }

        SanPhamService.laySanPhamTheoIdAsync(id).then((sp) => {
            if (!daHuy) {
                if (sp) {
                    setSanPham(sp);
                    if (sp.tuy_chon_phien_ban && sp.tuy_chon_phien_ban.length > 0) {
                        setTuyChonChon(sp.tuy_chon_phien_ban[0]);
                    }
                }
                setDangTai(false);
            }
        }).catch(() => {
            if (!daHuy) setDangTai(false);
        });
        return () => { daHuy = true; };
    }, [id]);

    const { themVaoGioHang } = useGioHang();
    const { themVaoSoSanh, kiemTraDaCoTrongSoSanh } = useSoSanh();
    const { chuyenDoiYeuThich, kiemTraDaThich } = useYeuThich();
    const [tuyChonChon, setTuyChonChon] = useState(sanPham?.tuy_chon_phien_ban && sanPham.tuy_chon_phien_ban.length > 0
        ? sanPham.tuy_chon_phien_ban[0]
        : undefined);
    const [tabHienTai, setTabHienTai] = useState('tong_quan');

    useEffect(() => {
        if (sanPham?.tuy_chon_phien_ban && sanPham.tuy_chon_phien_ban.length > 0 && !tuyChonChon) {
            setTuyChonChon(sanPham.tuy_chon_phien_ban[0]);
        }
    }, [sanPham, tuyChonChon]);

    if (dangTai) {
        return (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-slate-500">Đang tải thông tin sản phẩm từ máy chủ MongoDB...</p>
            </div>
        );
    }

    // Nếu không tìm thấy sản phẩm nào khớp
    if (!sanPham) {
        const sanPhamDeXuat = SanPhamService.layDanhSachBanChay(4);
        return (
            <div className="space-y-12 py-10">
                <div className="max-w-xl mx-auto text-center space-y-5 px-4">
                    <div className="w-20 h-20 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-cyan-400 flex items-center justify-center border border-blue-200 dark:border-blue-900 shadow-xl shadow-blue-500/10">
                        <Gift className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                            Không Tìm Thấy Sản Phẩm
                        </h1>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Mã sản phẩm hoặc đường dẫn <code className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-cyan-400 font-bold font-mono text-xs">{id}</code> không tồn tại hoặc đã ngừng kinh doanh.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                            href="/san-pham"
                            className="px-5 py-2.5 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Khám Phá Tất Cả Sản Phẩm</span>
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Về Trang Chủ</span>
                        </Link>
                    </div>
                </div>

                {/* Gợi ý sản phẩm nổi bật */}
                {sanPhamDeXuat.length > 0 && (
                    <div className="space-y-5 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                                Gợi Ý Sản Phẩm Bán Chạy Nhất Dành Cho Bạn
                            </h2>
                            <Link href="/san-pham" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline">
                                Xem thêm
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {sanPhamDeXuat.map((sp) => (
                                <TheSanPham key={sp.id} sanPham={sp} cheDoHienThi="luoi" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const giaHienTai = (sanPham.gia_khuyen_mai || 0) + (tuyChonChon ? tuyChonChon.chenh_lech_gia : 0);
    const giaGocHienTai = (sanPham.gia_goc || sanPham.gia_khuyen_mai || 0) + (tuyChonChon ? tuyChonChon.chenh_lech_gia : 0);
    const tienTietKiem = tinhTienTietKiem(giaGocHienTai, giaHienTai);
    const daTrongSoSanh = kiemTraDaCoTrongSoSanh(sanPham.id);
    const daYeuThich = kiemTraDaThich(sanPham.id);
    // Mua ngay chuyển thẳng đến giỏ hàng / thanh toán
    const xuLyMuaNgay = () => {
        themVaoGioHang(sanPham, tuyChonChon, 1);
        router.push('/gio-hang');
    };
    const sanPhamLienQuan = SanPhamService.laySanPhamTuongTu(sanPham.id, 4);
    const thuVienAnh = Array.isArray(sanPham.thu_vien_hinh_anh) && sanPham.thu_vien_hinh_anh.length > 0
        ? sanPham.thu_vien_hinh_anh
        : [sanPham.hinh_anh_chinh || '/placeholder.png'];
    const dacDiemNoiBat = Array.isArray(sanPham.dac_diem_noi_bat) ? sanPham.dac_diem_noi_bat : [];
    const quaTang = Array.isArray(sanPham.qua_tang) ? sanPham.qua_tang : [];
    const tonKho = Array.isArray(sanPham.ton_kho) ? sanPham.ton_kho : [];
    const danhGia = Array.isArray(sanPham.danh_gia) ? sanPham.danh_gia : [];
    return (
    <div className="pt-4 sm:pt-6 pb-16 space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      {/* 1. Breadcrumb Điều Hướng */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-cyan-400 flex items-center gap-1 font-medium transition-colors">
          <Home className="w-3.5 h-3.5"/>
          <span>Trang Chủ</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
        <Link href="/san-pham" className="hover:text-blue-600 dark:hover:text-cyan-400 font-medium transition-colors">
          Sản Phẩm
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
        <Link href={`/san-pham?hang=${sanPham.hang_san_xuat}`} className="uppercase font-bold text-[#0052cc] dark:text-cyan-400 hover:underline">
          {sanPham.hang_san_xuat}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300"/>
        <span className="font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
          {sanPham.ten_san_pham}
        </span>
      </nav>

      {/* 2. Phần Đầu Trang: Gallery Ảnh & Thông Tin Mua Hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cột Trái (5 Cột): Gallery Ảnh Đa Chiều & Video 3D & Đặc Điểm Nổi Bật (Cân đối bố cục) */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-3.5">
          <ThuVienAnhSanPham
            danhSachAnh={thuVienAnh}
            tenSanPham={sanPham.ten_san_pham}
            videoDemo={sanPham.video_demo}
            anhDaiDienTuyChon={tuyChonChon?.hinh_anh}
          />

          {/* Cam kết Vàng Dưới Gallery */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center text-[11px] text-slate-600 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mx-auto mb-1"/>
              <span className="font-bold text-slate-800 dark:text-slate-200">Chính Hãng 100%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <RotateCcw className="w-4 h-4 text-blue-600 dark:text-cyan-400 mx-auto mb-1"/>
              <span className="font-bold text-slate-800 dark:text-slate-200">1 Đổi 1 Trong 30N</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
              <Truck className="w-4 h-4 text-amber-500 mx-auto mb-1"/>
              <span className="font-bold text-slate-800 dark:text-slate-200">Giao Hỏa Tốc 2H</span>
            </div>
          </div>

          {/* Đặc Điểm Nổi Bật Nằm Ngay Dưới Ảnh (Giải quyết vùng trống cột trái) */}
          {dacDiemNoiBat.length > 0 && (
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 space-y-3 shadow-2xs">
              <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-[#0052cc] dark:text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Đặc Điểm Nổi Bật Đáng Chú Ý
                </h3>
              </div>
              <div className="space-y-2">
                {dacDiemNoiBat.map((dd, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-200 leading-relaxed hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0052cc] dark:bg-cyan-400 mt-1.5 shrink-0" />
                    <span className="font-medium">{dd}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Cột Phải (7 Cột): Tên, Giá, Cấu Hình, Quà Tặng, Nút Mua */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-4">
          {/* Tên & Mã Sản Phẩm */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-[#0052cc] text-white text-[11px] font-black uppercase tracking-wider shadow-xs">
                {sanPham.hang_san_xuat}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono text-xs font-bold border border-slate-200 dark:border-slate-700">
                SKU: {sanPham.ma_san_pham || 'CHÍNH HÃNG'}
              </span>
              <div className="flex items-center gap-1.5 ml-auto text-xs">
                <div className="flex items-center gap-0.5 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400"/>
                  <span className="font-black text-slate-800 dark:text-slate-100">{sanPham.diem_danh_gia_tb || 5}</span>
                </div>
                <span className="text-slate-400">({sanPham.so_luong_danh_gia || 0} đánh giá)</span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Đã bán {sanPham.so_luong_da_ban || 18}</span>
              </div>
            </div>

            <h1 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-snug tracking-tight">
              {sanPham.ten_san_pham}
            </h1>
          </div>

          {/* Hộp Giá Bán & Tiết Kiệm Tinh Tế */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-red-50/60 via-slate-50/40 to-transparent dark:from-red-950/20 dark:via-slate-900/40 dark:to-transparent border border-red-200/80 dark:border-red-900/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-3">
              <div className="text-2xl sm:text-3xl font-black text-[#dc2626] dark:text-[#f87171] tracking-tight">
                {dinhDangTienVND(giaHienTai)}
              </div>

              {giaGocHienTai > giaHienTai && (<>
                  <div className="text-sm text-slate-400 line-through font-normal">
                    {dinhDangTienVND(giaGocHienTai)}
                  </div>
                  <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs shadow-xs">
                    -{sanPham.phan_tram_giam_gia || 0}%
                  </span>
                </>)}
            </div>

            {tienTietKiem > 0 && (
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
                Tiết kiệm {dinhDangTienVND(tienTietKiem)}
              </div>
            )}
          </div>

          {/* Chọn Phiên Bản Cấu Hình / Màu Sắc (Nếu có) */}
          {sanPham.tuy_chon_phien_ban && sanPham.tuy_chon_phien_ban.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Tùy Chọn Phiên Bản & Cấu Hình:</span>
                <span className="text-[11px] font-normal text-slate-400 lowercase">{sanPham.tuy_chon_phien_ban.length} lựa chọn</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sanPham.tuy_chon_phien_ban.map((opt) => {
                  const laChon = tuyChonChon?.ma_tuy_chon === opt.ma_tuy_chon;
                  return (
                    <button
                      key={opt.ma_tuy_chon}
                      onClick={() => setTuyChonChon(opt)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        laChon
                          ? 'border-[#0052cc] bg-blue-50/60 dark:bg-blue-950/40 text-[#0052cc] ring-2 ring-blue-500/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 bg-white dark:bg-slate-900/60'
                      }`}
                    >
                      <div className="font-bold text-xs flex items-center justify-between gap-2">
                        <span className={laChon ? 'text-[#0052cc] dark:text-cyan-400' : 'text-slate-900 dark:text-white'}>
                          {opt.ten_tuy_chon}
                        </span>
                        {laChon && <Check className="w-4 h-4 text-[#0052cc] dark:text-cyan-400 shrink-0"/>}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                        {opt.chenh_lech_gia === 0
                          ? 'Giá niêm yết chuẩn'
                          : opt.chenh_lech_gia > 0
                          ? `+${dinhDangTienVND(opt.chenh_lech_gia)}`
                          : `${dinhDangTienVND(opt.chenh_lech_gia)}`}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quà Tặng Kèm Giá Trị */}
          {quaTang.length > 0 && (
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/80 dark:border-amber-800/60 space-y-2">
              <div className="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider">
                <Gift className="w-4 h-4 text-amber-500 shrink-0"/>
                <span>ĐẶC QUYỀN QUÀ TẶNG TNTP (TRỊ GIÁ ĐẾN {dinhDangTienVND(quaTang.reduce((t, q) => t + (q.gia_tri || 0), 0))}):</span>
              </div>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {quaTang.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"/>
                    <span className="font-medium">{q.ten_qua_tang}</span>
                    {q.gia_tri > 0 && (
                      <span className="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 ml-auto shrink-0">
                        ({dinhDangTienVND(q.gia_tri)})
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Các Nút Mua Hàng Nhanh - Đồng bộ thương hiệu Royal Blue & Red */}
          <div className="space-y-2.5 pt-1">
            {/* Nút MUA NGAY */}
            <button
              onClick={xuLyMuaNgay}
              className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#dc2626] hover:from-[#be123c] hover:to-[#b91c1c] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all hover:scale-[1.01] cursor-pointer"
            >
              <span>MUA NGAY - GIAO HỎA TỐC 2H</span>
            </button>

            {/* Cặp Nút: Thêm Giỏ Hàng & Trả Góp 0% */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={() => themVaoGioHang(sanPham, tuyChonChon, 1)}
                className="py-2.5 px-4 rounded-xl bg-[#0052cc] hover:bg-[#003da5] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
              >
                <ShoppingCart className="w-4 h-4"/>
                <span>THÊM VÀO GIỎ HÀNG</span>
              </button>

              <Link
                href="/thanh-toan"
                onClick={() => themVaoGioHang(sanPham, tuyChonChon, 1)}
                className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors text-center"
              >
                <CreditCard className="w-4 h-4 text-amber-400"/>
                <span>MUA TRẢ GÓP 0% LÃI SUẤT</span>
              </Link>
            </div>

            {/* Nút So Sánh & Yêu Thích Nhanh */}
            <div className="flex items-center gap-2.5 pt-0.5">
              <button
                onClick={() => themVaoSoSanh(sanPham)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  daTrongSoSanh
                    ? 'bg-blue-50 border-blue-500 text-[#0052cc]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <GitCompare className="w-3.5 h-3.5 text-[#0052cc]"/>
                <span>{daTrongSoSanh ? 'Đã Trong So Sánh' : 'So Sánh Sản Phẩm'}</span>
              </button>

              <button
                onClick={() => chuyenDoiYeuThich(sanPham)}
                className={`flex-1 py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  daYeuThich
                    ? 'bg-rose-50 border-rose-500 text-rose-600'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 text-rose-500 ${daYeuThich ? 'fill-current' : ''}`}/>
                <span>{daYeuThich ? 'Đã Lưu Yêu Thích' : 'Lưu Vào Yêu Thích'}</span>
              </button>
            </div>
          </div>

          {/* Kiểm Tra Kho Hàng Tại Các Showroom */}
          <KhoHangChiNhanh danhSachKho={tonKho}/>
        </div>
      </div>

      {/* 3. Phần Tabs Chi Tiết: Bố Cục 12 Cột Thông Minh Cân Đối Hai Bên Chuẩn Thẳng Hàng */}
      <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cột Trái Chính (8 Cột): Tab Điều Hướng & Nội Dung Đa Sắc Phân Vùng */}
          <div className="lg:col-span-8 space-y-5">
            {/* Nút Chuyển Tab Dạng Pill Chuẩn Thế Giới Di Động */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setTabHienTai('tong_quan')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  tabHienTai === 'tong_quan'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Mô tả
              </button>

              <button
                type="button"
                onClick={() => setTabHienTai('thong_so')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  tabHienTai === 'thong_so'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Thông số kỹ thuật
              </button>

              <button
                type="button"
                onClick={() => setTabHienTai('danh_gia')}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-[13.5px] font-bold border transition-all cursor-pointer whitespace-nowrap ${
                  tabHienTai === 'danh_gia'
                    ? 'bg-blue-50 dark:bg-blue-950/70 border-blue-400 dark:border-cyan-400 text-[#0052cc] dark:text-cyan-400 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                Đánh giá ({sanPham.so_luong_danh_gia || 0})
              </button>
            </div>

            {/* Nội Dung Từng Tab Chiếm Trọn 8 Cột (Không bị lệch hay trống trải) */}
            {tabHienTai === 'tong_quan' && (
              <div className="space-y-4">
                {/* Mô tả chi tiết */}
                <div className="rounded-2xl bg-white dark:bg-slate-900 p-5 sm:p-6 space-y-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200/90 dark:border-slate-800 shadow-2xs">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#0052cc] dark:text-cyan-400" />
                    <span>Trải Nghiệm & Đánh Giá Chuyên Sâu Từ TNTP LAPTOP</span>
                  </h3>
                  <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                    {sanPham.mo_ta_chi_tiet || 'Sản phẩm chính hãng với cấu hình mạnh mẽ, hiệu năng xuất sắc và độ bền bỉ cao.'}
                  </p>
                  <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 text-xs text-blue-900 dark:text-blue-200 space-y-1.5">
                    <p className="font-bold">✦ Đặc quyền cam kết chất lượng dịch vụ TNTP:</p>
                    <p>
                      Toàn bộ thiết bị đều trải qua quy trình kiểm định 18 bước tiêu chuẩn trước khi tới tay khách hàng. Đổi mới 1-1 trong 30 ngày nếu phát sinh lỗi phần cứng, bảo hành chính hãng 24 tháng kèm dịch vụ bảo dưỡng, vệ sinh trọn đời trên toàn quốc.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {tabHienTai === 'thong_so' && (
              <BangThongSoKyThuat thongSo={sanPham.thong_so || {}} sanPham={sanPham} />
            )}

            {tabHienTai === 'danh_gia' && (
              <DanhGiaSanPham
                idSanPham={sanPham.id || id}
                danhSachDanhGia={danhGia}
                diemTrungBinh={sanPham.diem_danh_gia_tb || 5}
                tongSoDanhGia={sanPham.so_luong_danh_gia || 0}
                tenSanPham={sanPham.ten_san_pham}
                hinhAnhSanPham={sanPham.hinh_anh_chinh || (thuVienAnh && thuVienAnh[0]) || ''}
              />
            )}
          </div>

          {/* Cột Phải Phụ (4 Cột): Widget Mua Nhanh Cố Định (Sticky) & Hỗ Trợ 24/7 */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            {/* Thẻ Tóm Tắt & Mua Nhanh Khi Đang Cuộn Trang */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-4 sm:p-5 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 shrink-0 p-1">
                  <img
                    src={sanPham.hinh_anh_chinh || (thuVienAnh[0] || '/placeholder.png')}
                    alt={sanPham.ten_san_pham}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <h4 className="font-bold text-xs sm:text-[13px] text-slate-900 dark:text-white line-clamp-2 leading-tight">
                    {sanPham.ten_san_pham}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-black text-[#dc2626] dark:text-[#f87171]">
                      {dinhDangTienVND(giaHienTai)}
                    </span>
                    {giaGocHienTai > giaHienTai && (
                      <span className="text-[11px] text-slate-400 line-through">
                        {dinhDangTienVND(giaGocHienTai)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Nút Mua Nhanh Ngay Tại Chỗ */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={xuLyMuaNgay}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#e11d48] to-[#dc2626] hover:from-[#be123c] hover:to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all cursor-pointer text-center"
                >
                  MUA NGAY - GIAO HỎA TỐC
                </button>
                <button
                  type="button"
                  onClick={() => themVaoGioHang(sanPham, tuyChonChon, 1)}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 text-[#0052cc] dark:text-cyan-400 font-bold text-xs border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>THÊM VÀO GIỎ HÀNG</span>
                </button>
              </div>
            </div>

            {/* Hộp Thông Tin Cam Kết Vàng TNTP LAPTOP */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800/40 border border-slate-200/90 dark:border-slate-800 p-4 space-y-2.5 text-xs">
              <span className="font-extrabold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block pb-1 border-b border-slate-200/80 dark:border-slate-800">
                Yên Tâm Mua Sắm Tại TNTP LAPTOP:
              </span>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>100% Sản phẩm chính hãng nguyên seal</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-blue-600 dark:text-cyan-400 shrink-0" />
                  <span>Bao test lỗi 1 đổi 1 trong 30 ngày đầu</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Miễn phí giao hàng hỏa tốc 2 giờ</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>Trả góp 0% lãi suất xét duyệt nhanh 5 phút</span>
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 text-[11.5px] font-bold text-slate-500">
                Hotline hỗ trợ miễn phí: <a href="tel:1900232460" className="text-[#0052cc] dark:text-cyan-400 hover:underline">1900.232.460</a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Sản Phẩm Tương Tự / Cùng Phân Khúc */}
      {sanPhamLienQuan.length > 0 && (<div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              SẢN PHẨM TƯƠNG TỰ CÙNG PHÂN KHÚC
            </h2>
            <Link href="/san-pham" className="text-xs font-bold text-sky-600 dark:text-cyan-400 hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {sanPhamLienQuan.map((sp) => (<TheSanPham key={sp.id} sanPham={sp} cheDoHienThi="luoi"/>))}
          </div>
        </div>)}
    </div>);
}
