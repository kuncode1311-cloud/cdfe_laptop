"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Phone, Menu, ArrowRight, Sun, Moon, User, LogOut, Sparkles, PackageCheck, LayoutDashboard } from "lucide-react";
import { useCart, useGioHang } from "@/contexts/CartContext";
import { useTheme, useGiaoDien } from "@/contexts/ThemeContext";
import { useAuth, useNguoiDung } from "@/contexts/AuthContext";
import { SanPhamService } from "@/services/san-pham.service";
import { formatCurrency, dinhDangTienVND } from "@/utils/formatCurrency";
import { slugSanPham } from "@/utils/taoSlug";
export default function ThanhDieuHuong({ onMoMenuDiDong, }) {
    const router = useRouter();
    const { gio_hang } = useGioHang();
    const { chu_de, chuyenDoiChuDe } = useGiaoDien();
    const { nguoiDung, daDangNhap, moModalDangNhap, dangXuat } = useNguoiDung();
    const [tuKhoa, setTuKhoa] = useState("");
    const [dangMoGoiY, setDangMoGoiY] = useState(false);
    const [daCuon, setDaCuon] = useState(false);
    const [dangMoMenuUser, setDangMoMenuUser] = useState(false);
    const hopTimKiemRef = useRef(null);
    const menuUserRef = useRef(null);
    // Hiệu ứng phát hiện cuộn trang để thu nhỏ Topbar
    useEffect(() => {
        const xuLyCuon = () => {
            if (window.scrollY > 40) {
                setDaCuon(true);
            }
            else {
                setDaCuon(false);
            }
        };
        window.addEventListener("scroll", xuLyCuon, { passive: true });
        return () => window.removeEventListener("scroll", xuLyCuon);
    }, []);
    const ketQuaGoiY = useMemo(() => tuKhoa.trim().length >= 2
        ? SanPhamService.timKiemGoiYNhanh(tuKhoa, 6)
        : [], [tuKhoa]);
    useEffect(() => {
        function clickNgoai(e) {
            if (hopTimKiemRef.current &&
                !hopTimKiemRef.current.contains(e.target)) {
                setDangMoGoiY(false);
            }
            if (menuUserRef.current &&
                !menuUserRef.current.contains(e.target)) {
                setDangMoMenuUser(false);
            }
        }
        document.addEventListener("mousedown", clickNgoai);
        return () => document.removeEventListener("mousedown", clickNgoai);
    }, []);
    const xuLyTimKiem = (e) => {
        e.preventDefault();
        if (tuKhoa.trim()) {
            setDangMoGoiY(false);
            router.push(`/san-pham?tu_khoa=${encodeURIComponent(tuKhoa.trim())}`);
        }
    };
    return (<header className={`w-full bg-[#0755c9] text-white border-b border-white/10 transition-all duration-300 z-50 ${daCuon
            ? "shadow-xl py-0 backdrop-blur-xl bg-[#0755c9]/95"
            : "shadow-md"}`}>
      {/* 1. Header Chính Chuẩn LaptopNew Xanh Dương Hoàng Gia */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 transition-all duration-300 ${daCuon ? "py-1.5 sm:py-2" : "py-3"}`}>
        {/* Logo LaptopNew */}
        <div className="flex items-center gap-3">
          {onMoMenuDiDong && (<button onClick={onMoMenuDiDong} className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors">
              <Menu className="w-5 h-5"/>
            </button>)}

          <Link href="/" className="flex items-center gap-2 group shrink-0" aria-label="TNTP LAPTOP - Trang chủ">
            {/* Biểu tượng logo thương hiệu TNTP LAPTOP */}
            <div className={`rounded-xl bg-white text-[#0052cc] flex items-center justify-center font-black shadow-md group-hover:scale-105 transition-all ${daCuon ? "w-8 h-8 sm:w-9 sm:h-9" : "w-9 h-9 sm:w-10 sm:h-10 px-1"}`}>
              <span className="font-black text-[13px] sm:text-base tracking-tighter text-[#0052cc]">
                TNTP
              </span>
            </div>
            <div className="flex flex-col">
              <span className={`font-black tracking-tighter text-white uppercase leading-none transition-all ${daCuon ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"}`}>
                TNTP <span className="text-cyan-300">LAPTOP</span>
              </span>
              {!daCuon && (<span className="text-[9px] text-white/80 font-bold tracking-wider uppercase mt-0.5">
                  Trí • Nhất • Tài • Phú // Official
                </span>)}
            </div>
          </Link>
        </div>

        {/* Thanh Tìm Kiếm Trực Tiếp Chuẩn LaptopNew (Nền Trắng, Chữ Đen) */}
        <div ref={hopTimKiemRef} className="relative flex-1 max-w-lg hidden md:block">
          <form onSubmit={xuLyTimKiem} className="relative w-full">
            <input type="text" value={tuKhoa} onChange={(e) => {
            const giaTri = e.target.value;
            setTuKhoa(giaTri);
            setDangMoGoiY(giaTri.trim().length >= 2);
        }} onFocus={() => {
            if (tuKhoa.trim().length >= 2)
                setDangMoGoiY(true);
        }} placeholder="Tìm laptop, linh kiện hoặc thương hiệu..." className={`w-full pl-4 pr-12 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 border border-transparent focus:outline-none focus:ring-2 focus:ring-cyan-300 font-medium shadow-inner transition-all ${daCuon ? "py-1.5 text-xs" : "py-2.5 text-xs sm:text-sm"}`}/>
            <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 text-[#0052cc] hover:text-[#003da5] transition-colors cursor-pointer">
              <Search className={`${daCuon ? "w-4 h-4" : "w-5 h-5"} transition-all`}/>
            </button>
          </form>

          {/* Hộp Dropdown Gợi Ý Tìm Kiếm */}
          {dangMoGoiY && (<div className="absolute left-0 right-0 top-full mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-500">
                <span>Gợi ý cho “{tuKhoa}”</span>
                <span>{ketQuaGoiY.length} kết quả</span>
              </div>

              {ketQuaGoiY.length > 0 ? (<div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                  {ketQuaGoiY.map((sp) => (<Link key={sp.id} href={`/san-pham/${slugSanPham(sp)}`} onClick={() => setDangMoGoiY(false)} className="flex items-center gap-3 p-2.5 hover:bg-blue-50/50 rounded-xl transition-colors group">
                      <div className="relative w-12 h-12 rounded-lg bg-slate-100 p-1 shrink-0 overflow-hidden border border-slate-200">
                        <Image src={sp.hinh_anh_chinh} alt={sp.ten_san_pham} fill className="object-contain p-0.5 group-hover:scale-105 transition-transform"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate">
                          {sp.ten_san_pham}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-[#0052cc]">
                            {dinhDangTienVND(sp.gia_khuyen_mai)}
                          </span>
                          {sp.gia_goc > sp.gia_khuyen_mai && (<span className="text-[10px] text-slate-400 line-through">
                              {dinhDangTienVND(sp.gia_goc)}
                            </span>)}
                        </div>
                      </div>
                    </Link>))}
                  <div className="pt-2 text-center">
                    <button onClick={xuLyTimKiem} className="text-xs font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 w-full py-1 cursor-pointer">
                      <span>Xem tất cả kết quả</span>
                      <ArrowRight className="w-3.5 h-3.5"/>
                    </button>
                  </div>
                </div>) : (<div className="py-6 text-center text-xs text-slate-400">
                  Không tìm thấy kết quả phù hợp.
                </div>)}
            </div>)}
        </div>

        {/* Các thao tác thiết yếu */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hotline */}
          <a href="tel:19008946" aria-label="Gọi tư vấn 1900 8946" title="Gọi tư vấn: 1900 8946" className="hidden sm:grid w-10 h-10 place-items-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-cyan-200 transition-colors">
            <Phone className="w-4 h-4"/>
          </a>

          {/* Nút Đổi Theme Sáng / Tối */}
          <button onClick={chuyenDoiChuDe} className="w-10 h-10 grid place-items-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white cursor-pointer transition-colors" title="Đổi giao diện Sáng / Tối">
            {chu_de === "sang" ? (<Moon className="w-4 h-4 text-cyan-200"/>) : (<Sun className="w-4 h-4 text-amber-300"/>)}
          </button>

          {/* Nút Đăng Nhập / Tài Khoản Người Dùng */}
          <div ref={menuUserRef} className="relative">
            {daDangNhap && nguoiDung ? (<button onClick={() => setDangMoMenuUser(!dangMoMenuUser)} className="flex items-center gap-2 h-10 px-3 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-xs transition-all cursor-pointer shadow-xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-black text-[10px] flex items-center justify-center">
                  {nguoiDung.hoTen.charAt(0)}
                </div>
                <span className="hidden md:inline max-w-[100px] truncate">
                  {nguoiDung.hoTen}
                </span>
              </button>) : (<button onClick={moModalDangNhap} className="flex items-center gap-1.5 h-10 px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-bold text-xs transition-all cursor-pointer shadow-xs" title="Đăng nhập / Đăng ký tài khoản">
                <User className="w-4 h-4 text-cyan-200"/>
                <span className="hidden sm:inline">Đăng Nhập</span>
              </button>)}

            {/* Dropdown Menu Tài Khoản khi đã đăng nhập */}
            {daDangNhap && nguoiDung && dangMoMenuUser && (<div className="absolute right-0 top-full mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 text-slate-900 dark:text-white text-xs font-semibold z-50 animate-in fade-in zoom-in-95">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl mb-1 space-y-0.5">
                  <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {nguoiDung.hoTen}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {nguoiDung.email}
                  </div>
                  <div className="pt-1 flex items-center gap-1.5 text-[10px] text-amber-500 font-extrabold">
                    <Sparkles className="w-3 h-3 fill-amber-400"/>
                    <span>{nguoiDung.hangThanhVien} ({nguoiDung.diemTichLuy} Điểm)</span>
                  </div>
                </div>

                {nguoiDung.vaiTro === 'admin' && (
                  <Link href="/admin" onClick={() => setDangMoMenuUser(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-bold transition-colors mb-1">
                    <LayoutDashboard className="w-4 h-4 text-purple-600 dark:text-purple-400"/>
                    <span>Trang Quản Trị (Admin Hub)</span>
                  </Link>
                )}

                <Link href="/don-hang" onClick={() => setDangMoMenuUser(false)} className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <PackageCheck className="w-4 h-4 text-[#0052cc] dark:text-cyan-400"/>
                  <span>Đơn hàng của tôi</span>
                </Link>

                <button onClick={() => {
                dangXuat();
                setDangMoMenuUser(false);
            }} className="w-full flex items-center gap-2.5 p-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer text-left font-bold">
                  <LogOut className="w-4 h-4"/>
                  <span>Đăng xuất</span>
                </button>
              </div>)}
          </div>

          {/* Nút Giỏ Hàng Nổi Bật Chuẩn Nền Trắng Chữ Xanh */}
          <Link href="/gio-hang" aria-label={`Giỏ hàng có ${gio_hang.tong_so_luong} sản phẩm`} className="relative flex items-center gap-2 h-10 px-3.5 rounded-xl bg-white text-[#0755c9] font-black shadow-sm hover:bg-cyan-50 transition-all group">
            <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform"/>
            <div className="flex flex-col text-left">
              <span className="hidden sm:block text-[10px] uppercase font-bold leading-tight">
                Giỏ hàng
              </span>
              <span className="hidden sm:block text-[10px] font-semibold opacity-80 leading-tight">
                {gio_hang.tong_so_luong} sản phẩm
              </span>
            </div>
            {gio_hang.tong_so_luong > 0 && (<span className="w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center ml-1 shadow-xs">
                {gio_hang.tong_so_luong}
              </span>)}
          </Link>
        </div>
      </div>
    </header>);
}
