package com.flight.backend.dto.staff;

import com.flight.backend.entity.enums.StaffStatus;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StaffRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9,10}$",
            message = "Invalid phone number")
    private String phoneNumber;

    @NotNull(message = "Staff code is required")
    @Positive(message = "Staff code must be positive")
    private Integer staffCode;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Hire date is required")
    @PastOrPresent(message = "Hire date cannot be in the future")
    private LocalDate hireDate;

    @NotNull(message = "Status is required")
    private StaffStatus status;
}