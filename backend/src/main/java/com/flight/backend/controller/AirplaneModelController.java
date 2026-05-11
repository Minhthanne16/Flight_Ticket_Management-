package com.flight.backend.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.airplane_model.AirplaneModelResponse;
import com.flight.backend.dto.airplane_model.CreateAirplaneModelRequest;
import com.flight.backend.service.AirplaneModelService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/airplane-models")
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

}
