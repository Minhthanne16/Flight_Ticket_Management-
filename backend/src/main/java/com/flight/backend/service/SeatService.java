package com.flight.backend.service;

import com.flight.backend.entity.Flight;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.enums.SeatStatus;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.SeatRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class SeatService {

    private final SeatRepository seatRepository;
    private final FlightRepository flightRepository;

    public SeatService(
            SeatRepository seatRepository,
            FlightRepository flightRepository
    ) {
        this.seatRepository = seatRepository;
        this.flightRepository = flightRepository;
    }

    // Xem sơ đồ ghế
    public List<Seat> getSeatsByFlight(Long flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Long airplaneId = flight.getAirplane().getId();

        return seatRepository.findByAirplaneId(airplaneId);
    }

    // Ghế còn trống
    public List<Seat> getAvailableSeats(Long flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        Long airplaneId = flight.getAirplane().getId();

        return seatRepository.findByAirplaneIdAndStatus(
                airplaneId,
                SeatStatus.AVAILABLE
        );
    }

    // Chọn ghế
    public Seat selectSeat(Long seatId) {

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.getStatus() != SeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat is not available");
        }

        seat.setStatus(SeatStatus.UNAVAILABLE);

        return seatRepository.save(seat);
    }
}