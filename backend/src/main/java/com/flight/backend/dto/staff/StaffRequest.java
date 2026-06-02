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

    @NotBlank(message = "Vui lòng nhập họ tên")
    private String fullName;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Vui lòng nhập email")
    private String email;

    @NotBlank(message = "Vui lòng nhập mật khẩu")
    private String password;

    @Pattern(
            regexp = "^(0|\\+84)[0-9]{9,10}$",
            message = "Số điện thoại không hợp lệ")
    private String phoneNumber;

    @NotNull(message = "Vui lòng nhập mã nhân viên")
    @Positive(message = "Mã nhân viên phải là số dương")
    private Integer staffCode;

    @NotBlank(message = "Vui lòng nhập phòng ban")
    private String department;

    @NotNull(message = "Vui lòng nhập ngày vào làm")
    @PastOrPresent(message = "Ngày vào làm không được ở tương lai")
    private LocalDate hireDate;

    @NotNull(message = "Vui lòng chọn trạng thái")
    private StaffStatus status;
}
