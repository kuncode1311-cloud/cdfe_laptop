'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useNguoiDung } from '@/contexts/AuthContext';
import { ShieldAlert, ShieldCheck, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

/**
 * Route Guard bảo vệ nghiêm ngặt toàn bộ trang /admin
 * - Chặn 100% khách vãng lai, người dùng chưa đăng nhập hoặc khách hàng thường
 * - Chỉ cho phép người dùng có vaiTro === 'admin'
 * - Tự động đẩy về trang chủ và thông báo từ chối truy cập
 */
export default function AdminLayout({ children }) {
    const { nguoiDung, daDangNhap, laAdmin, dangKiemTraPhien } = useNguoiDung();
    const router = useRouter();

    const daXacThucAdmin = Boolean(!dangKiemTraPhien && daDangNhap && (laAdmin || nguoiDung?.vaiTro === 'admin'));

    useEffect(() => {
        if (!dangKiemTraPhien) {
            if (!daDangNhap || (!laAdmin && nguoiDung?.vaiTro !== 'admin')) {
                toast.error('Truy cập bị từ chối! Khu vực này chỉ dành cho Quản Trị Viên TNTP.');
                router.replace('/');
            }
        }
    }, [dangKiemTraPhien, daDangNhap, laAdmin, nguoiDung, router]);

    // 1. Khi hệ thống đang kiểm tra phiên đăng nhập từ localStorage / server (tránh chớp nháy):
    if (dangKiemTraPhien) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-6 select-none">
                <div className="relative flex items-center justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center animate-pulse shadow-lg shadow-blue-500/10">
                        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-widest text-blue-400">TNTP Security Shield</span>
                </div>
                <p className="text-sm font-semibold text-slate-400">Đang xác thực quyền Quản trị viên...</p>
            </div>
        );
    }

    // 2. Nếu người dùng chưa đăng nhập hoặc không có vai trò admin: Chặn đứng hoàn toàn
    if (!daXacThucAdmin) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-6 text-center select-none">
                <div className="w-20 h-20 rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/10 animate-bounce">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[11px] font-black uppercase tracking-widest mb-3">
                    403 - Quyền Truy Cập Bị Từ Chối
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                    Khu Vực Quản Trị Viên TNTP
                </h1>
                <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
                    Bạn không có quyền truy cập vào bảng điều khiển quản trị hệ thống. Nếu bạn là quản trị viên, vui lòng đăng nhập bằng tài khoản Quản Trị.
                </p>
                <div className="flex items-center gap-3">
                    <Link
                        href="/"
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
                    >
                        Quay Về Trang Chủ
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Người dùng hợp lệ là Quản Trị Viên -> Cho phép render Admin Dashboard
    return children;
}
