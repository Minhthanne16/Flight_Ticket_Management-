package com.flight.backend.dto.route;

import com.flight.backend.entity.enums.RouteStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RouteResponse {
    private Long id;
    private String routeCode; // Ví dụ: SGN-HAN
    private Long departureAirportId;
    private Long arrivalAirportId;
    private RouteStatus status;
}
