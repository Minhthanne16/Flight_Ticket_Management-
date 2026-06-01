package com.flight.backend.controller;

import com.flight.backend.dto.airport.CreateAirportRequest;
import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.airport.AirportResponse;
import com.flight.backend.service.AirportService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/airports")
public class AirportController {

    private final AirportService airportService;

    public AirportController(AirportService airportService) {
        this.airportService = airportService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AirportResponse>> create(@RequestBody CreateAirportRequest req) {
        AirportResponse resp = this.airportService.create(req);
        return ApiResponse.success(resp, "Tạo mới sân bay thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AirportResponse>>> getAll() {
        List<AirportResponse> airportList = this.airportService.getAll();
        return ApiResponse.success(airportList, "Lấy danh sách các sân bay thành công");
    }
     @GetMapping
    public ResponseEntity<ApiResponse<List<AirportResponse>>> getAll() {
        return ApiResponse.success(
            airportService.getAll(),
            "Lấy danh sách sân bay"
        );
    }
}