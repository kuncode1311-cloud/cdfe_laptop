# scripts-local — script chạy tay ở máy local

Các file trong thư mục này **không thuộc ứng dụng**: server (`server.js`, `app.js`) không bao giờ gọi tới chúng.
Chúng là công cụ dùng một lần khi phát triển để nạp dữ liệu mẫu hoặc chuyển đổi dữ liệu. ESLint và Prettier bỏ qua thư mục này.

> ⚠️ **Mọi script đều kết nối tới database ghi trong `BE/.env` (`MONGODB_URI`).**
> Nếu `.env` đang trỏ tới database production thì chạy script là **ghi / xóa dữ liệu thật**.
> Chỉ chạy khi đã trỏ `MONGODB_URI` sang database thử nghiệm.

| Script | Việc làm | Xóa dữ liệu? |
|---|---|---|
| `bo-sung-slug.js` | Thêm `slug` URL cho sản phẩm cũ (`npm run migrate:slug`) | Không |
| `nap-du-lieu.js` | Xóa rồi nạp lại 5 bộ dữ liệu: **sản phẩm, người dùng, đơn hàng, đánh giá, mã giảm giá** (sản phẩm đọc từ `backup_db/`) | **Có — nguy hiểm nhất** |
| `nap-don-hang-mau.js` | Nạp đơn hàng mẫu | **Có** |
| `nap-sieu-du-lieu-danh-gia.js` | Nạp lượng lớn đánh giá mẫu | **Có** |
| `nap-voucher-shopee.js` | Nạp bộ mã giảm giá mẫu | **Có** |
| `them-danh-gia-hop-le.js` | Thêm đánh giá hợp lệ cho một số người dùng thật | Không |
| `them-phu-kien.js` | Thêm sản phẩm phụ kiện | Không |
| `dong-bo-toan-dien-shop.js` | Đồng bộ danh mục / thông tin sản phẩm cho đồng nhất | Không |
| `dong-bo-danh-gia-toan-dien.js` | Đồng bộ lại dữ liệu đánh giá | **Có** |
| `dong-bo-khuyen-mai-chuan.js` | Đồng bộ lại dữ liệu khuyến mãi | **Có** |

Chạy một script: `node scripts-local/<tên-file>.js` (đứng trong thư mục `BE`).
