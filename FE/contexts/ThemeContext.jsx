'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const ThemeContext = createContext(undefined);

export function ThemeProvider({ children }) {
    const [chuDe, setChuDe] = useState('sang');
    const [daKhoiTao, setDaKhoiTao] = useState(false);

    useEffect(() => {
        // Luôn đặt mặc định là tone sáng theo yêu cầu
        try {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('laptopnew_chu_de', 'sang');
        } catch (e) {
            console.error(e);
        }
        setChuDe('sang');
        setDaKhoiTao(true);
    }, []);

    const datChuDe = (cd) => {
        setChuDe(cd);
        if (typeof window !== 'undefined') {
            try {
                localStorage.setItem('laptopnew_chu_de', cd);
                if (cd === 'toi') {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    const chuyenDoiChuDe = () => {
        datChuDe(chuDe === 'sang' ? 'toi' : 'sang');
    };

    return (
        <ThemeContext.Provider
            value={{
                chu_de: chuDe,
                theme: chuDe,
                chuyenDoiChuDe,
                toggleTheme: chuyenDoiChuDe,
                datChuDe,
                setTheme: datChuDe
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

// Alias tương thích
export const useGiaoDien = useTheme;
export const NhaCungCapGiaoDien = ThemeProvider;
export const NguCanhGiaoDien = ThemeContext;
