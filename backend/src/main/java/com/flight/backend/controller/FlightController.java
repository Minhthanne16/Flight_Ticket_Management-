package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.flight.CreateFlightRequest;
import com.flight.backend.dto.flight.FlightResponse;
import com.flight.backend.entity.Flight;
import com.flight.backend.service.FlightService;

import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<FlightResponse>> create(@RequestBody CreateFlightRequest request) {
        FlightResponse res = this.flightService.createFlight(request);
        return ApiResponse.success(res, "Tạo mới chuyến bay thành công.");
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