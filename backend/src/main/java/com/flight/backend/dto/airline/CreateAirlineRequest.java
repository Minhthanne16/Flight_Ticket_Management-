package com.flight.backend.dto.airline;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirlineRequest {

    @NotBlank(message = "Airline code is required")
    @Size(min = 2, max = 10,
            message = "Airline code must be between 2 and 10 characters")
    @Pattern(
            regexp = "^[A-Z0-9]+$",
            message = "Airline code must contain only uppercase letters and numbers")
    private String airlineCode;

    @NotBlank(message = "Airline name is required")
    @Size(min = 2, max = 255,
            message = "Airline name must be between 2 and 255 characters")
    private String airlineName;

    @Size(max = 1000,
            message = "Description cannot exceed 1000 characters")
    private String description;

    @Size(max = 255,
            message = "Logo URL cannot exceed 255 characters")
    private String logo;
}