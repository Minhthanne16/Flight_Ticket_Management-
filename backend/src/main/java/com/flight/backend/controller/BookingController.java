package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.booking.BookingResponse;
import com.flight.backend.dto.booking.CreateBookingRequest;
import com.flight.backend.entity.Booking;
import com.flight.backend.service.BookingService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestBody CreateBookingRequest req) {
        BookingResponse resp = this.bookingService.createBooking(req);
        return ApiResponse.success(resp, "Tạo booking thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse resp = this.bookingService.getBookingResponse(id);
        return ApiResponse.success(resp, "Lấy booking thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings() {
        List<Booking> bookings = this.bookingService.getAllBookings();
        return ApiResponse.success(bookings, "Lấy danh sách booking thành công");
    }

    @PutMapping("/{id}/expire")
    public ResponseEntity<ApiResponse<Booking>> expireBooking(@PathVariable Long id) {
        Booking booking = this.bookingService.expireBooking(id);
        return ApiResponse.success(booking, "Booking đã hết hạn");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(@PathVariable Long id) {
        Booking booking = this.bookingService.cancelBooking(id);
        return ApiResponse.success(booking, "Xóa Booking thành công");
    }
}