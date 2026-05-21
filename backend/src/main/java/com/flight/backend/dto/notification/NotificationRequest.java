package com.flight.backend.dto.notification;

import com.flight.backend.entity.enums.NotificationChannel;
import com.flight.backend.entity.enums.NotificationType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {

    private Long userId;

    private Long bookingId;

    private NotificationType type;

    private NotificationChannel channel;

    private String title;

    private String content;
}