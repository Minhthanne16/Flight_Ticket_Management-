package com.flight.backend.config;

import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "caophuc1612@gmail.com";

        // Kiểm tra xem email này đã tồn tại chưa để tránh tạo trùng
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setFullName("Cao Hoàng Phúc");
            admin.setEmail(adminEmail);

            // Dùng passwordEncoder để khớp với trường password_hash trong DB
            admin.setPasswordHash(passwordEncoder.encode("admin123"));

            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());

            userRepository.save(admin);
        }
    }
}
