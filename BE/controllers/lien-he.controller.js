const LienHe = require('../models/lien-he.model');

/**
 * Hàm sinh mã phiếu yêu cầu liên hệ định dạng: LH-YYMMDD-XXXX
 */
const taoMaYeuCauLienHe = () => {
    const bayGio = new Date();
    const nam = bayGio.getFullYear().toString().slice(-2);
    const thang = (bayGio.getMonth() + 1).toString().padStart(2, '0');
    const ngay = bayGio.getDate().toString().padStart(2, '0');
    const soNgauNhien = Math.floor(1000 + Math.random() * 9000);
    return `LH-${nam}${thang}${ngay}-${soNgauNhien}`;
};

/**
 * Controller xử lý gửi yêu cầu liên hệ / tư vấn từ khách hàng
 * POST /api/lien-he
 */
exports.guiYeuCauLienHe = async (req, res) => {
    try {
        const { ho_ten, so_dien_thoai, email, chu_de, noi_dung } = req.body;

        // 1. Kiểm tra tính hợp lệ dữ liệu đầu vào
        if (!ho_ten || !ho_ten.trim()) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Vui lòng cung cấp họ và tên của bạn'
            });
        }

        if (!so_dien_thoai || !so_dien_thoai.trim()) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Vui lòng cung cấp số điện thoại liên hệ'
            });
        }

        // Định dạng số điện thoại Việt Nam cơ bản
        const sdtChuanHoa = so_dien_thoai.trim().replace(/\s+/g, '');
        const regexSDT = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!regexSDT.test(sdtChuanHoa)) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Số điện thoại không hợp lệ (cần đủ 10 số, đầu số 03, 05, 07, 08, 09)'
            });
        }

        if (!noi_dung || !noi_dung.trim()) {
            return res.status(400).json({
                thanh_cong: false,
                thong_diep: 'Vui lòng nhập nội dung cần tư vấn hoặc hỗ trợ'
            });
        }

        // 2. Tạo mã yêu cầu duy nhất
        let maYeuCau = taoMaYeuCauLienHe();
        let daTonTai = await LienHe.findOne({ ma_yeu_cau: maYeuCau });
        while (daTonTai) {
            maYeuCau = taoMaYeuCauLienHe();
            daTonTai = await LienHe.findOne({ ma_yeu_cau: maYeuCau });
        }

        // 3. Tạo bản ghi mới trong MongoDB
        const lienHeMoi = await LienHe.create({
            ma_yeu_cau: maYeuCau,
            ho_ten: ho_ten.trim(),
            so_dien_thoai: sdtChuanHoa,
            email: (email || '').trim().toLowerCase(),
            chu_de: chu_de || 'Tư vấn mua Laptop Gaming & AI PC',
            noi_dung: noi_dung.trim(),
            trang_thai: 'chua_xu_ly',
            nguon_tiep_nhan: 'website_lien_he'
        });

        console.log(`[LIÊN HỆ] Khách hàng ${lienHeMoi.ho_ten} (${lienHeMoi.so_dien_thoai}) đã gửi phiếu #${lienHeMoi.ma_yeu_cau}`);

        // 4. Phản hồi thành công
        return res.status(201).json({
            thanh_cong: true,
            thong_diep: 'TNTP LAPTOP đã tiếp nhận thông tin! Chuyên viên sẽ gọi điện hỗ trợ bạn trong ít phút.',
            du_lieu: {
                ma_yeu_cau: lienHeMoi.ma_yeu_cau,
                ho_ten: lienHeMoi.ho_ten,
                so_dien_thoai: lienHeMoi.so_dien_thoai,
                chu_de: lienHeMoi.chu_de,
                ngay_tao: lienHeMoi.ngay_tao
            }
        });
    } catch (loi) {
        console.error('[LỖI LIÊN HỆ]:', loi);
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Đã xảy ra lỗi khi lưu thông tin liên hệ. Vui lòng thử lại hoặc gọi Hotline 1900.8946'
        });
    }
};

/**
 * Lấy danh sách yêu cầu liên hệ (Dành cho Quản trị viên CSKH)
 * GET /api/lien-he
 */
exports.layDanhSachLienHe = async (req, res) => {
    try {
        const { trang = 1, gioi_han = 20, trang_thai } = req.query;
        const boLoc = {};
        if (trang_thai) {
            boLoc.trang_thai = trang_thai;
        }

        const soTrang = Math.max(1, parseInt(trang, 10));
        const soLuong = Math.max(1, parseInt(gioi_han, 10));
        const boQua = (soTrang - 1) * soLuong;

        const [danhSach, tongSo] = await Promise.all([
            LienHe.find(boLoc).sort({ ngay_tao: -1 }).skip(boQua).limit(soLuong).lean(),
            LienHe.countDocuments(boLoc)
        ]);

        return res.status(200).json({
            thanh_cong: true,
            du_lieu: danhSach,
            phan_trang: {
                tong_so: tongSo,
                trang_hien_tai: soTrang,
                tong_so_trang: Math.ceil(tongSo / soLuong)
            }
        });
    } catch (loi) {
        console.error('[LỖI LẤY DANH SÁCH LIÊN HỆ]:', loi);
        return res.status(500).json({
            thanh_cong: false,
            thong_diep: 'Không thể tải danh sách liên hệ'
        });
    }
};
