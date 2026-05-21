package com.flight.backend.repository;

import com.flight.backend.entity.Notification;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser_Id(Long userId);
}