package com.flight.backend.specification;

import com.flight.backend.entity.Flight;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class FlightSpecification {

    public static Specification<Flight> hasDepartureAirport(Long airportId) {
        return (root, query, criteriaBuilder) -> {
            if (airportId == null) return null;
            return criteriaBuilder.equal(root.get("route").get("departureAirport").get("id"), airportId);
        };
    }

    public static Specification<Flight> hasArrivalAirport(Long airportId) {
        return (root, query, criteriaBuilder) -> {
            if (airportId == null) return null;
            return criteriaBuilder.equal(root.get("route").get("arrivalAirport").get("id"), airportId);
        };
    }

    public static Specification<Flight> hasDepartureDate(LocalDate date) {
        return (root, query, criteriaBuilder) -> {
            if (date == null) return null;
            LocalDateTime startOfDay = date.atStartOfDay();
            LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
            return criteriaBuilder.between(root.get("departureTime"), startOfDay, endOfDay);
        };
    }

    public static Specification<Flight> hasAirline(Long airlineId) {
        return (root, query, criteriaBuilder) -> {
            if (airlineId == null) return null;
            return criteriaBuilder.equal(root.get("airplane").get("airline").get("id"), airlineId);
        };
    }

    public static Specification<Flight> priceBetween(Long minPrice, Long maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("basePrice"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("basePrice"), minPrice);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("basePrice"), maxPrice);
            }
        };
    }
}
