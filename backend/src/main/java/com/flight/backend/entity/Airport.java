package com.flight.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "airports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Airport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airport_id")
    private Long id;

    @Column(name = "airport_code", unique = true, length = 3)
    private String airportCode;

    @Column(name = "name", length = 255)
    private String name;

    @Column(name = "city", length = 255)
    private String city;

    @Column(name = "country", length = 255)
    private String country;

    @OneToMany(mappedBy = "departureAirport")
    private List<Route> departureRoutes = new ArrayList<>();

    @OneToMany(mappedBy = "arrivalAirport")
    private List<Route> arrivalRoutes = new ArrayList<>();

    @OneToMany(mappedBy = "stopAirport")
    private List<FlightStop> flightStops = new ArrayList<>();
}
