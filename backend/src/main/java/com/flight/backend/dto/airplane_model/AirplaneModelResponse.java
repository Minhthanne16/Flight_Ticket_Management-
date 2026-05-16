package com.flight.backend.dto.airplane_model;

import java.util.List;

import com.flight.backend.dto.seat.SeatResponse;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AirplaneModelResponse {
    private Long id;
    private String modelName;
    private String manufacturer;
    private String description;
    private Integer totalRows;
    private String seatColumns;
    private Integer totalSeats;
    private List<SeatResponse> seats;
}
