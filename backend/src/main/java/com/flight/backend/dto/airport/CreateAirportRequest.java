package com.flight.backend.dto.airport;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateAirportRequest {

    @NotBlank(message = "Vui lòng nhập mã sân bay")
    private String airportCode;

    @NotBlank(message = "Vui lòng nhập tên sân bay")
    private String name;

    @NotBlank(message = "Vui lòng nhập thành phố")
    private String city;

    @NotBlank(message = "Vui lòng nhập quốc gia")
    private String country;
}
