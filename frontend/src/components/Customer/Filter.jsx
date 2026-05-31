import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../css/Customer/Filter.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // KHAI BÁO CÁC BIẾN RÕ RÀNG ĐỂ HTML Ở DƯỚI GỌI ĐƯỢC
  const currentTransit = searchParams.get('transit') || '';
  const currentTime = searchParams.get('time') || '';
  const currentClass = searchParams.get('cabinClass') || 'economy'; 
  const currentPassengers = parseInt(searchParams.get('passengers'), 10) || 1; 

  // Hàm thay đổi URL cho các thẻ phổ thông
  const updateUrlParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (newParams.get(key) === value) {
      newParams.delete(key); 
    } else {
      newParams.set(key, value); 
    }
    setSearchParams(newParams);
  };

  // Hàm thay đổi URL riêng cho đếm hành khách
  const updatePassengers = (newCount) => {
    if (newCount < 1) return; 
    const newParams = new URLSearchParams(searchParams);
    newParams.set('passengers', newCount);
    setSearchParams(newParams);
  };

  // Hàm Reset
  const handleReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('transit');
    newParams.delete('time');
    newParams.delete('cabinClass');
    newParams.delete('passengers'); 
    setSearchParams(newParams);
  };

  return (
    <div className="filter-container">
      {/* Header */}
      <div className="filter-header">
        <span className="filter-title">
          <i className="fa-solid fa-filter"></i> Filter
        </span>
        <button className="reset-btn" onClick={handleReset}>Reset</button>
      </div>

      {/* Section Hành Khách (Passengers) */}
      <div className="filter-section">
        <div className="section-header">
          <p className="title">Passengers</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="passenger-counter">
          <button 
            className="counter-btn"
            onClick={() => updatePassengers(currentPassengers - 1)}
            disabled={currentPassengers <= 1} 
          >
            <i className="fa-solid fa-minus"></i>
          </button>
          <span className="counter-value">{currentPassengers}</span>
          <button 
            className="counter-btn active-btn"
            onClick={() => updatePassengers(currentPassengers + 1)}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>

      {/* No. of Transit */}
      <div className="filter-section">
        <div className="section-header">
          <p className="title">No. of transit</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="checkbox-group">
          <label className="checkbox-item">
            <input 
              type="checkbox" 
              checked={currentTransit === 'direct'}
              onChange={() => updateUrlParam('transit', 'direct')}
            />
            <span className="checkmark"></span> Direct
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox" 
              checked={currentTransit === '1-transit'}
              onChange={() => updateUrlParam('transit', '1-transit')}
            />
            <span className="checkmark"></span> 1 transit
          </label>
          <label className="checkbox-item">
            <input 
              type="checkbox" 
              checked={currentTransit === '2-transit'}
              onChange={() => updateUrlParam('transit', '2-transit')}
            />
            <span className="checkmark"></span> 2 transit
          </label>
        </div>
      </div>

      {/* Departure time */}
      <div className="filter-section">
        <div className="section-header">
          <p className="title">Departure time</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="time-grid">
          {[
            { id: 't1', label: 'Night to morning', time: '00:00 - 06:00' },
            { id: 't2', label: 'Morning to noon', time: '06:00 - 12:00' },
            { id: 't3', label: 'Noon to afternoon', time: '12:00 - 18:00' },
            { id: 't4', label: 'Afternoon to night', time: '18:00 - 00:00' },
          ].map((item) => (
            <button
              key={item.id}
              className={`time-btn ${currentTime === item.id ? 'active' : ''}`}
              onClick={() => updateUrlParam('time', item.id)}
            >
              {item.label} <br /> {item.time}
            </button>
          ))}
        </div>
      </div>

      {/* Class Section */}
      <div className="filter-section">
        <div className="section-header">
          <p className="title">Class</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="class-group">
          <button 
            className={`class-btn ${currentClass === 'economy' ? 'active' : ''}`}
            onClick={() => updateUrlParam('cabinClass', 'economy')}
          >
            Economy Class
          </button>

          <button 
            className={`class-btn ${currentClass === 'business' ? 'active' : ''}`}
            onClick={() => updateUrlParam('cabinClass', 'business')}
          >
            Business Class
          </button>
        </div>
      </div>

    </div>
  );
}

export default Filter;