'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    Search,
    Edit3,
    Loader2,
    X,
    Check,
    Barcode,
    Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { BaoHanhService } from '@/services/bao-hanh.service';
import PhanTrangAdmin, { usePhanTrang } from '@/app/admin/components/shared/PhanTrangAdmin';

// Helper format ngày: hỗ trợ cả ISO string, đối tượng Date lẫn chuỗi dd/mm/yyyy từ Backend
const dinhDangNgay = (giaTri) => {
    if (!giaTri || giaTri === 'Invalid Date') return '--/--/----';
    if (typeof giaTri === 'string') {
        const str = giaTri.trim();
        if (str === 'Invalid Date') return '--/--/----';
        // Nếu Backend đã định dạng sẵn dạng d/m/yyyy hoặc dd/mm/yyyy thì trả về luôn
        if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(str)) {
            return str;
        }
    }
    try {
        const d = new Date(giaTri);
        if (Number.isNaN(d.getTime())) {
            return typeof giaTri === 'string' && giaTri !== 'Invalid Date' ? giaTri : '--/--/----';
        }
        return d.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch {
        return typeof giaTri === 'string' && giaTri !== 'Invalid Date' ? giaTri : '--/--/----';
    }
};

export default function QuanLyBaoHanh({ xacNhan }) {
    const [danhSach, setDanhSach] = useState([]);
    const [dangTai, setDangTai] = useState(true);
    const [tuKhoa, setTuKhoa] = useState('');
    const [trangThaiLoc, setTrangThaiLoc] = useState('tat-ca');
    const [hangLoc, setHangLoc] = useState('tat-ca');

    const danhSachHang = useMemo(() => [...new Set(danhSach
        .map((bh) => String(bh.hang_san_xuat || '').trim())
        .filter(Boolean))].sort((a, b) => a.localeCompare(b, 'vi')), [danhSach]);

    // Modal sửa thông tin bảo hành
    const [mucDangSua, setMucDangSua] = useState(null);
    const [serialTam, setSerialTam] = useState('');
    const [soThangTam, setSoThangTam] = useState('');
    const [dangLuu, setDangLuu] = useState(false);

    const taiDuLieu = async () => {
        setDangTai(true);
        try {
            const res = await BaoHanhService.layDanhSachBaoHanhAdminAsync(300);
            setDanhSach(Array.isArray(res) ? res : []);
        } catch (e) {
            console.error('[QuanLyBaoHanh] Lỗi tải danh sách bảo hành:', e);
            toast.error('Không thể tải danh sách bảo hành');
        } finally {
            setDangTai(false);
        }
    };

    useEffect(() => {
        taiDuLieu();
    }, []);

    const danhSachDaLoc = useMemo(() => {
        const tu = tuKhoa.trim().toLowerCase();
        return danhSach.filter((bh) => {
            if (hangLoc !== 'tat-ca' && bh.hang_san_xuat !== hangLoc) return false;
            if (trangThaiLoc === 'con-hieu-luc' && !bh.con_hieu_luc) return false;
            if (trangThaiLoc === 'het-hieu-luc' && bh.con_hieu_luc) return false;
            if (trangThaiLoc === 'sap-het-han' && (!bh.con_hieu_luc || Number(bh.so_thang_con_lai) > 3 || bh.so_thang_con_lai == null)) return false;
            if (!tu) return true;
            return [bh.ma_don_hang, bh.khach_hang, bh.so_serial, bh.ten_san_pham, bh.so_dien_thoai]
                .some((giaTri) => String(giaTri || '').toLowerCase().includes(tu));
        });
    }, [danhSach, tuKhoa, trangThaiLoc, hangLoc]);

    const {
        trangHienTai,
        setTrangHienTai,
        soMucMoiTrang,
        setSoMucMoiTrang,
        tongSoTrang,
        tongSoMuc,
        danhSachTrenTrang
    } = usePhanTrang(danhSachDaLoc, 10, [tuKhoa, trangThaiLoc, hangLoc]);

    const moModalSua = (bh) => {
        setMucDangSua(bh);
        setSerialTam(bh.so_serial || '');
        setSoThangTam(bh.thoi_gian_bao_hanh != null ? String(bh.thoi_gian_bao_hanh) : '');
    };

    const dongModal = () => {
        if (dangLuu) return;
        setMucDangSua(null);
    };

    const xuLyLuu = async () => {
        if (!mucDangSua) return;
        if (!serialTam.trim()) {
            toast.error('Vui lòng nhập số Serial sản phẩm');
            return;
        }
        const soThangSo = Number(soThangTam);
        if (!soThangTam || Number.isNaN(soThangSo) || soThangSo <= 0) {
            toast.error('Số tháng bảo hành phải là số lớn hơn 0');
            return;
        }

        const dongY = await xacNhan({
            tieuDe: 'Ghi Đè Thông Tin Bảo Hành',
            noiDung: `Xác nhận cập nhật Serial và thời hạn bảo hành cho sản phẩm "${mucDangSua.ten_san_pham || ''}" thuộc đơn hàng #${mucDangSua.ma_don_hang}?`,
            loai: 'warning'
        });
        if (!dongY) return;

        setDangLuu(true);
        try {
            await BaoHanhService.ghiDeBaoHanhAsync({
                ma_don_hang: mucDangSua.ma_don_hang,
                id_muc: mucDangSua.id_muc,
                so_serial: serialTam.trim(),
                thoi_han_bao_hanh_thang: soThangSo
            });
            setDanhSach((prev) => prev.map((item) => {
                if (item.ma_don_hang === mucDangSua.ma_don_hang && item.id_muc === mucDangSua.id_muc) {
                    return { ...item, so_serial: serialTam.trim(), thoi_gian_bao_hanh: soThangSo };
                }
                return item;
            }));
            toast.success('Đã cập nhật thông tin bảo hành thành công!');
            setMucDangSua(null);
            // Tải lại ngầm để đồng bộ lại ngày hết hạn / trạng thái còn hiệu lực tính từ backend
            taiDuLieu();
        } catch (e) {
            console.error('[QuanLyBaoHanh] Lỗi ghi đè bảo hành:', e);
            toast.error(e.message || 'Không thể cập nhật thông tin bảo hành');
        } finally {
            setDangLuu(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Thanh công cụ tìm kiếm */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-50/90 via-white to-emerald-50/40 dark:from-[#0d1527] dark:via-slate-900 dark:to-[#071a14] border-2 border-emerald-100/90 dark:border-slate-800 shadow-md shadow-emerald-500/5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-lg">
                    <Search className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        value={tuKhoa}
                        onChange={(e) => setTuKhoa(e.target.value)}
                        placeholder="Tìm mã đơn, khách, sản phẩm, số serial..."
                        className="w-full pl-9 pr-8 py-2.5 text-xs font-bold rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/90 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
                    />
                    {tuKhoa && (
                        <button
                            type="button"
                            onClick={() => setTuKhoa('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <select aria-label="Lọc trạng thái bảo hành" value={trangThaiLoc} onChange={(e) => setTrangThaiLoc(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold cursor-pointer">
                        <option value="tat-ca">Tất cả trạng thái</option>
                        <option value="con-hieu-luc">Còn hiệu lực</option>
                        <option value="sap-het-han">Sắp hết hạn (≤ 3 tháng)</option>
                        <option value="het-hieu-luc">Hết hiệu lực</option>
                    </select>
                    <select aria-label="Lọc hãng sản xuất" value={hangLoc} onChange={(e) => setHangLoc(e.target.value)} className="px-3 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold cursor-pointer">
                        <option value="tat-ca">Tất cả hãng</option>
                        {danhSachHang.map((hang) => <option key={hang} value={hang}>{hang}</option>)}
                    </select>
                    {(tuKhoa || trangThaiLoc !== 'tat-ca' || hangLoc !== 'tat-ca') && (
                        <button type="button" onClick={() => { setTuKhoa(''); setTrangThaiLoc('tat-ca'); setHangLoc('tat-ca'); }} className="px-3 py-2.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950 cursor-pointer">Xóa lọc</button>
                    )}
                </div>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-black whitespace-nowrap">
                    {danhSachDaLoc.length} / {danhSach.length} mục bảo hành
                </span>
            </div>

            {/* Bảng danh sách bảo hành */}
            <div className="relative bg-white dark:bg-[#0d1527] rounded-3xl border-2 border-slate-300 dark:border-slate-700 shadow-md shadow-slate-900/5 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white px-5 py-4 flex items-center gap-3 shadow-md">
                    <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                            Danh Sách Bảo Hành Sản Phẩm
                        </h3>
                        <div className="text-[11px] text-emerald-100 font-medium">
                            Theo dõi & cập nhật serial, thời hạn bảo hành thực tế cho khách hàng
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1100px] text-left text-xs border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black uppercase text-[11px] tracking-wider whitespace-nowrap">
                                <th className="py-3 px-3.5 w-36 border-b-2 border-r border-slate-300 dark:border-slate-700">MÃ ĐƠN HÀNG</th>
                                <th className="py-3 px-3.5 w-52 border-b-2 border-r border-slate-300 dark:border-slate-700">SẢN PHẨM</th>
                                <th className="py-3 px-3.5 w-36 border-b-2 border-r border-slate-300 dark:border-slate-700">SERIAL</th>
                                <th className="py-3 px-3.5 w-44 border-b-2 border-r border-slate-300 dark:border-slate-700">KHÁCH HÀNG</th>
                                <th className="py-3 px-3.5 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700">KÍCH HOẠT</th>
                                <th className="py-3 px-3.5 w-28 border-b-2 border-r border-slate-300 dark:border-slate-700">HẾT HẠN</th>
                                <th className="py-3 px-3.5 w-36 text-center border-b-2 border-r border-slate-300 dark:border-slate-700">TRẠNG THÁI</th>
                                <th className="py-3 px-3.5 w-24 text-right border-b-2 border-slate-300 dark:border-slate-700">THAO TÁC</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {dangTai ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                                            <span className="font-bold">Đang tải danh sách bảo hành...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : danhSachDaLoc.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <ShieldAlert className="w-10 h-10 text-slate-300 stroke-[1.5]" />
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {danhSach.length === 0 ? 'Chưa có mục bảo hành nào' : 'Không tìm thấy mục bảo hành phù hợp'}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                danhSachTrenTrang.map((bh) => {
                                    const key = `${bh.ma_don_hang}_${bh.id_muc}`;
                                    const conHieuLuc = !!bh.con_hieu_luc;
                                    return (
                                        <tr
                                            key={key}
                                            className="transition-colors duration-150 odd:bg-white even:bg-slate-50/70 dark:odd:bg-[#0d1527] dark:even:bg-[#090f1d] hover:!bg-emerald-50/80 dark:hover:!bg-emerald-950/30"
                                        >
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap">
                                                <span className="font-mono font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-800">
                                                    #{bh.ma_don_hang}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <div className="font-bold text-slate-800 dark:text-slate-200 text-xs leading-snug line-clamp-2 max-w-[200px]">
                                                    {bh.ten_san_pham || ''}
                                                </div>
                                                {bh.hang_san_xuat && (
                                                    <div className="text-[11px] text-slate-400 font-semibold">{bh.hang_san_xuat}</div>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <div className="flex items-center gap-1.5 font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                    <Barcode className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                    <span className="truncate max-w-[110px]" title={bh.so_serial}>{bh.so_serial || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle">
                                                <div className="font-extrabold text-slate-900 dark:text-white text-xs">{bh.khach_hang || ''}</div>
                                                {bh.so_dien_thoai && (
                                                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-mono font-bold text-[11px] whitespace-nowrap">
                                                        <Phone className="w-3 h-3 shrink-0" />
                                                        <span>{bh.so_dien_thoai}</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap text-slate-600 dark:text-slate-400 font-semibold">
                                                {dinhDangNgay(bh.ngay_kich_hoat)}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle whitespace-nowrap text-slate-600 dark:text-slate-400 font-semibold">
                                                {dinhDangNgay(bh.ngay_het_han)}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-r border-slate-200 dark:border-slate-800 align-middle text-center">
                                                {conHieuLuc ? (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 whitespace-nowrap">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        Còn hiệu lực{bh.so_thang_con_lai != null ? ` (${bh.so_thang_con_lai} tháng)` : ''}
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 whitespace-nowrap">
                                                        <ShieldAlert className="w-3 h-3" />
                                                        Hết hiệu lực
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-3.5 border-b border-slate-200 dark:border-slate-800 align-middle text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => moModalSua(bh)}
                                                    className="p-1.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 transition-all shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
                                                    title="Sửa thông tin bảo hành"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Thanh Phân Trang Chuẩn */}
                <PhanTrangAdmin
                    trangHienTai={trangHienTai}
                    tongSoTrang={tongSoTrang}
                    tongSoMuc={tongSoMuc}
                    soMucMoiTrang={soMucMoiTrang}
                    onDoiTrang={setTrangHienTai}
                    onDoiSoMucMoiTrang={setSoMucMoiTrang}
                    nhanLoaiMuc="phiếu bảo hành"
                />
            </div>

            {/* Modal sửa thông tin bảo hành */}
            {mucDangSua && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#0d1527] w-full max-w-md rounded-3xl shadow-2xl border-2 border-slate-300 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-5 bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-black text-sm text-white">Sửa Thông Tin Bảo Hành</div>
                                    <div className="text-[11px] text-emerald-100">Đơn #{mucDangSua.ma_don_hang}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={dongModal}
                                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6 space-y-4">
                            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-xs">
                                <div className="text-slate-400 text-[11px] font-bold">Sản phẩm:</div>
                                <div className="font-extrabold text-slate-900 dark:text-white">{mucDangSua.ten_san_pham}</div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                                    Số Serial Thật Của Sản Phẩm:
                                </label>
                                <input
                                    type="text"
                                    value={serialTam}
                                    onChange={(e) => setSerialTam(e.target.value)}
                                    placeholder="VD: SN-LPT-00123456"
                                    className="w-full p-3 text-xs font-bold rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-2xs"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-wider mb-1.5">
                                    Thời Hạn Bảo Hành (Số Tháng):
                                </label>
                                <input
                                    type="number"
                                    min={1}
                                    value={soThangTam}
                                    onChange={(e) => setSoThangTam(e.target.value)}
                                    placeholder="VD: 24"
                                    className="w-full p-3 text-xs font-bold rounded-2xl border-2 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all shadow-2xs"
                                />
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2.5">
                            <button
                                type="button"
                                onClick={dongModal}
                                disabled={dangLuu}
                                className="px-4 py-2 rounded-xl border-2 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-60"
                            >
                                Đóng
                            </button>
                            <button
                                type="button"
                                onClick={xuLyLuu}
                                disabled={dangLuu}
                                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/25 cursor-pointer disabled:opacity-60"
                            >
                                {dangLuu ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 stroke-[3]" />}
                                <span>Lưu Thay Đổi</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
