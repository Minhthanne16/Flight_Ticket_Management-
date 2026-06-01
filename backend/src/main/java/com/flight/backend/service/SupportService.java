package com.flight.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.flight.backend.dto.support.CreateSupportRequest;
import com.flight.backend.dto.support.SupportResponse;
import com.flight.backend.entity.Support;
import com.flight.backend.entity.Ticket;
import com.flight.backend.entity.User;
import com.flight.backend.entity.enums.RequestStatus;
import com.flight.backend.entity.enums.SupportType;
import com.flight.backend.mapper.SupportMapper;
import com.flight.backend.repository.SupportRepository;
import com.flight.backend.repository.TicketRepository;
import com.flight.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SupportService {

    private final SupportRepository supportRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final SupportMapper supportMapper;

    @Transactional
    public SupportResponse createRequest(
            CreateSupportRequest req,
            Long currentUserId) {

        Ticket ticket = ticketRepository.findById(
                req.getTicketId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy thông tin vé phù hợp"));

        User customer = userRepository.findById(
                currentUserId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Tài khoản người dùng không tồn tại"));

        if (supportRepository
                .existsByTicket_IdAndSupportTypeAndStatus(
                        ticket.getId(),
                        req.getSupportType(),
                        RequestStatus.PENDING)) {

            throw new RuntimeException(
                    "Yêu cầu đang được xử lý");
        }

        Support support = Support.builder()
                .ticket(ticket)
                .supportType(req.getSupportType())
                .status(RequestStatus.PENDING)
                .reason(req.getReason())
                .createdBy(customer)
                .createdAt(LocalDateTime.now())
                .approvedBy(null)
                .approvedAt(null)
                .feeAmount(null)
                .build();

        Support saved =
                supportRepository.save(support);

        return supportMapper.toResponse(saved);
    }

    public List<SupportResponse>
    getAllChangeTicketRequests() {

        return supportRepository
                .findBySupportTypeOrderByCreatedAtDesc(
                        SupportType.CHANGE)
                .stream()
                .map(supportMapper::toResponse)
                .toList();
    }

    public List<SupportResponse>
    getAllRefundTicketRequests() {

        return supportRepository
                .findBySupportTypeOrderByCreatedAtDesc(
                        SupportType.REFUND)
                .stream()
                .map(supportMapper::toResponse)
                .toList();
    }

    @Transactional
    public SupportResponse approveRequest(
            Long id,
            Long staffId) {

        Support support = supportRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy yêu cầu"));

        if (support.getStatus()
                != RequestStatus.PENDING) {

            throw new RuntimeException(
                    "Yêu cầu đã được xử lý");
        }

        User staff = userRepository.findById(staffId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Nhân viên không tồn tại"));

        support.setStatus(RequestStatus.APPROVED);
        support.setApprovedBy(staff);
        support.setApprovedAt(LocalDateTime.now());

        Support updated =
                supportRepository.save(support);

        return supportMapper.toResponse(updated);
    }
}