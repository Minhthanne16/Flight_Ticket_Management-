package com.flight.backend.dto.regulation;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegulationRequest {

    private String regulationName;

    private String settingKey;

    private BigDecimal settingValue;

    private String unit;

    private String description;
}