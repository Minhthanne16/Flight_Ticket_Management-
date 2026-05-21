package com.flight.backend.repository;

import com.flight.backend.entity.Customer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository
        extends JpaRepository<Customer, Long> {

    List<Customer>
    findByUser_FullNameContainingIgnoreCaseOrUser_EmailContainingIgnoreCaseOrUser_PhoneNumberContainingIgnoreCase(
            String fullName,
            String email,
            String phoneNumber
    );
}