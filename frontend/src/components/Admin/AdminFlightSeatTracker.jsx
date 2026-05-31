import React, { useState, useMemo } from 'react';
import { Plane, User, Hash, AlertTriangle, ShieldAlert, X } from 'lucide-react';

// --- MOCK DATA GENERATION ---
const generateAdminSeatData = (businessRows = 4, economyRows = 16) => {
  const data = [];
  const names = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E", "Vũ Thị F"];
  const pnrs = ["VN1234", "XY8901", "AB4567", "CD2345", "EF6789", "GH0123"];
  
  // Business Class (2-2 layout: A, B - C, D)
  for (let r = 1; r <= businessRows; r++) {
    ['A', 'B', 'C', 'D'].forEach(letter => {
      const rand = Math.random();
      let status = 'AVAILABLE';
      if (rand < 0.4) status = 'SOLD';
      else if (rand < 0.6) status = 'LOCKED';
      else if (rand < 0.65) status = 'MAINTENANCE';

      data.push({
        id: `${r}${letter}`,
        row: r,
        col: letter,
        class: 'BUSINESS',
        status,
        passengerName: (status === 'SOLD' || status === 'LOCKED') ? names[Math.floor(Math.random() * names.length)] : null,
        pnr: (status === 'SOLD' || status === 'LOCKED') ? pnrs[Math.floor(Math.random() * pnrs.length)] : null,
      });
    });
  }

  // Economy Class (3-3 layout: A, B, C - D, E, F)
  for (let r = businessRows + 1; r <= businessRows + economyRows; r++) {
    ['A', 'B', 'C', 'D', 'E', 'F'].forEach(letter => {
      const rand = Math.random();
      let status = 'AVAILABLE';
      if (rand < 0.3) status = 'SOLD';
      else if (rand < 0.5) status = 'LOCKED';
      else if (rand < 0.55) status = 'MAINTENANCE';

      data.push({
        id: `${r}${letter}`,
        row: r,
        col: letter,
        class: 'ECONOMY',
        status,
        passengerName: (status === 'SOLD' || status === 'LOCKED') ? names[Math.floor(Math.random() * names.length)] : null,
        pnr: (status === 'SOLD' || status === 'LOCKED') ? pnrs[Math.floor(Math.random() * pnrs.length)] : null,
      });
    });
  }
  return data;
};

// --- AIRPLANE SILHOUETTE COMPONENT ---
const AirplaneSilhouette = () => (
  <svg viewBox="0 0 400 1400" className="w-full h-auto drop-shadow-xl" preserveAspectRatio="xMidYMin meet">
    {/* Fuselage (Sleeker Main Body) */}
    <path d="M 200 20 C 130 20, 60 120, 60 250 L 60 1200 C 60 1320, 150 1380, 200 1380 C 250 1380, 340 1320, 340 1200 L 340 250 C 340 120, 270 20, 200 20 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="8"/>
    
    {/* Cockpit Window */}
    <path d="M 200 60 C 160 60, 120 100, 120 140 C 120 160, 280 160, 280 140 C 280 100, 240 60, 200 60 Z" fill="#475569" opacity="0.8"/>
  </svg>
);

// --- INDIVIDUAL SEAT COMPONENT ---
const Seat = ({ seat, onMouseEnter, onMouseLeave, onClick }) => {
  let baseStyle = "flex items-center justify-center font-bold text-xs select-none transition-transform ";
  let shapeStyle = "rounded-t-3xl rounded-b-md border-2 ";
  
  if (seat.class === 'BUSINESS') {
    baseStyle += "w-10 h-12 lg:w-12 lg:h-14 text-sm "; 
  } else {
    baseStyle += "w-8 h-10 lg:w-9 lg:h-11 text-xs ";
  }

  switch (seat.status) {
    case 'AVAILABLE':
      baseStyle += "bg-white border-slate-300 text-slate-500 hover:bg-slate-50 hover:border-slate-400";
      break;
    case 'LOCKED':
      baseStyle += "bg-amber-100 border-amber-400 text-amber-600 hover:brightness-95";
      break;
    case 'SOLD':
      baseStyle += "bg-[#003366] border-[#003366] text-white hover:brightness-110 shadow-md";
      break;
    case 'MAINTENANCE':
      // Using a repeating linear gradient for the cross-hatch/maintenance look
      baseStyle += "bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_5px,#f87171_5px,#f87171_10px)] border-red-600 text-white";
      break;
    default:
      break;
  }

  return (
    <div 
      className={`${baseStyle} ${shapeStyle} relative group cursor-pointer`}
      onMouseEnter={(e) => onMouseEnter(e, seat)}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick && onClick(seat)}
    >
      {seat.status === 'MAINTENANCE' ? (
        <ShieldAlert className="w-4 h-4 drop-shadow-md" />
      ) : (
        seat.id
      )}
    </div>
  );
};

// --- MAIN TRACKER COMPONENT ---
export default function AdminFlightSeatTracker({ flight }) {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, seat: null });
  const [bookingModal, setBookingModal] = useState({ visible: false, seat: null });
  
  // Use state instead of memo to allow modifications
  const [seatData, setSeatData] = useState(() => generateAdminSeatData(4, 16));

  const handleSeatClick = (seat) => {
    if (seat.status === 'AVAILABLE') {
      setBookingModal({ visible: true, seat });
    }
  };

  const confirmBooking = () => {
    if (bookingModal.seat) {
      setSeatData(prev => prev.map(s => 
        s.id === bookingModal.seat.id 
          ? { ...s, status: 'SOLD', passengerName: 'Khách mua tại quầy', pnr: 'WALKIN' }
          : s
      ));
      setBookingModal({ visible: false, seat: null });
    }
  };

  const handleMouseMove = (e) => {
    if (tooltip.visible) {
      // Offset slightly to avoid cursor blocking
      setTooltip(prev => ({ ...prev, x: e.clientX + 15, y: e.clientY + 15 }));
    }
  };

  const handleMouseEnter = (e, seat) => {
    if (seat.status === 'SOLD' || seat.status === 'LOCKED' || seat.status === 'MAINTENANCE') {
      setTooltip({ visible: true, x: e.clientX + 15, y: e.clientY + 15, seat });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  if (!flight) return null;

  // Group seats by row
  const rows = useMemo(() => {
    const rowMap = {};
    seatData.forEach(s => {
      if (!rowMap[s.row]) rowMap[s.row] = { rowNum: s.row, seats: [] };
      rowMap[s.row].seats.push(s);
    });
    return Object.values(rowMap).sort((a, b) => a.rowNum - b.rowNum);
  }, [seatData]);

  const businessRows = rows.filter(r => r.seats[0]?.class === 'BUSINESS');
  const economyRows = rows.filter(r => r.seats[0]?.class === 'ECONOMY');

  // Stats
  const totalSeats = seatData.length;
  const soldSeats = seatData.filter(s => s.status === 'SOLD').length;
  const lockedSeats = seatData.filter(s => s.status === 'LOCKED').length;
  const maintenanceSeats = seatData.filter(s => s.status === 'MAINTENANCE').length;
  const availableSeats = seatData.filter(s => s.status === 'AVAILABLE').length;

  return (
    <div className="w-full" onMouseMove={handleMouseMove}>
      
      {/* Tooltip Overlay */}
      {tooltip.visible && tooltip.seat && (
        <div 
          className="fixed z-[100] bg-slate-900 text-white rounded-xl shadow-2xl p-4 w-56 pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-20px] transition-opacity"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div className="flex justify-between items-start mb-2 border-b border-slate-700 pb-2">
            <div>
              <p className="font-black text-lg text-emerald-400">Ghế {tooltip.seat.id}</p>
              <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400">{tooltip.seat.class === 'BUSINESS' ? 'Thương gia' : 'Phổ thông'}</p>
            </div>
            <div className={`text-[10px] px-2 py-1 rounded font-bold uppercase
              ${tooltip.seat.status === 'SOLD' ? 'bg-emerald-900 text-emerald-300' : 
                tooltip.seat.status === 'LOCKED' ? 'bg-amber-900 text-amber-300' : 
                'bg-red-900 text-red-300'}`}
            >
              {tooltip.seat.status}
            </div>
          </div>
          
          {tooltip.seat.status !== 'MAINTENANCE' ? (
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">{tooltip.seat.passengerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">PNR: <span className="text-blue-300">{tooltip.seat.pnr}</span></span>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex items-start gap-2 text-red-300">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span className="text-xs">Ghế đang được khóa lại để bảo trì hoặc sửa chữa.</span>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* LEFT COLUMN: AIRPLANE MAP */}
        <div className="xl:w-8/12 flex justify-center bg-[#F8FAFC] rounded-3xl p-8 shadow-inner overflow-hidden relative">
          
          <div className="relative w-full max-w-[400px]">
            {/* SVG Silhouette */}
            <AirplaneSilhouette />

            {/* Seat Map Overlay */}
            <div className="absolute top-[12%] bottom-[12%] left-[15%] right-[15%] flex flex-col items-center">
              <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar pb-10 px-4">
                
                {/* Business Class */}
                <div className="w-full mb-8">
                  <div className="text-center mb-6">
                    <span className="text-[#C0A062] text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] border-b-2 border-[#C0A062]">
                      Thương gia
                    </span>
                  </div>
                  <div className="flex flex-col gap-4">
                    {businessRows.map(row => (
                      <div key={row.rowNum} className="flex justify-between items-center">
                        <div className="flex gap-3">
                          {row.seats.slice(0, 2).map(seat => <Seat key={seat.id} seat={seat} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleSeatClick} />)}
                        </div>
                        <div className="w-8 text-center text-slate-400 font-bold text-xs">{row.rowNum}</div>
                        <div className="flex gap-3">
                          {row.seats.slice(2, 4).map(seat => <Seat key={seat.id} seat={seat} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleSeatClick} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="w-3/4 mx-auto h-px bg-slate-300 mb-8 relative">
                  <div className="absolute inset-0 flex justify-center items-center -top-3">
                    <div className="bg-[#F8FAFC] px-2 text-slate-400 flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest text-red-500 border border-red-200 px-1 rounded">Cửa thoát hiểm</span>
                    </div>
                  </div>
                </div>

                {/* Economy Class */}
                <div className="w-full">
                  <div className="text-center mb-6">
                    <span className="text-[#003366] text-[10px] font-black px-4 py-1.5 uppercase tracking-[0.2em] border-b-2 border-[#003366]">
                      Phổ thông
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {economyRows.map(row => (
                      <div key={row.rowNum} className="flex justify-between items-center px-1">
                        <div className="flex gap-1.5">
                          {row.seats.slice(0, 3).map(seat => <Seat key={seat.id} seat={seat} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleSeatClick} />)}
                        </div>
                        <div className="w-5 text-center text-slate-400 font-bold text-[10px]">{row.rowNum}</div>
                        <div className="flex gap-1.5">
                          {row.seats.slice(3, 6).map(seat => <Seat key={seat.id} seat={seat} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleSeatClick} />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ADMIN SUMMARY */}
        <div className="xl:w-4/12">
          <div className="flex flex-col gap-6 sticky top-8">
            
            <div className="bg-[#003366] text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Plane size={120} />
              </div>
              
              <h3 className="text-xs font-black text-[#C0A062] uppercase tracking-widest mb-6">Trạng thái chuyến bay</h3>
              
              <div className="mb-8">
                <p className="text-3xl font-black mb-1">{flight.id}</p>
                <p className="text-sm text-slate-300">{flight.aircraft} • Khởi hành: {flight.dep} {flight.from}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Đã bán</p>
                  <p className="text-2xl font-bold text-emerald-400">{soldSeats} <span className="text-sm text-slate-500 font-normal">/ {totalSeats}</span></p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Trống</p>
                  <p className="text-2xl font-bold text-white">{availableSeats}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Đang giữ</p>
                  <p className="text-2xl font-bold text-amber-400">{lockedSeats}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-medium mb-1 uppercase">Bảo trì</p>
                  <p className="text-2xl font-bold text-red-400">{maintenanceSeats}</p>
                </div>
              </div>

              {/* Legend Summary */}
              <div className="space-y-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 rounded bg-[#003366] border border-slate-500"></div>
                  <span className="text-slate-300 flex-1">Ghế đã thanh toán</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 rounded bg-amber-100 border border-amber-400"></div>
                  <span className="text-slate-300 flex-1">Chờ thanh toán (Giữ chỗ)</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 rounded bg-white border border-slate-300"></div>
                  <span className="text-slate-300 flex-1">Sẵn sàng</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 rounded bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_2px,#f87171_2px,#f87171_4px)] border border-red-500"></div>
                  <span className="text-slate-300 flex-1">Khóa bảo trì / Hỏng</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal.visible && bookingModal.seat && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[200]">
          <div className="bg-white rounded-3xl p-6 w-[400px] shadow-2xl relative border border-slate-100">
            <button 
              onClick={() => setBookingModal({ visible: false, seat: null })}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-[#003366] mb-6 border-b border-slate-100 pb-4">Thanh toán vé tại quầy</h2>
            
            <div className="space-y-3 mb-8">
              <div className="flex justify-between items-center bg-[#F8FAFC] p-4 rounded-xl">
                <span className="text-sm font-medium text-slate-500">Mã ghế</span>
                <span className="text-2xl font-black text-[#003366]">{bookingModal.seat.id}</span>
              </div>
              <div className="flex justify-between items-center bg-[#F8FAFC] p-4 rounded-xl">
                <span className="text-sm font-medium text-slate-500">Hạng vé</span>
                <span className="font-bold text-[#C0A062]">
                  {bookingModal.seat.class === 'BUSINESS' ? 'Thương gia' : 'Phổ thông'}
                </span>
              </div>
              <div className="flex justify-between items-end border-t-2 border-dashed border-slate-200 pt-4 mt-2 px-2">
                <span className="text-sm font-medium text-slate-500 mb-1">Giá vé</span>
                <span className="text-3xl font-black text-emerald-600 font-serif tracking-tight">
                  {bookingModal.seat.class === 'BUSINESS' ? '2.500.000' : '1.000.000'} <span className="text-xl text-emerald-500">₫</span>
                </span>
              </div>
            </div>

            <button 
              onClick={confirmBooking}
              className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              Xác nhận mua & Thanh toán
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
