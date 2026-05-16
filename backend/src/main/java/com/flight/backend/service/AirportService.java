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
        res.id = saved.getId();
        res.airportCode = saved.getAirportCode();
        res.name = saved.getName();
        res.city = saved.getCity();
        res.country = saved.getCountry();

        return res;
    }

    public List<AirportResponse> getAll() {
        return airportRepository.findAll().stream().map(a -> {
            AirportResponse res = new AirportResponse();
            res.id = a.getId();
            res.airportCode = a.getAirportCode();
            res.name = a.getName();
            res.city = a.getCity();
            res.country = a.getCountry();
            return res;
        }).toList();
    }
}