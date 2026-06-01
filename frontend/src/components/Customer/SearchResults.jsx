import React, { useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import '../../css/Customer/SearchResults.css';

import Navbar from '../Homepage/Navbar'; 
import Footer from '../Homepage/Footer';
import Banner from '../Homepage/Banner';
import Filter from './Filter'; 
// THÊM DÒNG IMPORT NÀY ĐỂ TRÁNH LỖI NOT DEFINED
import ConfirmBookingFlights from './ConfirmBookingFlights'; 

const fetchAirports = async () => {
  const response = await fetch('http://localhost:5000/admin/airports'); 
  if (!response.ok) {
    throw new Error('Không thể tải danh sách sân bay');
  }
  const result = await response.json();
  return result.data || result; 
};

const fetchFlights = async (fromId, toId, filters) => {
  const query = new URLSearchParams();
  if (fromId) query.append('from', fromId);
  if (toId) query.append('to', toId);
  
  const response = await fetch(`http://localhost:5000/flights/search?${query.toString()}`);
  if (!response.ok) {
    throw new Error(`Server trả về lỗi: ${response.status}`);
  }

  const result = await response.json();
  if (result.code !== 200 && result.code !== undefined) {
    throw new Error(result.message || 'Lỗi khi tải dữ liệu chuyến bay');
  }

  let allFlights = result.data || [];

  if (filters.departDate) {
    allFlights = allFlights.filter(flight => {
      const flightDateOnly = flight.departureTime.substring(0, 10);
      return flightDateOnly === filters.departDate;
    });
  }

  if (filters.transit) {
    allFlights = allFlights.filter(flight => {
      const stops = flight.flightStops?.length || 0;
      if (filters.transit === 'direct') return stops === 0;
      if (filters.transit === '1-transit') return stops === 1;
      if (filters.transit === '2-transit') return stops === 2;
      return true;
    });
  }

  if (filters.time) {
    allFlights = allFlights.filter(flight => {
      const hour = new Date(flight.departureTime).getHours();
      if (filters.time === 't1') return hour >= 0 && hour < 6;
      if (filters.time === 't2') return hour >= 6 && hour < 12;
      if (filters.time === 't3') return hour >= 12 && hour < 18;
      if (filters.time === 't4') return hour >= 18 && hour < 24;
      return true;
    });
  }

  return allFlights;
};

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

const SearchResults = () => {
  const [showDetails, setShowDetails] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const dateInputRef = useRef(null);

  const fromCode = searchParams.get('from'); 
  const toCode = searchParams.get('to');
  
  const filters = {
    departDate: searchParams.get('departDate'),
    transit: searchParams.get('transit'),
    time: searchParams.get('time'),
    cabinClass: searchParams.get('cabinClass') || 'economy', 
    passengers: searchParams.get('passengers') || '1'
  };

  const [baseDate, setBaseDate] = useState(filters.departDate || formatUrlDate(new Date()));

  const { data: airports = [], isLoading: isLoadingAirports, isError: isErrorAirports } = useQuery({
    queryKey: ['airports'],
    queryFn: fetchAirports,
    staleTime: 5 * 60 * 1000, 
  });

  const fromId = airports.find(a => a.airportCode === fromCode)?.id;
  const toId = airports.find(a => a.airportCode === toCode)?.id;

  const { data: flights = [], isLoading: isLoadingFlights, isError: isErrorFlights, error } = useQuery({
    queryKey: ['flights', fromId, toId, filters], 
    queryFn: () => fetchFlights(fromId, toId, filters),
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

  // Cập nhật searchParams chuẩn xác hơn
  const updateDateInUrl = (newDateStr) => {
    if (!newDateStr) return;
    setSearchParams(prev => {
      prev.set('departDate', newDateStr);
      return prev;
    });
  };

  const handleDateChange = (newDateStr) => {
    updateDateInUrl(newDateStr);
  };

  const handleCalendarPick = (newDateStr) => {
    setBaseDate(newDateStr); 
    updateDateInUrl(newDateStr);
  };

  const handleOpenCalendar = () => {
    if (dateInputRef.current) {
      try {
        dateInputRef.current.showPicker();
      } catch (error) {
        dateInputRef.current.focus();
      }
    }
  };

  if (isLoadingAirports) {
    return <div className="loading-state">Đang thiết lập dữ liệu chuyến bay...</div>;
  }

  if (isErrorAirports) {
    return <div className="error-state">Không thể thiết lập danh sách sân bay hệ thống.</div>;
  }

  if (isErrorFlights) {
    return <div className="error-state">{error.message}</div>;
  }

  const dateList = generateDateRange(baseDate, 5);

  return (
    <>
      <Navbar />
      <Banner />

      <div className="search-page-layout">
        
        <div className="filter-sidebar">
          <Filter />
        </div>

        <div className="flight-results-container">
          
          <div className="search-header-widget">
            <div className="search-pill">
              <div className="pill-content">
                 <div className="pill-title">{fromCode} <i className="fa-solid fa-arrow-right"></i> {toCode}</div>
                 
                 <div className="pill-subtitle">
                    {filters.departDate ? formatDisplayDate(new Date(filters.departDate)) : ''} | 
                    {' '}<strong style={{color: '#ff5e1f'}}>{filters.passengers}</strong> passenger(s) | 
                    {' '}<span style={{textTransform: 'capitalize'}}>
                       {filters.cabinClass === 'economy' ? 'Economy' : 'Business Class'}
                    </span>
                 </div>
              </div>
              <button className="pill-search-btn">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            <div className="date-selector-bar">
              {dateList.map((dateObj) => {
                const dateString = formatUrlDate(dateObj);
                const isActive = dateString === filters.departDate;
                
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
              
              <div className="calendar-btn" onClick={handleOpenCalendar}>
                <i className="fa-regular fa-calendar"></i>
                <span>Calendar</span>
                <input 
                  type="date" 
                  ref={dateInputRef}
                  className="hidden-date-picker" 
                  value={filters.departDate || ''}
                  onChange={(e) => handleCalendarPick(e.target.value)}
                />
              </div>
            </div>
          </div>

          <h3 className="results-title">All flights</h3>
          
          {isLoadingFlights ? (
             <div className="loading-state">Đang tìm kiếm chuyến bay...</div>
          ) : flights.length === 0 ? (
            <div className="no-flights">
              <p>Không tìm thấy chuyến bay nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            flights.map((flight) => {
              const currentAirlineName = flight.airplane?.airline?.airlineName || 'Bamboo Airways';
              const currentAirlineLogo = flight.airplane?.airline?.logo || '/default-airline.png';
              const depCode = flight.route?.departureAirport?.airportCode || fromCode;
              const arrCode = flight.route?.arrivalAirport?.airportCode || toCode;
              const airplaneModelName = flight.airplane?.model?.modelName || 'Airbus A320';

              const passengerCount = parseInt(filters.passengers, 10) || 1;
              const totalPrice = flight.basePrice * passengerCount;

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
                         
                         <h3 className="price-text">
                            {formatPrice(totalPrice)} VND
                            <span>{passengerCount > 1 ? ` / ${passengerCount} pax` : '/pax'}</span>
                         </h3>
                         
                         <button className="btn-choose" onClick={() => setSelectedTicket(flight)}>Choose</button>
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
            })
          )}
        </div>
      </div>
      
      {selectedTicket && (
        <ConfirmBookingFlights
          flight={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          fromCode={fromCode}
          toCode={toCode}
          filters={filters}
        />
      )}
      
      <Footer />
    </>
  );
};

export default SearchResults;