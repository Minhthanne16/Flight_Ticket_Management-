package com.flight.backend.service;

import com.flight.backend.dto.booking.BookingResponse;
import com.flight.backend.dto.booking.CreateBookingRequest;
import com.flight.backend.dto.passenger.CreatePassengerRequest;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Passenger;
import com.flight.backend.entity.Ticket;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.BookingStatus;
import com.flight.backend.mapper.BookingMapper;
import com.flight.backend.repository.BookingRepository;

import jakarta.transaction.Transactional;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final FlightService flightService;
    private final PassengerService passengerService;
    private final TicketClassService ticketClassService;
    private final TicketService ticketService;
    private final PaymentService paymentService;
    private final FlightSeatService flightSeatService;
    private final BookingMapper bookingMapper;

    public BookingService(
            BookingRepository bookingRepository,
            UserService userService,
            FlightService flightService,
            PassengerService passengerService,
            TicketClassService ticketClassService,
            TicketService ticketService,
            PaymentService paymentService,
            FlightSeatService flightSeatService,
            BookingMapper bookingMapper) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.flightService = flightService;
        this.passengerService = passengerService;
        this.ticketClassService = ticketClassService;
        this.ticketService = ticketService;
        this.paymentService = paymentService;
        this.flightSeatService = flightSeatService;
        this.bookingMapper = bookingMapper;
    }

    @Transactional
    public BookingResponse createBooking(CreateBookingRequest req) {
        User customer = userService.getUserById(req.getUserId());

        Flight flight = flightService.getFlightById(req.getFlightId());

        TicketClass ticketClass = this.ticketClassService.findTicketClassById(req.getTicketClassId());
        // Tạo booking
        Booking booking = new Booking();

        booking.setCustomer(customer);
        booking.setBookingDate(LocalDateTime.now());
        booking.setFlight(flight);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPnrCode(generatePNR());
        booking.setExpirationTime(LocalDateTime.now().plusMinutes(15));
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());

        BigDecimal totalAmount = BigDecimal.ZERO;

        booking = bookingRepository.save(booking);

        // Tạo ticket cho từng passenger
        List<Ticket> tickets = new ArrayList<>();

        for (CreatePassengerRequest pRequest : req.getPassengers()) {
            Passenger passenger = this.passengerService.createPassengerEntity(pRequest);
            FlightSeat flightSeat = this.flightSeatService.createFlightSeat(flight);

            Ticket ticket = this.ticketService.createTicketEntity(booking, passenger, flightSeat, flight, ticketClass);
            totalAmount = totalAmount.add(ticket.getPrice());
            tickets.add(ticket);
        }

        // Update total
        booking.setTotalAmount(totalAmount);
        booking.setTickets(tickets);
        bookingRepository.save(booking);

        this.paymentService.createPayment(booking);

        return this.bookingMapper.toResponse(booking);
    }

    private String generatePNR() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 6)
                .toUpperCase();
    }

    public Booking getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found"));
        return booking;
    }

    public BookingResponse getBookingResponse(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found"));
        return this.bookingMapper.toResponse(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);
        booking.setStatus(BookingStatus.CANCELLED);
        booking.setUpdatedAt(LocalDateTime.now());
        return bookingRepository.save(booking);
    }

    public Booking expireBooking(Long id) {
        Booking booking = getBookingById(id);
        booking.setStatus(BookingStatus.EXPIRED);
        booking.setUpdatedAt(LocalDateTime.now());

        return bookingRepository.save(booking);
    }
}