package com.flight.backend.service;

import com.flight.backend.dto.voucher.ApplyVoucherRequest;
import com.flight.backend.dto.voucher.ApplyVoucherResponse;
import com.flight.backend.dto.voucher.CreateVoucherRequest;
import com.flight.backend.entity.Booking;
import com.flight.backend.entity.BookingVoucher;
import com.flight.backend.entity.Voucher;
import com.flight.backend.entity.enums.VoucherDiscountType;
import com.flight.backend.entity.enums.VoucherStatus;
import com.flight.backend.repository.BookingRepository;
import com.flight.backend.repository.BookingVoucherRepository;
import com.flight.backend.repository.VoucherRepository;

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
    public Voucher createVoucher(
            CreateVoucherRequest req) {

        String voucherCode =
                req.getVoucherCode()
                        .trim()
                        .toUpperCase();

        if (voucherRepository.existsByVoucherCode(
                voucherCode)) {

            throw new RuntimeException(
                    "Voucher code already exists");
        }

        if (req.getStartTime()
                .isAfter(req.getEndTime())) {

            throw new RuntimeException(
                    "Start time must be before end time");
        }

        if (req.getDiscountType()
                == VoucherDiscountType.PERCENTAGE
                &&
                (req.getDiscountValue() < 1
                        || req.getDiscountValue() > 100)) {

            throw new RuntimeException(
                    "Percentage discount must be between 1 and 100");
        }

        Voucher voucher = new Voucher();

        voucher.setVoucherCode(voucherCode);

        voucher.setName(req.getName());

        voucher.setDiscountType(req.getDiscountType());

        voucher.setDiscountValue(req.getDiscountValue());

        voucher.setMinBookingAmount(
                req.getMinBookingAmount());

        voucher.setMaxDiscountAmount(
                req.getMaxDiscountAmount());

        voucher.setStartTime(
                req.getStartTime());

        voucher.setEndTime(
                req.getEndTime());

        voucher.setUsageLimit(
                req.getUsageLimit());

        voucher.setUsedCount(0);

        voucher.setStatus(
                VoucherStatus.ACTIVE);

        voucher.setCreatedAt(
                LocalDateTime.now());

        voucher.setUpdatedAt(
                LocalDateTime.now());

        return voucherRepository.save(voucher);
    }

    // GET ALL
    public List<Voucher> getAllVouchers() {

        return voucherRepository.findAll();
    }

    // APPLY VOUCHER
    @Transactional
    public ApplyVoucherResponse applyVoucher(
            ApplyVoucherRequest req) {

        Booking booking = bookingRepository
                .findById(req.getBookingId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Booking not found"));

        Voucher voucher = voucherRepository
                .findByVoucherCode(
                        req.getVoucherCode()
                                .trim()
                                .toUpperCase())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Voucher not found"));

        LocalDateTime now =
                LocalDateTime.now();

        // status
        if (voucher.getStatus()
                != VoucherStatus.ACTIVE) {

            throw new RuntimeException(
                    "Voucher not active");
        }

        // time
        if (now.isBefore(
                voucher.getStartTime())
                ||
                now.isAfter(
                        voucher.getEndTime())) {

            throw new RuntimeException(
                    "Voucher expired");
        }

        // usage limit
        if (voucher.getUsedCount()
                >= voucher.getUsageLimit()) {

            throw new RuntimeException(
                    "Voucher used up");
        }

        // duplicate voucher
        if (bookingVoucherRepository
                .existsByBookingId(
                        booking.getId())) {

            throw new RuntimeException(
                    "Booking already has voucher");
        }

        BigDecimal total =
                booking.getTotalAmount();

        if (total.compareTo(
                BigDecimal.valueOf(
                        voucher.getMinBookingAmount()))
                < 0) {

            throw new RuntimeException(
                    "Booking does not meet minimum amount");
        }

        BigDecimal discount;

        if (voucher.getDiscountType()
                == VoucherDiscountType.PERCENTAGE) {

            discount = total
                    .multiply(
                            BigDecimal.valueOf(
                                    voucher.getDiscountValue()))
                    .divide(
                            BigDecimal.valueOf(100));

            if (voucher.getMaxDiscountAmount()
                    != null) {

                discount = discount.min(
                        BigDecimal.valueOf(
                                voucher.getMaxDiscountAmount()));
            }

        } else {

            discount = BigDecimal.valueOf(
                    voucher.getDiscountValue());
        }

        BigDecimal finalAmount =
                total.subtract(discount);

        if (finalAmount.compareTo(
                BigDecimal.ZERO) < 0) {

            finalAmount = BigDecimal.ZERO;
        }

        BookingVoucher bv =
                new BookingVoucher();

        bv.setBooking(booking);

        bv.setVoucher(voucher);

        bv.setDiscountAmount(
                discount.longValue());

        bv.setAppliedAt(now);

        bookingVoucherRepository.save(bv);

        // TĂNG USED COUNT
        voucher.setUsedCount(
                voucher.getUsedCount() + 1);

        voucher.setUpdatedAt(
                LocalDateTime.now());

        voucherRepository.save(voucher);

        // UPDATE BOOKING
        booking.setDiscountAmount(
                discount);

        booking.setFinalAmount(
                finalAmount);

        bookingRepository.save(booking);

        return new ApplyVoucherResponse(
                total,
                discount,
                finalAmount);
    }
}