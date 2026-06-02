package com.flight.backend.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;

import com.flight.backend.entity.Regulation;
import com.flight.backend.entity.User;
import com.flight.backend.entity.Staff;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.entity.enums.StaffStatus;
import com.flight.backend.repository.RegulationRepository;
import com.flight.backend.repository.UserRepository;
import com.flight.backend.repository.StaffRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StaffRepository staffRepository;
    private final RegulationRepository regulationRepository;
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
            admin.setPhoneNumber("0909090909");
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

        // 4. Initialize default Regulations (chỉ tạo khi chưa có, không ghi đè giá trị admin đã sửa)
        seedRegulation("min_flight_duration", "Thời gian bay tối thiểu", 30, "phút",
                "Thời gian bay ngắn nhất được phép lên lịch");
        seedRegulation("max_stops", "Số điểm dừng tối đa", 2, "điểm",
                "Số điểm dừng kỹ thuật tối đa cho một chuyến bay");
        seedRegulation("min_stop_duration", "Thời gian dừng tối thiểu", 20, "phút",
                "Thời gian dừng kỹ thuật tối thiểu tại mỗi điểm");
        seedRegulation("max_stop_duration", "Thời gian dừng tối đa", 90, "phút",
                "Thời gian dừng kỹ thuật tối đa tại mỗi điểm");
        seedRegulation("cancel_before_hours", "Hủy vé trước giờ bay", 24, "giờ",
                "Khách hàng phải hủy vé trước bao nhiêu giờ để được hoàn tiền");
        seedRegulation("max_tickets_per_booking", "Số vé tối đa mỗi đơn", 9, "vé",
                "Giới hạn vé trong một lần đặt");
        seedRegulation("payment_timeout_minutes", "Thời gian chờ thanh toán", 15, "phút",
                "Sau thời gian này, đơn đặt chỗ sẽ bị hủy tự động nếu chưa thanh toán");
        seedRegulation("refund_percent", "Tỷ lệ hoàn tiền", 80, "%",
                "Phần trăm hoàn tiền khi hủy vé hợp lệ");
    }

    private void seedRegulation(String key, String name, int value, String unit, String description) {
        if (regulationRepository.existsBySettingKey(key)) {
            return;
        }
        Regulation reg = new Regulation();
        reg.setSettingKey(key);
        reg.setRegulationName(name);
        reg.setSettingValue(BigDecimal.valueOf(value));
        reg.setUnit(unit);
        reg.setDescription(description);
        reg.setCreatedAt(LocalDateTime.now());
        reg.setUpdatedAt(LocalDateTime.now());
        regulationRepository.save(reg);
        System.out.println("Seeded regulation: " + key + " = " + value);
    }
}
