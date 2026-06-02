package com.flight.backend.dto.flight;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateFlightStopRequest {

    @NotNull(message = "Vui lòng chọn sân bay dừng")
    private Long airportStopId;

    @NotNull(message = "Vui lòng nhập giờ đến")
    private LocalDateTime arrivalTime;

    @NotNull(message = "Vui lòng nhập giờ đi")
    private LocalDateTime departureTime;

    @Min(value = 1, message = "Thứ tự điểm dừng phải lớn hơn 0")
    private int stopOrder;
}
