package com.flight.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "regulations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Regulation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regulation_id")
    private Long id;

    @Column(name = "regulation_name", length = 255)
    private String regulationName;

    @Column(name = "setting_key", length = 255)
    private String settingKey;

    @Column(name = "setting_value", precision = 10, scale = 2)
    private BigDecimal settingValue;

    @Column(name = "unit", length = 255)
    private String unit;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
