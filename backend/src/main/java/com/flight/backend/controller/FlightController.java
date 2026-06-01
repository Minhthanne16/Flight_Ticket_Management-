package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.flight.CreateFlightRequest;
import com.flight.backend.dto.flight.FlightResponse;
import com.flight.backend.entity.Flight;
import com.flight.backend.service.FlightService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequestMapping("/flights")
public class FlightController {

    private final FlightService flightService;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

   @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ResponseEntity<ApiResponse<FlightResponse>> create(@Valid @RequestBody CreateFlightRequest request) {
        FlightResponse res = this.flightService.createFlight(request);
        return ApiResponse.success(res, "Tạo mới chuyến bay thành công.");
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<FlightResponse>> get(@PathVariable Long id) {
        FlightResponse resp = flightService.getFlight(id);
        return ApiResponse.success(resp, "Lấy thông tin chuyến bay thành công");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public List<Flight> getAll() {
        return flightService.getAll();
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'STAFF', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<com.flight.backend.dto.flight.FlightSearchResponse>>> search(
            @RequestParam(required = false) Long from,
            @RequestParam(required = false) Long to,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE) java.time.LocalDate departDate,
            @RequestParam(required = false) Long airlineId,
            @RequestParam(required = false) Long minPrice,
            @RequestParam(required = false) Long maxPrice) {
        
        List<com.flight.backend.dto.flight.FlightSearchResponse> responses = flightService.searchFlights(from, to, departDate, airlineId, minPrice, maxPrice);
        return ApiResponse.success(responses, "Tìm kiếm chuyến bay thành công");
    }
 
}