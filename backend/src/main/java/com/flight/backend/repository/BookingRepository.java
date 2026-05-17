package com.flight.backend.repository;

import com.flight.backend.entity.Booking;
import com.flight.backend.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository
        extends JpaRepository<Booking, Long> {

    boolean existsByPnrCode(
            String pnrCode
    );

    List<Booking> findByStatus(
            BookingStatus status
    );

    List<Booking> findByBookingDateBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    List<Booking> findByCustomer_Id(
            Long customerId
    );

    List<Booking> findByFlight_Id(
            Long flightId
    );

    @Query("""
    SELECT COALESCE(SUM(b.totalAmount), 0)
    FROM Booking b
    WHERE MONTH(b.bookingDate) = :month
    AND YEAR(b.bookingDate) = :year
    AND b.status = :status
""")
BigDecimal getRevenueByMonth(
        @Param("month") int month,
        @Param("year") int year,
        @Param("status") BookingStatus status
);
}