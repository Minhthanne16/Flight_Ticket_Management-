package com.flight.backend.service;

import com.flight.backend.dto.airport.AirportResponse;
import com.flight.backend.dto.airport.CreateAirportRequest;
import com.flight.backend.entity.Airport;
import com.flight.backend.repository.AirportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirportService {

    private final AirportRepository airportRepository;

    public AirportService(AirportRepository airportRepository) {
        this.airportRepository = airportRepository;
    }

    public AirportResponse create(CreateAirportRequest req) {

        Airport airport = new Airport();
        airport.setAirportCode(req.airportCode);
        airport.setName(req.name);
        airport.setCity(req.city);
        airport.setCountry(req.country);

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
        return airportRepository.findAll().stream().map(a -> {
            AirportResponse res = new AirportResponse();
            res.setId(a.getId());
            res.setAirportCode(a.getAirportCode());
            res.setName(a.getName());
            res.setCity(a.getCity());
            res.setCountry(a.getCountry());
            return res;
        }).toList();
    }

    public Airport getAirportById(Long id) {
        return this.airportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found"));
    }
}