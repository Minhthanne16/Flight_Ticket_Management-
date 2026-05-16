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
        if (airplaneRepository.existsByAirplaneCode(request.getAirplaneCode())) {
            throw new RuntimeException("Airplane code already exists");
        }

        Airline airline = airlineRepository.findById(request.airlineId)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        AirplaneModel airplaneModel = airplaneModelRepository.findById(request.modelId)
                .orElseThrow(() -> new RuntimeException("Model not found"));

        Airplane airplane = new Airplane();
        airplane.setAirplaneCode(request.airplaneCode);
        airplane.setModel(airplaneModel);
        airplane.setAirline(airline);

        airplane.setStatus(request.status);

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
                .orElseThrow(() -> new RuntimeException("Airplane not found"));

        return toResponse(airplane);
    }

    // mapper
    private AirplaneResponse toResponse(Airplane a) {
        AirplaneResponse res = new AirplaneResponse();
        res.id = a.getId();
        res.airplaneCode = a.getAirplaneCode();
        res.model = a.getModel();
        res.status = a.getStatus().name();
        res.airlineName = a.getAirline().getAirlineName();
        return res;
    }
}