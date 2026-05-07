package com.flight.backend.repository;

import com.flight.backend.entity.Seat;
import com.flight.backend.entity.enums.SeatStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByAirplaneId(Long airplaneId);

    List<Seat> findByAirplaneIdAndStatus(Long airplaneId, SeatStatus status);
}