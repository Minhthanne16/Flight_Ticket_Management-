package com.flight.backend.mapper;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.ticket.TicketResponse;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.Ticket;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {

        FlightSeat flightSeat = ticket.getFlightSeat();
        Seat seat = flightSeat != null ? flightSeat.getSeat() : null;

        return TicketResponse.builder()
                .ticketId(ticket.getId())
                .passengerName(ticket.getPassenger() != null ? ticket.getPassenger().getFullName() : null)
                .documentNumber(ticket.getPassenger() != null ? ticket.getPassenger().getDocumentNumber() : null)
                .nationality(ticket.getPassenger() != null ? ticket.getPassenger().getNationality() : null)
                .price(ticket.getPrice())
                .status(ticket.getStatus())
                .seatStatus(flightSeat != null ? flightSeat.getStatus() : null)
                .seatNumber(seat != null ? seat.getSeatNumber() : null)
                .build();
    }
}
