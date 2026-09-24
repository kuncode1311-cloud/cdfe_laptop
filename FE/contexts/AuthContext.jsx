'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, apiFetch, TOKEN_STORAGE_KEY } from '@/services/api-client';

export const AuthContext = createContext(undefined);
const USER_STORAGE_KEY = 'tnt_laptop_user';

// Tương thích response cũ trong context, nhưng mọi request auth đều đi qua apiFetch.
const fetch = async (url, options = {}) => {
    const endpoint = url.startsWith(API_BASE_URL) ? url.slice(API_BASE_URL.length) : url;
    try {
        const data = await apiFetch(endpoint, options);
        return { ok: true, status: 200, json: async () => data };
    } catch (error) {
        return {
            ok: false,
            status: error.status || 500,
            json: async () => error.data || { thong_diep: error.message }
        };
    }
};

export const locDiaChiHopLe = (danhSach) => Array.isArray(danhSach) ? danhSach : [];

export const lamSachDuLieuNguoiDung = (user) => {
    if (!user || typeof user !== 'object') return user;
    const userMoi = { ...user };
    if (Array.isArray(userMoi.danhSachDiaChi)) {
        userMoi.danhSachDiaChi = locDiaChiHopLe(userMoi.danhSachDiaChi);
    }
    return userMoi;
};

export function AuthProvider({ children }) {
    const [nguoiDung, setNguoiDung] = useState(null);
    const [token, setToken] = useState(null);
    const [dangKiemTraPhien, setDangKiemTraPhien] = useState(true);
    const [dangMoModalAuth, setDangMoModalAuth] = useState(false);
    const [cheDoAuth, setCheDoAuth] = useState('dang_nhap');

    // Khôi phục phiên đăng nhập NGAY LẬP TỨC từ localStorage khi tải trang, sau đó xác thực ngầm với server
    useEffect(() => {
        let daHuy = false;

        const khoiPhucPhien = async () => {
            try {
                const tokenLuu = localStorage.getItem(TOKEN_STORAGE_KEY) || localStorage.getItem('token') || localStorage.getItem('tnt_laptop_token');
                const userLuu = localStorage.getItem(USER_STORAGE_KEY) || localStorage.getItem('user') || localStorage.getItem('tnt_laptop_user');

                // 1. Phục hồi NGAY TỨC THÌ (0ms) từ localStorage để tránh bị chớp màn hình đăng nhập khi F5
                if (userLuu) {
                    try {
                        const parsedUser = JSON.parse(userLuu);
                        if (!daHuy && parsedUser) {
                            const cleanUser = lamSachDuLieuNguoiDung(parsedUser);
                            setNguoiDung(cleanUser);
                            // Nếu trong localStorage có địa chỉ giả lập/mẫu, ghi đè làm sạch ngay lập tức
                            if (JSON.stringify(cleanUser) !== userLuu) {
                                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
                            }
                        }
                    } catch (err) {
                        console.warn('Lỗi đọc user cache:', err);
                    }
                }

                if (tokenLuu && !daHuy) {
                    setToken(tokenLuu);
                }

                if (!daHuy) {
                    setDangKiemTraPhien(false);
                }

                // 2. Xác thực ngầm trong nền với server (background revalidation)
                if (tokenLuu) {
                    try {
                        const res = await fetch(`${API_BASE_URL}/auth/toi`, {
                            headers: {
                                'Authorization': `Bearer ${tokenLuu}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (!daHuy) {
                            if (res.ok) {
                                const data = await res.json();
                                if (data.nguoiDung) {
                                    const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
                                    setNguoiDung(cleanUser);
                                    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
                                }
                            } else if (res.status === 401) {
                                // Token hết hạn thực sự trên server -> xóa phiên
                                localStorage.removeItem(TOKEN_STORAGE_KEY);
                                localStorage.removeItem(USER_STORAGE_KEY);
                                setToken(null);
                                setNguoiDung(null);
                            }
                        }
                    } catch {
                        // Nếu server tạm thời offline hoặc chậm, vẫn giữ phiên đăng nhập từ localStorage
                    }
                }
            } catch (e) {
                console.error('Lỗi đọc dữ liệu người dùng:', e);
            } finally {
                if (!daHuy) {
                    setDangKiemTraPhien(false);
                }
            }
        };

        khoiPhucPhien();
        return () => { daHuy = true; };
    }, []);

    const moModalDangNhap = () => {
        setCheDoAuth('dang_nhap');
        setDangMoModalAuth(true);
    };

    const moModalDangKy = () => {
        setCheDoAuth('dang_ky');
        setDangMoModalAuth(true);
    };

    const dongModalAuth = () => {
        setDangMoModalAuth(false);
        setCheDoAuth('dang_nhap');
    };

    const chuyenDoiCheDoAuth = (cheDo) => {
        setCheDoAuth(cheDo);
    };

    // Đăng nhập với Backend Express JWT
    const dangNhap = async (email, matKhau) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/dang-nhap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, matKhau })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.thong_diep || 'Đăng nhập thất bại, vui lòng kiểm tra lại thông tin!');
            }

            if (data.token && data.nguoiDung) {
                const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
                setToken(data.token);
                setNguoiDung(cleanUser);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
                return cleanUser;
            }

            throw new Error('Dữ liệu phản hồi từ server không hợp lệ');
        } catch (error) {
            console.error('Lỗi đăng nhập:', error.message);
            throw error;
        }
    };

    // Đăng ký với Backend Express JWT (Yêu cầu mã OTP qua Email)
    const dangKy = async (hoTen, email, soDienThoai, matKhau) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/dang-ky`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ hoTen, email, soDienThoai, matKhau })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.thong_diep || 'Đăng ký thất bại, vui lòng thử lại!');
            }

            return data;
        } catch (error) {
            console.error('Lỗi đăng ký:', error.message);
            throw error;
        }
    };

    // Kích hoạt tài khoản người dùng bằng mã OTP
    const kichHoatTaiKhoan = async (email, otp) => {
        try {
            const res = await fetch(`${API_BASE_URL}/auth/kich-hoat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.thong_diep || 'Xác thực OTP kích hoạt thất bại!');
            }

            if (data.token && data.nguoiDung) {
                const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
                setToken(data.token);
                setNguoiDung(cleanUser);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
            }

            return data;
        } catch (error) {
            console.error('Lỗi kích hoạt tài khoản:', error.message);
            throw error;
        }
    };

    // Đăng nhập với Google – gửi credential (ID Token) lên BE để verify
    const dangNhapGoogle = async (duLieuGoogle = null) => {
        try {
            if (!duLieuGoogle) {
                throw new Error('Không có thông tin đăng nhập Google!');
            }

            // Tự động giải mã credential phía client để luôn có đủ email, hoTen, avatar
            let payloadGui = { ...duLieuGoogle };
            if (payloadGui.credential && (!payloadGui.email || !payloadGui.hoTen)) {
                try {
                    const base64Url = payloadGui.credential.split('.')[1];
                    if (base64Url) {
                        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                                .join('')
                        );
                        const decoded = JSON.parse(jsonPayload);
                        if (decoded?.email) {
                            payloadGui.email = decoded.email;
                            payloadGui.hoTen = payloadGui.hoTen || decoded.name || decoded.given_name || 'Khách Hàng Google';
                            payloadGui.avatar = payloadGui.avatar || decoded.picture || '';
                            payloadGui.googleId = payloadGui.googleId || decoded.sub;
                        }
                    }
                } catch (e) {
                    console.warn('Lỗi decode JWT token trên client:', e);
                }
            }

            const res = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payloadGui)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.thong_diep || 'Đăng nhập Google thất bại');
            }

            if (data.token && data.nguoiDung) {
                const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
                setToken(data.token);
                setNguoiDung(cleanUser);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
                return cleanUser;
            }
            throw new Error('Không nhận được token từ server');
        } catch (error) {
            console.error('Lỗi đăng nhập Google:', error);
            throw error;
        }
    };

    // Gửi mã OTP Quên mật khẩu
    const guiOtpQuenMatKhau = async (email) => {
        const res = await fetch(`${API_BASE_URL}/auth/quen-mat-khau`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.thong_diep || 'Không thể gửi mã OTP, vui lòng kiểm tra lại email!');
        }
        return data;
    };

    // Gửi lại mã OTP (Hỗ trợ cả kích hoạt tài khoản và quên mật khẩu)
    const guiLaiOtp = async (email) => {
        const res = await fetch(`${API_BASE_URL}/auth/gui-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.thong_diep || 'Không thể gửi lại mã OTP, vui lòng kiểm tra lại email!');
        }
        return data;
    };

    // Xác nhận mã OTP
    const xacNhanOtp = async (email, otp) => {
        const res = await fetch(`${API_BASE_URL}/auth/xac-nhan-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.thong_diep || 'Mã OTP không chính xác hoặc đã hết hạn!');
        }
        return data;
    };

    // Đặt lại mật khẩu mới với OTP
    const datLaiMatKhau = async (email, otp, matKhauMoi) => {
        const res = await fetch(`${API_BASE_URL}/auth/dat-lai-mat-khau`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp, matKhauMoi })
        });
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.thong_diep || 'Không thể đặt lại mật khẩu, vui lòng thử lại!');
        }
        if (data.token && data.nguoiDung) {
            const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
            setToken(data.token);
            setNguoiDung(cleanUser);
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
        }
        return data;
    };

    // Cập nhật mã voucher vào state của người dùng hiện tại
    const capNhatViVoucher = (danhSachMoi) => {
        if (nguoiDung) {
            const userMoi = { ...nguoiDung, viVoucher: danhSachMoi };
            setNguoiDung(userMoi);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userMoi));
        }
    };

    // Cập nhật hồ sơ người dùng
    const capNhatHoSo = async (duLieuCapNhat) => {
        try {
            const tokenHienTai = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
            const res = await fetch(`${API_BASE_URL}/auth/cap-nhat-ho-so`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenHienTai}`
                },
                body: JSON.stringify(duLieuCapNhat)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.thong_diep || 'Cập nhật hồ sơ thất bại!');
            }

            if (data.nguoiDung) {
                const cleanUser = lamSachDuLieuNguoiDung(data.nguoiDung);
                setNguoiDung(cleanUser);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUser));
            }

            return data;
        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error.message);
            if (nguoiDung) {
                const userMoi = lamSachDuLieuNguoiDung({ ...nguoiDung, ...duLieuCapNhat });
                setNguoiDung(userMoi);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userMoi));
            }
            throw error;
        }
    };

    // Đổi mật khẩu cá nhân
    const guiOtpDoiMatKhau = async () => {
        return await apiFetch('/auth/doi-mat-khau/gui-otp', { method: 'POST' });
    };

    const doiMatKhau = async (matKhauMoi, otp) => {
        try {
            const data = await apiFetch('/auth/doi-mat-khau', {
                method: 'PUT',
                body: JSON.stringify({ matKhauMoi, otp })
            });
            if (nguoiDung) {
                const userMoi = { ...nguoiDung, coMatKhau: true };
                setNguoiDung(userMoi);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userMoi));
            }
            return data;
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error.message);
            throw error;
        }
    };

    // Đăng xuất và xóa sạch Token, Giỏ hàng, Cache đơn hàng & Toàn bộ Session (Đồng thời thu hồi token trên Database)
    const dangXuat = () => {
        const tokenHienTai = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);

        if (tokenHienTai) {
            fetch(`${API_BASE_URL}/auth/dang-xuat`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenHienTai}`,
                    'Content-Type': 'application/json'
                }
            }).catch(() => {});
        }

        setNguoiDung(null);
        setToken(null);
        setDangMoModalAuth(false);

        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem('tnt_laptop_user');
                localStorage.removeItem('tnt_laptop_token');
                localStorage.removeItem('laptopnew_user');
                localStorage.removeItem('nguoi_dung');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('auth_user');
                localStorage.removeItem('laptopnew_danh_sach_don_hang');
                localStorage.removeItem('laptopnew_gio_hang_data');
                sessionStorage.clear();
                window.dispatchEvent(new Event('auth:logout'));
            } catch (e) {
                console.warn('Lỗi xóa storage khi logout:', e);
            }

            if (window.google?.accounts?.id) {
                try {
                    window.google.accounts.id.disableAutoSelect();
                } catch (_) {}
            }
        }
    };

    const laAdmin = nguoiDung?.vaiTro === 'admin';

    return (
        <AuthContext.Provider
            value={{
                nguoiDung,
                user: nguoiDung,
                token,
                dangKiemTraPhien,
                isLoadingAuth: dangKiemTraPhien,
                daDangNhap: !!nguoiDung,
                isAuthenticated: !!nguoiDung,
                laAdmin,
                isAdmin: laAdmin,
                vaiTro: nguoiDung?.vaiTro || 'khach_hang',
                role: nguoiDung?.vaiTro || 'khach_hang',
                viVoucher: nguoiDung?.viVoucher || [],
                capNhatViVoucher,
                capNhatHoSo,
                doiMatKhau,
                guiOtpDoiMatKhau,
                dangMoModalAuth,
                cheDoAuth,
                moModalDangNhap,
                openLoginModal: moModalDangNhap,
                moModalDangKy,
                openRegisterModal: moModalDangKy,
                dongModalAuth,
                closeAuthModal: dongModalAuth,
                chuyenDoiCheDoAuth,
                switchAuthMode: chuyenDoiCheDoAuth,
                dangNhap,
                login: dangNhap,
                dangKy,
                register: dangKy,
                kichHoatTaiKhoan,
                dangNhapGoogle,
                loginWithGoogle: dangNhapGoogle,
                dangXuat,
                logout: dangXuat,
                guiOtpQuenMatKhau,
                guiLaiOtp,
                resendOtp: guiLaiOtp,
                xacNhanOtp,
                datLaiMatKhau
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Alias tương thích
export const useNguoiDung = useAuth;
export const NhaCungCapNguoiDung = AuthProvider;
export const NguCanhNguoiDung = AuthContext;
