package com.flight.backend.service;

import com.flight.backend.dto.flight.CreateFlightRequest;
import com.flight.backend.dto.flight.FlightResponse;
import com.flight.backend.dto.flight.FlightSearchResponse;
import com.flight.backend.dto.flight.FlightStopResponse;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Route;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.dto.flight.UpdateFlightRequest;
import com.flight.backend.repository.AirplaneRepository;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.FlightSeatRepository;
import com.flight.backend.repository.FlightStopRepository;
import com.flight.backend.repository.RegulationRepository;
import com.flight.backend.repository.RouteRepository;
import com.flight.backend.repository.SeatRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightService {

    private final FlightRepository flightRepo;
    private final AirplaneRepository airplaneRepo;
    private final RouteRepository routeRepo;
    private final SeatRepository seatRepo;
    private final FlightSeatRepository flightSeatRepo;
    private final FlightStopService flightStopService;
    private final FlightStopRepository flightStopRepo;
    private final RegulationRepository regulationRepo;

    public FlightService(
            FlightRepository flightRepo,
            AirplaneRepository airplaneRepo,
            RouteRepository routeRepo,
            SeatRepository seatRepo,
            FlightSeatRepository flightSeatRepo,
            FlightStopService flightStopService,
            FlightStopRepository flightStopRepo,
            RegulationRepository regulationRepo) {
        this.flightRepo = flightRepo;
        this.airplaneRepo = airplaneRepo;
        this.routeRepo = routeRepo;
        this.seatRepo = seatRepo;
        this.flightSeatRepo = flightSeatRepo;
        this.flightStopService = flightStopService;
        this.flightStopRepo = flightStopRepo;
        this.regulationRepo = regulationRepo;
    }

    // Đọc giá trị quy định kiểu số nguyên theo settingKey (null nếu chưa cấu hình)
    private Integer regInt(String key) {
        return regulationRepo.findBySettingKey(key)
                .map(r -> r.getSettingValue() != null ? r.getSettingValue().intValue() : null)
                .orElse(null);
    }

    // Áp dụng quy định thời gian bay tối thiểu
    private void validateFlightDuration(int estimateDuration) {
        Integer minFlightDuration = regInt("min_flight_duration");
        if (minFlightDuration != null && estimateDuration < minFlightDuration) {
            throw new RuntimeException(
                    "Thời gian bay phải tối thiểu " + minFlightDuration + " phút (theo quy định).");
        }
    }

    // Tự động áp dụng quy định + validate danh sách điểm dừng khi tạo chuyến bay
    private void validateFlightStops(
            List<com.flight.backend.dto.flight.CreateFlightStopRequest> stops,
            LocalDateTime flightDeparture,
            LocalDateTime flightArrival,
            Route route) {
        int count = stops == null ? 0 : stops.size();

        Integer maxStops = regInt("max_stops");
        if (maxStops != null && count > maxStops) {
            throw new RuntimeException(
                    "Số điểm dừng vượt quá quy định (tối đa " + maxStops + ").");
        }

        if (stops == null) return;

        Long originId = route.getDepartureAirport() != null ? route.getDepartureAirport().getId() : null;
        Long destId = route.getArrivalAirport() != null ? route.getArrivalAirport().getId() : null;

        Integer minStopDuration = regInt("min_stop_duration");
        Integer maxStopDuration = regInt("max_stop_duration");
        java.util.Set<Long> seenAirports = new java.util.HashSet<>();
        for (com.flight.backend.dto.flight.CreateFlightStopRequest s : stops) {
            if (s.getArrivalTime() == null || s.getDepartureTime() == null) {
                throw new RuntimeException("Điểm dừng phải có giờ đến và giờ đi.");
            }
            // Sân bay dừng không được trùng điểm đầu hoặc điểm cuối của tuyến bay
            if (s.getAirportStopId() != null
                    && (s.getAirportStopId().equals(originId) || s.getAirportStopId().equals(destId))) {
                throw new RuntimeException(
                        "Sân bay dừng không được trùng điểm đầu hoặc điểm cuối của tuyến bay.");
            }
            // Sân bay dừng không được trùng với các điểm dừng khác
            if (s.getAirportStopId() != null && !seenAirports.add(s.getAirportStopId())) {
                throw new RuntimeException(
                        "Sân bay dừng không được trùng với các điểm dừng khác.");
            }
            // Trong điểm dừng: giờ đến < giờ đi
            if (!s.getDepartureTime().isAfter(s.getArrivalTime())) {
                throw new RuntimeException("Giờ đi tại điểm dừng phải sau giờ đến.");
            }
            // Giờ đến và giờ đi của điểm dừng phải nằm giữa giờ khởi hành và giờ đến của chuyến bay
            if (flightDeparture != null && flightArrival != null
                    && (!s.getArrivalTime().isAfter(flightDeparture)
                            || !s.getDepartureTime().isBefore(flightArrival))) {
                throw new RuntimeException(
                        "Giờ đến và giờ đi của điểm dừng phải nằm giữa giờ khởi hành và giờ đến của chuyến bay.");
            }
            long dur = Duration.between(s.getArrivalTime(), s.getDepartureTime()).toMinutes();
            if (minStopDuration != null && dur < minStopDuration) {
                throw new RuntimeException(
                        "Thời gian dừng phải tối thiểu " + minStopDuration + " phút (theo quy định).");
            }
            if (maxStopDuration != null && dur > maxStopDuration) {
                throw new RuntimeException(
                        "Thời gian dừng vượt quá quy định (tối đa " + maxStopDuration + " phút).");
            }
        }
    }

    // UPDATE FLIGHT (không đổi máy bay để giữ nguyên sơ đồ ghế đã tạo)
    @Transactional
    public FlightResponse updateFlight(Long id, UpdateFlightRequest req) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));

        if (!flight.getFlightCode().equals(req.getFlightCode())
                && flightRepo.existsByFlightCode(req.getFlightCode())) {
            throw new RuntimeException("Mã chuyến bay đã tồn tại");
        }

        Route route = routeRepo.findById(req.getRouteId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến bay"));

        // Giờ đến của chuyến bay = giờ khởi hành + thời lượng bay
        LocalDateTime arrivalTime = req.getDepartureTime().plusMinutes(req.getEstimateDuration());

        // Áp dụng quy định thời gian bay tối thiểu + validate điểm dừng (cho phép sửa điểm dừng)
        validateFlightDuration(req.getEstimateDuration());
        validateFlightStops(req.getFlightStops(), req.getDepartureTime(), arrivalTime, route);

        flight.setFlightCode(req.getFlightCode());
        flight.setRoute(route);
        flight.setDepartureTime(req.getDepartureTime());
        flight.setEstimateDuration(req.getEstimateDuration());
        flight.setArrivalTime(arrivalTime);
        flight.setBasePrice(req.getBasePrice());
        flight.setStatus(req.getStatus());

        Flight saved = flightRepo.save(flight);

        // Thay toàn bộ điểm dừng: xóa cũ, tạo mới
        flightStopRepo.deleteAll(flightStopRepo.findByFlightId(id));
        flightStopService.createFlightStop(saved, req.getFlightStops());

        FlightResponse resp = new FlightResponse();
        resp.setId(saved.getId());
        resp.setFlightCode(saved.getFlightCode());
        resp.setDepartureTime(saved.getDepartureTime());
        resp.setEstimateDuration(saved.getEstimateDuration());
        resp.setBasePrice(saved.getBasePrice());
        resp.setStatus(saved.getStatus());
        resp.setAirplaneId(saved.getAirplane() != null ? saved.getAirplane().getId() : null);
        resp.setRouteId(route.getId());
        return resp;
    }

    // DELETE FLIGHT
    @Transactional
    public void deleteFlight(Long id) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));

        if (flight.getBookings() != null && !flight.getBookings().isEmpty()) {
            throw new RuntimeException("Không thể xóa: chuyến bay đã có đơn đặt chỗ.");
        }

        // Xóa ghế và điểm dừng của chuyến trước khi xóa chuyến
        flightSeatRepo.deleteAll(flightSeatRepo.findByFlightId(id));
        flightStopRepo.deleteAll(flightStopRepo.findByFlightId(id));
        flightRepo.delete(flight);
    }

    // CREATE FLIGHT
    @Transactional
    public FlightResponse createFlight(CreateFlightRequest req) {
        if (flightRepo.existsByFlightCode(req.getFlightCode())) {
    throw new RuntimeException("Mã chuyến bay đã tồn tại");
}

        // 1. Lấy Airplane
        Airplane airplane = airplaneRepo.findById(req.getAirplaneId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy máy bay"));

        // 2. Lấy Route
        Route route = routeRepo.findById(req.getRouteId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tuyến bay"));

        // Giờ đến của chuyến bay = giờ khởi hành + thời lượng bay
        LocalDateTime arrivalTime = req.getDepartureTime().plusMinutes(req.getEstimateDuration());

        // Áp dụng quy định thời gian bay tối thiểu + điểm dừng (số tối đa, thời gian dừng) + validate
        validateFlightDuration(req.getEstimateDuration());
        validateFlightStops(req.getFlightStops(), req.getDepartureTime(), arrivalTime, route);

        // 3. Tạo Flight
        Flight flight = new Flight();
        flight.setFlightCode(req.getFlightCode());
        flight.setAirplane(airplane);
        flight.setRoute(route);
        flight.setDepartureTime(req.getDepartureTime());
        flight.setEstimateDuration(req.getEstimateDuration());
        flight.setArrivalTime(arrivalTime);
        flight.setBasePrice(req.getBasePrice());
        flight.setStatus(req.getStatus());

        // 4. Lưu Flight
        Flight savedFlight = flightRepo.save(flight);

        // 5. Lấy toàn bộ Seat template của AirplaneModel
        Long modelId = airplane.getModel().getId();
        List<Seat> seats = seatRepo.findByAirplaneModelId(modelId);

        // 6. Tạo FlightSeat với trạng thái AVAILABLE
        List<FlightSeat> flightSeats = new ArrayList<>();

        for (Seat seat : seats) {
            FlightSeat flightSeat = new FlightSeat();
            flightSeat.setFlight(savedFlight);
            flightSeat.setSeat(seat);
            flightSeat.setStatus(FlightSeatStatus.AVAILABLE);

            flightSeats.add(flightSeat);
        }

        // 7. Lưu toàn bộ FlightSeat
        flightSeatRepo.saveAll(flightSeats);

        // 8. Lưu FlightStop
        List<FlightStopResponse> flightStops = this.flightStopService.createFlightStop(savedFlight,
                req.getFlightStops());

        FlightResponse resp = new FlightResponse();
        resp.setId(savedFlight.getId());
        resp.setFlightCode(savedFlight.getFlightCode());
        resp.setDepartureTime(savedFlight.getDepartureTime());
        resp.setEstimateDuration(savedFlight.getEstimateDuration());
        resp.setBasePrice(savedFlight.getBasePrice());
        resp.setStatus(savedFlight.getStatus());
        resp.setAirplaneId(airplane.getId());
        resp.setRouteId(route.getId());
        resp.setFlightStops(flightStops);

        return resp;
    }

    public FlightResponse getFlight(Long id) {
        Flight flight = flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));

        return FlightResponse.builder()
                .id(flight.getId())
                .flightCode(flight.getFlightCode())
                .departureTime(flight.getDepartureTime())
                .estimateDuration(flight.getEstimateDuration())
                .basePrice(flight.getBasePrice())
                .status(flight.getStatus())
                .airplaneId(flight.getAirplane().getId())
                .routeId(flight.getRoute().getId())
                .build();
    }

    public List<Flight> getAll() {
        return flightRepo.findAll();
    }

    // Danh sách chuyến bay cho trang Admin (DTO sạch, tránh lazy khi serialize)
    @Transactional(readOnly = true)
    public List<com.flight.backend.dto.flight.FlightAdminResponse> getAllAdmin() {
        return flightRepo.findAll().stream().map(f -> {
            Airplane ap = f.getAirplane();
            Route rt = f.getRoute();
            return com.flight.backend.dto.flight.FlightAdminResponse.builder()
                    .id(f.getId())
                    .flightCode(f.getFlightCode())
                    .departureTime(f.getDepartureTime())
                    .estimateDuration(f.getEstimateDuration())
                    .status(f.getStatus() != null ? f.getStatus().name() : null)
                    .basePrice(f.getBasePrice())
                    .routeCode(rt != null ? rt.getRouteCode() : null)
                    .departureCity(rt != null && rt.getDepartureAirport() != null
                            ? rt.getDepartureAirport().getCity() : null)
                    .arrivalCity(rt != null && rt.getArrivalAirport() != null
                            ? rt.getArrivalAirport().getCity() : null)
                    .airplaneCode(ap != null ? ap.getAirplaneCode() : null)
                    .modelName(ap != null && ap.getModel() != null ? ap.getModel().getModelName() : null)
                    .totalSeats(ap != null && ap.getModel() != null ? ap.getModel().getTotalSeats() : null)
                    .routeId(rt != null ? rt.getId() : null)
                    .airplaneId(ap != null ? ap.getId() : null)
                    .flightStops(f.getFlightStops() == null ? java.util.List.of()
                            : f.getFlightStops().stream()
                                    .sorted((a, b) -> Integer.compare(a.getStopOrder(), b.getStopOrder()))
                                    .map(fs -> com.flight.backend.dto.flight.FlightStopResponse.builder()
                                            .flightStopId(fs.getId())
                                            .airportStopId(fs.getStopAirport() != null ? fs.getStopAirport().getId() : null)
                                            .arrivalTime(fs.getArrivalTime())
                                            .departureTime(fs.getDepartureTime())
                                            .stopOrder(fs.getStopOrder())
                                            .build())
                                    .toList())
                    .build();
        }).toList();
    }

    @Transactional
    public List<FlightSearchResponse> searchFlights(Long fromAirportId, Long toAirportId, java.time.LocalDate date,
            Long airlineId, Long minPrice, Long maxPrice, Integer numPassengers) {
        org.springframework.data.jpa.domain.Specification<Flight> spec = org.springframework.data.jpa.domain.Specification
                .where(com.flight.backend.specification.FlightSpecification.hasDepartureAirport(fromAirportId))
                .and(com.flight.backend.specification.FlightSpecification.hasArrivalAirport(toAirportId))
                .and(com.flight.backend.specification.FlightSpecification.hasDepartureDate(date))
                .and(com.flight.backend.specification.FlightSpecification.hasAirline(airlineId))
                .and(com.flight.backend.specification.FlightSpecification.priceBetween(minPrice, maxPrice));

        List<Flight> flights = flightRepo.findAll(spec);

        // Số chỗ tối thiểu cần còn trống để hiển thị (mặc định 1)
        int required = (numPassengers == null || numPassengers < 1) ? 1 : numPassengers;

        // Chỉ cho đặt vé chậm nhất 1 ngày trước giờ khởi hành -> ẩn chuyến quá sát giờ bay
        java.time.LocalDateTime bookingCutoff = java.time.LocalDateTime.now().plusDays(1);

        List<FlightSearchResponse> responses = new ArrayList<>();
        for (Flight flight : flights) {
            // Ẩn chuyến khởi hành trong vòng 1 ngày tới (không còn được đặt)
            if (flight.getDepartureTime() != null
                    && flight.getDepartureTime().isBefore(bookingCutoff)) {
                continue;
            }

            long total = flightSeatRepo.countTotalSeats(flight.getId());
            long available = flightSeatRepo.countAvailableSeats(flight.getId());

            // QUY ĐỊNH: chỉ bán vé khi còn chỗ — ẩn chuyến đã đặt đủ người.
            // Chỉ áp dụng cho chuyến có quản lý chỗ (total > 0); chuyến chưa sinh ghế thì bỏ qua kiểm tra.
            if (total > 0 && available < required) {
                continue;
            }

            FlightSearchResponse resp = FlightSearchResponse.builder()
                    .id(flight.getId())
                    .flightCode(flight.getFlightCode())
                    .airlineId(flight.getAirplane().getAirline().getId())
                    .airlineName(flight.getAirplane().getAirline().getAirlineName())
                    .airlineLogo(flight.getAirplane().getAirline().getLogo())
                    .departureAirportId(flight.getRoute().getDepartureAirport().getId())
                    .departureAirportCode(flight.getRoute().getDepartureAirport().getAirportCode())
                    .departureCity(flight.getRoute().getDepartureAirport().getCity())
                    .arrivalAirportId(flight.getRoute().getArrivalAirport().getId())
                    .arrivalAirportCode(flight.getRoute().getArrivalAirport().getAirportCode())
                    .arrivalCity(flight.getRoute().getArrivalAirport().getCity())
                    .departureTime(flight.getDepartureTime())
                    .arrivalTime(flight.getArrivalTime())
                    .estimateDuration(flight.getEstimateDuration())
                    .basePrice(flight.getBasePrice())
                    .status(flight.getStatus())
                    .availableSeats(total > 0 ? (int) available : null)
                    .totalSeats(total > 0 ? (int) total : null)
                    .stops(flight.getFlightStops() == null ? java.util.List.of()
                            : flight.getFlightStops().stream()
                                    .sorted((a, b) -> Integer.compare(a.getStopOrder(), b.getStopOrder()))
                                    .map(fs -> com.flight.backend.dto.flight.FlightSearchStopResponse.builder()
                                            .stopOrder(fs.getStopOrder())
                                            .stopAirportId(fs.getStopAirport() != null ? fs.getStopAirport().getId() : null)
                                            .stopAirportCode(fs.getStopAirport() != null ? fs.getStopAirport().getAirportCode() : null)
                                            .stopAirportName(fs.getStopAirport() != null ? fs.getStopAirport().getName() : null)
                                            .stopCity(fs.getStopAirport() != null ? fs.getStopAirport().getCity() : null)
                                            .arrivalTime(fs.getArrivalTime())
                                            .departureTime(fs.getDepartureTime())
                                            .stopDuration(fs.getStopDuration())
                                            .build())
                                    .toList())
                    .build();
            responses.add(resp);
        }
        return responses;
    }

    public Flight getFlightById(Long id) {
        return this.flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chuyến bay"));
    }
}