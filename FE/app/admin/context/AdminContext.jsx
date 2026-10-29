'use client';
import { createContext, useContext } from 'react';

export const AdminContext = createContext(null);

// Trang con lấy dữ liệu đã được khung quản trị khởi tạo.
export function useAdmin() {
    const context = useContext(AdminContext);
    if (!context) throw new Error('useAdmin phải nằm trong KhungQuanTri');
    return context;
}
