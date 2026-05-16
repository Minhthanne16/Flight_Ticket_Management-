package com.flight.backend.dto.booking;

import java.time.LocalDateTime;
import java.util.List;

import com.flight.backend.dto.passenger.CreatePassengerRequest;
import com.flight.backend.entity.enums.PaymentMethod;

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
public class CreateBookingRequest {
    private Long userId;
    private LocalDateTime bookingDate;
    private Long flightId;
    private Long ticketClassId;
    private PaymentMethod paymentMethod;
    private List<CreatePassengerRequest> passengers;
}
