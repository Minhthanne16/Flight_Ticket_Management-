package com.flight.backend.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.flight.backend.entity.OtpCode;
import com.flight.backend.entity.enums.OtpType;
import com.flight.backend.repository.OtpCodeRepository;

@Service
public class OtpCodeService {
    private final OtpCodeRepository otpCodeRepository;

    public OtpCodeService(OtpCodeRepository otpCodeRepository) {
        this.otpCodeRepository = otpCodeRepository;
    }

    public String generateOtp() {
        return String.valueOf((int) ((Math.random() * 900000) + 100000));
    }

    public String createOtp(String email, OtpType type) {
        String otp = generateOtp();

        OtpCode otpCode = otpCodeRepository.findByEmailAndType(email, OtpType.RESET_PASSWORD)
                .orElse(new OtpCode());

        otpCode.setEmail(email);
        otpCode.setOtp(otp);
        otpCode.setType(OtpType.RESET_PASSWORD);
        otpCode.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        otpCode.setUsed(false);

        otpCodeRepository.save(otpCode);
        return otp;
    }

    public boolean validateOtp(String email, String inputOtp) {
        OtpCode otpCode = otpCodeRepository.findTopByEmailOrderByExpiredAtDesc(email)
                .orElse(null);

        if (otpCode == null) {
            return false;
        }

        if (!otpCode.getOtp().equals(inputOtp) || otpCode.getExpiryTime().isBefore(LocalDateTime.now())) {
            return false;
        }

        otpCodeRepository.deleteByEmail(email);
        return true;
    }
}
