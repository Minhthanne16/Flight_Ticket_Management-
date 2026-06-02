package com.flight.backend.dto.regulation;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegulationRequest {

    @NotBlank(message = "Vui lòng nhập tên quy định")
    private String regulationName;

    @NotBlank(message = "Vui lòng nhập khóa cấu hình")
    private String settingKey;

    @NotNull(message = "Vui lòng nhập giá trị")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Giá trị phải lớn hơn 0")
    private BigDecimal settingValue;

    @NotBlank(message = "Vui lòng nhập đơn vị")
    private String unit;

    private String description;
}
