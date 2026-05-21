package com.flight.backend.controller;

import com.flight.backend.dto.voucher.*;
import com.flight.backend.entity.Voucher;
import com.flight.backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping
    public Voucher create(@RequestBody CreateVoucherRequest req) {
        return voucherService.createVoucher(req);
    }

    @GetMapping
    public List<Voucher> getAll() {
        return voucherService.getAllVouchers();
    }

    @PostMapping("/apply")
    public ApplyVoucherResponse apply(@RequestBody ApplyVoucherRequest req) {
        return voucherService.applyVoucher(req);
    }
}