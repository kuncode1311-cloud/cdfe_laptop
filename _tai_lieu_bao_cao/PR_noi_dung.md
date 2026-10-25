## Tóm tắt
Gia cố bảo mật Back-End theo **OWASP API Security Top 10** sau khi tự rà soát mã nguồn; cập nhật collection Postman cho khớp code mới.

## Thay đổi chính
**Toàn cục (`server.js`, `middleware/bao-mat.middleware.js`, `middleware/gioi-han-request.middleware.js`)**
- Security headers (`nosniff`, `X-Frame-Options: DENY`, CSP, HSTS ở production), ẩn `X-Powered-By`.
- Lọc NoSQL Injection: xóa khóa bắt đầu bằng `$` / chứa `.` trong body và params.
- Rate limit toàn cục 300 request/phút/IP. Mỗi bộ giới hạn đếm theo IP, không theo URL, nên không lách được bằng cách đổi tham số. Trả `RateLimit-*` và `Retry-After`.
- JSON hỏng → 400, body > 1 MB → 413, CORS sai → 403 (trước đây đều là 500).

**Xác thực (`xac-thuc.controller.js`, `xac-thuc.middleware.js`, `nguoi-dung.model.js`, `utils/bao-mat.js`)**
- OTP sinh bằng `crypto.randomInt`, chỉ lưu bản băm HMAC-SHA256, so sánh bằng `timingSafeEqual`, hủy sau 5 lần nhập sai, kiểm tra đúng loại OTP.
- Khóa đăng nhập 15 phút sau 5 lần sai mật khẩu. Email không tồn tại vẫn mất cùng thời gian phản hồi.
- Chính sách mật khẩu mới: ≥ 8 ký tự, có cả chữ và số (FE đã đồng bộ thông báo).
- JWT chỉ chấp nhận HS256. Google login bắt buộc `email_verified`, mật khẩu tài khoản Google là chuỗi ngẫu nhiên.
- `toJSON()` ẩn `matKhau`, `maOtp`, `hanOtp`, `tokenVersion` và các bộ đếm bảo mật (trước đây `/api/auth/toi` trả về OTP).
- Cập nhật hồ sơ chỉ nhận các trường được phép (chống Mass Assignment).

**Nghiệp vụ**
- Đơn hàng: chủ đơn xác định theo `id_nguoi_dung`, bỏ so khớp SĐT tự khai (chống IDOR). Trừ/hoàn kho nguyên tử. Đồng bộ `da_thanh_toan` ↔ `trang_thai_thanh_toan`. Làm sạch thông tin giao hàng.
- Thanh toán: chặn tạo link cho đơn đã thanh toán hoặc đã hủy. Webhook idempotent. API kiểm tra trạng thái không trả dữ liệu đơn.
- Voucher: trừ lượt nguyên tử, dùng `$addToSet`. Đánh giá: chỉ xác định đơn đã mua theo id, lọc URL ảnh.
- Quản trị người dùng: chỉ nhận các trường được phép; khóa tài khoản hoặc đổi vai trò thì thu hồi phiên ngay; admin không tự khóa hoặc tự xóa được mình.
- Tin tức: khách không xem được bản nháp. Escape regex ở sản phẩm, tin tức, liên hệ (chống ReDoS). Escape HTML trong email.

**Postman**
- Sửa TC18 (giờ kỳ vọng 401).
- Runner tăng lên 40 ca.
- Thêm thư mục "16. Kịch bản bảo mật nâng cao" (15 kịch bản).
- Đã xóa mật khẩu và token trong các file environment.

## Kiểm thử
- `node --check` toàn bộ BE; load thử mọi route.
- Chạy server local (đã tắt Telegram bot) với khoảng 20 ca kiểm thử chỉ đọc hoặc bị từ chối: TC18, TC31–TC40, 429 tra cứu đơn, webhook sai chữ ký, CORS… Tất cả đều trả đúng kết quả mong đợi.
- **Chưa chạy** các kịch bản có ghi dữ liệu (thư mục 16: khóa tài khoản, đăng xuất thu hồi token, trừ/hoàn kho). Cần chạy bằng Postman trên tài khoản thử.

## Lưu ý cho reviewer
- Tài khoản cũ có mật khẩu < 8 ký tự vẫn đăng nhập được; chính sách mới chỉ áp dụng khi đăng ký hoặc đổi mật khẩu.
- OTP đang hiệu lực dạng thô (dữ liệu cũ) vẫn so sánh được.
- Cần deploy lại Railway sau khi merge.
