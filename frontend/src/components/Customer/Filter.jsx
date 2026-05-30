import React from 'react';
import { useSearchParams } from 'react-router-dom';
import '../../css/Customer/Filter.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc giá trị hiện tại từ URL
  const currentTransit = searchParams.get('transit') || '';
  const currentTime = searchParams.get('time') || '';
  const currentClass = searchParams.get('class') || 'first'; 

  // Hàm thay đổi URL
  const updateUrlParam = (key, value) => {
    // 1. Tạo một bản sao của URL hiện tại để không làm mất các param khác (như from, to, departDate)
    const newParams = new URLSearchParams(searchParams);

    // 2. Logic thêm/xóa
    if (newParams.get(key) === value) {
      newParams.delete(key); // Click lại -> Bỏ chọn
    } else {
      newParams.set(key, value); // Click mới -> Chọn (và ghi đè cái cũ)
    }

    // 3. Đẩy params mới lên thanh địa chỉ của trình duyệt
    setSearchParams(newParams);
  };

  const handleReset = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('transit');
    newParams.delete('time');
    newParams.delete('class');
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

      {/* No. of Transit */}
      <div className="filter-section">
        <div className="section-header">
          <p className="title">No. of transit</p>
          <i className="fa-solid fa-chevron-up"></i>
        </div>
        <div className="checkbox-group">
          {/* LƯU Ý: Đã bỏ defaultChecked, chỉ dùng checked theo state URL */}
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
            className={`class-btn ${currentClass === 'first' ? 'active' : ''}`}
            onClick={() => updateUrlParam('class', 'first')}
          >
            Economy Class
          </button>

          <button 
            className={`class-btn ${currentClass === 'second' ? 'active' : ''}`}
            onClick={() => updateUrlParam('class', 'second')}
          >
            Business Class 
          </button>
        </div>
      </div>

    </div>
  );
}

export default Filter;