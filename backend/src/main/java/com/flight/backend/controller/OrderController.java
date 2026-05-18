package com.flight.backend.controller;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.order.OrderDetailResponse;
import com.flight.backend.dto.order.OrderHistoryResponse;
import com.flight.backend.service.OrderService;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderHistoryResponse>>> getOrders() {

        Long customerId = 1L;

        return ApiResponse.success(
                orderService.getOrders(customerId),
                "Lấy lịch sử đặt vé thành công"
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderDetailResponse>> getOrderDetail(
            @PathVariable Long id
    ) {

        return ApiResponse.success(
                orderService.getOrderDetail(id),
                "Lấy chi tiết đơn hàng thành công"
        );
    }
}