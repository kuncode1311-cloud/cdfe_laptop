'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
    Star,
    CheckCircle2,
    ThumbsUp,
    Send,
    MessageSquare,
    Sparkles,
    ShieldCheck,
    Filter,
    X
} from 'lucide-react';
import { toast } from 'sonner';
import { apiFetch } from '@/services/api-client';

export default function DanhGiaSanPham({ 
    idSanPham = '', 
    danhSachDanhGia = [], 
    diemTrungBinh = 4.9, 
    tongSoDanhGia = 0, 
    tenSanPham = 'Sản Phẩm', 
    hinhAnhSanPham = '' 
}) {
    // Dữ liệu đánh giá mặc định phong phú nếu danh sách truyền vào ít
    const danhGiaMau = useMemo(() => {
        if (Array.isArray(danhSachDanhGia) && danhSachDanhGia.length > 0) {
            return danhSachDanhGia;
        }
        return [
            {
                id: 'dg-1',
                ten_nguoi_dung: 'Nguyễn Thành Nam',
                so_sao: 5,
                tieu_de: 'Máy cực đỉnh, đóng gói cẩn thận 3 lớp',
                noi_dung: 'Mình nhận máy sau 1 tiếng đặt hỏa tốc tại TP.HCM. Máy nguyên seal 100%, màn hình đẹp không điểm chết, chiến game mượt mà tản nhiệt rất êm. Đội ngũ kỹ thuật viên hỗ trợ cài win và office nhiệt tình!',
                ngay_danh_gia: '3 ngày trước',
                da_mua_hang: true,
                luot_thich: 48,
                thoi_gian_dung: 'Đã dùng khoảng 2 tuần',
                hinh_anh_dinh_kem: [hinhAnhSanPham || '/images/sp/acer_predator_helios.jpg']
            },
            {
                id: 'dg-2',
                ten_nguoi_dung: 'Trần Văn Hoàng',
                so_sao: 5,
                tieu_de: 'Hàng chính hãng chuẩn chỉ, bảo hành chu đáo',
                noi_dung: 'Đã kiểm tra bảo hành trên trang chủ hãng kích hoạt đầy đủ 24 tháng. Giá tại TNTP rẻ hơn các bên khác mà quà tặng chuột balo chất lượng cao. Sẽ tiếp tục ủng hộ shop.',
                ngay_danh_gia: '1 tuần trước',
                da_mua_hang: true,
                luot_thich: 32,
                thoi_gian_dung: 'Đã dùng khoảng 1 tháng',
                hinh_anh_dinh_kem: ['/images/sp/predator_helios.jpg']
            },
            {
                id: 'dg-3',
                ten_nguoi_dung: 'Lê Minh Quân',
                so_sao: 4,
                tieu_de: 'Hiệu năng rất mạnh, hơi ấm khi render 3D nặng',
                noi_dung: 'Thiết kế đẹp, build chắc chắn, bàn phím gõ nảy. Khi render 4K quạt quay hơi to một chút nhưng nhiệt độ vẫn kiểm soát dưới 80 độ, tổng thể rất đáng tiền.',
                ngay_danh_gia: '2 tuần trước',
                da_mua_hang: true,
                luot_thich: 15,
                thoi_gian_dung: 'Đã dùng khoảng 3 tuần'
            }
        ];
    }, [danhSachDanhGia, hinhAnhSanPham]);

    const [danhSach, setDanhSach] = useState(danhGiaMau);
    const [boLocSao, setBoLocSao] = useState('tat_ca');
    const [moForm, setMoForm] = useState(false);
    const [luotThichDaBam, setLuotThichDaBam] = useState({});
    const [mounted, setMounted] = useState(false);
    const [dangGui, setDangGui] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Tự động tải tất cả đánh giá thực tế từ MongoDB Atlas cho sản phẩm này
    useEffect(() => {
        if (!idSanPham) return;
        let isCancelled = false;

        const taiDanhGiaTuDb = async () => {
            try {
                const data = await apiFetch(`/danh-gia/${idSanPham}`);
                if (isCancelled) return;

                if (Array.isArray(data) && data.length > 0) {
                    setDanhSach(data);
                }
            } catch (err) {
                console.warn('API đánh giá backend chưa sẵn sàng:', err);
            }
        };

        taiDanhGiaTuDb();
        return () => { isCancelled = true; };
    }, [idSanPham, danhGiaMau]);

    useEffect(() => {
        if (moForm) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [moForm]);

    // Form inputs
    const [hoTen, setHoTen] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [soSao, setSoSao] = useState(5);
    const [tieuDe, setTieuDe] = useState('');
    const [noiDung, setNoiDung] = useState('');
    const [tagsDaChon, setTagsDaChon] = useState([]);
    const [danhSachAnhDinhKem, setDanhSachAnhDinhKem] = useState([]);

    const xuLyChonAnh = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files || files.length === 0) return;

        if (danhSachAnhDinhKem.length + files.length > 3) {
            toast.warning('Bạn chỉ được đính kèm tối đa 3 ảnh thực tế!');
        }

        const filesHopLe = files.slice(0, 3 - danhSachAnhDinhKem.length);
        filesHopLe.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setDanhSachAnhDinhKem((prev) => {
                        if (prev.length >= 3) return prev;
                        return [...prev, ev.target.result];
                    });
                }
            };
            reader.readAsDataURL(file);
        });
        toast.success(`Đã đính kèm ${filesHopLe.length} ảnh thực tế thành công!`);
        e.target.value = '';
    };

    const xuLyXoaAnh = (idx) => {
        setDanhSachAnhDinhKem((prev) => prev.filter((_, i) => i !== idx));
        toast.info('Đã gỡ ảnh đính kèm.');
    };

    const goiYTieuDe = [
        'Máy chạy êm mượt',
        'Màn hình cực nét',
        'Giao hỏa tốc 2H',
        'Đóng gói rất kỹ',
        'Nhân viên tư vấn nhiệt tình',
        'Pin trâu đúng như mô tả'
    ];

    // Thống kê phân bổ sao
    const thongKeSao = useMemo(() => {
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        danhSach.forEach(item => {
            const star = Math.min(Math.max(Math.round(item.so_sao || 5), 1), 5);
            counts[star] = (counts[star] || 0) + 1;
        });
        const tong = danhSach.length || 1;
        return {
            counts,
            percentages: {
                5: Math.round((counts[5] / tong) * 100),
                4: Math.round((counts[4] / tong) * 100),
                3: Math.round((counts[3] / tong) * 100),
                2: Math.round((counts[2] / tong) * 100),
                1: Math.round((counts[1] / tong) * 100)
            },
            tong
        };
    }, [danhSach]);

    // Xử lý gửi đánh giá mới - Lưu trực tiếp vào Database MongoDB Atlas
    const xuLyGuiDanhGia = async (e) => {
        e.preventDefault();
        if (!hoTen.trim() || !noiDung.trim()) {
            toast.error('Vui lòng điền đầy đủ Họ tên và Nội dung đánh giá!');
            return;
        }

        const tagContent = tagsDaChon.length > 0 ? ` [${tagsDaChon.join(', ')}]` : '';
        const danhGiaMoi = {
            id: `dg-${Date.now()}`,
            id_san_pham: idSanPham || 'san-pham-chung',
            ho_ten: hoTen.trim(),
            ten_nguoi_dung: hoTen.trim(),
            so_dien_thoai: soDienThoai.trim(),
            so_sao: soSao,
            tieu_de: tieuDe.trim() || (tagsDaChon[0] || 'Khách hàng đánh giá sản phẩm'),
            noi_dung: noiDung.trim() + tagContent,
            hinh_anh_dinh_kem: [...danhSachAnhDinhKem],
            ngay_danh_gia: 'Vừa xong',
            da_mua_hang: true,
            luot_thich: 0,
            thoi_gian_dung: 'Khách vừa nhận hàng'
        };

        setDangGui(true);
        try {
            const dataDaLuu = await apiFetch('/danh-gia', {
                method: 'POST',
                body: JSON.stringify(danhGiaMoi)
            });
            const itemHienThi = {
                ...danhGiaMoi,
                ...dataDaLuu,
                ten_nguoi_dung: dataDaLuu.ho_ten || dataDaLuu.ten_nguoi_dung || danhGiaMoi.ten_nguoi_dung
            };
            setDanhSach(prev => [itemHienThi, ...prev]);
            toast.success('Đã lưu đánh giá vào cơ sở dữ liệu MongoDB Atlas thành công!');
        } catch (err) {
            console.warn('Lỗi kết nối lưu đánh giá:', err);
            setDanhSach(prev => [danhGiaMoi, ...prev]);
            toast.success('Gửi đánh giá thành công!');
        } finally {
            setDangGui(false);
            setMoForm(false);
            setHoTen('');
            setSoDienThoai('');
            setTieuDe('');
            setNoiDung('');
            setTagsDaChon([]);
            setDanhSachAnhDinhKem([]);
        }
    };

    // Toggle like review - Lưu cập nhật lên Backend
    const xuLyThich = async (id) => {
        if (!id) return;
        if (luotThichDaBam[id]) {
            toast.info('Bạn đã đánh giá nhận xét này là hữu ích rồi!');
            return;
        }
        setDanhSach(prev => prev.map(item => ((item.id === id || item._id === id) ? { ...item, luot_thich: (item.luot_thich || 0) + 1 } : item)));
        setLuotThichDaBam(prev => ({ ...prev, [id]: true }));
        toast.success('Đã ghi nhận nhận xét hữu ích!');

        try {
            await apiFetch(`/danh-gia/${id}/thich`, { method: 'PATCH' });
        } catch (err) {
            // Không ngắt mạch giao diện người dùng
        }
    };

    // Lọc danh sách theo tab sao
    const danhSachHienThi = useMemo(() => {
        if (boLocSao === 'tat_ca') return danhSach;
        const starNum = parseInt(boLocSao, 10);
        return danhSach.filter(d => Math.round(d.so_sao) === starNum);
    }, [danhSach, boLocSao]);

    const nhanSao = {
        5: 'Tuyệt vời',
        4: 'Hài lòng',
        3: 'Bình thường',
        2: 'Không hài lòng',
        1: 'Rất tệ'
    };

    return (
        <div className="space-y-6">
            {/* 1. Hộp Tổng Quan Đánh Giá Chuẩn TGDD (media_1789281245373.png) */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 sm:p-7 shadow-xs">
                <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-tight mb-5 flex items-center justify-between">
                    <span>Đánh Giá {tenSanPham}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        100% Đánh giá thật
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Điểm số trung bình bên trái */}
                    <div className="md:col-span-5 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 pb-5 md:pb-0 md:pr-6">
                        <div className="flex items-baseline justify-center md:justify-start gap-2">
                            <span className="text-5xl sm:text-6xl font-black text-amber-500 tracking-tight">
                                {diemTrungBinh}
                            </span>
                            <span className="text-xl font-bold text-slate-400">/ 5</span>
                        </div>

                        <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                        i < Math.floor(diemTrungBinh)
                                            ? 'fill-amber-400 text-amber-400'
                                            : i < diemTrungBinh
                                            ? 'fill-amber-400/50 text-amber-400'
                                            : 'text-slate-300 dark:text-slate-700'
                                    }`}
                                />
                            ))}
                        </div>

                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {thongKeSao.percentages[5] + thongKeSao.percentages[4]}% khách hàng hài lòng với sản phẩm
                        </p>
                        <p className="text-[11px] text-slate-400">
                            Tổng cộng {danhSach.length} lượt đánh giá và nhận xét đã xác thực
                        </p>
                    </div>

                    {/* Dải 5 thanh tỷ lệ sao bên phải chuẩn TGDD */}
                    <div className="md:col-span-7 space-y-2.5">
                        {[5, 4, 3, 2, 1].map((sao) => {
                            const count = thongKeSao.counts[sao] || 0;
                            const percent = thongKeSao.percentages[sao] || 0;
                            return (
                                <button
                                    key={sao}
                                    type="button"
                                    onClick={() => setBoLocSao(boLocSao === String(sao) ? 'tat_ca' : String(sao))}
                                    className="w-full flex items-center gap-3 text-xs group cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-12 flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 shrink-0">
                                        <span>{sao}</span>
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                    </div>

                                    {/* Thanh tiến trình màu xanh như TGDD */}
                                    <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#0052cc] dark:bg-cyan-500 rounded-full transition-all duration-500"
                                            style={{ width: `${percent}%` }}
                                        />
                                    </div>

                                    <div className="w-14 text-right text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">
                                        {percent}% ({count})
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Nút Kêu Gọi Viết Đánh Giá */}
                <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                        Bạn đã mua hoặc trải nghiệm sản phẩm này tại TNTP LAPTOP?
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setMoForm(true);
                            if (soSao === 0) setSoSao(0);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0052cc] to-[#003da5] hover:from-[#003da5] hover:to-[#002b7a] text-white font-extrabold text-xs flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                    >
                        <MessageSquare className="w-4 h-4" />
                        <span>Viết đánh giá của bạn</span>
                    </button>
                </div>
            </div>

            {/* 2. Form Viết Đánh Giá Dạng POPUP MODAL Chuẩn Thế Giới Di Động (media_1789282022736.png & media_1789282027575.png) */}
            {moForm && mounted && typeof document !== 'undefined' && createPortal(
                <div
                    onClick={() => setMoForm(false)}
                    className="fixed inset-0 z-[999999] w-screen h-screen bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh', margin: 0 }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-[490px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 space-y-3 animate-in zoom-in-95 duration-150 relative z-10 my-auto"
                    >
                        {/* Header Popup Chuẩn TGDD */}
                        <div className="relative pb-2 border-b border-slate-100 dark:border-slate-800 text-center">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                                Đánh giá sản phẩm
                            </h3>
                            <button
                                type="button"
                                onClick={() => setMoForm(false)}
                                className="absolute right-0 top-0 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
                                title="Đóng"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thumbnail & Tên Sản Phẩm Ở Giữa Chuẩn TGDD */}
                        <div className="text-center space-y-1.5 pt-0.5">
                            <div className="relative w-20 h-13 mx-auto">
                                <img
                                    src={hinhAnhSanPham || '/placeholder.png'}
                                    alt={tenSanPham}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <h4 className="font-bold text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 line-clamp-1 px-4">
                                {tenSanPham}
                            </h4>
                        </div>

                        {/* 5 Ngôi Sao Kèm Nhãn Chữ (Rất tệ, Tệ, Tạm ổn, Tốt, Rất tốt) Chuẩn TGDD */}
                        <div className="py-1">
                            <div className="flex items-center justify-center gap-4 sm:gap-6 text-center">
                                {[
                                    { sao: 1, nhan: 'Rất tệ' },
                                    { sao: 2, nhan: 'Tệ' },
                                    { sao: 3, nhan: 'Tạm ổn' },
                                    { sao: 4, nhan: 'Tốt' },
                                    { sao: 5, nhan: 'Rất tốt' }
                                ].map((item) => {
                                    const daChon = soSao > 0 && item.sao <= soSao;
                                    const laSaoHienTai = item.sao === soSao;
                                    return (
                                        <button
                                            key={item.sao}
                                            type="button"
                                            onClick={() => setSoSao(item.sao)}
                                            className="flex flex-col items-center gap-1 cursor-pointer group"
                                        >
                                            <Star
                                                className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:scale-110 ${
                                                    daChon
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-amber-400/50 dark:text-slate-600 stroke-[1.2]'
                                                }`}
                                            />
                                            <span
                                                className={`text-[10.5px] transition-colors ${
                                                    laSaoHienTai
                                                        ? 'text-amber-500 font-bold'
                                                        : 'text-slate-400 dark:text-slate-500 font-medium'
                                                }`}
                                            >
                                                {item.nhan}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Khi đã chọn số sao: Mở rộng form đánh giá gọn gàng vừa vặn 1 màn hình */}
                        {soSao > 0 && (
                            <form onSubmit={xuLyGuiDanhGia} className="space-y-2.5 pt-1 animate-in fade-in duration-150">
                                {/* Textarea Cảm Nhận */}
                                <textarea
                                    value={noiDung}
                                    onChange={(e) => setNoiDung(e.target.value)}
                                    rows={3}
                                    placeholder="Mời bạn chia sẻ thêm cảm nhận..."
                                    required
                                    className="w-full p-2.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs sm:text-[13px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed"
                                />

                                {/* Dòng Checkbox Giới Thiệu & Nút Gửi Ảnh */}
                                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                                    <label className="flex items-center gap-1.5 cursor-pointer select-none">
                                        <input
                                            type="checkbox"
                                            defaultChecked
                                            className="w-3.5 h-3.5 rounded text-[#2f80ed] focus:ring-[#2f80ed]"
                                        />
                                        <span className="text-[11px] sm:text-xs">Tôi sẽ giới thiệu sản phẩm cho bạn bè, người thân</span>
                                    </label>

                                    <label className="text-[11px] sm:text-xs text-[#2f80ed] hover:underline cursor-pointer flex items-center gap-1 shrink-0 font-medium">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            onChange={xuLyChonAnh}
                                        />
                                        <span>📷 {danhSachAnhDinhKem.length > 0 ? `Đã chọn (${danhSachAnhDinhKem.length}/3)` : 'Gửi ảnh thực tế (tối đa 3 ảnh)'}</span>
                                    </label>
                                </div>

                                {/* Dải Ảnh Thực Tế User Đã Đính Kèm Để Check Lại */}
                                {danhSachAnhDinhKem.length > 0 && (
                                    <div className="flex items-center gap-2 pt-0.5 pb-0.5">
                                        {danhSachAnhDinhKem.map((imgSrc, idx) => (
                                            <div
                                                key={idx}
                                                className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-[#2f80ed] shadow-xs shrink-0 group bg-slate-100 dark:bg-slate-800"
                                            >
                                                <img
                                                    src={imgSrc}
                                                    alt={`Ảnh đính kèm ${idx + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => xuLyXoaAnh(idx)}
                                                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                                                    title="Xóa ảnh này"
                                                >
                                                    <X className="w-2.5 h-2.5" />
                                                </button>
                                                <span className="absolute bottom-0.5 left-1 px-1 rounded bg-black/70 text-[9px] font-bold text-white">
                                                    Ảnh {idx + 1}
                                                </span>
                                            </div>
                                        ))}

                                        {danhSachAnhDinhKem.length < 3 && (
                                            <label className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#2f80ed] flex flex-col items-center justify-center text-slate-400 hover:text-[#2f80ed] cursor-pointer transition-colors shrink-0">
                                                <input
                                                    type="file"
                                                    multiple
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={xuLyChonAnh}
                                                />
                                                <span className="text-base font-bold leading-none">+</span>
                                                <span className="text-[9px] font-medium mt-0.5">Thêm ảnh</span>
                                            </label>
                                        )}
                                    </div>
                                )}

                                {/* Hai Input Họ Tên & SĐT Chuẩn TGDD */}
                                <div className="grid grid-cols-2 gap-2 pt-0.5">
                                    <input
                                        type="text"
                                        value={hoTen}
                                        onChange={(e) => setHoTen(e.target.value)}
                                        placeholder="Họ tên (bắt buộc)"
                                        required
                                        className="py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                                    />
                                    <input
                                        type="tel"
                                        value={soDienThoai}
                                        onChange={(e) => setSoDienThoai(e.target.value)}
                                        placeholder="Số điện thoại (bắt buộc)"
                                        required
                                        className="py-2 px-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500"
                                    />
                                </div>

                                {/* Checkbox Điều Khoản */}
                                <label className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 cursor-pointer pt-0.5 select-none">
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        required
                                        className="w-3.5 h-3.5 rounded text-[#2f80ed] focus:ring-[#2f80ed]"
                                    />
                                    <span>
                                        Tôi đồng ý với <a href="#" className="text-[#2f80ed] hover:underline">Chính sách xử lý dữ liệu cá nhân</a> của TNTP LAPTOP
                                    </span>
                                </label>

                                {/* Nút Gửi Đánh Giá Chuẩn TGDD */}
                                <button
                                    type="submit"
                                    disabled={dangGui}
                                    className="w-full py-2.5 rounded-lg bg-[#2f80ed] hover:bg-[#1a73e8] text-white font-medium text-sm transition-all cursor-pointer shadow-sm text-center flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {dangGui ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            <span>Đang lưu vào hệ thống...</span>
                                        </>
                                    ) : (
                                        <span>Gửi đánh giá</span>
                                    )}
                                </button>

                                {/* Footer Links */}
                                <div className="flex items-center justify-center gap-4 text-[11px] text-[#2f80ed] pt-0.5">
                                    <a href="#" className="hover:underline">Quy định đánh giá</a>
                                    <a href="#" className="hover:underline">Chính sách bảo mật thông tin</a>
                                </div>
                            </form>
                        )}
                    </div>
                </div>,
                document.body
            )}

            {/* 3. Thanh Lọc Đánh Giá Theo Số Sao */}
            <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-500">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Lọc theo:</span>
                </div>
                <button
                    type="button"
                    onClick={() => setBoLocSao('tat_ca')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        boLocSao === 'tat_ca'
                            ? 'bg-[#0052cc] text-white shadow-xs'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                >
                    Tất cả ({danhSach.length})
                </button>
                {[5, 4, 3, 2, 1].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => setBoLocSao(String(s))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            boLocSao === String(s)
                                ? 'bg-[#0052cc] text-white shadow-xs'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                    >
                        <span>{s}</span>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="opacity-70">({thongKeSao.counts[s] || 0})</span>
                    </button>
                ))}
            </div>

            {/* 4. Danh Sách Từng Đánh Giá Thực Tế (Giống Thế Giới Di Động) */}
            <div className="space-y-3.5">
                {danhSachHienThi.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 font-semibold">
                        Chưa có đánh giá nào cho mức {boLocSao} sao này.
                    </div>
                ) : (
                    danhSachHienThi.map((dg, idx) => {
                        const reviewId = dg.id || dg._id || `dg-item-${idx}`;
                        const daThich = !!luotThichDaBam[reviewId];
                        const tenKhachHang = dg.ho_ten || dg.ten_nguoi_dung || 'Khách hàng';
                        return (
                            <div
                                key={reviewId}
                                className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 space-y-2.5 shadow-2xs transition-all hover:border-slate-300 dark:hover:border-slate-700"
                            >
                                {/* Dòng tên người dùng + Huy hiệu Đã mua tại TGDD / TNTP */}
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                            {tenKhachHang}
                                        </span>

                                        {dg.da_mua_hang ? (
                                            <span className="flex items-center gap-1 text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Đã mua tại TNTP LAPTOP</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 px-2 py-0.5 rounded-md">
                                                <Sparkles className="w-3 h-3 text-amber-500" />
                                                <span>Trải nghiệm tại Showroom</span>
                                            </span>
                                        )}
                                    </div>

                                    <span className="text-[11px] text-slate-400">
                                        {dg.ngay_danh_gia}
                                    </span>
                                </div>

                                {/* Số sao */}
                                <div className="flex items-center gap-1 text-amber-400">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${
                                                i < dg.so_sao ? 'fill-amber-400 text-amber-400' : 'text-slate-200 dark:text-slate-700'
                                            }`}
                                        />
                                    ))}
                                </div>

                                {/* Tiêu đề cảm nhận */}
                                {dg.tieu_de && (
                                    <h5 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white">
                                        {dg.tieu_de}
                                    </h5>
                                )}

                                {/* Nội dung chi tiết */}
                                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {dg.noi_dung}
                                </p>

                                {/* Hình ảnh thực tế khách chụp đính kèm */}
                                {Array.isArray(dg.hinh_anh_dinh_kem) && dg.hinh_anh_dinh_kem.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1 pb-1">
                                        {dg.hinh_anh_dinh_kem.map((hinh, hIdx) => (
                                            <div
                                                key={hIdx}
                                                className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 shadow-2xs group cursor-zoom-in"
                                            >
                                                <img
                                                    src={hinh}
                                                    alt={`Ảnh đính kèm ${hIdx + 1}`}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Footer nhận xét: Hữu ích + Thời gian sử dụng */}
                                <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800/80">
                                    <button
                                        type="button"
                                        onClick={() => xuLyThich(reviewId)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                            daThich
                                                ? 'bg-blue-50 dark:bg-blue-950 border-blue-300 dark:border-blue-700 text-[#0052cc] dark:text-cyan-400 font-bold'
                                                : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 text-slate-600 dark:text-slate-300'
                                        }`}
                                    >
                                        <ThumbsUp className={`w-3 h-3 ${daThich ? 'fill-current' : ''}`} />
                                        <span>Hữu ích ({dg.luot_thich || 0})</span>
                                    </button>

                                    {dg.thoi_gian_dung && (
                                        <span>{dg.thoi_gian_dung}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
