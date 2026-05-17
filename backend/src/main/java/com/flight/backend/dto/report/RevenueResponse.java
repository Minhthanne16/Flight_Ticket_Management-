package com.flight.backend.dto.report;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class RevenueResponse {

    private int month;

    private int year;

    private BigDecimal revenue;
}