package com.flight.backend.dto.ticket;

import java.math.BigDecimal;

import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.entity.enums.TicketStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {

    private Long ticketId;

    private String passengerName;

    private String documentNumber;

    private String nationality;

    private BigDecimal price;

    private TicketStatus status;

    private FlightSeatStatus seatStatus;

    private String seatNumber;
}
