package com.flight.backend.service;

import java.math.BigDecimal;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.ticket.TicketResponse;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Passenger;
import com.flight.backend.entity.Ticket;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.entity.enums.TicketStatus;
import com.flight.backend.mapper.TicketMapper;
import com.flight.backend.repository.TicketRepository;

@Service
public class TicketService {
    private final TicketRepository ticketRepository;
    private final TicketMapper ticketMapper;

    public TicketService(
            TicketRepository ticketRepository,
            TicketMapper ticketMapper) {
        this.ticketRepository = ticketRepository;
        this.ticketMapper = ticketMapper;
    }

    public Ticket createTicketEntity(Booking booking, Passenger passenger, FlightSeat flightSeat, Flight flight,
            TicketClass ticketClass) {
        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setPassenger(passenger);
        ticket.setFlightSeat(flightSeat);
        // Giá vé
        BigDecimal price = flight.getBasePrice().multiply(ticketClass.getPriceMultiplier());

        ticket.setPrice(price);
        ticket.setStatus(TicketStatus.RESERVED);

        this.ticketRepository.save(ticket);
        return ticket;
    }

    public TicketResponse getTicketById(Long id) {
        Ticket ticket = this.ticketRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));
        return this.ticketMapper.toResponse(ticket);
    }

}
