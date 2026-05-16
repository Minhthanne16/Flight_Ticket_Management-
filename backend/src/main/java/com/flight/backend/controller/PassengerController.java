package com.flight.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.flight.backend.dto.ApiResponse;
import com.flight.backend.dto.passenger.CreatePassengerRequest;
import com.flight.backend.dto.passenger.PassengerResponse;
import com.flight.backend.service.PassengerService;

@RestController
@RequestMapping("/passengers")
public class PassengerController {
    private final PassengerService passengerService;

    public PassengerController(PassengerService passengerService) {
        this.passengerService = passengerService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PassengerResponse>> createPassenger(@RequestBody CreatePassengerRequest request) {
        PassengerResponse resp = this.passengerService.createPassenger(request);
        return ApiResponse.success(resp, "Tạo thông tin hành khách thành công");
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PassengerResponse>> getPassengerById(
            @PathVariable Long id) {
        PassengerResponse resp = this.passengerService.getPassengerById(id);

        return ApiResponse.success(resp, "Lấy thông tin hành khách thành công");
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PassengerResponse>>> getAllPassengers() {
        List<PassengerResponse> resp = this.passengerService.getAllPassengers();
        return ApiResponse.success(resp, "Lấy danh sách hành khách thành công");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePassenger(
            @PathVariable Long id) {

        this.passengerService.deletePassenger(id);

        return ApiResponse.success(null, "Xóa hành khách thành công");
    }
}
