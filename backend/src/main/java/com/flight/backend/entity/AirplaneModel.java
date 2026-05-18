package com.flight.backend.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "airplane_models")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AirplaneModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "model_name", nullable = false, unique = true, length = 100)
    private String modelName;

    @Column(name = "manufacturer", nullable = false, length = 100)
    private String manufacturer;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "total_rows", nullable = false)
    private Integer totalRows;

    @Column(name = "seat_columns", nullable = false, length = 20)
    private String seatColumns; // Ví dụ: "ABCDEF"

    @Column(name = "total_seats", nullable = false)
    private Integer totalSeats;

    @JsonIgnore
    @OneToMany(mappedBy = "model")
    private List<Airplane> airplanes = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "airplaneModel")
    private List<Seat> seats = new ArrayList<>();
}