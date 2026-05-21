package com.flight.backend.dto.customer;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CustomerRequest {

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;

    private LocalDate birthday;

    private String avatarUrl;

    private String address;
}