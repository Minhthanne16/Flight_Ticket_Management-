package com.flight.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirplaneResponse {
    public Long id;
    public String airplaneCode;
    public String model;
    public String airlineName;
    public Integer totalSeats;
    public String status;
}