package com.flight.backend.service;

import com.flight.backend.dto.AirplaneRequest;
import com.flight.backend.dto.AirplaneResponse;
import com.flight.backend.entity.Airline;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.enums.AirplaneStatus;
import com.flight.backend.repository.AirlineRepository;
import com.flight.backend.repository.AirplaneRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AirplaneService {

    private final AirplaneRepository airplaneRepository;
    private final AirlineRepository airlineRepository;

    public AirplaneService(AirplaneRepository airplaneRepository,
                           AirlineRepository airlineRepository) {
        this.airplaneRepository = airplaneRepository;
        this.airlineRepository = airlineRepository;
    }

    // CREATE
    public AirplaneResponse create(AirplaneRequest request) {

        Airline airline = airlineRepository.findById(request.airlineId)
                .orElseThrow(() -> new RuntimeException("Airline not found"));

        Airplane airplane = new Airplane();
        airplane.setAirplaneCode(request.airplaneCode);
        airplane.setModel(request.model);
        airplane.setAirline(airline);
        airplane.setTotalSeats(request.totalSeats);

        airplane.setStatus(
                request.status != null
                        ? AirplaneStatus.valueOf(request.status.toUpperCase())
                        : AirplaneStatus.ACTIVE
        );

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
        res.totalSeats = a.getTotalSeats();
        res.status = a.getStatus().name();
        res.airlineName = a.getAirline() != null ? a.getAirline().getName() : null;
        return res;
    }
}