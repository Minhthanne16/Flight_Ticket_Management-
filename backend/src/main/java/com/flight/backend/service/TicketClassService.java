package com.flight.backend.service;

import com.flight.backend.entity.TicketClass;
import com.flight.backend.repository.TicketClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketClassService {

    private final TicketClassRepository ticketClassRepository;

    public TicketClassService(
            TicketClassRepository ticketClassRepository
    ) {
        this.ticketClassRepository = ticketClassRepository;
    }

    public TicketClass create(
            TicketClass ticketClass
    ) {

        if (ticketClassRepository.existsByClassCode(
                ticketClass.getClassCode()
        )) {
            throw new RuntimeException(
                    "Ticket class code already exists"
            );
        }

        return ticketClassRepository.save(ticketClass);
    }

    public List<TicketClass> getAll() {
        return ticketClassRepository.findAll();
    }
}