'use client';
import Link from 'next/link';
import { thoiHanVoucher } from '@/utils/voucherDate';
import { dinhDangTienVND } from '@/utils/formatCurrency';
import { Ticket, Flame, RefreshCw, ArrowRight, Check, Copy, CheckCheck, Plus } from 'lucide-react';

// Tab "Ví Voucher & Mã Ưu Đãi Đã Săn" của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ViVoucher({
    cheDoXemVoucher,
    setCheDoXemVoucher,
    soLuongVoucherVi,
    danhSachVoucher,
    boLocVoucher,
    setBoLocVoucher,
    dangTaiVoucher,
    danhSachVoucherTrongVi,
    danhSachVoucherHienThi,
    layMauSacVoucher,
    nguoiDung,
    dangLuuVoucher,
    layIconVoucher,
    saoChepMaVoucher,
    daSaoChepMa,
    xuLyLuuVoucher
}) {
    return (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3.5 border-b-2 border-slate-200">
                <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                            <Ticket className="w-4.5 h-4.5" />
                        </div>
                        <span>Ví Voucher & Mã Ưu Đãi Đã Săn</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1 font-medium">
                        Mã giảm giá đã lưu vào ví sẽ tự động gợi ý tại bước thanh toán để tối ưu chi phí.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setCheDoXemVoucher('vi_cua_toi')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                            cheDoXemVoucher === 'vi_cua_toi'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-purple-400'
                        }`}
                    >
                        Ví của tôi ({soLuongVoucherVi})
                    </button>
                    <button
                        type="button"
                        onClick={() => setCheDoXemVoucher('kho_voucher')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer border-2 ${
                            cheDoXemVoucher === 'kho_voucher'
                                ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                : 'bg-white border-slate-300 text-slate-800 hover:border-purple-400'
                        }`}
                    >
                        <span className="flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>Săn thêm ({danhSachVoucher.length})</span>
                        </span>
                    </button>
                </div>
            </div>

            {/* Bộ Lọc Danh Mục Voucher: Tinh gọn, flex-wrap chống cuộn ngang */}
            {cheDoXemVoucher === 'kho_voucher' && (
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
                    {[
                        { id: 'tat_ca', label: 'Tất cả mã' },
                        { id: 'laptop-gaming', label: 'Gaming' },
                        { id: 'laptop-van-phong', label: 'Văn phòng' },
                        { id: 'phu-kien', label: 'Phụ kiện' },
                        { id: 'sinh-vien', label: 'Sinh viên' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setBoLocVoucher(tab.id)}
                            className={`px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                boLocVoucher === tab.id
                                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {dangTaiVoucher ? (
                <div className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-2" />
                    <p className="text-xs font-bold">Đang tải ví voucher của bạn...</p>
                </div>
            ) : cheDoXemVoucher === 'vi_cua_toi' && danhSachVoucherTrongVi.length === 0 ? (
                <div className="py-12 px-6 text-center rounded-3xl border-2 border-dashed border-purple-200 bg-purple-50/40 space-y-4">
                    <div className="w-16 h-16 rounded-3xl bg-white text-purple-600 mx-auto flex items-center justify-center border-2 border-purple-100 shadow-sm">
                        <Ticket className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-base font-black text-slate-800">Ví voucher của bạn hiện đang trống</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                            Bạn chưa lưu mã giảm giá nào vào ví riêng. Hãy mở Kho ưu đãi để săn ngay các mã giảm tới 3.000.000đ khi đặt laptop!
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCheDoXemVoucher('kho_voucher')}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md shadow-purple-500/25 transition-all cursor-pointer hover:scale-102"
                    >
                        <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>Khám Phá & Săn Mã Ngay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>
            ) : danhSachVoucherHienThi.length === 0 ? (
                <div className="py-12 text-center space-y-3 border-2 border-dashed border-slate-200 rounded-3xl p-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Ticket className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-black text-slate-700">
                        Chưa có voucher nào trong bộ lọc này
                    </div>
                    <button
                        type="button"
                        onClick={() => setBoLocVoucher('tat_ca')}
                        className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                        Xem tất cả mã
                    </button>
                </div>
            ) : (
                /* LƯỚI VOUCHER 3 CỘT TRÊN LAPTOP / DESKTOP (GỌN GÀNG, TỈ LỆ CHUẨN ĐẸP) */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {danhSachVoucherHienThi.map((vc) => {
                        const mau = layMauSacVoucher(vc);
                        const daLuuTrongVi = nguoiDung?.viVoucher?.includes(vc.ma_code);
                        const dangLuu = dangLuuVoucher[vc.ma_code];

                        return (
                            <div
                                key={vc.id || vc.ma_code}
                                className="rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-2 border-slate-200/90 flex flex-col justify-between bg-white relative group overflow-hidden"
                            >
                                {/* Mép đục lỗ răng cưa vé voucher (Scallop holes) bên trái */}
                                <div className="absolute -left-[5px] top-3 bottom-3 flex flex-col justify-between z-20 pointer-events-none">
                                    {[...Array(7)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-2.5 h-2.5 rounded-full bg-[#dfe6f0]"
                                        />
                                    ))}
                                </div>

                                {/* Nửa trên: Gradient màu sắc chủ đạo + Badge ngày + Giá trị + Icon watermark */}
                                <div className={`${mau.dauCard} p-3.5 text-white relative flex flex-col justify-between min-h-[110px]`}>
                                    <div className="flex items-center justify-between z-10">
                                        <span className="text-[11px] font-black text-white/95 uppercase tracking-wider">
                                            Ưu Đãi
                                        </span>
                                        <span className="text-[10px] font-bold bg-white/20 backdrop-blur-xs border border-white/30 px-2 py-0.5 rounded-full text-white shadow-2xs">
                                            {thoiHanVoucher(vc)}
                                        </span>
                                    </div>

                                    {/* Icon mờ lớn ở góc phải */}
                                    <div className="absolute right-2.5 top-6 pointer-events-none opacity-80 scale-90">
                                        {layIconVoucher(vc)}
                                    </div>

                                    <div className="z-10 mt-1">
                                        <div className="text-xl sm:text-2xl font-black tracking-tight leading-none text-white my-0.5">
                                            {vc.loai_giam_gia === 'phan_tram' || vc.loai_giam === 'phan_tram' ? `${vc.gia_tri_giam}%` : dinhDangTienVND(vc.gia_tri_giam)}
                                        </div>
                                        <div className="text-[11px] font-bold text-white/95 mt-1 leading-snug line-clamp-1">
                                            {vc.tieu_de || vc.mo_ta || 'Áp dụng cho đơn laptop chính hãng'}
                                        </div>
                                        <div className="text-[10px] text-white/80 mt-0.5 font-medium">
                                            Đơn từ {dinhDangTienVND(vc.gia_tri_don_hang_toi_thieu || vc.don_hang_toi_thieu || 0)}
                                        </div>
                                    </div>
                                </div>

                                {/* Nửa dưới: Hộp mã code + nút Copy + Nút hành động */}
                                <div className="p-3 bg-white space-y-2">
                                    <div className={`rounded-xl px-2.5 py-1.5 flex items-center justify-between border-2 ${mau.pillBorder} ${mau.pillBg} transition-colors`}>
                                        <span className={`font-mono font-black tracking-wider text-xs ${mau.mauCode}`}>
                                            {vc.ma_code}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => saoChepMaVoucher(vc.ma_code)}
                                            className="p-1 text-slate-400 hover:text-slate-700 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                                            title="Sao chép mã"
                                        >
                                            {daSaoChepMa === vc.ma_code ? (
                                                <span className="flex items-center gap-1 text-[10.5px] font-black text-emerald-600">
                                                    <Check className="w-3 h-3" />
                                                    <span>Đã chép</span>
                                                </span>
                                            ) : (
                                                <Copy className="w-3.5 h-3.5" />
                                            )}
                                        </button>
                                    </div>

                                    {daLuuTrongVi ? (
                                        <Link
                                            href="/san-pham"
                                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2 rounded-xl shadow-xs flex items-center justify-center gap-1.5 text-xs transition-all hover:-translate-y-0.5 active:scale-98"
                                        >
                                            <CheckCheck className="w-3.5 h-3.5" />
                                            <span>Đã trong ví • Dùng ngay</span>
                                        </Link>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => xuLyLuuVoucher(vc.ma_code)}
                                            disabled={dangLuu}
                                            className={`w-full ${mau.nutBam} text-white font-black py-2 rounded-xl flex items-center justify-center gap-1.5 text-xs transition-all hover:-translate-y-0.5 active:scale-98 cursor-pointer disabled:opacity-75`}
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>{dangLuu ? 'Đang lưu...' : 'Lưu voucher vào ví'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
