package com.flight.backend.controller;

import com.flight.backend.dto.notification.NotificationRequest;
import com.flight.backend.dto.notification.NotificationResponse;
import com.flight.backend.service.NotificationService;
import java.util.List;
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
            @RequestBody NotificationRequest request
    ) {

        return ResponseEntity.ok(
                notificationService.createNotification(request)
        );
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