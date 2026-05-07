package com.flight.backend.service;

import com.flight.backend.dto.FlightRequest;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.Route;
import com.flight.backend.repository.AirplaneRepository;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepo;
    private final AirplaneRepository airplaneRepo;
    private final RouteRepository routeRepo;

    public FlightService(
            FlightRepository flightRepo,
            AirplaneRepository airplaneRepo,
            RouteRepository routeRepo
    ) {
        this.flightRepo = flightRepo;
        this.airplaneRepo = airplaneRepo;
        this.routeRepo = routeRepo;
    }

    // CREATE FLIGHT
    public Flight createFlight(FlightRequest req) {

        Airplane airplane = airplaneRepo.findById(req.getAirplaneId())
                .orElseThrow(() -> new RuntimeException("Airplane not found"));

        Route route = routeRepo.findById(req.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        Flight flight = new Flight();
        flight.setFlightCode(req.getFlightCode());
        flight.setAirplane(airplane);
        flight.setRoute(route);
        flight.setDepartureTime(req.getDepartureTime());
        flight.setArrivalTime(req.getArrivalTime());
        flight.setBasePrice(req.getBasePrice());

        return flightRepo.save(flight);
    }

    public Flight getFlight(Long id) {
        return flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }

    public List<Flight> getAll() {
        return flightRepo.findAll();
    }
}