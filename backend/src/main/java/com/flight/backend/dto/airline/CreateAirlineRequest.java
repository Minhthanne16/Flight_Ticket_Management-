package com.flight.backend.dto.airline;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirlineRequest {

    @NotBlank(message = "Airline code is required")
    private String airlineCode; // Ví dụ: VN, VJ, QH

    @NotBlank(message = "Airline name is required")
    private String airlineName; // Ví dụ: Vietnam Airlines

    private String description;

    private String logo;
}
