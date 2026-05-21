package com.flight.backend.dto.airplane;

import com.flight.backend.entity.AirplaneModel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AirplaneResponse {
    public Long id;
    public String airplaneCode;
    public AirplaneModel model;
    public String airlineName;
    public Integer totalSeats;
    public String status;
}