package com.flight.backend.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.airplane_model.AirplaneModelResponse;
import com.flight.backend.dto.airplane_model.CreateAirplaneModelRequest;
import com.flight.backend.dto.seat.SeatResponse;
import com.flight.backend.entity.AirplaneModel;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.enums.SeatStatus;
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
    public AirplaneModelResponse createAirplaneModel(
            CreateAirplaneModelRequest request) {

        // ==========================
        // Validate số ghế
        // ==========================
        if (request.getSeats().size()
                != request.getTotalSeats()) {

            throw new RuntimeException(
                    "Total seats does not match seat list");
        }

        // ==========================
        // Tạo Airplane Model
        // ==========================
        AirplaneModel model = new AirplaneModel();

        model.setModelName(request.getModelName());
        model.setManufacturer(request.getManufacturer());
        model.setDescription(request.getDescription());
        model.setTotalRows(request.getTotalRows());
        model.setSeatColumns(request.getSeatColumns());
        model.setTotalSeats(request.getTotalSeats());

        AirplaneModel savedModel =
                airplaneModelRepository.save(model);

        // ==========================
        // Validate Seat
        // ==========================
        Set<String> seatNumbers = new HashSet<>();

        List<Seat> seats = new ArrayList<>();

        request.getSeats().forEach(seatReq -> {

            // Row không vượt quá tổng row
            if (seatReq.getRowNumber()
                    > request.getTotalRows()) {

                throw new RuntimeException(
                        "Seat row exceeds total rows");
            }

            // Column phải tồn tại trong seatColumns
            if (!request.getSeatColumns()
                    .contains(
                            seatReq.getColumnLetter())) {

                throw new RuntimeException(
                        "Invalid seat column: "
                                + seatReq.getColumnLetter());
            }

            String seatNumber =
                    seatReq.getRowNumber()
                    + seatReq.getColumnLetter();

            // Không cho ghế trùng
            if (!seatNumbers.add(seatNumber)) {

                throw new RuntimeException(
                        "Duplicate seat number: "
                                + seatNumber);
            }

            Seat seat = new Seat();

            seat.setRowNumber(
                    seatReq.getRowNumber());

            seat.setColumnLetter(
                    seatReq.getColumnLetter());

            seat.setSeatNumber(
                    seatNumber);

            seat.setStatus(
                    SeatStatus.AVAILABLE);

            seat.setTicketClass(
                    ticketClassRepository
                            .findById(
                                    seatReq.getTicketClassId())
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Ticket class not found")));

            seat.setAirplaneModel(
                    savedModel);

            seats.add(seat);
        });

        // ==========================
        // Save seats
        // ==========================
        List<Seat> savedSeats =
                seatRepository.saveAll(seats);

        // ==========================
        // Response seats
        // ==========================
        List<SeatResponse> seatResponses =
                savedSeats.stream()
                        .map(this::mapToSeatResponse)
                        .toList();

        // ==========================
        // Response
        // ==========================
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

    private SeatResponse mapToSeatResponse(
            Seat seat) {

        return new SeatResponse(
                seat.getId(),
                seat.getAirplaneModel().getId(),
                seat.getSeatNumber(),
                seat.getTicketClass().getId(),
                seat.getStatus());
    }
}