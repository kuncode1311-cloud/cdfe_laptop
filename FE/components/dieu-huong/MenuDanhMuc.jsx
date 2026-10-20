"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronDown, Gamepad2, Keyboard, Laptop, Flame, ShieldCheck, ArrowRight, } from "lucide-react";
import { DanhMucService } from "@/services/danh-muc.service";
import { useDuLieuMoi } from '@/services/dong-bo.service';
export default function MenuDanhMuc() {
    const [menuDanhMucMo, setMenuDanhMucMo] = useState(false);
    const [menuChinhSachMo, setMenuChinhSachMo] = useState(false);
    const [menuTinTucMo, setMenuTinTucMo] = useState(false);
    const [danhSachThuongHieu, setDanhSachThuongHieu] = useState([
        { ma_hang: 'asus', ten_hang: 'ASUS / ROG' },
        { ma_hang: 'lenovo', ten_hang: 'Lenovo Legion' },
        { ma_hang: 'dell', ten_hang: 'Dell Alienware' },
        { ma_hang: 'apple', ten_hang: 'Apple MacBook' },
        { ma_hang: 'msi', ten_hang: 'MSI Gaming' },
        { ma_hang: 'acer', ten_hang: 'Acer Predator' },
        { ma_hang: 'hp', ten_hang: 'HP OMEN' }
    ]);

    const [danhSachNhuCau, setDanhSachNhuCau] = useState([]);
    const [danhSachLoaiSanPham, setDanhSachLoaiSanPham] = useState([]);

    const phienBanDuLieu = useDuLieuMoi('danh_muc');
    useEffect(() => {
        let daHuy = false;
        const hienDuocKhong = (d) => d.kich_hoat !== false;
        DanhMucService.layDanhSachDanhMucAsync('nhu_cau').then((data) => {
            if (!daHuy && Array.isArray(data)) setDanhSachNhuCau(data.filter(hienDuocKhong));
        });
        DanhMucService.layDanhSachDanhMucAsync('loai_san_pham').then((data) => {
            if (!daHuy && Array.isArray(data)) setDanhSachLoaiSanPham(data.filter(hienDuocKhong));
        });
        return () => { daHuy = true; };
    }, [phienBanDuLieu]);
    useEffect(() => {
        let daHuy = false;
        DanhMucService.layDanhSachThuongHieuAsync().then((data) => {
            if (!daHuy && Array.isArray(data) && data.length > 0) {
                // Menu chỉ hiện hãng laptop; hãng phụ kiện (Logitech, Razer...) chỉ dùng khi chọn sản phẩm
                const chuanHoa = data.filter(item => item.nhom_hang !== 'phu_kien' && item.kich_hoat !== false).map(item => ({
                    ma_hang: item.ma_danh_muc || item.ma_hang || item.slug,
                    ten_hang: item.ten_danh_muc || item.ten_hang
                }));
                setDanhSachThuongHieu(chuanHoa);
            }
        });
        return () => { daHuy = true; };
    }, [phienBanDuLieu]);
    return (<nav className="w-full bg-[#0040a8] text-white shadow-md hidden lg:block transition-colors border-t border-white/10 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        {/* 1. Nút Lớn "DANH MỤC SẢN PHẨM" với Mega Menu Đa Cột */}
        <div className="relative group" onMouseEnter={() => setMenuDanhMucMo(true)} onMouseLeave={() => setMenuDanhMucMo(false)}>
          <button className="flex items-center gap-2.5 px-6 py-3.5 bg-[#003087] text-white font-black hover:bg-[#00276e] transition-colors cursor-pointer">
            <Menu className="w-4 h-4 text-cyan-200"/>
            <span>DANH MỤC SẢN PHẨM</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${menuDanhMucMo ? "rotate-180" : ""}`}/>
          </button>

          {/* Mega Menu Đa Cột Siêu Trực Quan (Laptop, Linh Kiện, Phụ Kiện) */}
          {menuDanhMucMo && (<div className="absolute left-0 top-full w-[760px] bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-b-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-50 animate-in fade-in slide-in-from-top-1">
              <div className="grid grid-cols-3 gap-6">
                {/* CỘT 1: LAPTOP THEO HÃNG (từ DB: loai = thuong_hieu, nhom_hang = laptop) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-blue-600 dark:text-cyan-400">
                    <Laptop className="w-4 h-4"/>
                    <h3 className="text-xs font-black uppercase tracking-wider">Laptop theo hãng</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {danhSachThuongHieu.map((th) => (<Link key={th.ma_hang} href={`/san-pham?hang=${th.ma_hang}`} onClick={() => setMenuDanhMucMo(false)} className="px-2 py-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 shrink-0"/>
                        <span>{(th.ten_hang || '').split("/")[0].trim()}</span>
                      </Link>))}
                  </div>
                </div>

                {/* CỘT 2: LAPTOP THEO NHU CẦU (từ DB: loai = nhu_cau) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-purple-600 dark:text-purple-400">
                    <Gamepad2 className="w-4 h-4"/>
                    <h3 className="text-xs font-black uppercase tracking-wider">Laptop theo nhu cầu</h3>
                  </div>
                  {danhSachNhuCau.map((nc) => (<Link key={nc.ma_danh_muc} href={`/san-pham?danh_muc=${nc.ma_danh_muc}`} onClick={() => setMenuDanhMucMo(false)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0"/>
                      <span>{nc.ten_danh_muc}</span>
                    </Link>))}
                </div>

                {/* CỘT 3: PHỤ KIỆN & LINH KIỆN (từ DB: loai = loai_san_pham) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-cyan-600 dark:text-cyan-400">
                    <Keyboard className="w-4 h-4"/>
                    <h3 className="text-xs font-black uppercase tracking-wider">Phụ kiện &amp; linh kiện</h3>
                  </div>
                  {danhSachLoaiSanPham.map((lsp) => (<Link key={lsp.ma_danh_muc} href={`/san-pham?danh_muc=${lsp.ma_danh_muc}`} onClick={() => setMenuDanhMucMo(false)} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-cyan-50 dark:hover:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 transition-colors">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0"/>
                      <span>{lsp.ten_danh_muc}</span>
                    </Link>))}
                </div>
              </div>

              {/* Footer Mega Menu: Xem toàn bộ */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">
                  Cam kết 100% hàng mới chính hãng nguyên seal nhà máy
                </span>
                <Link href="/san-pham" onClick={() => setMenuDanhMucMo(false)} className="text-xs font-black text-[#0052cc] dark:text-cyan-400 hover:underline flex items-center gap-1">
                  <span>Xem Tất Cả Sản Phẩm</span>
                  <ArrowRight className="w-3.5 h-3.5"/>
                </Link>
              </div>
            </div>)}
        </div>

        {/* 2. Danh Sách Các Menu Trang Con Chuẩn LaptopNew Royal Blue */}
        <div className="flex items-center gap-0.5">
          <Link href="/" className="px-3 py-3.5 hover:bg-white/10 hover:text-cyan-300 transition-colors">
            TRANG CHỦ
          </Link>

          <Link href="/gioi-thieu" className="px-3 py-3.5 hover:bg-white/10 hover:text-cyan-300 transition-colors">
            GIỚI THIỆU
          </Link>

          {/* Menu Chính Sách Bán Hàng Dropdown */}
          <div className="relative" onMouseEnter={() => setMenuChinhSachMo(true)} onMouseLeave={() => setMenuChinhSachMo(false)}>
            <Link href="/chinh-sach" className="flex items-center gap-1 px-3 py-3.5 hover:bg-white/10 hover:text-cyan-300 transition-colors">
              <span>CHÍNH SÁCH BÁN HÀNG</span>
              <ChevronDown className="w-3 h-3"/>
            </Link>

            {menuChinhSachMo && (<div className="absolute left-0 top-full w-56 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-b-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs font-semibold animate-in fade-in">
                <Link href="/chinh-sach#bao-hanh" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Chính Sách Bảo Hành
                </Link>
                <Link href="/chinh-sach#doi-tra" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Chính Sách Đổi Trả 30 Ngày
                </Link>
                <Link href="/chinh-sach#tra-gop" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Chính Sách Mua Trả Góp 0%
                </Link>
                <Link href="/chinh-sach#van-chuyen" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Chính Sách Vận Chuyển Hỏa Tốc
                </Link>
              </div>)}
          </div>

          {/* Menu Tin Tức */}
          <div className="relative" onMouseEnter={() => setMenuTinTucMo(true)} onMouseLeave={() => setMenuTinTucMo(false)}>
            <Link href="/tin-tuc" className="flex items-center gap-1 px-3 py-3.5 hover:bg-white/10 hover:text-cyan-300 transition-colors">
              <span>TIN TỨC</span>
              <ChevronDown className="w-3 h-3"/>
            </Link>

            {menuTinTucMo && (<div className="absolute left-0 top-full w-52 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-b-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 text-xs font-semibold animate-in fade-in">
                <Link href="/tin-tuc" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Đánh Giá & Review Laptop
                </Link>
                <Link href="/tin-tuc" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Tin Công Nghệ Mới Nhất
                </Link>
                <Link href="/tin-tuc" className="block p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  Cẩm Nang Mua Laptop
                </Link>
              </div>)}
          </div>

          <Link href="/khuyen-mai" className="px-3 py-3.5 text-amber-300 hover:bg-white/10 transition-colors font-black flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-amber-300"/>
            <span>KHUYẾN MÃI</span>
          </Link>

          <Link href="/lien-he" className="px-3 py-3.5 hover:bg-white/10 hover:text-cyan-300 transition-colors">
            LIÊN HỆ
          </Link>

          <Link href="/bao-hanh" className="px-3.5 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black transition-colors flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5"/>
            <span>TRA CỨU BẢO HÀNH</span>
          </Link>
        </div>
      </div>
    </nav>);
}
