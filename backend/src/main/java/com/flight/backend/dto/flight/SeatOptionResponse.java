package com.flight.backend.dto.flight;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatOptionResponse {
    private Long seatId;
    private String seatNumber;
    private Integer rowNumber;
    private String columnLetter;
    private Long ticketClassId;
    private String ticketClassName;
    private boolean available;
}
