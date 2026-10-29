const request = require('supertest');
const app = require('../../app');
const { moKetNoi, xoaDuLieu, dongKetNoi } = require('../helpers/co-so-du-lieu');
const { taoNguoiDung, taoTokenCho } = require('../helpers/du-lieu-mau');
const LienHe = require('../../models/lien-he.model');
const DanhGia = require('../../models/danh-gia.model');
const DonHang = require('../../models/don-hang.model');

beforeAll(moKetNoi);
afterEach(xoaDuLieu);
afterAll(dongKetNoi);

const taoAdminHeader = async () => {
    const admin = await taoNguoiDung({ vaiTro: 'admin' });
    return `Bearer ${taoTokenCho(admin)}`;
};

test('admin lưu và đọc lại cấu hình showroom', async () => {
    const auth = await taoAdminHeader();
    const showroom = { id: 'sr-test', ten: 'Showroom Test', dia_chi: '123 Đường Test', vi_do: 10.8, kinh_do: 106.7 };
    const luu = await request(app).put('/api/cai-dat/showroom').set('Authorization', auth)
        .send({ danh_sach_showroom: [showroom] });
    const doc = await request(app).get('/api/cai-dat/showroom');
    expect(luu.status).toBe(200);
    expect(doc.body.du_lieu[0]).toMatchObject(showroom);
});

test('admin xem, cập nhật và xóa phiếu liên hệ', async () => {
    const auth = await taoAdminHeader();
    const phieu = await LienHe.create({
        ma_yeu_cau: 'LH-TEST-001', ho_ten: 'Khách Test', so_dien_thoai: '0912345678',
        email: 'khach@example.test', noi_dung: 'Cần tư vấn', trang_thai: 'chua_xu_ly'
    });
    const danhSach = await request(app).get('/api/lien-he').set('Authorization', auth);
    const sua = await request(app).patch(`/api/lien-he/${phieu._id}`).set('Authorization', auth)
        .send({ trang_thai: 'dang_xu_ly', ghi_chu_noi_bo: 'Đã gọi' });
    const xoa = await request(app).delete(`/api/lien-he/${phieu._id}`).set('Authorization', auth);
    expect(danhSach.body.du_lieu).toHaveLength(1);
    expect(sua.status).toBe(200);
    expect(sua.body.du_lieu.trang_thai).toBe('dang_xu_ly');
    expect(xoa.status).toBe(200);
    expect(await LienHe.countDocuments()).toBe(0);
});

test('admin xem, ẩn và xóa đánh giá', async () => {
    const auth = await taoAdminHeader();
    await DanhGia.create({ id: 'dg-test', id_san_pham: 'sp-test', ho_ten: 'Khách Test', so_sao: 5, noi_dung: 'Tốt', hien_thi: true });
    const danhSach = await request(app).get('/api/danh-gia/quan-tri/tat-ca').set('Authorization', auth);
    const an = await request(app).patch('/api/danh-gia/dg-test/an-hien').set('Authorization', auth).send({ hien_thi: false });
    const xoa = await request(app).delete('/api/danh-gia/dg-test').set('Authorization', auth);
    expect(danhSach.body).toHaveLength(1);
    expect(an.status).toBe(200);
    expect(an.body.hien_thi).toBe(false);
    expect(xoa.status).toBe(200);
    expect(await DanhGia.countDocuments()).toBe(0);
});

test('admin ghi đè serial và thời hạn bảo hành cho đơn hàng', async () => {
    const auth = await taoAdminHeader();
    await DonHang.create({
        id: 'dh-test', ma_don_hang: 'LPN-TEST', ngay_tao: '29/10/2026',
        thong_tin_giao_hang: { so_dien_thoai: '0912345678' },
        danh_sach_san_pham: [{ id_muc: 'muc-test', san_pham_id: 'sp-test', so_luong: 1 }],
        tong_tien_thanh_toan: 1000000
    });
    const luu = await request(app).patch('/api/bao-hanh/ghi-de').set('Authorization', auth)
        .send({ ma_don_hang: 'LPN-TEST', id_muc: 'muc-test', so_serial: 'SERIAL-TEST', thoi_han_bao_hanh_thang: 24 });
    expect(luu.status).toBe(200);
    expect(luu.body.ghi_de.so_serial).toBe('SERIAL-TEST');
    expect(luu.body.ghi_de.thoi_han_bao_hanh_thang).toBe(24);
});
