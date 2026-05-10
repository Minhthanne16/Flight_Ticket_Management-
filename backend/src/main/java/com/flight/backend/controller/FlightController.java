package com.flight.backend.controller;

import com.flight.backend.dto.flight.FlightRequest;
import com.flight.backend.entity.Flight;
import com.flight.backend.service.FlightService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    @PostMapping
    public Flight create(@RequestBody FlightRequest request) {
        return flightService.createFlight(request);
    }

    @GetMapping("/{id}")
    public Flight get(@PathVariable Long id) {
        return flightService.getFlight(id);
    }

    @GetMapping
    public List<Flight> getAll() {
        return flightService.getAll();
    }
}