package com.flight.backend.controller;

import com.flight.backend.dto.airport.AirportRequest;
import com.flight.backend.dto.airport.AirportResponse;
import com.flight.backend.service.AirportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/airports")
public class AirportController {

    private final AirportService airportService;

    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @PostMapping
    public AirportResponse create(@RequestBody AirportRequest req) {
        return airportService.create(req);
    }

    @GetMapping
    public List<AirportResponse> getAll() {
        return airportService.getAll();
    }
}