package com.flight.backend.service;

import com.flight.backend.dto.airport.AirportResponse;
import com.flight.backend.dto.airport.CreateAirportRequest;
import com.flight.backend.entity.Airport;
import com.flight.backend.repository.AirportRepository;
import com.flight.backend.repository.FlightStopRepository;
import com.flight.backend.repository.RouteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {

    private final AirportRepository airportRepository;
    private final RouteRepository routeRepository;
    private final FlightStopRepository flightStopRepository;

    public AirportService(
            AirportRepository airportRepository,
            RouteRepository routeRepository,
            FlightStopRepository flightStopRepository) {
        this.airportRepository = airportRepository;
        this.routeRepository = routeRepository;
        this.flightStopRepository = flightStopRepository;
    }

    public void delete(Long id) {
        airportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sân bay"));

        boolean usedByRoute =
                !routeRepository.findByDepartureAirportId(id).isEmpty()
                        || !routeRepository.findByArrivalAirportId(id).isEmpty();
        if (usedByRoute) {
            throw new RuntimeException(
                    "Không thể xóa: sân bay đang được dùng trong tuyến bay.");
        }

        if (flightStopRepository.existsByStopAirportId(id)) {
            throw new RuntimeException(
                    "Không thể xóa: sân bay đang là điểm dừng của chuyến bay.");
        }

        airportRepository.deleteById(id);
    }

    public AirportResponse create(CreateAirportRequest req) {

        String airportCode =
                req.getAirportCode().trim().toUpperCase();

        if (airportRepository.existsByAirportCode(airportCode)) {
            throw new RuntimeException(
                    "Mã sân bay đã tồn tại");
        }

        Airport airport = new Airport();

        airport.setAirportCode(airportCode);
        airport.setName(req.getName().trim());
        airport.setCity(req.getCity().trim());
        airport.setCountry(req.getCountry().trim());

        Airport saved = airportRepository.save(airport);

        AirportResponse res = new AirportResponse();
        res.setId(saved.getId());
        res.setAirportCode(saved.getAirportCode());
        res.setName(saved.getName());
        res.setCity(saved.getCity());
        res.setCountry(saved.getCountry());

        return res;
    }

    public List<AirportResponse> getAll() {

        return airportRepository.findAll()
                .stream()
                .map(a -> {
                    AirportResponse res = new AirportResponse();
                    res.setId(a.getId());
                    res.setAirportCode(a.getAirportCode());
                    res.setName(a.getName());
                    res.setCity(a.getCity());
                    res.setCountry(a.getCountry());
                    return res;
                })
                .toList();
    }

    public Airport getAirportById(Long id) {

        return airportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy sân bay"));
    }
}