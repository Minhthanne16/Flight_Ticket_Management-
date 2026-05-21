package com.flight.backend.repository;

import com.flight.backend.entity.Ticket;
import com.flight.backend.entity.enums.TicketStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long> {
    Optional<Ticket> findByTicketNumber(String ticketNumber);
    @Query("""
        SELECT COUNT(t)
        FROM Ticket t
        WHERE t.flightSeat.flight.id = :flightId
        AND t.status IN :statuses
    """)
    Long countSoldSeats(
            @Param("flightId") Long flightId,
            @Param("statuses") List<TicketStatus> statuses
    );
}