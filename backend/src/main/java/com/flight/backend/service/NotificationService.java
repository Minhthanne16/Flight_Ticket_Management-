package com.flight.backend.service;

import com.flight.backend.dto.notification.NotificationRequest;
import com.flight.backend.dto.notification.NotificationResponse;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Notification;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.NotificationStatus;
import com.flight.backend.repository.BookingRepository;
import com.flight.backend.repository.NotificationRepository;
import com.flight.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    private final UserRepository userRepository;

    private final BookingRepository bookingRepository;

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

        // giả lập gửi thành công
        savedNotification.setStatus(NotificationStatus.SENT);

        Notification updatedNotification =
                notificationRepository.save(savedNotification);

        return mapToResponse(updatedNotification);
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