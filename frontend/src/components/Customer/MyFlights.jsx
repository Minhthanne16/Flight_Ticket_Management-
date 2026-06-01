import React, { useState } from 'react';
import '../../css/Customer/MyFlights.css'; 
import Navbar from '../Homepage/Navbar';
import Footer from '../Homepage/Footer';
function MyFlights() {
  // Dữ liệu giả lập mô phỏng chính xác cấu trúc Backend của bạn
  const mockBookings = [
    {
      id: 1,
      pnrCode: '5YF37M',
      bookingDate: '2026-05-31T10:00:00',
      totalAmount: 4308400,
      status: 'CONFIRMED',
      flight: {
        airlineName: 'Bamboo Airways',
        flightCode: 'QH201',
        departureAirportCode: 'HAN',
        arrivalAirportCode: 'SGN',
        departureTime: '2026-06-18T06:30:00',
        arrivalTime: '2026-06-18T08:40:00'
      },
      tickets: [
        {
          ticketNumber: '5YF37M01',
          flightSeat: { seatNumber: '12A' },
          passenger: { fullName: 'TRAN NGUYEN PHU THUAN', documentNumber: '087205014217' }
        },
        {
          ticketNumber: '5YF37M02',
          flightSeat: { seatNumber: '12B' },
          passenger: { fullName: 'NGUYEN THI HANH', documentNumber: '087168001901' }
        }
      ]
    },
    {
      id: 2,
      pnrCode: 'A8B9C0',
      bookingDate: '2026-04-15T14:30:00',
      totalAmount: 1650000,
      status: 'COMPLETED',
      flight: {
        airlineName: 'VietJet Air',
        flightCode: 'VJ123',
        departureAirportCode: 'SGN',
        arrivalAirportCode: 'DAD',
        departureTime: '2026-05-10T09:00:00',
        arrivalTime: '2026-05-10T10:20:00'
      },
      tickets: [
        {
          ticketNumber: 'A8B9C001',
          flightSeat: { seatNumber: '5C' },
          passenger: { fullName: 'TRAN NGUYEN PHU THUAN', documentNumber: '087205014217' }
        }
      ]
    }
  ];

  // State lưu trữ chuyến bay đang được chọn để hiển thị ở cột phải
  const [selectedBooking, setSelectedBooking] = useState(mockBookings[0]);

  // Hàm format ngày giờ hiển thị
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} - ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <>
      <Navbar />
    <div className="my-flights-container">
      
      {/* CỘT TRÁI: DANH SÁCH CHUYẾN BAY */}
      <div className="flights-list-sidebar">
        <h2 className="sidebar-title">Chuyến bay của tôi</h2>
        
        <div className="booking-cards-wrapper">
          {mockBookings.map((booking) => (
            <div 
              key={booking.id} 
              className={`booking-card ${selectedBooking?.id === booking.id ? 'active' : ''}`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="card-header">
                <span className="pnr-badge">PNR: {booking.pnrCode}</span>
                <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
              </div>
              <div className="card-route">
                <strong>{booking.flight.departureAirportCode}</strong>
                <i className="fa-solid fa-arrow-right"></i>
                <strong>{booking.flight.arrivalAirportCode}</strong>
              </div>
              <div className="card-airline">
                {booking.flight.airlineName} • {booking.flight.flightCode}
              </div>
              <div className="card-date">
                <i className="fa-regular fa-calendar"></i> {formatDateTime(booking.flight.departureTime)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CỘT PHẢI: CHI TIẾT VÉ (Giống hệt UI BookingSuccess) */}
      <div className="flight-detail-content">
        {selectedBooking ? (
          <div className="booking-success-container no-margin">
            
            {/* 1. LỜI CHÀO & XÁC NHẬN */}
            <div className="success-greeting">
              <p>Xin chào <strong>{selectedBooking.tickets[0]?.passenger.fullName}</strong></p>
              <p className="sub-text">Dear <strong>{selectedBooking.tickets[0]?.passenger.fullName}</strong></p>
              <p className="mt-15">Trạng thái đặt chỗ: <strong>{selectedBooking.status}</strong></p>
            </div>

            {/* 2. KHUNG MÃ ĐẶT CHỖ */}
            <div className="reservation-code-box">
              <h4>MÃ ĐẶT CHỖ <span className="sub-text font-normal">RESERVATION CODE</span></h4>
              <h1 className="pnr-code">{selectedBooking.pnrCode}</h1>
              <p className="instruction">Đưa mã này cho nhân viên soát vé</p>
              <p className="sub-text">Show this code to the check-in officer</p>
            </div>

            {/* 3. THÔNG TIN HÀNH KHÁCH TỪ TICKETS */}
            <div className="passenger-info-section">
              <div className="section-header">
                <h4>THÔNG TIN HÀNH KHÁCH</h4>
                <p className="sub-text">PASSENGER INFORMATION</p>
              </div>

              <div className="passenger-list-wrapper">
                {selectedBooking.tickets.map((ticket, index) => (
                  <div key={ticket.ticketNumber} className="passenger-item-block">
                    <div className="info-row row-highlight">
                      <div className="row-label">Hành khách<br/><span className="sub-text">Passenger</span></div>
                      <div className="row-value font-bold">{ticket.passenger.fullName}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="row-label">Số giấy tờ<br/><span className="sub-text">Document number</span></div>
                      <div className="row-value">{ticket.passenger.documentNumber}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="row-label">Ghế<br/><span className="sub-text">Seat</span></div>
                      <div className="row-value font-bold">{ticket.flightSeat?.seatNumber || 'Chưa chọn'}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="row-label">Mã vé<br/><span className="sub-text">Ticket code</span></div>
                      <div className="row-value">{ticket.ticketNumber}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. THANH TOÁN */}
            <div className="payment-section">
              <div className="section-header-inline">
                <h4>THANH TOÁN <span className="sub-text font-normal">PAYMENT</span></h4>
              </div>
              <div className="payment-box">
                <p className="font-bold">TỔNG TIỀN <span className="sub-text font-normal">TOTAL AMOUNT</span></p>
                <h2 className="total-amount-text">{new Intl.NumberFormat('vi-VN').format(selectedBooking.totalAmount)}đ</h2>
              </div>
            </div>

          </div>
        ) : (
          <div className="empty-state">
            Vui lòng chọn một chuyến bay để xem chi tiết.
          </div>
        )}
      </div>
      
    </div>
    <Footer />
    </>
  );
}

export default MyFlights;