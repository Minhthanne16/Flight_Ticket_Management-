package com.flight.backend.controller;

import com.flight.backend.dto.airplane.CreateAirplaneRequest;
import com.flight.backend.dto.airplane.AirplaneResponse;
import com.flight.backend.service.AirplaneService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/airplanes")
public class AirplaneController {

    private final AirplaneService airplaneService;

    public AirplaneController(AirplaneService airplaneService) {
        this.airplaneService = airplaneService;
    }

    @PostMapping
    public AirplaneResponse create(@RequestBody CreateAirplaneRequest request) {
        return airplaneService.create(request);
    }

    @GetMapping
    public List<AirplaneResponse> getAll() {
        return airplaneService.getAll();
    }

    @GetMapping("/{id}")
    public AirplaneResponse getById(@PathVariable Long id) {
        return airplaneService.getById(id);
    }
}