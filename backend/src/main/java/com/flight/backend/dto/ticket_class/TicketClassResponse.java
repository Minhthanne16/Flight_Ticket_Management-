package com.flight.backend.dto.ticket_class;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TicketClassResponse {
    private Long id;
    private String classCode;
    private String className;
    private String description;
    private BigDecimal priceMultiplier;
    private int baggageAllowanceKg;
}
