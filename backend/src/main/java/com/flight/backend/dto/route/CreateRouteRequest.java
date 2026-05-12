package com.flight.backend.dto.route;

import com.flight.backend.entity.enums.RouteStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRouteRequest {

    @NotBlank(message = "Route code is required")
    private String routeCode; // Ví dụ: SGN-HAN

    @NotNull(message = "Departure airport is required")
    private Long departureAirportId;

    @NotNull(message = "Arrival airport is required")
    private Long arrivalAirportId;

    private RouteStatus status;
}
