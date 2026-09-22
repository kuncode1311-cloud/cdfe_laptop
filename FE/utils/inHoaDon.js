/**
 * Tiện ích in Hóa đơn bán hàng & Phiếu xuất kho chuẩn Hiện Đại (Minimalist Retail Invoice)
 * Chuẩn A4, luôn nằm gọn 100% trong đúng 1 trang duy nhất, thẳng hàng, thanh lịch như Apple / FPT / CellphoneS.
 */

import { dinhDangTienVND } from './formatCurrency';

/**
 * Đọc số tiền VNĐ thành chữ tiếng Việt
 */
export function docSoTienThanhChu(soTien) {
    if (!soTien || isNaN(soTien) || soTien <= 0) return 'Không đồng';
    const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const Tien = ['', ' nghìn', ' triệu', ' tỷ', ' nghìn tỷ', ' triệu tỷ'];

    function docBlock3(so, dayDu) {
        let tram = Math.floor(so / 100);
        let chuc = Math.floor((so % 100) / 10);
        let donVi = so % 10;
        let ketQua = '';

        if (tram > 0 || dayDu) {
            ketQua += ' ' + ChuSo[tram] + ' trăm';
        }
        if (chuc > 1) {
            ketQua += ' ' + ChuSo[chuc] + ' mươi';
            if (donVi === 1) ketQua += ' mốt';
            else if (donVi === 5) ketQua += ' lăm';
            else if (donVi > 0) ketQua += ' ' + ChuSo[donVi];
        } else if (chuc === 1) {
            ketQua += ' mười';
            if (donVi === 1) ketQua += ' một';
            else if (donVi === 5) ketQua += ' lăm';
            else if (donVi > 0) ketQua += ' ' + ChuSo[donVi];
        } else if (dayDu && donVi > 0) {
            ketQua += ' lẻ ' + ChuSo[donVi];
        } else if (donVi > 0) {
            ketQua += ' ' + ChuSo[donVi];
        }
        return ketQua;
    }

    let viTri = 0;
    let ketQua = '';
    let temp = Math.round(Number(soTien));

    while (temp > 0) {
        let so3 = temp % 1000;
        if (so3 > 0) {
            let s = docBlock3(so3, temp > 999);
            ketQua = s + Tien[viTri] + ketQua;
        }
        temp = Math.floor(temp / 1000);
        viTri++;
    }

    ketQua = ketQua.trim();
    if (!ketQua) return 'Không đồng';
    return ketQua.charAt(0).toUpperCase() + ketQua.slice(1) + ' đồng chẵn.';
}

/**
 * Tạo mã HTML hóa đơn chuẩn hiện đại, siêu gọn gàng, chuẩn 1 trang A4
 */
export function taoHtmlHoaDon(dh, danhSachSanPham = []) {
    if (!dh) return '';

    const thongTinGiao = dh.thong_tin_giao_hang || {};
    const hoTen = thongTinGiao.ho_ten || thongTinGiao.ho_va_ten || 'Khách hàng vãng lai';
    const soDienThoai = thongTinGiao.so_dien_thoai || '—';
    const diaChi = [
        thongTinGiao.dia_chi_chi_tiet,
        thongTinGiao.quan_huyen,
        thongTinGiao.tinh_thanh
    ].filter(Boolean).join(', ') || 'Showroom TNTP Laptop';

    const ghiChu = thongTinGiao.ghi_chu || '';
    const ngayDat = dh.ngay_tao || (dh.createdAt ? new Date(dh.createdAt).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }) : new Date().toLocaleDateString('vi-VN'));

    const laDaThanhToan = !!dh.da_thanh_toan;
    const hinhThucTT = dh.hinh_thuc_thanh_toan === 'chuyen_khoan_vietqr' ? 'Chuyển khoản VietQR' : 'Tiền mặt khi giao (COD)';
    const tongTien = dh.tong_tien_thanh_toan || 0;
    const tamTinh = dh.tam_tinh || tongTien;
    const giamGia = dh.tien_giam_gia || 0;
    const soTienThuCod = laDaThanhToan ? 0 : tongTien;

    // Danh sách sản phẩm
    const dsSP = (dh.danh_sach_san_pham && dh.danh_sach_san_pham.length > 0) ? dh.danh_sach_san_pham : [];

    const hangSanPhamHtml = dsSP.map((item, index) => {
        const spGoc = (Array.isArray(danhSachSanPham) ? danhSachSanPham : []).find(p =>
            p.id === (item.san_pham_id || item.id_san_pham) ||
            p._id === (item.san_pham_id || item.id_san_pham) ||
            p.ma_san_pham === (item.san_pham_id || item.id_san_pham) ||
            p.ten_san_pham === item.ten_san_pham
        ) || item.san_pham || {};

        const tenSP = item.ten_san_pham || spGoc.ten_san_pham || 'Sản phẩm công nghệ';
        const sku = spGoc.ma_san_pham || item.san_pham_id || 'LPN-SKU';
        const soLuong = item.so_luong || 1;
        const donGia = item.gia_tai_thoi_diem_them || item.don_gia || spGoc.gia_khuyen_mai || 0;
        const thanhTien = donGia * soLuong;
        const baoHanh = spGoc.thong_so?.che_do_bao_hanh || '24 tháng chính hãng';

        return `
            <tr>
                <td style="text-align: center; color: #6b7280; font-size: 11px;">${index + 1}</td>
                <td>
                    <div style="font-weight: 700; color: #111827; font-size: 12.5px;">${tenSP}</div>
                    <div style="color: #6b7280; font-size: 11px; margin-top: 2px;">
                        Mã SP: <span style="font-family: monospace; font-weight: 600; color: #374151;">${sku}</span>
                    </div>
                </td>
                <td style="text-align: center; color: #374151; font-size: 11.5px;">${baoHanh}</td>
                <td style="text-align: center; font-weight: 700; color: #111827; font-size: 12px;">${soLuong}</td>
                <td style="text-align: right; font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 12px; color: #374151;">${dinhDangTienVND(donGia)}</td>
                <td style="text-align: right; font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 12.5px; font-weight: 700; color: #111827;">${dinhDangTienVND(thanhTien)}</td>
            </tr>
        `;
    }).join('');

    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <title>Hóa đơn bán hàng - ${dh.ma_don_hang}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 12mm 15mm;
        }
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1f2937;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 12px;
            line-height: 1.4;
        }
        .invoice-box {
            width: 100%;
            max-width: 100%;
            margin: 0 auto;
        }
        /* HEADER */
        .invoice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
            border-bottom: 2px solid #111827;
        }
        .brand-name {
            font-size: 18px;
            font-weight: 900;
            color: #111827;
            letter-spacing: 0.5px;
            text-transform: uppercase;
            margin: 0 0 3px 0;
        }
        .store-sub {
            font-size: 11px;
            color: #4b5563;
            margin: 2px 0;
        }
        .invoice-title-block {
            text-align: right;
        }
        .invoice-title {
            font-size: 18px;
            font-weight: 900;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
        }
        .invoice-code {
            font-family: monospace;
            font-size: 13px;
            font-weight: 800;
            color: #1e40af;
        }
        .invoice-date {
            font-size: 11px;
            color: #6b7280;
            margin-top: 2px;
        }

        /* CUSTOMER & SHIPPING GRID */
        .meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        .meta-col h3 {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
            font-weight: 800;
            margin: 0 0 6px 0;
        }
        .meta-row {
            margin: 3px 0;
            font-size: 12px;
            display: flex;
        }
        .meta-label {
            width: 95px;
            color: #6b7280;
            flex-shrink: 0;
        }
        .meta-val {
            color: #111827;
            font-weight: 600;
        }
        .meta-val-highlight {
            font-weight: 700;
            color: #111827;
        }
        .payment-status-tag {
            display: inline-block;
            font-weight: 700;
            font-size: 11.5px;
            color: ${laDaThanhToan ? '#15803d' : '#b45309'};
        }

        /* TABLE */
        .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 14px;
        }
        .invoice-table th {
            text-align: left;
            padding: 7px 6px;
            font-size: 11px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #111827;
            border-top: 1.5px solid #111827;
            border-bottom: 1.5px solid #111827;
        }
        .invoice-table td {
            padding: 9px 6px;
            border-bottom: 1px solid #f3f4f6;
            vertical-align: top;
        }

        /* SUMMARY RIGHT ALIGNED */
        .summary-container {
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        .summary-box {
            width: 330px;
            border-collapse: collapse;
        }
        .summary-box td {
            padding: 4px 6px;
            font-size: 12px;
        }
        .summary-box .lbl {
            color: #4b5563;
            text-align: left;
        }
        .summary-box .val {
            text-align: right;
            font-family: -apple-system, BlinkMacSystemFont, monospace;
            font-weight: 600;
            color: #111827;
        }
        .summary-box tr.grand-total td {
            border-top: 1.5px solid #111827;
            border-bottom: 1.5px solid #111827;
            padding: 6px 6px;
            font-weight: 800;
            font-size: 13.5px;
            color: #111827;
        }
        .summary-box tr.cod-line td {
            padding: 6px 6px;
            font-weight: 800;
            font-size: 12.5px;
            color: ${laDaThanhToan ? '#15803d' : '#b45309'};
        }

        .words-line {
            font-size: 11.5px;
            color: #374151;
            font-style: italic;
            margin-top: 6px;
            text-align: right;
        }

        /* POLICY & SIGNATURE */
        .footer-terms {
            margin-top: 16px;
            padding: 8px 12px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 3px solid #3b82f6;
            font-size: 11px;
            color: #4b5563;
            line-height: 1.45;
        }

        .signatures-container {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            text-align: center;
            margin-top: 24px;
            page-break-inside: avoid;
        }
        .sign-col h4 {
            margin: 0;
            font-size: 11.5px;
            font-weight: 800;
            text-transform: uppercase;
            color: #111827;
        }
        .sign-col p {
            margin: 2px 0 0 0;
            font-size: 10px;
            color: #6b7280;
            font-style: italic;
        }
        .sign-space {
            height: 55px;
        }

        .bottom-tagline {
            text-align: center;
            margin-top: 18px;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px dashed #e5e7eb;
            padding-top: 8px;
        }
    </style>
</head>
<body>
    <div class="invoice-box">
        <!-- 1. HEADER DOANH NGHIỆP & MÃ ĐƠN -->
        <div class="invoice-header">
            <div>
                <div class="brand-name">TNTP LAPTOP & PC GAMING</div>
                <div class="store-sub">📍 85 Đại Lộ Hòa Bình, P. Tân An, Q. Ninh Kiều, TP. Cần Thơ</div>
                <div class="store-sub">📞 Hotline: <strong>1900 8686</strong> • Website: <strong>tntplaptop.vn</strong></div>
            </div>
            <div class="invoice-title-block">
                <div class="invoice-title">HÓA ĐƠN BÁN HÀNG</div>
                <div class="invoice-code">${dh.ma_don_hang}</div>
                <div class="invoice-date">Ngày lập: ${ngayDat}</div>
            </div>
        </div>

        <!-- 2. THÔNG TIN KHÁCH HÀNG & GIAO HÀNG (2 CỘT TỐI GIẢN) -->
        <div class="meta-grid">
            <div class="meta-col">
                <h3>Khách hàng & Giao nhận</h3>
                <div class="meta-row">
                    <span class="meta-label">Người nhận:</span>
                    <span class="meta-val meta-val-highlight">${hoTen}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Điện thoại:</span>
                    <span class="meta-val" style="font-family: monospace; font-size: 12.5px;">${soDienThoai}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Địa chỉ giao:</span>
                    <span class="meta-val">${diaChi}</span>
                </div>
            </div>

            <div class="meta-col">
                <h3>Thanh toán & Vận chuyển</h3>
                <div class="meta-row">
                    <span class="meta-label">Hình thức TT:</span>
                    <span class="meta-val">${hinhThucTT}</span>
                </div>
                <div class="meta-row">
                    <span class="meta-label">Trạng thái:</span>
                    <span class="meta-val payment-status-tag">
                        ${laDaThanhToan ? '✓ Đã thanh toán (0 ₫)' : `⚠️ Thu tiền khi giao (COD)`}
                    </span>
                </div>
                ${ghiChu ? `
                <div class="meta-row" style="margin-top: 4px;">
                    <span class="meta-label">Ghi chú:</span>
                    <span class="meta-val" style="color: #b45309; font-style: italic;">"${ghiChu}"</span>
                </div>
                ` : ''}
            </div>
        </div>

        <!-- 3. BẢNG MẶT HÀNG (MINIMALIST TABLE) -->
        <table class="invoice-table">
            <thead>
                <tr>
                    <th style="width: 35px; text-align: center;">#</th>
                    <th>Sản phẩm / Mặt hàng</th>
                    <th style="width: 120px; text-align: center;">Bảo hành</th>
                    <th style="width: 45px; text-align: center;">SL</th>
                    <th style="width: 110px; text-align: right;">Đơn giá</th>
                    <th style="width: 120px; text-align: right;">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                ${hangSanPhamHtml}
            </tbody>
        </table>

        <!-- 4. KHỐI TỔNG KẾT TÀI CHÍNH (CANH THẲNG HÀNG 100%) -->
        <div class="summary-container">
            <table class="summary-box">
                <tr>
                    <td class="lbl">Tiền hàng:</td>
                    <td class="val">${dinhDangTienVND(tamTinh)}</td>
                </tr>
                ${giamGia > 0 ? `
                <tr>
                    <td class="lbl" style="color: #15803d;">Giảm giá ${dh.ma_giam_gia ? `(${dh.ma_giam_gia})` : ''}:</td>
                    <td class="val" style="color: #15803d;">-${dinhDangTienVND(giamGia)}</td>
                </tr>
                ` : ''}
                <tr>
                    <td class="lbl">Phí vận chuyển:</td>
                    <td class="val" style="color: #15803d;">0 ₫ (Miễn phí)</td>
                </tr>
                <tr class="grand-total">
                    <td class="lbl" style="font-weight: 800; color: #111827;">TỔNG THANH TOÁN:</td>
                    <td class="val" style="font-weight: 900; color: #111827; font-size: 13.5px;">${dinhDangTienVND(tongTien)}</td>
                </tr>
                <tr class="cod-line">
                    <td class="lbl" style="font-weight: 800;">
                        ${laDaThanhToan ? 'Cần thu tận nơi:' : '⚠️ THỰC THU (COD):'}
                    </td>
                    <td class="val" style="font-weight: 900; font-size: 13px;">
                        ${laDaThanhToan ? '0 ₫ (Đã thanh toán)' : dinhDangTienVND(soTienThuCod)}
                    </td>
                </tr>
            </table>
        </div>

        <div class="words-line">
            Bằng chữ: <strong>${docSoTienThanhChu(tongTien)}</strong>
        </div>

        <!-- 5. ĐIỀU KHOẢN GIAO NHẬN NGẮN GỌN -->
        <div class="footer-terms">
            <strong>* Quy định nhận hàng & bảo hành:</strong> Quý khách vui lòng đồng kiểm ngoại quan máy và phụ kiện trước khi nhận hàng. Hỗ trợ 1 đổi 1 trong vòng 30 ngày nếu phát sinh lỗi phần cứng do nhà sản xuất. Bảo hành điện tử chính hãng theo Số điện thoại mua hàng.
        </div>

        <!-- 6. CHỮ KÝ 3 BÊN -->
        <div class="signatures-container">
            <div class="sign-col">
                <h4>Người Nhận Hàng</h4>
                <p>(Ký, ghi rõ họ tên)</p>
                <div class="sign-space"></div>
            </div>
            <div class="sign-col">
                <h4>Nhân Viên Giao Hàng</h4>
                <p>(Ký, ghi rõ họ tên)</p>
                <div class="sign-space"></div>
            </div>
            <div class="sign-col">
                <h4>Đại Diện Bán Hàng</h4>
                <p>(Ký, đóng dấu)</p>
                <div class="sign-space"></div>
            </div>
        </div>

        <div class="bottom-tagline">
            Cảm ơn Quý khách đã mua sắm tại TNTP Laptop! Hotline hỗ trợ: 1900 8686
        </div>
    </div>
</body>
</html>
    `;
}

/**
 * Kích hoạt in hóa đơn bằng iframe sạch
 */
export function inHoaDonBanHang(dh, danhSachSanPham = []) {
    if (!dh || typeof window === 'undefined') return;

    try {
        const html = taoHtmlHoaDon(dh, danhSachSanPham);

        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        iframe.style.visibility = 'hidden';
        document.body.appendChild(iframe);

        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();

        iframe.contentWindow.focus();
        setTimeout(() => {
            iframe.contentWindow.print();
            setTimeout(() => {
                try {
                    document.body.removeChild(iframe);
                } catch (err) {}
            }, 1500);
        }, 300);
    } catch (e) {
        console.error('Lỗi in hóa đơn:', e);
        window.print();
    }
}
