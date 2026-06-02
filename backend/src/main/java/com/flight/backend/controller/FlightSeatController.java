package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.flight.FlightSeatMapItem;
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

    // Sơ đồ ghế (DTO sạch) cho trang quản lý chuyến bay
    @GetMapping("/{id}/seat-map")
    public ResponseEntity<ApiResponse<List<FlightSeatMapItem>>> getSeatMap(@PathVariable Long id) {
        return ApiResponse.success(flightSeatService.getSeatMap(id), "Lấy sơ đồ ghế thành công");
    }

    @PostMapping("/{id}/seats/select")
    public FlightSeat selectSeat(
            @RequestParam Long seatId) {
        return flightSeatService.selectSeat(seatId);
    }
}
