package com.flight.backend.controller;

import com.flight.backend.entity.Booking;
import com.flight.backend.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(
            BookingService bookingService
    ) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public Booking createBooking(
            @RequestBody Booking booking
    ) {

        return bookingService.createBooking(
                booking
        );
    }

    @GetMapping("/{id}")
    public Booking getBookingById(
            @PathVariable Long id
    ) {

        return bookingService.getBookingById(
                id
        );
    }

    @GetMapping
    public List<Booking> getAllBookings() {

        return bookingService.getAllBookings();
    }

    @PutMapping("/{id}/confirm")
    public Booking confirmBooking(
            @PathVariable Long id
    ) {

        return bookingService.confirmBooking(
                id
        );
    }

    @PutMapping("/{id}/paid")
    public Booking markAsPaid(
            @PathVariable Long id
    ) {

        return bookingService.markAsPaid(
                id
        );
    }

    @PutMapping("/{id}/expire")
    public Booking expireBooking(
            @PathVariable Long id
    ) {

        return bookingService.expireBooking(
                id
        );
    }

    @DeleteMapping("/{id}")
    public Booking cancelBooking(
            @PathVariable Long id
    ) {

        return bookingService.cancelBooking(
                id
        );
    }
}