package com.flight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.FlightStop;

@Repository
public interface FlightStopRepository extends JpaRepository<FlightStop, Long> {

}
