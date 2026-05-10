package com.flight.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.auth.LoginRequest;
import com.flight.backend.dto.auth.LoginResponse;
import com.flight.backend.dto.auth.RegisterUserRequest;
import com.flight.backend.dto.auth.UserResponse;
import com.flight.backend.service.UserService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
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
}
