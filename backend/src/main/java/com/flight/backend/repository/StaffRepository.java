package com.flight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.flight.backend.entity.Staff;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
}
