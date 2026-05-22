package com.flight.backend.service;

import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.flight.backend.dto.auth.ChangePasswordRequest;
import com.flight.backend.dto.auth.ForgotPasswordRequest;
import com.flight.backend.dto.auth.LoginRequest;
import com.flight.backend.dto.auth.LoginResponse;
import com.flight.backend.dto.auth.RegisterUserRequest;
import com.flight.backend.dto.auth.ResetPasswordRequest;
import com.flight.backend.dto.auth.UserResponse;
import com.flight.backend.entity.OtpCode;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.OtpType;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.OtpCodeRepository;
import com.flight.backend.repository.UserRepository;
import com.flight.backend.security.jwt.JwtUtil;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final OtpCodeService otpCodeService;
    private final OtpCodeRepository otpCodeRepository;

    public UserService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthenticationManager authenticationManager,
            EmailService emailService,
            OtpCodeService otpCodeService,
            OtpCodeRepository otpCodeRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.emailService = emailService;
        this.otpCodeService = otpCodeService;
        this.otpCodeRepository = otpCodeRepository;
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
                .getAuthority()
                .replace("ROLE_", "");

        // 4. Generate JWT
        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        // 5. Fetch user details to get fullName
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new LoginResponse(userDetails.getUsername(), role, token, user.getFullName());
    }

    public User getUserById(Long id) {
        return this.userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void forgotPassword(ForgotPasswordRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại!"));

        String otp = this.otpCodeService.createOtp(user.getEmail(), OtpType.RESET_PASSWORD);

        emailService.sendOtpEmail(user.getEmail(), otp);
    }

    public void resetPassword(ResetPasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        OtpCode otpCode = otpCodeRepository
                .findByEmailAndOtpAndType(request.getEmail(), request.getOtpCode(), OtpType.RESET_PASSWORD)
                .orElseThrow(() -> new RuntimeException("OTP không đúng hoặc không tồn tại"));

        if (otpCode.isUsed()) {
            throw new RuntimeException("OTP đã được sử dụng");
        }

        if (otpCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP đã hết hạn");
        }

        User user = userRepository.findByEmail(otpCode.getEmail())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        otpCode.setUsed(true);
        otpCodeRepository.save(otpCode);
    }

    public void changePassword(Long currentUserId, ChangePasswordRequest req) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy user"));

        if (!req.getNewPassword().equals(req.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        if (!passwordEncoder.matches(req.getOldPassword(), currentUser.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }

        if (passwordEncoder.matches(req.getNewPassword(), currentUser.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu mới không được trùng mật khẩu cũ");
        }

        currentUser.setPasswordHash(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(currentUser);
    }
}
