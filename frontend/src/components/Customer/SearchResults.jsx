import React, { useState, useRef } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import '../../css/Customer/SearchResults.css';

import Navbar from '../Homepage/Navbar';
import Footer from '../Homepage/Footer';
import Banner from '../Homepage/Banner';
import Filter from './Filter';
import AirportPicker from '../Picker/AirportPicker';
// THÊM DÒNG IMPORT NÀY ĐỂ TRÁNH LỖI NOT DEFINED
import ConfirmBookingFlights from './ConfirmBookingFlights';

// Toast thông báo lỗi/thành công cho người dùng
function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const isError = type === 'error';
  return (
    <div
      style={{
        position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999, display: 'flex', alignItems: 'center', gap: '12px',
        padding: '12px 16px', borderRadius: '12px', color: '#fff',
        fontSize: '14px', fontWeight: 500, minWidth: '280px', maxWidth: '90vw',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        backgroundColor: isError ? '#DC2626' : '#16A34A',
      }}
    >
      <span style={{ flex: 1 }}>{msg}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.7 }}>✕</button>
    </div>
  );
}

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
  // Quy định: chỉ hiển thị chuyến còn đủ chỗ cho số khách yêu cầu
  const numPassengers = parseInt(filters.passengers, 10) || 1;
  query.append('passengers', numPassengers);

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
      const stops = flight.stops?.length || 0;
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

  // Phòng thủ: ẩn chuyến không còn đủ chỗ (chỉ áp dụng khi backend trả availableSeats)
  allFlights = allFlights.filter(f => f.availableSeats == null || f.availableSeats >= numPassengers);

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
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  return `${days[date.getDay()]}, ${date.getDate()} Thg ${date.getMonth() + 1}`;
};

const cabinClassLabel = (cabinClass) => {
  if (cabinClass === 'business') return 'Thương gia';
  if (cabinClass === 'first-class') return 'Hạng nhất';
  return 'Phổ thông';
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
  const navigate = useNavigate();
  const location = useLocation();

  const [toast, setToast] = useState({ msg: '', type: 'error' });
  const showToast = (msg, type = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type }), 3000);
  };

  // Khi click "Chọn": yêu cầu đăng nhập, nếu chưa thì chuyển sang trang đăng nhập
  const handleChoose = (flight) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      showToast('Vui lòng đăng nhập để chọn chuyến bay này!');
      navigate('/signin', { state: { from: location } });
      return;
    }
    setSelectedTicket(flight);
  };

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

  const fromAirport = airports.find(a => a.airportCode === fromCode);
  const toAirport = airports.find(a => a.airportCode === toCode);
  const fromId = fromAirport?.id;
  const toId = toAirport?.id;

  // Đổi lại tuyến bay khi bấm vào kính lúp
  const [showSearchEdit, setShowSearchEdit] = useState(false);
  const [editFrom, setEditFrom] = useState(null);
  const [editTo, setEditTo] = useState(null);

  const toggleSearchEdit = () => {
    setEditFrom(fromAirport || null);
    setEditTo(toAirport || null);
    setShowSearchEdit(prev => !prev);
  };

  const applySearchEdit = () => {
    if (!editFrom || !editTo) {
      showToast('Vui lòng chọn cả điểm đi và điểm đến!');
      return;
    }
    if (editFrom.airportCode === editTo.airportCode) {
      showToast('Điểm đi và điểm đến không được trùng nhau!');
      return;
    }
    setSearchParams(prev => {
      prev.set('from', editFrom.airportCode);
      prev.set('to', editTo.airportCode);
      return prev;
    });
    setShowSearchEdit(false);
  };

  const handleSwapEdit = () => {
    setEditFrom(editTo);
    setEditTo(editFrom);
  };

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
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: toast.type })} />
      <Navbar />
      <Banner />

      <div className="search-page-layout">
        
        <div className="filter-sidebar">
          <Filter />
        </div>

        <div className="flight-results-container">
          
          <div className="search-header-widget">
            <div className="search-header-bg"></div>
            <div className="search-pill">
              <div className="pill-content">
                 <div className="pill-title">{fromCode} <i className="fa-solid fa-arrow-right"></i> {toCode}</div>

                 <div className="pill-subtitle">
                    {filters.departDate ? formatDisplayDate(new Date(filters.departDate)) : ''} |
                    {' '}<strong style={{color: '#ff5e1f'}}>{filters.passengers}</strong> hành khách |
                    {' '}<span>{cabinClassLabel(filters.cabinClass)}</span>
                 </div>
              </div>
              <button className="pill-search-btn" onClick={toggleSearchEdit} title="Đổi tuyến bay">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>

            {showSearchEdit && (
              <div className="search-edit-panel">
                <div className="search-edit-field">
                  <span className="search-edit-label">Điểm đi</span>
                  <AirportPicker
                    label="Chọn điểm đi"
                    selectedAirport={editFrom}
                    onSelect={setEditFrom}
                  />
                </div>
                <button className="search-edit-swap" onClick={handleSwapEdit} title="Đảo chiều">
                  <i className="fa-solid fa-right-left"></i>
                </button>
                <div className="search-edit-field">
                  <span className="search-edit-label">Điểm đến</span>
                  <AirportPicker
                    label="Chọn điểm đến"
                    selectedAirport={editTo}
                    onSelect={setEditTo}
                  />
                </div>
                <button className="search-edit-apply" onClick={applySearchEdit}>
                  <i className="fa-solid fa-magnifying-glass"></i> Tìm kiếm
                </button>
              </div>
            )}

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
                    <div className="date-price">Xem giá</div>
                  </div>
                );
              })}
              
              <div className="calendar-btn" onClick={handleOpenCalendar}>
                <i className="fa-regular fa-calendar"></i>
                <span>Lịch</span>
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

          <h3 className="results-title">Tất cả chuyến bay</h3>
          
          {isLoadingFlights ? (
             <div className="loading-state">Đang tìm kiếm chuyến bay...</div>
          ) : flights.length === 0 ? (
            <div className="no-flights">
              <p>Không tìm thấy chuyến bay nào phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            flights.map((flight) => {
              const currentAirlineName = flight.airlineName || 'Hãng hàng không';
              const currentAirlineLogo = flight.airlineLogo || '/default-airline.png';
              const depCode = flight.departureAirportCode || fromCode;
              const arrCode = flight.arrivalAirportCode || toCode;

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
                          <span>{flight.estimateDuration} phút</span>
                          <div className="line-path"></div>
                          <span>{flight.stops?.length > 0 ? `${flight.stops.length} điểm dừng` : 'Bay thẳng'}</span>
                        </div>
                        <div className="time-block">
                          <strong>{formatTime(flight.arrivalTime)}</strong>
                          <span>{arrCode}</span>
                        </div>
                      </div>

                      <div className="price-info">
                         <h3 className="price-text">
                            {formatPrice(totalPrice)} VND
                            <span>{passengerCount > 1 ? ` / ${passengerCount} khách` : '/khách'}</span>
                         </h3>

                         <button className="btn-choose" onClick={() => handleChoose(flight)}>Chọn</button>
                         {flight.availableSeats != null && (
                           <span
                             style={{
                               display: 'block',
                               marginTop: 6,
                               fontSize: 12,
                               fontWeight: 600,
                               color: flight.availableSeats <= 5 ? '#dc2626' : '#16a34a',
                             }}
                           >
                             {flight.availableSeats <= 5
                               ? `Chỉ còn ${flight.availableSeats} chỗ!`
                               : `Còn ${flight.availableSeats} chỗ`}
                           </span>
                         )}
                      </div>
                    </div>

                    <div
                        className={`details-toggle ${showDetails === flight.id ? 'active' : ''}`}
                        onClick={() => toggleDetails(flight.id)}
                        >
                    Chi tiết chuyến bay
                    </div>
                  </div>

                  {showDetails === flight.id && (
                    <div className="flight-details-panel">
                       <div className="details-content">
                          <div className="fd-timeline">
                             {/* Điểm khởi hành */}
                             <div className="fd-row">
                                <div className="fd-time">
                                   <strong>{formatTime(flight.departureTime)}</strong>
                                   <small>Khởi hành</small>
                                </div>
                                <div className="fd-marker">
                                   <div className="fd-dot"></div>
                                   <div className="fd-line"></div>
                                </div>
                                <div className="fd-body">
                                   <strong>{flight.departureCity || 'Sân bay khởi hành'} ({depCode})</strong>
                                   <div className="fd-airline">
                                      <img src={currentAirlineLogo} alt="logo" />
                                      {currentAirlineName} • {flight.flightCode}
                                   </div>
                                </div>
                             </div>

                             {/* Các sân bay dừng */}
                             {(flight.stops || []).map((stop) => (
                                <div className="fd-row" key={stop.stopOrder}>
                                   <div className="fd-time">
                                      <strong>{formatTime(stop.arrivalTime)}</strong>
                                      <small>Điểm dừng</small>
                                   </div>
                                   <div className="fd-marker">
                                      <div className="fd-dot stop"></div>
                                      <div className="fd-line"></div>
                                   </div>
                                   <div className="fd-body">
                                      <strong>{stop.stopCity || stop.stopAirportName || 'Sân bay dừng'} ({stop.stopAirportCode})</strong>
                                      {stop.stopAirportName && stop.stopCity && (
                                         <p className="fd-sub">{stop.stopAirportName}</p>
                                      )}
                                      {stop.stopDuration > 0 && (
                                         <div className="fd-layover">Thời gian dừng: {stop.stopDuration} phút</div>
                                      )}
                                   </div>
                                </div>
                             ))}

                             {/* Điểm đến */}
                             <div className="fd-row">
                                <div className="fd-time">
                                   <strong>{formatTime(flight.arrivalTime)}</strong>
                                   <small>Đến nơi</small>
                                </div>
                                <div className="fd-marker">
                                   <div className="fd-dot filled"></div>
                                </div>
                                <div className="fd-body">
                                   <strong>{flight.arrivalCity || 'Sân bay đến'} ({arrCode})</strong>
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