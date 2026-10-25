[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$imagesFolder = "E:\Desktop\trikun\chuyende_FRONTREND\LAPTOP_NEW\_tai_lieu_bao_cao\SLIDE"
$outputPptx = "E:\Desktop\trikun\chuyende_FRONTREND\LAPTOP_NEW\_tai_lieu_bao_cao\LAPTOPNEW_SLIDE_BAO_CAO.pptx"

if (Test-Path $outputPptx) {
    Remove-Item $outputPptx -Force
}

$slidesData = @(
    @{
        Number = 1
        File = "1.png"
        Title = "Bìa Báo cáo Đồ án LaptopNew"
        Notes = "Kính thưa Thầy Cô và các bạn, hôm nay nhóm chúng em xin đại diện báo cáo đề tài Chuyên đề Back-End: 'Xây dựng hệ thống Back-End cho website thương mại điện tử bán laptop LaptopNew'. Đề tài được hướng dẫn bởi Thầy ThS. Nguyễn Minh Hải, do 2 sinh viên Lê Minh Trí và Âu Lê Thành Tài thực hiện."
    },
    @{
        Number = 2
        File = "2.png"
        Title = "Đặt vấn đề: Vì sao cần hệ thống Back-End hiện đại?"
        Notes = "Về lý do chọn đề tài: Các website bán laptop truyền thống hiện nay thường gặp 4 bài toán lớn: xử lý đơn hàng thủ công chậm trễ, bảo mật thanh toán và dữ liệu còn sơ sài, tồn kho dễ bị sai lệch khi nhiều người cùng mua, và thiếu hẳn kênh tư vấn tự động 24/7. Vì vậy, nhóm quyết định xây dựng hệ thống Back-End hiện đại để giải quyết triệt để các vấn đề này."
    },
    @{
        Number = 3
        File = "3.png"
        Title = "Mục tiêu cốt lõi của đề tài"
        Notes = "Để giải quyết thực trạng trên, nhóm đặt ra 4 mục tiêu cốt lõi: Thứ nhất, xây dựng hệ thống API RESTful bảo mật và chuẩn hóa; Thứ hai, tích hợp cổng thanh toán trực tuyến VietQR tự động xác nhận qua Webhook; Thứ ba, tích hợp Trợ lý ảo AI tư vấn cấu hình laptop 24/7 bằng Google Gemini; Thứ tư, xây dựng hệ thống quản trị vận hành với Dashboard trực quan và bot Telegram báo đơn tức thì."
    },
    @{
        Number = 4
        File = "4.png"
        Title = "Kiến trúc 5 lớp & Công nghệ nền tảng Back-End"
        Notes = "Về mặt kiến trúc, hệ thống được thiết kế theo mô hình 5 lớp chuyên biệt: Route nhận request, Middleware kiểm soát an ninh, Controller điều hướng, Service xử lý nghiệp vụ, và Model truy xuất dữ liệu. Nền tảng Node.js 24 + Express 5 kết hợp cơ sở dữ liệu đám mây MongoDB Atlas với 13 collections, cung cấp 82 route API được tài liệu hóa chuẩn quốc tế trên Swagger API Docs."
    },
    @{
        Number = 5
        File = "5.png"
        Title = "Đối tượng sử dụng & Phân quyền hệ thống"
        Notes = "Đối với hệ thống người dùng và phân quyền, nhóm phân tách rõ ràng 2 nhóm: Khách hàng mua laptop có thể đăng ký tài khoản nhanh qua mã OTP gửi về Gmail trong 3 giây hoặc đăng nhập 1 chạm bằng Google. Quản trị viên có trang quản trị riêng để quản lý kho và đơn hàng. Hệ thống hỗ trợ lấy lại mật khẩu tự động và có cơ chế tự khóa tài khoản nếu nhập sai quá 5 lần để chống dò mật khẩu."
    },
    @{
        Number = 6
        File = "6.png"
        Title = "Giỏ hàng & Quản lý tồn kho nguyên tử"
        Notes = "Trong quy trình mua hàng, hệ thống có giỏ hàng thông minh và tính năng áp mã giảm giá Voucher. Đặc biệt, để chống bán lố khi nhiều người cùng tranh mua máy cuối cùng, nhóm áp dụng giải thuật trừ tồn kho nguyên tử (Atomic Lock) ngay trong cơ sở dữ liệu. Khách đặt hàng sẽ được giữ máy 15 phút, nếu hủy đơn hoặc quá hạn thì hệ thống sẽ tự động hoàn trả số lượng vào kho ngay lập tức."
    },
    @{
        Number = 7
        File = "7.png"
        Title = "Thanh toán VietQR tự động qua Webhook"
        Notes = "Về thanh toán, hệ thống tự động sinh mã VietQR chính xác số tiền và nội dung đơn hàng, hỗ trợ mọi app ngân hàng và ví điện tử tại Việt Nam. Khi khách quét mã chuyển tiền, cổng thanh toán PayOS lập tức gửi Webhook có kèm chữ ký số HMAC-SHA256 về máy chủ. Hệ thống tự động xác nhận đơn thành công trong 1 đến 2 giây mà không cần F5, đồng thời gửi ngay hóa đơn điện tử về email cho khách."
    },
    @{
        Number = 8
        File = "8.png"
        Title = "Trợ lý ảo Gemini AI tư vấn khách hàng 24/7"
        Notes = "Để tối ưu trải nghiệm khách hàng, nhóm tích hợp Trợ lý ảo AI hoạt động 24/7 bằng Google Gemini. Khách chỉ cần nhắn câu hỏi bằng ngôn ngữ tự nhiên, AI sẽ phân tích nhu cầu và túi tiền để tư vấn cấu hình phù hợp nhất. Điểm đặc biệt là AI được đồng bộ với kho dữ liệu thật của cửa hàng, nên chỉ giới thiệu những dòng laptop đang có sẵn trong kho."
    },
    @{
        Number = 9
        File = "9.png"
        Title = "Vận hành quản trị & Thông báo tức thì qua Telegram"
        Notes = "Về quản trị vận hành, hệ thống giải phóng chủ cửa hàng khỏi việc phải ngồi canh máy tính. Mỗi khi có đơn đặt mua mới, Telegram Bot sẽ lập tức báo về điện thoại kèm nút bấm duyệt đơn 1 chạm. Quản trị viên chỉ cần bấm duyệt ngay trên Telegram là đơn hàng tự động chuyển trạng thái, đồng thời đồng bộ thời gian thực về Dashboard Admin."
    },
    @{
        Number = 10
        File = "10.png"
        Title = "Bảo vệ an toàn thông tin 9 lớp chuẩn OWASP"
        Notes = "Vấn đề an toàn bảo mật được nhóm đầu tư rất kỹ lưỡng với hệ thống phòng thủ 9 lớp chuẩn OWASP: mã hóa dữ liệu khách hàng, chống spam làm nghẽn web, chống xem trộm đơn hàng chéo. Nhóm đã tự thực nghiệm tấn công rà soát mã nguồn, vá thành công 21 lỗ hổng bảo mật tiềm ẩn và chặn đứng 100% các kịch bản phá hoại thử nghiệm."
    },
    @{
        Number = 11
        File = "11.png"
        Title = "Kiểm thử toàn diện, Triển khai thực tế Cloud & Lời cảm ơn"
        Notes = "Tổng kết lại, toàn bộ các chức năng đã vượt qua 100% các bài kiểm thử tự động. Website LaptopNew hiện đã được triển khai chạy thật trên môi trường Cloud với tên miền chính thức trikun.site. Nhóm kính mời Thầy Cô và các bạn quét mã QR trên slide để cùng trải nghiệm trực tiếp hệ thống. Nhóm chúng em xin chân thành cảm ơn Thầy Cô đã chú ý lắng nghe và mong nhận được ý kiến đóng góp từ Thầy Cô!"
    }
)

Write-Host "Starting PowerPoint COM Application..."
$pptApp = New-Object -ComObject PowerPoint.Application

try {
    # Create invisible presentation
    $presentation = $pptApp.Presentations.Add([Microsoft.Office.Core.MsoTriState]::msoFalse)
    
    # Set 16:9 widescreen: 960 x 540 points (13.333 x 7.5 inches)
    $presentation.PageSetup.SlideWidth = 960
    $presentation.PageSetup.SlideHeight = 540

    $ppLayoutBlank = 12
    $msoFalse = [Microsoft.Office.Core.MsoTriState]::msoFalse
    $msoTrue = [Microsoft.Office.Core.MsoTriState]::msoTrue

    foreach ($slideInfo in $slidesData) {
        $imgPath = Join-Path $imagesFolder $slideInfo.File
        if (-not (Test-Path $imgPath)) {
            Write-Error "File not found: $imgPath"
            continue
        }

        Write-Host "Adding Slide $($slideInfo.Number): $($slideInfo.Title)"
        $slide = $presentation.Slides.Add($slideInfo.Number, $ppLayoutBlank)

        # Insert picture full slide 16:9 (0, 0, 960, 540)
        $pic = $slide.Shapes.AddPicture($imgPath, $msoFalse, $msoTrue, 0, 0, 960, 540)

        # Set transition effect: Fade Through Black (Mờ qua màu đen, ppEffectFade = 1793)
        try {
            $slide.SlideShowTransition.EntryEffect = 1793 # Fade Through Black (Mờ đen)
            $slide.SlideShowTransition.Duration = 0.75   # 0.75s mờ đen êm dịu, chuẩn thuyết trình
            $slide.SlideShowTransition.AdvanceOnClick = $msoTrue
        } catch {
            Write-Warning "Could not set transition on slide $($slideInfo.Number)"
        }

        # Add speaker notes
        try {
            $notesPage = $slide.NotesPage
            # Placeholder item 2 is the body text placeholder for speaker notes
            $noteShape = $notesPage.Shapes.Placeholders.Item(2)
            $noteShape.TextFrame.TextRange.Text = $slideInfo.Notes
        } catch {
            Write-Warning "Could not add notes to slide $($slideInfo.Number)"
        }
    }

    Write-Host "Saving presentation to: $outputPptx"
    $presentation.SaveAs($outputPptx)
    Write-Host "Presentation saved successfully!"
}
finally {
    if ($presentation) {
        $presentation.Close()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($presentation) | Out-Null
    }
    if ($pptApp) {
        $pptApp.Quit()
        [System.Runtime.InteropServices.Marshal]::ReleaseComObject($pptApp) | Out-Null
    }
    [System.GC]::Collect()
    [System.GC]::WaitForPendingFinalizers()
}

Write-Host "FINISHED SUCCESSFULLY!"
