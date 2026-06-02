package com.flight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.FlightSeat;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface FlightSeatRepository extends JpaRepository<FlightSeat, Long> {
    List<FlightSeat> findByFlightId(Long id);

    Optional<FlightSeat> findByFlightIdAndSeatId(Long flightId, Long seatId);
    @Query("""
    SELECT COUNT(fs)
    FROM FlightSeat fs
    WHERE fs.flight.id = :flightId
""")
Long countTotalSeats(
        @Param("flightId") Long flightId
);

    @Query("""
    SELECT COUNT(fs)
    FROM FlightSeat fs
    WHERE fs.flight.id = :flightId
    AND fs.status = com.flight.backend.entity.enums.FlightSeatStatus.AVAILABLE
""")
    Long countAvailableSeats(
            @Param("flightId") Long flightId
    );
}
