package com.flight.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.flight.backend.entity.Airline;
import com.flight.backend.service.AirlineService;

@RestController
@RequestMapping("/airlines")
public class AirlineController {

    private final AirlineService airlineService;

    public AirlineController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    // POST /airlines
    @PostMapping
    public Airline createAirline(@RequestBody Airline airline) {
        return airlineService.createAirline(airline);
    }

    // GET /airlines
    @GetMapping
    public List<Airline> getAllAirlines() {
        return airlineService.getAllAirlines();
    }

    // PUT /airlines/{id}
    @PutMapping("/{id}")
    public Airline updateAirline(
            @PathVariable Long id,
            @RequestBody Airline airline
    ) {
        return airlineService.updateAirline(id, airline);
    }

    // DELETE /airlines/{id}
    @DeleteMapping("/{id}")
    public String deleteAirline(@PathVariable Long id) {

        airlineService.deleteAirline(id);

        return "Delete airline successfully";
    }
}