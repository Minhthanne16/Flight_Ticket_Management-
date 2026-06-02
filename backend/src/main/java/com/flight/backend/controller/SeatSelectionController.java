package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.booking.SelectSeatsRequest;
import com.flight.backend.dto.flight.SeatOptionResponse;
import com.flight.backend.service.SeatSelectionService;

@RestController
public class SeatSelectionController {

    private final SeatSelectionService seatSelectionService;

    public SeatSelectionController(SeatSelectionService seatSelectionService) {
        this.seatSelectionService = seatSelectionService;
    }

    // Sơ đồ ghế đầy đủ của chuyến bay (cho khách chọn chỗ)
    @GetMapping("/flights/{flightId}/available-seats")
    public ResponseEntity<ApiResponse<List<SeatOptionResponse>>> getAvailableSeats(
            @PathVariable Long flightId) {
        return ApiResponse.success(
                seatSelectionService.getAvailableSeats(flightId),
                "Lấy sơ đồ ghế thành công");
    }

    // Gán ghế cho các vé trong đơn
    @PostMapping("/bookings/{bookingId}/select-seats")
    public ResponseEntity<ApiResponse<String>> selectSeats(
            @PathVariable Long bookingId,
            @RequestBody SelectSeatsRequest request) {
        seatSelectionService.selectSeats(bookingId, request);
        return ApiResponse.success("OK", "Đặt chỗ ngồi thành công");
    }
}
