package com.flight.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirportRequest {
    public String airportCode;
    public String name;
    public String city;
    public String country;
}