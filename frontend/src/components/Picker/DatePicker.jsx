import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "../../css/Picker/DatePicker.css"; 

const DatePicker = ({ departureDate, setDepartureDate, returnDate, setReturnDate }) => {
  const [showPicker, setShowPicker] = useState(null); 
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="date-group" ref={containerRef} style={{ position: "relative" }}>
      <div 
        className={`departure-box ${showPicker === "departure" ? "active" : ""}`}
        onClick={() => setShowPicker(showPicker === "departure" ? null : "departure")}
      >
        <i className="fas fa-calendar"></i>
        <span> DEPARTURE DAY</span>
        <div className="date-val">{format(departureDate, "dd/MM/yyyy")}</div>
      </div>


      <div 
        className={`return-box ${showPicker === "return" ? "active" : ""}`}
        onClick={() => setShowPicker(showPicker === "return" ? null : "return")}
      >
        <i className="fas fa-calendar"></i>
        <span> RETURN DATE</span>
        <div className="date-val">{format(returnDate, "dd/MM/yyyy")}</div>
      </div>

      {showPicker && (
        <div className="datepicker-popover">
          <DayPicker
            mode="single"
            selected={showPicker === "departure" ? departureDate : returnDate}
            onSelect={(date) => {
              if (date) {
                if (showPicker === "departure") setDepartureDate(date);
                else setReturnDate(date);
                setShowPicker(null);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;