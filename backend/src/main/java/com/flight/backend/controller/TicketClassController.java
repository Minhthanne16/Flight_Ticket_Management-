package com.flight.backend.controller;

import com.flight.backend.entity.TicketClass;
import com.flight.backend.service.TicketClassService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ticket-classes")
public class TicketClassController {

    private final TicketClassService ticketClassService;

    public TicketClassController(
            TicketClassService ticketClassService
    ) {
        this.ticketClassService = ticketClassService;
    }

    @PostMapping
    public TicketClass create(
            @RequestBody TicketClass ticketClass
    ) {
        return ticketClassService.create(ticketClass);
    }

    @GetMapping
    public List<TicketClass> getAll() {
        return ticketClassService.getAll();
    }
}