package com.flight.backend.dto.seat;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSeatRequest {
    private Integer rowNumber; // Ví dụ: 1
    private String columnLetter; // Ví dụ: A
    private Long ticketClassId; // Economy, Business...
}
