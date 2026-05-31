import React, { useState } from 'react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import '../../css/Customer/TicketInformation.css'; 


function TicketInformation() {
  const location = useLocation();
  const navigate = useNavigate();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const { flight, filters, fromCode, toCode, cabinClass, totalPrice, passengerCount } = location.state || {};

  const [passengers, setPassengers] = useState(
    Array.from({ length: passengerCount || 1 }, () => ({
      fullName: '',
      email: '', 
      documentNumber: '', 
      dateOfBirth: '',
      gender: 'MALE', 
      nationality: 'Vietnam'
    }))
  );

  const [expandedIndexes, setExpandedIndexes] = useState([0]);

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
    setPassengers(updatedPassengers);
  };

  const toggleAccordion = (index) => {
  setExpandedIndexes(prev => {
    if (prev.includes(index)) {
      return prev.filter(i => i !== index);
    }

    return [...prev, index];
  });
};

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo payload để sau này bạn dùng gửi xuống Backend
    const bookingPayload = {
      flightId: flight.id,
      cabinClass: cabinClass,
      passengers: passengers
    };
    console.log("Dữ liệu gửi xuống Backend:", bookingPayload);

    // TẠO FAKE DATA ĐỂ HIỂN THỊ TRANG SUCCESS (Tạm bỏ qua bước gọi API thanh toán)
    // 1. Tạo mã đặt chỗ (PNR) ngẫu nhiên 6 ký tự
    const reservationCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 2. Lấy giờ hiện tại
    const now = new Date();
    const bookingTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    console.log("Cấu trúc chuyến bay:", flight);
    // Chuyển hướng sang trang Success và mang theo dữ liệu
    navigate('/customer/booking-success', {
      state: {
        flight,
        passengers,
        totalPrice,
        reservationCode,
        bookingTime
      }
    });
  };
  if (!flight) return <div>Không tìm thấy thông tin chuyến bay. Vui lòng quay lại.</div>;

  return (
    <div className="booking-page-container">
      <div className="booking-content">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="booking-form-section">
          <h2>Traveler Details</h2>
          <form id="booking-form" onSubmit={handleSubmit}>
            
            {passengers.map((passenger, index) => (
              <div key={index} className="passenger-accordion">
                {/* Tiêu đề Accordion (Click để mở/đóng) */}
                <div 
                  className={`accordion-header ${
  expandedIndexes.includes(index) ? 'active' : ''
}`}
                  onClick={() => toggleAccordion(index)}
                >
                  <h4><i className="fa-solid fa-user"></i> Adult {index + 1}</h4>
                  <i
  className={`fa-solid fa-chevron-${
    expandedIndexes.includes(index) ? 'up' : 'down'
  }`}
></i>
                </div>

                {expandedIndexes.includes(index) && (
                  <div className="accordion-body">
                    <div className="form-alert">
                      <i className="fa-solid fa-triangle-exclamation"></i> 
                      Please input the name exactly as in the travel document.
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. NGUYEN VAN ANH"
                          value={passenger.fullName}
                          onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value.toUpperCase())}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>Gender *</label>
                        <select 
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date of Birth *</label>
                        <input 
                          type="date" 
                          value={passenger.dateOfBirth}
                          onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label>ID Card / Passport Number *</label>
                        <input 
                          type="text" 
                          value={passenger.documentNumber}
                          onChange={(e) => handlePassengerChange(index, 'documentNumber', e.target.value)}
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Nationality</label>
                       <Select
  options={countryOptions}
  value={
    countryOptions.find(
      option => option.label === passenger.nationality
    )
  }
  onChange={(selectedOption) =>
    handlePassengerChange(
      index,
      'nationality',
      selectedOption.label
    )
  }
  placeholder="Select nationality..."
  isSearchable

  menuPortalTarget={document.body}
  menuPosition="fixed"

  styles={{
    menuPortal: base => ({
      ...base,
      zIndex: 9999
    })
  }}
/>
                      </div>
                      <div className="form-group">
                        <label>Email (Optional)</label>
                        <input 
                          type="email" 
                          value={passenger.email}
                          onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button type="submit" className="btn-continue" >Continue to Payment</button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT CHUYẾN BAY (Tương tự ảnh bạn gửi) */}
        <div className="booking-summary-section">
          <div className="summary-card">
            <h3>Flight Summary</h3>
            <div className="route-info">
              <span className="city">{fromCode}</span>
              <i className="fa-solid fa-arrow-right"></i>
              <span className="city">{toCode}</span>
            </div>
            <div className="flight-details-mini">
              <p>Class: <strong>{cabinClass}</strong></p>
              <p>Passengers: <strong>{passengerCount}</strong></p>
            </div>
          </div>

          <div className="summary-card price-card">
            <h3>Price Details</h3>
            <div className="price-row total">
              <span>Total you pay</span>
              <span className="price-amount">
                {new Intl.NumberFormat('vi-VN').format(totalPrice)} VND
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    
  );
}

export default TicketInformation;