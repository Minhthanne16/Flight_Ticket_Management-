package com.flight.backend.mapper;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.payment.PaymentResponse;
import com.flight.backend.entity.Payment;

@Component
public class PaymentMapper {

    public PaymentResponse toResponse(Payment payment) {

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .bookingId(
                        payment.getBooking().getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentTime(payment.getPaymentTime())
                .status(payment.getStatus())
                .build();
    }
}
