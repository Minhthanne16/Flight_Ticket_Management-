package com.flight.backend.service;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.route.CreateRouteRequest;
import com.flight.backend.dto.route.RouteResponse;
import com.flight.backend.entity.Airport;
import com.flight.backend.entity.Route;
import com.flight.backend.entity.enums.RouteStatus;
import com.flight.backend.repository.AirportRepository;
import com.flight.backend.repository.RouteRepository;

import jakarta.transaction.Transactional;

@Service
public class RouteService {
    private final RouteRepository routeRepository;
    private final AirportRepository airportRepository;

    public RouteService(
            RouteRepository routeRepository,
            AirportRepository airportRepository) {
        this.routeRepository = routeRepository;
        this.airportRepository = airportRepository;
    }

    @Transactional
    public RouteResponse create(CreateRouteRequest request) {
        Route route = new Route();
        Airport departureAirport = airportRepository.findById(request.getDepartureAirportId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân bay"));
        Airport arrivalAirport = airportRepository.findById(request.getArrivalAirportId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sân bay"));

        route.setDepartureAirport(departureAirport);
        route.setArrivalAirport(arrivalAirport);
        route.setStatus(RouteStatus.ACTIVE);

        Route savedRoute = routeRepository.save(route);

        RouteResponse response = new RouteResponse();
        response.setId(savedRoute.getId());
        response.setDepartureAirportId(savedRoute.getDepartureAirport().getId());
        response.setArrivalAirportId(savedRoute.getArrivalAirport().getId());

        return response;
    }
}
