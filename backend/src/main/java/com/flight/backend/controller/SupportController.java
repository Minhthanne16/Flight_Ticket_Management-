package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.support.CreateSupportRequest;
import com.flight.backend.dto.support.SupportResponse;
import com.flight.backend.security.CustomUserDetails;
import com.flight.backend.service.SupportService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/supports")
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    @PostMapping
    public ResponseEntity<ApiResponse<SupportResponse>> createSupportRequest(
            @Valid @RequestBody CreateSupportRequest req) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        SupportResponse resp = supportService.createRequest(req, userDetails.getId());

        return ApiResponse.success(resp, "Gửi yêu cầu thành công");
    }

    @GetMapping("/change-requests")
    public ResponseEntity<ApiResponse<List<SupportResponse>>> getAllChangeTicketRequests() {
        List<SupportResponse> resp = supportService.getAllChangeTicketRequests();

        return ApiResponse.success(resp, "Gửi yêu cầu thành công");
    }

    @GetMapping("/refund-requests")
    public ResponseEntity<ApiResponse<List<SupportResponse>>> getAllRefundTicketRequests() {
        List<SupportResponse> resp = supportService.getAllRefundTicketRequests();

        return ApiResponse.success(resp, "Gửi yêu cầu thành công");
    }

    // API xác nhận duyệt yêu cầu
    @PatchMapping("/{id}/approve")
    public ResponseEntity<SupportResponse> approveSupportRequest(
            @PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        SupportResponse response = supportService.approveRequest(id, userDetails.getId());
        return ResponseEntity.ok(response);
    }
}
