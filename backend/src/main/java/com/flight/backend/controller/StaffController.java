package com.flight.backend.controller;

import com.flight.backend.dto.staff.StaffRequest;
import com.flight.backend.dto.staff.StaffResponse;
import com.flight.backend.service.StaffService;

import jakarta.validation.Valid;

import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @PostMapping
    public ResponseEntity<StaffResponse> create(
          @Valid  @RequestBody StaffRequest request
    ) {
        return ResponseEntity.ok(staffService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<StaffResponse>> getAll() {
        return ResponseEntity.ok(staffService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(staffService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StaffResponse>> search(
            @RequestParam String q
    ) {
        return ResponseEntity.ok(staffService.search(q));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffResponse> update(
            @PathVariable Long id,
           @Valid @RequestBody StaffRequest request
    ) {
        return ResponseEntity.ok(staffService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ) {

        staffService.delete(id);

        return ResponseEntity.ok("Xóa nhân viên thành công");
    }
}