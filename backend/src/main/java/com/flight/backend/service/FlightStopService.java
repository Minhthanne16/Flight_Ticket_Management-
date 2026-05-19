package com.flight.backend.service;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.flight.CreateFlightStopRequest;
import com.flight.backend.dto.flight.FlightStopResponse;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightStop;
import com.flight.backend.repository.FlightStopRepository;

@Service
public class FlightStopService {
    private final FlightStopRepository flightStopRepository;
    private final AirportService airportService;

    public FlightStopService(
            FlightStopRepository flightStopRepository,
            AirportService airportService) {
        this.flightStopRepository = flightStopRepository;
        this.airportService = airportService;
    }

    public List<FlightStopResponse> createFlightStop(Flight flight, List<CreateFlightStopRequest> fts) {
        List<FlightStop> flightStops = new ArrayList<>();
        for (CreateFlightStopRequest ft : fts) {
            FlightStop flightStop = new FlightStop();
            flightStop.setFlight(flight);
            flightStop.setStopAirport(airportService.getAirportById(ft.getAirportStopId()));
            flightStop.setArrivalTime(ft.getArrivalTime());
            flightStop.setDepartureTime(ft.getDepartureTime());
            Duration duration = Duration.between(ft.getArrivalTime(), ft.getDepartureTime());
            flightStop.setStopDuration(duration.toMinutes());
            flightStops.add(flightStop);
        }
        List<FlightStop> saved = this.flightStopRepository.saveAll(flightStops);
        return saved.stream()
                .map(flightStop -> FlightStopResponse.builder()
                        .flightStopId(flightStop.getId())
                        .airportStopId(flightStop.getStopAirport().getId())
                        .arrivalTime(flightStop.getArrivalTime())
                        .departureTime(flightStop.getDepartureTime())
                        .stopOrder(flightStop.getStopOrder())
                        .build())
                .toList();
    }
}
