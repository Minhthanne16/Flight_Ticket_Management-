package com.flight.backend.dto.support;

import java.time.LocalDateTime;

import com.flight.backend.entity.enums.RequestStatus;
import com.flight.backend.entity.enums.SupportType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupportResponse {
    private Long id;
    private SupportType supportType;
    private RequestStatus status;
    private String reason;
    private Double feeAmount;
    private LocalDateTime createdAt;
    private LocalDateTime approvedAt;

    // Làm phẳng thông tin Vé để Client không phải bóc tách sâu
    private Long ticketId;
    private String ticketCode; // Giả định thực thể Ticket của bạn có mã vé (ví dụ: VMB123)

    // Làm phẳng thông tin Khách hàng (Người tạo)
    private Long createdById;
    private String createdByFullName;

    // Làm phẳng thông tin Nhân viên (Người duyệt) - Có thể null nếu chưa duyệt
    private Long approvedById;
    private String approvedByFullName;
}
