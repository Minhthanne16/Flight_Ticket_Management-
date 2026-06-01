package com.flight.backend.service;

import com.flight.backend.dto.regulation.RegulationRequest;
import com.flight.backend.dto.regulation.RegulationResponse;
import com.flight.backend.entity.Regulation;
import com.flight.backend.repository.RegulationRepository;
import java.time.LocalDateTime;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegulationService {

    private final RegulationRepository regulationRepository;

    public RegulationResponse create(RegulationRequest request) {

        Regulation regulation = new Regulation();

                if (regulationRepository.existsBySettingKey(
        request.getSettingKey())) {

    throw new RuntimeException(
            "Setting key already exists");
}

        regulation.setRegulationName(request.getRegulationName());
        regulation.setSettingKey(request.getSettingKey());
        regulation.setSettingValue(request.getSettingValue());
        regulation.setUnit(request.getUnit());
        regulation.setDescription(request.getDescription());
        regulation.setCreatedAt(LocalDateTime.now());
        regulation.setUpdatedAt(LocalDateTime.now());

        regulationRepository.save(regulation);

        return mapToResponse(regulation);
    }

    public List<RegulationResponse> getAll() {

        return regulationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public RegulationResponse getById(Long id) {

        Regulation regulation = regulationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy định"));

        return mapToResponse(regulation);
    }

    public RegulationResponse update(Long id, RegulationRequest request) {

        
        Regulation regulation = regulationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy định"));
                if (!regulation.getSettingKey().equals(
        request.getSettingKey())
        &&
        regulationRepository.existsBySettingKey(
                request.getSettingKey())) {

    throw new RuntimeException(
            "Setting key already exists");
}

        regulation.setRegulationName(request.getRegulationName());
        regulation.setSettingKey(request.getSettingKey());
        regulation.setSettingValue(request.getSettingValue());
        regulation.setUnit(request.getUnit());
        regulation.setDescription(request.getDescription());
        regulation.setUpdatedAt(LocalDateTime.now());

        regulationRepository.save(regulation);

        return mapToResponse(regulation);
    }

    public void delete(Long id) {

        Regulation regulation = regulationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy định"));

        regulationRepository.delete(regulation);
    }

    public RegulationResponse getByKey(String key) {

        Regulation regulation = regulationRepository.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quy định"));

        return mapToResponse(regulation);
    }

    private RegulationResponse mapToResponse(Regulation regulation) {

        return RegulationResponse.builder()
                .id(regulation.getId())
                .regulationName(regulation.getRegulationName())
                .settingKey(regulation.getSettingKey())
                .settingValue(regulation.getSettingValue())
                .unit(regulation.getUnit())
                .description(regulation.getDescription())
                .createdAt(regulation.getCreatedAt())
                .updatedAt(regulation.getUpdatedAt())
                .build();
    }
}