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

    @NotBlank(message = "Regulation name is required")
    private String regulationName;

    @NotBlank(message = "Setting key is required")
    private String settingKey;

    @NotNull(message = "Setting value is required")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Setting value must be greater than 0")
    private BigDecimal settingValue;

    @NotBlank(message = "Unit is required")
    private String unit;

    private String description;
}