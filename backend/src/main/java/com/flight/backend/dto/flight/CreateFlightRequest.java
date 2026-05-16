package com.flight.backend.dto.flight;

import java.time.LocalDateTime;

import com.flight.backend.entity.enums.FlightStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFlightRequest {
    private String flightCode;
    private Long airplaneId;
    private Long routeId;
    private LocalDateTime departureTime;
    private int estimateDuration;
    private Long basePrice;
    private FlightStatus status;
}
