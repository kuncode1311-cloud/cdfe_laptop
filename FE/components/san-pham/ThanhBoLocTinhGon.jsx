'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    SlidersHorizontal, DollarSign, Tag, ShieldCheck, BadgePercent,
    ArrowUpDown, RotateCcw, LayoutGrid, ListFilter, Check
} from 'lucide-react';
import { useThongKeBoLoc } from './useThongKeBoLoc';
import {
    NhomLocDropdown, DanhSachTuyChon, NutCongTac, TheTagLoc, BIEU_TUONG_LOC
} from './ThanhPhanBoLoc';
import { NHOM_LOC_MAY, TOGGLE_LOC, nhanGiaDangChon } from '@/utils/bo-loc';

const ICON_CONG_TAC = { ho_tro_tra_gop_0: ShieldCheck, dang_giam_gia: BadgePercent, con_hang_san: Check };

/**
 * Thanh Bộ Lọc Nhanh 1 Dòng
 * - Chỉ hiện các nhóm lọc phổ biến (hãng, giá, CPU, RAM, ổ cứng, card, trả góp, giảm giá);
 *   các tiêu chí còn lại (màn hình, tần số quét, tấm nền, còn hàng...) nằm trong nút "Bộ lọc".
 * - Nhóm nào không còn sản phẩm phù hợp (ví dụ đang xem phụ kiện) sẽ tự ẩn.
 * - Các nhóm đọc từ utils/bo-loc.js nên thêm nhóm mới không cần sửa file này.
 */
export default function ThanhBoLocTinhGon({
    boLocHienTai,
    onThayDoiBoLoc,
    onMoBoLocToanDien,
    soLuongDangLoc = 0,
    tatCaSanPham = [],
    cheDoHienThi = 'luoi',
    onThayDoiCheDoHienThi = () => { },
    onDatLaiBoLoc = () => { }
}) {
    const [dropdownMo, setDropdownMo] = useState(null);
    const khungRef = useRef(null);

    // Đóng dropdown khi bấm ra ngoài hoặc nhấn ESC
    useEffect(() => {
        const dongKhiBamNgoai = (e) => {
            if (khungRef.current && !khungRef.current.contains(e.target)) setDropdownMo(null);
        };
        const dongKhiNhanEsc = (e) => e.key === 'Escape' && setDropdownMo(null);
        document.addEventListener('mousedown', dongKhiBamNgoai);
        document.addEventListener('keydown', dongKhiNhanEsc);
        return () => {
            document.removeEventListener('mousedown', dongKhiBamNgoai);
            document.removeEventListener('keydown', dongKhiNhanEsc);
        };
    }, []);

    // Thống kê lấy từ DB, đếm theo bộ lọc đang chọn, mục hết hàng tự ẩn
    const thongKe = useThongKeBoLoc(boLocHienTai, tatCaSanPham);
    const moDong = (id) => setDropdownMo((truoc) => (truoc === id ? null : id));

    // Bật/tắt một mã trong nhóm chọn nhiều (hãng, CPU, RAM...)
    const toggleMa = (khoa, ma) => {
        const ds = boLocHienTai[khoa] || [];
        onThayDoiBoLoc({ ...boLocHienTai, [khoa]: ds.includes(ma) ? ds.filter((x) => x !== ma) : [...ds, ma] });
    };
    const xoaNhom = (khoa) => onThayDoiBoLoc({ ...boLocHienTai, [khoa]: [] });
    const datCongTac = (khoa, giaTri) => onThayDoiBoLoc({ ...boLocHienTai, [khoa]: giaTri });
    const xoaGia = () => onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: undefined, muc_gia_toi_da: undefined });

    // Chữ tóm tắt trên nút: 1 mục -> tên mục, nhiều mục -> "Tên nhóm"
    const tomTatNhom = (nhom, daChon) => {
        if (!daChon.length) return null;
        if (daChon.length > 1) return nhom.nhanNgan;
        return `${nhom.nhanNgan}: ${nhom.tuyChon.find((x) => x.ma === daChon[0])?.nhan || daChon[0]}`;
    };

    const nhanGia = nhanGiaDangChon(boLocHienTai);
    const hangDaChon = boLocHienTai.hang_san_xuat || [];
    const nhomNhanh = thongKe.nhomMay.filter((nhom) => nhom.nhanh);
    const congTacNhanh = thongKe.congTac.filter((t) => t.nhanh);

    return (
        <div ref={khungRef} className="w-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200/90 dark:border-slate-800 p-3 shadow-xs space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                    {/* Nút mở drawer: toàn bộ tiêu chí lọc */}
                    <button
                        type="button"
                        onClick={onMoBoLocToanDien}
                        className={`h-9 px-3.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border-2 ${
                            soLuongDangLoc > 0
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                : 'bg-slate-900 text-white dark:bg-slate-800 border-slate-900 dark:border-slate-700 hover:bg-blue-600 hover:border-blue-600'
                        }`}
                        title="Mở tất cả tiêu chí lọc"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span className="sm:hidden">Bộ lọc</span>
                        <span className="hidden sm:inline">Tất cả bộ lọc</span>
                        {soLuongDangLoc > 0 && (
                            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                                {soLuongDangLoc}
                            </span>
                        )}
                    </button>

                    {/* Các nút lọc nhanh: chỉ hiện từ màn hình lớn (lg) để điện thoại/tablet không bị rối, còn lại dùng nút Bộ lọc */}
                    <div className="hidden lg:flex flex-wrap items-center gap-2">
                        {/* Thương hiệu */}
                        <NhomLocDropdown
                            dangMo={dropdownMo === 'hang'}
                            onBam={() => moDong('hang')}
                            Icon={Tag}
                            mau="blue"
                            tieuDe="Thương hiệu"
                            tomTat={hangDaChon.length ? (hangDaChon.length === 1 ? `Hãng: ${thongKe.tenHang(hangDaChon[0])}` : 'Thương hiệu') : null}
                            soDaChon={hangDaChon.length}
                            tieuDePanel={`Chọn thương hiệu (${thongKe.danhSachHang.length})`}
                            onBoChon={() => xoaNhom('hang_san_xuat')}
                            rong="w-72"
                        >
                            <DanhSachTuyChon
                                kieu="luoi"
                                cao="max-h-56"
                                mau="blue"
                                daChon={hangDaChon}
                                onToggle={(ma) => toggleMa('hang_san_xuat', ma)}
                                tuyChon={thongKe.danhSachHang.map((h) => ({ ma: h.ma, nhan: h.ten, soLuong: h.soLuong }))}
                            />
                        </NhomLocDropdown>

                        {/* Khoảng giá (chọn 1 mức) */}
                        <NhomLocDropdown
                            dangMo={dropdownMo === 'gia'}
                            onBam={() => moDong('gia')}
                            Icon={DollarSign}
                            mau="amber"
                            tieuDe="Khoảng giá"
                            tomTat={nhanGia ? `Giá: ${nhanGia}` : null}
                            rong="w-60"
                        >
                            <div className="space-y-1">
                                {thongKe.khoangGia.map((k) => {
                                    const dangChon = boLocHienTai.muc_gia_toi_thieu === k.min && boLocHienTai.muc_gia_toi_da === k.max;
                                    return (
                                        <button
                                            key={k.nhan}
                                            type="button"
                                            onClick={() => { onThayDoiBoLoc({ ...boLocHienTai, muc_gia_toi_thieu: k.min, muc_gia_toi_da: k.max }); setDropdownMo(null); }}
                                            className={`w-full py-2 px-3 rounded-xl text-left text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                                                dangChon ? 'bg-amber-500 text-white font-black' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                            }`}
                                        >
                                            <span>{k.nhan}</span>
                                            {k.nhanNgan !== null && <span className="text-[10px] opacity-70">{k.soLuong}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </NhomLocDropdown>

                        {/* Các nhóm cấu hình máy phổ biến: CPU, RAM, ổ cứng, card đồ họa */}
                        {nhomNhanh.map((nhom) => {
                            const daChon = boLocHienTai[nhom.khoa] || [];
                            return (
                                <NhomLocDropdown
                                    key={nhom.khoa}
                                    dangMo={dropdownMo === nhom.khoa}
                                    onBam={() => moDong(nhom.khoa)}
                                    Icon={BIEU_TUONG_LOC[nhom.bieuTuong]}
                                    mau={nhom.mau}
                                    tieuDe={nhom.nhan}
                                    tomTat={tomTatNhom(nhom, daChon)}
                                    soDaChon={daChon.length}
                                    tieuDePanel={nhom.nhan}
                                    onBoChon={() => xoaNhom(nhom.khoa)}
                                >
                                    <DanhSachTuyChon
                                        mau={nhom.mau}
                                        daChon={daChon}
                                        onToggle={(ma) => toggleMa(nhom.khoa, ma)}
                                        tuyChon={nhom.tuyChon}
                                    />
                                </NhomLocDropdown>
                            );
                        })}

                        {/* Công tắc nhanh: trả góp 0%, đang giảm giá */}
                        {congTacNhanh.map((t) => (
                            <NutCongTac
                                key={t.khoa}
                                nhan={t.nhan}
                                dangBat={t.dangBat}
                                soLuong={t.soLuong}
                                Icon={ICON_CONG_TAC[t.khoa]}
                                onBam={() => datCongTac(t.khoa, !t.dangBat)}
                            />
                        ))}

                    </div>
                </div>

                {/* Cụm bên phải: sắp xếp & chế độ xem */}
                <div className="flex items-center gap-2 ml-auto">
                    <div className="flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3 text-slate-400 hidden lg:inline" />
                        <select
                            value={boLocHienTai.sap_xep || 'moi_nhat'}
                            onChange={(e) => onThayDoiBoLoc({ ...boLocHienTai, sap_xep: e.target.value })}
                            aria-label="Sắp xếp sản phẩm"
                            className="h-9 pl-2.5 pr-6 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                        >
                            <option value="moi_nhat">Mới nhất</option>
                            <option value="ban_chay_nhat">Bán chạy nhất</option>
                            <option value="gia_tang_dan">Giá: Thấp đến Cao</option>
                            <option value="gia_giam_dan">Giá: Cao đến Thấp</option>
                            <option value="giam_gia_nhieu_nhat">% Giảm sốc</option>
                            <option value="danh_gia_cao">Đánh giá 5★</option>
                        </select>
                    </div>

                    <div className="hidden sm:flex items-center gap-0.5 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        {[
                            { che: 'luoi', Icon: LayoutGrid, tieuDe: 'Chế độ xem lưới' },
                            { che: 'danh_sach', Icon: ListFilter, tieuDe: 'Chế độ xem danh sách' }
                        ].map(({ che, Icon, tieuDe }) => (
                            <button
                                key={che}
                                type="button"
                                onClick={() => onThayDoiCheDoHienThi(che)}
                                title={tieuDe}
                                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                    cheDoHienThi === che ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dải tiêu chí đang lọc: bấm X để bỏ từng cái */}
            {soLuongDangLoc > 0 && (
                <div className="flex flex-nowrap md:flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs overflow-x-auto md:overflow-visible scrollbar-none [&>*]:shrink-0">
                    <span className="text-slate-500 font-bold text-[11px] mr-1">Đang lọc:</span>

                    {boLocHienTai.tu_khoa?.trim() && (
                        <TheTagLoc nhan={`"${boLocHienTai.tu_khoa}"`} onGo={() => onThayDoiBoLoc({ ...boLocHienTai, tu_khoa: '' })} />
                    )}

                    {hangDaChon.map((h) => (
                        <TheTagLoc key={h} nhan={thongKe.tenHang(h)} onGo={() => toggleMa('hang_san_xuat', h)} />
                    ))}

                    {nhanGia && <TheTagLoc nhan={`Giá: ${nhanGia}`} mau="amber" onGo={xoaGia} />}

                    {NHOM_LOC_MAY.flatMap((nhom) =>
                        (boLocHienTai[nhom.khoa] || []).map((ma) => (
                            <TheTagLoc
                                key={`${nhom.khoa}-${ma}`}
                                nhan={`${nhom.nhanNgan}: ${nhom.tuyChon.find((x) => x.ma === ma)?.nhan || ma}`}
                                mau={nhom.mau}
                                onGo={() => toggleMa(nhom.khoa, ma)}
                            />
                        ))
                    )}

                    {TOGGLE_LOC.filter((t) => boLocHienTai[t.khoa]).map((t) => (
                        <TheTagLoc key={t.khoa} nhan={t.nhan} mau="emerald" onGo={() => datCongTac(t.khoa, false)} />
                    ))}

                    <button
                        type="button"
                        onClick={onDatLaiBoLoc}
                        className="text-[11px] font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1 ml-auto transition-colors"
                    >
                        <RotateCcw className="w-3 h-3" />
                        <span>Xóa tất cả ({soLuongDangLoc})</span>
                    </button>
                </div>
            )}
        </div>
    );
}
