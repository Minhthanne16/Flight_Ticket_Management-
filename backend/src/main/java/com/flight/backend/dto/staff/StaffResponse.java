package com.flight.backend.dto.staff;

import com.flight.backend.entity.enums.StaffStatus;
import java.time.LocalDate;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StaffResponse {

    private Long id;

    private String fullName;

    private String email;

    private String phoneNumber;

    private Integer staffCode;

    private String department;

    private LocalDate hireDate;

    private StaffStatus status;
}