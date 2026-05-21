package com.flight.backend.dto.seat;

import com.flight.backend.entity.enums.SeatStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SeatResponse {
    private Long seatId;
    private Long modelId;
    private String seatNumber; // ví dụ: 1A, 12C
    private Long ticketClassId;
    private SeatStatus status; // AVAILABLE, UNAVAILABLE, BLOCKED
}
