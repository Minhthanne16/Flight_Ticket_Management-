package com.flight.backend.dto.regulation;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RegulationResponse {

    private Long id;

    private String regulationName;

    private String settingKey;

    private BigDecimal settingValue;

    private String unit;

    private String description;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}