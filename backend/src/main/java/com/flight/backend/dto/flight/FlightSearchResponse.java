package com.flight.backend.dto.flight;

import com.flight.backend.entity.enums.FlightStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlightSearchResponse {
    private Long id;
    private String flightCode;
    
    // Airline details
    private Long airlineId;
    private String airlineName;
    private String airlineLogo;
    
    // Airport details
    private Long departureAirportId;
    private String departureAirportCode;
    private String departureCity;
    
    private Long arrivalAirportId;
    private String arrivalAirportCode;
    private String arrivalCity;
    
    // Times
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private int estimateDuration;
    
    // Price
    private Long basePrice;
    private FlightStatus status;
}
