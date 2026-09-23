'use client';
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    CheckCircle2, 
    AlertCircle, 
    Bookmark, 
    PlusCircle, 
    Building2, 
    Home, 
    FileText, 
    Sparkles, 
    Check, 
    Navigation, 
    Compass, 
    ChevronDown 
} from 'lucide-react';
import { AuthContext, locDiaChiHopLe } from '@/contexts/AuthContext';
import { 
    DiaGioiHanhChinhService, 
    khopTuKhoaDiaChi, 
    DANH_SACH_63_TINH_THANH_CHUAN,
    DANH_SACH_34_TINH_THANH_SAU_SAP_NHAP 
} from '@/services/dia-gioi-hanh-chinh.service';

// Helper chuẩn hóa tiếng Việt không dấu để tìm kiếm gõ nhanh
const xoaDauTiengViet = (str = '') => {
    return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
};

// Ô Input Tìm Kiếm & Chọn Địa Giới Trực Tiếp (Tiêu đề 1 dòng chuẩn chỉ, không vỡ form, thông báo lỗi đặt dưới ô input)
function OChonDiaGioi({
    label,
    icon: Icon,
    iconColor = 'bg-blue-100 text-[#0052cc] border-blue-200 dark:bg-blue-950/70 dark:text-cyan-400 dark:border-blue-800',
    danhSach = [],
    giaTri = '',
    onChon,
    placeholder = 'Chọn...',
    disabled = false,
    batBuoc = true,
    daCham = false,
    loi = ''
}) {
    const [dangMo, setDangMo] = useState(false);
    const [tuKhoa, setTuKhoa] = useState(giaTri || '');
    const refContainer = useRef(null);
    const refInput = useRef(null);

    // Đồng bộ từ khóa khi giá trị từ bên ngoài cập nhật (chỉ khi đang không mở gõ tìm kiếm)
    useEffect(() => {
        if (!dangMo) {
            setTuKhoa(giaTri || '');
        }
    }, [giaTri, dangMo]);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const xuLyClickNgoai = (e) => {
            if (refContainer.current && !refContainer.current.contains(e.target)) {
                setDangMo(false);
                setTuKhoa(giaTri || '');
            }
        };
        document.addEventListener('mousedown', xuLyClickNgoai);
        return () => document.removeEventListener('mousedown', xuLyClickNgoai);
    }, [giaTri]);

    // Lọc danh sách realtime chuẩn xác theo từ khóa người dùng gõ
    const danhSachLoc = useMemo(() => {
        const kw = (tuKhoa || '').trim();
        if (!kw) return danhSach || [];
        return (danhSach || []).filter(item => khopTuKhoaDiaChi(item, kw));
    }, [danhSach, tuKhoa]);

    const handleInputChange = (e) => {
        const val = e.target.value;
        setTuKhoa(val);
        setDangMo(true);
        if (!val.trim()) {
            onChon({ name: '', code: '' });
        }
    };

    const handleItemClick = (item) => {
        const ten = item?.name || item?.ten || '';
        setTuKhoa(ten);
        onChon(item);
        setDangMo(false);
    };

    const coLoi = daCham && batBuoc && !giaTri;

    return (
        <div className="relative space-y-1.5" ref={refContainer}>
            {/* Label chuẩn 1 dòng, không bị flex justify-between chèn ép gây rớt dòng vỡ form */}
            <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                {Icon && (
                    <span className={`w-4 h-4 rounded-md flex items-center justify-center border shrink-0 ${iconColor}`}>
                        <Icon className="w-2.5 h-2.5" />
                    </span>
                )}
                <span className="truncate">{label}</span>
                {batBuoc && <span className="text-red-500 font-bold shrink-0">*</span>}
            </label>

            {/* Ô input tìm kiếm */}
            <div className="relative">
                <input
                    ref={refInput}
                    type="text"
                    disabled={disabled}
                    value={tuKhoa}
                    onChange={handleInputChange}
                    onFocus={() => {
                        if (!disabled) setDangMo(true);
                    }}
                    role="combobox"
                    aria-expanded={dangMo}
                    aria-autocomplete="list"
                    placeholder={disabled ? 'Chọn cấp trước...' : placeholder}
                    className={`w-full pl-3.5 pr-8 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-semibold transition-all shadow-2xs ${
                        disabled
                            ? 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed placeholder:text-slate-400'
                            : dangMo
                            ? 'bg-white dark:bg-slate-800 border-[#0052cc] ring-4 ring-blue-500/15 text-slate-900 dark:text-white'
                            : coLoi
                            ? 'border-red-400 bg-red-50/20 text-slate-900 dark:text-white'
                            : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-900 dark:text-white'
                    }`}
                />

                <button
                    type="button"
                    tabIndex={-1}
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!disabled) {
                            setDangMo(prev => {
                                const nextState = !prev;
                                if (nextState) {
                                    refInput.current?.focus({ preventScroll: true });
                                }
                                return nextState;
                            });
                        }
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 cursor-pointer disabled:cursor-not-allowed"
                >
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dangMo ? 'rotate-180 text-[#0052cc]' : ''}`} />
                </button>

                {/* Dropdown menu gợi ý được gán trực tiếp vào wrapper input, chống tuyệt đối việc giật layout */}
                {dangMo && !disabled && (
                    <div 
                        role="listbox"
                        className="absolute left-0 right-0 top-[calc(100%+5px)] z-[100] bg-white dark:bg-slate-900 rounded-2xl border-2 border-[#0052cc] dark:border-blue-500 shadow-2xl overflow-hidden"
                    >
                        <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                            {danhSachLoc.length === 0 ? (
                                <div className="p-3.5 text-center text-slate-400 text-xs font-semibold">
                                    Không tìm thấy kết quả phù hợp
                                </div>
                            ) : (
                                danhSachLoc.map((item, idx) => {
                                    const ten = item.name || item.ten || '';
                                    const isSelected = giaTri === ten;
                                    return (
                                        <button
                                            key={`opt-${item.code || ''}-${item.codename || ''}-${idx}`}
                                            type="button"
                                            role="option"
                                            aria-selected={isSelected}
                                            onMouseDown={(e) => {
                                                e.preventDefault();
                                                handleItemClick(item);
                                            }}
                                            className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between font-semibold transition-colors cursor-pointer select-none ${
                                                isSelected
                                                    ? 'bg-blue-50 dark:bg-blue-950/70 text-[#0052cc] dark:text-cyan-400 font-black'
                                                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                                            }`}
                                        >
                                            <span>{ten}</span>
                                            {isSelected && <Check className="w-4 h-4 text-[#0052cc] dark:text-cyan-400 shrink-0 ml-1.5 stroke-[2.5]" />}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Thông báo lỗi nằm ở dưới ô input thay vì chen vào label gây lệch chiều cao */}
            {coLoi && (
                <p className="text-[10.5px] font-bold text-red-500 flex items-center gap-1 mt-1 leading-none animate-in fade-in">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{loi || 'Vui lòng chọn'}</span>
                </p>
            )}
        </div>
    );
}

export default function FormThongTinGiaoHang({ thongTin, onThayDoi, onValidationChange }) {
    const authCtx = useContext(AuthContext);
    const nguoiDung = authCtx?.nguoiDung;
    const danhSachDiaChi = locDiaChiHopLe(Array.isArray(nguoiDung?.danhSachDiaChi) ? nguoiDung.danhSachDiaChi : []);

    // Tab chọn: 'mac_dinh' (Địa chỉ tài khoản / Sổ địa chỉ) vs 'moi' (Nhập địa chỉ mới khác)
    const [cheDoDiaChi, setCheDoDiaChi] = useState(danhSachDiaChi.length > 0 || nguoiDung ? 'mac_dinh' : 'moi');
    const [diaChiChonId, setDiaChiChonId] = useState(null);
    const [daCham, setDaCham] = useState({});
    const [luuDiaChiMoi, setLuuDiaChiMoi] = useState(true);

    // Dữ liệu API Địa giới hành chính Chuẩn Quốc Gia (63 Tỉnh/TP - 3 Cấp)
    const [danhSachTinh, setDanhSachTinh] = useState(DANH_SACH_63_TINH_THANH_CHUAN);
    const [danhSachQuan, setDanhSachQuan] = useState([]);
    const [danhSachXa, setDanhSachXa] = useState([]);

    // 1. Đồng bộ dữ liệu Tỉnh Thành từ DiaGioiHanhChinhService
    useEffect(() => {
        let isMounted = true;
        DiaGioiHanhChinhService.layDanhSachTinhThanhAsync().then(res => {
            if (isMounted && Array.isArray(res) && res.length > 0) {
                setDanhSachTinh(res);
            }
        });
        return () => { isMounted = false; };
    }, []);

    // 2. Khởi tạo thông tin từ tài khoản nếu có
    useEffect(() => {
        if (nguoiDung) {
            const diaChiMacDinh = danhSachDiaChi.find(d => d.macDinh) || danhSachDiaChi[0];
            if (diaChiMacDinh) {
                chonDiaChiCoSan(diaChiMacDinh);
            } else if (!thongTin.ho_va_ten && !thongTin.email) {
                onThayDoi({
                    ...thongTin,
                    ho_va_ten: nguoiDung.hoTen || '',
                    email: nguoiDung.email || '',
                    so_dien_thoai: nguoiDung.soDienThoai || thongTin.so_dien_thoai || ''
                });
            }
        }
    }, [nguoiDung]);

    // 3. Xử lý khi chọn Tỉnh / Thành Phố -> tự động map và tải danh sách Quận / Huyện
    const chonTinhThanh = async (tinh) => {
        setDaCham(prev => ({ ...prev, tinh_thanh: true }));
        onThayDoi({
            ...thongTin,
            tinh_thanh: tinh.name || '',
            quan_huyen: '',
            phuong_xa: ''
        });
        setDanhSachQuan([]);
        setDanhSachXa([]);

        if (tinh.code) {
            const dsQuan = await DiaGioiHanhChinhService.layDanhSachQuanHuyenAsync(tinh.code);
            setDanhSachQuan(dsQuan || []);
        }
    };

    // 4. Xử lý khi chọn Quận / Huyện -> tự động map và tải danh sách Phường / Xã
    const chonQuanHuyen = async (quan) => {
        setDaCham(prev => ({ ...prev, quan_huyen: true }));
        onThayDoi({
            ...thongTin,
            quan_huyen: quan.name || '',
            phuong_xa: ''
        });
        setDanhSachXa([]);

        if (quan.code) {
            const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaAsync(quan.code);
            setDanhSachXa(dsXa || []);
        }
    };

    // 5. Xử lý khi chọn Phường / Xã
    const chonPhuongXa = (xa) => {
        setDaCham(prev => ({ ...prev, phuong_xa: true }));
        onThayDoi({
            ...thongTin,
            phuong_xa: xa.name || ''
        });
    };

    // 6. Validate realtime từng trường dữ liệu
    const kiemTraHopLe = {
        ho_va_ten: Boolean(thongTin.ho_va_ten && thongTin.ho_va_ten.trim().length >= 2),
        so_dien_thoai: Boolean(
            thongTin.so_dien_thoai && 
            /^(0[3|5|7|8|9])[0-9]{8}$/.test(thongTin.so_dien_thoai.replace(/\D/g, ''))
        ),
        email: Boolean(
            thongTin.email && 
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(thongTin.email.trim())
        ),
        tinh_thanh: Boolean(thongTin.tinh_thanh && thongTin.tinh_thanh.trim().length >= 2),
        quan_huyen: Boolean(
            thongTin.quan_huyen 
                ? thongTin.quan_huyen.trim().length >= 2 
                : Boolean(thongTin.tinh_thanh && thongTin.phuong_xa)
        ),
        phuong_xa: Boolean(thongTin.phuong_xa && thongTin.phuong_xa.trim().length >= 2),
        dia_chi_chi_tiet: Boolean(thongTin.dia_chi_chi_tiet && thongTin.dia_chi_chi_tiet.trim().length >= 3)
    };

    const tatCaHopLe = Object.values(kiemTraHopLe).every(Boolean);

    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(tatCaHopLe);
        }
    }, [tatCaHopLe, onValidationChange]);

    const capNhat = (truong, giaTri) => {
        setDaCham(prev => ({ ...prev, [truong]: true }));
        onThayDoi({ ...thongTin, [truong]: giaTri });
    };

    // 7. Chọn địa chỉ có sẵn trong sổ địa chỉ của tài khoản
    const chonDiaChiCoSan = async (dc) => {
        setDiaChiChonId(dc.id);
        onThayDoi({
            ...thongTin,
            ho_va_ten: dc.hoTen || thongTin.ho_va_ten || nguoiDung?.hoTen || '',
            so_dien_thoai: dc.soDienThoai || thongTin.so_dien_thoai || nguoiDung?.soDienThoai || '',
            tinh_thanh: dc.tinhThanh || '',
            quan_huyen: dc.quanHuyen || '',
            phuong_xa: dc.phuongXa || '',
            dia_chi_chi_tiet: dc.diaChiChiTiet || ''
        });
        setDaCham({
            ho_va_ten: true,
            so_dien_thoai: true,
            email: true,
            tinh_thanh: true,
            quan_huyen: true,
            phuong_xa: true,
            dia_chi_chi_tiet: true
        });

        // Tự động map và nạp danh sách Quận/Huyện, Phường/Xã từ API tương ứng với địa chỉ đã lưu
        if (dc.tinhThanh) {
            const listTinh = danhSachTinh.length > 0 ? danhSachTinh : await DiaGioiHanhChinhService.layDanhSachTinhThanhAsync();
            const foundTinh = listTinh.find(t => 
                xoaDauTiengViet(t.name).includes(xoaDauTiengViet(dc.tinhThanh)) ||
                xoaDauTiengViet(dc.tinhThanh).includes(xoaDauTiengViet(t.name))
            );
            if (foundTinh) {
                const dsQuan = await DiaGioiHanhChinhService.layDanhSachQuanHuyenAsync(foundTinh.code);
                setDanhSachQuan(dsQuan || []);
                if (dc.quanHuyen) {
                    const foundQuan = (dsQuan || []).find(q => 
                        xoaDauTiengViet(q.name).includes(xoaDauTiengViet(dc.quanHuyen)) ||
                        xoaDauTiengViet(dc.quanHuyen).includes(xoaDauTiengViet(q.name))
                    );
                    if (foundQuan) {
                        const dsXa = await DiaGioiHanhChinhService.layDanhSachPhuongXaAsync(foundQuan.code);
                        setDanhSachXa(dsXa || []);
                    }
                }
            }
        }
    };

    const chonDungThongTinTaiKhoan = () => {
        if (!nguoiDung) return;
        onThayDoi({
            ...thongTin,
            ho_va_ten: nguoiDung.hoTen || thongTin.ho_va_ten,
            so_dien_thoai: nguoiDung.soDienThoai || thongTin.so_dien_thoai,
            email: nguoiDung.email || thongTin.email
        });
    };

    return (
        <div className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            {/* Header của khối */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 gap-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#0052cc] text-white flex items-center justify-center shadow-xs">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                        <h3 className="font-black text-xs sm:text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                            1. THÔNG TIN NGƯỜI NHẬN HÀNG
                        </h3>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            Kiểm tra chính xác địa chỉ để giao hàng hỏa tốc trong 2 giờ
                        </p>
                    </div>
                </div>

                {tatCaHopLe ? (
                    <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-black border border-emerald-300 dark:border-emerald-800 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đầy đủ & hợp lệ</span>
                    </span>
                ) : (
                    <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-300 dark:border-amber-800 shadow-2xs">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Cần điền đủ các ô có dấu * đỏ</span>
                    </span>
                )}
            </div>

            {/* BỘ TAB CHỌN: DÙNG ĐỊA CHỈ ĐÃ LƯU VS NHẬP ĐỊA CHỈ MỚI */}
            <div className="flex items-center p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border-2 border-slate-200 dark:border-slate-700">
                <button
                    type="button"
                    onClick={() => {
                        setCheDoDiaChi('mac_dinh');
                        const diaChiMacDinh = danhSachDiaChi.find(d => d.macDinh) || danhSachDiaChi[0];
                        if (diaChiMacDinh) {
                            chonDiaChiCoSan(diaChiMacDinh);
                        }
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        cheDoDiaChi === 'mac_dinh'
                            ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/25'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Dùng Địa Chỉ Mặc Định / Đã Lưu</span>
                    {danhSachDiaChi.length > 0 && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                            cheDoDiaChi === 'mac_dinh' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                            {danhSachDiaChi.length}
                        </span>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() => {
                        setCheDoDiaChi('moi');
                        setDiaChiChonId(null);
                        onThayDoi({
                            ...thongTin,
                            tinh_thanh: '',
                            quan_huyen: '',
                            phuong_xa: '',
                            dia_chi_chi_tiet: ''
                        });
                        setDanhSachQuan([]);
                        setDanhSachXa([]);
                    }}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        cheDoDiaChi === 'moi'
                            ? 'bg-[#0052cc] text-white shadow-md shadow-blue-600/25'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Giao Đến Địa Chỉ Mới / Khác</span>
                </button>
            </div>

            {/* TAB 1: DANH SÁCH ĐỊA CHỈ ĐÃ LƯU TRONG TÀI KHOẢN */}
            {cheDoDiaChi === 'mac_dinh' && (
                <div className="space-y-3 p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-800/60 border-2 border-blue-200 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            <span>Sổ Địa Chỉ Giao Hàng Của Bạn:</span>
                        </span>
                        {nguoiDung && (
                            <button
                                type="button"
                                onClick={chonDungThongTinTaiKhoan}
                                className="text-[11px] font-bold text-[#0052cc] dark:text-cyan-400 hover:underline cursor-pointer"
                            >
                                Đồng bộ lại thông tin tài khoản
                            </button>
                        )}
                    </div>

                    {danhSachDiaChi.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            {danhSachDiaChi.map((dc) => {
                                const duocChon = diaChiChonId === dc.id;
                                const diaChiChuoi = [dc.diaChiChiTiet, dc.phuongXa, dc.quanHuyen, dc.tinhThanh].filter(Boolean).join(', ');
                                return (
                                    <div
                                        key={dc.id}
                                        onClick={() => chonDiaChiCoSan(dc)}
                                        className={`p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all shadow-2xs relative ${
                                            duocChon
                                                ? 'border-[#0052cc] bg-white dark:bg-slate-800 ring-2 ring-blue-500/20 shadow-md'
                                                : 'border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between gap-2 mb-1.5">
                                            <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5 truncate">
                                                {dc.loaiDiaChi === 'van_phong' ? (
                                                    <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                                ) : (
                                                    <Home className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                )}
                                                <span className="truncate">{dc.hoTen || nguoiDung?.hoTen}</span>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                {dc.macDinh && (
                                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0052cc] dark:text-cyan-400 font-black text-[10px]">
                                                        Mặc Định
                                                    </span>
                                                )}
                                                {duocChon ? (
                                                    <div className="w-4 h-4 rounded-full bg-[#0052cc] text-white flex items-center justify-center">
                                                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                                                    </div>
                                                ) : (
                                                    <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                                )}
                                            </div>
                                        </div>

                                        <div className="text-[11.5px] font-mono font-bold text-slate-700 dark:text-slate-300">
                                            {dc.soDienThoai || nguoiDung?.soDienThoai}
                                        </div>

                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                            {diaChiChuoi}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        /* Trường hợp người dùng chưa lưu danh bạ địa chỉ riêng */
                        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border-2 border-blue-200 dark:border-slate-700 flex items-center justify-between gap-3">
                            <div className="space-y-0.5">
                                <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>Tài khoản: <strong>{nguoiDung?.hoTen || 'Khách Hàng'}</strong></span>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                        Đã xác thực
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    SĐT: <strong className="font-mono">{nguoiDung?.soDienThoai || '0988888888'}</strong> • Email: <strong className="font-mono">{nguoiDung?.email || 'admin@laptopnew.vn'}</strong>
                                </p>
                            </div>
                            <span className="text-[11px] font-bold text-[#0052cc] dark:text-cyan-400">
                                Đang tự động điền form ↓
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* FORM NHẬP LIỆU GỌN GÀNG, SANG TRỌNG - KHÔNG VỠ FORM, CHIỀU CAO ĐỒNG BỘ */}
            <div className="space-y-4">
                <div className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center justify-between">
                    <span>{cheDoDiaChi === 'mac_dinh' ? 'Chi Tiết Thông Tin Người Nhận:' : 'Nhập Địa Chỉ Giao Hàng Mới:'}</span>
                    <span className="text-[11px] text-slate-400 font-normal">Các ô dấu * bắt buộc</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* 1. Họ và Tên */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                            <span className="w-4 h-4 rounded-md bg-blue-100 dark:bg-blue-950/70 text-[#0052cc] dark:text-cyan-400 flex items-center justify-center border border-blue-200 dark:border-blue-800 shrink-0">
                                <User className="w-2.5 h-2.5" />
                            </span>
                            <span>Họ và tên người nhận hàng</span>
                            <span className="text-red-500 font-bold shrink-0">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={thongTin.ho_va_ten}
                            onChange={(e) => capNhat('ho_va_ten', e.target.value)}
                            onBlur={() => setDaCham(prev => ({ ...prev, ho_va_ten: true }))}
                            placeholder="Ví dụ: Nguyễn Văn A"
                            className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none transition-all shadow-2xs ${
                                daCham.ho_va_ten && !kiemTraHopLe.ho_va_ten
                                    ? 'border-red-400 bg-red-50/20 focus:ring-4 focus:ring-red-400/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15'
                            }`}
                        />
                        {daCham.ho_va_ten && !kiemTraHopLe.ho_va_ten && (
                            <p className="text-[10.5px] font-bold text-red-500 flex items-center gap-1 mt-1 leading-none animate-in fade-in">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Vui lòng nhập họ và tên (tối thiểu 2 ký tự)</span>
                            </p>
                        )}
                    </div>

                    {/* 2. Số Điện Thoại */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                            <span className="w-4 h-4 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0">
                                <Phone className="w-2.5 h-2.5" />
                            </span>
                            <span>Số điện thoại</span>
                            <span className="text-red-500 font-bold shrink-0">*</span>
                        </label>
                        <input
                            type="tel"
                            required
                            value={thongTin.so_dien_thoai}
                            onChange={(e) => capNhat('so_dien_thoai', e.target.value)}
                            onBlur={() => setDaCham(prev => ({ ...prev, so_dien_thoai: true }))}
                            placeholder="Ví dụ: 0912345678"
                            className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-slate-900 dark:text-white font-mono text-xs sm:text-sm font-bold focus:bg-white focus:outline-none transition-all shadow-2xs ${
                                daCham.so_dien_thoai && !kiemTraHopLe.so_dien_thoai
                                    ? 'border-red-400 bg-red-50/20 focus:ring-4 focus:ring-red-400/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15'
                            }`}
                        />
                        {daCham.so_dien_thoai && !kiemTraHopLe.so_dien_thoai && (
                            <p className="text-[10.5px] font-bold text-red-500 flex items-center gap-1 mt-1 leading-none animate-in fade-in">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Vui lòng nhập đúng 10 số di động Việt Nam</span>
                            </p>
                        )}
                    </div>

                    {/* 3. Email */}
                    <div className="space-y-1.5">
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                            <span className="w-4 h-4 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200 dark:border-purple-800 shrink-0">
                                <Mail className="w-2.5 h-2.5" />
                            </span>
                            <span>Email nhận hóa đơn</span>
                            <span className="text-red-500 font-bold shrink-0">*</span>
                        </label>
                        <input
                            type="email"
                            required
                            value={thongTin.email}
                            onChange={(e) => capNhat('email', e.target.value)}
                            onBlur={() => setDaCham(prev => ({ ...prev, email: true }))}
                            placeholder="Ví dụ: khachhang@gmail.com"
                            className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none transition-all shadow-2xs ${
                                daCham.email && !kiemTraHopLe.email
                                    ? 'border-red-400 bg-red-50/20 focus:ring-4 focus:ring-red-400/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15'
                            }`}
                        />
                        {daCham.email && !kiemTraHopLe.email && (
                            <p className="text-[10.5px] font-bold text-red-500 flex items-center gap-1 mt-1 leading-none animate-in fade-in">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Email không đúng định dạng</span>
                            </p>
                        )}
                    </div>

                    {/* 4, 5, 6: BỘ 3 Ô CHỌN TỈNH / THÀNH, QUẬN / HUYỆN, PHƯỜNG / XÃ (ĐỒNG ĐỀU TRÊN 3 CỘT, TIÊU ĐỀ 1 DÒNG KHÔNG LỆCH) */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:col-span-2 items-start">
                        {/* 4. Tỉnh / Thành Phố */}
                        <OChonDiaGioi
                            label="Tỉnh / Thành phố"
                            icon={Navigation}
                            iconColor="bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-400 dark:border-amber-800"
                            danhSach={danhSachTinh}
                            giaTri={thongTin.tinh_thanh}
                            onChon={chonTinhThanh}
                            placeholder="Chọn Tỉnh / TP..."
                            daCham={daCham.tinh_thanh}
                            loi="Vui lòng chọn Tỉnh/TP"
                        />

                        {/* 5. Quận / Huyện */}
                        <OChonDiaGioi
                            label="Quận / Huyện"
                            icon={Compass}
                            iconColor="bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-400 dark:border-indigo-800"
                            danhSach={danhSachQuan}
                            giaTri={thongTin.quan_huyen}
                            onChon={chonQuanHuyen}
                            placeholder={thongTin.tinh_thanh ? "Chọn Quận / Huyện..." : "Chọn Tỉnh trước"}
                            disabled={!thongTin.tinh_thanh}
                            daCham={daCham.quan_huyen}
                            loi="Vui lòng chọn Quận/Huyện"
                        />

                        {/* 6. Phường / Xã */}
                        <OChonDiaGioi
                            label="Phường / Xã"
                            icon={Building2}
                            iconColor="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-400 dark:border-emerald-800"
                            danhSach={danhSachXa}
                            giaTri={thongTin.phuong_xa || ''}
                            onChon={chonPhuongXa}
                            placeholder={thongTin.quan_huyen ? "Chọn Phường / Xã..." : "Chọn Huyện trước"}
                            disabled={!thongTin.quan_huyen}
                            batBuoc={false}
                            daCham={daCham.phuong_xa}
                        />
                    </div>

                    {/* 7. Địa Chỉ Chi Tiết */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                            <span className="w-4 h-4 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200 dark:border-rose-800 shrink-0">
                                <Home className="w-2.5 h-2.5" />
                            </span>
                            <span>Địa chỉ cụ thể (Số nhà, tên đường, số phòng, tòa nhà)</span>
                            <span className="text-red-500 font-bold shrink-0">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={thongTin.dia_chi_chi_tiet}
                            onChange={(e) => capNhat('dia_chi_chi_tiet', e.target.value)}
                            onBlur={() => setDaCham(prev => ({ ...prev, dia_chi_chi_tiet: true }))}
                            placeholder="Ví dụ: Số 284 Cao Thắng, Phường 12, Tòa nhà Golden Star..."
                            className={`w-full px-3.5 py-2.5 rounded-xl border-2 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white focus:outline-none transition-all shadow-2xs ${
                                daCham.dia_chi_chi_tiet && !kiemTraHopLe.dia_chi_chi_tiet
                                    ? 'border-red-400 bg-red-50/20 focus:ring-4 focus:ring-red-400/20'
                                    : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15'
                            }`}
                        />
                        {daCham.dia_chi_chi_tiet && !kiemTraHopLe.dia_chi_chi_tiet && (
                            <p className="text-[10.5px] font-bold text-red-500 flex items-center gap-1 mt-1 leading-none animate-in fade-in">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                <span>Vui lòng nhập rõ số nhà, tên đường (tối thiểu 3 ký tự)</span>
                            </p>
                        )}
                    </div>

                    {/* 8. Ghi Chú */}
                    <div className="space-y-1.5 sm:col-span-2">
                        <label className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5 h-5 truncate select-none">
                            <span className="w-4 h-4 rounded-md bg-cyan-100 dark:bg-cyan-950/70 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-200 dark:border-cyan-800 shrink-0">
                                <FileText className="w-2.5 h-2.5" />
                            </span>
                            <span>Ghi chú giao hàng & yêu cầu kỹ thuật (Tùy chọn)</span>
                        </label>
                        <textarea
                            rows={2}
                            value={thongTin.ghi_chu || ''}
                            onChange={(e) => capNhat('ghi_chu', e.target.value)}
                            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến 15 phút, hỗ trợ cài đặt máy..."
                            className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:border-[#0052cc] focus:ring-4 focus:ring-blue-500/15 focus:outline-none transition-all resize-none shadow-2xs"
                        />
                    </div>
                </div>

                {/* Checkbox lưu địa chỉ mới nếu đang ở chế độ địa chỉ mới */}
                {cheDoDiaChi === 'moi' && (
                    <label className="flex items-center gap-2 pt-1 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={luuDiaChiMoi}
                            onChange={(e) => setLuuDiaChiMoi(e.target.checked)}
                            className="w-4 h-4 rounded text-[#0052cc] focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="font-semibold">Lưu địa chỉ này vào sổ địa chỉ tài khoản của tôi để dùng cho lần mua sau</span>
                    </label>
                )}
            </div>
        </div>
    );
}
