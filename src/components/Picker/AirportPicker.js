import '../../css/Picker/AirportPicker.css';
import React, { useState, useEffect, useRef } from 'react';

// 🔥 Bước 1: Nhận prop 'icon' ở đây
function AirportPicker({ icon, label, selectedAirport, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const pickerRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/airports')
            .then(res => res.json())
            .then(data => setAirports(data))
            .catch(err => console.error("Lỗi lấy dữ liệu sân bay:", err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredAirports = airports.filter(ap =>
        ap.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.airport.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectAirport = (airport) => {
        onSelect(airport);
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="airport-picker-container" ref={pickerRef}>
            <div
                className={`airport-box ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(prev => !prev)}
            >
                {/* 🔥 Bước 2: Hiển thị icon và label trên cùng một hàng */}
                <div className="label-row">
                    {icon && <span className="picker-icon">{icon}</span>}
                    <span className="label-title">{label}</span>
                </div>
                
                <div className="city-display">
                    <strong style={{ color: 'white', fontSize: '18px' }}>
                        {selectedAirport?.city || "Select City"}
                    </strong> 

                    {selectedAirport && (
                        <span className="display-code" style={{ color: 'white', marginLeft: '5px' }}>
                            ({selectedAirport.code})
                        </span>
                    )}
                </div>

                <small className="airport-subtext" style={{ color: 'white', opacity: 0.7 }}>
                    {selectedAirport?.airport || "Search for airport..."}
                </small>
            </div>

            {/* --- Phần Dropdown giữ nguyên --- */}
            {isOpen && (
                <div className="airport-dropdown">
                    <div className="search-input-wrapper">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder={label === "From" ? "Where from?" : "Where to?"}
                            autoFocus
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="airport-list">
                        <p className="list-title">POPULAR CITIES</p>
                        {filteredAirports.length > 0 ? (
                            filteredAirports.map(ap => (
                                <div key={ap.id} className="airport-item" onClick={() => handleSelectAirport(ap)}>
                                    <div className="item-left">
                                        <div className="icon-circle">✈</div>
                                        <div className="text-details">
                                            <div className="city-row">
                                                <span className="city-name">{ap.city}</span>
                                                <span className="badge-code">{ap.code}</span>
                                            </div>
                                            <span className="full-airport">{ap.airport}</span>
                                        </div>
                                    </div>
                                    <div className="item-right">
                                        <span className="country-txt">{ap.country}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-result">No airports found.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AirportPicker;