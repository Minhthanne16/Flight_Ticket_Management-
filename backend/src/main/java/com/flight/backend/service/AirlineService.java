package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.airline.AirlineResponse;
import com.flight.backend.dto.airline.CreateAirlineRequest;
import com.flight.backend.dto.airline.UpdateAirlineRequest;
import com.flight.backend.entity.Airline;
import com.flight.backend.repository.AirlineRepository;

@Service
public class AirlineService {

    private final AirlineRepository airlineRepository;

    public AirlineService(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    // CREATE
    public AirlineResponse createAirline(CreateAirlineRequest req) {
        if (airlineRepository.existsByAirlineCode(req.getAirlineCode())) {
            throw new RuntimeException("Code already exists");
        }

        Airline airline = new Airline();

        airline.setAirlineCode(req.getAirlineCode());
        airline.setAirlineName(req.getAirlineName());
        airline.setDescription(req.getDescription());
        airline.setLogo(req.getLogo());

        Airline saved = airlineRepository.save(airline);

        AirlineResponse response = new AirlineResponse();
        response.setId(saved.getId());
        response.setAirlineCode(saved.getAirlineCode());
        response.setAirlineName(saved.getAirlineName());
        response.setDescription(saved.getDescription());
        response.setLogo(saved.getLogo());

        return response;
    }

    // GET ALL
    public List<AirlineResponse> getAllAirlines() {
        return airlineRepository.findAll().stream().map(a -> {
            AirlineResponse res = new AirlineResponse();
            res.setId(a.getId());
            res.setAirlineCode(a.getAirlineCode());
            res.setAirlineName(a.getAirlineName());
            res.setDescription(a.getDescription());
            res.setLogo(a.getLogo());
            return res;
        }).toList();
    }

    // UPDATE
    public AirlineResponse updateAirline(Long id, UpdateAirlineRequest updatedAirline) {

        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        airline.setAirlineCode(updatedAirline.getAirlineCode());
        airline.setAirlineName(updatedAirline.getAirlineName());
        airline.setDescription(updatedAirline.getDescription());
        airline.setLogo(updatedAirline.getLogo());

        Airline saved = this.airlineRepository.save(airline);

        AirlineResponse response = new AirlineResponse();
        response.setId(saved.getId());
        response.setAirlineCode(saved.getAirlineCode());
        response.setAirlineName(saved.getAirlineName());
        response.setDescription(saved.getDescription());
        response.setLogo(saved.getLogo());

        return response;
    }

    // DELETE
    public void deleteAirline(Long id) {

        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        airlineRepository.delete(airline);
    }
}