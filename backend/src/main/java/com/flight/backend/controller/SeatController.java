package com.flight.backend.controller;

import com.flight.backend.entity.Seat;
import com.flight.backend.service.SeatService;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/flights")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/{id}/seats")
    public List<Seat> getSeats(@PathVariable Long id) {
        return seatService.getSeatsByFlight(id);
    }

    @GetMapping("/{id}/available-seats")
    public List<Seat> getAvailableSeats(@PathVariable Long id) {
        return seatService.getAvailableSeats(id);
    }

    @PostMapping("/{id}/seats/select")
    public Seat selectSeat(
            @RequestParam Long seatId
    ) {
        return seatService.selectSeat(seatId);
    }
}