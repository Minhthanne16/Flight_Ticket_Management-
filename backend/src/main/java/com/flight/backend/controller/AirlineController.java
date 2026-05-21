package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.airline.AirlineResponse;
import com.flight.backend.dto.airline.CreateAirlineRequest;
import com.flight.backend.dto.airline.UpdateAirlineRequest;
import com.flight.backend.service.AirlineService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/admin/airlines")
public class AirlineController {

    private final AirlineService airlineService;

    public AirlineController(AirlineService airlineService) {
        this.airlineService = airlineService;
    }

    // POST /airlines
    @PostMapping
    public ResponseEntity<ApiResponse<AirlineResponse>> createAirline(
            @Valid @RequestBody CreateAirlineRequest airline) {
        AirlineResponse response = airlineService.createAirline(airline);
        return ApiResponse.success(response, "Tạo mới hãng bay thành công.");
    }

    // GET /airlines
    @GetMapping
    public ResponseEntity<ApiResponse<List<AirlineResponse>>> getAllAirlines() {
        List<AirlineResponse> airlineList = this.airlineService.getAllAirlines();
        return ApiResponse.success(airlineList, "Lấy danh sách các hãng bay thành công.");
    }

    // PUT /airlines/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<AirlineResponse>> updateAirline(
            @PathVariable Long id,
            @RequestBody UpdateAirlineRequest airline) {

        AirlineResponse res = this.airlineService.updateAirline(id, airline);
        return ApiResponse.success(res, "Cập nhật hãng bay thành công.");
    }

    // DELETE /airlines/{id}
    @DeleteMapping("/{id}")
    public String deleteAirline(@PathVariable Long id) {

        airlineService.deleteAirline(id);

        return "Delete airline successfully";
    }
}