package com.flight.backend.dto.airline;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirlineResponse {
    private Long id;
    private String airlineCode;
    private String airlineName;
    private String description;
    private String logo;
}
