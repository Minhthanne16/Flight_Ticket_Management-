import React, { useState } from 'react';
import { Plane, Info, CheckCircle2, XCircle, Clock } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const generateSeats = () => {
  const seats = [];
  
  // Business Class: Rows 1-3 (2-2 layout: A, C - D, F)
  for (let row = 1; row <= 3; row++) {
    ['A', 'C', 'D', 'F'].forEach(letter => {
      let status = 'AVAILABLE';
      if (row === 1 && letter === 'A') status = 'SOLD';
      if (row === 2 && letter === 'D') status = 'LOCKED';
      
      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        class: 'BUSINESS',
        status,
        price: 3500000
      });
    });
  }

  // Economy Class: Rows 4-15 (3-3 layout: A, B, C - D, E, F)
  for (let row = 4; row <= 15; row++) {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => {
      let status = 'AVAILABLE';
      // Randomly mock some sold/locked seats
      if ((row * letter.charCodeAt(0)) % 13 === 0) status = 'SOLD';
      else if ((row * letter.charCodeAt(0)) % 17 === 0) status = 'LOCKED';

      seats.push({
        id: `${row}${letter}`,
        row,
        letter,
        class: 'ECONOMY',
        status,
        price: 1200000
      });
    });
  }
  return seats;
};

const SEAT_DATA = generateSeats();

// --- COMPONENTS ---

export default function AirplaneSeatMap({ flight }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const maxPassengers = 4;

  if (!flight) return null;

  const handleSeatClick = (seat) => {
    if (seat.status === 'SOLD' || seat.status === 'LOCKED') return;

    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= maxPassengers) {
        alert(`Bạn chỉ được chọn tối đa ${maxPassengers} ghế.`);
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Group seats by row for easier rendering
  const rows = [];
  let maxRow = Math.max(...SEAT_DATA.map(s => s.row));
  for (let r = 1; r <= maxRow; r++) {
    rows.push({
      rowNum: r,
      seats: SEAT_DATA.filter(s => s.row === r).sort((a, b) => a.letter.localeCompare(b.letter))
    });
  }

  return (
    <div className="w-full">
      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: AIRPLANE SILHOUETTE & SEATS */}
        <div className="xl:w-7/12 flex justify-center bg-[#F8FAFC] rounded-3xl p-8 shadow-inner overflow-hidden relative">
          
          <div className="relative w-full max-w-[400px]">
            {/* SVG Airplane Silhouette (Premium Sleek Redesign) */}
            <svg viewBox="0 0 400 1400" className="w-full h-auto drop-shadow-xl" preserveAspectRatio="xMidYMin meet">
              {/* Main Wings */}
              <path d="M 60 450 C 20 450, -100 800, -120 850 C -140 900, 60 750, 60 750 Z" fill="#F4F7FA" stroke="#003366" strokeWidth="4"/>
              <path d="M 340 450 C 380 450, 500 800, 520 850 C 540 900, 340 750, 340 750 Z" fill="#F4F7FA" stroke="#003366" strokeWidth="4"/>

              {/* Back Wings (Stabilizers) */}
              <path d="M 120 1200 L -40 1280 L -40 1320 L 120 1260 Z" fill="#F4F7FA" stroke="#003366" strokeWidth="4" />
              <path d="M 280 1200 L 440 1280 L 440 1320 L 280 1260 Z" fill="#F4F7FA" stroke="#003366" strokeWidth="4" />

              {/* Fuselage (Sleeker Main Body) */}
              <path d="M 200 20 C 130 20, 60 120, 60 250 L 60 1200 C 60 1320, 150 1380, 200 1380 C 250 1380, 340 1320, 340 1200 L 340 250 C 340 120, 270 20, 200 20 Z" fill="#F4F7FA" stroke="#003366" strokeWidth="8"/>
              
              {/* Cockpit Window */}
              <path d="M 200 60 C 160 60, 120 100, 120 140 C 120 160, 280 160, 280 140 C 280 100, 240 60, 200 60 Z" fill="#003366" opacity="0.8"/>
              
              {/* Golden Accent Line along fuselage */}
              <path d="M 80 250 L 80 1150 M 320 250 L 320 1150" stroke="#C0A062" strokeWidth="2" opacity="0.5"/>
            </svg>

            {/* Seat Map Overlay */}
            {/* Using absolute positioning mapped inside the fuselage bounds (x=60 to 340 -> 15% to 85%) */}
            <div className="absolute top-[12%] bottom-[12%] left-[15%] right-[15%] flex flex-col items-center">
              
              <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-10 px-4">
                
                {/* Business Class Section */}
                <div className="w-full mb-8">
                  <div className="text-center mb-6">
                    <span className="text-[#C0A062] text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] border-b-2 border-[#C0A062]">
                      Thương gia
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {rows.filter(r => r.seats[0]?.class === 'BUSINESS').map(row => (
                      <div key={row.rowNum} className="flex justify-between items-center">
                        {/* Left seats (A, C) */}
                        <div className="flex gap-3">
                          {row.seats.slice(0, 2).map(seat => <Seat key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={() => handleSeatClick(seat)} />)}
                        </div>
                        {/* Aisle */}
                        <div className="w-8 text-center text-[#003366] font-bold text-xs opacity-50">{row.rowNum}</div>
                        {/* Right seats (D, F) */}
                        <div className="flex gap-3">
                          {row.seats.slice(2, 4).map(seat => <Seat key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={() => handleSeatClick(seat)} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-3/4 mx-auto h-px bg-slate-300 mb-8 relative">
                  <div className="absolute inset-0 flex justify-center items-center -top-3">
                    <div className="bg-[#F4F7FA] px-2 text-[#003366]"><Plane className="w-4 h-4" /></div>
                  </div>
                </div>

                {/* Economy Class Section */}
                <div className="w-full">
                  <div className="text-center mb-6">
                    <span className="text-[#003366] text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] border-b-2 border-[#003366]">
                      Phổ thông
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {rows.filter(r => r.seats[0]?.class === 'ECONOMY').map(row => (
                      <div key={row.rowNum} className="flex justify-between items-center px-1">
                        {/* Left seats (A, B, C) */}
                        <div className="flex gap-1.5">
                          {row.seats.slice(0, 3).map(seat => <Seat key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={() => handleSeatClick(seat)} />)}
                        </div>
                        {/* Aisle */}
                        <div className="w-5 text-center text-[#003366] font-bold text-[10px] opacity-40">{row.rowNum}</div>
                        {/* Right seats (D, E, F) */}
                        <div className="flex gap-1.5">
                          {row.seats.slice(3, 6).map(seat => <Seat key={seat.id} seat={seat} isSelected={selectedSeats.some(s => s.id === seat.id)} onClick={() => handleSeatClick(seat)} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: FLIGHT INFO & SUMMARY */}
        <div className="xl:w-5/12">
          <div className="flex flex-col gap-6 sticky top-8">
            
            {/* Legend Card */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 flex flex-wrap gap-4 justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#F4F7FA] border border-[#003366]"></div>
                <span className="text-slate-600 font-medium">Trống</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#003366] shadow-inner"></div>
                <span className="text-slate-600 font-medium">Đang chọn</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#FFF9E6] border border-[#D4B012]"></div>
                <span className="text-slate-600 font-medium">Đang giữ</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-slate-200 border border-slate-300 flex items-center justify-center">
                  <XCircle className="w-3 h-3 text-slate-400" />
                </div>
                <span className="text-slate-600 font-medium">Đã bán</span>
              </div>
            </div>

            {/* Flight Details Card */}
            <div className="bg-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-slate-100">
              {/* Boarding Pass Notches */}
              <div className="absolute left-0 top-[45%] w-4 h-8 bg-slate-50 rounded-r-full border-r border-t border-b border-slate-100"></div>
              <div className="absolute right-0 top-[45%] w-4 h-8 bg-slate-50 rounded-l-full border-l border-t border-b border-slate-100"></div>

              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Chi tiết chuyến bay</h3>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-[#003366] text-[#C0A062] rounded-xl flex items-center justify-center font-black text-2xl shadow-inner">
                  {flight.id.substring(0, 2)}
                </div>
                <div>
                  <p className="font-bold text-xl text-[#003366]">{flight.id.startsWith('VN') ? 'Vietnam Airlines' : flight.id.startsWith('VJ') ? 'Vietjet Air' : 'Bamboo Airways'}</p>
                  <p className="text-sm text-slate-500 font-medium">{flight.aircraft} • Chuyến bay {flight.id}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-8 pb-8 border-b-2 border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#003366]">{flight.dep}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">{flight.from}</p>
                </div>
                <div className="flex-1 px-6 flex flex-col items-center">
                  <p className="text-xs text-[#C0A062] font-bold mb-2">BAY THẲNG</p>
                  <div className="w-full h-px bg-slate-300 relative">
                    <Plane className="w-5 h-5 text-[#003366] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black text-[#003366]">{flight.arr}</p>
                  <p className="text-sm font-bold text-slate-500 mt-1">{flight.to}</p>
                </div>
              </div>

              {/* Selected Seats Summary */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-700">Ghế đã chọn ({selectedSeats.length}/{maxPassengers})</h4>
                </div>
                
                {selectedSeats.length === 0 ? (
                  <div className="bg-[#F4F7FA] rounded-xl p-6 text-center border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500 font-medium">Vui lòng chọn ghế trên sơ đồ</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedSeats.map(seat => (
                      <div key={seat.id} className="flex items-center justify-between bg-white border border-slate-200 shadow-sm p-4 rounded-xl">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${seat.class === 'BUSINESS' ? 'bg-[#C0A062]' : 'bg-[#003366]'} text-white rounded-lg flex items-center justify-center font-bold text-lg shadow-sm`}>
                            {seat.id}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">
                              {seat.class === 'BUSINESS' ? 'THƯƠNG GIA' : 'PHỔ THÔNG'}
                            </p>
                          </div>
                        </div>
                        <p className="font-bold text-[#003366] text-lg">
                          {seat.price.toLocaleString('vi-VN')} ₫
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Total Price */}
              <div className="mt-8 pt-6 border-t-2 border-slate-800 flex flex-col gap-6">
                <div className="flex items-end justify-between">
                  <p className="text-base font-bold text-slate-500">TỔNG THANH TOÁN</p>
                  <p className="text-4xl lg:text-5xl font-black text-[#003366] font-serif tracking-tight">
                    {totalPrice.toLocaleString('vi-VN')} <span className="text-2xl text-[#C0A062]">₫</span>
                  </p>
                </div>
                <button 
                  disabled={selectedSeats.length === 0}
                  className="w-full bg-[#003366] hover:bg-[#002244] disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  Tiếp tục thanh toán <CheckCircle2 className="w-5 h-5" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Sub-component for individual seat
function Seat({ seat, isSelected, onClick }) {
  let baseStyle = "rounded-t-3xl rounded-b-md border-2 flex items-center justify-center font-bold transition-all duration-200 select-none shadow-sm ";
  
  if (seat.class === 'BUSINESS') {
    baseStyle += "w-10 h-12 lg:w-12 lg:h-14 text-sm "; // Wider and taller for Business
  } else {
    baseStyle += "w-8 h-10 lg:w-9 lg:h-11 text-xs "; // Standard for Economy
  }

  if (isSelected) {
    baseStyle += "bg-[#003366] border-[#003366] text-white shadow-md transform scale-105 z-10";
  } else {
    switch (seat.status) {
      case 'AVAILABLE':
        if (seat.class === 'BUSINESS') {
          baseStyle += "bg-[#FDFBF2] border-[#C0A062] text-[#C0A062] hover:bg-[#F9F4DF] cursor-pointer";
        } else {
          baseStyle += "bg-[#F4F7FA] border-[#003366] text-[#003366] hover:bg-[#E2E8F0] cursor-pointer";
        }
        break;
      case 'LOCKED':
        baseStyle += "bg-[#FFF9E6] border-[#D4B012] text-[#D4B012] cursor-not-allowed";
        break;
      case 'SOLD':
        baseStyle += "bg-slate-200 border-slate-300 text-slate-400 opacity-50 cursor-not-allowed";
        break;
      default:
        break;
    }
  }

  return (
    <div 
      onClick={onClick}
      className={`${baseStyle} relative group`}
      title={`${seat.class === 'BUSINESS' ? 'Thương gia' : 'Phổ thông'} - ${seat.price.toLocaleString('vi-VN')}đ`}
    >
      {seat.status === 'SOLD' && !isSelected && <XCircle className="w-4 h-4 opacity-50" />}
      {seat.status === 'LOCKED' && !isSelected && <Clock className="w-3.5 h-3.5 opacity-50" />}
      {(seat.status === 'AVAILABLE' || isSelected) && seat.letter}
      
      {/* Decorative headrest line */}
      <div className={`absolute top-1 left-2 right-2 h-1 rounded-full opacity-30 ${isSelected ? 'bg-white' : 'bg-current'}`} />
    </div>
  );
}
