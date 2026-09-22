'use client';
import React, { useState } from 'react';
import {
    Headphones, ShieldCheck, CreditCard, RotateCcw,
    Truck, Wrench, MessageSquare, Phone, ChevronRight, CheckCircle2
} from 'lucide-react';

const DANH_SACH_FAQ = [
    {
        id: 'faq-1',
        icon: CreditCard,
        tag: 'DUYỆT HỒ SƠ 3 PHÚT',
        tagBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
        iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400',
        cauHoi: 'TNTP Laptop hỗ trợ mua trả góp 0% lãi suất như thế nào? Cần giấy tờ gì?',
        traLoi: 'TNTP Laptop hỗ trợ 2 hình thức trả góp 0% cực kỳ đơn giản và nhanh gọn:',
        diemNoiBat: [
            'Qua thẻ tín dụng (Visa/Mastercard): 0% lãi suất của hơn 25 ngân hàng lớn, thanh toán online trong 3 phút, không cần xét duyệt hồ sơ.',
            'Qua CCCD gắn chip: Liên kết HD Saison, Home Credit chỉ cần trả trước từ 10 - 20%, xét duyệt tự động sau 10 phút là nhận máy ngay.'
        ]
    },
    {
        id: 'faq-2',
        icon: RotateCcw,
        tag: 'ĐỔI MÁY MỚI 100% NGUYÊN SEAL',
        tagBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
        iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
        cauHoi: 'Chính sách "1 Đổi 1 Trong 30 Ngày Đầu" được áp dụng cụ thể ra sao?',
        traLoi: 'Chính sách bảo vệ người mua độc quyền tại TNTP Laptop trong 30 ngày đầu:',
        diemNoiBat: [
            'Lỗi phần cứng do nhà sản xuất (màn hình, mainboard, bàn phím, loa, nguồn): Đổi ngay 1 máy mới 100% nguyên seal cùng model.',
            'Nếu hết model cùng loại: Quý khách được hoàn tiền 100% hoặc đổi sang model khác có giá trị tương đương mà không mất bất kỳ chi phí nào.'
        ]
    },
    {
        id: 'faq-3',
        icon: Truck,
        tag: 'ĐỒNG KIỂM & BẬT TEST TẠI NHÀ',
        tagBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
        iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
        cauHoi: 'Tôi ở xa đặt hàng online thì nhận máy như thế nào? Có được kiểm tra không?',
        traLoi: 'An tâm tuyệt đối khi mua laptop từ xa qua website TNTP Laptop:',
        diemNoiBat: [
            'Đồng kiểm 100% trước khi thanh toán: Bạn được mở thùng, kiểm tra tem niêm phong seal máy, cắm nguồn bật màn hình kiểm tra trực tiếp.',
            'Bảo hiểm vận chuyển 100% giá trị: Đóng gói 3 lớp chống sốc chuyên dụng. Riêng TP.HCM và Hà Nội giao hỏa tốc 2H miễn phí.'
        ]
    },
    {
        id: 'faq-4',
        icon: Wrench,
        tag: 'SPA & VỆ SINH MÁY TRỌN ĐỜI',
        tagBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
        iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400',
        cauHoi: 'Chế độ bảo hành chính hãng và bảo dưỡng "Spa Laptop" trọn đời gồm những gì?',
        traLoi: 'Hệ sinh thái hậu mãi cao cấp dành riêng cho khách hàng TNTP Laptop:',
        diemNoiBat: [
            'Bảo hành chính hãng 24-36 tháng: Tiếp nhận bảo hành tại hệ thống Showroom TNTP hoặc trung tâm ủy quyền ASUS ROG, Lenovo, Acer, Dell toàn quốc.',
            'Đặc quyền TNTP Care trọn đời: Miễn phí vệ sinh quạt, tra keo tản nhiệt định kỳ 6 tháng/lần và cài đặt phần mềm không giới hạn.'
        ]
    }
];

export default function HoiDapThuongGap() {
    const [cauHoiMo, setCauHoiMo] = useState(null);

    const toggleCauHoi = (id) => {
        setCauHoiMo(prev => prev === id ? null : id);
    };

    const cotTrai = [DANH_SACH_FAQ[0], DANH_SACH_FAQ[2]];
    const cotPhai = [DANH_SACH_FAQ[1], DANH_SACH_FAQ[3]];

    const renderTheFaq = (faq) => {
        const dangMo = cauHoiMo === faq.id;
        const IconComponent = faq.icon;

        return (
            <div
                key={faq.id}
                className={`bg-white dark:bg-slate-800 rounded-2xl border transition-all duration-200 overflow-hidden ${
                    dangMo
                        ? 'border-blue-500 dark:border-blue-500 shadow-[0_8px_26px_rgba(0,82,204,0.12)] ring-2 ring-blue-500/15'
                        : 'border-blue-100/90 dark:border-slate-700 shadow-[0_4px_20px_rgba(0,82,204,0.06)] hover:shadow-[0_8px_30px_rgba(0,82,204,0.12)] hover:border-blue-300 dark:hover:border-blue-500'
                }`}
            >
                {/* Tiêu đề câu hỏi & Nút toggle */}
                <button
                    type="button"
                    onClick={() => toggleCauHoi(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 text-left cursor-pointer select-none group"
                >
                    <div className="flex items-center gap-3.5 min-w-0">
                        {/* Icon hình vuông bo góc mềm */}
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${faq.iconBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>

                        {/* Tag & Câu hỏi */}
                        <div className="space-y-1 min-w-0">
                            <span className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-wide ${faq.tagBg}`}>
                                {faq.tag}
                            </span>
                            <h3 className={`font-bold text-[13px] sm:text-[14px] leading-snug transition-colors ${
                                dangMo ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                            }`}>
                                {faq.cauHoi}
                            </h3>
                        </div>
                    </div>

                    {/* Nút mũi tên tròn đổi trạng thái */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-200 ${
                        dangMo
                            ? 'rotate-90 bg-blue-600 text-white shadow-sm'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900'
                    }`}>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                </button>

                {/* Nội dung câu trả lời mở rộng */}
                {dangMo && (
                    <div className="px-5 pb-5 pt-0 border-t border-slate-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-xs sm:text-[13px] leading-relaxed space-y-2.5 animate-in fade-in-50 duration-200">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 pt-3">
                            {faq.traLoi}
                        </p>
                        <ul className="space-y-2">
                            {faq.diemNoiBat.map((diem, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span>{diem}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="relative rounded-3xl p-6 sm:p-8 lg:p-10 bg-gradient-to-b from-[#dbeafe]/90 via-[#ebf4fe] to-[#dff0fd] dark:from-[#0b1329] dark:via-[#0f172a] dark:to-[#0a1022] border-2 border-blue-200 dark:border-blue-900/70 shadow-[0_16px_45px_-12px_rgba(0,82,204,0.15)] space-y-6 sm:space-y-8 overflow-hidden transition-all">
            {/* Họa tiết lưới chấm trang trí bên trái rõ nét như ảnh mẫu */}
            <div className="absolute top-1/4 -left-3 w-32 h-44 bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:12px_12px] opacity-35 dark:opacity-25 pointer-events-none" />

            {/* Vệt ánh sáng tỏa góc nhẹ nhàng */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-400/15 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-sky-400/15 dark:bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* 1. Header đúng chuẩn như ảnh mẫu */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-2">
                    {/* Badge nhỏ góc trên */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-wide">
                        <Headphones className="w-3.5 h-3.5" />
                        <span>HỖ TRỢ & TƯ VẤN MUA HÀNG 24/7</span>
                    </div>

                    {/* Tiêu đề chính */}
                    <h2 className="text-2xl sm:text-[28px] lg:text-[30px] font-black text-slate-900 dark:text-white tracking-tight">
                        CÂU HỎI THƯỜNG GẶP KHI MUA LAPTOP TẠI <span className="text-[#0066cc] dark:text-[#38bdf8]">TNTP LAPTOP</span>
                    </h2>

                    {/* Mô tả phụ */}
                    <p className="text-xs sm:text-[13.5px] text-slate-500 dark:text-slate-400">
                        Giải đáp cặn kẽ mọi quyền lợi của khách hàng về trả góp 0%, đổi mới 30 ngày và chế độ Spa Laptop trọn đời
                    </p>
                </div>

                {/* Badge 50.000+ Khách hàng (bên phải như ảnh mẫu) */}
                <div className="hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 shadow-[0_4px_16px_rgba(0,82,204,0.06)] shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 fill-blue-50 dark:fill-blue-950" />
                    </div>
                    <div className="text-left leading-tight">
                        <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                            Hơn 50.000+ khách hàng
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            đã tin tưởng lựa chọn
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 ml-1" />
                </div>
            </div>

            {/* 2. Bố cục 2 thẻ 1 hàng (2 cột độc lập, không bao giờ bị kéo giãn chiều cao khi bung câu hỏi) */}
            {/* Desktop & Tablet: 2 cột độc lập để thẻ đối diện không bị giãn trống */}
            <div className="relative z-10 hidden md:grid md:grid-cols-2 items-start gap-4 sm:gap-5">
                <div className="flex flex-col gap-4 sm:gap-5">
                    {cotTrai.map(renderTheFaq)}
                </div>
                <div className="flex flex-col gap-4 sm:gap-5">
                    {cotPhai.map(renderTheFaq)}
                </div>
            </div>

            {/* Mobile: 1 cột tuần tự từ 1 đến 4 */}
            <div className="relative z-10 md:hidden flex flex-col gap-3.5">
                {DANH_SACH_FAQ.map(renderTheFaq)}
            </div>

            {/* 3. Thanh Hỗ Trợ Cuối (Bottom CTA Bar) chuẩn pixel ảnh mẫu */}
            <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-800 border border-blue-100 dark:border-slate-700 shadow-[0_4px_16px_rgba(0,82,204,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium text-center sm:text-left">
                    <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                    </div>
                    <span>Bạn vẫn còn câu hỏi? Chúng tôi luôn sẵn sàng tư vấn cấu hình phù hợp với nhu cầu của bạn.</span>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <a
                        href="tel:19008946"
                        className="px-4 py-2 rounded-xl bg-[#0066cc] hover:bg-[#0052a3] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                    >
                        <Phone className="w-4 h-4 fill-white" />
                        <span>Hotline: 1900.8946</span>
                    </a>
                    <a
                        href="/lien-he"
                        className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                        <span>Gặp Kỹ Thuật Viên</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </a>
                </div>
            </div>
        </section>
    );
}
