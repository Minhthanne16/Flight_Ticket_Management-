package com.flight.backend.dto.seat;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateSeatRequest {

    @NotNull(message = "Row number is required")
    @Min(value = 1, message = "Row number must be greater than 0")
    private Integer rowNumber;

    @NotBlank(message = "Column letter is required")
    @Size(max = 1, message = "Column letter must be 1 character")
    @Pattern(
            regexp = "^[A-Z]$",
            message = "Column letter must be from A-Z")
    private String columnLetter;

    @NotNull(message = "Ticket class is required")
    private Long ticketClassId;
}