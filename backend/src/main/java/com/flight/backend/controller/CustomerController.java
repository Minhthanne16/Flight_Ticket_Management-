package com.flight.backend.controller;

import com.flight.backend.dto.customer.CustomerRequest;
import com.flight.backend.dto.customer.CustomerResponse;
import com.flight.backend.service.CustomerService;

import java.util.List;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping
    public ResponseEntity<CustomerResponse> create(
            @RequestBody CustomerRequest request
    ) {
        return ResponseEntity.ok(
                customerService.create(request));
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>>
    getAll() {

        return ResponseEntity.ok(
                customerService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getById(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(
                customerService.getById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<CustomerResponse>>
    search(
            @RequestParam String q
    ) {

        return ResponseEntity.ok(
                customerService.search(q));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> update(
            @PathVariable Long id,
            @RequestBody CustomerRequest request
    ) {

        return ResponseEntity.ok(
                customerService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ) {

        customerService.delete(id);

        return ResponseEntity.ok(
                "Xóa khách hàng thành công");
    }
}