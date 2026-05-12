package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.repository.FlightSeatRepository;

@Service
public class FlightSeatService {
    private final FlightSeatRepository flightSeatRepository;

    public FlightSeatService(FlightSeatRepository flightSeatRepository) {
        this.flightSeatRepository = flightSeatRepository;
    }

    // Xem sơ đồ ghế
    public List<FlightSeat> getSeatsByFlight(Long flightId) {
        return flightSeatRepository.findByFlightId(flightId);
    }

    // Chọn ghế
    public FlightSeat selectSeat(Long seatId) {

        FlightSeat seat = flightSeatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.getStatus() != FlightSeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat is not available");
        }

        seat.setStatus(FlightSeatStatus.HELD);

        return flightSeatRepository.save(seat);
    }
}
