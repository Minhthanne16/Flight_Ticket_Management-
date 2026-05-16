package com.flight.backend.config;

import java.time.LocalDateTime;
import java.time.LocalDate;

import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.flight.backend.entity.User;
import com.flight.backend.entity.Staff;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.entity.enums.StaffStatus;
import com.flight.backend.repository.UserRepository;
import com.flight.backend.repository.StaffRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, StaffRepository staffRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.staffRepository = staffRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Initialize Admin
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

        // Initialize Staff
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
