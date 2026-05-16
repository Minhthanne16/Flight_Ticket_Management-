package com.flight.backend.dto.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.flight.backend.dto.ticket.TicketResponse;
import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.entity.enums.PaymentMethod;
import com.flight.backend.entity.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long bookingId;

    private String pnrCode;

    private BookingStatus status;

    private BigDecimal totalAmount;

    private LocalDateTime bookingDate;

    private LocalDateTime expirationTime;

    // Flight
    private Long flightId;

    // Payment
    private PaymentMethod paymentMethod;

    private PaymentStatus paymentStatus;

    // Tickets
    private List<TicketResponse> tickets;
}
