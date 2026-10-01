const DonHang = require('../models/don-hang.model');
const SanPham = require('../models/san-pham.model');
const MaGiamGia = require('../models/ma-giam-gia.model');
const mongoose = require('mongoose');
const crypto = require('crypto');
const { guiMailXacNhanDonHang } = require('../services/email.service');
const { guiThongBaoDonHangTelegram } = require('../services/telegram-bot.service');

/**
 * Controller xử lý nghiệp vụ cho Đơn hàng & Tồn kho
 */

const chiGiuSo = (value = '') => String(value || '').replace(/\D/g, '');

const cheTen = (value = '') => {
    const words = String(value || '').trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    return words.map((word, index) => {
        if (index === 0 || index === words.length - 1) {
            return `${word.charAt(0)}${'*'.repeat(Math.max(1, word.length - 1))}`;
        }
        return `${word.charAt(0)}***`;
    }).join(' ');
};

const cheSoDienThoai = (value = '') => {
    const phone = chiGiuSo(value);
    if (phone.length <= 6) return phone ? `${phone.slice(0, 2)}****` : '';
    return `${phone.slice(0, 3)}****${phone.slice(-3)}`;
};

const cheEmail = (value = '') => {
    const email = String(value || '').trim();
    const [name, domain] = email.split('@');
    if (!name || !domain) return '';
    return `${name.charAt(0)}***@${domain}`;
};

const anThongTinDonHangCongKhai = (donHangDoc) => {
    const donHang = donHangDoc.toObject ? donHangDoc.toObject() : { ...donHangDoc };
    const giaoHang = donHang.thong_tin_giao_hang || {};
    const ten = giaoHang.ho_ten || giaoHang.ho_va_ten || '';

    donHang.thong_tin_giao_hang = {
        ho_ten: cheTen(ten),
        ho_va_ten: cheTen(ten),
        so_dien_thoai: cheSoDienThoai(giaoHang.so_dien_thoai),
        email: cheEmail(giaoHang.email),
        tinh_thanh: giaoHang.tinh_thanh || '',
        quan_huyen: giaoHang.quan_huyen || '',
        phuong_xa: '',
        dia_chi_chi_tiet: '',
        ghi_chu: ''
    };

    donHang.danh_sach_san_pham = (donHang.danh_sach_san_pham || []).map((item) => ({
        id_muc: item.id_muc,
        ten_san_pham: item.ten_san_pham || item.san_pham?.ten_san_pham || 'Sản phẩm LaptopNew',
        hinh_anh: item.hinh_anh || item.san_pham?.hinh_anh_chinh || item.san_pham?.hinh_anh || '',
        so_luong: item.so_luong || 1
    }));

    delete donHang.id_nguoi_dung;
    delete donHang.email;
    delete donHang.__v;
    return donHang;
};

// Chủ đơn = đơn có id_nguoi_dung trùng tài khoản đang đăng nhập.
// Email (đã xác thực OTP) chỉ dùng cho đơn cũ chưa gắn id_nguoi_dung.
// KHÔNG so khớp theo SĐT: SĐT trong hồ sơ do người dùng tự khai, kẻ xấu có thể
// điền SĐT của người khác để xem trộm đơn hàng (lỗi IDOR).
const laChuSoHuuDon = (user, donHang) => {
    if (!user || !donHang) return false;
    const idDon = String(donHang.id_nguoi_dung || '');
    if (idDon) {
        return idDon === String(user.id || '') || idDon === String(user._id || '');
    }
    const userEmail = String(user.email || '').trim().toLowerCase();
    const donEmail = String(donHang.thong_tin_giao_hang?.email || '').trim().toLowerCase();
    return !!userEmail && userEmail === donEmail;
};

const laChuDonHang = (req, donHang) => {
    if (!req.user || !donHang) return false;
    if (req.user.vaiTro === 'admin') return true;
    return laChuSoHuuDon(req.user, donHang);
};

// Điều kiện MongoDB tương ứng với laChuSoHuuDon (dùng khi lấy danh sách đơn)
const dieuKienDonCuaToi = (user) => {
    const dieuKien = [{ id_nguoi_dung: String(user.id || '') }];
    if (user._id) dieuKien.push({ id_nguoi_dung: String(user._id) });
    const email = String(user.email || '').trim().toLowerCase();
    if (email) {
        dieuKien.push({
            'thong_tin_giao_hang.email': email,
            $or: [{ id_nguoi_dung: { $exists: false } }, { id_nguoi_dung: null }, { id_nguoi_dung: '' }]
        });
    }
    return dieuKien;
};

/**
 * Hàm hỗ trợ xử lý tăng/giảm tồn kho và số lượng đã bán của sản phẩm khi đơn hàng thay đổi trạng thái
 * @param {Array} danhSachSanPham - Danh sách mặt hàng trong đơn
 * @param {'tru' | 'hoan'} thaoTac - 'tru' khi giao thành công, 'hoan' khi hủy đơn/chuyển khỏi giao thành công
 */
const capNhatTonKhoTheoDonHang = async (danhSachSanPham, thaoTac = 'tru') => {
    if (!Array.isArray(danhSachSanPham) || danhSachSanPham.length === 0) return;

    for (const item of danhSachSanPham) {
        try {
            const soLuong = Math.max(1, Number(item.so_luong) || 1);
            const spId = item.san_pham_id || item.san_pham?.id || item.san_pham?._id || item.san_pham?.ma_san_pham || item.id_muc || (typeof item.san_pham === 'string' ? item.san_pham : null);

            if (!spId && !item.ten_san_pham) continue;

            const orConditions = [];
            if (spId) {
                const strId = String(spId).trim();
                orConditions.push({ id: strId });
                orConditions.push({ ma_san_pham: strId });
                orConditions.push({ slug: strId });
                if (mongoose.Types.ObjectId.isValid(strId)) {
                    orConditions.push({ _id: strId });
                }
            }

            let sp = orConditions.length > 0 ? await SanPham.findOne({ $or: orConditions }) : null;

            if (!sp && item.ten_san_pham) {
                sp = await SanPham.findOne({ ten_san_pham: item.ten_san_pham.trim() });
            }

            if (!sp) {
                console.warn(`⚠️ [Kho] Không tìm thấy sản phẩm trong DB để cập nhật tồn kho:`, spId || item.ten_san_pham);
                continue;
            }

            if (thaoTac === 'tru') {
                // Trừ số lượng tồn kho (không âm), tăng số lượng đã bán
                sp.so_luong_ton_kho = Math.max(0, (Number(sp.so_luong_ton_kho) || 0) - soLuong);
                sp.so_luong_da_ban = (Number(sp.so_luong_da_ban) || 0) + soLuong;
                if (sp.so_luong_ton_kho <= 0) {
                    sp.con_hang = false;
                }

                // Cập nhật tồn kho chi nhánh nếu có
                if (Array.isArray(sp.ton_kho) && sp.ton_kho.length > 0) {
                    let conLai = soLuong;
                    for (const cn of sp.ton_kho) {
                        if (conLai <= 0) break;
                        const sl = Number(cn.so_luong_con) || 0;
                        if (sl > 0) {
                            const tru = Math.min(sl, conLai);
                            cn.so_luong_con = sl - tru;
                            conLai -= tru;
                        }
                    }
                }
                console.log(`📦 [Kho] ĐÃ TRỪ TỒN KHO: "${sp.ten_san_pham}" (-${soLuong}) | Còn lại: ${sp.so_luong_ton_kho} | Đã bán: ${sp.so_luong_da_ban}`);
            } else if (thaoTac === 'hoan') {
                // Hoàn lại tồn kho, giảm số lượng đã bán
                sp.so_luong_ton_kho = (Number(sp.so_luong_ton_kho) || 0) + soLuong;
                sp.so_luong_da_ban = Math.max(0, (Number(sp.so_luong_da_ban) || 0) - soLuong);
                if (sp.so_luong_ton_kho > 0) {
                    sp.con_hang = true;
                }

                // Hoàn lại tồn kho chi nhánh
                if (Array.isArray(sp.ton_kho) && sp.ton_kho.length > 0) {
                    sp.ton_kho[0].so_luong_con = (Number(sp.ton_kho[0].so_luong_con) || 0) + soLuong;
                }
                console.log(`↩️ [Kho] ĐÃ HOÀN TỒN KHO: "${sp.ten_san_pham}" (+${soLuong}) | Tồn kho mới: ${sp.so_luong_ton_kho} | Đã bán: ${sp.so_luong_da_ban}`);
            }

            await sp.save();
        } catch (err) {
            console.error(`❌ [Kho] Lỗi cập nhật tồn kho cho item:`, item?.ten_san_pham || item?.san_pham_id, err);
        }
    }
};

// 1. Tạo đơn hàng mới
const taoDonHangMoi = async (req, res) => {
    try {
        const duLieuDonHang = { ...(req.body || {}) };

        const laAdmin = req.user && req.user.vaiTro === 'admin';
        if (!req.user) {
            return res.status(401).json({
                thong_diep: 'Quý khách vui lòng đăng nhập tài khoản trước khi đặt hàng!',
                yeu_cau_dang_nhap: true
            });
        }
        duLieuDonHang.id_nguoi_dung = String(req.user.id || req.user._id);

        // Khách hàng không được tự chọn định danh đơn; Admin có thể giữ mã khi nhập dữ liệu.
        if (!laAdmin || !duLieuDonHang.id) {
            duLieuDonHang.id = `dh-${Date.now()}-${crypto.randomInt(1000, 10000)}`;
        }
        if (!laAdmin || !duLieuDonHang.ma_don_hang) {
            const randomSuffix = crypto.randomInt(1000, 10000);
            duLieuDonHang.ma_don_hang = `LPN-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}${randomSuffix}`;
        }
        if (!duLieuDonHang.ngay_tao) {
            duLieuDonHang.ngay_tao = new Date().toLocaleString('vi-VN');
        }

        // Chuẩn hóa thông tin giao hàng: chỉ nhận chuỗi, cắt độ dài, kiểm tra SĐT Việt Nam
        const ttGoc = (duLieuDonHang.thong_tin_giao_hang && typeof duLieuDonHang.thong_tin_giao_hang === 'object')
            ? duLieuDonHang.thong_tin_giao_hang : {};
        const chuoi = (v, max = 255) => (typeof v === 'string' || typeof v === 'number') ? String(v).trim().slice(0, max) : '';
        const ten = chuoi(ttGoc.ho_ten || ttGoc.ho_va_ten, 100);
        duLieuDonHang.thong_tin_giao_hang = {
            ho_ten: ten,
            ho_va_ten: ten,
            so_dien_thoai: chuoi(ttGoc.so_dien_thoai, 20).replace(/\s+/g, ''),
            email: chuoi(ttGoc.email, 254).toLowerCase() || String(req.user.email || ''),
            dia_chi_chi_tiet: chuoi(ttGoc.dia_chi_chi_tiet),
            tinh_thanh: chuoi(ttGoc.tinh_thanh, 100),
            quan_huyen: chuoi(ttGoc.quan_huyen, 100),
            phuong_xa: chuoi(ttGoc.phuong_xa, 100),
            ghi_chu: chuoi(ttGoc.ghi_chu, 500)
        };
        if (!laAdmin && (!ten || !/^(0|\+84)[0-9]{9}$/.test(duLieuDonHang.thong_tin_giao_hang.so_dien_thoai))) {
            return res.status(400).json({ thong_diep: 'Vui lòng nhập họ tên và số điện thoại nhận hàng hợp lệ (10 số).' });
        }

        if (!laAdmin) {
            const danhSachGuiLen = Array.isArray(duLieuDonHang.danh_sach_san_pham)
                ? duLieuDonHang.danh_sach_san_pham
                : [];
            if (danhSachGuiLen.length === 0 || danhSachGuiLen.length > 50) {
                return res.status(400).json({ thong_diep: 'Danh sách sản phẩm không hợp lệ.' });
            }

            const danhSachDaXacMinh = [];
            let tamTinhServer = 0;
            for (const item of danhSachGuiLen) {
                const rawId = item.san_pham_id || item.san_pham?.id || item.san_pham?._id || item.id_muc;
                const idSanPham = String(rawId || '').trim();
                const dieuKien = [{ id: idSanPham }, { ma_san_pham: idSanPham }, { slug: idSanPham }];
                if (mongoose.Types.ObjectId.isValid(idSanPham)) dieuKien.push({ _id: idSanPham });
                const sanPham = idSanPham ? await SanPham.findOne({ $or: dieuKien }) : null;
                if (!sanPham || !sanPham.con_hang) {
                    return res.status(400).json({ thong_diep: `Sản phẩm ${idSanPham || 'không xác định'} không tồn tại hoặc đã hết hàng.` });
                }

                const soLuong = Math.min(10, Math.max(1, Math.floor(Number(item.so_luong) || 1)));
                if (soLuong > Number(sanPham.so_luong_ton_kho || 0)) {
                    return res.status(400).json({ thong_diep: `Sản phẩm "${sanPham.ten_san_pham}" không đủ tồn kho.` });
                }

                const maTuyChon = String(item.tuy_chon_chon?.ma_tuy_chon || '').trim();
                const tuyChon = maTuyChon
                    ? (sanPham.tuy_chon_phien_ban || []).find((x) => x.ma_tuy_chon === maTuyChon)
                    : null;
                if (maTuyChon && !tuyChon) {
                    return res.status(400).json({ thong_diep: `Tùy chọn của sản phẩm "${sanPham.ten_san_pham}" không hợp lệ.` });
                }

                const donGia = Math.max(0, Number(sanPham.gia_khuyen_mai || sanPham.gia_goc || 0)
                    + Number(tuyChon?.chenh_lech_gia || 0));
                const tongTienMuc = donGia * soLuong;
                tamTinhServer += tongTienMuc;
                danhSachDaXacMinh.push({
                    id_muc: item.id_muc || `${sanPham.id}-${maTuyChon || 'mac-dinh'}`,
                    san_pham_id: sanPham.id,
                    san_pham: {
                        id: sanPham.id,
                        ma_san_pham: sanPham.ma_san_pham,
                        ten_san_pham: sanPham.ten_san_pham,
                        hinh_anh_chinh: sanPham.hinh_anh_chinh
                    },
                    ten_san_pham: sanPham.ten_san_pham,
                    hinh_anh: tuyChon?.hinh_anh || sanPham.hinh_anh_chinh,
                    so_luong: soLuong,
                    gia_tai_thoi_diem_them: donGia,
                    gia_hien_tai: donGia,
                    gia: donGia,
                    tong_tien_muc: tongTienMuc,
                    tuy_chon_chon: tuyChon || null
                });
            }

            let tienGiamServer = 0;
            const maGiamGia = String(duLieuDonHang.ma_giam_gia || '').trim().toUpperCase();
            if (maGiamGia) {
                const voucher = await MaGiamGia.findOne({ ma_code: maGiamGia, kich_hoat: true });
                if (!voucher || tamTinhServer < Number(voucher.don_hang_toi_thieu || 0)) {
                    return res.status(400).json({ thong_diep: 'Mã giảm giá không hợp lệ hoặc đơn hàng chưa đạt giá trị tối thiểu.' });
                }
                tienGiamServer = voucher.loai_giam === 'phan_tram'
                    ? Math.round(tamTinhServer * Number(voucher.gia_tri_giam || 0) / 100)
                    : Number(voucher.gia_tri_giam || 0);
                if (voucher.giam_toi_da > 0) tienGiamServer = Math.min(tienGiamServer, voucher.giam_toi_da);
                tienGiamServer = Math.min(tamTinhServer, Math.max(0, tienGiamServer));
            }

            const hinhThucHopLe = ['tien_mat_cod', 'cod', 'chuyen_khoan_vietqr', 'payos'];
            duLieuDonHang.hinh_thuc_thanh_toan = hinhThucHopLe.includes(duLieuDonHang.hinh_thuc_thanh_toan)
                ? duLieuDonHang.hinh_thuc_thanh_toan
                : 'chuyen_khoan_vietqr';
            duLieuDonHang.danh_sach_san_pham = danhSachDaXacMinh;
            duLieuDonHang.tam_tinh = tamTinhServer;
            duLieuDonHang.tien_giam_gia = tienGiamServer;
            duLieuDonHang.ma_giam_gia = maGiamGia;
            duLieuDonHang.phi_van_chuyen = 0;
            duLieuDonHang.tong_tien_thanh_toan = tamTinhServer - tienGiamServer;
            duLieuDonHang.trang_thai = 'cho_xac_nhan';
            duLieuDonHang.da_thanh_toan = false;
            duLieuDonHang.da_tru_ton_kho = false;
            delete duLieuDonHang.payos_order_code;
            delete duLieuDonHang.noi_dung_chuyen_khoan;
        }

        // Chuẩn hóa trạng thái thanh toán theo enum hợp lệ
        const trangThaiHopLe = ['chua_thanh_toan', 'cho_thanh_toan', 'da_thanh_toan', 'that_bai', 'thanh_toan_khi_nhan_hang'];
        if (!laAdmin || !duLieuDonHang.trang_thai_thanh_toan || !trangThaiHopLe.includes(duLieuDonHang.trang_thai_thanh_toan)) {
            duLieuDonHang.trang_thai_thanh_toan = (duLieuDonHang.hinh_thuc_thanh_toan === 'tien_mat_cod' || duLieuDonHang.hinh_thuc_thanh_toan === 'cod')
                ? 'thanh_toan_khi_nhan_hang'
                : (duLieuDonHang.da_thanh_toan ? 'da_thanh_toan' : 'cho_thanh_toan');
        }

        // Chỉ Admin mới có thể tạo trực tiếp đơn đã giao.
        if (laAdmin && duLieuDonHang.trang_thai === 'da_giao') {
            await capNhatTonKhoTheoDonHang(duLieuDonHang.danh_sach_san_pham, 'tru');
            duLieuDonHang.da_tru_ton_kho = true;
        } else {
            duLieuDonHang.da_tru_ton_kho = false;
        }

        // Tạo đơn hàng mới trong MongoDB
        const donHangMoi = new DonHang(duLieuDonHang);
        const ketQua = await donHangMoi.save();

        console.log(`📦 Tạo đơn hàng mới thành công: ${ketQua.ma_don_hang} | ID User: ${ketQua.id_nguoi_dung} | Hình thức: ${ketQua.hinh_thuc_thanh_toan} | Trạng thái TT: ${ketQua.trang_thai_thanh_toan}`);

        // Tự động gửi email xác nhận đơn hàng kèm hóa đơn chi tiết cho khách
        guiMailXacNhanDonHang(ketQua).catch(err => console.warn('⚠️ Lỗi gửi email xác nhận:', err.message));

        // Tự động bắn thông báo Realtime kèm nút duyệt đơn về Bot Telegram Quản trị viên
        guiThongBaoDonHangTelegram(ketQua).catch(err => console.warn('⚠️ Lỗi gửi thông báo Telegram:', err.message));

        return res.status(201).json(ketQua);
    } catch (loi) {
        console.error('Lỗi tạo đơn hàng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể tạo đơn hàng mới', chi_tiet: loi.message });
    }
};

// 2. Lấy danh sách đơn hàng (Phân quyền bảo mật: Admin xem toàn bộ, Khách hàng chỉ xem của mình)
const layDanhSachDonHang = async (req, res) => {
    try {
        const { trang_thai, id_nguoi_dung, email, sdt } = req.query;
        const filter = {};

        if (typeof trang_thai === 'string' && trang_thai !== 'tat_ca') filter.trang_thai = trang_thai;

        const laAdmin = req.user && req.user.vaiTro === 'admin';

        if (laAdmin) {
            // Admin có quyền xem toàn bộ đơn hàng trong MongoDB hoặc lọc theo tài khoản nếu truyền
            if (id_nguoi_dung) {
                const conditions = [{ id_nguoi_dung: id_nguoi_dung }];
                if (email && email.trim()) {
                    conditions.push({ 'thong_tin_giao_hang.email': email.trim().toLowerCase() });
                }
                if (sdt && sdt.trim()) {
                    conditions.push({ 'thong_tin_giao_hang.so_dien_thoai': sdt.trim() });
                }
                filter.$or = conditions;
            }
        } else if (req.user) {
            // Khách hàng đã đăng nhập: CHỈ ĐƯỢC XEM ĐƠN HÀNG CỦA CHÍNH TÀI KHOẢN MÌNH
            filter.$or = dieuKienDonCuaToi(req.user);
        } else {
            // Khách chưa đăng nhập / không có token:
            // Chỉ tra cứu nếu có truyền rõ id_nguoi_dung hoặc email hoặc sdt
            if (id_nguoi_dung || email || sdt) {
                const conditions = [];
                if (id_nguoi_dung) conditions.push({ id_nguoi_dung: id_nguoi_dung });
                if (email && email.trim()) conditions.push({ 'thong_tin_giao_hang.email': email.trim().toLowerCase() });
                if (sdt && sdt.trim()) conditions.push({ 'thong_tin_giao_hang.so_dien_thoai': sdt.trim() });
                filter.$or = conditions;
            } else {
                // TUYỆT ĐỐI KHÔNG TRẢ VỀ TẤT CẢ ĐƠN CHO KHÁCH VÃNG LAI KHÔNG XÁC THỰC
                return res.status(200).json([]);
            }
        }

        const danhSachDonHang = await DonHang.find(filter).sort({ createdAt: -1 });
        return res.status(200).json(danhSachDonHang);
    } catch (loi) {
        console.error('Lỗi lấy danh sách đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi máy chủ khi lấy danh sách đơn hàng', chi_tiet: loi.message });
    }
};

// 3. Tra cứu thông tin đơn hàng theo ID, Mã đơn, OrderCode PayOS hoặc SĐT
const layDonHangTheoIdHoacMa = async (req, res) => {
    try {
        const { id } = req.params;
        const cleanId = String(id || '').trim();
        const sdtXacMinh = chiGiuSo(req.query.sdt || req.query.so_dien_thoai || '');
        const cleanIdRegex = cleanId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const queryList = [
            { id: cleanId },
            { ma_don_hang: { $regex: `^${cleanIdRegex}$`, $options: 'i' } }
        ];

        // Nếu là số: tìm theo payos_order_code hoặc mã đơn chứa số
        if (!isNaN(Number(cleanId))) {
            queryList.push({ payos_order_code: Number(cleanId) });
        }

        // Nếu là định dạng SĐT Việt Nam
        if (/^[0-9]{9,11}$/.test(cleanId)) {
            queryList.push({ 'thong_tin_giao_hang.so_dien_thoai': cleanId });
        }

        // Nếu là ObjectId hợp lệ của MongoDB
        if (cleanId.match(/^[0-9a-fA-F]{24}$/)) {
            queryList.push({ _id: cleanId });
        }

        let donHang = await DonHang.findOne({ $or: queryList });

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng với mã/id: ${cleanId}` });
        }

        if (laChuDonHang(req, donHang)) {
            return res.status(200).json(donHang);
        }

        if (req.user) {
            return res.status(403).json({
                thong_diep: 'Bạn chỉ được xem đơn hàng thuộc tài khoản của mình.'
            });
        }

        const maDonDuocNhap = String(donHang.ma_don_hang || '').toLowerCase() === cleanId.toLowerCase()
            || String(donHang.id || '').toLowerCase() === cleanId.toLowerCase();
        const sdtKhach = chiGiuSo(donHang.thong_tin_giao_hang?.so_dien_thoai || '');

        if (!maDonDuocNhap || !sdtXacMinh || sdtXacMinh !== sdtKhach) {
            return res.status(403).json({
                thong_diep: 'Vui lòng nhập đúng mã đơn hàng và số điện thoại nhận hàng để tra cứu.',
                yeu_cau_xac_minh_sdt: true
            });
        }

        return res.status(200).json(anThongTinDonHangCongKhai(donHang));
    } catch (loi) {
        console.error('Lỗi tra cứu đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Lỗi tra cứu đơn hàng', chi_tiet: loi.message });
    }
};

// 4. Cập nhật trạng thái hoặc thông tin đơn hàng (Admin hoặc chính chủ đơn)
const capNhatTrangThaiDonHang = async (req, res) => {
    try {
        const { id } = req.params;
        const duLieuCapNhat = { ...(req.body || {}) };
        // Các trường do hệ thống quản lý, client (kể cả Admin) không được ghi đè trực tiếp
        ['_id', 'id', 'ma_don_hang', 'id_nguoi_dung', 'da_tru_ton_kho', 'createdAt', 'updatedAt'].forEach(k => delete duLieuCapNhat[k]);

        // 1. Tìm đơn hàng hiện tại trong MongoDB trước khi cập nhật
        let donHangHienTai = await DonHang.findOne({
            $or: [{ id: id }, { ma_don_hang: id }]
        });
        if (!donHangHienTai && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHangHienTai = await DonHang.findById(id);
        }

        if (!donHangHienTai) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng: ${id}` });
        }

        const laAdmin = req.user && req.user.vaiTro === 'admin';
        const laChuDon = laChuSoHuuDon(req.user, donHangHienTai);

        if (!laAdmin && !laChuDon) {
            return res.status(403).json({
                thong_diep: 'Truy cập bị từ chối: Bạn không có quyền cập nhật đơn hàng này!'
            });
        }

        // Nếu là khách hàng (chủ đơn nhưng không phải admin), chỉ cho phép hủy đơn khi còn chờ xác nhận.
        // Trạng thái thanh toán chỉ được cập nhật bởi Admin hoặc webhook/PayOS backend.
        if (!laAdmin && laChuDon) {
            const filteredUpdate = {};

            if (duLieuCapNhat.trang_thai === 'da_huy' && donHangHienTai.trang_thai === 'cho_xac_nhan') {
                filteredUpdate.trang_thai = 'da_huy';
            }

            if (Object.keys(filteredUpdate).length === 0) {
                return res.status(403).json({
                    thong_diep: 'Khách hàng chỉ được hủy đơn khi đơn còn ở trạng thái chờ xác nhận. Trạng thái thanh toán do hệ thống hoặc Admin cập nhật.'
                });
            }

            const donHang = await DonHang.findByIdAndUpdate(
                donHangHienTai._id,
                { $set: filteredUpdate },
                { new: true, runValidators: true }
            );
            return res.status(200).json(donHang);
        }

        // Admin: Cho phép cập nhật toàn quyền, bao gồm trạng thái giao hàng và tồn kho
        const trangThaiMoi = duLieuCapNhat.trang_thai;
        const danhSachSp = (Array.isArray(duLieuCapNhat.danh_sach_san_pham) && duLieuCapNhat.danh_sach_san_pham.length > 0)
            ? duLieuCapNhat.danh_sach_san_pham
            : donHangHienTai.danh_sach_san_pham || [];

        // 2. Logic trừ / hoàn kho chuẩn xác 2 chiều theo trạng thái (thao tác nguyên tử, chống trừ kho 2 lần)
        if (trangThaiMoi) {
            // Case A: Đổi sang "da_giao" và đơn chưa từng trừ tồn kho
            if (trangThaiMoi === 'da_giao') {
                const daGianhCo = await DonHang.findOneAndUpdate(
                    { _id: donHangHienTai._id, da_tru_ton_kho: { $ne: true } },
                    { $set: { da_tru_ton_kho: true } }
                );
                if (daGianhCo) {
                    await capNhatTonKhoTheoDonHang(danhSachSp, 'tru');
                }
                // Giao thành công nghĩa là đã thu tiền (kể cả COD) → đồng bộ cả 2 trường thanh toán
                if (duLieuCapNhat.da_thanh_toan === undefined) {
                    duLieuCapNhat.da_thanh_toan = true;
                }
            }
            // Case B: Đơn đã trừ tồn kho nhưng trạng thái mới không còn là "da_giao" → hoàn kho
            else {
                const daGianhCo = await DonHang.findOneAndUpdate(
                    { _id: donHangHienTai._id, da_tru_ton_kho: true },
                    { $set: { da_tru_ton_kho: false } }
                );
                if (daGianhCo) {
                    await capNhatTonKhoTheoDonHang(danhSachSp, 'hoan');
                }
            }
        }

        // Đồng bộ trạng thái thanh toán: tránh dữ liệu mâu thuẫn kiểu da_thanh_toan = true nhưng "cho_thanh_toan"
        if (duLieuCapNhat.da_thanh_toan === true && !duLieuCapNhat.trang_thai_thanh_toan) {
            duLieuCapNhat.trang_thai_thanh_toan = 'da_thanh_toan';
        }

        // 3. Cập nhật đơn hàng trong MongoDB
        const donHang = await DonHang.findByIdAndUpdate(
            donHangHienTai._id,
            { $set: duLieuCapNhat },
            { new: true, runValidators: true }
        );

        return res.status(200).json(donHang);
    } catch (loi) {
        console.error('Lỗi cập nhật đơn hàng:', loi);
        return res.status(400).json({ thong_diep: 'Không thể cập nhật đơn hàng', chi_tiet: loi.message });
    }
};

// 5. Xóa đơn hàng (dành cho Admin khi cần)
const xoaDonHang = async (req, res) => {
    try {
        const { id } = req.params;

        let donHang = await DonHang.findOne({
            $or: [{ id: id }, { ma_don_hang: id }]
        });

        if (!donHang && id.match(/^[0-9a-fA-F]{24}$/)) {
            donHang = await DonHang.findById(id);
        }

        if (!donHang) {
            return res.status(404).json({ thong_diep: `Không tìm thấy đơn hàng để xóa: ${id}` });
        }

        // Nếu đơn hàng này đã từng trừ kho thì hoàn trả lại kho trước khi xóa (giành cờ nguyên tử)
        const canHoanKho = await DonHang.findOneAndUpdate(
            { _id: donHang._id, da_tru_ton_kho: true },
            { $set: { da_tru_ton_kho: false } }
        );
        if (canHoanKho) {
            await capNhatTonKhoTheoDonHang(donHang.danh_sach_san_pham, 'hoan');
        }

        await DonHang.findByIdAndDelete(donHang._id);

        return res.status(200).json({ thong_diep: 'Đã xóa đơn hàng thành công', ma_don_hang: donHang.ma_don_hang });
    } catch (loi) {
        console.error('Lỗi xóa đơn hàng:', loi);
        return res.status(500).json({ thong_diep: 'Không thể xóa đơn hàng', chi_tiet: loi.message });
    }
};

module.exports = {
    taoDonHangMoi,
    layDanhSachDonHang,
    layDonHangTheoIdHoacMa,
    capNhatTrangThaiDonHang,
    xoaDonHang
};
