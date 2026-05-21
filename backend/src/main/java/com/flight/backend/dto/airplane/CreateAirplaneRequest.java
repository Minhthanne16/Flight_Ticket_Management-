package com.flight.backend.dto.airplane;

import com.flight.backend.entity.enums.AirplaneStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirplaneRequest {
    public String airplaneCode;
    public Long modelId;
    public Long airlineId;
    public AirplaneStatus status;
}
