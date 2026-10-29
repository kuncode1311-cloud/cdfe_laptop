'use client';
import Image from 'next/image';
import {
    Package,
    Printer,
    X,
    Calendar,
    Truck,
    CreditCard,
    MapPin,
    User,
    Phone,
    Mail,
    MessageSquare,
    Boxes,
    ShieldCheck,
    XCircle,
    Check,
    Edit3
} from 'lucide-react';

// Modal Chi tiết đơn hàng & in hóa đơn của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalChiTietDonHang({
    donHangChiTiet,
    setDonHangChiTiet,
    inHoaDonBanHang,
    danhSachSanPham,
    dinhDangTienVND,
    xuLyDoiTrangThaiThanhToan,
    moModalSuaDonHang
}) {
    if (!donHangChiTiet) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* 1. Header Đơn Hàng (Tone Sáng Tinh Tế & Dễ Đọc Chữ) */}
                <div className="shrink-0 bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50/80 dark:from-slate-800 dark:via-slate-800 dark:to-slate-800 p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-black text-[11px] uppercase tracking-wider flex items-center gap-1.5 border border-blue-200/80 dark:border-blue-800">
                                <Package className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                Chi Tiết Đơn Hàng & Phiếu Xuất Kho
                            </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-mono font-black mt-1 text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{donHangChiTiet.ma_don_hang}</span>
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => inHoaDonBanHang(donHangChiTiet, danhSachSanPham)}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 !text-white cursor-pointer transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 text-xs font-black"
                            title="In hóa đơn bán hàng chuẩn xịn"
                        >
                            <Printer className="w-4 h-4 !text-white" />
                            <span className="hidden sm:inline !text-white">In Phiếu Hóa Đơn</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setDonHangChiTiet(null)}
                            className="p-2 rounded-xl bg-slate-200/70 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 cursor-pointer transition-colors"
                            title="Đóng modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* 2. Scrollable Body */}
                <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">
                    {/* Thanh Meta 3 Thẻ: Thời gian - Trạng thái giao - Chỉ dẫn thu tiền COD */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                Thời Gian Đặt Hàng
                            </span>
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white font-mono">
                                {donHangChiTiet.ngay_tao || (donHangChiTiet.createdAt ? new Date(donHangChiTiet.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : '23/08/2026')}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-amber-600" />
                                Trạng Thái Giao Hàng
                            </span>
                            <div>
                                <span className={`px-2.5 py-1 rounded-xl text-xs font-black inline-flex items-center gap-1.5 border ${
                                    donHangChiTiet.trang_thai === 'da_giao'
                                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                        : donHangChiTiet.trang_thai === 'dang_giao'
                                        ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                                        : donHangChiTiet.trang_thai === 'da_xac_nhan'
                                        ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                                        : donHangChiTiet.trang_thai === 'da_huy'
                                        ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                                        : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                                }`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                    {donHangChiTiet.trang_thai === 'da_giao' ? 'Giao thành công' :
                                     donHangChiTiet.trang_thai === 'dang_giao' ? 'Đang giao hàng' :
                                     donHangChiTiet.trang_thai === 'da_xac_nhan' ? 'Đã xác nhận đơn' :
                                     donHangChiTiet.trang_thai === 'da_huy' ? 'Đã hủy đơn' : 'Chờ xác nhận'}
                                </span>
                            </div>
                            {donHangChiTiet.trang_thai === 'da_huy' && (donHangChiTiet.ly_do_huy || donHangChiTiet.nguoi_huy) && (
                                <div className="mt-1.5 p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-[11px] text-rose-900 dark:text-rose-200 leading-relaxed">
                                    <div className="font-black">
                                        {donHangChiTiet.nguoi_huy === 'khach' ? 'Khách tự hủy' : donHangChiTiet.nguoi_huy === 'admin' ? 'Admin hủy' : 'Đơn đã hủy'}
                                        {donHangChiTiet.thoi_gian_huy ? ` lúc ${new Date(donHangChiTiet.thoi_gian_huy).toLocaleString('vi-VN')}` : ''}
                                    </div>
                                    {donHangChiTiet.ly_do_huy && <div className="font-semibold">Lý do: {donHangChiTiet.ly_do_huy}</div>}
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                                Chỉ Dẫn Thu Tiền (Shipper)
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {donHangChiTiet.da_thanh_toan ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                        <span>✓ ĐÃ THANH TOÁN (KHÔNG THU TIỀN)</span>
                                    </div>
                                ) : donHangChiTiet.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800">
                                        <span>⏳ CHỜ CHUYỂN KHOẢN: {dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-black bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800">
                                        <span>⚠️ CẦN THU COD: {dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                                    </div>
                                )}

                                {/* Nút Admin chuyển đổi trạng thái thanh toán thủ công */}
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const donId = donHangChiTiet.id || donHangChiTiet._id || donHangChiTiet.ma_don_hang;
                                        const newStatus = !donHangChiTiet.da_thanh_toan;
                                        await xuLyDoiTrangThaiThanhToan(donId, newStatus, donHangChiTiet.hinh_thuc_thanh_toan);
                                        setDonHangChiTiet(prev => prev ? ({ ...prev, da_thanh_toan: newStatus }) : null);
                                    }}
                                    className="px-2.5 py-1 rounded-xl text-[11px] font-black border transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-amber-500 hover:text-amber-600"
                                >
                                    {donHangChiTiet.da_thanh_toan ? '↩️ Đổi sang Chưa thanh toán' : '✅ Đánh dấu Đã thanh toán (Thủ công)'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Thông Tin Khách Hàng & Giao Hàng */}
                    <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
                        <h4 className="font-black text-xs uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5 pb-2 border-b border-slate-200/80 dark:border-slate-700">
                            <MapPin className="w-4 h-4 text-rose-600" />
                            Thông Tin Giao Nhận Khách Hàng
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span className="text-slate-500 dark:text-slate-400 font-bold">Người nhận:</span>
                                    <span className="font-black text-slate-900 dark:text-white text-sm">
                                        {donHangChiTiet.thong_tin_giao_hang?.ho_ten || donHangChiTiet.thong_tin_giao_hang?.ho_va_ten || 'Khách hàng vãng lai'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                                    <span className="text-slate-500 dark:text-slate-400 font-bold">Điện thoại:</span>
                                    <a href={`tel:${donHangChiTiet.thong_tin_giao_hang?.so_dien_thoai}`} className="font-mono font-black text-blue-600 dark:text-blue-400 hover:underline text-sm">
                                        {donHangChiTiet.thong_tin_giao_hang?.so_dien_thoai || 'Chưa cập nhật'}
                                    </a>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span className="text-slate-500 dark:text-slate-400 font-bold">Email:</span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                        {donHangChiTiet.thong_tin_giao_hang?.email || 'N/A'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 font-bold block">Địa chỉ giao:</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white leading-relaxed block text-xs sm:text-sm">
                                            {donHangChiTiet.thong_tin_giao_hang?.dia_chi_chi_tiet || 'Nhận trực tiếp tại showroom'}
                                        </span>
                                        {donHangChiTiet.thong_tin_giao_hang?.tinh_thanh && (
                                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mt-0.5">
                                                Khu vực: {donHangChiTiet.thong_tin_giao_hang?.quan_huyen ? `${donHangChiTiet.thong_tin_giao_hang.quan_huyen}, ` : ''}{donHangChiTiet.thong_tin_giao_hang?.tinh_thanh}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Ghi chú soạn hàng của khách */}
                        {donHangChiTiet.thong_tin_giao_hang?.ghi_chu && (
                            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-l-4 border-amber-500 dark:border-amber-600 rounded-r-xl flex items-start gap-2.5 text-xs">
                                <MessageSquare className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-black text-amber-900 dark:text-amber-200">Ghi chú từ khách hàng: </span>
                                    <span className="font-bold text-amber-800 dark:text-amber-300">"{donHangChiTiet.thong_tin_giao_hang.ghi_chu}"</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Danh Sách Mặt Hàng Xuất Kho */}
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <h4 className="font-black text-slate-900 dark:text-white text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                                <Boxes className="w-4 h-4 text-blue-600" />
                                Danh Sách Mặt Hàng Chuẩn Bị Xuất Kho
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-black text-xs">
                                {donHangChiTiet.danh_sach_san_pham?.length || 0} sản phẩm
                            </span>
                        </div>

                        <div className="space-y-2.5">
                            {donHangChiTiet.danh_sach_san_pham?.map((item, idx) => {
                                const spGoc = danhSachSanPham.find(p =>
                                    p.id === (item.san_pham_id || item.id_san_pham) ||
                                    p._id === (item.san_pham_id || item.id_san_pham) ||
                                    p.ma_san_pham === (item.san_pham_id || item.id_san_pham) ||
                                    p.ten_san_pham === item.ten_san_pham
                                ) || item.san_pham || {};

                                const hinhAnh = item.hinh_anh || spGoc.hinh_anh_chinh || spGoc.hinh_anh || '/images/sp/dell_xps_16.jpg';
                                const donGia = item.gia_tai_thoi_diem_them || item.don_gia || spGoc.gia_khuyen_mai || 0;
                                const thanhTien = donGia * (item.so_luong || 1);

                                return (
                                    <div key={idx} className="flex items-start justify-between gap-3.5 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xs hover:border-blue-300 transition-colors">
                                        <div className="flex items-start gap-3.5 min-w-0">
                                            {/* Ảnh sản phẩm */}
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-700 shrink-0 relative flex items-center justify-center overflow-hidden shadow-inner">
                                                <Image
                                                    src={hinhAnh}
                                                    alt={item.ten_san_pham || 'Sản phẩm'}
                                                    fill
                                                    className="object-contain p-1"
                                                    unoptimized
                                                />
                                            </div>

                                            {/* Thông tin chuẩn bị hàng */}
                                            <div className="min-w-0 space-y-1">
                                                <div className="font-black text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
                                                    {item.ten_san_pham || spGoc.ten_san_pham}
                                                </div>

                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-mono font-bold text-[10px]">
                                                        SKU: {spGoc.ma_san_pham || item.san_pham_id || 'SKU-STORE'}
                                                    </span>
                                                    {spGoc.hang_san_xuat && (
                                                        <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black text-[10px] uppercase">
                                                            {spGoc.hang_san_xuat}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Thông số cấu hình tóm tắt để lấy đúng mã */}
                                                {spGoc.thong_so && (
                                                    <div className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold line-clamp-1">
                                                        ⚙️ {spGoc.thong_so.cpu ? `${spGoc.thong_so.cpu} • ` : ''}
                                                        {spGoc.thong_so.ram ? `${spGoc.thong_so.ram} • ` : ''}
                                                        {spGoc.thong_so.o_cung ? `${spGoc.thong_so.o_cung} • ` : ''}
                                                        {spGoc.thong_so.switch ? `${spGoc.thong_so.switch} • ` : ''}
                                                        {spGoc.thong_so.cam_bien || spGoc.thong_so.cong_suat_tong || ''}
                                                    </div>
                                                )}

                                                <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                                                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                                    <span>Bảo hành: {spGoc.thong_so?.che_do_bao_hanh || '24 tháng chính hãng'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Số lượng & Đơn giá */}
                                        <div className="text-right shrink-0 space-y-1">
                                            <div className="px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm shadow-xs inline-block">
                                                x{item.so_luong || 1} cái
                                            </div>
                                            <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                                                {dinhDangTienVND(donGia)} / cái
                                            </div>
                                            <div className="font-black text-sm sm:text-base text-red-600 dark:text-red-400">
                                                {dinhDangTienVND(thanhTien)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bảng Tính Tiền & Thanh Toán */}
                    <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                            <span>Tạm tính tiền hàng:</span>
                            <span className="font-mono text-slate-900 dark:text-white font-black">{dinhDangTienVND(donHangChiTiet.tam_tinh || donHangChiTiet.tong_tien_thanh_toan)}</span>
                        </div>

                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                            <span>Phí giao hàng:</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-black">0 đ (Miễn phí vận chuyển)</span>
                        </div>

                        {donHangChiTiet.tien_giam_gia > 0 && (
                            <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                                <span>Giảm giá Voucher {donHangChiTiet.ma_giam_gia ? `(${donHangChiTiet.ma_giam_gia})` : ''}:</span>
                                <span className="font-mono font-black">-{dinhDangTienVND(donHangChiTiet.tien_giam_gia)}</span>
                            </div>
                        )}

                        <div className="flex justify-between items-center text-sm sm:text-base text-red-600 dark:text-red-400 pt-2.5 border-t border-slate-200 dark:border-slate-700 font-black">
                            <span>TỔNG THANH TOÁN:</span>
                            <span className="text-lg sm:text-xl font-mono">{dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}</span>
                        </div>

                        <div className={`flex justify-between items-center p-2.5 rounded-xl font-black text-xs sm:text-sm mt-2 border ${
                            donHangChiTiet.da_thanh_toan
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                        }`}>
                            <span>{donHangChiTiet.da_thanh_toan ? '✓ Trạng thái thanh toán:' : '⚠️ Tiền mặt bưu tá cần thu (COD):'}</span>
                            <span className="font-mono text-sm sm:text-base">
                                {donHangChiTiet.da_thanh_toan ? '0 đ (Đã thanh toán 100%)' : dinhDangTienVND(donHangChiTiet.tong_tien_thanh_toan)}
                            </span>
                        </div>
                    </div>

                    {/* Lịch trình tiến độ đơn hàng - Gọn gàng, thẩm mỹ, trực quan */}
                    {(() => {
                        const trangThai = donHangChiTiet.trang_thai || 'da_giao';
                        const logs = donHangChiTiet.lich_trinh_giao_hang || [];

                        const logDatHang = logs.find(l => l.tieu_de?.toLowerCase().includes('đặt hàng')) || logs[0];
                        const logXacNhan = logs.find(l => l.tieu_de?.toLowerCase().includes('xác nhận') || l.tieu_de?.toLowerCase().includes('đóng gói'));
                        const logVanChuyen = logs.find(l => l.tieu_de?.toLowerCase().includes('vận chuyển') || l.tieu_de?.toLowerCase().includes('bàn giao'));
                        const logGiaoHang = logs.find(l => l.tieu_de?.toLowerCase().includes('giao hàng') || l.tieu_de?.toLowerCase().includes('thành công')) || (logs.length > 1 ? logs[logs.length - 1] : null);

                        const rutGonThoiGian = (str) => {
                            if (!str) return '';
                            try {
                                if (str.includes('T') || (str.includes('-') && str.length >= 10)) {
                                    const d = new Date(str);
                                    if (!isNaN(d.getTime())) {
                                        const hh = String(d.getHours()).padStart(2, '0');
                                        const mm = String(d.getMinutes()).padStart(2, '0');
                                        const dd = String(d.getDate()).padStart(2, '0');
                                        const MM = String(d.getMonth() + 1).padStart(2, '0');
                                        return `${hh}:${mm} ${dd}/${MM}`;
                                    }
                                }
                            } catch {}
                            return str.replace(/\/202\d/, '').trim();
                        };

                        const thoiGianDat = rutGonThoiGian(logDatHang?.thoi_gian || donHangChiTiet.ngay_tao);
                        const thoiGianGiao = rutGonThoiGian(logGiaoHang?.thoi_gian || (trangThai === 'da_giao' ? '15:20 23/08' : null));

                        const buocHienTai =
                            trangThai === 'da_giao' ? 4 :
                            trangThai === 'dang_giao' ? 3 :
                            trangThai === 'da_xac_nhan' ? 2 :
                            trangThai === 'da_huy' ? 0 : 1;

                        const cacBuocTienTrinh = [
                            {
                                buoc: 1,
                                tieu_de: 'Đặt đơn',
                                thoi_gian: thoiGianDat || 'Thành công',
                            },
                            {
                                buoc: 2,
                                tieu_de: 'Duyệt & Gói',
                                thoi_gian: rutGonThoiGian(logXacNhan?.thoi_gian) || (buocHienTai >= 2 ? 'Đã đóng gói' : 'Chờ duyệt'),
                            },
                            {
                                buoc: 3,
                                tieu_de: 'Vận chuyển',
                                thoi_gian: rutGonThoiGian(logVanChuyen?.thoi_gian) || (buocHienTai >= 3 ? (trangThai === 'da_giao' ? 'Đã xuất kho' : 'Đang chuyển') : 'Chờ bưu tá'),
                            },
                            {
                                buoc: 4,
                                tieu_de: 'Đã nhận hàng',
                                thoi_gian: thoiGianGiao || (buocHienTai === 4 ? 'Đã ký nhận' : 'Dự kiến'),
                            }
                        ];

                        return (
                            <div className="p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-3">
                                {/* Header thanh lịch, nhỏ gọn */}
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-lg bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                            <Truck className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 uppercase tracking-wide">
                                            Lộ Trình Đơn Hàng
                                        </span>
                                    </div>

                                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                        trangThai === 'da_giao'
                                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                                            : trangThai === 'dang_giao'
                                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800'
                                            : trangThai === 'da_xac_nhan'
                                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                            : trangThai === 'da_huy'
                                            ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                                            : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    }`}>
                                        {trangThai === 'da_giao' ? '✓ Đã giao thành công' :
                                         trangThai === 'dang_giao' ? '🚚 Đang giao hàng' :
                                         trangThai === 'da_xac_nhan' ? '📦 Đã duyệt đơn' :
                                         trangThai === 'da_huy' ? '✕ Đã hủy đơn' : '⏳ Chờ xác nhận'}
                                    </span>
                                </div>

                                {/* Stepper Timeline Nhẹ Nhàng & Trực Quan */}
                                {trangThai === 'da_huy' ? (
                                    <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2 text-xs text-rose-700 dark:text-rose-300 font-bold">
                                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span>Đơn hàng đã hủy. Tiến trình vận chuyển đã ngừng.</span>
                                    </div>
                                ) : (
                                    <div className="relative pt-1 pb-1">
                                        {/* Ray tiến trình nối ngang */}
                                        <div className="absolute top-4 left-[12.5%] right-[12.5%] h-1 bg-slate-100 dark:bg-slate-700/80 rounded-full z-0">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                                                style={{
                                                    width: buocHienTai === 4 ? '100%' : buocHienTai === 3 ? '66.6%' : buocHienTai === 2 ? '33.3%' : '0%'
                                                }}
                                            />
                                        </div>

                                        {/* 4 Nút Mốc Tiến Trình Tinh Gọn */}
                                        <div className="grid grid-cols-4 gap-1 relative z-10">
                                            {cacBuocTienTrinh.map((b) => {
                                                const laHoanThanh = buocHienTai >= b.buoc;
                                                const laDangXuLy = buocHienTai === b.buoc - 1 && buocHienTai > 0;

                                                return (
                                                    <div key={b.buoc} className="flex flex-col items-center text-center">
                                                        {/* Nút icon tròn nhỏ gọn */}
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${
                                                            laHoanThanh
                                                                ? 'bg-emerald-500 text-white shadow-xs ring-4 ring-emerald-50 dark:ring-emerald-950/70'
                                                                : laDangXuLy
                                                                ? 'bg-blue-600 text-white shadow-xs ring-4 ring-blue-50 dark:ring-blue-950/70 animate-pulse'
                                                                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                                                        }`}>
                                                            {laHoanThanh ? (
                                                                <Check className="w-4 h-4 stroke-[2.5]" />
                                                            ) : (
                                                                <span className="text-xs font-bold font-mono">{b.buoc}</span>
                                                            )}
                                                        </div>

                                                        {/* Tiêu đề & Thời gian ngắn gọn */}
                                                        <div className="mt-1.5 w-full px-1">
                                                            <div className={`text-xs font-bold truncate ${
                                                                laHoanThanh
                                                                    ? 'text-slate-800 dark:text-slate-100'
                                                                    : laDangXuLy
                                                                    ? 'text-blue-600 dark:text-blue-400'
                                                                    : 'text-slate-400 dark:text-slate-500'
                                                            }`}>
                                                                {b.tieu_de}
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate mt-0.5">
                                                                {b.thoi_gian}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>

                {/* 3. Footer Cố Định */}
                <div className="shrink-0 p-4 px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => setDonHangChiTiet(null)}
                        className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-extrabold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer text-xs"
                    >
                        Đóng
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const dh = donHangChiTiet;
                            setDonHangChiTiet(null);
                            moModalSuaDonHang(dh);
                        }}
                        className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all cursor-pointer hover:scale-102"
                    >
                        <Edit3 className="w-4 h-4 !text-white" />
                        <span className="!text-white">Sửa Đơn Hàng</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => inHoaDonBanHang(donHangChiTiet, danhSachSanPham)}
                        className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 !text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer hover:scale-102"
                    >
                        <Printer className="w-4 h-4 !text-white" />
                        <span className="!text-white">In Hóa Đơn & Phiếu Xuất Kho</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
