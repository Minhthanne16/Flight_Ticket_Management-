package com.flight.backend.dto.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FlightAdminResponse {
    private Long id;
    private String flightCode;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private Integer estimateDuration;
    private String status;
    private BigDecimal basePrice;
    private String routeCode;
    private String airlineName;
    private String departureAirportCode;
    private String arrivalAirportCode;
    private String departureCity;
    private String arrivalCity;
    private String airplaneCode;
    private String modelName;
    private Integer totalSeats;
    private Long routeId;
    private Long airplaneId;
    private List<FlightStopResponse> flightStops;
}
