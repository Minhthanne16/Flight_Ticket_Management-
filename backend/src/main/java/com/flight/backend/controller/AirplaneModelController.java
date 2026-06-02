package com.flight.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.airplane_model.AirplaneModelResponse;
import com.flight.backend.dto.airplane_model.CreateAirplaneModelRequest;
import com.flight.backend.service.AirplaneModelService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/admin/airplane-models")
public class AirplaneModelController {
    private final AirplaneModelService airplaneModelService;

    public AirplaneModelController(AirplaneModelService airplaneModelService) {
        this.airplaneModelService = airplaneModelService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AirplaneModelResponse>> createAirline(
            @Valid @RequestBody CreateAirplaneModelRequest req) {
        AirplaneModelResponse response = airplaneModelService.createAirplaneModel(req);
        return ApiResponse.success(response, "Tạo mới model thành công.");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AirplaneModelResponse>>> getAll() {
        List<AirplaneModelResponse> models = airplaneModelService.getAll();
        return ApiResponse.success(models, "Lấy danh sách model thành công.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(@PathVariable Long id) {
        airplaneModelService.delete(id);
        return ApiResponse.success("OK", "Xóa model thành công");
    }

}
