import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import '../../css/Customer/SearchResults.css';

// Hàm fetch danh sách sân bay từ backend
const fetchAirports = async () => {
  const response = await fetch('http://localhost:5000/admin/airports'); 
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sân bay');
  }
  const result = await response.json();
  return result.data || result; 
};


const fetchFlights = async (fromId, toId, departDate) => {
  const query = new URLSearchParams();
  if (fromId) query.append('from', fromId);
  if (toId) query.append('to', toId);
  
  // 1. TẠM TẮT GỬI NGÀY XUỐNG BACKEND
  // Frontend sẽ không ép backend lọc ngày nữa, để backend trả về tất cả chuyến bay từ SGN đi HAN
  // if (departDate) query.append('departDate', departDate); 

  const response = await fetch(`http://localhost:5000/flights/search?${query.toString()}`);
  if (!response.ok) {
    console.error(`Lỗi HTTP: ${response.status} - ${response.statusText}`);
    throw new Error(`Server trả về lỗi: ${response.status}`);
  }

  const result = await response.json();
  if (result.code !== 200 && result.code !== undefined) {
    throw new Error(result.message || 'Lỗi khi tải dữ liệu chuyến bay');
  }
  
  const allFlights = result.data || [];

  // 2. LỌC DỮ LIỆU TRỰC TIẾP TRÊN FRONTEND (JAVASCRIPT)
  if (departDate) {
    return allFlights.filter(flight => {
      // flight.departureTime từ DB trả ra thường có dạng "2026-06-18T06:30:00" hoặc "2026-06-18 06:30:00"
      // Chúng ta chỉ cần cắt 10 ký tự đầu tiên (YYYY-MM-DD) để so sánh với departDate
      const flightDateOnly = flight.departureTime.substring(0, 10);
      return flightDateOnly === departDate;
    });
  }
  
  return allFlights;
};
const SearchResults = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [searchParams] = useSearchParams();

  // 1. Lấy mã Code dạng chữ (SGN, HAN) từ URL params
  const fromCode = searchParams.get('from'); 
  const toCode = searchParams.get('to');
  const departDate = searchParams.get('departDate');

  // 2. Gọi API lấy danh sách sân bay bằng TanStack Query
  const { 
    data: airports = [], 
    isLoading: isLoadingAirports, 
    isError: isErrorAirports 
  } = useQuery({
    queryKey: ['airports'],
    queryFn: fetchAirports,
    staleTime: 5 * 60 * 1000, 
  });

  // 3. MAP ĐỘNG: Tìm ID từ danh sách sân bay vừa tải về
  const fromId = airports.find(a => a.airportCode === fromCode)?.id;
  const toId = airports.find(a => a.airportCode === toCode)?.id;

  // 4. Gọi API lấy dữ liệu chuyến bay
  const { 
    data: flights = [], 
    isLoading: isLoadingFlights, 
    isError: isErrorFlights, 
    error 
  } = useQuery({
    queryKey: ['flights', fromId, toId, departDate], 
    queryFn: () => fetchFlights(fromId, toId, departDate),
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

  // 5. Xử lý các trạng thái hiển thị (Loading / Error) tổng hợp
  if (isLoadingAirports || isLoadingFlights) {
    return <div className="loading-state">Đang tìm kiếm chuyến bay...</div>;
  }

  if (isErrorAirports) {
    return <div className="error-state">Không thể thiết lập danh sách sân bay hệ thống.</div>;
  }

  if (isErrorFlights) {
    return <div className="error-state">{error.message}</div>;
  }

  return (
    <div className="flight-results-container">
      <h3 className="results-title">All flights</h3>
      
      {/* SỬA LỖI 1: Thay !isLoading bằng !isLoadingFlights */}
      {flights.length === 0 && !isLoadingFlights && (
        <div className="no-flights">
          <p>Không tìm thấy chuyến bay nào phù hợp từ {fromCode} đi {toCode} vào ngày {departDate}.</p>
        </div>
      )}

      {flights.map((flight) => {
        // SỬA LỖI 2: Tạo các biến bóc tách an toàn dựa theo cấu trúc JPA Entity
        const currentAirlineName = flight.airplane?.airline?.airlineName || 'Bamboo Airways';
        const currentAirlineLogo = flight.airplane?.airline?.logo || '/default-airline.png';
        const depCode = flight.route?.departureAirport?.airportCode || fromCode;
        const arrCode = flight.route?.arrivalAirport?.airportCode || toCode;
        const airplaneModelName = flight.airplane?.model?.modelName || 'Airbus A320';

        return (
          <div key={flight.id} className="flight-card-wrapper">
            <div className="flight-card">
              {/* Hàng 1: Thông tin chính */}
              <div className="main-info">
                <div className="airline-info">
                  <img src={currentAirlineLogo} alt="logo" className="airline-logo" />
                  <span className="airline-name">{currentAirlineName}</span>
                </div>

                <div className="time-info">
                  <div className="time-block">
                    <strong>{formatTime(flight.departureTime)}</strong>
                    <span>{depCode}</span>
                  </div>
                  <div className="duration-block">
                    <span>{flight.estimateDuration} min</span>
                    <div className="line-path"></div>
                    <span>{flight.flightStops?.length > 0 ? `${flight.flightStops.length} stop` : 'Direct'}</span>
                  </div>
                  <div className="time-block">
                    <strong>{formatTime(flight.arrivalTime)}</strong>
                    <span>{arrCode}</span>
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
                             <strong>{flight.route?.departureAirport?.name || 'Sân bay khởi hành'} ({depCode})</strong>
                             <p>Terminal 1</p>
                          </div>
                       </div>

                       <div className="flight-segment">
                          <div className="segment-info">
                             <img src={currentAirlineLogo} className="small-logo" alt="logo" />
                             <strong>{currentAirlineName} • {flight.flightCode} • Economy</strong>
                             <div className="specs-grid">
                                <span><i className="fa-solid fa-briefcase"></i> Baggage 23 kg</span>
                                <span><i className="fa-solid fa-plug"></i> Power available</span>
                                <span><i className="fa-solid fa-utensils"></i> Free Meal</span>
                                <span><i className="fa-solid fa-plane"></i> {airplaneModelName}</span>
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
                             <strong>{flight.route?.arrivalAirport?.name || 'Sân bay đến'} ({arrCode})</strong>
                             <p>Terminal 2</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SearchResults;