package com.flight.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.route.CreateRouteRequest;
import com.flight.backend.dto.route.RouteResponse;
import com.flight.backend.service.RouteService;

@RestController
@RequestMapping("/admin/routes")
public class RouteController {
    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RouteResponse>> create(
            @RequestBody CreateRouteRequest request) {
        RouteResponse response = routeService.create(request);
        return ApiResponse.success(response, "Tạo mới tuyến bay thành công.");
    }
}
