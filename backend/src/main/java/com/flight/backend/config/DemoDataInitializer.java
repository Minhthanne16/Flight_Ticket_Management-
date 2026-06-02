package com.flight.backend.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.flight.backend.entity.Airline;
import com.flight.backend.entity.Airplane;
import com.flight.backend.entity.AirplaneModel;
import com.flight.backend.entity.Airport;
import com.flight.backend.entity.Flight;
import com.flight.backend.entity.FlightSeat;
import com.flight.backend.entity.Route;
import com.flight.backend.entity.Seat;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.entity.enums.AirplaneStatus;
import com.flight.backend.entity.enums.FlightSeatStatus;
import com.flight.backend.entity.enums.FlightStatus;
import com.flight.backend.entity.enums.RouteStatus;
import com.flight.backend.entity.enums.SeatStatus;
import com.flight.backend.repository.AirlineRepository;
import com.flight.backend.repository.AirplaneModelRepository;
import com.flight.backend.repository.AirplaneRepository;
import com.flight.backend.repository.AirportRepository;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.FlightSeatRepository;
import com.flight.backend.repository.RouteRepository;
import com.flight.backend.repository.SeatRepository;
import com.flight.backend.repository.TicketClassRepository;

import lombok.RequiredArgsConstructor;

/**
 * Seed dữ liệu nghiệp vụ mẫu (sân bay, hãng, model + ghế, máy bay, tuyến, chuyến bay)
 * để có sẵn data test mà không cần nhập tay qua Admin.
 *
 * - Dữ liệu nền (hạng vé, sân bay, hãng, model, máy bay, tuyến): tạo theo mã, KHÔNG trùng lặp khi restart.
 * - Chuyến bay DEMO*: tạo nếu chưa có; nếu đã có nhưng giờ bay đã qua thì làm mới giờ (để luôn test được
 *   2 quy định: còn chỗ / đặt chậm nhất 1 ngày trước giờ bay). KHÔNG đụng tới chuyến do người dùng tự tạo.
 */
@Component
@Order(10)
@RequiredArgsConstructor
public class DemoDataInitializer implements CommandLineRunner {

    private static final String DEMO_MODEL_NAME = "Airbus A320 (Demo)";

    private final TicketClassRepository ticketClassRepository;
    private final AirportRepository airportRepository;
    private final AirlineRepository airlineRepository;
    private final AirplaneModelRepository airplaneModelRepository;
    private final SeatRepository seatRepository;
    private final AirplaneRepository airplaneRepository;
    private final RouteRepository routeRepository;
    private final FlightRepository flightRepository;
    private final FlightSeatRepository flightSeatRepository;

    @Override
    @Transactional
    public void run(String... args) {
        // 1. Hạng vé
        TicketClass eco = ensureTicketClass("ECO", "Phổ thông", new BigDecimal("1.00"), 20,
                "Hạng phổ thông tiêu chuẩn");
        TicketClass bus = ensureTicketClass("BUS", "Thương gia", new BigDecimal("2.00"), 40,
                "Hạng thương gia, ưu tiên hành lý và dịch vụ");

        // 2. Sân bay
        Airport sgn = ensureAirport("SGN", "Sân bay Tân Sơn Nhất", "TP. Hồ Chí Minh", "Việt Nam");
        Airport han = ensureAirport("HAN", "Sân bay Nội Bài", "Hà Nội", "Việt Nam");
        Airport dad = ensureAirport("DAD", "Sân bay Đà Nẵng", "Đà Nẵng", "Việt Nam");
        Airport cxr = ensureAirport("CXR", "Sân bay Cam Ranh", "Khánh Hòa", "Việt Nam");

        // 3. Hãng bay
        Airline vn = ensureAirline("VN", "Vietnam Airlines", "Hãng hàng không quốc gia Việt Nam");
        Airline vj = ensureAirline("VJ", "Vietjet Air", "Hãng hàng không giá rẻ");

        // 4. Model máy bay + sơ đồ ghế (10 hàng x ABCDEF = 60 ghế; hàng 1-2 Thương gia, còn lại Phổ thông)
        AirplaneModel model = ensureDemoModel(eco, bus);

        // 5. Máy bay
        Airplane apVn = ensureAirplane("DEMOVN1", vn, model);
        Airplane apVj = ensureAirplane("DEMOVJ1", vj, model);

        // 6. Tuyến bay
        Route sgnHan = ensureRoute(sgn, han);
        Route sgnDad = ensureRoute(sgn, dad);
        Route hanDad = ensureRoute(han, dad);
        Route sgnCxr = ensureRoute(sgn, cxr);

        // 7. Chuyến bay mẫu
        int totalSeats = model.getTotalSeats();
        LocalDateTime now = LocalDateTime.now();

        // Đặt được: còn nguyên chỗ, khởi hành sau 5 ngày
        upsertFlight("DEMO01", apVn, sgnHan, now.plusDays(5), 130, new BigDecimal("1500000"), 0);
        // Sắp đầy: chỉ còn 3 chỗ (test badge "Chỉ còn N chỗ!")
        upsertFlight("DEMO02", apVj, sgnDad, now.plusDays(3), 90, new BigDecimal("1200000"), totalSeats - 3);
        // Đầy chỗ: ẩn khỏi kết quả tìm kiếm (quy định còn chỗ)
        upsertFlight("DEMO03", apVn, hanDad, now.plusDays(7), 80, new BigDecimal("1000000"), totalSeats);
        // Quá sát giờ bay (12 giờ tới): ẩn khỏi kết quả (quy định đặt trước 1 ngày)
        upsertFlight("DEMO04", apVj, sgnHan, now.plusHours(12), 130, new BigDecimal("1600000"), 0);
        // Đặt được: còn nguyên chỗ, khởi hành sau 10 ngày
        upsertFlight("DEMO05", apVn, sgnCxr, now.plusDays(10), 70, new BigDecimal("900000"), 0);
    }

    // ----- Hạng vé -----
    private TicketClass ensureTicketClass(String code, String name, BigDecimal multiplier, int baggageKg, String desc) {
        return ticketClassRepository.findAll().stream()
                .filter(t -> code.equalsIgnoreCase(t.getClassCode()))
                .findFirst()
                .orElseGet(() -> {
                    TicketClass t = new TicketClass();
                    t.setClassCode(code);
                    t.setClassName(name);
                    t.setDescription(desc);
                    t.setPriceMultiplier(multiplier);
                    t.setBaggageAllowanceKg(baggageKg);
                    return ticketClassRepository.save(t);
                });
    }

    // ----- Sân bay -----
    private Airport ensureAirport(String code, String name, String city, String country) {
        return airportRepository.findAll().stream()
                .filter(a -> code.equalsIgnoreCase(a.getAirportCode()))
                .findFirst()
                .orElseGet(() -> {
                    Airport a = new Airport();
                    a.setAirportCode(code);
                    a.setName(name);
                    a.setCity(city);
                    a.setCountry(country);
                    return airportRepository.save(a);
                });
    }

    // ----- Hãng bay -----
    private Airline ensureAirline(String code, String name, String desc) {
        return airlineRepository.findByAirlineCode(code)
                .orElseGet(() -> {
                    Airline a = new Airline();
                    a.setAirlineCode(code);
                    a.setAirlineName(name);
                    a.setDescription(desc);
                    return airlineRepository.save(a);
                });
    }

    // ----- Model máy bay + ghế -----
    private AirplaneModel ensureDemoModel(TicketClass eco, TicketClass bus) {
        AirplaneModel existing = airplaneModelRepository.findAll().stream()
                .filter(m -> DEMO_MODEL_NAME.equals(m.getModelName()))
                .findFirst()
                .orElse(null);
        if (existing != null) {
            return existing;
        }

        int totalRows = 10;
        String seatColumns = "ABCDEF";

        AirplaneModel model = new AirplaneModel();
        model.setModelName(DEMO_MODEL_NAME);
        model.setManufacturer("Airbus");
        model.setDescription("Model mẫu cho dữ liệu test");
        model.setTotalRows(totalRows);
        model.setSeatColumns(seatColumns);
        model.setTotalSeats(totalRows * seatColumns.length());
        AirplaneModel saved = airplaneModelRepository.save(model);

        List<Seat> seats = new ArrayList<>();
        for (int row = 1; row <= totalRows; row++) {
            for (char col : seatColumns.toCharArray()) {
                Seat seat = new Seat();
                seat.setAirplaneModel(saved);
                seat.setRowNumber(row);
                seat.setColumnLetter(String.valueOf(col));
                seat.setSeatNumber(row + String.valueOf(col));
                seat.setStatus(SeatStatus.AVAILABLE);
                // Hàng 1-2 = Thương gia, còn lại = Phổ thông
                seat.setTicketClass(row <= 2 ? bus : eco);
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
        return saved;
    }

    // ----- Máy bay -----
    private Airplane ensureAirplane(String code, Airline airline, AirplaneModel model) {
        return airplaneRepository.findByAirplaneCode(code)
                .orElseGet(() -> {
                    Airplane a = new Airplane();
                    a.setAirplaneCode(code);
                    a.setAirline(airline);
                    a.setModel(model);
                    a.setStatus(AirplaneStatus.ACTIVE);
                    return airplaneRepository.save(a);
                });
    }

    // ----- Tuyến bay -----
    private Route ensureRoute(Airport from, Airport to) {
        String code = from.getAirportCode() + "-" + to.getAirportCode();
        Route existing = routeRepository.findByRouteCode(code);
        if (existing != null) {
            return existing;
        }
        Route r = new Route();
        r.setRouteCode(code);
        r.setDepartureAirport(from);
        r.setArrivalAirport(to);
        r.setStatus(RouteStatus.ACTIVE);
        return routeRepository.save(r);
    }

    // ----- Chuyến bay (tạo mới hoặc làm mới giờ nếu đã quá hạn) -----
    private void upsertFlight(String code, Airplane airplane, Route route, LocalDateTime departure,
            int durationMinutes, BigDecimal basePrice, int bookedSeats) {

        Flight existing = flightRepository.findByFlightCode(code).orElse(null);
        if (existing != null) {
            // Làm mới giờ bay nếu đã qua, để dữ liệu test luôn dùng được
            if (existing.getDepartureTime() == null || existing.getDepartureTime().isBefore(LocalDateTime.now())) {
                existing.setDepartureTime(departure);
                existing.setArrivalTime(departure.plusMinutes(durationMinutes));
                flightRepository.save(existing);
            }
            return;
        }

        Flight flight = new Flight();
        flight.setFlightCode(code);
        flight.setAirplane(airplane);
        flight.setRoute(route);
        flight.setDepartureTime(departure);
        flight.setEstimateDuration(durationMinutes);
        flight.setArrivalTime(departure.plusMinutes(durationMinutes));
        flight.setBasePrice(basePrice);
        flight.setStatus(FlightStatus.SCHEDULED);
        Flight savedFlight = flightRepository.save(flight);

        // Sinh FlightSeat cho từng ghế của model; đánh dấu BOOKED cho `bookedSeats` ghế đầu để mô phỏng đã bán
        List<Seat> seats = seatRepository.findByAirplaneModelId(airplane.getModel().getId());
        List<FlightSeat> flightSeats = new ArrayList<>();
        int booked = 0;
        for (Seat seat : seats) {
            FlightSeat fs = new FlightSeat();
            fs.setFlight(savedFlight);
            fs.setSeat(seat);
            fs.setStatus(booked < bookedSeats ? FlightSeatStatus.BOOKED : FlightSeatStatus.AVAILABLE);
            booked++;
            flightSeats.add(fs);
        }
        flightSeatRepository.saveAll(flightSeats);
    }
}
