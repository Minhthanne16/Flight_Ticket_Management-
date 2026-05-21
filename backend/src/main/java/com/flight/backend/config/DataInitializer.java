package com.flight.backend.config;

import java.time.LocalDateTime;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.flight.backend.entity.User;
import com.flight.backend.entity.Staff;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.entity.enums.StaffStatus;
import com.flight.backend.repository.UserRepository;
import com.flight.backend.repository.StaffRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Admin (EasyFlight)
        if (!userRepository.existsByEmail("admin@easyflight.vn")) {
            User admin = new User();
            admin.setFullName("EasyFlight Admin");
            admin.setEmail("admin@easyflight.vn");
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setPhoneNumber("0123456789");
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Admin account created: admin@easyflight.vn / admin123");
        }

        // 2. Initialize Custom Admin (User's account)
        String customAdminEmail = "caophuc1612@gmail.com";
        if (userRepository.findByEmail(customAdminEmail).isEmpty()) {
            User admin = new User();
            admin.setFullName("Cao Hoàng Phúc");
            admin.setEmail(customAdminEmail);
            admin.setPasswordHash(passwordEncoder.encode("admin123"));
            admin.setRole(UserRole.ADMIN);
            admin.setActive(true);
            admin.setCreatedAt(LocalDateTime.now());
            admin.setUpdatedAt(LocalDateTime.now());
            userRepository.save(admin);
            System.out.println("Custom Admin account created: " + customAdminEmail + " / admin123");
        }

        // 3. Initialize Staff
        if (!userRepository.existsByEmail("staff@easyflight.vn")) {
            User staffUser = new User();
            staffUser.setFullName("EasyFlight Staff");
            staffUser.setEmail("staff@easyflight.vn");
            staffUser.setPasswordHash(passwordEncoder.encode("staff123"));
            staffUser.setPhoneNumber("0987654321");
            staffUser.setRole(UserRole.STAFF);
            staffUser.setActive(true);
            staffUser.setCreatedAt(LocalDateTime.now());
            staffUser.setUpdatedAt(LocalDateTime.now());
            User savedStaffUser = userRepository.save(staffUser);

            Staff staff = new Staff();
            staff.setUser(savedStaffUser);
            staff.setStaffCode(1001);
            staff.setDepartment("Ground Operations");
            staff.setHireDate(LocalDate.now());
            staff.setStatus(StaffStatus.ACTIVE);
            staffRepository.save(staff);
            System.out.println("Staff account created: staff@easyflight.vn / staff123");
        }
    }
}
