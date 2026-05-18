package com.flight.backend.service;

import com.flight.backend.dto.staff.StaffRequest;
import com.flight.backend.dto.staff.StaffResponse;
import com.flight.backend.entity.Staff;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.StaffRepository;
import com.flight.backend.repository.UserRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public StaffResponse create(StaffRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }

        // ================= CREATE USER =================
        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(
                passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());

        user.setRole(UserRole.STAFF);

        user.setActive(true);

        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // ================= CREATE STAFF =================
        Staff staff = new Staff();

        staff.setUser(savedUser);

        staff.setStaffCode(request.getStaffCode());

        staff.setDepartment(request.getDepartment());

        staff.setHireDate(request.getHireDate());

        staff.setStatus(request.getStatus());

        staffRepository.save(staff);

        return mapToResponse(staff);
    }

    public List<StaffResponse> getAll() {

        return staffRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StaffResponse getById(Long id) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy nhân viên"));

        return mapToResponse(staff);
    }

    public List<StaffResponse> search(String keyword) {

        return staffRepository
                .findByUser_FullNameContainingIgnoreCase(keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public StaffResponse update(Long id, StaffRequest request) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy nhân viên"));

        User user = staff.getUser();

        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setUpdatedAt(LocalDateTime.now());

        userRepository.save(user);

        staff.setStaffCode(request.getStaffCode());
        staff.setDepartment(request.getDepartment());
        staff.setHireDate(request.getHireDate());
        staff.setStatus(request.getStatus());

        staffRepository.save(staff);

        return mapToResponse(staff);
    }

    public void delete(Long id) {

        Staff staff = staffRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy nhân viên"));

        User user = staff.getUser();

        staffRepository.delete(staff);

        userRepository.delete(user);
    }

    private StaffResponse mapToResponse(Staff staff) {

        return StaffResponse.builder()
                .id(staff.getId())
                .fullName(staff.getUser().getFullName())
                .email(staff.getUser().getEmail())
                .phoneNumber(staff.getUser().getPhoneNumber())
                .staffCode(staff.getStaffCode())
                .department(staff.getDepartment())
                .hireDate(staff.getHireDate())
                .status(staff.getStatus())
                .build();
    }
}