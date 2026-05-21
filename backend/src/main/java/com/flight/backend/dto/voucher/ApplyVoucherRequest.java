package com.flight.backend.dto.voucher;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyVoucherRequest {
    private String voucherCode;
    private Long bookingId;
}