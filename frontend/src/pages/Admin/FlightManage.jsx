import React, { useState, useMemo, useEffect } from 'react';
import { Plane, User, Calendar, MapPin, Tag, CheckCircle, X, Edit2, Trash2 } from 'lucide-react';
import AdminFlightSeatTracker from '../../components/Admin/AdminFlightSeatTracker';
import { flightService } from '../../api/services/flightService';
import { airplaneService } from '../../api/services/airplaneService';
import { routeService } from '../../api/services/routeService';
import { airportService } from '../../api/services/airportService';
import { regulationService } from '../../api/services/regulationService';

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || 'Có lỗi xảy ra';

const FLIGHT_STATUSES = [
  { value: 'SCHEDULED', label: 'Đã lên lịch' },
  { value: 'BOARDING', label: 'Đang lên máy bay' },
  { value: 'DELAYED', label: 'Trễ chuyến' },
  { value: 'DEPARTED', label: 'Đã khởi hành' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

const EMPTY_FLIGHT = {
  flightCode: '', airplaneId: '', routeId: '', departureTime: '',
  arrivalTime: '', basePrice: 1000000, status: 'SCHEDULED', stops: [],
};

// đảm bảo chuỗi datetime-local "YYYY-MM-DDTHH:mm" có thêm giây cho LocalDateTime
const toIsoDateTime = (v) => (v && v.length === 16 ? `${v}:00` : v);

// cộng phút vào chuỗi datetime-local "YYYY-MM-DDTHH:mm" -> "YYYY-MM-DDTHH:mm"
const addMinutesToDateTime = (dt, mins) => {
  if (!dt) return '';
  const d = new Date(dt);
  d.setMinutes(d.getMinutes() + Number(mins || 0));
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// cộng phút vào "HH:mm"
const addMinutes = (time, mins) => {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + Number(mins || 0);
  const hh = String(Math.floor((total % 1440) / 60)).padStart(2, '0');
  const mm = String(total % 60).padStart(2, '0');
  return `${hh}:${mm}`;
};

// FlightAdminResponse (DB) -> card hiển thị
const mapFlight = (f) => {
  const [from, to] = String(f.routeCode || '-').split('-');
  const dep = String(f.departureTime || '').slice(11, 16);
  return {
    id: f.flightCode,
    dbId: f.id,
    from: from || '?',
    to: to || '?',
    fromCity: f.departureCity || '',
    toCity: f.arrivalCity || '',
    date: String(f.departureTime || '').slice(0, 10),
    dep,
    arr: addMinutes(dep, f.estimateDuration),
    aircraft: f.airplaneCode || f.modelName || 'N/A',
    price: Number(f.basePrice || 0),
    totalSeats: f.totalSeats || 0,
    status: f.status,
    // dữ liệu phục vụ sửa
    routeId: f.routeId ?? '',
    airplaneId: f.airplaneId ?? '',
    estimateDuration: f.estimateDuration ?? 90,
    departureTimeRaw: String(f.departureTime || '').slice(0, 16),
    stops: (f.flightStops || []).map(s => ({
      airportStopId: s.airportStopId ?? '',
      arrivalTime: String(s.arrivalTime || '').slice(0, 16),
      departureTime: String(s.departureTime || '').slice(0, 16),
    })),
  };
};

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
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [passengerName, setPassengerName] = useState('');

  // Modal Add/Edit Flight State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFlight, setNewFlight] = useState(EMPTY_FLIGHT);
  const [editingId, setEditingId] = useState(null); // dbId khi đang sửa

  // Dữ liệu thật cho dropdown
  const [airplanes, setAirplanes] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [airports, setAirports] = useState([]);
  const [maxStops, setMaxStops] = useState(null); // số điểm dừng tối đa theo quy định
  const [maxStopDuration, setMaxStopDuration] = useState(null); // thời gian dừng tối đa (phút)
  const [minStopDuration, setMinStopDuration] = useState(null); // thời gian dừng tối thiểu (phút)
  const [minFlightDuration, setMinFlightDuration] = useState(null); // thời gian bay tối thiểu (phút)
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type }), 3500);
  };

  const loadFlights = async () => {
    const list = await flightService.getAdminList().catch(() => []);
    setFlights((list || []).map(mapFlight));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [ap, rt, ar] = await Promise.all([
          airplaneService.getAll().catch(() => []),
          routeService.getAll().catch(() => []),
          airportService.getAll().catch(() => []),
        ]);
        if (!mounted) return;
        setAirplanes(ap || []);
        setRoutes(rt || []);
        setAirports(ar || []);
      } catch {
        // bỏ qua, dropdown sẽ rỗng
      }
      const list = await flightService.getAdminList().catch(() => []);
      if (mounted) setFlights((list || []).map(mapFlight));
      // Tải quy định số điểm dừng tối đa (settingKey = max_stops)
      try {
        const res = await regulationService.getAll();
        const list = res.data?.data || res.data || [];
        const reg = list.find(c => c.settingKey === 'max_stops');
        if (mounted && reg) setMaxStops(Number(reg.settingValue));
        const regDur = list.find(c => c.settingKey === 'max_stop_duration');
        if (mounted && regDur) setMaxStopDuration(Number(regDur.settingValue));
        const regMinDur = list.find(c => c.settingKey === 'min_stop_duration');
        if (mounted && regMinDur) setMinStopDuration(Number(regMinDur.settingValue));
        const regMinFlight = list.find(c => c.settingKey === 'min_flight_duration');
        if (mounted && regMinFlight) setMinFlightDuration(Number(regMinFlight.settingValue));
      } catch {
        // không có quy định -> không giới hạn ở client
      }
    })();
    return () => { mounted = false; };
  }, []);

  const airportById = (id) => airports.find(a => Number(a.id) === Number(id));
  const setNF = (k, v) => setNewFlight(f => ({ ...f, [k]: v }));
  const addStop = () => setNewFlight(f => ({ ...f, stops: [...f.stops, { airportStopId: '', arrivalTime: '', departureTime: '' }] }));
  const setStop = (i, k, v) => setNewFlight(f => ({ ...f, stops: f.stops.map((s, idx) => idx === i ? { ...s, [k]: v } : s) }));
  const removeStop = (i) => setNewFlight(f => ({ ...f, stops: f.stops.filter((_, idx) => idx !== i) }));

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

  const handleAddFlight = async (e) => {
    e.preventDefault();
    const f = newFlight;
    if (!f.flightCode || !f.airplaneId || !f.routeId || !f.departureTime
        || !f.arrivalTime || !(Number(f.basePrice) > 0)) {
      showToast('Vui lòng nhập đủ thông tin chuyến bay.', 'error');
      return;
    }
    // Giờ khởi hành phải ở tương lai — chỉ bắt buộc khi tạo mới
    if (!editingId && new Date(f.departureTime) <= new Date()) {
      showToast('Giờ khởi hành phải sau thời điểm hiện tại.', 'error');
      return;
    }
    // Giờ đến của chuyến bay phải sau giờ khởi hành
    if (new Date(f.arrivalTime) <= new Date(f.departureTime)) {
      showToast('Giờ đến của chuyến bay phải sau giờ khởi hành.', 'error');
      return;
    }
    const estimateDuration = Math.round((new Date(f.arrivalTime) - new Date(f.departureTime)) / 60000);
    // Thời gian bay tối thiểu theo quy định
    if (minFlightDuration != null && estimateDuration < minFlightDuration) {
      showToast(`Thời gian bay phải tối thiểu ${minFlightDuration} phút (theo quy định).`, 'error');
      return;
    }

    // ── Validate điểm dừng: không bắt buộc, nhưng đã thêm thì phải nhập đủ; số lượng ≤ quy định ──
    const stops = f.stops || [];
    if (maxStops != null && stops.length > maxStops) {
      showToast(`Số điểm dừng không được vượt quá ${maxStops} (theo quy định).`, 'error');
      return;
    }
    // Sân bay đầu/cuối của tuyến bay (để chặn điểm dừng trùng)
    const selectedRoute = routes.find(r => Number(r.id) === Number(f.routeId));
    const originId = selectedRoute?.departureAirportId;
    const destId = selectedRoute?.arrivalAirportId;
    const seenAirports = new Set();
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      if (!s.airportStopId || !s.arrivalTime || !s.departureTime) {
        showToast(`Điểm dừng #${i + 1}: vui lòng nhập đủ sân bay, giờ đến và giờ đi.`, 'error');
        return;
      }
      // Sân bay dừng không được trùng điểm đầu hoặc điểm cuối
      if (Number(s.airportStopId) === Number(originId) || Number(s.airportStopId) === Number(destId)) {
        showToast(`Điểm dừng #${i + 1}: sân bay dừng không được trùng điểm đầu hoặc điểm cuối.`, 'error');
        return;
      }
      // Sân bay dừng không được trùng với các điểm dừng khác
      if (seenAirports.has(Number(s.airportStopId))) {
        showToast(`Điểm dừng #${i + 1}: sân bay dừng đã được dùng ở điểm dừng khác.`, 'error');
        return;
      }
      seenAirports.add(Number(s.airportStopId));
      // Trong điểm dừng: giờ đến < giờ đi
      if (new Date(s.departureTime) <= new Date(s.arrivalTime)) {
        showToast(`Điểm dừng #${i + 1}: giờ đi phải sau giờ đến.`, 'error');
        return;
      }
      // Giờ đến và giờ đi của điểm dừng phải nằm giữa giờ khởi hành và giờ đến của chuyến bay
      if (new Date(s.arrivalTime) <= new Date(f.departureTime)
          || new Date(s.departureTime) >= new Date(f.arrivalTime)) {
        showToast(`Điểm dừng #${i + 1}: giờ đến và giờ đi phải nằm giữa giờ khởi hành và giờ đến của chuyến bay.`, 'error');
        return;
      }
      const stopDur = (new Date(s.departureTime) - new Date(s.arrivalTime)) / 60000;
      if (minStopDuration != null && stopDur < minStopDuration) {
        showToast(`Điểm dừng #${i + 1}: thời gian dừng phải tối thiểu ${minStopDuration} phút (theo quy định).`, 'error');
        return;
      }
      if (maxStopDuration != null && stopDur > maxStopDuration) {
        showToast(`Điểm dừng #${i + 1}: thời gian dừng vượt quá quy định (tối đa ${maxStopDuration} phút).`, 'error');
        return;
      }
    }
    const flightStops = stops.map((s, i) => ({
      airportStopId: Number(s.airportStopId),
      arrivalTime: toIsoDateTime(s.arrivalTime),
      departureTime: toIsoDateTime(s.departureTime),
      stopOrder: i + 1,
    }));

    // ── SỬA (giữ nguyên máy bay/ghế; cho đổi tuyến, giờ, giá, trạng thái, điểm dừng) ──
    if (editingId) {
      try {
        await flightService.update(editingId, {
          flightCode: f.flightCode.trim(),
          routeId: Number(f.routeId),
          departureTime: toIsoDateTime(f.departureTime),
          estimateDuration,
          basePrice: Number(f.basePrice),
          status: f.status,
          flightStops,
        });
        setShowAddModal(false);
        setEditingId(null);
        setNewFlight(EMPTY_FLIGHT);
        await loadFlights();
        showToast('Đã cập nhật chuyến bay!');
      } catch (err) {
        showToast(errMsg(err, 'Cập nhật chuyến bay thất bại.'), 'error');
      }
      return;
    }

    // ── TẠO MỚI ──
    const payload = {
      flightCode: f.flightCode.trim(),
      airplaneId: Number(f.airplaneId),
      routeId: Number(f.routeId),
      departureTime: toIsoDateTime(f.departureTime),
      estimateDuration,
      basePrice: Number(f.basePrice),
      status: f.status,
      flightStops,
    };
    try {
      await flightService.create(payload);
      setShowAddModal(false);
      setNewFlight(EMPTY_FLIGHT);
      await loadFlights(); // tải lại từ DB để có sơ đồ ghế thật
      showToast('Đã thêm chuyến bay và lưu vào DB!');
    } catch (err) {
      showToast(errMsg(err, 'Thêm chuyến bay thất bại.'), 'error');
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setNewFlight(EMPTY_FLIGHT);
    setShowAddModal(true);
  };

  const openEdit = (fl) => {
    setEditingId(fl.dbId);
    setNewFlight({
      flightCode: fl.id,
      airplaneId: fl.airplaneId || '',
      routeId: fl.routeId || '',
      departureTime: fl.departureTimeRaw || '',
      arrivalTime: addMinutesToDateTime(fl.departureTimeRaw, fl.estimateDuration || 0),
      basePrice: fl.price || 0,
      status: fl.status || 'SCHEDULED',
      stops: (fl.stops || []).map(s => ({ ...s })),
    });
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setNewFlight(EMPTY_FLIGHT);
  };

  const deleteFlight = async (fl) => {
    if (!fl.dbId) {
      setFlights(prev => prev.filter(x => x.id !== fl.id));
      showToast('Đã xóa chuyến bay (cục bộ).');
      return;
    }
    try {
      await flightService.delete(fl.dbId);
      if (selectedFlight?.dbId === fl.dbId) setSelectedFlight(null);
      await loadFlights();
      showToast('Đã xóa chuyến bay.');
    } catch (e) {
      showToast(errMsg(e, 'Xóa chuyến bay thất bại.'), 'error');
    }
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
      {toast.msg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[280px] max-w-[90vw]"
          style={{ backgroundColor: toast.type === 'error' ? '#DC2626' : '#16A34A' }}>
          {toast.type === 'error' ? <X className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{toast.msg}</span>
          <button onClick={() => setToast({ msg: '', type: toast.type })}><X className="w-4 h-4 opacity-70" /></button>
        </div>
      )}
      {/* ── Tiêu đề ── */}
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chuyến bay</h1>
          <p className="text-gray-500 mt-1">Chọn chuyến bay để xem và quản lý sơ đồ chỗ ngồi</p>
        </div>
        <button
          onClick={openCreate}
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <span className="text-xl leading-none">+</span> Thêm chuyến bay mới
        </button>
      </div>

      {/* ── Danh sách chuyến bay ── */}
      <div className="grid grid-cols-2 gap-4 mb-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {flights.map(f => (
          <div
            key={f.id}
            onClick={() => handleSelectFlight(f)}
            role="button"
            tabIndex={0}
            className={`cursor-pointer text-left rounded-xl p-4 border-2 transition-all relative overflow-hidden ${selectedFlight?.id === f.id ? 'shadow-md' : 'shadow-sm hover:shadow'}`}
            style={{
              borderColor: selectedFlight?.id === f.id ? '#003366' : '#E2E8F0',
              backgroundColor: '#fff',
            }}
          >
            {selectedFlight?.id === f.id && <div className="absolute top-0 left-0 right-0 h-1 bg-[#C0A062]" />}
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-base text-[#003366]">{f.id}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-[#003366] font-medium border border-slate-200">{f.aircraft}</span>
                <button onClick={(e) => { e.stopPropagation(); openEdit(f); }} title="Sửa"
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                <button onClick={(e) => { e.stopPropagation(); deleteFlight(f); }} title="Xóa"
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
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
          </div>
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
          <div className="bg-white rounded-2xl p-6 w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">{editingId ? 'Sửa chuyến bay' : 'Thêm chuyến bay mới'}</h2>

            {!editingId && (airplanes.length === 0 || routes.length === 0) && (
              <div className="mb-4 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3">
                Cần có sẵn <b>máy bay</b> và <b>tuyến bay</b> trong DB để tạo chuyến bay. Hãy tạo chúng trước.
              </div>
            )}

            <form onSubmit={handleAddFlight} noValidate className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Mã chuyến bay</label>
                <input type="text" value={newFlight.flightCode} onChange={e => setNF('flightCode', e.target.value)} className="w-full border rounded p-2 text-sm" placeholder="VD: VN999" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Máy bay {editingId && <span className="text-gray-400 normal-case">(không đổi)</span>}</label>
                  <select value={newFlight.airplaneId} onChange={e => setNF('airplaneId', e.target.value)} disabled={!!editingId}
                    className="w-full border rounded p-2 text-sm disabled:bg-slate-100 disabled:text-slate-500">
                    <option value="">— Chọn máy bay —</option>
                    {airplanes.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.airplaneCode}{a.airlineName ? ` · ${a.airlineName}` : ''}{a.totalSeats ? ` (${a.totalSeats} ghế)` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Tuyến bay</label>
                  <select value={newFlight.routeId} onChange={e => setNF('routeId', e.target.value)} className="w-full border rounded p-2 text-sm">
                    <option value="">— Chọn tuyến —</option>
                    {routes.map(r => <option key={r.id} value={r.id}>{r.routeCode}</option>)}
                  </select>
                </div>
              </div>

              {editingId && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Trạng thái</label>
                  <select value={newFlight.status} onChange={e => setNF('status', e.target.value)} className="w-full border rounded p-2 text-sm">
                    {FLIGHT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giờ khởi hành</label>
                  <input type="datetime-local" required value={newFlight.departureTime} onChange={e => setNF('departureTime', e.target.value)} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giờ đến</label>
                  <input type="datetime-local" required value={newFlight.arrivalTime} onChange={e => setNF('arrivalTime', e.target.value)} className="w-full border rounded p-2 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Giá cơ bản (VNĐ)</label>
                  <input type="number" min={1} required value={newFlight.basePrice} onChange={e => setNF('basePrice', e.target.value)} className="w-full border rounded p-2 text-sm" />
                </div>
              </div>

              {/* Điểm dừng (không bắt buộc; đã thêm thì phải nhập đủ; tối đa theo quy định) */}
              <div className="border-t pt-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    Điểm dừng {maxStops != null ? `(không bắt buộc, tối đa ${maxStops})` : '(không bắt buộc)'}
                  </label>
                  <button type="button" onClick={addStop} disabled={maxStops != null && newFlight.stops.length >= maxStops}
                    className="text-xs font-semibold text-[#003366] hover:underline disabled:opacity-40 disabled:cursor-not-allowed disabled:no-underline">+ Thêm điểm dừng</button>
                </div>
                {newFlight.stops.length === 0 && (
                  <p className="text-xs text-gray-400 mb-2">Chưa có điểm dừng nào (có thể để trống).</p>
                )}
                <div className="space-y-3">
                  {newFlight.stops.map((s, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-gray-500">Điểm dừng #{i + 1}</span>
                        <button type="button" onClick={() => removeStop(i)} className="text-xs text-red-500 hover:underline">Xóa</button>
                      </div>
                      <select required value={s.airportStopId} onChange={e => setStop(i, 'airportStopId', e.target.value)} className="w-full border rounded p-2 text-sm mb-2">
                        <option value="">— Chọn sân bay dừng —</option>
                        {airports.map(a => <option key={a.id} value={a.id}>{a.airportCode} - {a.city}</option>)}
                      </select>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Giờ đến</label>
                          <input type="datetime-local" required value={s.arrivalTime} onChange={e => setStop(i, 'arrivalTime', e.target.value)} className="w-full border rounded p-2 text-sm" />
                        </div>
                        <div>
                          <label className="block text-[11px] text-gray-500 mb-1">Giờ đi</label>
                          <input type="datetime-local" required value={s.departureTime} onChange={e => setStop(i, 'departureTime', e.target.value)} className="w-full border rounded p-2 text-sm" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full bg-[#003366] hover:bg-[#002244] text-white font-bold py-3 rounded-lg mt-4 transition-colors">
                {editingId ? 'Cập nhật chuyến bay' : 'Lưu chuyến bay'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
