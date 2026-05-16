package com.flight.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.entity.FlightSeat;
import com.flight.backend.service.FlightSeatService;

@RestController
@RequestMapping("/flights")
public class FlightSeatController {
    private final FlightSeatService flightSeatService;

    public FlightSeatController(FlightSeatService flightSeatService) {
        this.flightSeatService = flightSeatService;
    }

    @GetMapping("/{id}/seats")
    public List<FlightSeat> getSeats(@PathVariable Long id) {
        return flightSeatService.getSeatsByFlight(id);
    }

    @PostMapping("/{id}/seats/select")
    public FlightSeat selectSeat(
            @RequestParam Long seatId) {
        return flightSeatService.selectSeat(seatId);
    }
}
