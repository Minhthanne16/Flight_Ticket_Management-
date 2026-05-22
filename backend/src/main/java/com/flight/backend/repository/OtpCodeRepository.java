package com.flight.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.flight.backend.entity.OtpCode;
import com.flight.backend.entity.enums.OtpType;

@Repository
public interface OtpCodeRepository extends JpaRepository<OtpCode, Long> {
    // Tìm mã OTP mới nhất được cấp cho Email này
    Optional<OtpCode> findTopByEmailOrderByExpiredAtDesc(String email);

    // Xóa tất cả OTP cũ của Email này sau khi đã xác thực thành công
    void deleteByEmail(String email);

    Optional<OtpCode> findByEmailAndType(String email, OtpType type);

    Optional<OtpCode> findByEmailAndOtpAndTypeAndUsedFalse(String email, String otp, OtpType type);

    Optional<OtpCode> findByEmailAndOtpAndType(String email, String otp, OtpType type);
}
