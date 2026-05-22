package com.flight.backend.entity;

import java.time.LocalDateTime;

import com.flight.backend.entity.enums.RequestStatus;
import com.flight.backend.entity.enums.SupportType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "supports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Support {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id", nullable = false)
    private Ticket ticket;

    @Enumerated(EnumType.STRING)
    @Column(name = "support_type", nullable = false, length = 20)
    private SupportType supportType;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private RequestStatus status;

    @Column(name = "reason", nullable = false, columnDefinition = "TEXT")
    private String reason;

    // // Ghi chú của nhân viên khi duyệt hoặc từ chối
    // @Column(name = "StaffNotes", columnDefinition = "TEXT")
    // private String staffNotes;

    // // Dùng riêng cho trường hợp ĐỔI VÉ (Chứa thông tin chuyến bay mới mong muốn
    // -
    // // Dạng JSON hoặc Text)
    // @Column(name = "ChangeDetails", columnDefinition = "TEXT")
    // private String changeDetails;

    // Phí phát sinh (nếu có) khi đổi hoặc hoàn vé
    @Column(name = "fee_amount")
    private Double feeAmount;

    // Ai là người tạo yêu cầu (UserID của khách hàng)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // Nhân viên nào xử lý/duyệt yêu cầu này
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}
