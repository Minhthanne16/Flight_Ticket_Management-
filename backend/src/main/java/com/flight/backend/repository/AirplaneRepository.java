package com.flight.backend.repository;

import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.enums.AirplaneStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AirplaneRepository extends JpaRepository<Airplane, Long> {

    List<Airplane> findByAirlineId(Long airlineId);

    List<Airplane> findByStatus(AirplaneStatus status);

    Optional<Airplane> findByAirplaneCode(String airplaneCode);

    Boolean existsByAirplaneCode(String airplaneCode);
}