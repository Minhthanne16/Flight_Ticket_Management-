package com.flight.backend.dto.order;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.dto.ticket.TicketResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OrderDetailResponse {

    private Long bookingId;

    private String pnrCode;

    private String flightCode;

    private LocalDateTime departureTime;

    private BigDecimal totalAmount;

    private BookingStatus status;

    private List<TicketResponse> tickets;
}