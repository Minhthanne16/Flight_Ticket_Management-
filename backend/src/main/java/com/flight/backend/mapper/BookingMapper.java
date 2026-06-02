package com.flight.backend.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.booking.BookingResponse;
import com.flight.backend.dto.ticket.TicketResponse;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Payment;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingMapper {

    private final TicketMapper ticketMapper;

    public BookingResponse toResponse(Booking booking) {

        Payment payment = booking.getPayment();

        List<TicketResponse> ticketResponses = booking.getTickets()
                .stream()
                .map(ticketMapper::toResponse)
                .toList();

        return BookingResponse.builder()
                .bookingId(booking.getId())
                .pnrCode(booking.getPnrCode())
                .status(booking.getStatus())
                .totalAmount(booking.getTotalAmount())
                .refundAmount(booking.getRefundAmount())
                .bookingDate(booking.getBookingDate())
                .expirationTime(booking.getExpirationTime())
                // Flight
                .flightId(
                        booking.getFlight().getId())
                // Payment
                .paymentMethod(payment != null ? payment.getPaymentMethod() : null)
                .paymentStatus(payment != null ? payment.getStatus() : null)
                // Tickets
                .tickets(ticketResponses)
                .build();
    }
}
