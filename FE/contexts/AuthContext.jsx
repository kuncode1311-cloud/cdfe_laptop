'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL, TOKEN_STORAGE_KEY } from '@/services/api-client';

export const AuthContext = createContext(undefined);
const USER_STORAGE_KEY = 'tnt_laptop_user';

export function AuthProvider({ children }) {
    const [nguoiDung, setNguoiDung] = useState(null);
    const [token, setToken] = useState(null);
    const [dangMoModalAuth, setDangMoModalAuth] = useState(false);
    const [cheDoAuth, setCheDoAuth] = useState('dang_nhap');

    // Khôi phục phiên đăng nhập và xác thực Token từ server khi tải trang
    useEffect(() => {
        const khoiPhucPhien = async () => {
            try {
                const tokenLuu = localStorage.getItem(TOKEN_STORAGE_KEY);
                const userLuu = localStorage.getItem(USER_STORAGE_KEY);

                if (tokenLuu) {
                    setToken(tokenLuu);
                    // Tự động kiểm tra token với Backend
                    try {
                        const res = await fetch(`${API_BASE_URL}/auth/toi`, {
                            headers: {
                                'Authorization': `Bearer ${tokenLuu}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (res.ok) {
                            const data = await res.json();
                            if (data.nguoiDung) {
                                setNguoiDung(data.nguoiDung);
                                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
                                return;
                            }
                        } else if (res.status === 401) {
                            // Token hết hạn hoặc không hợp lệ -> xóa phiên
                            localStorage.removeItem(TOKEN_STORAGE_KEY);
                            localStorage.removeItem(USER_STORAGE_KEY);
                            setToken(null);
                            setNguoiDung(null);
                            return;
                        }
                    } catch {
                        // Nếu server offline, dùng user đã lưu tạm
                    }
                }

                if (userLuu) {
                    setNguoiDung(JSON.parse(userLuu));
                }
            } catch (e) {
                console.error('Lỗi đọc dữ liệu người dùng:', e);
            }
        };

        khoiPhucPhien();
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
                setToken(data.token);
                setNguoiDung(data.nguoiDung);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
                return data.nguoiDung;
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
                setToken(data.token);
                setNguoiDung(data.nguoiDung);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
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
            // duLieuGoogle có thể là:
            // { credential: "eyJhbGci..." }  ← Google Identity Services (One Tap / Button)
            // { email, hoTen, avatar, googleId } ← Fallback thủ công
            if (!duLieuGoogle) {
                throw new Error('Không có thông tin đăng nhập Google!');
            }

            const res = await fetch(`${API_BASE_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(duLieuGoogle)
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.thong_diep || 'Đăng nhập Google thất bại');
            }

            if (data.token && data.nguoiDung) {
                setToken(data.token);
                setNguoiDung(data.nguoiDung);
                localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
                return data.nguoiDung;
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
            setToken(data.token);
            setNguoiDung(data.nguoiDung);
            localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
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
                setNguoiDung(data.nguoiDung);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.nguoiDung));
            }

            return data;
        } catch (error) {
            console.error('Lỗi cập nhật hồ sơ:', error.message);
            if (nguoiDung) {
                const userMoi = { ...nguoiDung, ...duLieuCapNhat };
                setNguoiDung(userMoi);
                localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userMoi));
            }
            throw error;
        }
    };

    // Đổi mật khẩu cá nhân
    const doiMatKhau = async (matKhauCu, matKhauMoi) => {
        try {
            const tokenHienTai = token || (typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null);
            const res = await fetch(`${API_BASE_URL}/auth/doi-mat-khau`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenHienTai}`
                },
                body: JSON.stringify({ matKhauCu, matKhauMoi })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.thong_diep || 'Đổi mật khẩu thất bại!');
            }

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

    // Đăng xuất và xóa sạch Token & Toàn bộ Session
    const dangXuat = () => {
        setNguoiDung(null);
        setToken(null);
        setDangMoModalAuth(false);

        if (typeof window !== 'undefined') {
            try {
                localStorage.removeItem(USER_STORAGE_KEY);
                localStorage.removeItem(TOKEN_STORAGE_KEY);
                localStorage.removeItem('tnt_laptop_user');
                localStorage.removeItem('tnt_laptop_token');
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('auth_user');
                sessionStorage.clear();
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
