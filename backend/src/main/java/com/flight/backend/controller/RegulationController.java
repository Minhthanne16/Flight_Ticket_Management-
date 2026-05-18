package com.flight.backend.controller;

import com.flight.backend.dto.regulation.RegulationRequest;
import com.flight.backend.dto.regulation.RegulationResponse;
import com.flight.backend.service.RegulationService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/configs")
@RequiredArgsConstructor
public class RegulationController {

    private final RegulationService regulationService;

    @PostMapping
    public ResponseEntity<RegulationResponse> create(
            @RequestBody RegulationRequest request
    ) {
        return ResponseEntity.ok(regulationService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<RegulationResponse>> getAll() {
        return ResponseEntity.ok(regulationService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RegulationResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(regulationService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RegulationResponse> update(
            @PathVariable Long id,
            @RequestBody RegulationRequest request
    ) {
        return ResponseEntity.ok(regulationService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ) {

        regulationService.delete(id);

        return ResponseEntity.ok("Delete successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<RegulationResponse> getByKey(
            @RequestParam String key
    ) {
        return ResponseEntity.ok(regulationService.getByKey(key));
    }
}