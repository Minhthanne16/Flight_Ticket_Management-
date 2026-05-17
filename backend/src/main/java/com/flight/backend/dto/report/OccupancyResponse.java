package com.flight.backend.dto.report;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class OccupancyResponse {

    private Long flightId;

    private long soldSeats;

    private long totalSeats;

    private double occupancyRate;
}
