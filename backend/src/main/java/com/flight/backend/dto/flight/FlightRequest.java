package com.flight.backend.dto.flight;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FlightRequest {
    private String flightCode;
    private Long airplaneId;
    private Long routeId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Long basePrice;
}