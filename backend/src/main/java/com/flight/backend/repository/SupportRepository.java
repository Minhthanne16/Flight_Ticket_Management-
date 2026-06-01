package com.flight.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.Support;
import com.flight.backend.entity.enums.RequestStatus;
import com.flight.backend.entity.enums.SupportType;

@Repository
public interface SupportRepository
        extends JpaRepository<Support, Long>,
        JpaSpecificationExecutor<Support> {

    List<Support> findBySupportTypeOrderByCreatedAtDesc(
            SupportType supportType);

    boolean existsByTicket_IdAndSupportTypeAndStatus(
            Long ticketId,
            SupportType supportType,
            RequestStatus status);
}