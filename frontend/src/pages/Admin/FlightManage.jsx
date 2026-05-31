import React, { useState, useMemo } from 'react';
import { Plane, User, Calendar, MapPin, Tag, CheckCircle, X } from 'lucide-react';
import AdminFlightSeatTracker from '../../components/Admin/AdminFlightSeatTracker';

const INITIAL_FLIGHTS = [
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
  const [flights, setFlights] = useState(INITIAL_FLIGHTS);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passengerName, setPassengerName] = useState('');

  // Modal Add Flight State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlight, setNewFlight] = useState({
    id: '', from: '', fromCity: '', to: '', toCity: '',
    date: '', dep: '', arr: '', aircraft: 'Airbus A320', price: 1000000, rows: 30, cols: 6
  });

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

  const handleAddFlight = (e) => {
    e.preventDefault();
    setFlights([...flights, { ...newFlight }]);
    setShowAddModal(false);
    setNewFlight({
      id: '', from: '', fromCity: '', to: '', toCity: '',
      date: '', dep: '', arr: '', aircraft: 'Airbus A320', price: 1000000, rows: 30, cols: 6
    });
  };

  /* Nhóm ghế theo hàng */
  const seatsByRow = useMemo(() => {
    const map = {};
    seats.forEach(s => { if (!map[s.row]) map[s.row] = []; map[s.row].push(s); });
    return map;
  }, [seats]);

  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="text-slate-800 relative">
      {/* ── Tiêu đề ── */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chuyến bay</h1>
          <p className="text-gray-500 mt-1">Chọn chuyến bay để xem và quản lý sơ đồ chỗ ngồi</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <span className="text-xl leading-none">+</span> Thêm chuyến bay mới
        </button>
      </div>

      {/* ── Danh sách chuyến bay ── */}
      <div className="grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {flights.map(f => (
          <button
            key={f.id}
            onClick={() => handleSelectFlight(f)}
            className={`text-left rounded-xl p-4 border-2 transition-all ${selectedFlight?.id === f.id ? 'shadow-md relative overflow-hidden' : 'shadow-sm hover:shadow'}`}
            style={{
              borderColor: selectedFlight?.id === f.id ? '#003366' : '#E2E8F0',
              backgroundColor: '#fff',
            }}
          >
            {selectedFlight?.id === f.id && <div className="absolute top-0 left-0 right-0 h-1 bg-[#C0A062]" />}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base text-[#003366]">{f.id}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#003366] font-medium border border-slate-200">{f.aircraft}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-1">
              <MapPin size={13} className="text-[#C0A062]" />
              <span className="font-semibold">{f.from}</span>
              <span className="text-gray-400">→</span>
              <span className="font-semibold">{f.to}</span>
              <span className="text-gray-400 ml-auto">{f.dep} – {f.arr}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar size={11} />
              <span>{new Date(f.date).toLocaleDateString('vi-VN', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
              <span className="ml-auto text-[#003366] font-bold text-sm">{fmt(f.price)}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ── Sơ đồ ghế (Admin) ── */}
      {selectedFlight && (
        <AdminFlightSeatTracker flight={selectedFlight} />
      )}

      {!selectedFlight && (
        <div className="text-center py-16 text-gray-400 rounded-2xl border-2 border-dashed border-gray-200">
          <Plane size={48} className="mx-auto mb-4 text-gray-200" style={{ transform: 'rotate(45deg)' }} />
          <p className="font-semibold text-gray-400">Chọn một chuyến bay ở trên để xem sơ đồ chỗ ngồi</p>
        </div>
      )}

      {/* Modal Thêm chuyến bay */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[500px] shadow-2xl relative">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">Thêm chuyến bay mới</h2>
            <form onSubmit={handleAddFlight} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mã chuyến bay</label>
                  <input type="text" required value={newFlight.id} onChange={e => setNewFlight({...newFlight, id: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VD: VN999" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Loại máy bay</label>
                  <input type="text" required value={newFlight.aircraft} onChange={e => setNewFlight({...newFlight, aircraft: e.target.value})} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mã điểm đi</label>
                  <input type="text" required value={newFlight.from} onChange={e => setNewFlight({...newFlight, from: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VD: SGN" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thành phố đi</label>
                  <input type="text" required value={newFlight.fromCity} onChange={e => setNewFlight({...newFlight, fromCity: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VD: TP. Hồ Chí Minh" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Mã điểm đến</label>
                  <input type="text" required value={newFlight.to} onChange={e => setNewFlight({...newFlight, to: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VD: HAN" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Thành phố đến</label>
                  <input type="text" required value={newFlight.toCity} onChange={e => setNewFlight({...newFlight, toCity: e.target.value})} className="w-full border rounded p-2 text-sm" placeholder="VD: Hà Nội" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Ngày bay</label>
                  <input type="date" required value={newFlight.date} onChange={e => setNewFlight({...newFlight, date: e.target.value})} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giờ đi</label>
                  <input type="time" required value={newFlight.dep} onChange={e => setNewFlight({...newFlight, dep: e.target.value})} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giờ đến</label>
                  <input type="time" required value={newFlight.arr} onChange={e => setNewFlight({...newFlight, arr: e.target.value})} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giá cơ bản (VNĐ)</label>
                  <input type="number" required value={newFlight.price} onChange={e => setNewFlight({...newFlight, price: Number(e.target.value)})} className="w-full border rounded p-2 text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Số hàng ghế</label>
                    <input type="number" required value={newFlight.rows} onChange={e => setNewFlight({...newFlight, rows: Number(e.target.value)})} className="w-full border rounded p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Cột (A-F)</label>
                    <input type="number" required value={newFlight.cols} onChange={e => setNewFlight({...newFlight, cols: Number(e.target.value)})} className="w-full border rounded p-2 text-sm" readOnly />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3 rounded-lg mt-4 transition-colors">
                Lưu chuyến bay
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
