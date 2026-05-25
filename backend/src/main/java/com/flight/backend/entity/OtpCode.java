package com.flight.backend.entity;

import java.time.LocalDateTime;

import com.flight.backend.entity.enums.OtpType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "otp_codes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "otp_code_id")
    private Long id;

    @Column(name = "email")
    private String email;

    @Column(name = "otp")
    private String otp;

    @Column(name = "expired_at")
    private LocalDateTime expiredAt;

    @Column(name = "used")
    private boolean used;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private OtpType type;
}
