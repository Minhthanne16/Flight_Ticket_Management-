package com.flight.backend.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flight.backend.dto.auth.LoginRequest;
import com.flight.backend.dto.auth.LoginResponse;
import com.flight.backend.dto.auth.RegisterUserRequest;
import com.flight.backend.dto.auth.UserResponse;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.UserRepository;
import com.flight.backend.security.jwt.JwtUtil;

@Service
public class UserService {
    public final UserRepository userRepository;
    public final PasswordEncoder passwordEncoder;
    public final JwtUtil jwtUtil;
    public final AuthenticationManager authenticationManager;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    public UserResponse registerUser(RegisterUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepository.existsByPhoneNumber(req.getPhoneNumber())) {
            throw new RuntimeException("Phone number already exists");
        }

        User newUser = new User();
        newUser.setFullName(req.getFullName());
        newUser.setEmail(req.getEmail());
        newUser.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        newUser.setPhoneNumber(req.getPhoneNumber());
        newUser.setCreatedAt(LocalDateTime.now());
        newUser.setUpdatedAt(LocalDateTime.now());
        newUser.setActive(true);
        newUser.setRole(UserRole.CUSTOMER);

        User savedUser = userRepository.save(newUser);

        UserResponse response = new UserResponse();
        response.setId(savedUser.getId());
        response.setFullName(savedUser.getFullName());
        response.setEmail(savedUser.getEmail());
        response.setPhoneNumber(savedUser.getPhoneNumber());
        response.setActive(savedUser.getActive());
        response.setRole(savedUser.getRole());

        return response;
    }

    public LoginResponse login(LoginRequest req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        req.getEmail(),
                        req.getPassword()));

        // 2. Lấy user
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 3. Lấy role
        String role = userDetails.getAuthorities()
                .stream()
                .findFirst()
                .get()
                .getAuthority();

        // 4. Generate JWT
        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        return new LoginResponse(userDetails.getUsername(), role, token);
    }
}
