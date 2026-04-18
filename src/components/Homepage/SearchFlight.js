import '../../css/Homepage/SearchFlight.css';
import PassengerPicker from '../Picker/PassengerPicker';
import Airport from '../Picker/AirportPicker';
import DatePicker from '../Picker/DatePicker';
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';

function SearchFlight() {
    const [fromCity, setFromCity] = useState(null);
    const [toCity, setToCity] = useState(null);
    const [departureDate, setDepartureDate] = useState(new Date());
    const [returnDate, setReturnDate] = useState(new Date());
    return (
        <div className="searching-card">
            <h1 className='slogan'>Masupilami Airways - The joy of Flying! </h1>

            <div className="searching-plane">
                <div className="options-row">
                    <div className="trip-type">
                        <button className="btn-one">One-way</button>
                        <button className="btn-return">Round-trip</button>
                    </div>
                    
                    <div className='filter-options'>
                        <label className="switch-container">
                            <input type="checkbox" className="switch-checkbox"/>
                            <span className="switch-slider"></span>
                            Direct flights only
                        </label>

                        <div className="select-input-wrapper">
                            <i className="fa-solid fa-couch"></i>
                                <select className="select-input">
                                    <option value="First Class">First Class</option>
                                    <option value="Second Class">Second Class</option>
                                </select>
                        </div>
                        <PassengerPicker />
                    </div>
                </div>
                
                <div className="Search-row">
                    <div className="loaction-group">
                        <Airport
                            icon={<i className="fas fa-plane-departure"></i>}
                            label="From"
                            selectedAirport={fromCity} 
                            onSelect={(ap) => setFromCity(ap)} 
                        />
                        
                        <div className="swap-icon-container">
                            <div className="swap-circle">
                            <span className="swap-symbol">⇄</span>
                        </div>
                    </div>

                        <Airport
                            icon={<i className="fas fa-plane-arrival"></i>}
                            label="To" 
                            selectedAirport={toCity} 
                            onSelect={(ap) => setToCity(ap)} 
                        />
                    </div>

                    <DatePicker
                        departureDate={departureDate} 
                        setDepartureDate={setDepartureDate}
                        returnDate={returnDate}
                        setReturnDate={setReturnDate}
                    />

                    <button className="btn-searching">
                        <span className="search-icon">🔍</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SearchFlight;