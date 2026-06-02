package com.flight.backend.service;

import com.flight.backend.dto.ticket_class.CreateTicketClassRequest;
import com.flight.backend.dto.ticket_class.TicketClassResponse;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.repository.SeatRepository;
import com.flight.backend.repository.TicketClassRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class TicketClassService {

    private final TicketClassRepository ticketClassRepository;
    private final SeatRepository seatRepository;

    public TicketClassService(
            TicketClassRepository ticketClassRepository,
            SeatRepository seatRepository) {
        this.ticketClassRepository = ticketClassRepository;
        this.seatRepository = seatRepository;
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
        ticketClass.setBaggageAllowanceKg(request.getBaggageAllowanceKg());

        TicketClass saved =
                ticketClassRepository.save(ticketClass);

        return mapToResponse(saved);
    }

    public TicketClassResponse update(
            Long id, CreateTicketClassRequest request) {

        TicketClass ticketClass = ticketClassRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Hạng ghế không tồn tại"));

        String classCode = request.getClassCode().trim().toUpperCase();

        if (!classCode.equals(ticketClass.getClassCode())
                && ticketClassRepository.existsByClassCode(classCode)) {
            throw new RuntimeException(
                    "Ticket class code already exists");
        }

        ticketClass.setClassCode(classCode);
        ticketClass.setClassName(request.getClassName().trim());
        ticketClass.setDescription(request.getDescription());
        ticketClass.setPriceMultiplier(request.getPriceMultiplier());
        ticketClass.setBaggageAllowanceKg(request.getBaggageAllowanceKg());

        TicketClass saved =
                ticketClassRepository.save(ticketClass);

        return mapToResponse(saved);
    }

    public List<TicketClass> getAll() {
        return ticketClassRepository.findAll();
    }

    public void delete(Long id) {
        TicketClass ticketClass = ticketClassRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Hạng ghế không tồn tại"));

        if (seatRepository.existsByTicketClassId(id)) {
            throw new RuntimeException(
                    "Không thể xóa: hạng ghế đang được sử dụng bởi ghế của model máy bay.");
        }

        ticketClassRepository.delete(ticketClass);
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
                ticketClass.getPriceMultiplier(),
                ticketClass.getBaggageAllowanceKg()
        );
    }
}