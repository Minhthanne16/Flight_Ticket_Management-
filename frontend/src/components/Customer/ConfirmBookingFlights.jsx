import React from 'react';
import '../../css/Customer/SearchResults.css';

// Mang các hàm tiện ích định dạng trực tiếp vào đây để component tự xử lý độc lập
const formatTime = (dateString) => {
  if (!dateString) return '--:--';
  const date = new Date(dateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const formatPrice = (price) => {
  if (!price) return '0';
  return new Intl.NumberFormat('vi-VN').format(price);
};

const formatDisplayDate = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

function ConfirmBookingFlights({ flight, onClose, fromCode, toCode, filters }) {
  // Nếu không có chuyến bay nào được chọn thì không hiển thị gì cả
  if (!flight) return null;

  const passengerCount = parseInt(filters.passengers, 10) || 1;
  const totalPrice = flight.basePrice * passengerCount;

  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      {/* Ngăn không cho sự kiện click bên trong làm đóng cửa sổ */}
      <div className="ticket-modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Modal */}
        <div className="modal-header">
          <h3><i className="fa-solid fa-plane-departure"></i> Select ticket type</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Nội dung chi tiết */}
        <div className="modal-body">
          {/* Tóm tắt thông tin chuyến bay */}
          <div className="selected-flight-summary">
            <div className="summary-header">
               <strong>Departure</strong> {fromCode} <i className="fa-solid fa-arrow-right"></i> {toCode}
               <span className="summary-date">
                 {filters.departDate ? formatDisplayDate(new Date(filters.departDate)) : ''}
               </span>
            </div>
            <div className="summary-details">
               <img src={flight.airplane?.airline?.logo || '/default-airline.png'} alt="logo" className="modal-airline-logo" />
               <div className="summary-time">
                  <strong>{formatTime(flight.departureTime)}</strong>
                  <span>{fromCode}</span>
               </div>
               <div className="summary-duration">
                  <span>{flight.estimateDuration} min</span>
                  <div className="line-path"></div>
                  <span>Direct</span>
               </div>
               <div className="summary-time">
                  <strong>{formatTime(flight.arrivalTime)}</strong>
                  <span>{toCode}</span>
               </div>
            </div>
          </div>

          {/* Grid lựa chọn các hạng vé */}
          <div className="ticket-options-grid">
            
            {/* Gói vé cơ bản */}
            <div className="ticket-option-card">
              <h4>{filters.cabinClass === 'business' ? 'Business Class' : 'Economy Class'}</h4>
              <h2 className="modal-price">
                {formatPrice(totalPrice)} VND
                <small>/ {passengerCount} pax</small>
              </h2>
              <ul className="modal-amenities">
                <li><i className="fa-solid fa-briefcase"></i> Cabin baggage 7 kg</li>
                <li><i className="fa-solid fa-suitcase-rolling"></i> Checked baggage 2 x 23 kg</li>
                <li className="disabled-text"><i className="fa-solid fa-ban"></i> Reschedule not available</li>
                <li className="disabled-text"><i className="fa-solid fa-ban"></i> Non-refundable</li>
              </ul>
              <button className="btn-select-final">Select</button>
            </div>

            <div className="ticket-option-card recommended">
              <h4>Business Class {filters.cabinClass === 'business'}</h4>
              <h2 className="modal-price">
                {formatPrice((totalPrice + (totalPrice * 0.5)) * passengerCount)} VND
                <small>/ {passengerCount} pax</small>
              </h2>
              <ul className="modal-amenities">
                <li><i className="fa-solid fa-briefcase"></i> Cabin baggage 7 kg</li>
                <li><i className="fa-solid fa-suitcase-rolling"></i> Checked baggage 2 x 23 kg</li>
                <li className="success-text"><i className="fa-solid fa-check"></i> Free Reschedule</li>
                <li className="success-text"><i className="fa-solid fa-check"></i> Refundable</li>
              </ul>
              <button className="btn-select-final">Select</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default ConfirmBookingFlights;