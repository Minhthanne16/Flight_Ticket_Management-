package com.flight.backend.dto.booking;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SelectSeatsRequest {

    private List<SeatAssignment> assignments;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatAssignment {
        private Long ticketId;
        private Long seatId;
    }
}
