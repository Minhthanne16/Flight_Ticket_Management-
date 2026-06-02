import React, { useEffect, useState } from 'react';
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
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[date.getDay()]}, ${date.getDate()} Thg ${date.getMonth() + 1}`;
};

function ConfirmBookingFlights({ flight, onClose, fromCode, toCode, filters }) {
  const navigate = useNavigate();
  const [ticketClasses, setTicketClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;
    fetch('http://localhost:5000/admin/ticket-classes')
      .then(res => {
        if (!res.ok) throw new Error(`Server trả về lỗi: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : (data?.data || []);
        // Sắp xếp theo hệ số giá tăng dần
        list.sort((a, b) => Number(a.priceMultiplier ?? 1) - Number(b.priceMultiplier ?? 1));
        setTicketClasses(list);
      })
      .catch(() => { if (mounted) setLoadError('Không thể tải danh sách hạng vé. Vui lòng thử lại sau.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (!flight) return null;
  const passengerCount = parseInt(filters.passengers, 10) || 1;

  const handleSelectClass = (ticketClass) => {
    const multiplier = Number(ticketClass.priceMultiplier ?? 1);
    const finalPrice = Number(flight.basePrice) * multiplier * passengerCount;

    navigate('/customer/booking-details', {
      state: {
        flight,
        filters,
        fromCode,
        toCode,
        cabinClass: ticketClass.className,
        ticketClassId: ticketClass.id,
        baggageAllowanceKg: ticketClass.baggageAllowanceKg,
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
          <h3><i className="fa-solid fa-plane-departure"></i> Chọn hạng vé</h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="modal-body">
  <div className="selected-flight-summary">
    {/* Phần Header */}
    <div className="summary-header">
      <div className="header-left">
        <strong>Chuyến đi</strong>
      </div>
      <span className="summary-date">
        {filters.departDate ? formatDisplayDate(new Date(filters.departDate)) : ''}
      </span>
    </div>

    {/* Phần Details (Sẽ áp dụng lưới Grid 4 cột) */}
    <div className="summary-details">
  <div className="summary-logo">
    <img src={flight.airlineLogo || '/default-airline.png'} alt="logo" className="modal-airline-logo" />
  </div>

  <div className="summary-time">
    <strong>{formatTime(flight.departureTime)}</strong>
    {/* Thêm class mới để tạo khung xám bo góc */}
    <span className="airport-code-box">{fromCode}</span>
  </div>

  {/* Trục đường bay theo style mới */}
  <div className="summary-route">
    <div className="route-duration">
      {Math.floor(flight.estimateDuration / 60)}h {flight.estimateDuration % 60}m
    </div>
    <div className="route-line-container">
      <div className="route-line"></div>
      <div className="route-type">Bay thẳng</div>
    </div>
  </div>

  <div className="summary-time">
    <strong>{formatTime(flight.arrivalTime)}</strong>
    <span className="airport-code-box">{toCode}</span>
  </div>
</div>
  </div>


         
          {loading ? (
            <div className="loading-state">Đang tải hạng vé...</div>
          ) : loadError ? (
            <div className="error-state" style={{ color: '#DC2626', padding: '16px', textAlign: 'center' }}>{loadError}</div>
          ) : ticketClasses.length === 0 ? (
            <div className="no-flights">Chưa có hạng vé nào trong hệ thống.</div>
          ) : (
            <div className="ticket-options-grid">
              {ticketClasses.map((tc) => {
                const multiplier = Number(tc.priceMultiplier ?? 1);
                const classPrice = Number(flight.basePrice) * multiplier * passengerCount;
                return (
                  <div key={tc.id} className="ticket-option-card">
                    <h4>{tc.className}</h4>
                    {tc.description && <p className="ticket-class-desc">{tc.description}</p>}
                    <h2 className="modal-price">
                      {formatPrice(classPrice)} VND
                      <small>/ {passengerCount} khách</small>
                    </h2>
                    <ul className="modal-amenities">
                      <li><i className="fa-solid fa-suitcase-rolling"></i> Hành lý ký gửi {tc.baggageAllowanceKg} kg</li>
                    </ul>
                    <button className="btn-select-final" onClick={() => handleSelectClass(tc)}>Chọn</button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default ConfirmBookingFlights;