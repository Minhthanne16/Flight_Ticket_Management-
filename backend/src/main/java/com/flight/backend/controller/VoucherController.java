package com.flight.backend.controller;

import com.flight.backend.dto.voucher.*;
import com.flight.backend.entity.Voucher;
import com.flight.backend.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping
    public Voucher create(@Valid @RequestBody CreateVoucherRequest req) {
        return voucherService.createVoucher(req);
    }

    @GetMapping
    public List<Voucher> getAll() {
        return voucherService.getAllVouchers();
    }

    @PutMapping("/{id}")
    public Voucher update(@PathVariable Long id, @Valid @RequestBody CreateVoucherRequest req) {
        return voucherService.updateVoucher(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        voucherService.deleteVoucher(id);
    }

    @PostMapping("/apply")
    public ApplyVoucherResponse apply(@RequestBody ApplyVoucherRequest req) {
        return voucherService.applyVoucher(req);
    }

    // Xem trước mức giảm (chưa tạo booking) — dùng ở trang nhập thông tin hành khách
    @PostMapping("/preview")
    public ApplyVoucherResponse preview(@RequestBody PreviewVoucherRequest req) {
        return voucherService.previewVoucher(req.getVoucherCode(), req.getAmount());
    }
}