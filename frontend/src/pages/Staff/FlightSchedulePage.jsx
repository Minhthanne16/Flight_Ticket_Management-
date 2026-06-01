import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, ChevronLeft, ChevronRight,
  X, CheckCircle2, Bell, AlertCircle, Clock, Plane, Loader2, Download,
  Route as RouteIcon, ArrowRight
} from 'lucide-react';
import { useApi } from '../../hooks/useApi';
import { flightService } from '../../api/services/flightService';
import { routeService } from '../../api/services/routeService';
import api from '../../api/axios';
import { notificationService } from '../../api/services/notificationService';
import { ADMIN_FLIGHTS, ROUTES as MOCK_ROUTES } from '../../data/adminMockData';

const STATUS_OPTIONS = ['All', 'SCHEDULED', 'BOARDING', 'DELAYED', 'DEPARTED', 'COMPLETED', 'CANCELLED'];
const STATUS_LABELS = {
  All: 'Tất cả trạng thái',
  SCHEDULED: 'Đã lên lịch',
  BOARDING: 'Đang lên máy bay',
  DELAYED: 'Trễ chuyến',
  DEPARTED: 'Đã cất cánh',
  COMPLETED: 'Đã hạ cánh',
  CANCELLED: 'Đã hủy',
};
const PAGE_SIZE = 8;

const statusStyle = {
  BOARDING: 'text-violet-700 bg-violet-50 border border-violet-200',
  SCHEDULED: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
  DELAYED: 'text-red-600 bg-red-50 border border-red-200',
  DEPARTED: 'text-blue-700 bg-blue-50 border border-blue-200',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  CANCELLED: 'text-slate-500 bg-slate-50 border border-slate-200',
};

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[260px] bg-violet-600">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </div>
      ))}
    </div>
  );
}

function NotifyModal({ flight, onClose, onSent }) {
  const isDelayed = flight.status === 'DELAYED';
  const [delayMins, setDelayMins] = useState('45');
  const [reason, setReason] = useState('Thời tiết');
  const [body, setBody] = useState(`Kính gửi Quý khách đi chuyến ${flight.flightCode},\n\n[Nhập nội dung thông báo tại đây]\n\nTrân trọng,\nEasyFlight`);
  const [sending, setSending] = useState(false);
  const REASONS = ['Thời tiết', 'Chờ máy bay trước', 'Kỹ thuật', 'Điều phối bay', 'Khác'];

  const depTime = flight.departureTime ? new Date(flight.departureTime) : null;

  const addMinutes = (date, mins) => {
    if (!date) return '';
    const d = new Date(date.getTime() + Number(mins) * 60000);
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const route = flight.departureAirportCode && flight.arrivalAirportCode
    ? `${flight.departureAirportCode} → ${flight.arrivalAirportCode}`
    : flight.flightCode;

  const delayMessage = `Kính gửi Quý khách đi chuyến ${flight.flightCode} (${route}),\n\nChuyến bay của Quý khách bị delay ${delayMins} phút do ${reason}.\nGiờ khởi hành dự kiến mới: ${addMinutes(depTime, delayMins)}.\n\nChúng tôi thành thật xin lỗi vì sự bất tiện này.\n\nTrân trọng,\nEasyFlight`;

  const handleSend = async () => {
    setSending(true);
    try {
      const title = isDelayed
        ? `Thông báo delay chuyến bay ${flight.flightCode}`
        : `Thông báo khẩn cấp chuyến bay ${flight.flightCode}`;
      const content = isDelayed ? delayMessage : body;

      await notificationService.create({
        title,
        content,
        userId: 1, // Default user
        type: 'FLIGHT_UPDATED',
        channel: 'EMAIL'
      });

      onSent(flight.flightCode);
      onClose();
    } catch (err) {
      console.error('Failed to send flight notification:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">{isDelayed ? 'Thông báo delay' : 'Gửi thông báo'} — {flight.flightCode}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{route}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4 max-h-[400px] overflow-y-auto">
          {isDelayed ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Delay (phút)</label>
                  <input type="number" value={delayMins} onChange={e => setDelayMins(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Lý do</label>
                  <select value={reason} onChange={e => setReason(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm mt-1">
                    {REASONS.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <textarea readOnly value={delayMessage} rows={6} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 resize-none" />
            </>
          ) : (
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={7}
              className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none outline-none focus:ring-1 focus:ring-violet-500" />
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Huỷ</button>
          <button onClick={handleSend} disabled={sending}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 disabled:opacity-50">
            {sending ? 'Đang gửi...' : 'Gửi thông báo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FlightSchedulePage() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('flights');

  const querySearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(querySearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [routeSearch, setRouteSearch] = useState('');
  const [routePage, setRoutePage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [notifyModal, setNotifyModal] = useState(null);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const { data: rawFlights, loading, error, refetch } = useApi(
    () => flightService.search({}), []
  );

  const { data: rawRoutes } = useApi(
    () => routeService.getAll(), []
  );

  const flights = (rawFlights && rawFlights.length > 0) ? rawFlights : ADMIN_FLIGHTS.map(f => ({
    id: f.id,
    flightCode: f.id,
    airlineName: f.airline,
    departureAirportCode: f.from,
    arrivalAirportCode: f.to,
    departureTime: `${f.date}T${f.dep}:00`,
    arrivalTime: `${f.date}T${f.arr}:00`,
    status: f.status,
    basePrice: f.basePrice,
    totalSeats: f.totalSeats,
    bookedSeats: f.bookedSeats,
  }));

  const routes = (rawRoutes && rawRoutes.length > 0) ? rawRoutes : MOCK_ROUTES.map(r => ({
    id: r.id,
    routeCode: `${r.from}-${r.to}`,
    departureAirportId: r.from,
    arrivalAirportId: r.to,
    status: r.status,
  }));

  const addToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const routesData = useMemo(() => {
    return routes.map(r => {
      const parts = r.routeCode ? r.routeCode.split('-') : [];
      const depCode = parts[0] || `Sân bay #${r.departureAirportId}`;
      const arrCode = parts[1] || `Sân bay #${r.arrivalAirportId}`;
      return {
        id: r.id,
        routeCode: r.routeCode || `R-${r.departureAirportId}-${r.arrivalAirportId}`,
        departureAirport: depCode,
        arrivalAirport: arrCode,
        status: r.status || 'ACTIVE',
      };
    });
  }, [routes]);

  const filteredRoutes = useMemo(() => {
    return routesData.filter(r => {
      const q = routeSearch.toLowerCase();
      if (!q) return true;
      return String(r.id).toLowerCase().includes(q)
        || (r.routeCode || '').toLowerCase().includes(q)
        || (r.departureAirport || '').toLowerCase().includes(q)
        || (r.arrivalAirport || '').toLowerCase().includes(q);
    });
  }, [routesData, routeSearch]);

  const routePageSize = 8;
  const totalRoutePages = Math.max(1, Math.ceil(filteredRoutes.length / routePageSize));
  const paginatedRoutes = filteredRoutes.slice((routePage - 1) * routePageSize, routePage * routePageSize);

  const handleExportRoutesReport = () => {
    if (filteredRoutes.length === 0) {
      addToast("Không có dữ liệu tuyến bay nào để xuất báo cáo!");
      return;
    }

    let csvContent = "\ufeff"; // UTF-8 BOM
    csvContent += "ID Tuyến bay,Mã tuyến bay,Sân bay đi,Sân bay đến,Trạng thái\n";

    filteredRoutes.forEach(r => {
      const statusLabel = r.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động';
      const row = `"${r.id}","${r.routeCode}","${r.departureAirport}","${r.arrivalAirport}","${statusLabel}"`;
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    link.setAttribute("download", `Bao_cao_tuyen_bay_${dateStr}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Đã xuất báo cáo tuyến bay thành công!");
  };

  const filtered = useMemo(() => {
    return flights.filter(f => {
      const q = search.toLowerCase();
      const route = f.departureAirportCode && f.arrivalAirportCode
        ? `${f.departureAirportCode} → ${f.arrivalAirportCode}` : '';
      const matchSearch = !q
        || (f.flightCode || '').toLowerCase().includes(q)
        || route.toLowerCase().includes(q)
        || (f.airlineName || '').toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || f.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [flights, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSent = useCallback((code) => {
    addToast(`Đã gửi thông báo đến hành khách chuyến ${code}.`);
  }, [addToast]);

  const handleExportReport = () => {
    if (filtered.length === 0) {
      addToast("Không có dữ liệu chuyến bay nào để xuất báo cáo!");
      return;
    }

    let csvContent = "\ufeff"; // UTF-8 BOM
    csvContent += "Mã chuyến bay,Hãng hàng không,Tuyến bay,Giờ khởi hành,Giờ đến,Trạng thái\n";

    filtered.forEach(f => {
      const route = f.departureAirportCode && f.arrivalAirportCode
        ? `${f.departureAirportCode} -> ${f.arrivalAirportCode}` : '—';
      const depTime = f.departureTime ? new Date(f.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';
      const arrTime = f.arrivalTime ? new Date(f.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—';
      const statusLabel = STATUS_LABELS[f.status] || f.status || '—';
      const row = `"${f.flightCode || ''}","${f.airlineName || 'EasyFlight'}","${route}","${depTime}","${arrTime}","${statusLabel}"`;
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);

    const dateStr = new Date().toLocaleDateString('vi-VN').replace(/\//g, '-');
    link.setAttribute("download", `Bao_cao_lich_bay_${dateStr}.csv`);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast("Đã xuất báo cáo lịch bay thành công!");
  };

  const delayedCount = flights.filter(f => f.status === 'DELAYED').length;

  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {notifyModal && (
        <NotifyModal flight={notifyModal} onClose={() => setNotifyModal(null)} onSent={handleSent} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'flights' ? 'Lịch chuyến bay' : 'Thông tin tuyến bay'}
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {activeTab === 'flights' ? 'Theo dõi và gửi thông báo hành khách.' : 'Xem danh sách các đường bay hiện có trong hệ thống.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === 'flights' ? (
            <>
              {delayedCount > 0 && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4" /> {delayedCount} chuyến đang Delay
                </div>
              )}
              <button
                onClick={handleExportReport}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                title="Xuất báo cáo danh sách chuyến bay đang hiển thị"
              >
                <Download className="w-4 h-4" /> Xuất báo cáo
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 px-4 py-2 rounded-xl text-xs font-semibold">
                <RouteIcon className="w-4 h-4" /> Tổng: {routesData.length} tuyến bay
              </div>
              <button
                onClick={handleExportRoutesReport}
                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-emerald-600/10 cursor-pointer"
                title="Xuất báo cáo danh sách tuyến bay đang hiển thị"
              >
                <Download className="w-4 h-4" /> Xuất báo cáo
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200">
        {[
          ['flights', Plane, 'Chuyến bay'],
          ['routes', RouteIcon, 'Tuyến bay']
        ].map(([key, Icon, lbl]) => (
          <button
            key={key}
            onClick={() => { setActiveTab(key); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${activeTab === key
                ? 'border-violet-600 text-violet-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
          >
            <Icon className="w-4 h-4" />
            {lbl}
          </button>
        ))}
      </div>

      {/* Search & Filter & Table Section */}
      {activeTab === 'flights' ? (
        <>
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Tìm mã chuyến, tuyến bay..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 outline-none cursor-pointer">
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-5 py-4">Chuyến bay</th>
                    <th className="px-5 py-4">Tuyến bay</th>
                    <th className="px-5 py-4">Giờ bay</th>
                    <th className="px-5 py-4 text-center">Trạng thái</th>
                    <th className="px-5 py-4 text-center">Thông báo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 5 }).map((_, j) => (
                          <td key={j} className="px-5 py-4">
                            <div className="h-4 bg-slate-100 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : paginated.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <Plane className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                        <p className="text-sm text-slate-400">Không tìm thấy chuyến bay nào</p>
                      </td>
                    </tr>
                  ) : (
                    paginated.map((f) => {
                      const route = f.departureAirportCode && f.arrivalAirportCode
                        ? `${f.departureAirportCode} → ${f.arrivalAirportCode}` : '—';
                      const depTime = f.departureTime ? new Date(f.departureTime) : null;
                      const arrTime = f.arrivalTime ? new Date(f.arrivalTime) : null;
                      return (
                        <tr key={f.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-4">
                            <div className="text-sm font-bold text-slate-700">{f.flightCode}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{f.airlineName || 'EasyFlight'}</div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-600">{route}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {depTime ? depTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—'}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {arrTime ? `Đến: ${arrTime.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : ''}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <select
                              value={f.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                try {
                                  await flightService.updateStatus(f.id, newStatus);
                                  addToast(`Cập nhật trạng thái chuyến ${f.flightCode} thành ${STATUS_LABELS[newStatus]} thành công!`);
                                  refetch();
                                } catch (err) {
                                  addToast(err.message || 'Lỗi khi cập nhật trạng thái', 'error');
                                }
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase border cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/20 ${statusStyle[f.status] || 'text-slate-500 bg-slate-100 border-slate-200'}`}
                            >
                              <option value="SCHEDULED">Scheduled</option>
                              <option value="BOARDING">Boarding</option>
                              <option value="DEPARTED">Departed</option>
                              <option value="DELAYED">Delayed</option>
                              <option value="COMPLETED">Completed</option>
                              <option value="CANCELLED">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-5 py-4 text-center">
                            <button
                              onClick={() => setNotifyModal(f)}
                              className={`p-2 rounded-lg transition-all ${f.status === 'DELAYED'
                                  ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100'
                                  : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'
                                }`}
                              title="Gửi thông báo cho hành khách">
                              <Bell className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                Hiển thị {loading ? '—' : paginated.length} / {filtered.length} chuyến
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 disabled:opacity-20 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-2">{page} / {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 disabled:opacity-20 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={routeSearch} onChange={e => { setRouteSearch(e.target.value); setRoutePage(1); }}
                placeholder="Tìm mã tuyến, tên sân bay, thành phố..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <th className="px-5 py-4">ID Tuyến bay</th>
                    <th className="px-5 py-4">Mã tuyến bay</th>
                    <th className="px-5 py-4">Sân bay đi</th>
                    <th className="px-5 py-4">Sân bay đến</th>
                    <th className="px-5 py-4 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedRoutes.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center">
                        <RouteIcon className="w-8 h-8 mx-auto mb-2 text-slate-200" />
                        <p className="text-sm text-slate-400">Không tìm thấy tuyến bay nào</p>
                      </td>
                    </tr>
                  ) : (
                    paginatedRoutes.map((r) => (
                      <tr key={r.routeCode} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-bold text-slate-600">#{r.id}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm font-bold text-violet-600 bg-violet-50 px-2 py-1 rounded">{r.routeCode}</span>
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {r.departureAirport}
                        </td>
                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {r.arrivalAirport}
                        </td>
                        <td className="px-5 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${r.status === 'ACTIVE'
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                              : 'text-slate-500 bg-slate-100 border-slate-200'
                            }`}>
                            {r.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Route Pagination */}
            <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
                Hiển thị {paginatedRoutes.length} / {filteredRoutes.length} tuyến
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setRoutePage(p => Math.max(1, p - 1))} disabled={routePage === 1} className="p-2 disabled:opacity-20 cursor-pointer">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold px-2">{routePage} / {totalRoutePages}</span>
                <button onClick={() => setRoutePage(p => Math.min(totalRoutePages, p + 1))} disabled={routePage === totalRoutePages} className="p-2 disabled:opacity-20 cursor-pointer">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default FlightSchedulePage;