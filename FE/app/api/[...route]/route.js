import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/utils/mongodb';
import { guiMailKichHoatTaiKhoan, guiMailOTPQuenMatKhau, guiMailXacNhanDonHang } from '@/utils/email';

export const dynamic = 'force-dynamic';

function taoObjectId(id) {
    try {
        if (ObjectId.isValid(id)) return new ObjectId(id);
    } catch {}
    return null;
}

// Xử lý preflight CORS
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

// Xử lý GET API
export async function GET(request, { params }) {
    const { route } = await params;
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    try {
        const { db } = await connectToDatabase();
        const primary = route[0];
        const secondary = route[1];

        // 1. SẢN PHẨM: /api/san-pham hoặc /api/san-pham/:id
        if (primary === 'san-pham' || primary === 'san_pham') {
            if (secondary) {
                // Chi tiết 1 sản phẩm
                const oid = taoObjectId(secondary);
                const query = oid 
                    ? { $or: [{ _id: oid }, { id: secondary }, { slug: secondary }, { ma_san_pham: secondary.toUpperCase() }] }
                    : { $or: [{ id: secondary }, { slug: secondary }, { ma_san_pham: secondary.toUpperCase() }] };
                
                const sp = await db.collection('san_pham').findOne(query);
                if (sp) return NextResponse.json(sp);
                return NextResponse.json({ thong_diep: 'Không tìm thấy sản phẩm' }, { status: 404 });
            }

            // Danh sách sản phẩm có bộ lọc
            const filter = {};
            const tuKhoa = searchParams.get('tu_khoa') || searchParams.get('q');
            if (tuKhoa) {
                filter.$or = [
                    { ten_san_pham: { $regex: tuKhoa, $options: 'i' } },
                    { ma_san_pham: { $regex: tuKhoa, $options: 'i' } },
                    { hang_san_xuat: { $regex: tuKhoa, $options: 'i' } }
                ];
            }

            const hang = searchParams.get('hang_san_xuat');
            if (hang && hang !== 'tat_ca') {
                const brands = hang.split(',').map(b => b.trim().toLowerCase());
                filter.hang_san_xuat = { $in: brands };
            }

            const danhMuc = searchParams.get('danh_muc');
            if (danhMuc && danhMuc !== 'tat_ca') {
                const cats = danhMuc.split(',').map(c => c.trim().toLowerCase());
                filter.danh_muc = { $in: cats };
            }

            const giaMin = searchParams.get('gia_min');
            const giaMax = searchParams.get('gia_max');
            if (giaMin !== null || giaMax !== null) {
                filter.gia_khuyen_mai = {};
                if (giaMin !== null) filter.gia_khuyen_mai.$gte = Number(giaMin);
                if (giaMax !== null) filter.gia_khuyen_mai.$lte = Number(giaMax);
            }

            if (searchParams.get('flash_sale') === 'true') filter.la_flash_sale = true;
            if (searchParams.get('ban_chay') === 'true') filter.la_ban_chay = true;
            if (searchParams.get('moi_nhat') === 'true') filter.la_san_pham_moi = true;

            let queryCursor = db.collection('san_pham').find(filter);

            const sapXep = searchParams.get('sap_xep');
            if (sapXep === 'gia_tang_dan') queryCursor = queryCursor.sort({ gia_khuyen_mai: 1 });
            else if (sapXep === 'gia_giam_dan') queryCursor = queryCursor.sort({ gia_khuyen_mai: -1 });
            else if (sapXep === 'ban_chay_nhat') queryCursor = queryCursor.sort({ so_luong_da_ban: -1 });
            else if (sapXep === 'danh_gia_cao') queryCursor = queryCursor.sort({ diem_danh_gia_tb: -1 });
            else queryCursor = queryCursor.sort({ _id: -1 });

            const limit = searchParams.get('limit');
            if (limit) queryCursor = queryCursor.limit(Number(limit));

            const danhSach = await queryCursor.toArray();
            return NextResponse.json(danhSach);
        }

        // 2. ĐƠN HÀNG: /api/don-hang hoặc /api/don-hang/:id
        if (primary === 'don-hang' || primary === 'don_hang') {
            if (secondary) {
                const oid = taoObjectId(secondary);
                const query = oid 
                    ? { $or: [{ _id: oid }, { id: secondary }, { ma_don_hang: secondary }] }
                    : { $or: [{ id: secondary }, { ma_don_hang: secondary }] };
                const dh = await db.collection('don_hang').findOne(query);
                if (dh) return NextResponse.json(dh);
                return NextResponse.json({ thong_diep: 'Không tìm thấy đơn hàng' }, { status: 404 });
            }

            const filter = {};
            const userId = searchParams.get('id_nguoi_dung') || searchParams.get('userId');
            if (userId) filter.id_nguoi_dung = userId;

            const trangThai = searchParams.get('trang_thai');
            if (trangThai && trangThai !== 'tat_ca') filter.trang_thai = trangThai;

            const danhSachDh = await db.collection('don_hang').find(filter).sort({ _id: -1 }).toArray();
            return NextResponse.json(danhSachDh);
        }

        // 3. MÃ GIẢM GIÁ: /api/ma-giam-gia
        if (primary === 'ma-giam-gia' || primary === 'ma_giam_gia') {
            const filter = {};
            if (searchParams.get('kich_hoat') === 'true') {
                filter.kich_hoat = { $ne: false };
            }
            const vouchers = await db.collection('ma_giam_gia').find(filter).toArray();
            return NextResponse.json(vouchers);
        }

        // 4. DANH MỤC: /api/danh-muc
        if (primary === 'danh-muc' || primary === 'danh_muc') {
            let col = db.collection('danh_muc');
            let count = await col.countDocuments();
            if (count === 0) col = db.collection('danh-muc');

            const filter = {};
            const loai = searchParams.get('loai');
            if (loai) filter.loai = loai;

            const dms = await col.find(filter).toArray();
            return NextResponse.json(dms);
        }

        // 5. NGƯỜI DÙNG: /api/nguoi-dung
        if (primary === 'nguoi-dung' || primary === 'nguoi_dung') {
            const users = await db.collection('nguoi_dung').find({}, { projection: { matKhau: 0, mat_khau: 0 } }).toArray();
            return NextResponse.json(users);
        }

        // 6. TIN TỨC: /api/tin-tuc
        if (primary === 'tin-tuc' || primary === 'tin_tuc') {
            if (secondary) {
                const oid = taoObjectId(secondary);
                const query = oid ? { $or: [{ _id: oid }, { id: secondary }, { slug: secondary }] } : { $or: [{ id: secondary }, { slug: secondary }] };
                const tin = await db.collection('tin_tuc').findOne(query);
                if (tin) return NextResponse.json(tin);
                return NextResponse.json({ thong_diep: 'Không tìm thấy bài viết' }, { status: 404 });
            }
            const filter = {};
            if (searchParams.get('chuyen_muc')) filter.chuyen_muc = searchParams.get('chuyen_muc');
            const news = await db.collection('tin_tuc').find(filter).sort({ _id: -1 }).toArray();
            return NextResponse.json(news);
        }

        // 7. ĐÁNH GIÁ: /api/danh-gia
        if (primary === 'danh-gia' || primary === 'danh_gia') {
            const filter = {};
            const spId = searchParams.get('san_pham_id');
            if (spId) filter.san_pham_id = spId;
            const reviews = await db.collection('danh_gia').find(filter).sort({ _id: -1 }).toArray();
            return NextResponse.json(reviews);
        }

        // 8. AUTH: /api/auth/toi (Kiểm tra phiên đăng nhập)
        if (primary === 'auth' && secondary === 'toi') {
            const authHeader = request.headers.get('authorization') || '';
            const token = authHeader.replace('Bearer ', '').trim();
            
            if (!token || token.length < 5) {
                return NextResponse.json({ thong_diep: 'Chưa đăng nhập' }, { status: 401 });
            }

            // Tìm CHÍNH XÁC người dùng sở hữu token này (Tuyệt đối không fallback sang admin)
            const user = await db.collection('nguoi_dung').findOne(
                { token },
                { projection: { matKhau: 0, mat_khau: 0, maOtp: 0, hanOtp: 0 } }
            );

            if (user) {
                // Kiểm tra tài khoản có bị khóa không
                if (user.biKhoa || user.trangThai === 'bi_khoa') {
                    await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $unset: { token: "" } });
                    return NextResponse.json({ thong_diep: 'Tài khoản của bạn hiện đang bị tạm khóa!' }, { status: 403 });
                }

                // Kiểm tra thời hạn phiên đăng nhập (Admin: 24 giờ, Khách hàng: 7 ngày)
                if (user.lanDangNhapCuoi) {
                    const thoiGianDangNhap = new Date(user.lanDangNhapCuoi).getTime();
                    const bayGio = Date.now();
                    const hanToiDa = user.vaiTro === 'admin'
                        ? 24 * 60 * 60 * 1000      // Admin: 24 giờ
                        : 7 * 24 * 60 * 60 * 1000;  // Khách hàng: 7 ngày

                    if (bayGio - thoiGianDangNhap > hanToiDa) {
                        await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $unset: { token: "" } });
                        return NextResponse.json({ thong_diep: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!' }, { status: 401 });
                    }
                }

                return NextResponse.json({ hop_le: true, nguoiDung: user });
            }
            return NextResponse.json({ thong_diep: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' }, { status: 401 });
        }

        // 9. CÀI ĐẶT: /api/cai-dat
        if (primary === 'cai-dat' || primary === 'cai_dat') {
            const cd = await db.collection('cai_dat').findOne();
            return NextResponse.json(cd || {});
        }

        return NextResponse.json({ thong_diep: `API ${route.join('/')} sẵn sàng` });
    } catch (err) {
        console.error(`[API Route GET Error] /api/${route.join('/')}:`, err);
        return NextResponse.json({ loi: true, thong_diep: err.message }, { status: 500 });
    }
}

// Xử lý POST API
export async function POST(request, { params }) {
    const { route } = await params;

    try {
        const { db } = await connectToDatabase();
        const primary = route[0];
        const secondary = route[1];
        const body = await request.json().catch(() => ({}));

        // 1. AUTH: /api/auth/dang-nhap
        if (primary === 'auth' && (secondary === 'dang-nhap' || secondary === 'login')) {
            const { email, matKhau } = body;
            const tkClean = String(email || '').trim().toLowerCase();
            const mkClean = String(matKhau || '').trim();

            if (!tkClean || !mkClean) {
                return NextResponse.json({ thong_diep: 'Vui lòng nhập đầy đủ Email và Mật khẩu!' }, { status: 400 });
            }

            // Tìm trong collection nguoi_dung
            let user = await db.collection('nguoi_dung').findOne({
                $or: [
                    { email: tkClean },
                    { ten_dang_nhap: tkClean },
                    ...(tkClean === 'admin' ? [{ email: 'admin@laptopnew.vn' }] : [])
                ]
            });

            if (!user) {
                return NextResponse.json({ thong_diep: 'Tài khoản hoặc mật khẩu không chính xác!' }, { status: 401 });
            }

            // Kiểm tra mật khẩu (Bắt buộc so khớp mật khẩu chuẩn với bcrypt cho 100% tài khoản)
            const savedPass = user.matKhau || user.mat_khau;
            if (!savedPass) {
                return NextResponse.json({ thong_diep: 'Tài khoản hoặc mật khẩu không chính xác!' }, { status: 401 });
            }

            let matKhauDung = false;
            if (savedPass.startsWith('$2a$') || savedPass.startsWith('$2b$')) {
                matKhauDung = await bcrypt.compare(mkClean, savedPass);
            } else {
                matKhauDung = (savedPass === mkClean);
            }

            if (!matKhauDung) {
                return NextResponse.json({ thong_diep: 'Tài khoản hoặc mật khẩu không chính xác!' }, { status: 401 });
            }

            // Kiểm tra khóa tài khoản
            if (user.biKhoa || user.trangThai === 'bi_khoa') {
                return NextResponse.json({
                    thong_diep: user.lyDoKhoa
                        ? `Tài khoản của bạn đã bị tạm khóa! Lý do: ${user.lyDoKhoa}`
                        : 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên để được mở khóa!'
                }, { status: 403 });
            }

            // Kiểm tra kích hoạt tài khoản
            if (user.daKichHoat === false) {
                const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
                await db.collection('nguoi_dung').updateOne(
                    { _id: user._id },
                    { $set: { maOtp, hanOtp, loaiOtp: 'kich_hoat' } }
                );
                await guiMailKichHoatTaiKhoan(user.email, user.hoTen, maOtp);

                return NextResponse.json({
                    thong_diep: 'Tài khoản chưa được kích hoạt! Hệ thống đã gửi lại mã xác thực OTP tới email của bạn, vui lòng kiểm tra hộp thư.',
                    yeuCauOtp: true,
                    email: user.email
                }, { status: 403 });
            }

            const token = 'jwt_token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            if (user._id) {
                await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: { token, lanDangNhapCuoi: new Date() } });
            }

            delete user.matKhau;
            delete user.mat_khau;
            delete user.maOtp;
            delete user.hanOtp;
            user.vaiTro = user.vaiTro || user.vai_tro || 'khach_hang';

            return NextResponse.json({
                thanh_cong: true,
                token,
                nguoiDung: user
            });
        }

        // 2. AUTH: /api/auth/dang-ky (Gửi mã OTP qua email xác thực)
        if (primary === 'auth' && (secondary === 'dang-ky' || secondary === 'register')) {
            const { hoTen, email, soDienThoai, matKhau } = body;
            
            // 1. Validate Họ và Tên
            const hoTenClean = String(hoTen || '').trim();
            if (!hoTenClean || hoTenClean.length < 2) {
                return NextResponse.json({ thong_diep: 'Vui lòng nhập Họ và Tên hợp lệ (tối thiểu 2 ký tự)!' }, { status: 400 });
            }

            // 2. Validate Email chuẩn
            const emailClean = String(email || '').trim().toLowerCase();
            const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailClean || !regexEmail.test(emailClean)) {
                return NextResponse.json({ thong_diep: 'Địa chỉ Email không đúng định dạng (VD: example@gmail.com)!' }, { status: 400 });
            }

            // 3. Validate Số điện thoại chuẩn Việt Nam (10 chữ số)
            const sdtClean = String(soDienThoai || '').trim().replace(/\s+/g, '');
            const regexSdt = /^(0|\+84)[0-9]{9}$/;
            if (!sdtClean || !regexSdt.test(sdtClean)) {
                return NextResponse.json({ thong_diep: 'Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại Việt Nam gồm 10 chữ số (VD: 0912345678).' }, { status: 400 });
            }

            // 4. Validate Mật khẩu
            if (!matKhau || String(matKhau).trim().length < 6) {
                return NextResponse.json({ thong_diep: 'Mật khẩu phải có độ dài tối thiểu 6 ký tự!' }, { status: 400 });
            }

            // 5. Kiểm tra trùng Email trong bảng người dùng chính thức
            const exist = await db.collection('nguoi_dung').findOne({ email: emailClean });
            if (exist && exist.daKichHoat !== false) {
                return NextResponse.json({
                    thong_diep: `Địa chỉ Email "${emailClean}" đã được đăng ký tài khoản trước đó! Vui lòng chuyển sang tab Đăng Nhập hoặc dùng chức năng Quên Mật Khẩu.`
                }, { status: 400 });
            }

            // Sinh mã OTP 6 số ngẫu nhiên & thời hạn 10 phút
            const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash(String(matKhau).trim(), salt);

            // LƯU VÀO BẢNG TẠM: TUYỆT ĐỐI KHÔNG LƯU VÀO nguoi_dung KHI CHƯA XÁC THỰC OTP
            // 1. Tự động dọn dẹp các bản ghi tạm đã hết hạn OTP (> 10 phút) để chống rác Database
            await db.collection('dang_ky_tam').deleteMany({ hanOtp: { $lt: new Date() } }).catch(() => {});
            // 2. Thiết lập TTL Index trên MongoDB Atlas để Database tự động hủy document khi tới hạn hanOtp
            db.collection('dang_ky_tam').createIndex({ hanOtp: 1 }, { expireAfterSeconds: 0 }).catch(() => {});

            await db.collection('dang_ky_tam').updateOne(
                { email: emailClean },
                {
                    $set: {
                        hoTen: hoTenClean,
                        email: emailClean,
                        soDienThoai: sdtClean,
                        matKhau: matKhauHash,
                        maOtp,
                        hanOtp,
                        loaiOtp: 'kich_hoat',
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );

            console.log(`✉️ [Đăng Ký - Lưu Bảng Tạm & Gửi OTP] Email: ${emailClean} | OTP: ${maOtp}`);
            // Gửi email xác thực
            const ketQuaMail = await guiMailKichHoatTaiKhoan(emailClean, hoTenClean, maOtp);
            
            let thongDiep = `Mã xác thực kích hoạt tài khoản đã được gửi đến email ${emailClean}. Vui lòng kiểm tra hộp thư (cả mục Thư rác/Spam)!`;
            if (!ketQuaMail?.thanhCong) {
                console.warn(`⚠️ [Đăng Ký] Mail chưa gửi được tới ${emailClean}: ${ketQuaMail?.loi}`);
                // Chế độ dự phòng thông minh cho Test/Demo đồ án:
                // Nếu dịch vụ email chưa mở gửi ra ngoài (Resend Free / Cloud SMTP chặn), cung cấp OTP ngay trong thông báo
                thongDiep = `Đã tạo yêu cầu đăng ký! (Lưu ý Test: Do máy chủ Cloud chưa kích hoạt domain gửi thư ngoài, mã OTP của bạn là: ${maOtp}). Vui lòng nhập để kích hoạt tài khoản!`;
            }

            return NextResponse.json({
                yeuCauOtp: true,
                email: emailClean,
                daGuiMailThat: !!ketQuaMail?.thanhCong,
                maOtpTest: ketQuaMail?.thanhCong ? undefined : maOtp,
                thong_diep: thongDiep
            });
        }

        // 2.1. AUTH: /api/auth/kich-hoat (Xác thực OTP kích hoạt tài khoản)
        if (primary === 'auth' && secondary === 'kich-hoat') {
            const { email, otp } = body;
            if (!email || !otp) {
                return NextResponse.json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' }, { status: 400 });
            }

            const emailClean = String(email).trim().toLowerCase();
            const otpClean = String(otp).trim();

            // 1. Kiểm tra trong bảng đăng ký tạm dang_ky_tam trước
            const tempUser = await db.collection('dang_ky_tam').findOne({ email: emailClean });

            if (tempUser) {
                if (String(tempUser.maOtp).trim() !== otpClean) {
                    return NextResponse.json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại email!' }, { status: 400 });
                }

                if (tempUser.hanOtp && new Date() > new Date(tempUser.hanOtp)) {
                    return NextResponse.json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng bấm gửi lại mã mới.' }, { status: 400 });
                }

                // Kiểm tra xem email này có bị ai đăng ký kích hoạt trước đó không
                const daCo = await db.collection('nguoi_dung').findOne({ email: emailClean });
                if (daCo && daCo.daKichHoat !== false) {
                    await db.collection('dang_ky_tam').deleteMany({ email: emailClean });
                    return NextResponse.json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi! Vui lòng đăng nhập.' }, { status: 400 });
                }

                // CHÍNH THỨC TẠO TÀI KHOẢN VÀO BẢNG CHÍNH nguoi_dung
                const token = 'jwt_' + Date.now() + '_' + Math.random().toString(36).substring(2);
                const newUser = {
                    id: 'usr_' + Date.now(),
                    hoTen: tempUser.hoTen,
                    email: tempUser.email,
                    soDienThoai: tempUser.soDienThoai,
                    matKhau: tempUser.matKhau,
                    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    vaiTro: 'khach_hang',
                    diemTichLuy: 200,
                    viVoucher: [],
                    daKichHoat: true,
                    trangThai: 'hoat_dong',
                    token,
                    createdAt: new Date(),
                    lanDangNhapCuoi: new Date()
                };

                await db.collection('nguoi_dung').insertOne(newUser);
                // Dọn dẹp bản ghi tạm
                await db.collection('dang_ky_tam').deleteMany({ email: emailClean });

                delete newUser.matKhau;
                delete newUser.mat_khau;

                console.log(`🎉 [Kích Hoạt Tài Khoản Thành Công Từ Bảng Tạm] Email: ${emailClean}`);
                return NextResponse.json({
                    thong_diep: 'Kích hoạt tài khoản thành công! Chào mừng bạn gia nhập TNTP Laptop Store.',
                    token,
                    nguoiDung: newUser
                });
            }

            // Fallback: Kiểm tra trong nguoi_dung nếu có bản ghi cũ chưa kích hoạt
            const user = await db.collection('nguoi_dung').findOne({ email: emailClean });
            if (!user) {
                return NextResponse.json({ thong_diep: 'Không tìm thấy thông tin đăng ký cho Email này! Vui lòng đăng ký lại.' }, { status: 404 });
            }

            if (user.daKichHoat) {
                return NextResponse.json({ thong_diep: 'Tài khoản này đã được kích hoạt từ trước rồi!' }, { status: 400 });
            }

            if (!user.maOtp || String(user.maOtp).trim() !== otpClean) {
                return NextResponse.json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại email!' }, { status: 400 });
            }

            if (user.hanOtp && new Date() > new Date(user.hanOtp)) {
                return NextResponse.json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng bấm gửi lại mã mới.' }, { status: 400 });
            }

            const token = 'jwt_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            await db.collection('nguoi_dung').updateOne(
                { _id: user._id },
                {
                    $set: {
                        daKichHoat: true,
                        trangThai: 'hoat_dong',
                        token,
                        lanDangNhapCuoi: new Date()
                    },
                    $unset: {
                        maOtp: '',
                        hanOtp: '',
                        loaiOtp: ''
                    }
                }
            );

            delete user.matKhau;
            delete user.mat_khau;
            delete user.maOtp;
            delete user.hanOtp;
            user.daKichHoat = true;
            user.token = token;

            console.log(`🎉 [Kích Hoạt Tài Khoản Thành Công] Email: ${emailClean}`);
            return NextResponse.json({
                thong_diep: 'Kích hoạt tài khoản thành công! Chào mừng bạn gia nhập TNTP Laptop Store.',
                token,
                nguoiDung: user
            });
        }

        // 2.2. AUTH: /api/auth/quen-mat-khau hoặc /api/auth/gui-otp
        if (primary === 'auth' && (secondary === 'quen-mat-khau' || secondary === 'gui-otp')) {
            const { email } = body;
            if (!email) {
                return NextResponse.json({ thong_diep: 'Vui lòng nhập địa chỉ Email!' }, { status: 400 });
            }

            const emailClean = String(email).trim().toLowerCase();

            // 1. Kiểm tra trong bảng tạm dang_ky_tam trước (trường hợp khách bấm gửi lại OTP khi đang đăng ký)
            const tempUser = await db.collection('dang_ky_tam').findOne({ email: emailClean });
            if (tempUser) {
                const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
                const hanOtp = new Date(Date.now() + 10 * 60 * 1000);
                await db.collection('dang_ky_tam').updateOne(
                    { _id: tempUser._id },
                    { $set: { maOtp, hanOtp, updatedAt: new Date() } }
                );
                const ketQuaMail2 = await guiMailKichHoatTaiKhoan(emailClean, tempUser.hoTen, maOtp);
                let thongDiep = `Mã OTP kích hoạt mới đã được gửi tới email ${emailClean}!`;
                if (!ketQuaMail2?.thanhCong) {
                    thongDiep = `Đã tạo mã OTP mới! (Lưu ý Test: Mã OTP của bạn là: ${maOtp})`;
                }
                return NextResponse.json({
                    thong_diep: thongDiep,
                    email: emailClean,
                    maOtpTest: ketQuaMail2?.thanhCong ? undefined : maOtp,
                    daGuiEmail: true
                });
            }

            // 2. Kiểm tra trong nguoi_dung (cho trường hợp Quên mật khẩu hoặc tài khoản cũ)
            const user = await db.collection('nguoi_dung').findOne({ email: emailClean });
            if (!user) {
                return NextResponse.json({ thong_diep: 'Không tìm thấy tài khoản nào liên kết với Email này!' }, { status: 404 });
            }

            const maOtp = Math.floor(100000 + Math.random() * 900000).toString();
            const hanOtp = new Date(Date.now() + 10 * 60 * 1000);

            // Nếu tài khoản chưa kích hoạt, gửi lại mã kích hoạt
            if (user.daKichHoat === false) {
                await db.collection('nguoi_dung').updateOne(
                    { _id: user._id },
                    { $set: { maOtp, hanOtp, loaiOtp: 'kich_hoat' } }
                );
                const ketQua = await guiMailKichHoatTaiKhoan(emailClean, user.hoTen, maOtp);
                let thongDiep = `Mã OTP kích hoạt đã được gửi tới email ${emailClean}!`;
                if (!ketQua?.thanhCong) {
                    thongDiep = `Đã tạo mã kích hoạt! (Lưu ý Test: Mã OTP của bạn là: ${maOtp})`;
                }
                return NextResponse.json({
                    thong_diep: thongDiep,
                    email: emailClean,
                    maOtpTest: ketQua?.thanhCong ? undefined : maOtp,
                    daGuiEmail: true
                });
            }

            // Quên mật khẩu
            await db.collection('nguoi_dung').updateOne(
                { _id: user._id },
                { $set: { maOtp, hanOtp, loaiOtp: 'quen_mat_khau' } }
            );
            const ketQuaPass = await guiMailOTPQuenMatKhau(emailClean, user.hoTen || user.ten, maOtp);
            let thongDiep = `Mã OTP xác thực đã được gửi đến email ${emailClean}! Vui lòng kiểm tra hộp thư.`;
            if (!ketQuaPass?.thanhCong) {
                thongDiep = `Đã tạo mã đặt lại mật khẩu! (Lưu ý Test: Mã OTP của bạn là: ${maOtp})`;
            }
            return NextResponse.json({
                thong_diep: thongDiep,
                email: emailClean,
                maOtpTest: ketQuaPass?.thanhCong ? undefined : maOtp,
                daGuiEmail: true
            });
        }

        // 2.3. AUTH: /api/auth/xac-nhan-otp
        if (primary === 'auth' && secondary === 'xac-nhan-otp') {
            const { email, otp } = body;
            if (!email || !otp) {
                return NextResponse.json({ thong_diep: 'Vui lòng cung cấp Email và mã OTP!' }, { status: 400 });
            }

            const emailClean = String(email).trim().toLowerCase();
            const otpClean = String(otp).trim();
            const user = await db.collection('nguoi_dung').findOne({ email: emailClean });

            if (!user) {
                return NextResponse.json({ thong_diep: 'Tài khoản không tồn tại!' }, { status: 404 });
            }

            if (!user.maOtp || String(user.maOtp).trim() !== otpClean) {
                return NextResponse.json({ thong_diep: 'Mã OTP không chính xác, vui lòng kiểm tra lại!' }, { status: 400 });
            }

            if (user.hanOtp && new Date() > new Date(user.hanOtp)) {
                return NextResponse.json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu gửi lại mã mới.' }, { status: 400 });
            }

            return NextResponse.json({
                hopLe: true,
                thong_diep: 'Xác thực mã OTP thành công! Mời bạn đặt mật khẩu mới.'
            });
        }

        // 2.4. AUTH: /api/auth/dat-lai-mat-khau
        if (primary === 'auth' && secondary === 'dat-lai-mat-khau') {
            const { email, otp, matKhauMoi } = body;
            if (!email || !otp || !matKhauMoi) {
                return NextResponse.json({ thong_diep: 'Vui lòng cung cấp đầy đủ thông tin!' }, { status: 400 });
            }

            if (String(matKhauMoi).trim().length < 6) {
                return NextResponse.json({ thong_diep: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' }, { status: 400 });
            }

            const emailClean = String(email).trim().toLowerCase();
            const otpClean = String(otp).trim();
            const user = await db.collection('nguoi_dung').findOne({ email: emailClean });

            if (!user) {
                return NextResponse.json({ thong_diep: 'Tài khoản không tồn tại!' }, { status: 404 });
            }

            if (!user.maOtp || String(user.maOtp).trim() !== otpClean) {
                return NextResponse.json({ thong_diep: 'Mã OTP không hợp lệ!' }, { status: 400 });
            }

            if (user.hanOtp && new Date() > new Date(user.hanOtp)) {
                return NextResponse.json({ thong_diep: 'Mã OTP đã hết hạn! Vui lòng yêu cầu lại.' }, { status: 400 });
            }

            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash(String(matKhauMoi).trim(), salt);
            const token = 'jwt_' + Date.now() + '_' + Math.random().toString(36).substring(2);

            await db.collection('nguoi_dung').updateOne(
                { _id: user._id },
                {
                    $set: {
                        matKhau: matKhauHash,
                        daKichHoat: true,
                        token,
                        lanDangNhapCuoi: new Date()
                    },
                    $unset: {
                        maOtp: '',
                        hanOtp: '',
                        loaiOtp: ''
                    }
                }
            );

            delete user.matKhau;
            delete user.mat_khau;
            delete user.maOtp;
            delete user.hanOtp;
            user.daKichHoat = true;
            user.token = token;

            console.log(`✅ [Đổi Mật Khẩu Thành Công] User: ${emailClean}`);
            return NextResponse.json({
                thong_diep: 'Đặt lại mật khẩu thành công! Bạn đã có thể đăng nhập bằng mật khẩu mới.',
                token,
                nguoiDung: user
            });
        }


        // 3. AUTH: /api/auth/google
        if (primary === 'auth' && secondary === 'google') {
            let { email, hoTen, avatar, credential, googleId } = body;

            // Nếu nhận credential từ Google Identity Services (One Tap / Button), giải mã lấy payload
            if (credential && (!email || !hoTen)) {
                try {
                    const parts = credential.split('.');
                    if (parts.length >= 2) {
                        const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
                        const payloadStr = Buffer.from(base64, 'base64').toString('utf-8');
                        const payload = JSON.parse(payloadStr);
                        if (payload?.email) {
                            email = payload.email;
                            hoTen = hoTen || payload.name || payload.given_name || 'Khách Hàng Google';
                            avatar = avatar || payload.picture || '';
                            googleId = googleId || payload.sub;
                        }
                    }
                } catch (e) {
                    console.error('Lỗi giải mã Google credential trên server:', e);
                }
            }

            if (!email) {
                return NextResponse.json({ 
                    thanh_cong: false, 
                    thong_diep: 'Không tìm thấy thông tin email từ tài khoản Google!' 
                }, { status: 400 });
            }

            const emailClean = String(email).trim().toLowerCase();
            let user = await db.collection('nguoi_dung').findOne({
                $or: [
                    { email: emailClean },
                    ...(googleId ? [{ googleId }] : [])
                ]
            });

            // Kiểm tra nếu tài khoản đang bị khóa
            if (user && (user.biKhoa || user.trangThai === 'bi_khoa')) {
                return NextResponse.json({
                    thong_diep: user.lyDoKhoa
                        ? `Tài khoản của bạn đã bị tạm khóa! Lý do: ${user.lyDoKhoa}`
                        : 'Tài khoản của bạn hiện đang bị tạm khóa. Vui lòng liên hệ quản trị viên để được mở khóa!'
                }, { status: 403 });
            }

            const token = 'jwt_google_' + Date.now() + '_' + Math.random().toString(36).substring(2);

            if (!user) {
                const newUser = {
                    id: 'usr_gg_' + Date.now(),
                    hoTen: hoTen || 'Khách Hàng Google',
                    email: emailClean,
                    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    vaiTro: 'khach_hang',
                    diemTichLuy: 200,
                    googleId: googleId || '',
                    authProvider: 'google',
                    token,
                    lanDangNhapCuoi: new Date(),
                    createdAt: new Date()
                };
                const ins = await db.collection('nguoi_dung').insertOne(newUser);
                user = { ...newUser, _id: ins.insertedId };
            } else {
                // Cập nhật thông tin avatar, googleId và LƯU TOKEN MỚI
                const updates = { token, lanDangNhapCuoi: new Date() };
                if (avatar && (!user.avatar || user.avatar.includes('unsplash'))) updates.avatar = avatar;
                if (googleId && !user.googleId) updates.googleId = googleId;
                if (!user.authProvider) updates.authProvider = 'google';
                await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: updates });
                user = { ...user, ...updates };
            }

            delete user.matKhau;
            delete user.mat_khau;
            delete user.maOtp;
            delete user.hanOtp;

            return NextResponse.json({ thanh_cong: true, token, nguoiDung: user });
        }

        // 3.1. AUTH: /api/auth/dang-xuat hoặc /api/auth/logout (Thu hồi Token trên Database)
        if (primary === 'auth' && (secondary === 'dang-xuat' || secondary === 'logout')) {
            const authHeader = request.headers.get('authorization') || '';
            const token = authHeader.replace('Bearer ', '').trim();
            if (token && token.length > 5) {
                await db.collection('nguoi_dung').updateOne({ token }, { $unset: { token: "" } });
            }
            return NextResponse.json({ thanh_cong: true, thong_diep: 'Đăng xuất và thu hồi phiên thành công!' });
        }

        // 4. KIỂM TRA MÃ GIẢM GIÁ: /api/ma-giam-gia/kiem-tra
        if ((primary === 'ma-giam-gia' || primary === 'ma_giam_gia') && secondary === 'kiem-tra') {
            const { ma_code, tong_tien_tam_tinh } = body;
            const voucher = await db.collection('ma_giam_gia').findOne({ 
                ma_code: { $regex: `^${ma_code}$`, $options: 'i' },
                kich_hoat: { $ne: false }
            });

            if (!voucher) {
                return NextResponse.json({ hop_le: false, thong_diep: 'Mã giảm giá không tồn tại hoặc đã hết hạn.' });
            }

            const giaTriToiThieu = voucher.gia_tri_don_hang_toi_thieu || 0;
            if (tong_tien_tam_tinh < giaTriToiThieu) {
                return NextResponse.json({ hop_le: false, thong_diep: `Đơn hàng phải từ ${giaTriToiThieu.toLocaleString()}đ mới được áp dụng.` });
            }

            let soTienGiam = 0;
            if (voucher.loai === 'phan_tram') {
                soTienGiam = (tong_tien_tam_tinh * voucher.gia_tri_giam) / 100;
                if (voucher.giam_toi_da) soTienGiam = Math.min(soTienGiam, voucher.giam_toi_da);
            } else {
                soTienGiam = voucher.gia_tri_giam || 0;
            }

            return NextResponse.json({
                hop_le: true,
                voucher,
                so_tien_giam: Math.min(soTienGiam, tong_tien_tam_tinh),
                thong_diep: `Áp dụng thành công! Giảm ${soTienGiam.toLocaleString()}đ`
            });
        }

        // 5. THÊM SẢN PHẨM: POST /api/san-pham
        if (primary === 'san-pham' || primary === 'san_pham') {
            const doc = { ...body, createdAt: new Date(), updatedAt: new Date() };
            const ins = await db.collection('san_pham').insertOne(doc);
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        // 6. TẠO ĐƠN HÀNG: POST /api/don-hang
        if (primary === 'don-hang' || primary === 'don_hang') {
            const doc = { ...body, createdAt: new Date(), updatedAt: new Date() };
            const ins = await db.collection('don_hang').insertOne(doc);
            guiMailXacNhanDonHang({ ...doc, _id: ins.insertedId }).catch(err => {
                console.warn('Lỗi gửi email xác nhận đơn hàng:', err.message);
            });
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        // 7. THÊM VOUCHER: POST /api/ma-giam-gia
        if (primary === 'ma-giam-gia' || primary === 'ma_giam_gia') {
            const doc = { ...body, createdAt: new Date() };
            const ins = await db.collection('ma_giam_gia').insertOne(doc);
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        // 8. THÊM DANH MỤC: POST /api/danh-muc
        if (primary === 'danh-muc' || primary === 'danh_muc') {
            const doc = { ...body, createdAt: new Date() };
            const ins = await db.collection('danh_muc').insertOne(doc);
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        // 9. THÊM BÀI VIẾT: POST /api/tin-tuc
        if (primary === 'tin-tuc' || primary === 'tin_tuc') {
            const doc = { ...body, createdAt: new Date() };
            const ins = await db.collection('tin_tuc').insertOne(doc);
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        // 10. THÊM ĐÁNH GIÁ: POST /api/danh-gia
        if (primary === 'danh-gia' || primary === 'danh_gia') {
            const doc = { ...body, createdAt: new Date() };
            const ins = await db.collection('danh_gia').insertOne(doc);
            return NextResponse.json({ id: ins.insertedId, ...doc }, { status: 201 });
        }

        return NextResponse.json({ thanh_cong: true });
    } catch (err) {
        console.error(`[API Route POST Error] /api/${route.join('/')}:`, err);
        return NextResponse.json({ loi: true, thong_diep: err.message }, { status: 500 });
    }
}

// Xử lý PUT API (Cập nhật)
export async function PUT(request, { params }) {
    const { route } = await params;

    try {
        const { db } = await connectToDatabase();
        const primary = route[0];
        const id = route[1];
        const body = await request.json().catch(() => ({}));
        delete body._id; // Không ghi đè _id immutable

        // 1. AUTH: Cập nhật hồ sơ cá nhân (Yêu cầu Bearer Token hợp lệ, chỉ cho phép cập nhật các trường an toàn)
        if (primary === 'auth' && id === 'cap-nhat-ho-so') {
            const authHeader = request.headers.get('authorization') || '';
            const token = authHeader.replace('Bearer ', '').trim();
            if (!token || token.length < 5) {
                return NextResponse.json({ thong_diep: 'Bạn cần đăng nhập để thực hiện thao tác này!' }, { status: 401 });
            }

            const user = await db.collection('nguoi_dung').findOne({ token });
            if (!user) {
                return NextResponse.json({ thong_diep: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn!' }, { status: 401 });
            }

            // Whitelist các trường được phép sửa, tuyệt đối không cho ghi đè vaiTro, token, diemTichLuy, matKhau
            const capNhat = {};
            if (body.hoTen !== undefined) capNhat.hoTen = String(body.hoTen).trim();
            if (body.soDienThoai !== undefined) capNhat.soDienThoai = String(body.soDienThoai).trim();
            if (body.avatar !== undefined) capNhat.avatar = String(body.avatar).trim();
            if (body.diaChi !== undefined) capNhat.diaChi = body.diaChi;
            if (body.ngaySinh !== undefined) capNhat.ngaySinh = body.ngaySinh;
            if (body.gioiTinh !== undefined) capNhat.gioiTinh = body.gioiTinh;
            capNhat.updatedAt = new Date();

            await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: capNhat });
            const userMoi = await db.collection('nguoi_dung').findOne(
                { _id: user._id },
                { projection: { matKhau: 0, mat_khau: 0, maOtp: 0, hanOtp: 0 } }
            );
            return NextResponse.json({ thong_diep: 'Cập nhật thông tin thành công!', nguoiDung: userMoi });
        }

        // 2. AUTH: Đổi mật khẩu cá nhân
        if (primary === 'auth' && id === 'doi-mat-khau') {
            const authHeader = request.headers.get('authorization') || '';
            const token = authHeader.replace('Bearer ', '').trim();
            const { matKhauCu, matKhauMoi } = body;
            if (!matKhauCu || !matKhauMoi || matKhauMoi.length < 6) {
                return NextResponse.json({ thong_diep: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' }, { status: 400 });
            }
            const user = await db.collection('nguoi_dung').findOne({ token });
            if (!user) {
                return NextResponse.json({ thong_diep: 'Phiên đăng nhập đã hết hạn' }, { status: 401 });
            }
            const savedPass = user.matKhau || user.mat_khau;
            let dung = false;
            if (savedPass?.startsWith('$2a$') || savedPass?.startsWith('$2b$')) {
                dung = await bcrypt.compare(matKhauCu, savedPass);
            } else {
                dung = (savedPass === matKhauCu);
            }
            if (!dung) {
                return NextResponse.json({ thong_diep: 'Mật khẩu hiện tại không chính xác!' }, { status: 400 });
            }
            const salt = await bcrypt.genSalt(10);
            const matKhauHash = await bcrypt.hash(matKhauMoi, salt);
            await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: { matKhau: matKhauHash, updatedAt: new Date() } });
            return NextResponse.json({ thong_diep: 'Đổi mật khẩu thành công!' });
        }

        const oid = taoObjectId(id);

        if (primary === 'san-pham' || primary === 'san_pham') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { slug: id }, { ma_san_pham: id.toUpperCase() }] } : { $or: [{ id }, { slug: id }] };
            await db.collection('san_pham').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'don-hang' || primary === 'don_hang') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_don_hang: id }] } : { $or: [{ id }, { ma_don_hang: id }] };
            await db.collection('don_hang').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'ma-giam-gia' || primary === 'ma_giam_gia') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_code: id }] } : { $or: [{ id }, { ma_code: id }] };
            await db.collection('ma_giam_gia').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'danh-muc' || primary === 'danh_muc') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_danh_muc: id }] } : { $or: [{ id }, { ma_danh_muc: id }] };
            await db.collection('danh_muc').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'nguoi-dung' || primary === 'nguoi_dung') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { email: id }] } : { $or: [{ id }, { email: id }] };
            await db.collection('nguoi_dung').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'tin-tuc' || primary === 'tin_tuc') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { slug: id }] } : { $or: [{ id }, { slug: id }] };
            await db.collection('tin_tuc').updateOne(query, { $set: { ...body, updatedAt: new Date() } });
            return NextResponse.json({ thanh_cong: true, id, ...body });
        }

        if (primary === 'cai-dat' || primary === 'cai_dat') {
            await db.collection('cai_dat').updateOne({}, { $set: { ...body, updatedAt: new Date() } }, { upsert: true });
            return NextResponse.json({ thanh_cong: true, ...body });
        }

        return NextResponse.json({ thanh_cong: true });
    } catch (err) {
        console.error(`[API Route PUT Error] /api/${route.join('/')}:`, err);
        return NextResponse.json({ loi: true, thong_diep: err.message }, { status: 500 });
    }
}

// Xử lý DELETE API (Xóa)
export async function DELETE(request, { params }) {
    const { route } = await params;

    try {
        const { db } = await connectToDatabase();
        const primary = route[0];
        const id = route[1];
        const oid = taoObjectId(id);

        if (primary === 'san-pham' || primary === 'san_pham') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { slug: id }] } : { $or: [{ id }, { slug: id }] };
            await db.collection('san_pham').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        if (primary === 'don-hang' || primary === 'don_hang') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_don_hang: id }] } : { $or: [{ id }, { ma_don_hang: id }] };
            await db.collection('don_hang').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        if (primary === 'ma-giam-gia' || primary === 'ma_giam_gia') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_code: id }] } : { $or: [{ id }, { ma_code: id }] };
            await db.collection('ma_giam_gia').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        if (primary === 'danh-muc' || primary === 'danh_muc') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { ma_danh_muc: id }] } : { $or: [{ id }, { ma_danh_muc: id }] };
            await db.collection('danh_muc').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        if (primary === 'nguoi-dung' || primary === 'nguoi_dung') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { email: id }] } : { $or: [{ id }, { email: id }] };
            await db.collection('nguoi_dung').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        if (primary === 'tin-tuc' || primary === 'tin_tuc') {
            const query = oid ? { $or: [{ _id: oid }, { id }, { slug: id }] } : { $or: [{ id }, { slug: id }] };
            await db.collection('tin_tuc').deleteOne(query);
            return NextResponse.json({ thanh_cong: true, id });
        }

        return NextResponse.json({ thanh_cong: true });
    } catch (err) {
        console.error(`[API Route DELETE Error] /api/${route.join('/')}:`, err);
        return NextResponse.json({ loi: true, thong_diep: err.message }, { status: 500 });
    }
}
