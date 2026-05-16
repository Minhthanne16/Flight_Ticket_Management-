package com.flight.backend.dto.payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.flight.backend.entity.enums.PaymentMethod;
import com.flight.backend.entity.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentResponse {
    private Long paymentId;
    private Long bookingId;
    private BigDecimal amount;
    private PaymentMethod paymentMethod;
    private LocalDateTime paymentTime;
    private PaymentStatus status;
}
