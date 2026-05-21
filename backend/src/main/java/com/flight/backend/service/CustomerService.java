package com.flight.backend.service;

import com.flight.backend.dto.customer.CustomerRequest;
import com.flight.backend.dto.customer.CustomerResponse;
import com.flight.backend.entity.Customer;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.UserRole;
import com.flight.backend.repository.CustomerRepository;
import com.flight.backend.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    // ================= CREATE =================
    public CustomerResponse create(CustomerRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email đã tồn tại");
        }

        if (userRepository.existsByPhoneNumber(
                request.getPhoneNumber())) {

            throw new RuntimeException(
                    "Số điện thoại đã tồn tại");
        }

        // ================= CREATE USER =================
        User user = new User();

        user.setFullName(request.getFullName());

        user.setEmail(request.getEmail());

        user.setPasswordHash(
                passwordEncoder.encode(
                        request.getPassword()));

        user.setPhoneNumber(
                request.getPhoneNumber());

        user.setRole(UserRole.CUSTOMER);

        user.setActive(true);

        user.setCreatedAt(LocalDateTime.now());

        user.setUpdatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // ================= CREATE CUSTOMER =================
        Customer customer = new Customer();

        customer.setId(savedUser.getId());

        customer.setUser(savedUser);

        customer.setBirthday(
                request.getBirthday());

        customer.setAvatarUrl(
                request.getAvatarUrl());

        customer.setAddress(
                request.getAddress());

        customerRepository.save(customer);

        return mapToResponse(customer);
    }

    // ================= GET ALL =================
    public List<CustomerResponse> getAll() {

        return customerRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= GET BY ID =================
    public CustomerResponse getById(Long id) {

        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy khách hàng"));

        return mapToResponse(customer);
    }

    // ================= SEARCH =================
    public List<CustomerResponse> search(
            String keyword) {

        return customerRepository
                .findByUser_FullNameContainingIgnoreCaseOrUser_EmailContainingIgnoreCaseOrUser_PhoneNumberContainingIgnoreCase(
                        keyword,
                        keyword,
                        keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // ================= UPDATE =================
    public CustomerResponse update(
            Long id,
            CustomerRequest request) {

        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy khách hàng"));

        User user = customer.getUser();

        user.setFullName(
                request.getFullName());

        user.setPhoneNumber(
                request.getPhoneNumber());

        user.setUpdatedAt(
                LocalDateTime.now());

        userRepository.save(user);

        customer.setBirthday(
                request.getBirthday());

        customer.setAvatarUrl(
                request.getAvatarUrl());

        customer.setAddress(
                request.getAddress());

        customerRepository.save(customer);

        return mapToResponse(customer);
    }

    // ================= DELETE =================
    public void delete(Long id) {

        Customer customer =
                customerRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Không tìm thấy khách hàng"));

        User user = customer.getUser();

        customerRepository.delete(customer);

        userRepository.delete(user);
    }

    // ================= MAP RESPONSE =================
    private CustomerResponse mapToResponse(
            Customer customer) {

        return CustomerResponse.builder()
                .id(customer.getId())

                .fullName(
                        customer.getUser().getFullName())

                .email(
                        customer.getUser().getEmail())

                .phoneNumber(
                        customer.getUser().getPhoneNumber())

                .birthday(
                        customer.getBirthday())

                .avatarUrl(
                        customer.getAvatarUrl())

                .address(
                        customer.getAddress())

                .build();
    }
}