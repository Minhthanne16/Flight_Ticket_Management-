package com.flight.backend.repository;

import com.flight.backend.entity.Booking;
import com.flight.backend.entity.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}