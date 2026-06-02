import React, { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";
import "../../css/Picker/DatePicker.css"; 

const DatePicker = ({ departureDate, setDepartureDate, returnDate, setReturnDate, tripType }) => {
  const [showPicker, setShowPicker] = useState(null); 
  const containerRef = useRef(null);

  // Kiểm tra xem có đang chọn chế độ Một chiều không
  const isOneWay = tripType === 'one-way';
  const today = new Date();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowPicker(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng Picker nếu người dùng đang mở Return Date nhưng lại bấm chuyển sang One-way
  useEffect(() => {
    if (isOneWay && showPicker === "return") {
      setShowPicker(null);
    }
  }, [isOneWay, showPicker]);

  return (
    <div className="date-group" ref={containerRef} style={{ position: "relative", display: "flex", width: "100%" }}>
      
      {/* Nút Departure */}
      <div 
        className={`departure-box ${showPicker === "departure" ? "active" : ""}`}
        onClick={() => setShowPicker(showPicker === "departure" ? null : "departure")}
        style={{ flex: 1, cursor: "pointer" }}
      >
        <i className="fas fa-calendar"></i>
        <span> NGÀY ĐI</span>
        <div className="date-val">{format(departureDate, "dd/MM/yyyy")}</div>
      </div>

      {/* Nút Return (Sẽ bị làm mờ và chặn click nếu là Một chiều) */}
      <div 
        className={`return-box ${showPicker === "return" ? "active" : ""}`}
        onClick={() => {
          if (!isOneWay) {
            setShowPicker(showPicker === "return" ? null : "return")
          }
        }}
        style={{ 
          flex: 1, 
          cursor: isOneWay ? "not-allowed" : "pointer",
          opacity: isOneWay ? 0.4 : 1 // Làm mờ khi không được phép chọn
        }}
      >
        <i className="fas fa-calendar"></i>
        <span> NGÀY VỀ</span>
        <div className="date-val">{isOneWay ? "---" : format(returnDate, "dd/MM/yyyy")}</div>
      </div>

      {/* Bảng chọn ngày */}
      {showPicker && (
        <div className="datepicker-popover" style={{ position: "absolute", top: "100%", zIndex: 100, background: "white", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
          <DayPicker
            mode="single"
            selected={showPicker === "departure" ? departureDate : returnDate}
            
            // LOGIC CHẶN NGÀY Ở ĐÂY
            disabled={
              showPicker === "departure" 
                ? { before: today } // Điểm đi: không chọn được ngày trong quá khứ
                : { before: departureDate } // Điểm đến: không chọn được ngày trước ngày đi (chấp nhận cùng ngày)
                // Nếu muốn BẮT BUỘC lớn hơn 1 ngày (không cho bay về cùng ngày), 
                // đổi thành: { before: new Date(departureDate.getTime() + 24 * 60 * 60 * 1000) }
            }
            
            onSelect={(date) => {
              if (date) {
                if (showPicker === "departure") {
                  setDepartureDate(date);
                  
                  // Tự động đẩy ngày về lên nếu người dùng chọn ngày đi mới lớn hơn ngày về hiện tại
                  if (date > returnDate) {
                    setReturnDate(date); 
                  }
                } else {
                  setReturnDate(date);
                }
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