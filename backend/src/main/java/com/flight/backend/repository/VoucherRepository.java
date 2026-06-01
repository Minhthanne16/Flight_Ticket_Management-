package com.flight.backend.repository;

import com.flight.backend.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    Optional<Voucher> findByVoucherCode(String voucherCode);
    boolean existsByVoucherCode(String voucherCode);
}