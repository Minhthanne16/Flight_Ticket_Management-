package com.flight.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.auth.ChangePasswordRequest;
import com.flight.backend.dto.auth.ForgotPasswordRequest;
import com.flight.backend.dto.auth.LoginRequest;
import com.flight.backend.dto.auth.LoginResponse;
import com.flight.backend.dto.auth.RegisterUserRequest;
import com.flight.backend.dto.auth.ResetPasswordRequest;
import com.flight.backend.dto.auth.UserResponse;
import com.flight.backend.security.CustomUserDetails;
import com.flight.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/auth")
public class AuthController {
    public final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterUserRequest req) {
        UserResponse response = this.userService.registerUser(req);
        return ApiResponse.success(response, "Đăng ký tài khoản thành công");
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest req) {
        LoginResponse response = this.userService.login(req);
        return ApiResponse.success(response, "Đăng nhập thành công");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        this.userService.forgotPassword(req);
        return ApiResponse.success(null, "Vui lòng nhập mã đã được gửi trong email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ResetPasswordRequest req) {
        this.userService.resetPassword(req);
        return ApiResponse.success(null, "Đổi mật khẩu thành công");
    }

    @PatchMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ChangePasswordRequest req,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            throw new RuntimeException("Bạn chưa đăng nhập");
        }

        Long currentUserId = ((CustomUserDetails) userDetails).getId();
        userService.changePassword(currentUserId, req);
        return ApiResponse.success(null, "Đổi mật khẩu thành công");
    }

}
