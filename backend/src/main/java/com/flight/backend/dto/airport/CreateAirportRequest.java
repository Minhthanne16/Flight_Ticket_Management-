package com.flight.backend.dto.airport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirportRequest {
    public String airportCode;
    public String name;
    public String city;
    public String country;
}
