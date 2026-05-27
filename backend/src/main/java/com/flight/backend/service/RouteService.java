package com.flight.backend.service;

import java.util.List;

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

        // check sân bay đi và đến
        if (request.getDepartureAirportId()
                .equals(request.getArrivalAirportId())) {

            throw new RuntimeException(
                    "Sân bay đi và đến không được giống nhau");
        }

        Airport departureAirport = airportRepository
                .findById(request.getDepartureAirportId())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sân bay đi"));

        Airport arrivalAirport = airportRepository
                .findById(request.getArrivalAirportId())
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sân bay đến"));

        // generate route code
        String routeCode =
                departureAirport.getAirportCode()
                + "-"
                + arrivalAirport.getAirportCode();

        // check route trùng
        Route existedRoute =
                routeRepository.findByRouteCode(routeCode);

        if (existedRoute != null) {
            throw new RuntimeException(
                    "Tuyến bay đã tồn tại");
        }

        Route route = new Route();

        route.setRouteCode(routeCode);
        route.setDepartureAirport(departureAirport);
        route.setArrivalAirport(arrivalAirport);
        route.setStatus(RouteStatus.ACTIVE);

        Route savedRoute = routeRepository.save(route);

        return mapToResponse(savedRoute);
    }

    public List<RouteResponse> getAll() {

        List<Route> routes = routeRepository.findAll();

        return routes.stream()
                .map(this::mapToResponse)
                .toList();
    }

    private RouteResponse mapToResponse(Route route) {

        RouteResponse response = new RouteResponse();

        response.setId(route.getId());

        response.setDepartureAirportId(
                route.getDepartureAirport().getId());

        response.setArrivalAirportId(
                route.getArrivalAirport().getId());

        response.setRouteCode(route.getRouteCode());

        response.setStatus(route.getStatus());

        return response;
    }

    @Transactional
    public RouteResponse update(
            Long id,
            CreateRouteRequest request) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tuyến bay"));

        if (request.getDepartureAirportId()
                .equals(request.getArrivalAirportId())) {

            throw new RuntimeException(
                    "Sân bay đi và đến không được giống nhau");
        }

        Airport departureAirport = airportRepository
                .findById(request.getDepartureAirportId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sân bay đi"));

        Airport arrivalAirport = airportRepository
                .findById(request.getArrivalAirportId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy sân bay đến"));

        String routeCode =
                departureAirport.getAirportCode()
                + "-"
                + arrivalAirport.getAirportCode();

        Route existedRoute =
                routeRepository.findByRouteCode(routeCode);

        if (existedRoute != null
                && !existedRoute.getId().equals(id)) {

            throw new RuntimeException(
                    "Tuyến bay đã tồn tại");
        }

        route.setDepartureAirport(departureAirport);
        route.setArrivalAirport(arrivalAirport);
        route.setRouteCode(routeCode);

        Route updatedRoute = routeRepository.save(route);

        return mapToResponse(updatedRoute);
    }
    @Transactional
    public void delete(Long id) {

        Route route = routeRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tuyến bay"));

        route.setStatus(RouteStatus.INACTIVE);

        routeRepository.save(route);
    }
}