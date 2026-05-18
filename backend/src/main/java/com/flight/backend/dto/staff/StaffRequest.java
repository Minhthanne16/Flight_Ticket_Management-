package com.flight.backend.dto.staff;

import com.flight.backend.entity.enums.StaffStatus;
import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StaffRequest {

    private String fullName;

    private String email;

    private String password;

    private String phoneNumber;

    private Integer staffCode;

    private String department;

    private LocalDate hireDate;

    private StaffStatus status;
}