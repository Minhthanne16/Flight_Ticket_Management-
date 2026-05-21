import { useState } from 'react';
import {
  PlaneTakeoff, AlertCircle,
  TrendingUp, Users, Plane, Bell, CheckCircle2,
  X, Clock, Activity, ChevronRight
} from 'lucide-react';
import { FLIGHTS, DASHBOARD_METRICS, ACTIVITY_LOG, STAFF_USER } from '../../data/sharedData';

const getStatusColor = (status) => ({
  BOARDING: 'text-violet-700 bg-violet-50 border border-violet-200',
  SCHEDULED: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
  'CHECK-IN': 'text-amber-700 bg-amber-50 border border-amber-200',
  DELAYED: 'text-red-600 bg-red-50 border border-red-200',
  ARRIVED: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
}[status] || 'text-slate-500 bg-slate-100 border border-slate-200');

const STATUS_FILTERS = ['ALL', 'BOARDING', 'SCHEDULED', 'CHECK-IN', 'DELAYED', 'ARRIVED'];
const STATUS_LABELS = {
  ALL: 'Tất cả',
  BOARDING: 'Boarding',
  SCHEDULED: 'Scheduled',
  'CHECK-IN': 'Check-in',
  DELAYED: 'Delay',
  ARRIVED: 'Đã hạ cánh',
};

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[280px] bg-violet-600">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, iconColor, iconIconColor }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          {Icon && <Icon className={`w-4 h-4 ${iconIconColor}`} />}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function DelayNotifyModal({ flight, onClose, onSent }) {
  const [message, setMessage] = useState(
    `Kính gửi Quý khách,\n\nChuyến bay ${flight.id} (${flight.route}) bị trễ ${flight.delayInfo.delay} do ${flight.delayInfo.reason}.\n\nChúng tôi thành thật xin lỗi vì sự bất tiện này. Vui lòng theo dõi bảng thông báo tại sân bay.\n\nTrân trọng,\nEasyFlight`
  );
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSent(`Đã gửi thông báo đến ${flight.capacity.booked} hành khách chuyến ${flight.id}`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Gửi thông báo delay</h3>
            <p className="text-xs text-slate-400 mt-0.5">{flight.id} · {flight.capacity.booked} hành khách</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div className="text-xs text-red-700">
              <span className="font-semibold">Delay {flight.delayInfo.delay}</span> — {flight.delayInfo.reason}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nội dung thông báo</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={7}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-2 text-xs text-slate-400">
            <span className="bg-slate-100 px-2 py-1 rounded-lg">📧 Email</span>
            <span className="bg-slate-100 px-2 py-1 rounded-lg">📱 SMS</span>
            <span className="bg-slate-100 px-2 py-1 rounded-lg">🔔 App Push</span>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            Huỷ
          </button>
          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60"
          >
            <Bell className="w-4 h-4" />
            {sending ? 'Đang gửi...' : `Gửi tới ${flight.capacity.booked} khách`}
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const [toasts, setToasts] = useState([]);
  const [notifyFlight, setNotifyFlight] = useState(null);
  // Track which flight IDs have already been notified — hide their alert after sending
  const [notifiedIds, setNotifiedIds] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('ALL');

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleSent = (flightId, msg) => {
    setNotifiedIds(prev => new Set([...prev, flightId]));
    addToast(msg);
  };

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Chào buổi sáng' : now.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  // All flights, filtered by status tab
  const displayFlights = statusFilter === 'ALL'
    ? FLIGHTS
    : FLIGHTS.filter(f => f.status === statusFilter);

  // Only show delay alerts that haven't been notified yet
  const pendingDelays = FLIGHTS.filter(f => f.status === 'DELAYED' && f.delayInfo && !notifiedIds.has(f.id));

  // Stats
  const totalBooked = FLIGHTS.reduce((sum, f) => sum + f.capacity.booked, 0);
  const totalSeats = FLIGHTS.reduce((sum, f) => sum + f.capacity.total, 0);
  const activeFlights = FLIGHTS.filter(f => ['BOARDING', 'SCHEDULED', 'CHECK-IN'].includes(f.status)).length;
  const arrivedFlights = FLIGHTS.filter(f => f.status === 'ARRIVED').length;

  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      {notifyFlight && (
        <DelayNotifyModal
          flight={notifyFlight}
          onClose={() => setNotifyFlight(null)}
          onSent={(msg) => handleSent(notifyFlight.id, msg)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{greeting}, {STAFF_USER.name} 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {pendingDelays.length > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {pendingDelays.length} chuyến bay bị delay
          </div>
        )}
      </div>

      {/* Stats — no trend/comparison */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp} iconColor="bg-violet-50" iconIconColor="text-violet-500"
          label="Doanh thu tháng này" value={DASHBOARD_METRICS.revenue.total}
        />
        <StatCard
          icon={Plane} iconColor="bg-indigo-50" iconIconColor="text-indigo-500"
          label="Đặt vé hôm nay" value={DASHBOARD_METRICS.bookings.today}
        />
        <StatCard
          icon={PlaneTakeoff} iconColor="bg-emerald-50" iconIconColor="text-emerald-500"
          label="Chuyến bay hôm nay" value={FLIGHTS.length}
          sub={`${activeFlights} đang hoạt động · ${arrivedFlights} đã hạ cánh`}
        />
        <StatCard
          icon={Users} iconColor="bg-amber-50" iconIconColor="text-amber-500"
          label="Tỷ lệ lấp đầy" value={`${Math.round((totalBooked / totalSeats) * 100)}%`}
          sub={`${totalBooked.toLocaleString()} / ${totalSeats.toLocaleString()} ghế`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Flights Table — all flights + filter tabs */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Tất cả chuyến bay hôm nay</h2>
            <span className="text-xs text-slate-400">{displayFlights.length} chuyến</span>
          </div>

          {/* Status filter tabs */}
          <div className="px-5 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  statusFilter === s
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {STATUS_LABELS[s]}
                {s === 'DELAYED' && pendingDelays.length > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">
                    {pendingDelays.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="overflow-x-auto max-h-[480px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-100 bg-slate-50/90 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Chuyến bay</th>
                  <th className="px-5 py-3">Tuyến</th>
                  <th className="px-5 py-3">Giờ bay</th>
                  <th className="px-5 py-3">Tải</th>
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {displayFlights.map((flight) => {
                  const loadPct = Math.round((flight.capacity.booked / flight.capacity.total) * 100);
                  return (
                    <tr key={flight.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">{flight.logo}</div>
                          <div>
                            <div className="text-sm font-bold text-slate-700">{flight.id}</div>
                            <div className="text-xs text-slate-400">{flight.airline}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">{flight.route}</td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-700">{flight.departure.time}</div>
                        <div className="text-xs text-slate-400">{flight.departure.date}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                          <div
                            className={`h-full rounded-full ${loadPct > 90 ? 'bg-red-400' : loadPct > 70 ? 'bg-amber-400' : 'bg-violet-500'}`}
                            style={{ width: `${loadPct}%` }}
                          />
                        </div>
                        <div className="text-xs text-slate-400">{flight.capacity.booked}/{flight.capacity.total} · {loadPct}%</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {displayFlights.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-400">
                      Không có chuyến bay nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Delay alerts — only show if there are pending delays */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold text-slate-800">Cảnh báo delay</h2>
            </div>
            <div className="p-3 space-y-2">
              {pendingDelays.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-3">Không có chuyến bay bị delay</p>
              ) : (
                pendingDelays.map(flight => (
                  <div key={flight.id} className="bg-red-50 border border-red-100 rounded-xl p-3.5">
                    <p className="text-sm font-bold text-red-800">{flight.id} — delay {flight.delayInfo.delay}</p>
                    <p className="text-xs text-red-600 mt-0.5">{flight.route} · {flight.capacity.booked} khách</p>
                    <p className="text-xs text-red-500 mt-1">{flight.delayInfo.reason}</p>
                    <button
                      onClick={() => setNotifyFlight(flight)}
                      className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      <Bell className="w-3.5 h-3.5" /> Gửi thông báo khách hàng
                    </button>
                  </div>
                ))
              )}

            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-800">Hoạt động gần đây</h2>
            </div>
            <div className="p-3 space-y-1">
              {ACTIVITY_LOG.map(item => (
                <div key={item.id} className="flex items-start gap-3 px-2 py-2.5 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${item.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-700 leading-relaxed">{item.text}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-2.5 h-2.5" /> {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tỷ lệ lấp đầy hôm nay</h3>
            <div className="text-2xl font-bold text-slate-800 mb-1">
              {Math.round((totalBooked / totalSeats) * 100)}%
            </div>
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-gradient-to-r from-violet-400 to-purple-600 rounded-full transition-all"
                style={{ width: `${Math.round((totalBooked / totalSeats) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">
              {totalBooked.toLocaleString()} / {totalSeats.toLocaleString()} ghế đã đặt
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;