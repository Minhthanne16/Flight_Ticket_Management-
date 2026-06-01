import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../css/Customer/SearchResults.css';

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
  if (!flight) return null;
  const navigate = useNavigate();
  const passengerCount = parseInt(filters.passengers, 10) || 1;
  const totalPrice = flight.basePrice * passengerCount;
  const handleSelectClass = (cabinClass, priceMultiplier) => {
  const finalPrice = flight.basePrice * priceMultiplier * passengerCount;

  navigate('/customer/booking-details', {
    state: {
      flight,
      filters,
      fromCode,
      toCode,
      cabinClass,
      totalPrice: finalPrice,
      passengerCount
    }
  });

  onClose();
};
  return (
    <div className="ticket-modal-overlay" onClick={onClose}>
      <div className="ticket-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <h3><i className="fa-solid fa-plane-departure"></i> Select ticket type</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
  <div className="selected-flight-summary">
    
    {/* Phần Header (ĐÃ CHUYỂN LOGO LÊN ĐÂY) */}
    <div className="summary-header">
      <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <img 
          src={flight.airlineLogo || '/default-airline.png'} 
          alt="logo" 
          className="header-airline-logo" 
        />
        <strong>Departure</strong> 
      </div>
      <span className="summary-date">
        {filters.departDate ? formatDisplayDate(new Date(filters.departDate)) : ''}
      </span>
    </div>

    {/* Phần Details (Đường bay tự động canh giữa tuyệt đối) */}
    <div className="summary-details">
      
      {/* Cột trái: Khởi hành */}
      <div className="summary-time">
        <strong>{formatTime(flight.departureTime)}</strong>
        <span className="airport-code-box">{fromCode}</span>
      </div>

      {/* Trục giữa: Đường bay & Transit */}
      <div className="summary-route">
        <div className="route-duration">
          {Math.floor(flight.estimateDuration / 60)}h {flight.estimateDuration % 60}m
        </div>
        
        <div className="route-line-container">
          <div className="route-line"></div>
          <div 
             className="route-type" 
             style={{ color: flight.flightStops?.length > 0 ? '#ff5e1f' : '#64748b' }}
          >
            {flight.flightStops?.length > 0 
                ? `${flight.flightStops.length} stop${flight.flightStops.length > 1 ? 's' : ''}` 
                : 'Direct'}
          </div>
        </div>

        {/* Chi tiết Transit */}
        {flight.flightStops?.length > 0 && (
          <div className="transit-details-mini">
            {flight.flightStops.sort((a, b) => a.stopOrder - b.stopOrder).map((stop) => (
              <div key={stop.flightStopId} className="transit-stop-item">
                <span className="transit-dot"></span>
                <div className="transit-text">
                  <div>Dừng tại <strong>{stop.airportCode}</strong> • {Math.floor(stop.stopDuration / 60)}h {stop.stopDuration % 60}m</div>
                  <small>({formatTime(stop.arrivalTime)} - {formatTime(stop.departureTime)})</small>
                  
                  {/* LOGO HÃNG PHỤC VỤ CHẶNG TRANSIT NÀY */}
                  <div className="transit-airline">
                    <img src={flight.airlineLogo || '/default-airline.png'} alt="airline" className="transit-micro-logo" />
                    <small> {flight.airlineName || 'Airline'}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cột phải: Đến nơi */}
      <div className="summary-time">
        <strong>{formatTime(flight.arrivalTime)}</strong>
        <span className="airport-code-box">{toCode}</span>
      </div>
      
    </div>
  


         
          <div className="ticket-options-grid">
            
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
              <button className="btn-select-final" onClick={() => handleSelectClass('ECONOMY', 1)}>Select</button>
            </div>

            <div className="ticket-option-card recommended">
              <h4>Business Class {filters.cabinClass === 'business'}</h4>
              <h2 className="modal-price">
                {formatPrice((totalPrice + (totalPrice * 0.5)) )} VND
                <small>/ {passengerCount} pax</small>
              </h2>
              <ul className="modal-amenities">
                <li><i className="fa-solid fa-briefcase"></i> Cabin baggage 7 kg</li>
                <li><i className="fa-solid fa-suitcase-rolling"></i> Checked baggage 2 x 23 kg</li>
                <li className="success-text"><i className="fa-solid fa-check"></i> Free Reschedule</li>
                <li className="success-text"><i className="fa-solid fa-check"></i> Refundable</li>
              </ul>
              <button className="btn-select-final" onClick={() => handleSelectClass('BUSINESS', 1.5)}>Select</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
  );
}

export default ConfirmBookingFlights;