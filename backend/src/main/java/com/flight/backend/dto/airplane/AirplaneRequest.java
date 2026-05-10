package com.flight.backend.dto.airplane;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AirplaneRequest {
    public String airplaneCode;
    public String model;
    public Long airlineId;
    public Integer totalSeats;
    public String status;
}