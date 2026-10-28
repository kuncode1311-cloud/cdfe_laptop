'use client';
import { useEffect, useMemo, useState } from 'react';
import {
    X,
    User,
    Phone,
    MapPin,
    Package,
    PlusCircle,
    CreditCard,
    Ticket,
    Trash2,
    Loader2,
    Save
} from 'lucide-react';
import { DiaGioiHanhChinhService } from '@/services/dia-gioi-hanh-chinh.service';

// Modal Tạo/Sửa đơn hàng của trang quản trị: tách từ app/admin/page.jsx (refactor thuần cấu trúc, không đổi hành vi/giao diện)
export default function ModalDonHang({
    dangMoModalDonHang,
    setDangMoModalDonHang,
    donHangDangSua,
    formDonHang,
    setFormDonHang,
    xuLyLuuDonHang,
    dangLuuDonHang,
    danhSachSanPham,
    dinhDangTienVND,
    themDongSanPhamDonHang,
    capNhatDongSanPhamDonHang,
    xoaDongSanPhamDonHang
}) {
    const [danhSachTinh, setDanhSachTinh] = useState([]);
    const [danhSachXa, setDanhSachXa] = useState([]);
    const [maTinh, setMaTinh] = useState('');
    const [tuKhoaSanPham, setTuKhoaSanPham] = useState('');
    const [locLoaiSanPham, setLocLoaiSanPham] = useState('tat_ca');
    const [locHangSanPham, setLocHangSanPham] = useState('tat_ca');
    const [locTonKho, setLocTonKho] = useState('con_hang');

    const danhSachSanPhamLoc = useMemo(() => {
        const tuKhoa = tuKhoaSanPham.trim().toLowerCase();
        return danhSachSanPham.filter((sp) => {
            const loai = Array.isArray(sp.danh_muc) ? sp.danh_muc.join(' ') : (sp.danh_muc || '');
            const khopTuKhoa = !tuKhoa || [sp.ten_san_pham, sp.id, sp.ma_san_pham, sp.hang_san_xuat, loai]
                .filter(Boolean).join(' ').toLowerCase().includes(tuKhoa);
            const khopLoai = locLoaiSanPham === 'tat_ca' || loai.toLowerCase().includes(locLoaiSanPham.toLowerCase());
            const khopHang = locHangSanPham === 'tat_ca' || sp.hang_san_xuat === locHangSanPham;
            const tonKho = Number(sp.so_luong_ton_kho) || 0;
            const khopTon = locTonKho === 'tat_ca' || (locTonKho === 'con_hang' ? tonKho > 0 : tonKho <= 0);
            return khopTuKhoa && khopLoai && khopHang && khopTon;
        });
    }, [danhSachSanPham, tuKhoaSanPham, locLoaiSanPham, locHangSanPham, locTonKho]);

    const danhMucSanPham = useMemo(() => [...new Set(danhSachSanPham.flatMap((sp) => Array.isArray(sp.danh_muc) ? sp.danh_muc : [sp.danh_muc]).filter(Boolean))], [danhSachSanPham]);
    const hangSanPham = useMemo(() => [...new Set(danhSachSanPham.map((sp) => sp.hang_san_xuat).filter(Boolean))].sort(), [danhSachSanPham]);
    const hienThiNhan = (giaTri) => {
        const nhanDacBiet = {
            'van-phong-mong-nhe': 'Văn phòng – Mỏng nhẹ',
            'ai-pc': 'AI PC',
            'do-hoa-sang-tao': 'Đồ họa – Sáng tạo',
            'sinh-vien': 'Sinh viên',
            'doanh-nhan': 'Doanh nhân',
            'phu-kien-gear': 'Phụ kiện – Gear',
            'sac-cap-hub': 'Sạc – Cáp – Hub',
            'tai-nghe-loa': 'Tai nghe – Loa',
            'chuot-lot-chuot': 'Chuột – Lót chuột',
            'linh-kien-nang-cap': 'Linh kiện nâng cấp',
            'linh-kien': 'Linh kiện',
            'balo-tui-chong-soc': 'Balo – Túi chống sốc',
            'gaming': 'Gaming',
            'ban-phim-co': 'Bàn phím cơ',
            'de-tan-gia-do': 'Đế tản – Giá đỡ'
        };
        return nhanDacBiet[giaTri] || String(giaTri || '').replace(/[-_]/g, ' ').replace(/\b\w/g, (kyTu) => kyTu.toUpperCase());
    };

    useEffect(() => {
        if (!dangMoModalDonHang) return;
        DiaGioiHanhChinhService.layDanhSachTinhThanhV2Async().then((ds) => {
            setDanhSachTinh(ds || []);
            const tinh = (ds || []).find((item) => item.name === formDonHang.tinh_thanh);
            if (tinh) {
                setMaTinh(String(tinh.code));
                DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(tinh.code).then((xa) => setDanhSachXa(xa || []));
            }
        });
    }, [dangMoModalDonHang, formDonHang.tinh_thanh]);

    const capNhatDiaChi = (key, value) => setFormDonHang((prev) => ({ ...prev, [key]: value }));

    if (!dangMoModalDonHang) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg border border-orange-200/80 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
                {/* Header Cam Ấm Áp & Hiện Đại */}
                <div className="shrink-0 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-6 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner border border-white/30">
                            📦
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                    {donHangDangSua ? 'Cập Nhật' : 'Tạo Đơn'}
                                </span>
                                {donHangDangSua && (
                                    <span className="text-[11px] text-orange-100 font-mono font-bold">
                                        {donHangDangSua.ma_don_hang}
                                    </span>
                                )}
                            </div>
                            <h3 className="text-base sm:text-lg font-black !text-white leading-snug">
                                {donHangDangSua ? 'Cập Nhật Đơn Hàng' : 'Tạo Đơn Hàng Mới'}
                            </h3>
                            <p className="text-xs text-orange-100 font-medium">Nhập thông tin giao nhận và sản phẩm xuất kho</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => !dangLuuDonHang && setDangMoModalDonHang(false)}
                        className="p-2 rounded-full bg-white/15 hover:bg-white/30 text-white cursor-pointer transition-colors"
                        title="Đóng cửa sổ"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={xuLyLuuDonHang} className="flex flex-col flex-1 min-h-0 bg-slate-50/60 dark:bg-slate-950/70">
                    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs">

                        {/* KHỐI 1: THÔNG TIN KHÁCH HÀNG */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <User className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        <span>Khách Hàng / Người Nhận *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn An..."
                                        value={formDonHang.ho_ten}
                                        onChange={(e) => setFormDonHang({ ...formDonHang, ho_ten: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Phone className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        <span>Số Điện Thoại Nhận Hàng *</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="0912345678"
                                        value={formDonHang.so_dien_thoai}
                                        onChange={(e) => setFormDonHang({ ...formDonHang, so_dien_thoai: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold font-mono text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Tỉnh / Thành phố *
                                    </label>
                                    <select required value={maTinh} onChange={async (e) => {
                                        const value = e.target.value;
                                        const tinh = danhSachTinh.find((item) => String(item.code) === value);
                                        setMaTinh(value);
                                        setDanhSachXa([]);
                                        capNhatDiaChi('tinh_thanh', tinh?.name || '');
                                        capNhatDiaChi('phuong_xa', '');
                                        if (value) setDanhSachXa(await DiaGioiHanhChinhService.layDanhSachPhuongXaTheoTinhAsync(value));
                                    }} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:border-orange-500 focus:outline-none">
                                        <option value="">-- Chọn Tỉnh / TP --</option>
                                        {danhSachTinh.map((tinh) => <option key={tinh.code} value={tinh.code}>{tinh.name}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" /> Phường / Xã *
                                    </label>
                                    <select required disabled={!maTinh} value={formDonHang.phuong_xa || ''} onChange={(e) => capNhatDiaChi('phuong_xa', e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:border-orange-500 focus:outline-none disabled:opacity-60">
                                        <option value="">-- Chọn Phường / Xã --</option>
                                        {danhSachXa.map((xa) => <option key={xa.code} value={xa.name}>{xa.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                    <MapPin className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                    <span>Địa Chỉ Nhận Hàng Chi Tiết *</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Số nhà, tên đường, tòa nhà..."
                                    value={formDonHang.dia_chi_chi_tiet}
                                    onChange={(e) => setFormDonHang({ ...formDonHang, dia_chi_chi_tiet: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* KHỐI 2: CHỌN SẢN PHẨM & THANH TOÁN */}
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3.5">
                            {donHangDangSua ? (
                                // SỬA ĐƠN HÀNG: Danh sách sản phẩm CHỈ HIỂN THỊ (read-only) để đảm bảo an toàn dữ liệu,
                                // không cho phép thay đổi sản phẩm/số lượng của đơn hàng đã phát sinh tồn kho/thanh toán.
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <Package className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        <span>Sản Phẩm Trong Đơn (Không thể sửa)</span>
                                    </label>
                                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/60 divide-y divide-slate-200 dark:divide-slate-700">
                                        {(formDonHang.cac_san_pham || []).map((dong, idx) => {
                                            const sp = danhSachSanPham.find(s => (s.id || s._id) === dong.san_pham_id);
                                            return (
                                                <div key={idx} className="px-3 py-2 flex items-center justify-between gap-2 text-xs">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate">
                                                        {sp?.ten_san_pham || 'Sản phẩm'}
                                                    </span>
                                                    <span className="font-mono font-black text-slate-500 dark:text-slate-400 shrink-0">
                                                        SL: {dong.so_luong}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                                        Để thay đổi sản phẩm của đơn hàng, vui lòng hủy đơn và tạo đơn mới.
                                    </p>
                                </div>
                            ) : (
                                // TẠO ĐƠN HÀNG MỚI: cho phép thêm nhiều dòng sản phẩm trong 1 đơn
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Package className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                            <span>Sản Phẩm Đặt Mua *</span>
                                        </label>
                                        <button
                                            type="button"
                                            onClick={themDongSanPhamDonHang}
                                            className="px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 text-[11px] font-black flex items-center gap-1 hover:bg-orange-100 dark:hover:bg-orange-900/60 transition-all cursor-pointer"
                                        >
                                            <PlusCircle className="w-3.5 h-3.5" />
                                            <span>Thêm Sản Phẩm</span>
                                        </button>
                                    </div>

                                    <div className="rounded-xl border border-orange-200 dark:border-orange-900/70 bg-orange-50/60 dark:bg-orange-950/20 p-2.5 space-y-2">
                                        <input value={tuKhoaSanPham} onChange={(e) => setTuKhoaSanPham(e.target.value)} placeholder="Tìm tên, mã sản phẩm, thương hiệu..." className="w-full px-3 py-2 rounded-lg border border-orange-200 dark:border-orange-800 bg-white dark:bg-slate-800 text-xs font-bold focus:border-orange-500 focus:outline-none" />
                                        <div className="grid grid-cols-3 gap-2">
                                            <select value={locLoaiSanPham} onChange={(e) => setLocLoaiSanPham(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold">
                                                <option value="tat_ca">Tất cả loại</option>
                                                {danhMucSanPham.map((loai) => <option key={loai} value={loai}>{hienThiNhan(loai)}</option>)}
                                            </select>
                                            <select value={locHangSanPham} onChange={(e) => setLocHangSanPham(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold">
                                                <option value="tat_ca">Tất cả hãng</option>
                                                {hangSanPham.map((hang) => <option key={hang} value={hang}>{hienThiNhan(hang)}</option>)}
                                            </select>
                                            <select value={locTonKho} onChange={(e) => setLocTonKho(e.target.value)} className="px-2 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-bold">
                                                <option value="con_hang">Còn hàng</option>
                                                <option value="tat_ca">Tất cả tồn kho</option>
                                                <option value="het_hang">Hết hàng</option>
                                            </select>
                                        </div>
                                        <div className="text-[10px] font-bold text-orange-700 dark:text-orange-300">Hiển thị {danhSachSanPhamLoc.length}/{danhSachSanPham.length} sản phẩm phù hợp</div>
                                    </div>

                                    {(formDonHang.cac_san_pham || []).map((dong, idx) => (
                                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2 items-center">
                                            <select
                                                value={dong.san_pham_id}
                                                onChange={(e) => capNhatDongSanPhamDonHang(idx, 'san_pham_id', e.target.value)}
                                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all cursor-pointer"
                                            >
                                                <option value="">-- Chọn sản phẩm --</option>
                                                {[...danhSachSanPhamLoc, ...danhSachSanPham.filter((sp) => (sp.id || sp._id) === dong.san_pham_id && !danhSachSanPhamLoc.some((item) => (item.id || item._id) === (sp.id || sp._id)))].map(sp => (
                                                    <option key={sp.id || sp._id} value={sp.id || sp._id}>
                                                        {sp.ten_san_pham} · {sp.hang_san_xuat || 'Không hãng'} · {dinhDangTienVND(sp.gia_khuyen_mai)} · Tồn: {Number(sp.so_luong_ton_kho) || 0}
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                type="number"
                                                min="1"
                                                value={dong.so_luong}
                                                onChange={(e) => capNhatDongSanPhamDonHang(idx, 'so_luong', e.target.value)}
                                                className="w-full sm:w-20 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-black text-center text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                                title="Số lượng"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => xoaDongSanPhamDonHang(idx)}
                                                disabled={(formDonHang.cac_san_pham || []).length <= 1}
                                                className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer justify-self-start sm:justify-self-auto"
                                                title="Xóa dòng sản phẩm này"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                                <div className="space-y-1.5">
                                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                        <CreditCard className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                        <span>Hình Thức Thanh Toán</span>
                                    </label>
                                    <select
                                        value={formDonHang.hinh_thuc_thanh_toan}
                                        onChange={(e) => setFormDonHang({ ...formDonHang, hinh_thuc_thanh_toan: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:bg-white focus:border-orange-500 focus:outline-none transition-all cursor-pointer"
                                    >
                                        <option value="chuyen_khoan_vietqr">VietQR Chuyển Khoản Ngân Hàng</option>
                                        <option value="thanh_toan_khi_nhan_hang_cod">COD (Thanh toán khi nhận hàng)</option>
                                    </select>
                                </div>
                                {!donHangDangSua && (
                                    <div className="space-y-1.5">
                                        <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-xs">
                                            <Ticket className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                                            <span>Mã Voucher Giảm Giá</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="VD: SALE2026 / TRIKUN500K..."
                                            value={formDonHang.ma_giam_gia}
                                            onChange={(e) => setFormDonHang({ ...formDonHang, ma_giam_gia: e.target.value.toUpperCase() })}
                                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-mono font-black text-xs uppercase focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Pinned Footer */}
                    <div className="shrink-0 p-4 px-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 shadow-md">
                        <button
                            type="button"
                            disabled={dangLuuDonHang}
                            onClick={() => setDangMoModalDonHang(false)}
                            className={`px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-all ${dangLuuDonHang ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                            Hủy Bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={dangLuuDonHang}
                            className={`px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold flex items-center gap-2 shadow-md shadow-orange-500/25 transition-all ${dangLuuDonHang ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer active:scale-95'}`}
                        >
                            {dangLuuDonHang ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            <span>{dangLuuDonHang ? 'Đang lưu đơn hàng...' : (donHangDangSua ? 'Lưu Thay Đổi' : 'Tạo Đơn Hàng')}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
