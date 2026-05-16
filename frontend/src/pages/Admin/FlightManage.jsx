import React, { useState, useMemo } from 'react';
import { Plane, User, Calendar, MapPin, Tag, CheckCircle, X } from 'lucide-react';

/* ─── Dữ liệu chuyến bay mẫu ─── */
const FLIGHTS = [
  { id: 'VN201', from: 'SGN', fromCity: 'TP. Hồ Chí Minh', to: 'HAN', toCity: 'Hà Nội',      date: '2026-05-20', dep: '06:00', arr: '08:10', aircraft: 'Airbus A321', price: 1250000, rows: 30, cols: 6 },
  { id: 'VN305', from: 'HAN', fromCity: 'Hà Nội',           to: 'DAD', toCity: 'Đà Nẵng',     date: '2026-05-20', dep: '09:30', arr: '10:50', aircraft: 'Boeing 737',  price: 850000,  rows: 24, cols: 6 },
  { id: 'VN412', from: 'SGN', fromCity: 'TP. Hồ Chí Minh', to: 'HPH', toCity: 'Hải Phòng',   date: '2026-05-21', dep: '13:15', arr: '15:25', aircraft: 'Airbus A320', price: 1100000, rows: 28, cols: 6 },
  { id: 'VN518', from: 'DAD', fromCity: 'Đà Nẵng',          to: 'SGN', toCity: 'TP. Hồ Chí Minh', date: '2026-05-21', dep: '16:00', arr: '17:20', aircraft: 'Boeing 787', price: 950000, rows: 26, cols: 6 },
];

/* ─── Tạo ghế ngẫu nhiên có ghế đã đặt ─── */
function generateSeats(rows, cols, flightId) {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const seats = [];
  // seed đơn giản dựa trên flightId để luôn nhất quán
  const seed = flightId.charCodeAt(flightId.length - 1);
  for (let r = 1; r <= rows; r++) {
    for (let c = 0; c < cols; c++) {
      const id = `${r}${letters[c]}`;
      const hash = ((r * 7 + c * 13 + seed * 3) % 10);
      const occupied = hash < 3; // ~30% ghế đã đặt
      seats.push({ id, row: r, col: c, occupied });
    }
  }
  return seats;
}

const CLASS_ROWS = { 'Thương gia': [1, 4], 'Phổ thông +': [5, 8], 'Phổ thông': [9, 999] };
const CLASS_COLORS = { 'Thương gia': '#7C5CFC', 'Phổ thông +': '#06B6D4', 'Phổ thông': '#6B7280' };

function getClass(row) {
  if (row <= 4) return 'Thương gia';
  if (row <= 8) return 'Phổ thông +';
  return 'Phổ thông';
}

function getSeatPrice(basePrice, row) {
  if (row <= 4) return Math.round(basePrice * 2.5);
  if (row <= 8) return Math.round(basePrice * 1.5);
  return basePrice;
}

/* ─── Định dạng tiền tệ ─── */
const fmt = (n) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

/* ════════════════════════════════════════════ */
export default function FlightManage() {
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passengerName, setPassengerName] = useState('');

  const seats = useMemo(
    () => (selectedFlight ? generateSeats(selectedFlight.rows, selectedFlight.cols, selectedFlight.id) : []),
    [selectedFlight]
  );

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setSelectedSeat(null);
    setShowSuccess(false);
    setPassengerName('');
  };

  const handleSelectSeat = (seat) => {
    if (seat.occupied || bookedSeats.includes(seat.id)) return;
    setSelectedSeat(seat);
  };

  const handleBook = () => {
    if (!selectedSeat || !passengerName.trim()) return;
    setBookedSeats(prev => [...prev, selectedSeat.id]);
    setShowSuccess(true);
    setSelectedSeat(null);
    setPassengerName('');
    setTimeout(() => setShowSuccess(false), 3000);
  };

  /* Nhóm ghế theo hàng */
  const seatsByRow = useMemo(() => {
    const map = {};
    seats.forEach(s => { if (!map[s.row]) map[s.row] = []; map[s.row].push(s); });
    return map;
  }, [seats]);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1E293B' }}>
      {/* ── Tiêu đề ── */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý chuyến bay</h1>
        <p className="text-gray-500 mt-1">Chọn chuyến bay để xem và quản lý sơ đồ chỗ ngồi</p>
      </div>

      {/* ── Danh sách chuyến bay ── */}
      <div className="grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {FLIGHTS.map(f => (
          <button
            key={f.id}
            onClick={() => handleSelectFlight(f)}
            className="text-left rounded-xl p-4 border-2 transition-all"
            style={{
              borderColor: selectedFlight?.id === f.id ? '#7C5CFC' : '#E2E8F0',
              backgroundColor: selectedFlight?.id === f.id ? '#F5F3FF' : '#fff',
              boxShadow: selectedFlight?.id === f.id ? '0 0 0 3px #EDE9FE' : 'none',
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base text-purple-700">{f.id}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium">{f.aircraft}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <MapPin size={13} className="text-purple-400" />
              <span className="font-semibold">{f.from}</span>
              <span className="text-gray-400">→</span>
              <span className="font-semibold">{f.to}</span>
              <span className="text-gray-400 ml-auto">{f.dep} – {f.arr}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              <span>{new Date(f.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <span className="ml-auto text-purple-600 font-semibold text-sm">{fmt(f.price)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Sơ đồ ghế ── */}
      {selectedFlight && (
        <div className="flex gap-5" style={{ alignItems: 'flex-start' }}>

          {/* ════ Cột trái: Máy bay ════ */}
          <div className="flex-1 rounded-2xl border border-gray-200 bg-white p-5" style={{ minWidth: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg">
                  {selectedFlight.id}: {selectedFlight.fromCity} → {selectedFlight.toCity}
                </h2>
                <p className="text-sm text-gray-500">{selectedFlight.aircraft} · {selectedFlight.rows * selectedFlight.cols} ghế</p>
              </div>
              {/* Chú thích */}
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded border-2 inline-block" style={{ backgroundColor: '#7C5CFC', borderColor: '#7C5CFC' }} />
                  Đã chọn
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded inline-block bg-gray-300" />
                  Đã đặt
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded border-2 inline-block bg-white" style={{ borderColor: '#CBD5E1' }} />
                  Trống
                </span>
              </div>
            </div>

            {/* Thân máy bay */}
            <div className="flex justify-center">
              <div style={{ width: '100%', maxWidth: '480px' }}>
                {/* Mũi máy bay */}
                <div className="flex justify-center mb-1">
                  <div style={{
                    width: '120px', height: '60px',
                    background: 'linear-gradient(to bottom, #C7D2FE, #E0E7FF)',
                    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                    borderRadius: '4px 4px 0 0'
                  }} />
                </div>

                {/* Phần thân chính */}
                <div className="rounded-2xl px-5 py-3" style={{ background: 'linear-gradient(to bottom, #E0E7FF, #EDE9FE)', border: '2px solid #C7D2FE' }}>
                  {/* Header chữ cái cột */}
                  <div className="flex items-center mb-2">
                    <span className="text-xs text-gray-400 font-bold mr-2" style={{ width: '24px', textAlign: 'right' }}></span>
                    {letters.map((l, i) => (
                      <React.Fragment key={l}>
                        {i === 3 && <span className="mx-3" />}
                        <span key={l} className="text-xs font-bold text-gray-500 text-center" style={{ width: '36px' }}>{l}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Các hàng ghế */}
                  <div style={{ maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
                    {Object.keys(seatsByRow).map(rowNum => {
                      const row = parseInt(rowNum);
                      const rowSeats = seatsByRow[rowNum];
                      const cls = getClass(row);
                      // Phân cách giữa các hạng
                      const showClassLabel = row === 1 || row === 5 || row === 9;
                      return (
                        <React.Fragment key={rowNum}>
                          {showClassLabel && (
                            <div className="flex items-center gap-2 my-2">
                              <div className="h-px flex-1" style={{ backgroundColor: CLASS_COLORS[cls], opacity: 0.3 }} />
                              <span className="text-xs font-bold px-2" style={{ color: CLASS_COLORS[cls] }}>{cls}</span>
                              <div className="h-px flex-1" style={{ backgroundColor: CLASS_COLORS[cls], opacity: 0.3 }} />
                            </div>
                          )}
                          <div className="flex items-center mb-1">
                            <span className="text-xs text-gray-400 font-mono mr-2 text-right" style={{ width: '24px' }}>{rowNum}</span>
                            {rowSeats.map((seat, i) => {
                              const isBooked = bookedSeats.includes(seat.id);
                              const isOccupied = seat.occupied || isBooked;
                              const isSelected = selectedSeat?.id === seat.id;
                              let bg = '#fff', border = '#CBD5E1', cursor = 'pointer', textColor = '#374151';
                              if (isSelected) { bg = '#7C5CFC'; border = '#7C5CFC'; textColor = '#fff'; }
                              else if (isOccupied) { bg = '#D1D5DB'; border = '#D1D5DB'; cursor = 'not-allowed'; textColor = '#9CA3AF'; }
                              return (
                                <React.Fragment key={seat.id}>
                                  {i === 3 && <span className="mx-3" />}
                                  <button
                                    onClick={() => handleSelectSeat(seat)}
                                    title={isOccupied ? `Ghế ${seat.id} – Đã đặt` : `Ghế ${seat.id} – ${cls}`}
                                    style={{
                                      width: '36px', height: '30px', margin: '1px',
                                      borderRadius: '6px 6px 3px 3px',
                                      border: `2px solid ${border}`,
                                      backgroundColor: bg, color: textColor,
                                      fontSize: '9px', fontWeight: '600',
                                      cursor, transition: 'all 0.15s',
                                    }}
                                    onMouseEnter={e => { if (!isOccupied && !isSelected) { e.currentTarget.style.backgroundColor = '#EDE9FE'; e.currentTarget.style.borderColor = '#7C5CFC'; } }}
                                    onMouseLeave={e => { if (!isOccupied && !isSelected) { e.currentTarget.style.backgroundColor = bg; e.currentTarget.style.borderColor = border; } }}
                                  >
                                    {seat.id}
                                  </button>
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>

                {/* Đuôi máy bay */}
                <div className="flex justify-center mt-1">
                  <div style={{ width: '180px', height: '35px', background: 'linear-gradient(to top, #C7D2FE, #E0E7FF)', borderRadius: '0 0 60% 60%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* ════ Cột phải: Thông tin đặt vé ════ */}
          <div style={{ width: '300px', flexShrink: 0 }}>
            {/* Thông báo thành công */}
            {showSuccess && (
              <div className="flex items-center gap-2 rounded-xl p-3 mb-4 text-green-700 font-medium text-sm" style={{ backgroundColor: '#DCFCE7', border: '1px solid #86EFAC' }}>
                <CheckCircle size={18} />
                Đặt vé thành công!
              </div>
            )}

            {/* Panel đặt vé */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <h3 className="font-bold text-base mb-4 text-gray-900">Chi tiết đặt vé</h3>

              {/* Thông tin chuyến bay */}
              <div className="rounded-xl p-3 mb-4" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Plane size={15} className="text-purple-500" />
                  <span className="font-bold text-purple-700">{selectedFlight.id}</span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Khởi hành</span>
                    <span className="font-medium">{selectedFlight.fromCity} ({selectedFlight.from})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Điểm đến</span>
                    <span className="font-medium">{selectedFlight.toCity} ({selectedFlight.to})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Ngày bay</span>
                    <span className="font-medium">{new Date(selectedFlight.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Giờ bay</span>
                    <span className="font-medium">{selectedFlight.dep} → {selectedFlight.arr}</span>
                  </div>
                </div>
              </div>

              {selectedSeat ? (
                <>
                  {/* Ghế đã chọn */}
                  <div className="rounded-xl p-3 mb-4" style={{ border: '2px solid #7C5CFC', backgroundColor: '#F5F3FF' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-purple-700">Ghế {selectedSeat.id}</p>
                        <p className="text-xs text-purple-500 font-medium uppercase tracking-wide">{getClass(selectedSeat.row)}</p>
                      </div>
                      <button onClick={() => setSelectedSeat(null)}>
                        <X size={16} className="text-purple-400 hover:text-purple-700" />
                      </button>
                    </div>
                  </div>

                  {/* Nhập tên hành khách */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                      Tên hành khách
                    </label>
                    <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 border border-gray-300 focus-within:border-purple-500 transition-colors">
                      <User size={14} className="text-gray-400" />
                      <input
                        type="text"
                        placeholder="Nhập họ và tên..."
                        value={passengerName}
                        onChange={e => setPassengerName(e.target.value)}
                        className="flex-1 text-sm outline-none bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Bảng giá */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Giá vé cơ bản</span>
                      <span>{fmt(getSeatPrice(selectedFlight.price, selectedSeat.row))}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Phí chọn ghế</span>
                      <span>{fmt(50000)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Thuế & phí</span>
                      <span>{fmt(Math.round(getSeatPrice(selectedFlight.price, selectedSeat.row) * 0.08))}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                      <span>Tổng cộng</span>
                      <span className="text-purple-600">
                        {fmt(getSeatPrice(selectedFlight.price, selectedSeat.row) + 50000 + Math.round(getSeatPrice(selectedFlight.price, selectedSeat.row) * 0.08))}
                      </span>
                    </div>
                  </div>

                  {/* Nút đặt vé */}
                  <button
                    onClick={handleBook}
                    disabled={!passengerName.trim()}
                    className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    style={{
                      backgroundColor: passengerName.trim() ? '#7C5CFC' : '#C4B5FD',
                      cursor: passengerName.trim() ? 'pointer' : 'not-allowed',
                    }}
                  >
                    <Plane size={16} />
                    Xác nhận đặt vé →
                  </button>
                </>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#F1F5F9' }}>
                    <Plane size={24} className="text-gray-300" style={{ transform: 'rotate(45deg)' }} />
                  </div>
                  <p className="text-sm font-medium text-gray-500">Chưa chọn ghế</p>
                  <p className="text-xs mt-1">Nhấn vào ghế trống trên sơ đồ để chọn</p>
                </div>
              )}
            </div>

            {/* Thống kê ghế */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 mt-4">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Thống kê ghế</h4>
              <div className="space-y-2">
                {['Thương gia', 'Phổ thông +', 'Phổ thông'].map(cls => {
                  const clsSeats = seats.filter(s => getClass(s.row) === cls);
                  const occupied = clsSeats.filter(s => s.occupied || bookedSeats.includes(s.id)).length;
                  const pct = Math.round((occupied / clsSeats.length) * 100);
                  return (
                    <div key={cls}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium" style={{ color: CLASS_COLORS[cls] }}>{cls}</span>
                        <span className="text-gray-500">{occupied}/{clsSeats.length} đã đặt</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: CLASS_COLORS[cls] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {!selectedFlight && (
        <div className="text-center py-16 text-gray-400 rounded-2xl border-2 border-dashed border-gray-200">
          <Plane size={48} className="mx-auto mb-4 text-gray-200" style={{ transform: 'rotate(45deg)' }} />
          <p className="font-semibold text-gray-400">Chọn một chuyến bay ở trên để xem sơ đồ chỗ ngồi</p>
        </div>
      )}
    </div>
  );
}
