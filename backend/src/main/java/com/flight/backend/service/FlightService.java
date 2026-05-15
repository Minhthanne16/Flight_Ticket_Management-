package com.flight.backend.service;

import com.flight.backend.dto.flight.CreateFlightRequest;
import com.flight.backend.dto.flight.FlightResponse;
import com.flight.backend.dto.flight.FlightSearchResponse;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Route;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.repository.AirplaneRepository;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.FlightSeatRepository;
import com.flight.backend.repository.RouteRepository;
import com.flight.backend.repository.SeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepo;
    private final AirplaneRepository airplaneRepo;
    private final RouteRepository routeRepo;
    private final SeatRepository seatRepo;
    private final FlightSeatRepository flightSeatRepo;

    public FlightService(
            FlightRepository flightRepo,
            AirplaneRepository airplaneRepo,
            RouteRepository routeRepo,
            SeatRepository seatRepo,
            FlightSeatRepository flightSeatRepo) {
        this.flightRepo = flightRepo;
        this.airplaneRepo = airplaneRepo;
        this.routeRepo = routeRepo;
        this.seatRepo = seatRepo;
        this.flightSeatRepo = flightSeatRepo;
    }

    // CREATE FLIGHT
    @Transactional
    public FlightResponse createFlight(CreateFlightRequest req) {

        // 1. Lấy Airplane
        Airplane airplane = airplaneRepo.findById(req.getAirplaneId())
                .orElseThrow(() -> new RuntimeException("Airplane not found"));

        // 2. Lấy Route
        Route route = routeRepo.findById(req.getRouteId())
                .orElseThrow(() -> new RuntimeException("Route not found"));

        // 3. Tạo Flight
        Flight flight = new Flight();
        flight.setFlightCode(req.getFlightCode());
        flight.setAirplane(airplane);
        flight.setRoute(route);
        flight.setDepartureTime(req.getDepartureTime());
        flight.setEstimateDuration(req.getEstimateDuration());
        flight.setBasePrice(req.getBasePrice());
        flight.setStatus(req.getStatus());

        // 4. Lưu Flight
        Flight savedFlight = flightRepo.save(flight);

        // 5. Lấy toàn bộ Seat template của AirplaneModel
        Long modelId = airplane.getModel().getId();
        List<Seat> seats = seatRepo.findByAirplaneModelId(modelId);

        // 6. Tạo FlightSeat với trạng thái AVAILABLE
        List<FlightSeat> flightSeats = new ArrayList<>();

        for (Seat seat : seats) {
            FlightSeat flightSeat = new FlightSeat();
            flightSeat.setFlight(savedFlight);
            flightSeat.setSeat(seat);
            flightSeat.setStatus(FlightSeatStatus.AVAILABLE);

            flightSeats.add(flightSeat);
        }

        // 7. Lưu toàn bộ FlightSeat
        flightSeatRepo.saveAll(flightSeats);

        FlightResponse resp = new FlightResponse();
        resp.setId(savedFlight.getId());
        resp.setFlightCode(savedFlight.getFlightCode());
        resp.setDepartureTime(savedFlight.getDepartureTime());
        resp.setEstimateDuration(savedFlight.getEstimateDuration());
        resp.setBasePrice(savedFlight.getBasePrice());
        resp.setStatus(savedFlight.getStatus());
        resp.setAirplaneId(airplane.getId());
        resp.setRouteId(route.getId());

        return resp;
    }

    public FlightResponse getFlight(Long id) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        return FlightResponse.builder()
                .id(flight.getId())
                .flightCode(flight.getFlightCode())
                .departureTime(flight.getDepartureTime())
                .estimateDuration(flight.getEstimateDuration())
                .basePrice(flight.getBasePrice())
                .status(flight.getStatus())
                .airplaneId(flight.getAirplane().getId())
                .routeId(flight.getRoute().getId())
                .build();
    }

    public List<Flight> getAll() {
        return flightRepo.findAll();
    }

    public List<FlightSearchResponse> searchFlights(Long fromAirportId, Long toAirportId, java.time.LocalDate date, Long airlineId, Long minPrice, Long maxPrice) {
        org.springframework.data.jpa.domain.Specification<Flight> spec = org.springframework.data.jpa.domain.Specification.where(com.flight.backend.specification.FlightSpecification.hasDepartureAirport(fromAirportId))
                .and(com.flight.backend.specification.FlightSpecification.hasArrivalAirport(toAirportId))
                .and(com.flight.backend.specification.FlightSpecification.hasDepartureDate(date))
                .and(com.flight.backend.specification.FlightSpecification.hasAirline(airlineId))
                .and(com.flight.backend.specification.FlightSpecification.priceBetween(minPrice, maxPrice));

        List<Flight> flights = flightRepo.findAll(spec);
        
        List<FlightSearchResponse> responses = new ArrayList<>();
        for (Flight flight : flights) {
            FlightSearchResponse resp = FlightSearchResponse.builder()
                    .id(flight.getId())
                    .flightCode(flight.getFlightCode())
                    .airlineId(flight.getAirplane().getAirline().getId())
                    .airlineName(flight.getAirplane().getAirline().getAirlineName())
                    .airlineLogo(flight.getAirplane().getAirline().getLogo())
                    .departureAirportId(flight.getRoute().getDepartureAirport().getId())
                    .departureAirportCode(flight.getRoute().getDepartureAirport().getAirportCode())
                    .departureCity(flight.getRoute().getDepartureAirport().getCity())
                    .arrivalAirportId(flight.getRoute().getArrivalAirport().getId())
                    .arrivalAirportCode(flight.getRoute().getArrivalAirport().getAirportCode())
                    .arrivalCity(flight.getRoute().getArrivalAirport().getCity())
                    .departureTime(flight.getDepartureTime())
                    .arrivalTime(flight.getArrivalTime())
                    .estimateDuration(flight.getEstimateDuration())
                    .basePrice(flight.getBasePrice())
                    .status(flight.getStatus())
                    .build();
            responses.add(resp);
        }
        return responses;
    }
}