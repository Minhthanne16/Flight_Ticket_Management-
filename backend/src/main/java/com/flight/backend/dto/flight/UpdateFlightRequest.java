package com.flight.backend.dto.flight;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import java.util.List;

import com.flight.backend.entity.enums.FlightStatus;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateFlightRequest {

    @NotBlank(message = "Vui lòng nhập mã chuyến bay")
    private String flightCode;

    @NotNull(message = "Vui lòng chọn tuyến bay")
    private Long routeId;

    @NotNull(message = "Vui lòng nhập giờ khởi hành")
    private LocalDateTime departureTime;

    @Positive(message = "Thời lượng bay phải lớn hơn 0")
    private int estimateDuration;

    @NotNull(message = "Vui lòng nhập giá cơ bản")
    @DecimalMin(value = "0.0", inclusive = false, message = "Giá cơ bản phải lớn hơn 0")
    private BigDecimal basePrice;

    @NotNull(message = "Vui lòng chọn trạng thái")
    private FlightStatus status;

    @Valid
    private List<CreateFlightStopRequest> flightStops;
}
