package com.flight.backend.repository;

import com.flight.backend.entity.Seat;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByAirplaneModelId(Long airplaneModelId);
}