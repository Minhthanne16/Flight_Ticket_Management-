package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.report.OccupancyResponse;
import com.flight.backend.dto.report.RevenueResponse;
import com.flight.backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<RevenueResponse>> getRevenue(
            @RequestParam int month,
            @RequestParam int year
    ) {

        RevenueResponse response =
                reportService.getRevenue(
                        month,
                        year
                );

        return ApiResponse.success(
                response,
                "Lấy báo cáo doanh thu thành công"
        );
    }

    @GetMapping("/occupancy")
    public ResponseEntity<ApiResponse<OccupancyResponse>> getOccupancy(
            @RequestParam Long flightId
    ) {

        OccupancyResponse response =
                reportService.getOccupancy(
                        flightId
                );

        return ApiResponse.success(
                response,
                "Lấy tỷ lệ lấp đầy thành công"
        );
    }
}