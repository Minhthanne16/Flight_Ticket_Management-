package com.flight.backend.repository;

import com.flight.backend.entity.TicketClass;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TicketClassRepository
        extends JpaRepository<TicketClass, Long> {

    boolean existsByClassCode(String classCode);

    Optional<TicketClass> findById(Long id);
}