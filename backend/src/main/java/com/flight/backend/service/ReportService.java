package com.flight.backend.service;

import com.flight.backend.dto.report.OccupancyResponse;
import com.flight.backend.dto.report.RevenueResponse;
import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.entity.enums.TicketStatus;
import com.flight.backend.repository.BookingRepository;
import com.flight.backend.repository.FlightSeatRepository;
import com.flight.backend.repository.TicketRepository;
import java.math.BigDecimal;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final BookingRepository bookingRepository;

    private final TicketRepository ticketRepository;

    private final FlightSeatRepository flightSeatRepository;

    public RevenueResponse getRevenue(
            int month,
            int year
    ) {

        // Doanh thu tính trên đơn đã thanh toán (PAID). Giữ CONFIRMED để tương thích
        // nếu sau này có luồng xác nhận riêng đặt trạng thái này.
        BigDecimal revenue =
                bookingRepository.getRevenueByMonth(
                        month,
                        year,
                        List.of(BookingStatus.PAID, BookingStatus.CONFIRMED)
                );

        return new RevenueResponse(
                month,
                year,
                revenue
        );
    }

    public OccupancyResponse getOccupancy(
            Long flightId
    ) {

        long soldSeats =
                ticketRepository.countSoldSeats(
                        flightId,
                        List.of(
                                TicketStatus.ISSUED,
                                TicketStatus.USED
                        )
                );

        long totalSeats =
                flightSeatRepository.countTotalSeats(
                        flightId
                );

        double occupancyRate = 0;

        if (totalSeats > 0) {
            occupancyRate =
                    (soldSeats * 100.0) / totalSeats;
        }

        return new OccupancyResponse(
                flightId,
                soldSeats,
                totalSeats,
                occupancyRate
        );
    }
}