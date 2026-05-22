package com.flight.backend.dto.support;

import com.flight.backend.entity.enums.SupportType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateSupportRequest {
    private Long ticketId;
    private SupportType supportType;
    private String reason;
}
