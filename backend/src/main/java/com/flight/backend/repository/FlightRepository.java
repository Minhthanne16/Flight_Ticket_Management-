package com.flight.backend.repository;

import com.flight.backend.entity.Flight;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface FlightRepository extends JpaRepository<Flight, Long>, JpaSpecificationExecutor<Flight> {

    List<Flight> findByDepartureTimeBetween(LocalDateTime start, LocalDateTime end);

    List<Flight> findByAirplaneId(Long airplaneId);

    List<Flight> findByRouteId(Long routeId);
}