package com.flight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.flight.backend.entity.Staff;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    List<Staff> findByUser_FullNameContainingIgnoreCase(String keyword);
    boolean existsByStaffCode(Integer staffCode);
}