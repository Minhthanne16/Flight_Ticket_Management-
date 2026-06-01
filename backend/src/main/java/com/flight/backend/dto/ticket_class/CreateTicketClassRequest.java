package com.flight.backend.dto.ticket_class;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateTicketClassRequest {

    @NotBlank(message = "Class code is required")
    @Size(max = 10, message = "Class code must not exceed 10 characters")
    private String classCode;

    @NotBlank(message = "Class name is required")
    @Size(max = 255, message = "Class name must not exceed 255 characters")
    private String className;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotNull(message = "Price multiplier is required")
    @DecimalMin(
            value = "0.01",
            inclusive = true,
            message = "Price multiplier must be greater than 0")
    @Digits(
            integer = 8,
            fraction = 2,
            message = "Price multiplier format is invalid")
    private BigDecimal priceMultiplier;
}