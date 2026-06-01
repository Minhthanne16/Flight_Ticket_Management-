import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/Customer/BookingSuccess.css'; 

function BookingSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const handleContinueToPayment = async () => {
    // 1. Chuẩn bị dữ liệu theo đúng chuẩn CreateBookingRequest của Backend
    const bookingPayload = {
      userId: 1, // Thay bằng ID của user đang đăng nhập (hoặc lấy từ Context/Redux)
      flightId: flight.id,
      // Chuyển đổi hạng vé từ string sang ID (Ví dụ: 1 là Economy, 2 là Business)
      ticketClassId: filters.cabinClass === 'economy' ? 1 : 2, 
      passengers: passengers.map(p => ({
         fullName: p.fullName,
         gender: p.gender,
         dateOfBirth: p.dateOfBirth, // Đảm bảo format ngày chuẩn YYYY-MM-DD
         idCard: p.documentNumber
         // Thêm các trường khác nếu CreatePassengerRequest của bạn yêu cầu
      }))
    };

    try {
      // 2. Gọi API POST tạo Booking
      const response = await fetch('http://localhost:5000/bookings', { // Thay port đúng với Spring Boot của bạn
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();

      if (result.code === 200 || response.ok) {
        const createdBooking = result.data; // BookingResponse từ Backend

        // 3. Chuyển sang trang BookingSuccess (hoặc trang Payment) và truyền ngầm dữ liệu
        navigate('/customer/booking-success', {
          state: {
            flight: flight,
            passengers: passengers,
            totalPrice: createdBooking.totalAmount,
            reservationCode: createdBooking.pnrCode, // Lấy mã PNR từ DB trả về
            bookingTime: new Date().toLocaleString('vi-VN')
          }
        });
      } else {
        alert("Lỗi tạo vé: " + result.message);
      }
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      alert("Không thể kết nối đến máy chủ.");
    }
};
  // Nhận dữ liệu từ trang TicketInformation truyền sang
  const { flight, passengers, totalPrice, reservationCode, bookingTime } = location.state || {};

  // Nếu không có dữ liệu (do f5 hoặc vào trực tiếp link), đá về trang chủ
  if (!flight || !passengers) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Không tìm thấy thông tin đặt chỗ.</h2>
        <button className="btn-home-fallback" onClick={() => navigate('/customer/home')}>Về trang chủ</button>
      </div>
    );
  }

  // Lấy tên người đặt (người đầu tiên trong danh sách)
  const primaryPassengerName = passengers[0]?.fullName || 'QUÝ KHÁCH';
  const airlineName = flight?.airlineName || 'hãng hàng không';

  return (
    <div className="booking-success-container">
      
      {/* 1. LỜI CHÀO & XÁC NHẬN */}
      <div className="success-greeting">
        <p>Xin chào <strong>{primaryPassengerName}</strong></p>
        <p className="sub-text">Dear <strong>{primaryPassengerName}</strong></p>
        
        <p className="mt-15">Hệ thống xác nhận bạn đã đặt vé máy bay <strong>{airlineName}</strong> thành công vào lúc <strong>{bookingTime}</strong></p>
        <p className="sub-text">We would like to confirm that your <strong>{airlineName}</strong> ticket has been reserved at <strong>{bookingTime}</strong></p>
      </div>

      {/* 2. KHUNG MÃ ĐẶT CHỖ (Màu hồng nhạt) */}
      <div className="reservation-code-box">
        <h4>MÃ ĐẶT CHỖ <span className="sub-text font-normal">RESERVATION CODE</span></h4>
        <h1 className="pnr-code">{reservationCode}</h1>
        <p className="instruction">Đưa mã này cho nhân viên soát vé</p>
        <p className="sub-text">Show this code to the check-in officer</p>
      </div>

      {/* 3. THÔNG TIN HÀNH KHÁCH */}
      <div className="passenger-info-section">
        <div className="section-header">
          <h4>THÔNG TIN HÀNH KHÁCH</h4>
          <p className="sub-text">PASSENGER INFORMATION</p>
        </div>

        <div className="passenger-list-wrapper">
          {passengers.map((passenger, index) => (
            <div key={index} className="passenger-item-block">
              {/* Dòng tên hành khách bôi xám */}
              <div className="info-row row-highlight">
                <div className="row-label">Hành khách<br/><span className="sub-text">Passenger</span></div>
                <div className="row-value font-bold">{passenger.fullName}</div>
              </div>
              
              <div className="info-row">
                <div className="row-label">Loại giấy tờ<br/><span className="sub-text">Document type</span></div>
                <div className="row-value">CCCD / Passport</div>
              </div>
              
              <div className="info-row">
                <div className="row-label">Số giấy tờ<br/><span className="sub-text">Document number</span></div>
                <div className="row-value">{passenger.documentNumber}</div>
              </div>
              
              <div className="info-row">
                <div className="row-label">Ghế<br/><span className="sub-text">Seat</span></div>
                <div className="row-value">Chưa chọn</div>
              </div>
              
              <div className="info-row">
                <div className="row-label">Mã vé<br/><span className="sub-text">Ticket code</span></div>
                <div className="row-value">{reservationCode}0{index + 1}</div>
              </div>
              
              <div className="info-row">
                <div className="row-label">Dịch vụ bổ sung<br/><span className="sub-text">Ancillary</span></div>
                <div className="row-value"></div>
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
          <h2 className="total-amount-text">{new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</h2>
        </div>
      </div>

      {/* NÚT VỀ TRANG CHỦ */}
      <div className="action-buttons">
        <button className="btn-back-home" onClick={() => navigate('/customer/home')}>
          Quay lại trang chủ
        </button>
      </div>

    </div>
  );
}

export default BookingSuccess;