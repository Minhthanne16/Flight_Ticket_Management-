package com.flight.backend.dto.voucher;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PreviewVoucherRequest {
    private String voucherCode;
    private BigDecimal amount;
}
