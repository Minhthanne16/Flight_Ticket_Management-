package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.flight.backend.dto.flight.FlightSeatMapItem;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.Ticket;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.repository.FlightSeatRepository;

@Service
public class FlightSeatService {
    private final FlightSeatRepository flightSeatRepository;

    public FlightSeatService(FlightSeatRepository flightSeatRepository) {
        this.flightSeatRepository = flightSeatRepository;
    }

    // Sơ đồ ghế của chuyến bay (DTO sạch, đọc từ DB)
    @Transactional(readOnly = true)
    public List<FlightSeatMapItem> getSeatMap(Long flightId) {
        return flightSeatRepository.findByFlightId(flightId).stream().map(fs -> {
            Seat seat = fs.getSeat();
            TicketClass tc = seat != null ? seat.getTicketClass() : null;
            Ticket ticket = fs.getTicket();

            String passengerName = null;
            String ticketNumber = null;
            String pnrCode = null;
            if (ticket != null) {
                ticketNumber = ticket.getTicketNumber();
                if (ticket.getPassenger() != null) {
                    passengerName = ticket.getPassenger().getFullName();
                }
                if (ticket.getBooking() != null) {
                    pnrCode = ticket.getBooking().getPnrCode();
                }
            }

            return FlightSeatMapItem.builder()
                    .flightSeatId(fs.getId())
                    .seatNumber(seat != null ? seat.getSeatNumber() : null)
                    .rowNumber(seat != null ? seat.getRowNumber() : null)
                    .columnLetter(seat != null ? seat.getColumnLetter() : null)
                    .ticketClassId(tc != null ? tc.getId() : null)
                    .ticketClassName(tc != null ? tc.getClassName() : null)
                    .status(fs.getStatus() != null ? fs.getStatus().name() : null)
                    .passengerName(passengerName)
                    .ticketNumber(ticketNumber)
                    .pnrCode(pnrCode)
                    .build();
        }).toList();
    }

    public FlightSeat createFlightSeat(Flight flight) {
        FlightSeat flightSeat = FlightSeat.builder()
                .flight(flight)
                .status(FlightSeatStatus.HELD)
                .build();
        return flightSeatRepository.save(flightSeat);
    }

    // Xem sơ đồ ghế
    public List<FlightSeat> getSeatsByFlight(Long flightId) {
        return flightSeatRepository.findByFlightId(flightId);
    }

    // Chọn ghế
    public FlightSeat selectSeat(Long seatId) {

        FlightSeat seat = flightSeatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.getStatus() != FlightSeatStatus.AVAILABLE) {
            throw new RuntimeException("Seat is not available");
        }

        seat.setStatus(FlightSeatStatus.HELD);

        return flightSeatRepository.save(seat);
    }
}
