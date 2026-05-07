package com.flight.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.flight.backend.entity.enums.SeatStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "seats",
        uniqueConstraints = {
            @UniqueConstraint(name = "uk_seat_airplane_seat_number", columnNames = {"airplane_id", "seat_number"})
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airplane_id")
    private Airplane airplane;

    @Column(name = "seat_number", length = 3)
    private String seatNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_class_id")
    private TicketClass ticketClass;

    @Column(name = "row_number")
    private Integer rowNumber;

    @Column(name = "column_letter", length = 1)
    private String columnLetter;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private SeatStatus status;
    
    @JsonIgnore
    @OneToMany(mappedBy = "seat")
    private List<FlightSeat> flightSeats = new ArrayList<>();
}
