'use client';
import { MapPin, Plus, X, User, Phone, AlertCircle, Check, Building2, Home, CheckCircle2, Edit3, Trash2 } from 'lucide-react';
import BoChonDiaGioi from './BoChonDiaGioi';

// Tab "Sổ Địa Chỉ Nhận Hàng" của trang tài khoản: tách từ app/tai-khoan/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function SoDiaChi({
    danhSachDiaChi,
    batDauThemDiaChi,
    dangMoFormDiaChi,
    xuLyLuuDiaChi,
    idDiaChiSua,
    setDangMoFormDiaChi,
    formDiaChi,
    setFormDiaChi,
    daChamDiaChi,
    setDaChamDiaChi,
    loiDiaChiHoTen,
    loiDiaChiSoDienThoai,
    loiDiaChiChiTiet,
    danhSachTinh,
    chonTinhThanh,
    danhSachXa,
    chonPhuongXa,
    datLamMacDinh,
    batDauSuaDiaChi,
    xoaDiaChi
}) {
    return (
        <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-slate-300 shadow-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b-2 border-slate-200">
                <div>
                    <h2 className="text-xl font-black text-slate-900 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                            <MapPin className="w-4.5 h-4.5" />
                        </div>
                        <span>Sổ Địa Chỉ Nhận Hàng</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                            {danhSachDiaChi.length} địa chỉ
                        </span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Dữ liệu 63 tỉnh thành chuẩn quốc gia. Hỗ trợ tìm kiếm nhanh và đặt hàng hỏa tốc trong 1 click.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={batDauThemDiaChi}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm shadow-emerald-600/20 transition-all cursor-pointer self-start sm:self-auto active:scale-95"
                >
                    <Plus className="w-4 h-4" />
                    <span>Thêm Địa Chỉ Mới</span>
                </button>
            </div>

            {/* Form Thêm/Sửa địa chỉ: Phân vùng màu sắc trực quan theo chức năng */}
            {dangMoFormDiaChi && (
                <form onSubmit={xuLyLuuDiaChi} className="p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-500 shadow-lg space-y-4 animate-in fade-in duration-200">
                    {/* Header Form */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-slate-900">
                                    {idDiaChiSua ? 'Cập Nhật Địa Chỉ Nhận Hàng' : 'Thêm Địa Chỉ Nhận Hàng Mới'}
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Vui lòng điền chính xác thông tin để đơn hàng được giao nhanh chóng nhất
                                </p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setDangMoFormDiaChi(false)}
                            className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 hover:bg-slate-200 flex items-center justify-center cursor-pointer transition-colors"
                            title="Đóng form"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Hàng 1: Người nhận (Họ tên & SĐT) - Chia 2 cột đều nhau */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                                <span>Họ và tên người nhận</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={formDiaChi.hoTen}
                                    onChange={(e) => {
                                        setFormDiaChi({ ...formDiaChi, hoTen: e.target.value });
                                        setDaChamDiaChi(prev => ({ ...prev, hoTen: true }));
                                    }}
                                    onBlur={() => setDaChamDiaChi(prev => ({ ...prev, hoTen: true }))}
                                    className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                        daChamDiaChi.hoTen && loiDiaChiHoTen
                                            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                                            : daChamDiaChi.hoTen && !loiDiaChiHoTen && formDiaChi.hoTen.trim()
                                            ? 'border-emerald-500 bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                            : 'border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                    }`}
                                />
                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                {daChamDiaChi.hoTen && loiDiaChiHoTen && (
                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                )}
                                {daChamDiaChi.hoTen && !loiDiaChiHoTen && formDiaChi.hoTen.trim() && (
                                    <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            {daChamDiaChi.hoTen && loiDiaChiHoTen && (
                                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{loiDiaChiHoTen}</span>
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                                <span>Số điện thoại liên hệ</span>
                                <span className="text-rose-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ví dụ: 0912 345 678"
                                    value={formDiaChi.soDienThoai}
                                    onChange={(e) => {
                                        setFormDiaChi({ ...formDiaChi, soDienThoai: e.target.value });
                                        setDaChamDiaChi(prev => ({ ...prev, soDienThoai: true }));
                                    }}
                                    onBlur={() => setDaChamDiaChi(prev => ({ ...prev, soDienThoai: true }))}
                                    className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                        daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai
                                            ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                                            : daChamDiaChi.soDienThoai && !loiDiaChiSoDienThoai && formDiaChi.soDienThoai.trim()
                                            ? 'border-emerald-500 bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                            : 'border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                    }`}
                                />
                                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                {daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai && (
                                    <AlertCircle className="w-4 h-4 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                )}
                                {daChamDiaChi.soDienThoai && !loiDiaChiSoDienThoai && formDiaChi.soDienThoai.trim() && (
                                    <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                )}
                            </div>
                            {daChamDiaChi.soDienThoai && loiDiaChiSoDienThoai && (
                                <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                                    <AlertCircle className="w-3 h-3 shrink-0" />
                                    <span>{loiDiaChiSoDienThoai}</span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Hàng 2: Tỉnh/Thành phố, Phường/Xã — địa giới sau sáp nhập 2025 (2 cấp), 2 cột trên desktop, 1 cột trên mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <BoChonDiaGioi
                            label="Tỉnh / Thành phố *"
                            icon={Building2}
                            danhSach={danhSachTinh}
                            giaTri={formDiaChi.tinhThanh}
                            onChon={chonTinhThanh}
                            placeholder="Chọn Tỉnh / Thành phố..."
                        />

                        <BoChonDiaGioi
                            label="Phường / Xã *"
                            icon={Home}
                            danhSach={danhSachXa}
                            giaTri={formDiaChi.phuongXa}
                            onChon={chonPhuongXa}
                            placeholder={formDiaChi.tinhThanh ? `Chọn Phường / Xã (${danhSachXa.length})...` : "Chọn Tỉnh / TP trước"}
                            disabled={!formDiaChi.tinhThanh}
                        />
                    </div>

                    {/* Hàng 3: Địa chỉ chi tiết (Số nhà, tên đường...) */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            <span>Số nhà, tên đường, tòa nhà chi tiết</span>
                            <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                placeholder="Ví dụ: Số 25, Đường Lê Lợi, Phường Bến Nghé"
                                value={formDiaChi.diaChiChiTiet}
                                onChange={(e) => {
                                    setFormDiaChi({ ...formDiaChi, diaChiChiTiet: e.target.value });
                                    setDaChamDiaChi(prev => ({ ...prev, diaChiChiTiet: true }));
                                }}
                                onBlur={() => setDaChamDiaChi(prev => ({ ...prev, diaChiChiTiet: true }))}
                                className={`w-full pl-9 pr-8 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                                    daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet
                                        ? 'border-rose-400 bg-rose-50/40 text-rose-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
                                        : daChamDiaChi.diaChiChiTiet && !loiDiaChiChiTiet && formDiaChi.diaChiChiTiet.trim()
                                        ? 'border-emerald-500 bg-white text-slate-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100'
                                        : 'border-slate-300 bg-white text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                                }`}
                            />
                            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            {daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet && (
                                <AlertCircle className="w-4 h-4 text-rose-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                            )}
                            {daChamDiaChi.diaChiChiTiet && !loiDiaChiChiTiet && formDiaChi.diaChiChiTiet.trim() && (
                                <Check className="w-4 h-4 text-emerald-600 absolute right-2.5 top-1/2 -translate-y-1/2" />
                            )}
                        </div>
                        {daChamDiaChi.diaChiChiTiet && loiDiaChiChiTiet && (
                            <p className="text-[11px] font-semibold text-rose-500 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>{loiDiaChiChiTiet}</span>
                            </p>
                        )}
                    </div>

                    {/* Hàng 4: Loại địa chỉ, Checkbox mặc định & Nút hành động */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-slate-100">
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormDiaChi({ ...formDiaChi, loaiDiaChi: 'nha_rieng' })}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        formDiaChi.loaiDiaChi === 'nha_rieng'
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Nhà riêng</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setFormDiaChi({ ...formDiaChi, loaiDiaChi: 'van_phong' })}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                                        formDiaChi.loaiDiaChi === 'van_phong'
                                            ? 'bg-purple-600 border-purple-600 text-white shadow-xs'
                                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span>Văn phòng</span>
                                </button>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer select-none ml-1">
                                <input
                                    type="checkbox"
                                    checked={formDiaChi.macDinh}
                                    onChange={(e) => setFormDiaChi({ ...formDiaChi, macDinh: e.target.checked })}
                                    className="rounded text-emerald-600 accent-emerald-600 w-4 h-4 cursor-pointer"
                                />
                                <span className="text-slate-700 text-xs font-bold">Đặt làm địa chỉ mặc định</span>
                            </label>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                                type="button"
                                onClick={() => setDangMoFormDiaChi(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
                            >
                                {idDiaChiSua ? 'Cập Nhật' : 'Lưu Địa Chỉ'}
                            </button>
                        </div>
                    </div>
                </form>
            )}

            {/* Danh sách các địa chỉ đã lưu với thẻ Card sang trọng, phân màu rõ ràng */}
            <div className="space-y-3">
                {danhSachDiaChi.length === 0 ? (
                    <div className="py-10 text-center rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/30 p-6 space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-white text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-100 shadow-sm">
                            <MapPin className="w-7 h-7" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-slate-800">Bạn chưa lưu địa chỉ nhận hàng nào</h4>
                            <p className="text-xs text-slate-500 mt-1">Thêm địa chỉ nhà riêng hoặc văn phòng để đặt hàng hỏa tốc trong 1 click.</p>
                        </div>
                        <button
                            type="button"
                            onClick={batDauThemDiaChi}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm transition-all cursor-pointer hover:scale-102"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm địa chỉ ngay</span>
                        </button>
                    </div>
                ) : (
                    danhSachDiaChi.map((dc) => (
                        <div
                            key={dc.id}
                            className={`p-4 sm:p-5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 ${
                                dc.macDinh
                                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50/80 via-teal-50/30 to-white shadow-md shadow-emerald-500/10'
                                    : 'border-2 border-slate-300 bg-white hover:border-emerald-400 shadow-sm'
                            }`}
                        >
                            <div className="space-y-2 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-black text-slate-900 text-sm flex items-center gap-1.5 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300 shadow-2xs">
                                        <User className="w-3.5 h-3.5 text-blue-600" />
                                        <span>{dc.hoTen}</span>
                                    </span>
                                    <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-0.5 rounded-lg border-2 border-slate-300 flex items-center gap-1 font-mono shadow-2xs">
                                        <Phone className="w-3 h-3 text-emerald-600" />
                                        <span>{dc.soDienThoai}</span>
                                    </span>
                                    {dc.macDinh && (
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10.5px] font-black shadow-xs flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" />
                                            <span>Mặc định</span>
                                        </span>
                                    )}
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-black border flex items-center gap-1 shadow-2xs ${
                                        dc.loaiDiaChi === 'van_phong'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                    }`}>
                                        {dc.loaiDiaChi === 'van_phong' ? <Building2 className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                        <span>{dc.loaiDiaChi === 'van_phong' ? 'Văn phòng' : 'Nhà riêng'}</span>
                                    </span>
                                </div>
                                <div className="text-xs text-slate-600 font-medium flex items-start gap-2 pt-0.5">
                                    <div className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                                        <MapPin className="w-3 h-3" />
                                    </div>
                                    <span className="text-slate-800 font-bold leading-relaxed">
                                        {[dc.diaChiChiTiet, dc.phuongXa, dc.quanHuyen, dc.tinhThanh].filter(Boolean).join(', ')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                                {!dc.macDinh && (
                                    <button
                                        type="button"
                                        onClick={() => datLamMacDinh(dc.id)}
                                        className="px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-xs text-emerald-700 font-bold cursor-pointer shadow-2xs transition-all active:scale-95"
                                    >
                                        Đặt mặc định
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => batDauSuaDiaChi(dc)}
                                    className="p-2 rounded-xl text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 bg-white cursor-pointer transition-all shadow-2xs active:scale-95"
                                    title="Chỉnh sửa địa chỉ"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => xoaDiaChi(dc.id)}
                                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-300 bg-white cursor-pointer transition-all shadow-2xs active:scale-95"
                                    title="Xóa địa chỉ"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
