package com.flight.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.passenger.CreatePassengerRequest;
import com.flight.backend.dto.passenger.PassengerResponse;
import com.flight.backend.entity.Passenger;
import com.flight.backend.repository.PassengerRepository;

@Service
public class PassengerService {
    private final PassengerRepository passengerRepository;

    public PassengerService(PassengerRepository passengerRepository) {
        this.passengerRepository = passengerRepository;
    }

    public PassengerResponse createPassenger(CreatePassengerRequest request) {

        Passenger passenger = Passenger.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .gender(request.getGender())
                .nationality(request.getNationality())
                .documentNumber(request.getDocumentNumber())
                .dateOfBirth(request.getDateOfBirth())
                .build();

        Passenger savedPassenger = passengerRepository.save(passenger);

        return mapToResponse(savedPassenger);
    }

    public PassengerResponse getPassengerById(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        return mapToResponse(passenger);
    }

    public List<PassengerResponse> getAllPassengers() {

        List<Passenger> passengers = passengerRepository.findAll();

        return passengers.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deletePassenger(Long id) {

        Passenger passenger = passengerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Passenger not found"));

        passengerRepository.delete(passenger);
    }

    private PassengerResponse mapToResponse(Passenger passenger) {

        return PassengerResponse.builder()
                .id(passenger.getId())
                .fullName(passenger.getFullName())
                .email(passenger.getEmail())
                .gender(passenger.getGender())
                .nationality(passenger.getNationality())
                .documentNumber(passenger.getDocumentNumber())
                .dateOfBirth(passenger.getDateOfBirth())
                .build();
    }
}
