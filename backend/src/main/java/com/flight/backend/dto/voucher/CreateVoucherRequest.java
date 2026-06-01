package com.flight.backend.dto.voucher;

import com.flight.backend.entity.enums.VoucherDiscountType;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateVoucherRequest {

    @NotBlank(message = "Voucher code is required")
    @Size(max = 50, message = "Voucher code must not exceed 50 characters")
    private String voucherCode;

    @NotBlank(message = "Voucher name is required")
    @Size(max = 255, message = "Voucher name must not exceed 255 characters")
    private String name;

    @NotNull(message = "Discount type is required")
    private VoucherDiscountType discountType;

    @NotNull(message = "Discount value is required")
    @Min(value = 1, message = "Discount value must be greater than 0")
    private Long discountValue;

    @NotNull(message = "Minimum booking amount is required")
    @Min(value = 0, message = "Minimum booking amount cannot be negative")
    private Long minBookingAmount;

    @Min(value = 1, message = "Maximum discount amount must be greater than 0")
    private Long maxDiscountAmount;

    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Future(message = "End time must be in the future")
    private LocalDateTime endTime;

    @NotNull(message = "Usage limit is required")
    @Min(value = 1, message = "Usage limit must be greater than 0")
    private Integer usageLimit;
}