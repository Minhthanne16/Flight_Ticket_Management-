package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.entity.Airline;
import com.flight.backend.repository.AirlineRepository;

@Service
public class AirlineService {

    private final AirlineRepository airlineRepository;

    public AirlineService(AirlineRepository airlineRepository) {
        this.airlineRepository = airlineRepository;
    }

    // CREATE
    public Airline createAirline(Airline airline) {
        return airlineRepository.save(airline);
    }

    // GET ALL
    public List<Airline> getAllAirlines() {
        return airlineRepository.findAll();
    }

    // UPDATE
    public Airline updateAirline(Long id, Airline updatedAirline) {

        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        airline.setAirlineCode(updatedAirline.getAirlineCode());
        airline.setName(updatedAirline.getName());
        airline.setLogo(updatedAirline.getLogo());

        return airlineRepository.save(airline);
    }

    // DELETE
    public void deleteAirline(Long id) {

        Airline airline = airlineRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        airlineRepository.delete(airline);
    }
}