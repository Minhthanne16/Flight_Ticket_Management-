package com.flight.backend.service;

import com.flight.backend.entity.Booking;
import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(
            BookingRepository bookingRepository
    ) {
        this.bookingRepository = bookingRepository;
    }

    public Booking createBooking(
            Booking booking
    ) {

        booking.setBookingDate(
                LocalDateTime.now()
        );

        booking.setCreatedAt(
                LocalDateTime.now()
        );

        booking.setUpdatedAt(
                LocalDateTime.now()
        );

        booking.setExpirationTime(
                LocalDateTime.now().plusHours(24)
        );

        booking.setStatus(
                BookingStatus.PENDING
        );

        booking.setPnrCode(
                generatePNRCode()
        );

        return bookingRepository.save(booking);
    }

    public Booking getBookingById(
            Long id
    ) {

        return bookingRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"
                        )
                );
    }

    public List<Booking> getAllBookings() {

        return bookingRepository.findAll();
    }

    public Booking confirmBooking(
            Long id
    ) {

        Booking booking = getBookingById(id);

        booking.setStatus(
                BookingStatus.CONFIRMED
        );

        booking.setUpdatedAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }

    public Booking markAsPaid(
            Long id
    ) {

        Booking booking = getBookingById(id);

        booking.setStatus(
                BookingStatus.PAID
        );

        booking.setUpdatedAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(
            Long id
    ) {

        Booking booking = getBookingById(id);

        booking.setStatus(
                BookingStatus.CANCELLED
        );

        booking.setUpdatedAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }

    public Booking expireBooking(
            Long id
    ) {

        Booking booking = getBookingById(id);

        booking.setStatus(
                BookingStatus.EXPIRED
        );

        booking.setUpdatedAt(
                LocalDateTime.now()
        );

        return bookingRepository.save(booking);
    }

    private String generatePNRCode() {

        String chars =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        Random random = new Random();

        StringBuilder pnr =
                new StringBuilder();

        for (int i = 0; i < 6; i++) {

            pnr.append(
                    chars.charAt(
                            random.nextInt(
                                    chars.length()
                            )
                    )
            );
        }

        if (bookingRepository.existsByPnrCode(
                pnr.toString()
        )) {

            return generatePNRCode();
        }

        return pnr.toString();
    }
}