package com.flight.backend.controller;

import com.flight.backend.service.FlightPricingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/flight-pricing")
public class FlightPricingController {

    private final FlightPricingService service;

    public FlightPricingController(FlightPricingService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public List<String> getPrices(@PathVariable Long id) {
        return service.getFlightPrices(id);
    }
}