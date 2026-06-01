package com.flight.backend.service;

import com.flight.backend.dto.ticket_class.CreateTicketClassRequest;
import com.flight.backend.dto.ticket_class.TicketClassResponse;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.repository.TicketClassRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TicketClassService {

    private final TicketClassRepository ticketClassRepository;

    public TicketClassService(
            TicketClassRepository ticketClassRepository) {
        this.ticketClassRepository = ticketClassRepository;
    }

    public TicketClassResponse create(
            CreateTicketClassRequest request) {

        String classCode = request.getClassCode().trim().toUpperCase();

        if (ticketClassRepository.existsByClassCode(classCode)) {
            throw new RuntimeException(
                    "Ticket class code already exists");
        }

        TicketClass ticketClass = new TicketClass();

        ticketClass.setClassCode(classCode);
        ticketClass.setClassName(request.getClassName().trim());
        ticketClass.setDescription(request.getDescription());
        ticketClass.setPriceMultiplier(request.getPriceMultiplier());

        TicketClass saved =
                ticketClassRepository.save(ticketClass);

        return mapToResponse(saved);
    }

    public List<TicketClass> getAll() {
        return ticketClassRepository.findAll();
    }

    public TicketClass findTicketClassById(Long id) {

        return ticketClassRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Ticket class not found"));
    }

    private TicketClassResponse mapToResponse(
            TicketClass ticketClass) {

        return new TicketClassResponse(
                ticketClass.getId(),
                ticketClass.getClassCode(),
                ticketClass.getClassName(),
                ticketClass.getDescription(),
                ticketClass.getPriceMultiplier()
        );
    }
}