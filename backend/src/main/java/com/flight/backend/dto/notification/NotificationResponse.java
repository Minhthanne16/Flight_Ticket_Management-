package com.flight.backend.dto.notification;

import com.flight.backend.entity.enums.NotificationChannel;
import com.flight.backend.entity.enums.NotificationStatus;
import com.flight.backend.entity.enums.NotificationType;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class NotificationResponse {

    private Long id;

    private Long userId;

    private Long bookingId;

    private NotificationType type;

    private NotificationChannel channel;

    private String title;

    private String content;

    private NotificationStatus status;

    private LocalDateTime sentAt;
}