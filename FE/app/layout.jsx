import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./stars-bg.css";
import { AppProviders } from "@/contexts/AppProviders";
import BoKhungGiaoDien from "@/components/dieu-huong/BoKhungGiaoDien";

const fontChinh = Plus_Jakarta_Sans({
    subsets: ["latin", "vietnamese"],
    weight: ["300", "400", "500", "600", "700", "800"],
    variable: "--font-chinh",
});

export const metadata = {
    title: "TNTP LAPTOP // Hệ Thống Laptop Gaming, AI PC & Đồ Họa Hàng Đầu 2026",
    description: "TNTP LAPTOP - Hệ thống bán lẻ laptop công nghệ cao cấp hàng đầu Việt Nam. Đồng sáng lập bởi 4 thành viên: Lê Minh Trí, Mai Thống Nhất, Âu Lê Thành Tài, Lâm Đường Phú. Đại lý ủy quyền chính hãng ASUS ROG, Lenovo Legion, Dell, Apple, MSI, Acer, HP.",
    keywords: "tntp laptop, tnt laptop, laptop gaming, ai pc, laptop đồ họa, laptop mỏng nhẹ, macbook m3, rtx 4090, rtx 4080",
};

export default function RootLayout({ children }) {
    return (
        <html lang="vi" suppressHydrationWarning>
            <head>
                <link
                    rel="preload"
                    as="image"
                    href="/cinematic/frames/frame_00001.webp"
                    type="image/webp"
                    fetchPriority="high"
                />
            </head>
            <body className={`${fontChinh.variable} font-sans antialiased min-h-screen`} suppressHydrationWarning>
                <AppProviders>
                    <BoKhungGiaoDien>
                        {children}
                    </BoKhungGiaoDien>
                </AppProviders>
            </body>
        </html>
    );
}
