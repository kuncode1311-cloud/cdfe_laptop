/**
 * =========================================================================
 * DỊCH VỤ TELEGRAM BOT QUẢN LÝ ĐƠN HÀNG REALTIME (MVC SERVICE)
 * =========================================================================
 * - Tự động bắn thông báo khi khách đặt hàng hoặc thanh toán thành công
 * - Cung cấp nút bấm Duyệt đơn / Giao hàng / Hủy đơn 1 chạm trên Telegram
 * - Hỗ trợ các lệnh quản trị: /thongke, /donmoi, /timdon, /help
 * - Chuẩn Clean Code, 100% tiếng Việt, tối ưu bảo mật & hiệu năng
 * =========================================================================
 */

const DonHang = require('../models/don-hang.model');
const SanPham = require('../models/san-pham.model');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
let ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8952266086';
let dangChayPolling = false;
let updateOffset = 0;

/**
 * Định dạng tiền tệ Việt Nam (VNĐ)
 */
function dinhDangTien(soTien) {
    if (!soTien || isNaN(soTien)) return '0 đ';
    return Number(soTien).toLocaleString('vi-VN') + ' đ';
}

/**
 * Chuyển đổi tên phương thức thanh toán sang tiếng Việt thân thiện
 */
function layTenPhuongThuc(pt) {
    const bangAnhXa = {
        tien_mat_cod: '💵 Tiền mặt khi nhận hàng (COD)',
        cod: '💵 Tiền mặt khi nhận hàng (COD)',
        chuyen_khoan: '🏦 Chuyển khoản ngân hàng (VietQR)',
        payos: '⚡ Cổng thanh toán trực tuyến PayOS',
        the_tin_dung: '💳 Thẻ tín dụng / Ghi nợ quốc tế'
    };
    return bangAnhXa[pt] || pt || 'Chưa xác định';
}

/**
 * Chuyển đổi trạng thái đơn hàng sang nhãn tiếng Việt kèm biểu tượng
 */
function layNhanTrangThai(tt) {
    const bangTrangThai = {
        cho_xac_nhan: '⏳ Chờ xác nhận',
        da_xac_nhan: '✅ Đã xác nhận',
        dang_giao: '🚚 Đang giao hàng',
        da_giao: '🎉 Giao hàng thành công',
        da_huy: '❌ Đã hủy'
    };
    return bangTrangThai[tt] || tt || 'Chưa rõ';
}

/**
 * Gửi yêu cầu HTTP đến Telegram Bot API
 */
async function goiTelegramApi(endpoint, body = {}) {
    if (!BOT_TOKEN) {
        console.warn('⚠️ Chưa cấu hình TELEGRAM_BOT_TOKEN trong file .env');
        return null;
    }
    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/${endpoint}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!data.ok) {
            console.error(`❌ Lỗi gọi Telegram API (${endpoint}):`, data.description);
        }
        return data;
    } catch (err) {
        console.error(`❌ Ngoại lệ gọi Telegram API (${endpoint}):`, err.message);
        return null;
    }
}

/**
 * Trả lời thông báo nhanh (Toast) khi người dùng bấm nút trên Telegram
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
    }
    return goiTelegramApi('sendMessage', payload);
}

/**
 * Cập nhật nội dung & bàn phím của tin nhắn cũ
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
 * Tạo mẫu tin nhắn thông báo đơn hàng chi tiết
 */
function taoMauTinNhanDonHang(donHang, tieuDe = '🔔 CÓ ĐƠN HÀNG MỚI!') {
    const ttgh = donHang.thong_tin_giao_hang || {};
    const tenKhach = ttgh.ho_ten || ttgh.ho_va_ten || 'Khách vãng lai';
    const sdt = ttgh.so_dien_thoai || 'Chưa có SĐT';
    const diaChiDayDu = [ttgh.dia_chi_chi_tiet, ttgh.phuong_xa, ttgh.quan_huyen, ttgh.tinh_thanh]
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
📍 <b>Địa chỉ:</b> ${diaChiDayDu}
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
 * Tạo bàn phím Inline chứa các nút thao tác đơn hàng
 */
function taoBanPhimThaoTacDonHang(maDonHang, trangThaiHienTai = 'cho_xac_nhan') {
    const nutChiTiet = { text: '🔍 Chi Tiết Đơn', callback_data: `chi_tiet:${maDonHang}` };

    if (trangThaiHienTai === 'da_xac_nhan') {
        return {
            inline_keyboard: [
                [
                    { text: '🚚 Chuyển Đang Giao Hàng', callback_data: `giao_hang:${maDonHang}` }
                ],
                [
                    { text: '❌ Hủy Đơn Hàng Này', callback_data: `huy_don:${maDonHang}` },
                    nutChiTiet
                ]
            ]
        };
    }

    if (trangThaiHienTai === 'dang_giao') {
        return {
            inline_keyboard: [
                [
                    { text: '🎉 Đã Giao Thành Công', callback_data: `da_giao:${maDonHang}` }
                ],
                [
                    { text: '❌ Hủy Đơn Hàng Này', callback_data: `huy_don:${maDonHang}` },
                    nutChiTiet
                ]
            ]
        };
    }

    if (trangThaiHienTai === 'da_giao' || trangThaiHienTai === 'da_huy') {
        return {
            inline_keyboard: [
                [
                    nutChiTiet
                ]
            ]
        };
    }

    // Mặc định: Chờ xác nhận
    return {
        inline_keyboard: [
            [
                { text: '✅ Xác Nhận Đơn', callback_data: `xac_nhan:${maDonHang}` },
                { text: '🚚 Giao Hàng Luôn', callback_data: `giao_hang:${maDonHang}` }
            ],
            [
                { text: '❌ Hủy Đơn Hàng', callback_data: `huy_don:${maDonHang}` },
                nutChiTiet
            ]
        ]
    };
}

/**
 * 1. BẮN THÔNG BÁO ĐƠN HÀNG MỚI VỀ TELEGRAM (REALTIME)
 * Được gọi trực tiếp từ Controller khi khách tạo đơn hoặc thanh toán thành công
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
        console.error('❌ Lỗi khi gửi thông báo đơn hàng qua Telegram:', err.message);
    }
}

/**
 * 2. XỬ LÝ SỰ KIỆN KHI ADMIN BẤM NÚT TRÊN TELEGRAM
 */
async function xuLyNutBamTelegram(callbackQuery) {
    try {
        const idCallback = callbackQuery.id;
        const duLieuNut = callbackQuery.data || '';
        const tinNhanGoc = callbackQuery.message;
        const chatId = tinNhanGoc.chat.id;
        const messageId = tinNhanGoc.message_id;
        const nguoiBam = callbackQuery.from?.first_name || 'Quản trị viên';

        console.log(`🔘 Admin [${nguoiBam}] bấm nút: ${duLieuNut}`);

        const [hanhDong, maDonHang] = duLieuNut.split(':');
        if (!maDonHang) {
            await traLoiCallback(idCallback, '⚠️ Dữ liệu thao tác không hợp lệ!');
            return;
        }

        const donHang = await DonHang.findOne({ ma_don_hang: maDonHang });
        if (!donHang) {
            await traLoiCallback(idCallback, '❌ Không tìm thấy đơn hàng trong hệ thống!', true);
            return;
        }

        const gioHienTai = new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        if (hanhDong === 'xac_nhan') {
            donHang.trang_thai = 'da_xac_nhan';
            await donHang.save();

            await traLoiCallback(idCallback, `✅ Đã xác nhận đơn hàng #${maDonHang}!`);
            const tieuDeMoi = `✅ <b>ĐÃ XÁC NHẬN ĐƠN HÀNG</b>\n<i>(Bởi ${nguoiBam} lúc ${gioHienTai})</i>`;
            const noiDungMoi = taoMauTinNhanDonHang(donHang, tieuDeMoi);
            const banPhimMoi = taoBanPhimThaoTacDonHang(maDonHang, 'da_xac_nhan');
            await capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi);
            return;
        }

        if (hanhDong === 'giao_hang') {
            donHang.trang_thai = 'dang_giao';
            await donHang.save();

            await traLoiCallback(idCallback, `🚚 Đã chuyển đơn #${maDonHang} sang Đang giao hàng!`);
            const tieuDeMoi = `🚚 <b>ĐƠN HÀNG ĐANG ĐƯỢC GIAO</b>\n<i>(Cập nhật bởi ${nguoiBam} lúc ${gioHienTai})</i>`;
            const noiDungMoi = taoMauTinNhanDonHang(donHang, tieuDeMoi);
            const banPhimMoi = taoBanPhimThaoTacDonHang(maDonHang, 'dang_giao');
            await capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi);
            return;
        }

        if (hanhDong === 'da_giao') {
            donHang.trang_thai = 'da_giao';
            donHang.da_thanh_toan = true;
            donHang.trang_thai_thanh_toan = 'da_thanh_toan';
            await donHang.save();

            await traLoiCallback(idCallback, `🎉 Đã đánh dấu hoàn tất giao đơn #${maDonHang}!`, true);
            const tieuDeMoi = `🎉 <b>ĐƠN HÀNG ĐÃ GIAO THÀNH CÔNG</b>\n<i>(Xác nhận bởi ${nguoiBam} lúc ${gioHienTai})</i>`;
            const noiDungMoi = taoMauTinNhanDonHang(donHang, tieuDeMoi);
            const banPhimMoi = taoBanPhimThaoTacDonHang(maDonHang, 'da_giao');
            await capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi);
            return;
        }

        if (hanhDong === 'huy_don') {
            donHang.trang_thai = 'da_huy';
            await donHang.save();

            await traLoiCallback(idCallback, `❌ Đã hủy đơn hàng #${maDonHang}!`, true);
            const tieuDeMoi = `❌ <b>ĐƠN HÀNG ĐÃ BỊ HỦY</b>\n<i>(Hủy bởi ${nguoiBam} lúc ${gioHienTai})</i>`;
            const noiDungMoi = taoMauTinNhanDonHang(donHang, tieuDeMoi);
            const banPhimMoi = taoBanPhimThaoTacDonHang(maDonHang, 'da_huy');
            await capNhatTinNhan(chatId, messageId, noiDungMoi, banPhimMoi);
            return;
        }

        if (hanhDong === 'chi_tiet') {
            await traLoiCallback(idCallback, `Đang tra cứu #${maDonHang}...`);
            const noiDungChiTiet = taoMauTinNhanDonHang(donHang, '🔎 <b>THÔNG TIN CHI TIẾT ĐƠN HÀNG</b>') +
                `\n🌐 <b>Quản lý trên web:</b> http://localhost:3000/admin?tab=don_hang`;
            await guiTinNhanAdmin(noiDungChiTiet);
            return;
        }

        await traLoiCallback(idCallback, 'Đã nhận yêu cầu!');
    } catch (err) {
        console.error('❌ Lỗi xử lý callback Telegram:', err);
    }
}

/**
 * 3. XỬ LÝ CÁC LỆNH VĂN BẢN TỪ ADMIN (/start, /thongke, /donmoi, /timdon, /help)
 */
async function xuLyTinNhanVanBan(tinNhan) {
    try {
        const chatId = tinNhan.chat.id;
        const text = (tinNhan.text || '').trim();
        const tenNguoiGui = tinNhan.from?.first_name || 'Bạn';

        // Luôn ghi nhận chat_id mới nhất của quản trị viên
        ADMIN_CHAT_ID = chatId.toString();

        // 1. Lệnh /start
        if (text.startsWith('/start')) {
            const loiChao = `
🎉 <b>Chào mừng Quản Trị Viên ${tenNguoiGui}!</b>
━━━━━━━━━━━━━━━━━━━━
🤖 Bot <b>TNTP Laptop Store</b> đã kích hoạt thành công cho tài khoản của bạn.

⚡ <b>Đặc quyền quản trị tự động:</b>
• Mỗi khi có đơn hàng mới trên web, chuông báo sẽ reo tức thì tại đây kèm chi tiết đơn.
• Nút bấm <b>Xác nhận / Giao hàng / Hủy đơn</b> 1 chạm ngay trên điện thoại không cần mở máy tính.

📋 <b>Danh sách lệnh nhanh:</b>
👉 <code>/thongke</code> : Báo cáo doanh thu & đơn hàng hôm nay
👉 <code>/donmoi</code> : Danh sách các đơn đang chờ duyệt
👉 <code>/timdon [mã_đơn]</code> : Tra cứu đơn theo mã (vd: <code>/timdon 123456</code>)
👉 <code>/help</code> : Xem lại hướng dẫn sử dụng

<i>Hệ thống đã sẵn sàng nhận đơn hàng mới! 🚀</i>
`;
            await guiTinNhanAdmin(loiChao);
            return;
        }

        // 2. Lệnh /thongke
        if (text.startsWith('/thongke')) {
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
            const soDonDangGiao = tatCaDon.filter(dh => dh.trang_thai === 'dang_giao').length;
            const soDonHoanTat = tatCaDon.filter(dh => dh.trang_thai === 'da_giao').length;

            const baoCao = `
📊 <b>BÁO CÁO NHANH DOANH THU & ĐƠN HÀNG</b>
━━━━━━━━━━━━━━━━━━━━
📅 <b>Hôm nay:</b> ${new Date().toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}
💰 <b>Doanh thu hôm nay:</b> <u>${dinhDangTien(tongDoanhThuHomNay)}</u>
📦 <b>Số đơn mới hôm nay:</b> <b>${donHomNay.length}</b> đơn

📈 <b>Trạng thái kho đơn toàn hệ thống:</b>
• ⏳ Chờ xác nhận: <b>${soDonCho}</b> đơn
• 🚚 Đang giao hàng: <b>${soDonDangGiao}</b> đơn
• 🎉 Giao thành công: <b>${soDonHoanTat}</b> đơn
━━━━━━━━━━━━━━━━━━━━
<i>Gõ <code>/donmoi</code> để duyệt ngay các đơn đang chờ!</i>
`;
            await guiTinNhanAdmin(baoCao);
            return;
        }

        // 3. Lệnh /donmoi
        if (text.startsWith('/donmoi')) {
            const danhSachCho = await DonHang.find({ trang_thai: 'cho_xac_nhan' })
                .sort({ createdAt: -1 })
                .limit(5);

            if (!danhSachCho || danhSachCho.length === 0) {
                await guiTinNhanAdmin('✨ Hiện không có đơn hàng nào đang chờ duyệt. Kho đơn sạch sẽ! 👍');
                return;
            }

            await guiTinNhanAdmin(`📋 Tìm thấy <b>${danhSachCho.length}</b> đơn hàng mới nhất đang chờ bạn duyệt:`);
            for (const don of danhSachCho) {
                const noiDung = taoMauTinNhanDonHang(don, '⏳ <b>ĐƠN HÀNG CHỜ DUYỆT</b>');
                const banPhim = taoBanPhimThaoTacDonHang(don.ma_don_hang, don.trang_thai);
                await guiTinNhanAdmin(noiDung, banPhim);
            }
            return;
        }

        // 4. Lệnh /timdon
        if (text.startsWith('/timdon')) {
            const tuKhoa = text.replace('/timdon', '').trim();
            if (!tuKhoa) {
                await guiTinNhanAdmin('⚠️ Vui lòng nhập mã đơn hàng cần tìm. Ví dụ: <code>/timdon TNTP-123456</code>');
                return;
            }

            const donTimThay = await DonHang.findOne({
                $or: [
                    { ma_don_hang: { $regex: new RegExp(tuKhoa, 'i') } },
                    { id: tuKhoa }
                ]
            });

            if (!donTimThay) {
                await guiTinNhanAdmin(`🔍 Không tìm thấy đơn hàng nào có mã: <code>${tuKhoa}</code>`);
                return;
            }

            const noiDung = taoMauTinNhanDonHang(donTimThay, '🔎 <b>KẾT QUẢ TRA CỨU ĐƠN HÀNG</b>');
            const banPhim = taoBanPhimThaoTacDonHang(donTimThay.ma_don_hang, donTimThay.trang_thai);
            await guiTinNhanAdmin(noiDung, banPhim);
            return;
        }

        // 5. Lệnh /help hoặc tin nhắn khác
        if (text.startsWith('/help') || text.startsWith('/')) {
            const huongDan = `
📖 <b>HƯỚNG DẪN SỬ DỤNG BOT TELEGRAM TNTP LAPTOP</b>
━━━━━━━━━━━━━━━━━━━━
• <code>/thongke</code> : Thống kê doanh thu và đơn hàng hôm nay
• <code>/donmoi</code> : Hiển thị 5 đơn hàng đang chờ duyệt gần nhất
• <code>/timdon [mã]</code> : Tra cứu thông tin và duyệt đơn theo mã
• <code>/help</code> : Hiển thị bảng trợ giúp này

<i>Mọi đơn hàng khách đặt trên website sẽ tự động được gửi về đây theo thời gian thực!</i>
`;
            await guiTinNhanAdmin(huongDan);
        }
    } catch (err) {
        console.error('❌ Lỗi xử lý tin nhắn Telegram:', err);
    }
}

/**
 * 4. VÒNG LẶP LONG-POLLING NHẬN TIN NHẮN VÀ SỰ KIỆN TỪ TELEGRAM
 */
async function batDauPolling() {
    if (!BOT_TOKEN) {
        console.warn('⚠️ Bỏ qua khởi động Telegram Bot vì chưa có TELEGRAM_BOT_TOKEN');
        return;
    }

    if (dangChayPolling) return;
    dangChayPolling = true;

    console.log('🤖 Dịch vụ Telegram Bot Quản lý Đơn hàng đã khởi động (Chế độ Long Polling)...');

    while (dangChayPolling) {
        try {
            const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${updateOffset}&timeout=20`;
            const res = await fetch(url);
            const data = await res.json();

            if (data && data.ok && Array.isArray(data.result)) {
                for (const update of data.result) {
                    updateOffset = update.update_id + 1;

                    // Xử lý sự kiện bấm nút Inline Keyboard
                    if (update.callback_query) {
                        await xuLyNutBamTelegram(update.callback_query);
                    }

                    // Xử lý tin nhắn văn bản (Lệnh /start, /thongke,...)
                    if (update.message && update.message.text) {
                        await xuLyTinNhanVanBan(update.message);
                    }
                }
            }
        } catch (err) {
            // Khi lỗi mạng, chờ 3 giây rồi tiếp tục thử lại để không làm đơ server
            await new Promise(r => setTimeout(r, 3000));
        }
    }
}

/**
 * Khởi tạo Bot Telegram
 */
function khoiTaoTelegramBot() {
    batDauPolling().catch(err => {
        console.error('❌ Lỗi tiến trình Telegram Bot:', err.message);
    });
}

module.exports = {
    khoiTaoTelegramBot,
    guiThongBaoDonHangTelegram,
    taoMauTinNhanDonHang,
    taoBanPhimThaoTacDonHang
};
