package com.flight.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.Airline;

@Repository
public interface AirlineRepository extends JpaRepository<Airline, Long> {

    Optional<Airline> findByAirlineCode(String airlineCode);

    boolean existsByAirlineCode(String airlineCode);

    boolean existsByAirlineName(String airlineName);

    boolean existsByAirlineCodeAndIdNot(
            String airlineCode,
            Long id);

    boolean existsByAirlineNameAndIdNot(
            String airlineName,
            Long id);
}