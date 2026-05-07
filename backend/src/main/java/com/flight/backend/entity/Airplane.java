package com.flight.backend.entity;

import com.flight.backend.entity.enums.AirplaneStatus;
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
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "airplanes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Airplane {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "airplane_id")
    private Long id;

    @Column(name = "airplane_code", unique = true, length = 10)
    private String airplaneCode;

    @Column(name = "model", length = 255)
    private String model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private AirplaneStatus status;

    @Column(name = "total_seats")
    private Integer totalSeats;

    @OneToMany(mappedBy = "airplane")
    private List<Flight> flights = new ArrayList<>();

    @OneToMany(mappedBy = "airplane")
    private List<Seat> seats = new ArrayList<>();
}
