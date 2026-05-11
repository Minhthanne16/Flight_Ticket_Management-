package com.flight.backend.dto.airline;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAirlineRequest {
    @NotBlank(message = "Airline code is required")
    private String airlineCode;

    @NotBlank(message = "Airline name is required")
    private String airlineName;

    private String description;

    private String logo;
}
