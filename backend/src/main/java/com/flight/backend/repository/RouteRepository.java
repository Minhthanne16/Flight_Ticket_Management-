package com.flight.backend.repository;

import com.flight.backend.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {

    // tìm theo code route
    Route findByRouteCode(String routeCode);

    // tìm route theo sân bay đi
    List<Route> findByDepartureAirportId(Long departureAirportId);

    // tìm route theo sân bay đến
    List<Route> findByArrivalAirportId(Long arrivalAirportId);
}