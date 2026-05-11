package com.flight.backend.entity;

import com.flight.backend.entity.enums.AirplaneStatus;
import jakarta.persistence.*;
import lombok.*;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "model_id")
    private AirplaneModel model;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airline_id")
    private Airline airline;

    @Enumerated(EnumType.STRING)
    private AirplaneStatus status;
}