package com.flight.backend.service;

import com.flight.backend.entity.Flight;
import com.flight.backend.entity.TicketClass;
import com.flight.backend.repository.FlightRepository;
import com.flight.backend.repository.TicketClassRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class FlightPricingService {

    private final FlightRepository flightRepository;
    private final TicketClassRepository ticketClassRepository;

    public FlightPricingService(
            FlightRepository flightRepository,
            TicketClassRepository ticketClassRepository) {
        this.flightRepository = flightRepository;
        this.ticketClassRepository = ticketClassRepository;
    }

    public List<String> getFlightPrices(Long flightId) {
        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        List<TicketClass> ticketClasses = ticketClassRepository.findAll();

        List<String> result = new ArrayList<>();

        for (TicketClass ticketClass : ticketClasses) {
            BigDecimal finalPrice = flight.getBasePrice().multiply(ticketClass.getPriceMultiplier());
            result.add(
                    ticketClass.getClassName()
                            + " : "
                            + finalPrice);
        }

        return result;
    }
}