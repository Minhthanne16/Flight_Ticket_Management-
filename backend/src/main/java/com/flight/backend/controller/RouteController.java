package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.route.CreateRouteRequest;
import com.flight.backend.dto.route.RouteResponse;
import com.flight.backend.service.RouteService;

@RestController
@RequestMapping("/routes")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    // ADMIN tạo route
    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> create(
            @RequestBody CreateRouteRequest request) {

        RouteResponse response = routeService.create(request);

        return ApiResponse.success(
                response,
                "Tạo mới tuyến bay thành công.");
    }

    // STAFF + ADMIN xem danh sách route
    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteResponse>>> getAll() {

        List<RouteResponse> responses = routeService.getAll();

        return ApiResponse.success(
                responses,
                "Lấy danh sách tuyến bay thành công.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<RouteResponse>> update(
            @PathVariable Long id,
            @RequestBody CreateRouteRequest request) {

        RouteResponse response =
                routeService.update(id, request);

        return ApiResponse.success(
                response,
                "Cập nhật tuyến bay thành công.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> delete(
            @PathVariable Long id) {

        routeService.delete(id);

        return ApiResponse.success(
                "Xóa tuyến bay thành công.");
    }
}