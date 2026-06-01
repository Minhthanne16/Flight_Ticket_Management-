package com.flight.backend.dto.airplane;

import com.flight.backend.entity.enums.AirplaneStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirplaneRequest {

    @NotBlank(message = "Airplane code is required")
    @Size(min = 2, max = 20,
            message = "Airplane code must be between 2 and 20 characters")
    @Pattern(
            regexp = "^[A-Z0-9-]+$",
            message = "Airplane code can only contain uppercase letters, numbers and hyphens")
    private String airplaneCode;

    @NotNull(message = "Model is required")
    private Long modelId;

    @NotNull(message = "Airline is required")
    private Long airlineId;

    @NotNull(message = "Status is required")
    private AirplaneStatus status;
}