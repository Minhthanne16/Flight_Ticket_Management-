package com.flight.backend.dto.customer;

import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class CustomerResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private LocalDate birthday;

    private String avatarUrl;

    private String address;
}