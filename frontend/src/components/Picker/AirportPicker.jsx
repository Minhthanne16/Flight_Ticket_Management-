import '../../css/Picker/AirportPicker.css';
import React, { useState, useEffect, useRef } from 'react';

// 🔥 Bước 1: Nhận prop 'icon' ở đây
function AirportPicker({ icon, label, selectedAirport, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [airports, setAirports] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const pickerRef = useRef(null);

    useEffect(() => {
        fetch('http://localhost:5000/admin/airports')
            .then(res => res.json())
            .then(data => {
            console.log(data);
            setAirports(data.data);
        })
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
        ap.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.airportCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ap.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <strong style={{ fontSize: '18px' }}>
                        {selectedAirport?.city || "Select City"}
                    </strong> 

                    {selectedAirport && (
                        <span className="display-code" style={{ color: '#6B7280', marginLeft: '5px' }}>
                            ({selectedAirport.airportCode})
                        </span>
                    )}
                </div>

                <small className="airport-subtext" style={{ color: '#6B7280', opacity: 0.7 }}>
                    {selectedAirport?.name || "Search for airport..."}
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
                        {filteredAirports.length > 0 ? (
                            filteredAirports.map(ap => (
                                <div key={ap.airportId} className="airport-item" onClick={() => handleSelectAirport(ap)}>
                                    <div className="item-left">
                                        <div className="icon-circle">✈</div>
                                        <div className="text-details">
                                            <div className="city-row">
                                                <span className="city-name">{ap.city}</span>
                                                <span className="badge-code">{ap.airportCode}</span>
                                            </div>
                                            <span className="full-airport">{ap.name}</span>
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