package com.flight.backend.dto.airplane_model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

import com.flight.backend.dto.seat.CreateSeatRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateAirplaneModelRequest {

    @NotBlank(message = "Model name is required")
    private String modelName;

    @NotBlank(message = "Manufacturer is required")
    private String manufacturer;

    private String description;

    @NotNull(message = "Total rows is required")
    @Min(value = 1, message = "Total rows must be greater than 0")
    private Integer totalRows;

    @NotBlank(message = "Seat columns is required")
    private String seatColumns;

    @NotNull(message = "Total seats is required")
    @Min(value = 1, message = "Total seats must be greater than 0")
    private Integer totalSeats;

    @Valid
    @NotEmpty(message = "Seat list cannot be empty")
    private List<CreateSeatRequest> seats;
}