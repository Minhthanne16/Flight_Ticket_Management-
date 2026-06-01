package com.flight.backend.service;

import com.flight.backend.dto.airplane.AirplaneResponse;
import com.flight.backend.dto.airplane.CreateAirplaneRequest;
import com.flight.backend.entity.Airline;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.AirplaneModel;
import com.flight.backend.repository.AirlineRepository;
import com.flight.backend.repository.AirplaneModelRepository;
import com.flight.backend.repository.AirplaneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirplaneService {

    private final AirplaneRepository airplaneRepository;
    private final AirlineRepository airlineRepository;
    private final AirplaneModelRepository airplaneModelRepository;

    public AirplaneService(
            AirplaneRepository airplaneRepository,
            AirlineRepository airlineRepository,
            AirplaneModelRepository airplaneModelRepository) {

        this.airplaneRepository = airplaneRepository;
        this.airlineRepository = airlineRepository;
        this.airplaneModelRepository = airplaneModelRepository;
    }

    // CREATE
    public AirplaneResponse create(CreateAirplaneRequest request) {

        String airplaneCode =
                request.getAirplaneCode().trim().toUpperCase();

        if (airplaneRepository.existsByAirplaneCode(airplaneCode)) {
            throw new RuntimeException(
                    "Airplane code '" + airplaneCode + "' already exists");
        }

        Airline airline = airlineRepository.findById(
                        request.getAirlineId())
                .orElseThrow(() ->
                        new RuntimeException("Airline not found"));

        AirplaneModel airplaneModel =
                airplaneModelRepository.findById(
                                request.getModelId())
                        .orElseThrow(() ->
                                new RuntimeException("Model not found"));

        Airplane airplane = new Airplane();

        airplane.setAirplaneCode(airplaneCode);
        airplane.setAirline(airline);
        airplane.setModel(airplaneModel);
        airplane.setStatus(request.getStatus());

        Airplane saved = airplaneRepository.save(airplane);

        return toResponse(saved);
    }

    // GET ALL
    public List<AirplaneResponse> getAll() {

        return airplaneRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET BY ID
    public AirplaneResponse getById(Long id) {

        Airplane airplane = airplaneRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Airplane not found"));

        return toResponse(airplane);
    }

    // MAPPER
    private AirplaneResponse toResponse(Airplane airplane) {

        AirplaneResponse response = new AirplaneResponse();

        response.setId(airplane.getId());
        response.setAirplaneCode(airplane.getAirplaneCode());
        response.setModel(airplane.getModel());

        response.setAirlineName(
                airplane.getAirline().getAirlineName());

        response.setStatus(
                airplane.getStatus().name());

        if (airplane.getModel() != null) {
            response.setTotalSeats(
                    airplane.getModel().getTotalSeats());
        }

        return response;
    }
}