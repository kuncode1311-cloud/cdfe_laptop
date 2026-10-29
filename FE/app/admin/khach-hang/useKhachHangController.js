'use client';

import { NguoiDungService } from '@/services/nguoi-dung.service';

// Xử lý nghiệp vụ KhachHang; dữ liệu dùng chung được truyền từ controller chính.
export default function useKhachHangController(dependencies) {
    const { canhBao, formUser, hienThongBao, setDangLuuUser, setDangMoModalUser, setDangXuLyUserId, setDanhSachNguoiDung, setFormUser, setUserDangSua, userDangSua, xacNhan } = dependencies;
    const layChiTietThoiGianKhachHang = (user) => {
        if (!user) return { gio: '--:--', ngay: '--/--/----', full: 'Chưa rõ' };

        let d = null;

        // 1. Kiểm tra trường createdAt chuẩn của MongoDB / Mongoose
        if (user.createdAt) {
            const parsed = new Date(user.createdAt);
            if (!isNaN(parsed.getTime())) d = parsed;
        }

        // 2. Kiểm tra ID timestamp dạng usr_17... hoặc gg_17...
        if (!d && typeof user.id === 'string') {
            const cleanId = user.id.replace('usr_', '').replace('gg_', '');
            const ts = parseInt(cleanId, 10);
            if (!isNaN(ts) && ts > 1600000000000) {
                const parsed = new Date(ts);
                if (!isNaN(parsed.getTime())) d = parsed;
            }
        }

        // 3. Xử lý nếu có chuỗi ngayTao sẵn
        if (!d && user.ngayTao && typeof user.ngayTao === 'string') {
            const timeMatch = user.ngayTao.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
            const dateMatch = user.ngayTao.match(/(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/);
            if (dateMatch) {
                const ngay = dateMatch[1].padStart(2, '0');
                const thang = dateMatch[2].padStart(2, '0');
                const nam = dateMatch[3];
                if (timeMatch) {
                    const gio = timeMatch[1].padStart(2, '0');
                    const phut = timeMatch[2].padStart(2, '0');
                    const giay = timeMatch[3] ? timeMatch[3].padStart(2, '0') : '00';
                    return {
                        gio: `${gio}:${phut}:${giay}`,
                        gioNgan: `${gio}:${phut}`,
                        ngay: `${ngay}/${thang}/${nam}`,
                        full: `${gio}:${phut}:${giay} - ${ngay}/${thang}/${nam}`
                    };
                }
                // Nếu chỉ có ngày mà chưa có giờ, tính giờ giả định ổn định
                const hashGio = (Math.abs((user.email || user.hoTen || 'khach').charCodeAt(0) * 7) % 14) + 8;
                const hashPhut = (Math.abs((user.email || user.hoTen || 'hang').charCodeAt(1 || 0) * 11) % 60);
                const gioStr = String(hashGio).padStart(2, '0');
                const phutStr = String(hashPhut).padStart(2, '0');
                return {
                    gio: `${gioStr}:${phutStr}:00`,
                    gioNgan: `${gioStr}:${phutStr}`,
                    ngay: `${ngay}/${thang}/${nam}`,
                    full: `${gioStr}:${phutStr} - ${ngay}/${thang}/${nam}`
                };
            }
        }

        // 4. Fallback mặc định nếu không có bất kỳ mốc thời gian nào
        if (!d) {
            d = new Date('2026-08-15T08:30:00.000Z');
        }

        const gio = String(d.getHours()).padStart(2, '0');
        const phut = String(d.getMinutes()).padStart(2, '0');
        const giay = String(d.getSeconds()).padStart(2, '0');
        const ngay = String(d.getDate()).padStart(2, '0');
        const thang = String(d.getMonth() + 1).padStart(2, '0');
        const nam = d.getFullYear();

        return {
            gio: `${gio}:${phut}:${giay}`,
            gioNgan: `${gio}:${phut}`,
            ngay: `${ngay}/${thang}/${nam}`,
            full: `${gio}:${phut}:${giay} - ${ngay}/${thang}/${nam}`
        };
    };

    const layNgayTaoKhachHang = (user) => {
        const tg = layChiTietThoiGianKhachHang(user);
        return tg.full;
    };

    const moModalThemUser = () => {
        setUserDangSua(null);
        setFormUser({
            hoTen: '',
            email: '',
            matKhau: '',
            soDienThoai: '',
            vaiTro: 'khach_hang',
            trangThai: 'hoat_dong',
            biKhoa: false,
            lyDoKhoa: ''
        });
        setDangMoModalUser(true);
    };

    // Sinh mật khẩu ngẫu nhiên (đủ ngẫu nhiên, dễ đọc) dùng khi Admin tạo tài khoản mới,
    // thay cho mật khẩu mặc định cố định "123456" trước đây (rủi ro an ninh)
    const taoMatKhauNgauNhien = () => Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-4).toUpperCase();

    const moModalSuaUser = (u) => {
        setUserDangSua(u);
        setFormUser({
            hoTen: u.hoTen || '',
            email: u.email || '',
            matKhau: '',
            soDienThoai: u.soDienThoai || '',
            vaiTro: u.vaiTro || 'khach_hang',
            trangThai: u.trangThai || (u.biKhoa ? 'bi_khoa' : 'hoat_dong'),
            biKhoa: Boolean(u.biKhoa || u.trangThai === 'bi_khoa'),
            lyDoKhoa: u.lyDoKhoa || ''
        });
        setDangMoModalUser(true);
    };

    const xuLyLuuUser = async (e) => {
        e.preventDefault();
        setDangLuuUser(true);
        try {
            const payload = {
                hoTen: formUser.hoTen.trim(),
                email: formUser.email.trim().toLowerCase(),
                soDienThoai: formUser.soDienThoai.trim(),
                vaiTro: formUser.vaiTro,
                trangThai: formUser.trangThai || (formUser.biKhoa ? 'bi_khoa' : 'hoat_dong'),
                biKhoa: Boolean(formUser.biKhoa || formUser.trangThai === 'bi_khoa'),
                lyDoKhoa: formUser.lyDoKhoa || ''
            };

            if (formUser.matKhau) {
                payload.matKhau = formUser.matKhau;
            }

            if (userDangSua) {
                const suaId = userDangSua.id || userDangSua._id;
                await NguoiDungService.capNhatNguoiDung(suaId, payload);
                hienThongBao(`Đã cập nhật tài khoản ${payload.email}!`);
                setDanhSachNguoiDung(prev => prev.map(u => {
                    const uId = u.id || u._id;
                    if (uId === suaId) {
                        return { ...u, ...payload };
                    }
                    return u;
                }));
            } else {
                // Tạo mới: sinh mật khẩu ngẫu nhiên (không còn dùng mật khẩu mặc định cố định "123456")
                const matKhauMoiTao = payload.matKhau || taoMatKhauNgauNhien();
                payload.matKhau = matKhauMoiTao;
                payload.id = 'usr_' + Date.now();
                payload.createdAt = new Date().toISOString();
                payload.ngayTao = layNgayTaoKhachHang({ createdAt: new Date() });
                const resThem = await NguoiDungService.themNguoiDung(payload);
                setDanhSachNguoiDung(prev => [resThem?.id || resThem?._id ? resThem : payload, ...prev]);
                await canhBao({
                    tieuDe: 'Đã Tạo Tài Khoản Thành Công',
                    noiDung: `Tài khoản "${payload.email}" đã được tạo với mật khẩu ngẫu nhiên: ${matKhauMoiTao}\n\nVui lòng gửi lại mật khẩu này cho khách hàng (khách nên đổi mật khẩu sau khi đăng nhập lần đầu).`,
                    loai: 'success'
                });
            }

            setDangMoModalUser(false);
            setUserDangSua(null);
        } catch (err) {
            canhBao({ tieuDe: 'Không Thể Lưu Người Dùng', noiDung: err.message, loai: 'danger' });
        } finally {
            setDangLuuUser(false);
        }
    };

    const xuLyKhoaNguoiDung = async (user) => {
        const dangKhoa = Boolean(user.biKhoa || user.trangThai === 'bi_khoa');
        const id = user.id || user._id;

        if (user.vaiTro === 'admin' && !dangKhoa) {
            const dongYAdmin = await xacNhan({
                tieuDe: 'Khóa Tài Khoản Quản Trị Viên?',
                noiDung: `CẢNH BÁO: "${user.hoTen}" là tài khoản Quản Trị Viên (Admin). Bạn có chắc chắn muốn tạm khóa tài khoản này không?`,
                loai: 'danger',
                nutXacNhan: 'Vẫn Khóa Admin',
                nutHuy: 'Hủy Bỏ'
            });
            if (!dongYAdmin) return;
        } else {
            const dongY = await xacNhan({
                tieuDe: dangKhoa ? 'Mở Khóa Tài Khoản Khách Hàng?' : 'Tạm Khóa Tài Khoản Khách Hàng?',
                noiDung: dangKhoa
                    ? `Bạn có muốn mở khóa cho tài khoản "${user.email}"? Khách hàng sẽ có thể đăng nhập và mua sắm lại bình thường.`
                    : `Bạn có chắc muốn tạm thời khóa tài khoản "${user.email}"? Tài khoản này sẽ bị chặn đăng nhập trên toàn hệ thống.`,
                loai: dangKhoa ? 'info' : 'danger',
                nutXacNhan: dangKhoa ? 'Mở Khóa Ngay' : 'Khóa Tạm Thời',
                nutHuy: 'Hủy Bỏ'
            });
            if (!dongY) return;
        }

        const capNhat = dangKhoa
            ? { biKhoa: false, trangThai: 'hoat_dong', lyDoKhoa: '' }
            : { biKhoa: true, trangThai: 'bi_khoa', lyDoKhoa: 'Quản trị viên tạm khóa tài khoản' };

        // ⚡ Cập nhật Realtime tại chỗ trên row ngay lập tức (không reload giật lag cả table)
        setDanhSachNguoiDung(prev => prev.map(u => {
            const uId = u.id || u._id;
            if (uId === id) {
                return { ...u, ...capNhat };
            }
            return u;
        }));

        setDangXuLyUserId(id);
        try {
            await NguoiDungService.capNhatNguoiDung(id, capNhat);
            hienThongBao(dangKhoa ? `Đã mở khóa tài khoản ${user.email}!` : `Đã tạm khóa tài khoản ${user.email}!`);
        } catch (err) {
            // Hoàn nguyên trạng thái cũ nếu API báo lỗi
            setDanhSachNguoiDung(prev => prev.map(u => {
                const uId = u.id || u._id;
                if (uId === id) {
                    return user;
                }
                return u;
            }));
            canhBao({
                tieuDe: 'Không Thể Thay Đổi Trạng Thái',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };

    const xuLyXoaUser = async (u) => {
        const dongY = await xacNhan({
            tieuDe: 'Xóa Tài Khoản Người Dùng?',
            noiDung: `Bạn có chắc muốn xóa vĩnh viễn tài khoản "${u.email}"?`,
            loai: 'danger',
            nutXacNhan: 'Xóa Tài Khoản',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;
        const id = u.id || u._id;

        // ⚡ Xóa tại chỗ trên row ngay lập tức
        setDanhSachNguoiDung(prev => prev.filter(item => (item.id || item._id) !== id));
        setDangXuLyUserId(id);
        try {
            await NguoiDungService.xoaNguoiDung(id);
            hienThongBao(`Đã xóa tài khoản ${u.email}!`);
        } catch (err) {
            setDanhSachNguoiDung(prev => [u, ...prev]);
            canhBao({
                tieuDe: 'Không Thể Xóa Tài Khoản',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };

    const xuLyDoiVaiTroNguoiDung = async (user) => {
        const vaiTroMoi = user.vaiTro === 'admin' ? 'khach_hang' : 'admin';
        const dongY = await xacNhan({
            tieuDe: 'Thay Đổi Quyền Hạn Tài Khoản?',
            noiDung: `Bạn có muốn đổi quyền của "${user.hoTen}" thành [${vaiTroMoi === 'admin' ? 'QUẢN TRỊ VIÊN' : 'KHÁCH HÀNG'}]?`,
            loai: 'warning',
            nutXacNhan: 'Đổi Quyền',
            nutHuy: 'Hủy Bỏ'
        });
        if (!dongY) return;

        const id = user.id || user._id;

        // ⚡ Cập nhật vai trò tại chỗ trên row ngay lập tức
        setDanhSachNguoiDung(prev => prev.map(u => {
            const uId = u.id || u._id;
            if (uId === id) return { ...u, vaiTro: vaiTroMoi };
            return u;
        }));

        setDangXuLyUserId(id);
        try {
            await NguoiDungService.capNhatNguoiDung(id, { vaiTro: vaiTroMoi });
            hienThongBao(`Đã cập nhật quyền tài khoản ${user.email}!`);
        } catch (err) {
            setDanhSachNguoiDung(prev => prev.map(u => {
                const uId = u.id || u._id;
                if (uId === id) return user;
                return u;
            }));
            canhBao({
                tieuDe: 'Lỗi Cập Nhật Quyền',
                noiDung: err.message,
                loai: 'danger'
            });
        } finally {
            setDangXuLyUserId(null);
        }
    };
    return { layChiTietThoiGianKhachHang, layNgayTaoKhachHang, moModalThemUser, taoMatKhauNgauNhien, moModalSuaUser, xuLyLuuUser, xuLyKhoaNguoiDung, xuLyXoaUser, xuLyDoiVaiTroNguoiDung };
}
