package com.flight.backend.dto.airport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirportResponse {
    private Long id;
    private String airportCode;
    private String name;
    private String city;
    private String country;
}