package com.flight.backend.mapper;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.support.SupportResponse;
import com.flight.backend.entity.Support;

@Component
public class SupportMapper {

    public SupportResponse toResponse(Support entity) {
        if (entity == null) {
            return null;
        }

        SupportResponse.SupportResponseBuilder builder = SupportResponse.builder()
                .id(entity.getId())
                .supportType(entity.getSupportType())
                .status(entity.getStatus())
                .reason(entity.getReason())
                .feeAmount(entity.getFeeAmount())
                .createdAt(entity.getCreatedAt())
                .approvedAt(entity.getApprovedAt());

        // Map an toàn thông tin Ticket đề phòng bị Lazy Load hoặc null
        if (entity.getTicket() != null) {
            builder.ticketId(entity.getTicket().getId());
            // builder.ticketCode(entity.getTicket().getTicketCode()); // Mở comment nếu
            // Ticket có trường này
        }

        // Map an toàn thông tin Người tạo (Khách hàng)
        if (entity.getCreatedBy() != null) {
            builder.createdById(entity.getCreatedBy().getId());
            builder.createdByFullName(entity.getCreatedBy().getFullName());
        }

        // Map an toàn thông tin Người duyệt (Nhân viên)
        if (entity.getApprovedBy() != null) {
            builder.approvedById(entity.getApprovedBy().getId());
            builder.approvedByFullName(entity.getApprovedBy().getFullName());
        }

        return builder.build();
    }
}