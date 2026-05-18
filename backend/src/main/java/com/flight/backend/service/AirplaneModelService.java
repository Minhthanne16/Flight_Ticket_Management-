package com.flight.backend.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.airplane_model.AirplaneModelResponse;
import com.flight.backend.dto.airplane_model.CreateAirplaneModelRequest;
import com.flight.backend.dto.seat.SeatResponse;
import com.flight.backend.entity.AirplaneModel;
import com.flight.backend.entity.Seat;
import com.flight.backend.repository.AirplaneModelRepository;
import com.flight.backend.repository.SeatRepository;
import com.flight.backend.repository.TicketClassRepository;

import jakarta.transaction.Transactional;

@Service
public class AirplaneModelService {
    private final AirplaneModelRepository airplaneModelRepository;
    private final TicketClassRepository ticketClassRepository;
    private final SeatRepository seatRepository;

    public AirplaneModelService(
            AirplaneModelRepository airplaneModelRepository,
            TicketClassRepository ticketClassRepository,
            SeatRepository seatRepository) {
        this.airplaneModelRepository = airplaneModelRepository;
        this.ticketClassRepository = ticketClassRepository;
        this.seatRepository = seatRepository;
    }

    @Transactional
    public AirplaneModelResponse createAirplaneModel(CreateAirplaneModelRequest request) {

        // 1. Tạo Airplane Model
        AirplaneModel model = new AirplaneModel();
        model.setModelName(request.getModelName());
        model.setManufacturer(request.getManufacturer());
        model.setDescription(request.getDescription());
        model.setTotalRows(request.getTotalRows());
        model.setSeatColumns(request.getSeatColumns());
        model.setTotalSeats(request.getTotalSeats());

        AirplaneModel savedModel = airplaneModelRepository.save(model);

        // 2. Tạo danh sách ghế
        List<Seat> seats = new ArrayList<>();

        request.getSeats().forEach(seatReq -> {
            Seat seat = new Seat();
            seat.setRowNumber(seatReq.getRowNumber());
            seat.setColumnLetter(seatReq.getColumnLetter());
            seat.setTicketClass(
                    ticketClassRepository.findById(seatReq.getTicketClassId())
                            .orElseThrow(() -> new RuntimeException("TicketClass không tồn tại")));
            seat.setAirplaneModel(savedModel);
            seats.add(seat);
        });

        List<Seat> savedSeats = seatRepository.saveAll(seats);

        // 3. Map response seats
        List<SeatResponse> seatResponses = savedSeats.stream()
                .map(this::mapToSeatResponse)
                .toList();

        // 4. Return response
        return new AirplaneModelResponse(
                savedModel.getId(),
                savedModel.getModelName(),
                savedModel.getManufacturer(),
                savedModel.getDescription(),
                savedModel.getTotalRows(),
                savedModel.getSeatColumns(),
                savedModel.getTotalSeats(),
                seatResponses);
    }

    private SeatResponse mapToSeatResponse(Seat seat) {
        return new SeatResponse(
                seat.getId(),
                seat.getAirplaneModel().getId(),
                seat.getSeatNumber(),
                seat.getTicketClass().getId(),
                seat.getStatus());
    }
}
