package com.flight.backend.dto.ticket_class;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketClassRequest {
    private String classCode;
    private String className;
    private String description;
    private BigDecimal priceMultiplier;
}
