package com.flight.backend.mapper;

import org.springframework.stereotype.Component;

import com.flight.backend.dto.passenger.PassengerResponse;
import com.flight.backend.entity.Passenger;

@Component
public class PassengerMapper {

    public PassengerResponse toResponse(
            Passenger passenger) {

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
