import React, { useState, useRef } from 'react';
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

  if (departDate) {
    return allFlights.filter(flight => {
      const flightDateOnly = flight.departureTime.substring(0, 10);
      return flightDateOnly === departDate;
    });
  }
  
  return allFlights;
};

// --- HÀM TIỆN ÍCH XỬ LÝ NGÀY THÁNG ---
const generateDateRange = (startDateStr, numDays = 5) => {
  const dates = [];
  const startDate = startDateStr ? new Date(startDateStr) : new Date();
  
  for (let i = 0; i < numDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    dates.push(d);
  }
  return dates;
};

const formatDisplayDate = (date) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

const formatUrlDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
// ------------------------------------

const SearchResults = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Khởi tạo ref cho input chọn ngày
  const dateInputRef = useRef(null);

  const fromCode = searchParams.get('from'); 
  const toCode = searchParams.get('to');
  const departDate = searchParams.get('departDate');

  // Khởi tạo ngày gốc cho mảng 5 ngày
  const [baseDate, setBaseDate] = useState(departDate || formatUrlDate(new Date()));

  const { data: airports = [], isLoading: isLoadingAirports, isError: isErrorAirports } = useQuery({
    queryKey: ['airports'],
    queryFn: fetchAirports,
    staleTime: 5 * 60 * 1000, 
  });

  const fromId = airports.find(a => a.airportCode === fromCode)?.id;
  const toId = airports.find(a => a.airportCode === toCode)?.id;

  const { data: flights = [], isLoading: isLoadingFlights, isError: isErrorFlights, error } = useQuery({
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

  // Hàm khi bấm vào 1 trong 5 ngày trên thanh
  const handleDateChange = (newDateStr) => {
    if (!newDateStr) return;
    searchParams.set('departDate', newDateStr);
    setSearchParams(searchParams);
  };

  // Hàm dành riêng cho nút Calendar (Đẩy ngày được chọn lên đầu)
  const handleCalendarPick = (newDateStr) => {
    if (!newDateStr) return;
    setBaseDate(newDateStr); 
    searchParams.set('departDate', newDateStr); 
    setSearchParams(searchParams);
  };

  // Hàm kích hoạt mở Calendar
  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (error) {
        dateInputRef.current.focus();
      }
    }
  };

  if (isLoadingAirports || isLoadingFlights) {
    return <div className="loading-state">Đang tìm kiếm chuyến bay...</div>;
  }

  if (isErrorAirports) {
    return <div className="error-state">Không thể thiết lập danh sách sân bay hệ thống.</div>;
  }

  if (isErrorFlights) {
    return <div className="error-state">{error.message}</div>;
  }

  // Sinh mảng 5 ngày
  const dateList = generateDateRange(baseDate, 5);

  return (
    <div className="flight-results-container">
      <div className="search-header-widget">
        <div className="search-pill">
          <div className="pill-content">
             <div className="pill-title">{fromCode} <i className="fa-solid fa-arrow-right"></i> {toCode}</div>
             <div className="pill-subtitle">
                {departDate ? formatDisplayDate(new Date(departDate)) : ''} | 1 passenger(s) | Economy
             </div>
          </div>
          <button className="pill-search-btn">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>

        <div className="date-selector-bar">
          {dateList.map((dateObj) => {
            const dateString = formatUrlDate(dateObj);
            const isActive = dateString === departDate;
            
            return (
              <div 
                key={dateString} 
                className={`date-item ${isActive ? 'active' : ''}`}
                onClick={() => handleDateChange(dateString)}
              >
                <div className="date-label">{formatDisplayDate(dateObj)}</div>
                <div className="date-price">Tìm giá</div> 
              </div>
            );
          })}
          
          {/* Vùng Calendar đã được sửa để click mở đúng */}
          <div className="calendar-btn" onClick={handleOpenCalendar}>
            <i className="fa-regular fa-calendar"></i>
            <span>Calendar</span>
            <input 
              type="date" 
              ref={dateInputRef}
              className="hidden-date-picker" 
              value={departDate || ''}
              onChange={(e) => handleCalendarPick(e.target.value)}
            />
          </div>
        </div>
      </div>

      <h3 className="results-title">All flights</h3>
      
      {flights.length === 0 && !isLoadingFlights && (
        <div className="no-flights">
          <p>Không tìm thấy chuyến bay nào phù hợp từ {fromCode} đi {toCode} vào ngày {departDate}.</p>
        </div>
      )}

      {flights.map((flight) => {
        const currentAirlineName = flight.airplane?.airline?.airlineName || 'Bamboo Airways';
        const currentAirlineLogo = flight.airplane?.airline?.logo || '/default-airline.png';
        const depCode = flight.route?.departureAirport?.airportCode || fromCode;
        const arrCode = flight.route?.arrivalAirport?.airportCode || toCode;
        const airplaneModelName = flight.airplane?.model?.modelName || 'Airbus A320';

        return (
          <div key={flight.id} className="flight-card-wrapper">
            <div className="flight-card">
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

              <div 
                  className={`details-toggle ${showDetails === flight.id ? 'active' : ''}`} 
                  onClick={() => toggleDetails(flight.id)}
                  >
              Flight Details 
              </div>
            </div>

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