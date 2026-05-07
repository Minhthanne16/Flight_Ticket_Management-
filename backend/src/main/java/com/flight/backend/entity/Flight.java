package com.flight.backend.entity;

import com.flight.backend.entity.enums.FlightStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "flights")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flight_id")
    private Long id;

    @Column(name = "flight_code", unique = true, nullable = false, length = 10)
    private String flightCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airplane_id")
    private Airplane airplane;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "route_id")
    private Route route;

    @Column(name = "departure_time")
    private LocalDateTime departureTime;

    @Column(name = "arrival_time")
    private LocalDateTime arrivalTime;

    @Column(name = "flight_duration")
    private Integer flightDuration;

    @Column(name = "base_price")
    private Long basePrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private FlightStatus status;

    @OneToMany(mappedBy = "flight")
    private List<Booking> bookings = new ArrayList<>();

    @OneToMany(mappedBy = "flight")
    private List<FlightStop> flightStops = new ArrayList<>();

    @OneToMany(mappedBy = "flight")
    private List<FlightSeat> flightSeats = new ArrayList<>();
}
