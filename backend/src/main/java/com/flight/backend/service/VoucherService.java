package com.flight.backend.service;

import com.flight.backend.dto.voucher.*;
import com.flight.backend.entity.*;
import com.flight.backend.entity.enums.VoucherStatus;
import com.flight.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherService {

    private final VoucherRepository voucherRepository;
    private final BookingRepository bookingRepository;
    private final BookingVoucherRepository bookingVoucherRepository;

    // CREATE VOUCHER
    public Voucher createVoucher(CreateVoucherRequest req) {

        Voucher voucher = new Voucher();
        voucher.setVoucherCode(req.getVoucherCode());
        voucher.setName(req.getName());

        voucher.setDiscountType(req.getDiscountType());
        voucher.setDiscountValue(req.getDiscountValue());

        voucher.setMinBookingAmount(req.getMinBookingAmount());
        voucher.setMaxDiscountAmount(req.getMaxDiscountAmount());

        voucher.setStartTime(req.getStartTime());
        voucher.setEndTime(req.getEndTime());

        voucher.setUsageLimit(req.getUsageLimit());
        voucher.setUsedCount(0);
        voucher.setStatus(VoucherStatus.ACTIVE);

        voucher.setCreatedAt(LocalDateTime.now());
        voucher.setUpdatedAt(LocalDateTime.now());

        return voucherRepository.save(voucher);
    }
    // GET ALL VOUCHERS

    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    // APPLY VOUCHER

    @Transactional
    public ApplyVoucherResponse applyVoucher(ApplyVoucherRequest req) {

        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        Voucher voucher = voucherRepository.findByVoucherCode(req.getVoucherCode())
                .orElseThrow(() -> new RuntimeException("Voucher not found"));

        LocalDateTime now = LocalDateTime.now();

        // 1. status
        if (voucher.getStatus() != VoucherStatus.ACTIVE)
            throw new RuntimeException("Voucher not active");

        // 2. time
        if (now.isBefore(voucher.getStartTime()) ||
            now.isAfter(voucher.getEndTime()))
            throw new RuntimeException("Voucher expired");

        // 3. usage limit
        if (voucher.getUsedCount() >= voucher.getUsageLimit())
            throw new RuntimeException("Voucher used up");

        // 4. duplicate check
        if (bookingVoucherRepository.existsByBookingId(booking.getId()))
            throw new RuntimeException("Booking already has voucher");

        BigDecimal total = booking.getTotalAmount();

        if (total.compareTo(BigDecimal.valueOf(voucher.getMinBookingAmount())) < 0)
            throw new RuntimeException("Not eligible");

        // 5. calculate discount
        BigDecimal discount;

        if (voucher.getDiscountType().name().equals("PERCENTAGE")) {

            discount = total
                    .multiply(BigDecimal.valueOf(voucher.getDiscountValue()))
                    .divide(BigDecimal.valueOf(100));

            if (voucher.getMaxDiscountAmount() != null) {
                discount = discount.min(BigDecimal.valueOf(voucher.getMaxDiscountAmount()));
            }

        } else {
            discount = BigDecimal.valueOf(voucher.getDiscountValue());
        }

        BigDecimal finalAmount = total.subtract(discount);

        // 6. save booking voucher
        BookingVoucher bv = new BookingVoucher();
        bv.setBooking(booking);
        bv.setVoucher(voucher);
        bv.setDiscountAmount(discount.longValue());
        bv.setAppliedAt(now);

        bookingVoucherRepository.save(bv);

        // 7. update booking
        booking.setDiscountAmount(discount);
        booking.setFinalAmount(finalAmount);

        bookingRepository.save(booking);

        return new ApplyVoucherResponse(total, discount, finalAmount);
    }
}