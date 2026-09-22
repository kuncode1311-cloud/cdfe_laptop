'use client';
import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { CompareProvider } from './CompareContext';
import { WishlistProvider } from './WishlistContext';
import ModalDangNhapDangKy from '@/components/tai-khoan/ModalDangNhapDangKy';
import { Toaster } from 'sonner';

export function AppProviders({ children }) {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <CompareProvider>
                        <WishlistProvider>
                            {children}
                            <ModalDangNhapDangKy />
                            <Toaster 
                                position="bottom-right" 
                                richColors 
                                closeButton 
                                expand={false}
                                duration={3500}
                                style={{ zIndex: 9999999 }}
                                toastOptions={{
                                    style: {
                                        fontFamily: 'var(--font-chinh), sans-serif',
                                    },
                                    className: 'font-sans text-sm'
                                }}
                            />
                        </WishlistProvider>
                    </CompareProvider>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default AppProviders;
export const NhaCungCapUngDung = AppProviders;
