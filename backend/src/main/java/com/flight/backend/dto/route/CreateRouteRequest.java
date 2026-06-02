package com.flight.backend.dto.route;

import com.flight.backend.entity.enums.RouteStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateRouteRequest {

    @NotBlank(message = "Vui lòng nhập mã tuyến bay")
    private String routeCode; // Ví dụ: SGN-HAN

    @NotNull(message = "Vui lòng chọn sân bay đi")
    private Long departureAirportId;

    @NotNull(message = "Vui lòng chọn sân bay đến")
    private Long arrivalAirportId;

    private RouteStatus status;
}
