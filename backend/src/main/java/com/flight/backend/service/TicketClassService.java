package com.flight.backend.service;

import com.flight.backend.dto.ticket_class.CreateTicketClassRequest;
import com.flight.backend.dto.ticket_class.TicketClassResponse;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.repository.TicketClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketClassService {

    private final TicketClassRepository ticketClassRepository;

    public TicketClassService(
            TicketClassRepository ticketClassRepository) {
        this.ticketClassRepository = ticketClassRepository;
    }

    public TicketClassResponse create(CreateTicketClassRequest request) {
        if (ticketClassRepository.existsByClassCode(request.getClassCode())) {
            throw new RuntimeException("Ticket class code already exists");
        }

        TicketClass ticketClass = new TicketClass();
        ticketClass.setClassCode(request.getClassCode());
        ticketClass.setClassName(request.getClassName());
        ticketClass.setDescription(request.getDescription());
        ticketClass.setPriceMultiplier(request.getPriceMultiplier());

        TicketClass saved = ticketClassRepository.save(ticketClass);

        TicketClassResponse response = new TicketClassResponse();
        response.setId(saved.getId());
        response.setClassCode(saved.getClassCode());
        response.setClassName(saved.getClassName());
        response.setDescription(saved.getDescription());
        response.setPriceMultiplier(saved.getPriceMultiplier());

        return response;
    }

    public List<TicketClass> getAll() {
        return ticketClassRepository.findAll();
    }
}