package com.flight.backend.dto.passenger;

import java.time.LocalDate;

import com.flight.backend.entity.enums.PassengerGender;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreatePassengerRequest {
    private String fullName;
    private String email;
    private PassengerGender gender;
    private String nationality;
    private String documentNumber;
    private LocalDate dateOfBirth;
}
