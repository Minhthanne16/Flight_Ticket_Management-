package com.flight.backend.service;

import com.flight.backend.dto.notification.NotificationRequest;
import com.flight.backend.dto.notification.NotificationResponse;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Notification;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.entity.enums.NotificationChannel;
import com.flight.backend.entity.enums.NotificationStatus;
import com.flight.backend.entity.enums.NotificationType;
import com.flight.backend.repository.BookingRepository;
import com.flight.backend.repository.NotificationRepository;
import com.flight.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    private final BookingRepository bookingRepository;

    private final EmailService emailService;

    // STAFF tạo notification
    public NotificationResponse createNotification(
            NotificationRequest request
    ) {

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng")
                );

        Booking booking = null;

        if (request.getBookingId() != null) {

            booking = bookingRepository.findById(request.getBookingId())
                    .orElseThrow(() ->
                            new RuntimeException("Không tìm thấy booking")
                    );
        }

        Notification notification = new Notification();

        notification.setUser(user);
        notification.setBooking(booking);
        notification.setType(request.getType());
        notification.setChannel(request.getChannel());
        notification.setTitle(request.getTitle());
        notification.setContent(request.getContent());

        // trạng thái ban đầu
        notification.setStatus(NotificationStatus.PENDING);

        notification.setSentAt(LocalDateTime.now());

        Notification savedNotification =
                notificationRepository.save(notification);

        // Gửi email thật nếu kênh là EMAIL; trạng thái phản ánh kết quả gửi.
        boolean delivered = true;
        if (request.getChannel() == NotificationChannel.EMAIL) {
            delivered = trySendEmail(user, request.getTitle(), request.getContent());
        }
        savedNotification.setStatus(
                delivered ? NotificationStatus.SENT : NotificationStatus.FAILED);

        Notification updatedNotification =
                notificationRepository.save(savedNotification);

        if (!delivered) {
            throw new RuntimeException(
                    "Đã lưu thông báo nhưng gửi email thất bại. Kiểm tra cấu hình SMTP hoặc email người nhận.");
        }

        return mapToResponse(updatedNotification);
    }

    // Gửi thông báo (kèm email nếu chọn EMAIL) cho TẤT CẢ khách có vé còn hiệu lực trên 1 chuyến bay.
    // Trả về số khách đã gửi email thành công.
    @Transactional
    public int notifyFlightCustomers(
            Long flightId,
            NotificationType type,
            NotificationChannel channel,
            String title,
            String content
    ) {

        List<Booking> bookings = bookingRepository.findByFlight_Id(flightId);

        // Gom khách duy nhất (bỏ đơn đã huỷ/hết hạn, bỏ khách không có email)
        Map<Long, User> recipients = new LinkedHashMap<>();
        Map<Long, Booking> bookingByUser = new LinkedHashMap<>();
        for (Booking b : bookings) {
            if (b.getStatus() == BookingStatus.CANCELLED
                    || b.getStatus() == BookingStatus.EXPIRED) {
                continue;
            }
            User u = b.getCustomer();
            if (u == null || u.getEmail() == null || u.getEmail().isBlank()) {
                continue;
            }
            if (!recipients.containsKey(u.getId())) {
                recipients.put(u.getId(), u);
                bookingByUser.put(u.getId(), b);
            }
        }

        if (recipients.isEmpty()) {
            throw new RuntimeException(
                    "Chuyến bay này chưa có hành khách (có email) để gửi thông báo.");
        }

        int sent = 0;
        for (User u : recipients.values()) {
            Notification n = new Notification();
            n.setUser(u);
            n.setBooking(bookingByUser.get(u.getId()));
            n.setType(type);
            n.setChannel(channel);
            n.setTitle(title);
            n.setContent(content);
            n.setSentAt(LocalDateTime.now());
            n.setStatus(NotificationStatus.PENDING);
            notificationRepository.save(n);

            boolean delivered = true;
            if (channel == NotificationChannel.EMAIL) {
                delivered = trySendEmail(u, title, content);
            }
            n.setStatus(delivered ? NotificationStatus.SENT : NotificationStatus.FAILED);
            notificationRepository.save(n);
            if (delivered) {
                sent++;
            }
        }

        if (sent == 0 && channel == NotificationChannel.EMAIL) {
            throw new RuntimeException(
                    "Gửi email thất bại cho tất cả hành khách. Kiểm tra cấu hình SMTP.");
        }

        return sent;
    }

    private boolean trySendEmail(User user, String title, String content) {
        try {
            emailService.sendText(user.getEmail(), title, content);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // STAFF xem toàn bộ notification
    public List<NotificationResponse> getAllNotifications() {

        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // CUSTOMER xem notification của mình
    public List<NotificationResponse> getMyNotifications(
            Authentication authentication
    ) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy người dùng")
                );

        return notificationRepository.findByUser_Id(user.getId())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private NotificationResponse mapToResponse(
            Notification notification
    ) {

        return NotificationResponse.builder()
                .id(notification.getId())

                .userId(
                        notification.getUser() != null
                                ? notification.getUser().getId()
                                : null
                )

                .bookingId(
                        notification.getBooking() != null
                                ? notification.getBooking().getId()
                                : null
                )

                .type(notification.getType())
                .channel(notification.getChannel())
                .title(notification.getTitle())
                .content(notification.getContent())
                .status(notification.getStatus())
                .sentAt(notification.getSentAt())
                .build();
    }
}