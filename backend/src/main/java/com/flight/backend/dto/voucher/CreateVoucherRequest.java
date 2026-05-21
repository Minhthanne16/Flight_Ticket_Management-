package com.flight.backend.dto.voucher;

import com.flight.backend.entity.enums.VoucherDiscountType;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CreateVoucherRequest {

    private String voucherCode;
    private String name;

    private VoucherDiscountType discountType;
    private Long discountValue;

    private Long minBookingAmount;
    private Long maxDiscountAmount;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private Integer usageLimit;
}