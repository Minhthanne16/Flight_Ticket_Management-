package com.flight.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ticket_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TicketClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ticket_class_id")
    private Long id;

    @Column(name = "class_code", unique = true, length = 10)
    private String classCode;

    @Column(name = "class_name", length = 255)
    private String className;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "price_multiplier", precision = 10, scale = 2)
    private BigDecimal priceMultiplier;

    @Column(name = "baggage_allowance")
    private int baggageAllowanceKg;

    @JsonIgnore
    @OneToMany(mappedBy = "ticketClass")
    private List<Seat> seats = new ArrayList<>();
}
