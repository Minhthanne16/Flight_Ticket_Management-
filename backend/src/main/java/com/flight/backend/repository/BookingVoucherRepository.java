package com.flight.backend.repository;

import com.flight.backend.entity.BookingVoucher;
import org.springframework.data.jpa.repository.JpaRepository;


public interface BookingVoucherRepository extends JpaRepository<BookingVoucher, Long> {
    boolean existsByBookingId(Long bookingId);
    boolean existsByVoucherId(Long voucherId);
}