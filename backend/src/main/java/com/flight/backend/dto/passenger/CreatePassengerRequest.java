package com.flight.backend.dto.passenger;

import java.time.LocalDate;

import com.flight.backend.entity.enums.PassengerGender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CreatePassengerRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Gender is required")
    private PassengerGender gender;

    @NotBlank(message = "Nationality is required")
    private String nationality;

    @NotBlank(message = "Document number is required")
    private String documentNumber;

    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
}