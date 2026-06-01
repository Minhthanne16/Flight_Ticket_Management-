import { useState, useMemo } from 'react';
import {
  PlaneTakeoff, AlertCircle,
  TrendingUp, Users, Plane, Bell,
  CheckCircle2, X, Clock, Activity, Loader2
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { flightService } from '../../api/services/flightService';
import { notificationService } from '../../api/services/notificationService';
import { ADMIN_STAFF, ADMIN_FLIGHTS } from '../../data/adminMockData';

const getStatusColor = (status) => ({
  SCHEDULED: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
  BOARDING: 'text-violet-700 bg-violet-50 border border-violet-200',
  DELAYED: 'text-red-600 bg-red-50 border border-red-200',
  DEPARTED: 'text-amber-700 bg-amber-50 border border-amber-200',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  CANCELLED: 'text-slate-500 bg-slate-100 border border-slate-200',
}[status] || 'text-slate-500 bg-slate-100 border border-slate-200');

const STATUS_FILTERS = ['ALL', 'SCHEDULED', 'BOARDING', 'DELAYED', 'DEPARTED', 'COMPLETED', 'CANCELLED'];
const STATUS_LABELS = {
  ALL: 'Tất cả',
  SCHEDULED: 'Đã lên lịch',
  BOARDING: 'Đang lên máy bay',
  DELAYED: 'Trễ chuyến',
  DEPARTED: 'Đã cất cánh',
  COMPLETED: 'Đã hạ cánh',
  CANCELLED: 'Đã hủy',
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

function StatCard({ label, value, sub, icon: Icon, iconColor, iconIconColor, loading }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          {loading ? <Loader2 className={`w-4 h-4 animate-spin ${iconIconColor}`} /> : Icon && <Icon className={`w-4 h-4 ${iconIconColor}`} />}
        </div>
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5">
        {loading ? <span className="inline-block w-24 h-7 bg-slate-100 rounded animate-pulse" /> : value}
      </div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{loading ? '' : sub}</p>}
    </div>
  );
}

function DelayNotifyModal({ flight, onClose, onSent }) {
  const [message, setMessage] = useState(
    `Kính gửi Quý khách,\n\nChuyến bay ${flight.flightCode} bị trễ do sự cố kỹ thuật.\n\nChúng tôi thành thật xin lỗi vì sự bất tiện này. Vui lòng theo dõi bảng thông báo tại sân bay.\n\nTrân trọng,\nEasyFlight`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      await notificationService.create({
        title: `Cập nhật trễ chuyến ${flight.flightCode}`,
        content: message,
        userId: 1, // Default system user or dynamic staff user
        type: 'FLIGHT_UPDATED',
        channel: 'IN_APP'
      });
      onSent(`Đã gửi thông báo delay cho chuyến ${flight.flightCode}`);
      onClose();
    } catch (err) {
      console.error('Failed to send delay notification:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">Gửi thông báo delay</h3>
            <p className="text-xs text-slate-400 mt-0.5">{flight.flightCode}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div className="text-xs text-red-700 font-semibold">Chuyến bay DELAYED — {flight.flightCode}</div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Nội dung thông báo</label>
            <textarea
              value={message} onChange={e => setMessage(e.target.value)} rows={7}
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all resize-none leading-relaxed"
            />
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">Huỷ</button>
          <button onClick={handleSend} disabled={sending}
            className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-60">
            <Bell className="w-4 h-4" />
            {sending ? 'Đang gửi...' : 'Gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffDashboard() {
  const [toasts, setToasts] = useState([]);
  const [notifyFlight, setNotifyFlight] = useState(null);
  const [notifiedIds, setNotifiedIds] = useState(new Set());
  const [statusFilter, setStatusFilter] = useState('ALL');

  const staffName = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'STAFF') {
        const stored = localStorage.getItem('local_staff_profile');
        if (stored) {
          const profile = JSON.parse(stored);
          if (profile.email === user.email && profile.fullName) return profile.fullName;
        }
        
        const mockProfile = ADMIN_STAFF.find(s => s.email === user.email);
        if (mockProfile) return mockProfile.fullName;

        return user.fullName || 'EasyFlight Staff';
      }
      return user.fullName || user.name || user.email || 'Nhân viên';
    } catch { return 'Nhân viên'; }
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // Real API calls
  const { data: flights, loading: flightsLoading, error: flightsError } = useApi(
    () => flightService.search({}),
    []
  );

  const addToast = (msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  };

  const handleSent = (msg) => {
    if (notifyFlight) setNotifiedIds(prev => new Set([...prev, notifyFlight.id]));
    addToast(msg);
  };

  const greeting = now.getHours() < 12 ? 'Chào buổi sáng' : now.getHours() < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  const MOCK_FLIGHTS = ADMIN_FLIGHTS.map(f => ({
    id: f.id,
    flightCode: f.id,
    airlineName: f.airline,
    departureAirportCode: f.from,
    arrivalAirportCode: f.to,
    departureTime: `${f.date}T${f.dep}:00`,
    arrivalTime: `${f.date}T${f.arr}:00`,
    status: f.status,
  }));

  const allFlights = useMemo(() => {
    const rawList = (flights && flights.length > 0) ? flights : MOCK_FLIGHTS;
    try {
      const statuses = JSON.parse(localStorage.getItem('local_flight_statuses') || '{}');
      return rawList.map(f => ({ ...f, status: statuses[f.id] || f.status }));
    } catch {
      return rawList;
    }
  }, [flights, MOCK_FLIGHTS]);

  const displayFlights = statusFilter === 'ALL'
    ? allFlights
    : allFlights.filter(f => f.status === statusFilter);

  const pendingDelays = allFlights.filter(f => f.status === 'DELAYED' && !notifiedIds.has(f.id));

  const activeFlights = allFlights.filter(f => ['BOARDING', 'SCHEDULED', 'DEPARTED'].includes(f.status)).length;
  const arrivedFlights = allFlights.filter(f => f.status === 'COMPLETED').length;



  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(p => p.filter(t => t.id !== id))} />
      {notifyFlight && (
        <DelayNotifyModal
          flight={notifyFlight}
          onClose={() => setNotifyFlight(null)}
          onSent={(msg) => handleSent(msg)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{greeting}, {staffName} 👋</h1>
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Plane} iconColor="bg-indigo-50" iconIconColor="text-indigo-500"
          label="Chuyến bay hôm nay" value={allFlights.length}
          loading={flightsLoading}
        />
        <StatCard
          icon={PlaneTakeoff} iconColor="bg-emerald-50" iconIconColor="text-emerald-500"
          label="Đang hoạt động" value={activeFlights}
          sub={`${arrivedFlights} đã hạ cánh`}
          loading={flightsLoading}
        />
        <StatCard
          icon={Users} iconColor="bg-amber-50" iconIconColor="text-amber-500"
          label="Chuyến bị delay" value={pendingDelays.length}
          sub={pendingDelays.length > 0 ? 'Cần xử lý ngay' : 'Không có sự cố'}
          loading={flightsLoading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Flights Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Tất cả chuyến bay</h2>
            <span className="text-xs text-slate-400">{displayFlights.length} chuyến</span>
          </div>

          {/* Status filter tabs */}
          <div className="px-5 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                  statusFilter === s
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                }`}>
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
                  <th className="px-5 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {flightsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 4 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-slate-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : flightsError ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-red-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-300" />
                      {flightsError}
                    </td>
                  </tr>
                ) : displayFlights.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">
                      <Plane className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                      Không có chuyến bay nào
                    </td>
                  </tr>
                ) : (
                  displayFlights.map((flight) => (
                    <tr key={flight.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-sm">✈</div>
                          <div>
                            <div className="text-sm font-bold text-slate-700">{flight.flightCode}</div>
                            <div className="text-xs text-slate-400">{flight.airlineName || 'EasyFlight'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                        {flight.departureAirportCode && flight.arrivalAirportCode
                          ? `${flight.departureAirportCode} → ${flight.arrivalAirportCode}`
                          : flight.flightCode}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-slate-700">
                          {flight.departureTime
                            ? new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                            : '—'}
                        </div>
                        <div className="text-xs text-slate-400">
                          {flight.departureTime
                            ? new Date(flight.departureTime).toLocaleDateString('vi-VN')
                            : ''}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getStatusColor(flight.status)}`}>
                          {flight.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Delay alerts */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <h2 className="text-sm font-bold text-slate-800">Cảnh báo delay</h2>
            </div>
            <div className="p-3 space-y-2">
              {flightsLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                </div>
              ) : pendingDelays.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">Không có chuyến bay bị delay</p>
              ) : (
                pendingDelays.map(flight => (
                  <div key={flight.id} className="bg-red-50 border border-red-100 rounded-xl p-3.5">
                    <p className="text-sm font-bold text-red-800">{flight.flightCode}</p>
                    <p className="text-xs text-red-600 mt-0.5">
                      {flight.departureAirportCode} → {flight.arrivalAirportCode}
                    </p>
                    <button
                      onClick={() => setNotifyFlight(flight)}
                      className="w-full mt-2.5 flex items-center justify-center gap-2 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      <Bell className="w-3.5 h-3.5" /> Gửi thông báo khách hàng
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>


          {/* Flight count summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Tổng quan chuyến bay
            </h3>
            {[
              { label: 'Tổng chuyến bay', value: allFlights.length, color: 'bg-indigo-500' },
              { label: 'Đang hoạt động', value: activeFlights, color: 'bg-emerald-500' },
              { label: 'Đã hạ cánh', value: arrivedFlights, color: 'bg-slate-300' },
              { label: 'Bị delay', value: allFlights.filter(f => f.status === 'DELAYED').length, color: 'bg-red-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.color}`} />
                  <span className="text-xs text-slate-600">{item.label}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">
                  {flightsLoading ? '—' : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StaffDashboard;