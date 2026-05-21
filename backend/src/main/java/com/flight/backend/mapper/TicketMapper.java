package com.flight.backend.mapper;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.ticket.TicketResponse;
import com.flight.backend.entity.Ticket;

@Component
public class TicketMapper {

    public TicketResponse toResponse(Ticket ticket) {

        return TicketResponse.builder()
                .ticketId(ticket.getId())
                .passengerName(ticket.getPassenger().getFullName())
                .documentNumber(ticket.getPassenger().getDocumentNumber())
                .price(ticket.getPrice())
                .status(ticket.getStatus())
                .build();
    }
}
