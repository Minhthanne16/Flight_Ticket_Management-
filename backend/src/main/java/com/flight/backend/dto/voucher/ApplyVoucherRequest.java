package com.flight.backend.dto.voucher;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApplyVoucherRequest {

    @NotBlank(message = "Voucher code is required")
    private String voucherCode;

    @NotNull(message = "Booking id is required")
    private Long bookingId;
}