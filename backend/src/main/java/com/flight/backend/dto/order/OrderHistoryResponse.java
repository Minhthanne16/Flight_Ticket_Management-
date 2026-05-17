package com.flight.backend.dto.order;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.flight.backend.entity.enums.BookingStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderHistoryResponse {

    private Long bookingId;

    private String pnrCode;

    private String flightCode;

    private String departureAirport;

    private String arrivalAirport;

    private LocalDateTime departureTime;

    private BigDecimal totalAmount;

    private BookingStatus status;
}