package com.flight.backend.dto.flight;

import java.time.LocalDateTime;

import com.flight.backend.entity.enums.FlightStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlightResponse {
    private Long id;
    private String flightCode;
    private LocalDateTime departureTime;
    private int estimateDuration;
    private Long basePrice;
    private FlightStatus status;
    private Long airplaneId;
    private Long routeId;
}
