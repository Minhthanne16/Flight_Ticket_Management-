package com.flight.backend.dto.payment;

import com.flight.backend.entity.enums.PaymentMethod;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdatePaymentRequest {
    private Long bookingId;
    private PaymentMethod paymentMethod;
}
