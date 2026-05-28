import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import '../../css/Customer/SearchResults.css';

const AIRPORT_ID_MAP = {
  'SGN': 1, // Hồ Chí Minh
  'HAN': 2, // Hà Nội
  'DAD': 3, // Đà Nẵng
  'PQC': 4, // Phú Quốc
  'CXR': 5, // Nha Trang
};

// Tách hàm fetch data ra riêng biệt
const fetchFlights = async (fromId, toId, departDate) => {
  const query = new URLSearchParams();
  if (fromId) query.append('from', fromId);
  if (toId) query.append('to', toId);
  if (departDate) query.append('departDate', departDate);

  const response = await fetch(`http://localhost:3000/customer/flight-results??${query.toString()}`);
  if (!response.ok) {
    throw new Error('Không thể kết nối đến server.');
  }

  const result = await response.json();
  if (result.code !== 200 && result.code !== undefined) {
    throw new Error(result.message || 'Lỗi khi tải dữ liệu chuyến bay');
  }
  
  return result.data || [];
};

const SearchResults = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [searchParams] = useSearchParams();

  // Lấy params từ URL
  const fromCode = searchParams.get('from'); 
  const toCode = searchParams.get('to');
  const departDate = searchParams.get('departDate');
  
  const fromId = AIRPORT_ID_MAP[fromCode]; 
  const toId = AIRPORT_ID_MAP[toCode];

  // Sử dụng TanStack Query để lấy dữ liệu
  const { 
    data: flights = [], 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['flights', fromId, toId, departDate], // Đặt key để cache data
    queryFn: () => fetchFlights(fromId, toId, departDate),
    // Tùy chọn: Chỉ gọi API nếu đã map thành công ID
    enabled: !!fromId && !!toId, 
  });

  const toggleDetails = (id) => {
    setShowDetails(showDetails === id ? null : id);
  };

  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // React Query tự động cập nhật các state này cho bạn
  if (isLoading) return <div className="loading-state">Đang tìm kiếm chuyến bay...</div>;
  if (isError) return <div className="error-state">{error.message}</div>;

  return (
    <div className="flight-results-container">
      <h3 className="results-title">All flights</h3>
      
      {flights.length === 0 && !isLoading && (
        <p>Không tìm thấy chuyến bay nào phù hợp.</p>
      )}

      {flights.map((flight) => (
        <div key={flight.id} className="flight-card-wrapper">
          <div className="flight-card">
            {/* Hàng 1: Thông tin chính */}
            <div className="main-info">
              <div className="airline-info">
                <img src={flight.airlineLogo || '/default-airline.png'} alt="logo" className="airline-logo" />
                <span className="airline-name">{flight.airlineName || 'Masupilami Airway'}</span>
              </div>

              <div className="time-info">
                <div className="time-block">
                  <strong>{formatTime(flight.departureTime)}</strong>
                  <span>{flight.route?.departureAirportCode || 'SGN'}</span>
                </div>
                <div className="duration-block">
                  <span>{flight.estimateDuration} min</span>
                  <div className="line-path"></div>
                  <span>{flight.flightStops?.length > 0 ? `${flight.flightStops.length} stop` : 'Direct'}</span>
                </div>
                <div className="time-block">
                  <strong>{formatTime(flight.arrivalTime)}</strong>
                  <span>{flight.route?.arrivalAirportCode || 'HAN'}</span>
                </div>
              </div>

              <div className="price-info">
                <p className="save-tag"><i className="fa-solid fa-percent"></i> Tiết kiệm 10%</p>
                <h3 className="price-text">{formatPrice(flight.basePrice)} VND<span>/pax</span></h3>
                <button className="btn-choose">Choose</button>
              </div>
            </div>

            {/* Hàng 2: Tiện ích & Ưu đãi */}
            <div className="extra-info">
               <div className="amenities">
                  <span><i className="fa-solid fa-briefcase"></i> 23kg</span>
                  <span><i className="fa-solid fa-utensils"></i></span>
                  <span><i className="fa-solid fa-film"></i></span>
               </div>
               <div className="promo-tags">
                  <span className="tag">MASUPILAMI up to 300K OFF</span>
                  <span className="tag">Holiday Deals</span>
               </div>
            </div>

            {/* Nút bấm xem chi tiết */}
            <div 
                className={`details-toggle ${showDetails === flight.id ? 'active' : ''}`} 
                onClick={() => toggleDetails(flight.id)}
                >
            Flight Details 
            </div>
          </div>

          {/* PHẦN CHI TIẾT (FLIGHT DETAILS) */}
          {showDetails === flight.id && (
            <div className="flight-details-panel">
               <div className="details-content">
                  <div className="timeline">
                     <div className="time-point">
                        <div className="time-col">
                           <strong>{formatTime(flight.departureTime)}</strong>
                           <small>Khởi hành</small>
                        </div>
                        <div className="dot-line">
                           <div className="circle-outline"></div>
                           <div className="vertical-line"></div>
                        </div>
                        <div className="info-col">
                           <strong>{flight.route?.departureCity || 'Ho Chi Minh City'} ({flight.route?.departureAirportCode || 'SGN'})</strong>
                           <p>Terminal 3</p>
                        </div>
                     </div>

                     <div className="flight-segment">
                        <div className="segment-info">
                           <img src={flight.airlineLogo || '/default-airline.png'} className="small-logo" alt="logo" />
                           <strong>{flight.airlineName || 'Masupilami Airway'} • {flight.flightCode} • Economy</strong>
                           <div className="specs-grid">
                              <span><i className="fa-solid fa-briefcase"></i> Baggage 23 kg</span>
                              <span><i className="fa-solid fa-plug"></i> Power not available</span>
                              <span><i className="fa-solid fa-utensils"></i> Free Meal</span>
                              <span><i className="fa-solid fa-plane"></i> {flight.airplane?.model || 'Airbus A321'}</span>
                           </div>
                        </div>
                     </div>

                     <div className="time-point">
                        <div className="time-col">
                           <strong>{formatTime(flight.arrivalTime)}</strong>
                           <small>Đến nơi</small>
                        </div>
                        <div className="dot-line">
                           <div className="circle-fill"></div>
                        </div>
                        <div className="info-col">
                           <strong>{flight.route?.arrivalCity || 'Hanoi'} ({flight.route?.arrivalAirportCode || 'HAN'})</strong>
                           <p>Noibai International Airport</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SearchResults;