package com.flight.backend.dto.flight;

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
public class FlightSeatMapItem {
    private Long flightSeatId;
    private String seatNumber;
    private Integer rowNumber;
    private String columnLetter;
    private Long ticketClassId;
    private String ticketClassName;
    private String status; // AVAILABLE, HELD, BOOKED, BLOCKED

    // Thông tin đặt chỗ (nếu ghế đã có vé)
    private String passengerName;
    private String ticketNumber; // mã vé
    private String pnrCode;       // mã đặt chỗ
}
