package com.flight.backend.dto.voucher;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
public class ApplyVoucherResponse {
    private BigDecimal originalAmount;
    private BigDecimal discount;
    private BigDecimal finalAmount;
}