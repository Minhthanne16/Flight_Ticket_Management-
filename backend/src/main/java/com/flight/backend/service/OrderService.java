package com.flight.backend.service;

import com.flight.backend.dto.order.OrderDetailResponse;
import com.flight.backend.dto.order.OrderHistoryResponse;
import com.flight.backend.dto.ticket.TicketResponse;

import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Ticket;

import com.flight.backend.repository.BookingRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final BookingRepository bookingRepository;

    public List<OrderHistoryResponse> getOrders(
            Long customerId
    ) {

        List<Booking> bookings =
                bookingRepository.findByCustomer_Id(customerId);

        return bookings.stream()
                .map(booking -> new OrderHistoryResponse(

                        booking.getId(),

                        booking.getPnrCode(),

                        booking.getFlight()
                                .getFlightCode(),

                        booking.getFlight()
                                .getRoute()
                                .getDepartureAirport()
                                .getAirportCode(),

                        booking.getFlight()
                                .getRoute()
                                .getArrivalAirport()
                                .getAirportCode(),

                        booking.getFlight()
                                .getDepartureTime(),

                        booking.getTotalAmount(),

                        booking.getStatus()

                ))
                .toList();
    }

    public OrderDetailResponse getOrderDetail(
            Long bookingId
    ) {

        Booking booking =
                bookingRepository.findById(bookingId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy đơn hàng"));

        List<TicketResponse> tickets =
                booking.getTickets()
                        .stream()
                        .map(this::mapTicket)
                        .toList();

        return new OrderDetailResponse(

                booking.getId(),

                booking.getPnrCode(),

                booking.getFlight()
                        .getFlightCode(),

                booking.getFlight()
                        .getDepartureTime(),

                booking.getTotalAmount(),

                booking.getStatus(),

                tickets
        );
    }

    private TicketResponse mapTicket(
            Ticket ticket
    ) {

        return TicketResponse.builder()

                .ticketId(
                        ticket.getId()
                )

                .passengerName(
                        ticket.getPassenger()
                                .getFullName()
                )

                .documentNumber(
                        ticket.getPassenger()
                                .getDocumentNumber()
                )

                .nationality(
                        ticket.getPassenger()
                                .getNationality()
                )

                .seatNumber(
                        ticket.getFlightSeat()
                                .getSeat()
                                .getSeatNumber()
                )

                .price(
                        ticket.getPrice()
                )

                .status(
                        ticket.getStatus()
                )

                .seatStatus(
                        ticket.getFlightSeat()
                                .getStatus()
                )

                .build();
    }
}