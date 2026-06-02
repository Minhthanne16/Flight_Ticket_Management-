package com.flight.backend.controller;

import com.flight.backend.dto.notification.NotificationRequest;
import com.flight.backend.dto.notification.NotificationResponse;
import com.flight.backend.entity.enums.NotificationChannel;
import com.flight.backend.entity.enums.NotificationType;
import com.flight.backend.service.NotificationService;

import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // STAFF tạo notification
    @PostMapping
    public ResponseEntity<NotificationResponse> createNotification(
           @Valid @RequestBody NotificationRequest request
    ) {

        return ResponseEntity.ok(
                notificationService.createNotification(request)
        );
    }

    // STAFF gửi thông báo (kèm email) cho toàn bộ hành khách của một chuyến bay
    @PostMapping("/flight/{flightId}")
    public ResponseEntity<Map<String, Object>> notifyFlightCustomers(
            @PathVariable Long flightId,
            @RequestBody Map<String, String> body
    ) {

        String title = body.get("title");
        String content = body.get("content");

        NotificationType type = body.get("type") != null
                ? NotificationType.valueOf(body.get("type"))
                : NotificationType.FLIGHT_UPDATED;
        NotificationChannel channel = body.get("channel") != null
                ? NotificationChannel.valueOf(body.get("channel"))
                : NotificationChannel.EMAIL;

        int sent = notificationService.notifyFlightCustomers(
                flightId, type, channel, title, content);

        return ResponseEntity.ok(Map.of(
                "sent", sent,
                "message", "Đã gửi thông báo tới " + sent + " hành khách."));
    }

    // STAFF xem toàn bộ
    @GetMapping
    public ResponseEntity<List<NotificationResponse>>
    getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    // CUSTOMER xem notification của mình
    @GetMapping("/my")
    public ResponseEntity<List<NotificationResponse>>
    getMyNotifications(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                notificationService.getMyNotifications(authentication)
        );
    }
}