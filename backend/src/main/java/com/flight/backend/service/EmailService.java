package com.flight.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromAddress;

    // Gửi email text thuần dùng chung (thông báo chuyến bay, ...). Ném ngoại lệ nếu SMTP lỗi.
    public void sendText(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        if (fromAddress != null && !fromAddress.isBlank()) {
            message.setFrom(fromAddress);
        }
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("easyflight-support@gmail.com"); // Email hiển thị người gửi
        message.setTo(toEmail); // Gửi tới email của khách hàng
        message.setSubject("[EasyFlight] - Mã xác thực đặt lại mật khẩu"); // Tiêu đề mail

        // Nội dung email
        String content = "Chào bạn,\n\n"
                + "Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản EasyFlight.\n"
                + "Mã OTP xác thực của bạn là: " + otpCode + "\n"
                + "Mã này có hiệu lực trong vòng 5 phút. Vui lòng không chia sẻ mã này cho bất kỳ ai.\n\n"
                + "Trân trọng,\n"
                + "Đội ngũ hỗ trợ EasyFlight.";

        message.setText(content);

        // Thực hiện gửi mail
        mailSender.send(message);
    }
}
