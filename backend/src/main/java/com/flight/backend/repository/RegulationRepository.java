package com.flight.backend.repository;


import com.flight.backend.entity.Regulation;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegulationRepository extends JpaRepository<Regulation, Long> {

    Optional<Regulation> findBySettingKey(String settingKey);
}