package com.flight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.AirplaneModel;
import java.util.Optional;

@Repository
public interface AirplaneModelRepository extends JpaRepository<AirplaneModel, Long> {
    Optional<AirplaneModel> findById(Long id);
}
