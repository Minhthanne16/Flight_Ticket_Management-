package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.ticket_class.CreateTicketClassRequest;
import com.flight.backend.dto.ticket_class.TicketClassResponse;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.service.TicketClassService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/ticket-classes")
public class TicketClassController {

    private final TicketClassService ticketClassService;

    public TicketClassController(
            TicketClassService ticketClassService) {
        this.ticketClassService = ticketClassService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TicketClassResponse>> create(
             @Valid @RequestBody CreateTicketClassRequest ticketClass) {
        TicketClassResponse res = this.ticketClassService.create(ticketClass);
        return ApiResponse.success(res, "Tạo hạng vé mới thành công");
    }

    @GetMapping
    public List<TicketClass> getAll() {
        return ticketClassService.getAll();
    }
}