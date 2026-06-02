import React, { useState } from 'react';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { voucherService } from '../../api/services/voucherService';
import '../../css/Customer/TicketInformation.css';

const formatDateTime = (value) => {
  if (!value) return '';
  const d = new Date(value);
  const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${hh}:${mm} • ${days[d.getDay()]}, ${d.getDate()} Thg ${d.getMonth() + 1}`;
};

function TicketInformation() {
  const location = useLocation();
  const navigate = useNavigate();
  const countryOptions = useMemo(() => countryList().getData(), []);
  const { flight, filters, fromCode, toCode, cabinClass, ticketClassId, baggageAllowanceKg, totalPrice, passengerCount } = location.state || {};

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

  // Voucher giảm giá
  const [voucherInput, setVoucherInput] = useState('');
  const [voucher, setVoucher] = useState(null); // { code, discount, finalAmount }
  const [voucherErr, setVoucherErr] = useState('');
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  const finalTotal = voucher ? voucher.finalAmount : totalPrice;

  const handleApplyVoucher = async () => {
    const code = voucherInput.trim();
    if (!code) { setVoucherErr('Vui lòng nhập mã giảm giá.'); return; }
    setApplyingVoucher(true);
    setVoucherErr('');
    try {
      const res = await voucherService.preview({ voucherCode: code, amount: totalPrice });
      const data = res.data?.data || res.data;
      setVoucher({ code: code.toUpperCase(), discount: Number(data.discount), finalAmount: Number(data.finalAmount) });
    } catch (e) {
      setVoucher(null);
      setVoucherErr(e?.response?.data?.message || 'Mã giảm giá không hợp lệ.');
    } finally {
      setApplyingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setVoucher(null);
    setVoucherInput('');
    setVoucherErr('');
  };

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

    // Chuyển sang trang thanh toán VietQR, mang theo toàn bộ dữ liệu đặt vé
    navigate('/customer/payment', {
      state: {
        flight,
        filters,
        fromCode,
        toCode,
        cabinClass,
        ticketClassId,
        baggageAllowanceKg,
        totalPrice,
        finalTotal,
        voucherCode: voucher ? voucher.code : null,
        discount: voucher ? voucher.discount : 0,
        passengerCount,
        passengers
      }
    });
  };
  if (!flight) return <div>Không tìm thấy thông tin chuyến bay. Vui lòng quay lại.</div>;

  return (
    <div className="booking-page-container">
      <div className="booking-content">
        {/* CỘT TRÁI: FORM ĐIỀN THÔNG TIN */}
        <div className="booking-form-section">
          <h2>Thông tin hành khách</h2>
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
                  <h4><i className="fa-solid fa-user"></i> Hành khách {index + 1}</h4>
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
                      Vui lòng nhập họ tên chính xác như trên giấy tờ tùy thân.
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Họ và tên *</label>
                        <input
                          type="text"
                          placeholder="VD: NGUYEN VAN ANH"
                          value={passenger.fullName}
                          onChange={(e) => handlePassengerChange(index, 'fullName', e.target.value.toUpperCase())}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Giới tính *</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                        >
                          <option value="MALE">Nam</option>
                          <option value="FEMALE">Nữ</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Ngày sinh *</label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => handlePassengerChange(index, 'dateOfBirth', e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>CCCD / Số hộ chiếu *</label>
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
                        <label>Quốc tịch</label>
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
  placeholder="Chọn quốc tịch..."
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
                        <label>Email (Không bắt buộc)</label>
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

            <button type="submit" className="btn-continue" >Xác nhận đặt vé</button>
          </form>
        </div>

        {/* CỘT PHẢI: TÓM TẮT CHUYẾN BAY */}
        <div className="booking-summary-section">
          <div className="summary-card">
            <h3>Tóm tắt chuyến bay</h3>
            <div className="route-info">
              <span className="city">{fromCode}</span>
              <i className="fa-solid fa-arrow-right"></i>
              <span className="city">{toCode}</span>
            </div>
            <div className="flight-details-mini">
              {flight?.airlineName && (
                <p>Hãng bay: <strong>{flight.airlineName}</strong></p>
              )}
              {flight?.flightCode && (
                <p>Số hiệu: <strong>{flight.flightCode}</strong></p>
              )}
              {flight?.departureTime && (
                <p>Khởi hành: <strong>{formatDateTime(flight.departureTime)}</strong></p>
              )}
              <p>Hạng vé: <strong>{cabinClass}</strong></p>
              {(baggageAllowanceKg ?? null) !== null && (
                <p>Hành lý ký gửi: <strong>{baggageAllowanceKg} kg</strong></p>
              )}
              <p>Số hành khách: <strong>{passengerCount}</strong></p>
            </div>
          </div>

          {/* Mã giảm giá */}
          <div className="summary-card voucher-card">
            <h3>Mã giảm giá</h3>
            {voucher ? (
              <div className="voucher-applied">
                <div>
                  <i className="fa-solid fa-circle-check"></i> Đã áp dụng <strong>{voucher.code}</strong>
                  <p>Giảm {new Intl.NumberFormat('vi-VN').format(voucher.discount)} VND</p>
                </div>
                <button type="button" className="voucher-remove" onClick={handleRemoveVoucher}>Bỏ</button>
              </div>
            ) : (
              <>
                <div className="voucher-input-row">
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={voucherInput}
                    onChange={(e) => setVoucherInput(e.target.value.toUpperCase())}
                  />
                  <button type="button" onClick={handleApplyVoucher} disabled={applyingVoucher}>
                    {applyingVoucher ? '...' : 'Áp dụng'}
                  </button>
                </div>
                {voucherErr && <p className="voucher-error">{voucherErr}</p>}
              </>
            )}
          </div>

          <div className="summary-card price-card">
            <h3>Chi tiết giá</h3>
            <div className="price-row">
              <span>Tạm tính</span>
              <span>{new Intl.NumberFormat('vi-VN').format(totalPrice)} VND</span>
            </div>
            {voucher && (
              <div className="price-row discount">
                <span>Giảm giá</span>
                <span>- {new Intl.NumberFormat('vi-VN').format(voucher.discount)} VND</span>
              </div>
            )}
            <div className="price-row total">
              <span>Tổng thanh toán</span>
              <span className="price-amount">
                {new Intl.NumberFormat('vi-VN').format(finalTotal)} VND
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
    
  );
}

export default TicketInformation;