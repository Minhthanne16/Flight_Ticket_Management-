package com.flight.backend.dto.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.flight.backend.entity.enums.FlightStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateFlightRequest {

    @NotBlank(message = "Flight code is required")
    private String flightCode;

    @NotNull(message = "Airplane is required")
    private Long airplaneId;

    @NotNull(message = "Route is required")
    private Long routeId;

    @NotNull(message = "Departure time is required")
    private LocalDateTime departureTime;

    @Positive(message = "Estimate duration must be greater than 0")
    private int estimateDuration;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Base price must be greater than 0")
    private BigDecimal basePrice;

    @NotNull(message = "Status is required")
    private FlightStatus status;

    @Valid
    @NotEmpty(message = "Flight stops cannot be empty")
    private List<CreateFlightStopRequest> flightStops;
}