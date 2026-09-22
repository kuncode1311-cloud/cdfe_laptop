/**
 * =========================================================================
 * DỊCH VỤ TELEGRAM BOT QUẢN LÝ ĐƠN HÀNG TOÀN DIỆN (MVC SERVICE)
 * =========================================================================
 * - Bắn thông báo Realtime (0.5s) khi có đơn hàng mới hoặc thanh toán thành công
 * - Cung cấp Menu lệnh gợi ý tự động (khi gõ /) và Bàn phím nút bấm 1 chạm
 * - Quản lý trọn vẹn TẤT CẢ 5 TRẠNG THÁI đơn hàng trong Database MongoDB:
 *   1. ⏳ cho_xac_nhan : Chờ xác nhận
 *   2. ✅ da_xac_nhan  : Đã xác nhận
 *   3. 🚚 dang_giao    : Đang giao hàng
 *   4. 🎉 da_giao      : Đã giao thành công (Tự động trừ kho & hoàn tất thanh toán)
 *   5. ❌ da_huy       : Đã hủy đơn hàng (Tự động hoàn lại tồn kho nếu có)
 * =========================================================================
 */

const DonHang = require('../models/don-hang.model');
const SanPham = require('../models/san-pham.model');
const mongoose = require('mongoose');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
let ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8952266086';
let dangChayPolling = false;
let updateOffset = 0;

/**
 * Bàn phím bấm nhanh thường trực dưới đáy màn hình chat
 */
const BAN_PHIM_DIEU_KHIEN = {
    keyboard: [
        [{ text: '📋 Đơn Chờ Duyệt' }, { text: '📊 Báo Cáo Hôm Nay' }],
        [{ text: '📦 10 Đơn Gần Đây' }, { text: '⚡ Bảng Điều Khiển' }]
    ],
    resize_keyboard: true,
    is_persistent: true
};

/**
 * Định dạng tiền tệ Việt Nam (VNĐ)
 */
function dinhDangTien(soTien) {
    if (!soTien || isNaN(soTien)) return '0 đ';
    return Number(soTien).toLocaleString('vi-VN') + ' đ';
}

/**
 * Ánh xạ tên phương thức thanh toán sang tiếng Việt
 */
function layTenPhuongThuc(pt) {
    const bangAnhXa = {
        tien_mat_cod: '💵 Tiền mặt khi nhận hàng (COD)',
        cod: '💵 Tiền mặt khi nhận hàng (COD)',
        chuyen_khoan: '🏦 Chuyển khoản VietQR',
        payos: '⚡ Cổng thanh toán trực tuyến PayOS',
        the_tin_dung: '💳 Thẻ tín dụng / Ghi nợ quốc tế'
    };
    return bangAnhXa[pt] || pt || 'Chưa xác định';
}

/**
 * Ánh xạ trạng thái đơn hàng sang tiếng Việt
 */
function layNhanTrangThai(tt) {
    const bangTrangThai = {
        cho_xac_nhan: '⏳ Chờ xác nhận',
        da_xac_nhan: '✅ Đã xác nhận',
        dang_giao: '🚚 Đang giao hàng',
        da_giao: '🎉 Đã giao thành công',
        da_huy: '❌ Đã hủy đơn'
    };
    return bangTrangThai[tt] || tt || 'Chưa rõ';
}

/**
 * Cập nhật tồn kho sản phẩm trong CSDL khi đơn hàng hoàn tất hoặc bị hủy
 */
async function xuLyCapNhatTonKho(danhSachSanPham, thaoTac = 'tru') {
    if (!Array.isArray(danhSachSanPham) || danhSachSanPham.length === 0) return;

    for (const item of danhSachSanPham) {
        try {
            const soLuong = Math.max(1, Number(item.so_luong) || 1);
            const spId = item.san_pham_id || item.san_pham?.id || item.san_pham?._id || item.san_pham?.ma_san_pham || item.id_muc;
            if (!spId && !item.ten_san_pham) continue;

            const orConds = [];
            if (spId) {
                const strId = String(spId).trim();
                orConds.push({ id: strId }, { ma_san_pham: strId }, { slug: strId });
                if (mongoose.Types.ObjectId.isValid(strId)) orConds.push({ _id: strId });
            }

            let sp = orConds.length > 0 ? await SanPham.findOne({ $or: orConds }) : null;
            if (!sp && item.ten_san_pham) {
                sp = await SanPham.findOne({ ten_san_pham: item.ten_san_pham.trim() });
            }

            if (!sp) continue;

            if (thaoTac === 'tru') {
                const tonKhoMoi = Math.max(0, (sp.so_luong_ton_kho || sp.ton_kho || 0) - soLuong);
                const daBanMoi = (sp.so_luong_da_ban || 0) + soLuong;
                await SanPham.findByIdAndUpdate(sp._id, {
                    $set: {
                        so_luong_ton_kho: tonKhoMoi,
                        ton_kho: tonKhoMoi,
                        so_luong_da_ban: daBanMoi,
                        con_hang: tonKhoMoi > 0
                    }
                });
            } else if (thaoTac === 'hoan') {
                const tonKhoMoi = (sp.so_luong_ton_kho || sp.ton_kho || 0) + soLuong;
                const daBanMoi = Math.max(0, (sp.so_luong_da_ban || 0) - soLuong);
                await SanPham.findByIdAndUpdate(sp._id, {
                    $set: {
                        so_luong_ton_kho: tonKhoMoi,
                        ton_kho: tonKhoMoi,
                        so_luong_da_ban: daBanMoi,
                        con_hang: tonKhoMoi > 0
                    }
                });
            }
        } catch (err) {
            console.warn('⚠️ Lỗi cập nhật tồn kho từ Telegram Bot:', err.message);
        }
    }
}

/**
 * Gửi yêu cầu HTTP đến Telegram API
 */
async function goiTelegramApi(endpoint, body = {}) {
    if (!BOT_TOKEN) return null;
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!data.ok) {
            console.error(`❌ Lỗi Telegram (${endpoint}):`, data.description);
        }
        return data;
    } catch (err) {
        console.error(`❌ Ngoại lệ Telegram (${endpoint}):`, err.message);
        return null;
    }
}

/**
 * Đăng ký danh sách câu lệnh với Telegram để khi gõ / sẽ hiện Menu gợi ý
 */
async function caiDatMenuGoiYTelegram() {
    if (!BOT_TOKEN) return;
    try {
        await goiTelegramApi('setMyCommands', {
            commands: [
                { command: 'donmoi', description: '📋 Xem & duyệt các đơn hàng chờ xác nhận' },
                { command: 'thongke', description: '📊 Báo cáo doanh thu & đơn hàng hôm nay' },
                { command: 'tatcadon', description: '📦 Xem 10 đơn hàng mới nhất gần đây' },
                { command: 'timdon', description: '🔍 Tra cứu đơn hàng theo mã (vd: /timdon 123)' },
                { command: 'menu', description: '⚡ Bảng điều khiển & phím tắt quản trị' },
                { command: 'help', description: '📖 Xem hướng dẫn chi tiết các chức năng' }
            ]
        });
        console.log('✅ Đã đăng ký thành công Menu lệnh gợi ý Telegram (/donmoi, /thongke,...)');
    } catch (e) {
        console.warn('⚠️ Không thể đăng ký lệnh Telegram:', e.message);
    }
}

/**
 * Phản hồi nhanh (Toast) khi bấm nút
 */
async function traLoiCallback(callbackQueryId, thongDiep = '', hienHopThoai = false) {
    return goiTelegramApi('answerCallbackQuery', {
        callback_query_id: callbackQueryId,
        text: thongDiep,
        show_alert: hienHopThoai
    });
}

/**
 * Gửi tin nhắn đến Quản trị viên
 */
async function guiTinNhanAdmin(noiDung, banPhim = null) {
    if (!ADMIN_CHAT_ID) return;
    const payload = {
        chat_id: ADMIN_CHAT_ID,
        text: noiDung,
        parse_mode: 'HTML'
    };
    if (banPhim) {
        payload.reply_markup = banPhim;
    } else {
        payload.reply_markup = BAN_PHIM_DIEU_KHIEN;
    }
    return goiTelegramApi('sendMessage', payload);
}

/**
 * Cập nhật tin nhắn cũ
 */
async function capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi = null) {
    const payload = {
        chat_id: chatId,
        message_id: messageId,
        text: noiDungMoi,
        parse_mode: 'HTML'
    };
    if (banPhimMoi) {
        payload.reply_markup = banPhimMoi;
    }
    return goiTelegramApi('editMessageText', payload);
}

/**
 * Tạo mẫu tin nhắn chi tiết cho 1 đơn hàng
 */
function taoMauTinNhanDonHang(donHang, tieuDe = '🔔 CÓ ĐƠN HÀNG MỚI CẦN DUYỆT!') {
    const ttgh = donHang.thong_tin_giao_hang || {};
    const tenKhach = ttgh.ho_ten || ttgh.ho_va_ten || 'Khách vãng lai';
    const sdt = ttgh.so_dien_thoai || 'Chưa có SĐT';
    const diaChi = [ttgh.dia_chi_chi_tiet, ttgh.phuong_xa, ttgh.quan_huyen, ttgh.tinh_thanh]
        .filter(Boolean)
        .join(', ') || 'Nhận tại cửa hàng';

    let danhSachMon = '';
    if (Array.isArray(donHang.danh_sach_san_pham)) {
        danhSachMon = donHang.danh_sach_san_pham
            .map((sp, idx) => {
                const ten = sp.ten_san_pham || sp.san_pham?.ten_san_pham || 'Laptop';
                const sl = sp.so_luong || 1;
                const gia = dinhDangTien(sp.gia || sp.gia_hien_tai || sp.gia_tai_thoi_diem_them || 0);
                return `  ${idx + 1}. <b>${ten}</b>\n     Số lượng: <code>x${sl}</code> | Giá: <b>${gia}</b>`;
            })
            .join('\n');
    }

    const tongTien = dinhDangTien(donHang.tong_tien_thanh_toan || donHang.tam_tinh || 0);
    const phuongThucTT = layTenPhuongThuc(donHang.hinh_thuc_thanh_toan);
    const trangThai = layNhanTrangThai(donHang.trang_thai);
    const thoiGian = donHang.ngay_tao || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    return `
${tieuDe}
━━━━━━━━━━━━━━━━━━━━
📦 <b>Mã đơn:</b> <code>#${donHang.ma_don_hang}</code>
⏰ <b>Thời gian:</b> ${thoiGian}
👤 <b>Khách hàng:</b> ${tenKhach}
📞 <b>Số điện thoại:</b> <a href="tel:${sdt}">${sdt}</a>
📍 <b>Địa chỉ:</b> ${diaChi}
${ttgh.ghi_chu ? `📝 <b>Ghi chú:</b> <i>${ttgh.ghi_chu}</i>\n` : ''}
🛍️ <b>Danh sách sản phẩm:</b>
${danhSachMon || '  (Không có dữ liệu sản phẩm)'}

💰 <b>Tổng tiền thanh toán:</b> <u>${tongTien}</u>
💳 <b>Phương thức:</b> ${phuongThucTT}
📊 <b>Trạng thái:</b> <b>${trangThai}</b>
━━━━━━━━━━━━━━━━━━━━
`;
}

/**
 * Tạo bàn phím thao tác đổi trạng thái đơn hàng (Đầy đủ cả 5 trạng thái DB)
 */
function taoBanPhimThaoTacDonHang(maDonHang, trangThaiHienTai = 'cho_xac_nhan') {
    const nutDoiKhac = { text: '🔄 Đổi Trạng Thái Khác', callback_data: `menu_tt:${maDonHang}` };
    const nutChiTiet = { text: '🔍 Chi Tiết', callback_data: `chi_tiet:${maDonHang}` };

    if (trangThaiHienTai === 'cho_xac_nhan') {
        return {
            inline_keyboard: [
                [
                    { text: '✅ Xác Nhận Đơn', callback_data: `doi_tt:da_xac_nhan:${maDonHang}` },
                    { text: '🚚 Giao Hàng Luôn', callback_data: `doi_tt:dang_giao:${maDonHang}` }
                ],
                [
                    { text: '❌ Hủy Đơn', callback_data: `doi_tt:da_huy:${maDonHang}` },
                    nutDoiKhac
                ],
                [nutChiTiet]
            ]
        };
    }

    if (trangThaiHienTai === 'da_xac_nhan') {
        return {
            inline_keyboard: [
                [
                    { text: '🚚 Chuyển Đang Giao Hàng', callback_data: `doi_tt:dang_giao:${maDonHang}` },
                    { text: '🎉 Đã Giao Xong', callback_data: `doi_tt:da_giao:${maDonHang}` }
                ],
                [
                    { text: '❌ Hủy Đơn', callback_data: `doi_tt:da_huy:${maDonHang}` },
                    nutDoiKhac
                ],
                [nutChiTiet]
            ]
        };
    }

    if (trangThaiHienTai === 'dang_giao') {
        return {
            inline_keyboard: [
                [
                    { text: '🎉 Xác Nhận Đã Giao Xong', callback_data: `doi_tt:da_giao:${maDonHang}` }
                ],
                [
                    { text: '❌ Hủy Đơn', callback_data: `doi_tt:da_huy:${maDonHang}` },
                    nutDoiKhac
                ],
                [nutChiTiet]
            ]
        };
    }

    if (trangThaiHienTai === 'da_giao') {
        return {
            inline_keyboard: [
                [
                    { text: '✅ Đơn Đã Giao Hoàn Tất', callback_data: `toast:Đơn hàng này đã giao thành công!` }
                ],
                [
                    nutDoiKhac,
                    nutChiTiet
                ]
            ]
        };
    }

    if (trangThaiHienTai === 'da_huy') {
        return {
            inline_keyboard: [
                [
                    { text: '🔄 Khôi Phục: Chờ Xác Nhận', callback_data: `doi_tt:cho_xac_nhan:${maDonHang}` }
                ],
                [
                    nutDoiKhac,
                    nutChiTiet
                ]
            ]
        };
    }

    return {
        inline_keyboard: [
            [nutDoiKhac, nutChiTiet]
        ]
    };
}

/**
 * Bàn phím chọn 1 trong cả 5 trạng thái có sẵn trong Database
 */
function taoBanPhimChon5TrangThai(maDonHang, trangThaiHienTai) {
    const dsTrangThai = [
        { key: 'cho_xac_nhan', label: '⏳ 1. Chờ xác nhận' },
        { key: 'da_xac_nhan', label: '✅ 2. Đã xác nhận' },
        { key: 'dang_giao', label: '🚚 3. Đang giao hàng' },
        { key: 'da_giao', label: '🎉 4. Đã giao thành công' },
        { key: 'da_huy', label: '❌ 5. Đã hủy đơn hàng' }
    ];

    const cacNut = dsTrangThai.map(tt => {
        const laDangChon = tt.key === trangThaiHienTai;
        return [
            {
                text: `${tt.label} ${laDangChon ? '📍 (Hiện tại)' : ''}`,
                callback_data: laDangChon ? `toast:Đơn đang ở trạng thái này rồi!` : `doi_tt:${tt.key}:${maDonHang}`
            }
        ];
    });

    cacNut.push([
        { text: '⬅️ Quay Lại Thao Tác Nhanh', callback_data: `quay_lai:${maDonHang}` }
    ]);

    return { inline_keyboard: cacNut };
}

/**
 * 1. BẮN THÔNG BÁO ĐƠN HÀNG MỚI VỀ TELEGRAM (REALTIME)
 */
async function guiThongBaoDonHangTelegram(donHang) {
    try {
        if (!BOT_TOKEN) return;
        const noiDung = taoMauTinNhanDonHang(donHang, '🔔 <b>CÓ ĐƠN HÀNG MỚI CẦN DUYỆT!</b>');
        const banPhim = taoBanPhimThaoTacDonHang(donHang.ma_don_hang, donHang.trang_thai);
        const ketQua = await guiTinNhanAdmin(noiDung, banPhim);
        if (ketQua && ketQua.ok) {
            console.log(`🚀 Đã bắn thông báo đơn hàng #${donHang.ma_don_hang} về Telegram quản trị viên!`);
        }
        return ketQua;
    } catch (err) {
        console.error('❌ Lỗi gửi thông báo đơn hàng qua Telegram:', err.message);
    }
}

/**
 * 2. XỬ LÝ KHI ADMIN BẤM CÁC NÚT BẤM (INLINE BUTTONS)
 */
async function xuLyNutBamTelegram(callbackQuery) {
    try {
        const idCallback = callbackQuery.id;
        const duLieuNut = callbackQuery.data || '';
        const tinNhanGoc = callbackQuery.message;
        const chatId = tinNhanGoc.chat.id;
        const messageId = tinNhanGoc.message_id;
        const nguoiBam = callbackQuery.from?.first_name || 'Quản trị viên';
        const gioHienTai = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        // Nút thông báo Toast đơn giản
        if (duLieuNut.startsWith('toast:')) {
            const msg = duLieuNut.replace('toast:', '');
            await traLoiCallback(idCallback, msg);
            return;
        }

        // Mở menu chọn 1 trong 5 trạng thái
        if (duLieuNut.startsWith('menu_tt:')) {
            const maDonHang = duLieuNut.replace('menu_tt:', '');
            const donHang = await DonHang.findOne({ ma_don_hang: maDonHang });
            if (!donHang) {
                await traLoiCallback(idCallback, '❌ Không tìm thấy đơn hàng!', true);
                return;
            }
            await traLoiCallback(idCallback, `Chọn trạng thái mới cho đơn #${maDonHang}:`);
            const tieuDe = `⚙️ <b>CHỌN TRẠNG THÁI MỚI CHO ĐƠN #${maDonHang}:</b>\n<i>(Hiện tại: ${layNhanTrangThai(donHang.trang_thai)})</i>`;
            const banPhim5TrangThai = taoBanPhimChon5TrangThai(maDonHang, donHang.trang_thai);
            await capNhatTinNhan(chatId, messageId, tieuDe, banPhim5TrangThai);
            return;
        }

        // Nút quay lại từ menu chọn 5 trạng thái
        if (duLieuNut.startsWith('quay_lai:')) {
            const maDonHang = duLieuNut.replace('quay_lai:', '');
            const donHang = await DonHang.findOne({ ma_don_hang: maDonHang });
            if (!donHang) return;
            await traLoiCallback(idCallback, 'Đã quay lại');
            const noiDung = taoMauTinNhanDonHang(donHang, '📦 <b>THÔNG TIN ĐƠN HÀNG</b>');
            const banPhim = taoBanPhimThaoTacDonHang(maDonHang, donHang.trang_thai);
            await capNhatTinNhan(chatId, messageId, noiDung, banPhim);
            return;
        }

        // Nút xem chi tiết
        if (duLieuNut.startsWith('chi_tiet:')) {
            const maDonHang = duLieuNut.replace('chi_tiet:', '');
            const donHang = await DonHang.findOne({ ma_don_hang: maDonHang });
            if (!donHang) {
                await traLoiCallback(idCallback, '❌ Không tìm thấy đơn hàng!');
                return;
            }
            await traLoiCallback(idCallback, `Đang tra cứu #${maDonHang}...`);
            const noiDungChiTiet = taoMauTinNhanDonHang(donHang, '🔎 <b>THÔNG TIN CHI TIẾT ĐƠN HÀNG</b>') +
                `\n🌐 <b>Mở quản trị Web:</b> http://localhost:3000/admin?tab=don_hang`;
            await guiTinNhanAdmin(noiDungChiTiet, taoBanPhimThaoTacDonHang(maDonHang, donHang.trang_thai));
            return;
        }

        // Xử lý đổi sang bất kỳ trạng thái nào trong 5 trạng thái (`doi_tt:<trangThaiMoi>:<maDonHang>`)
        if (duLieuNut.startsWith('doi_tt:')) {
            const [, trangThaiMoi, maDonHang] = duLieuNut.split(':');
            const donHang = await DonHang.findOne({ ma_don_hang: maDonHang });
            if (!donHang) {
                await traLoiCallback(idCallback, '❌ Không tìm thấy đơn hàng!', true);
                return;
            }

            const trangThaiCu = donHang.trang_thai;
            donHang.trang_thai = trangThaiMoi;

            // Xử lý trừ kho hoặc hoàn kho chuẩn xác 2 chiều theo DB
            if (trangThaiMoi === 'da_giao' && !donHang.da_tru_ton_kho) {
                await xuLyCapNhatTonKho(donHang.danh_sach_san_pham, 'tru');
                donHang.da_tru_ton_kho = true;
                donHang.da_thanh_toan = true;
                donHang.trang_thai_thanh_toan = 'da_thanh_toan';
            } else if (trangThaiMoi !== 'da_giao' && donHang.da_tru_ton_kho) {
                await xuLyCapNhatTonKho(donHang.danh_sach_san_pham, 'hoan');
                donHang.da_tru_ton_kho = false;
            }

            await donHang.save();

            const nhanMoi = layNhanTrangThai(trangThaiMoi);
            await traLoiCallback(idCallback, `Đã chuyển sang: ${nhanMoi}!`);

            const tieuDeMoi = `✨ <b>ĐÃ ĐỔI TRẠNG THÁI: ${nhanMoi.toUpperCase()}</b>\n<i>(Cập nhật bởi ${nguoiBam} lúc ${gioHienTai})</i>`;
            const noiDungMoi = taoMauTinNhanDonHang(donHang, tieuDeMoi);
            const banPhimMoi = taoBanPhimThaoTacDonHang(maDonHang, trangThaiMoi);
            await capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi);
            return;
        }

        await traLoiCallback(idCallback, 'Đã nhận thao tác!');
    } catch (err) {
        console.error('❌ Lỗi callback Telegram:', err);
    }
}

/**
 * 3. XỬ LÝ LỆNH VĂN BẢN VÀ BÀN PHÍM CHẠM
 */
async function xuLyTinNhanVanBan(tinNhan) {
    try {
        const chatId = tinNhan.chat.id;
        const text = (tinNhan.text || '').trim();
        const tenNguoiGui = tinNhan.from?.first_name || 'Bạn';

        ADMIN_CHAT_ID = chatId.toString();

        // 1. Lệnh /start hoặc Bảng Điều Khiển
        if (text.startsWith('/start') || text === '⚡ Bảng Điều Khiển' || text === '/menu') {
            const loiChao = `
🎉 <b>Xin chào Quản Trị Viên ${tenNguoiGui}!</b>
━━━━━━━━━━━━━━━━━━━━
🤖 Bot <b>TNTP Laptop Store</b> đang kết nối trực tiếp với <b>Database MongoDB</b>.

⚡ <b>Quyền hạn quản trị Real-time:</b>
• Nhận chuông báo tức thì mỗi khi có đơn đặt hàng mới trên web.
• Đổi trạng thái trực tiếp cho <b>toàn bộ 5 trạng thái</b> trong CSDL:
  1. ⏳ <b>Chờ xác nhận</b>
  2. ✅ <b>Đã xác nhận</b>
  3. 🚚 <b>Đang giao hàng</b>
  4. 🎉 <b>Đã giao thành công</b> (Tự động trừ kho & hoàn tất TT)
  5. ❌ <b>Đã hủy đơn</b> (Tự động hoàn tồn kho)

👇 <b>Bạn có thể bấm ngay các phím tắt bên dưới bàn phím để thao tác!</b>
`;
            await guiTinNhanAdmin(loiChao, BAN_PHIM_DIEU_KHIEN);
            return;
        }

        // 2. Lệnh /thongke hoặc Nút "📊 Báo Cáo Hôm Nay"
        if (text.startsWith('/thongke') || text === '📊 Báo Cáo Hôm Nay') {
            const homNay = new Date();
            homNay.setHours(0, 0, 0, 0);

            const tatCaDon = await DonHang.find({}).sort({ createdAt: -1 });
            const donHomNay = tatCaDon.filter(dh => {
                const tg = new Date(dh.createdAt || dh.ngay_tao);
                return tg >= homNay;
            });

            const tongDoanhThuHomNay = donHomNay
                .filter(dh => dh.trang_thai !== 'da_huy')
                .reduce((sum, dh) => sum + (Number(dh.tong_tien_thanh_toan) || 0), 0);

            const soDonCho = tatCaDon.filter(dh => dh.trang_thai === 'cho_xac_nhan').length;
            const soDonXacNhan = tatCaDon.filter(dh => dh.trang_thai === 'da_xac_nhan').length;
            const soDonDangGiao = tatCaDon.filter(dh => dh.trang_thai === 'dang_giao').length;
            const soDonDaGiao = tatCaDon.filter(dh => dh.trang_thai === 'da_giao').length;
            const soDonDaHuy = tatCaDon.filter(dh => dh.trang_thai === 'da_huy').length;

            const baoCao = `
📊 <b>BÁO CÁO DOANH THU & KHO ĐƠN HÀNG</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>Hôm nay:</b> ${new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
💰 <b>Doanh thu hôm nay:</b> <u>${dinhDangTien(tongDoanhThuHomNay)}</u>
📦 <b>Đơn mới hôm nay:</b> <b>${donHomNay.length}</b> đơn

📈 <b>Trạng thái đơn hàng trong Database:</b>
• ⏳ Chờ xác nhận: <b>${soDonCho}</b> đơn
• ✅ Đã xác nhận: <b>${soDonXacNhan}</b> đơn
• 🚚 Đang giao hàng: <b>${soDonDangGiao}</b> đơn
• 🎉 Giao thành công: <b>${soDonDaGiao}</b> đơn
• ❌ Đã hủy đơn: <b>${soDonDaHuy}</b> đơn
━━━━━━━━━━━━━━━━━━━━
<i>Bấm <code>📋 Đơn Chờ Duyệt</code> để duyệt ngay!</i>
`;
            await guiTinNhanAdmin(baoCao);
            return;
        }

        // 3. Lệnh /donmoi hoặc Nút "📋 Đơn Chờ Duyệt"
        if (text.startsWith('/donmoi') || text === '📋 Đơn Chờ Duyệt') {
            const danhSachCho = await DonHang.find({ trang_thai: 'cho_xac_nhan' })
                .sort({ createdAt: -1 })
                .limit(5);

            if (!danhSachCho || danhSachCho.length === 0) {
                await guiTinNhanAdmin('✨ Hiện không có đơn hàng nào đang chờ duyệt. Danh sách sạch sẽ! 👍');
                return;
            }

            await guiTinNhanAdmin(`📋 Có <b>${danhSachCho.length}</b> đơn hàng mới nhất đang chờ bạn duyệt:`);
            for (const don of danhSachCho) {
                const noiDung = taoMauTinNhanDonHang(don, '⏳ <b>ĐƠN HÀNG CHỜ DUYỆT</b>');
                const banPhim = taoBanPhimThaoTacDonHang(don.ma_don_hang, don.trang_thai);
                await guiTinNhanAdmin(noiDung, banPhim);
            }
            return;
        }

        // 4. Lệnh /tatcadon hoặc Nút "📦 10 Đơn Gần Đây"
        if (text.startsWith('/tatcadon') || text === '📦 10 Đơn Gần Đây') {
            const danhSach = await DonHang.find({})
                .sort({ createdAt: -1 })
                .limit(10);

            if (!danhSach || danhSach.length === 0) {
                await guiTinNhanAdmin('Chưa có đơn hàng nào trong hệ thống.');
                return;
            }

            let str = '📦 <b>DANH SÁCH 10 ĐƠN HÀNG MỚI NHẤT:</b>\n━━━━━━━━━━━━━━━━━━━━\n';
            danhSach.forEach((dh, i) => {
                const tt = layNhanTrangThai(dh.trang_thai);
                const tien = dinhDangTien(dh.tong_tien_thanh_toan || 0);
                str += `${i + 1}. <code>#${dh.ma_don_hang}</code> | ${tien}\n   Khách: <b>${dh.thong_tin_giao_hang?.ho_ten || 'Khách'}</b>\n   Trạng thái: <b>${tt}</b>\n   👉 Lệnh xem: /timdon_${dh.ma_don_hang}\n\n`;
            });

            await guiTinNhanAdmin(str);
            return;
        }

        // 5. Lệnh /timdon hoặc /timdon_...
        if (text.startsWith('/timdon')) {
            let tuKhoa = text.replace('/timdon_', '').replace('/timdon', '').trim();
            if (!tuKhoa) {
                await guiTinNhanAdmin('⚠️ Vui lòng nhập mã đơn cần tìm. Ví dụ: <code>/timdon 123456</code>');
                return;
            }

            const don = await DonHang.findOne({
                $or: [
                    { ma_don_hang: { $regex: new RegExp(tuKhoa, 'i') } },
                    { id: tuKhoa }
                ]
            });

            if (!don) {
                await guiTinNhanAdmin(`🔍 Không tìm thấy đơn hàng nào có mã: <code>${tuKhoa}</code>`);
                return;
            }

            const noiDung = taoMauTinNhanDonHang(don, '🔎 <b>KẾT QUẢ TRA CỨU ĐƠN HÀNG</b>');
            const banPhim = taoBanPhimThaoTacDonHang(don.ma_don_hang, don.trang_thai);
            await guiTinNhanAdmin(noiDung, banPhim);
            return;
        }

        // 6. Lệnh /help hoặc tin nhắn khác
        const huongDan = `
📖 <b>HƯỚNG DẪN QUẢN TRỊ VIÊN TELEGRAM BOT</b>
━━━━━━━━━━━━━━━━━━━━
👉 <b>Gõ dấu <code>/</code></b> trên bàn phím để chọn nhanh các lệnh:
• <code>/donmoi</code> : Danh sách các đơn chờ xác nhận
• <code>/thongke</code> : Báo cáo doanh thu & đơn hàng hôm nay
• <code>/tatcadon</code> : Danh sách 10 đơn gần đây nhất
• <code>/timdon [mã]</code> : Tra cứu & đổi trạng thái đơn
• <code>/menu</code> : Bật lại bàn phím điều khiển

💡 <b>Đặc biệt:</b> Mỗi đơn hàng gửi về đều có nút <b>[🔄 Đổi Trạng Thái Khác]</b> để bạn chọn đổi sang bất kỳ trạng thái nào trong 5 trạng thái của hệ thống!
`;
        await guiTinNhanAdmin(huongDan);
    } catch (err) {
        console.error('❌ Lỗi tin nhắn Telegram:', err);
    }
}

/**
 * 4. TIẾN TRÌNH LONG-POLLING TELEGRAM
 */
async function batDauPolling() {
    if (!BOT_TOKEN) return;
    if (dangChayPolling) return;
    dangChayPolling = true;

    // Đăng ký danh sách menu lệnh
    await caiDatMenuGoiYTelegram();

    console.log('🤖 Telegram Bot Quản lý Đơn hàng đã sẵn sàng (Long Polling)...');

    while (dangChayPolling) {
        try {
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${updateOffset}&timeout=20`;
            const res = await fetch(url);
            const data = await res.json();

            if (data && data.ok && Array.isArray(data.result)) {
                for (const update of data.result) {
                    updateOffset = update.update_id + 1;

                    if (update.callback_query) {
                        await xuLyNutBamTelegram(update.callback_query);
                    }

                    if (update.message && update.message.text) {
                        await xuLyTinNhanVanBan(update.message);
                    }
                }
            }
        } catch (err) {
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

function khoiTaoTelegramBot() {
    batDauPolling().catch(err => console.error('❌ Lỗi Telegram Bot:', err.message));
}

module.exports = {
    khoiTaoTelegramBot,
    guiThongBaoDonHangTelegram,
    caiDatMenuGoiYTelegram,
    taoMauTinNhanDonHang,
    taoBanPhimThaoTacDonHang
};
