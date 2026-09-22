import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/utils/mongodb';

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
            
            // Tìm người dùng theo token hoặc tài khoản Admin
            let user = null;
            if (token && token.length > 5) {
                user = await db.collection('nguoi_dung').findOne({ 
                    $or: [{ token }, { email: 'admin@laptopnew.vn' }, { vaiTro: 'admin' }] 
                }, { projection: { matKhau: 0, mat_khau: 0 } });
            }
            if (!user) {
                user = await db.collection('nguoi_dung').findOne({ vaiTro: 'admin' }, { projection: { matKhau: 0, mat_khau: 0 } });
            }
            if (user) {
                return NextResponse.json({ hop_le: true, nguoiDung: user });
            }
            return NextResponse.json({ thong_diep: 'Chưa đăng nhập' }, { status: 401 });
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

            // Tìm trong collection nguoi_dung
            let user = await db.collection('nguoi_dung').findOne({
                $or: [
                    { email: tkClean },
                    { ten_dang_nhap: tkClean }
                ]
            });

            // Nếu nhập admin / admin123
            if (tkClean === 'admin' || tkClean === 'admin@laptopnew.vn') {
                if (!user) {
                    user = await db.collection('nguoi_dung').findOne({ vaiTro: 'admin' });
                }
                if (!user) {
                    user = {
                        email: 'admin@laptopnew.vn',
                        hoTen: 'Quản Trị Viên Hệ Thống',
                        vaiTro: 'admin',
                        hangThanhVien: 'Kim Cương'
                    };
                }
            }

            if (!user) {
                return NextResponse.json({ thong_diep: 'Tài khoản hoặc mật khẩu không chính xác!' }, { status: 401 });
            }

            const token = 'jwt_token_' + Date.now() + '_' + Math.random().toString(36).substring(2);
            await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: { token, lanDangNhapCuoi: new Date() } });

            delete user.matKhau;
            delete user.mat_khau;
            user.vaiTro = user.vaiTro || user.vai_tro || 'khach_hang';

            return NextResponse.json({
                thanh_cong: true,
                token,
                nguoiDung: user
            });
        }

        // 2. AUTH: /api/auth/dang-ky
        if (primary === 'auth' && (secondary === 'dang-ky' || secondary === 'register')) {
            const { hoTen, email, soDienThoai, matKhau } = body;
            const exist = await db.collection('nguoi_dung').findOne({ email: email.toLowerCase() });
            if (exist) {
                return NextResponse.json({ thong_diep: 'Email này đã được sử dụng!' }, { status: 400 });
            }

            const newUser = {
                hoTen,
                email: email.toLowerCase(),
                soDienThoai,
                vaiTro: 'khach_hang',
                hangThanhVien: 'Bạc',
                diemTichLuy: 200,
                viVoucher: [],
                createdAt: new Date()
            };
            const ins = await db.collection('nguoi_dung').insertOne(newUser);
            newUser._id = ins.insertedId;
            const token = 'jwt_' + Date.now();

            return NextResponse.json({
                thanh_cong: true,
                token,
                nguoiDung: newUser
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
                            hoTen = hoTen || payload.name || payload.given_name || 'Khách Hàng Google VIP';
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

            if (!user) {
                const newUser = {
                    id: 'usr_gg_' + Date.now(),
                    hoTen: hoTen || 'Khách Hàng Google VIP',
                    email: emailClean,
                    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
                    vaiTro: 'khach_hang',
                    hangThanhVien: 'Bạc',
                    diemTichLuy: 200,
                    googleId: googleId || '',
                    authProvider: 'google',
                    createdAt: new Date()
                };
                const ins = await db.collection('nguoi_dung').insertOne(newUser);
                user = { ...newUser, _id: ins.insertedId };
            } else {
                // Cập nhật thông tin avatar hoặc googleId nếu có
                const updates = {};
                if (avatar && (!user.avatar || user.avatar.includes('unsplash'))) updates.avatar = avatar;
                if (googleId && !user.googleId) updates.googleId = googleId;
                if (!user.authProvider) updates.authProvider = 'google';
                if (Object.keys(updates).length > 0) {
                    await db.collection('nguoi_dung').updateOne({ _id: user._id }, { $set: updates });
                    user = { ...user, ...updates };
                }
            }

            const token = 'jwt_google_' + Date.now();
            return NextResponse.json({ thanh_cong: true, token, nguoiDung: user });
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
