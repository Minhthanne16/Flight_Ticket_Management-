package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.passenger.CreatePassengerRequest;
import com.flight.backend.dto.passenger.PassengerResponse;
import com.flight.backend.entity.Passenger;
import com.flight.backend.mapper.PassengerMapper;
import com.flight.backend.repository.PassengerRepository;

@Service
public class PassengerService {
    private final PassengerRepository passengerRepository;
    private final PassengerMapper passengerMapper;

    public PassengerService(
            PassengerRepository passengerRepository,
            PassengerMapper passengerMapper) {
        this.passengerRepository = passengerRepository;
        this.passengerMapper = passengerMapper;
    }

    public PassengerResponse createPassenger(
            CreatePassengerRequest request) {
        Passenger passenger = createPassengerEntity(request);
        return passengerMapper.toResponse(passenger);
    }

    public Passenger createPassengerEntity(CreatePassengerRequest request) {
        Passenger passenger = Passenger.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .gender(request.getGender())
                .nationality(request.getNationality())
                .documentNumber(request.getDocumentNumber())
                .dateOfBirth(request.getDateOfBirth())
                .build();

        return passengerRepository.save(passenger);
    }

    public PassengerResponse getPassengerById(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        return this.passengerMapper.toResponse(passenger);
    }

    public List<PassengerResponse> getAllPassengers() {

        return passengerRepository.findAll()
                .stream()
                .map(passengerMapper::toResponse)
                .toList();
    }

    public void deletePassenger(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        passengerRepository.delete(passenger);
    }
}
