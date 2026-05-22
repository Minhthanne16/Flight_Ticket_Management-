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
    public SupportResponse createRequest(CreateSupportRequest req, Long currentUserId) {
        // 1. Kiểm tra xem vé có tồn tại trong hệ thống không
        Ticket ticket = ticketRepository.findById(req.getTicketId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin vé phù hợp!"));

        // 2. Kiểm tra xem User đang đăng nhập có tồn tại không
        User customer = userRepository.findById(currentUserId)
                .orElseThrow(() -> new RuntimeException("Tài khoản người dùng không tồn tại!"));

        // 3. Tạo mới thực thể Support từ dữ liệu DTO gửi lên
        Support support = Support.builder()
                .ticket(ticket)
                .supportType(req.getSupportType())
                .status(RequestStatus.PENDING)
                .reason(req.getReason())
                .createdBy(customer)
                .createdAt(LocalDateTime.now())
                .approvedBy(null) // Lúc mới tạo chưa có nhân viên xử lý
                .build();

        // 4. Lưu trực tiếp xuống Database thông qua Repository
        Support saved = supportRepository.save(support);
        return supportMapper.toResponse(saved);
    }

    public List<SupportResponse> getAllChangeTicketRequests() {
        List<Support> requests = supportRepository.findBySupportTypeOrderByCreatedAtDesc(SupportType.CHANGE);
        return requests.stream().map(supportMapper::toResponse).toList();
    }

    public List<SupportResponse> getAllRefundTicketRequests() {
        List<Support> requests = supportRepository.findBySupportTypeOrderByCreatedAtDesc(SupportType.REFUND);
        return requests.stream().map(supportMapper::toResponse).toList();
    }

    @Transactional
    public SupportResponse approveRequest(Long id, Long staffId) {
        Support support = supportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu"));

        User staff = userRepository.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));

        support.setStatus(RequestStatus.APPROVED);
        support.setApprovedBy(staff);
        support.setApprovedAt(LocalDateTime.now());

        // Tự động tính tiền hoàn bằng code nếu muốn, không cần FE truyền lên
        // support.setFeeAmount(support.getTicket().getPrice() * 0.9);

        return supportMapper.toResponse(supportRepository.save(support));
    }
}
