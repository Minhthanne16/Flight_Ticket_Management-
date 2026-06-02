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
public class FlightSearchStopResponse {
    private int stopOrder;
    private Long stopAirportId;
    private String stopAirportCode;
    private String stopAirportName;
    private String stopCity;
    private LocalDateTime arrivalTime;
    private LocalDateTime departureTime;
    private Long stopDuration;
}
