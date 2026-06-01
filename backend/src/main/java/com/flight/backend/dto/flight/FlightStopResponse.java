package com.flight.backend.dto.flight;

import java.time.LocalDateTime;

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
public class FlightStopResponse {
    private Long flightStopId;
    private Long airportStopId;
    private String airportCode;
    private String airportName;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private Long stopDuration;
    private int stopOrder;
}
