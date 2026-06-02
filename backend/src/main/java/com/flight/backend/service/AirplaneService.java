package com.flight.backend.service;

import com.flight.backend.dto.airplane.AirplaneResponse;
import com.flight.backend.dto.airplane.CreateAirplaneRequest;
import com.flight.backend.entity.Airline;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.AirplaneModel;
import com.flight.backend.repository.AirlineRepository;
import com.flight.backend.repository.AirplaneModelRepository;
import com.flight.backend.repository.AirplaneRepository;
import com.flight.backend.repository.FlightRepository;
import org.hibernate.Hibernate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AirplaneService {

    private final AirplaneRepository airplaneRepository;
    private final AirlineRepository airlineRepository;
    private final AirplaneModelRepository airplaneModelRepository;
    private final FlightRepository flightRepository;

    public AirplaneService(
            AirplaneRepository airplaneRepository,
            AirlineRepository airlineRepository,
            AirplaneModelRepository airplaneModelRepository,
            FlightRepository flightRepository) {

        this.airplaneRepository = airplaneRepository;
        this.airlineRepository = airlineRepository;
        this.airplaneModelRepository = airplaneModelRepository;
        this.flightRepository = flightRepository;
    }

    // DELETE
    public void delete(Long id) {

        airplaneRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Máy bay không tồn tại"));

        if (!flightRepository.findByAirplaneId(id).isEmpty()) {
            throw new RuntimeException(
                    "Không thể xóa: máy bay đang được dùng trong chuyến bay.");
        }

        airplaneRepository.deleteById(id);
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
    @Transactional(readOnly = true)
    public List<AirplaneResponse> getAll() {

        return airplaneRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // GET BY ID
    @Transactional(readOnly = true)
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

        // gỡ Hibernate proxy để map/serialize an toàn khi OSIV tắt
        AirplaneModel model =
                (AirplaneModel) Hibernate.unproxy(airplane.getModel());
        response.setModel(model);

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