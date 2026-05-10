import { useState, useMemo, useCallback } from 'react';
import { Search, ChevronLeft, ChevronRight, X, CheckCircle2, Bell, AlertCircle, Clock, Plane, Users, CheckSquare, Square } from 'lucide-react';
import { FLIGHTS, BOOKINGS } from '../../data/sharedData';

const STATUS_OPTIONS = ['All', 'Boarding', 'Scheduled', 'On Time', 'Delayed'];
const PAGE_SIZE = 5;

const statusStyle = {
  Boarding: 'text-violet-700 bg-violet-50 border border-violet-200',
  Scheduled: 'text-indigo-700 bg-indigo-50 border border-indigo-200',
  Delayed: 'text-red-600 bg-red-50 border border-red-200',
  'On Time': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
};

// --- COMPONENT TOAST ---
function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[260px] bg-violet-600 animate-in slide-in-from-right">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </div>
      ))}
    </div>
  );
}

// --- COMPONENT GỬI THÔNG BÁO ---
function NotifyModal({ flight, onClose, onSent }) {
  const isDelayed = flight.flightStatus === 'Delayed';
  const passengers = useMemo(() =>
    BOOKINGS.filter(b => b.flight === flight.code && b.status !== 'Cancelled'),
    [flight.code]
  );

  const [step, setStep] = useState('passengers');
  const [selectedIds, setSelectedIds] = useState(new Set(passengers.map(p => p.id)));
  const [search, setSearch] = useState('');
  const [delayMins, setDelayMins] = useState('45');
  const [reason, setReason] = useState('Thời tiết');
  const [subject, setSubject] = useState('Thông báo từ EasyFlight');
  const [body, setBody] = useState(`Kính gửi Quý khách,\n\n[Nhập nội dung thông báo tại đây]\n\nTrân trọng,\nEasyFlight`);
  const [sending, setSending] = useState(false);

  const REASONS = ['Thời tiết', 'Chờ máy bay trước', 'Kỹ thuật', 'Điều phối bay', 'Khác'];

  function addMinutes(time, mins) {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const total = h * 60 + m + Number(mins);
    return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
  }

  const delayMessage = `Kính gửi Quý khách đi chuyến ${flight.code} (${flight.route}),\n\nChuyến bay của Quý khách bị delay ${delayMins} phút do ${reason}.\nGiờ khởi hành dự kiến mới: ${addMinutes(flight.dep, delayMins)}.\n\nChúng tôi thành thật xin lỗi vì sự bất tiện này.\n\nTrân trọng,\nEasyFlight`;

  const filteredPassengers = passengers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const allSelected = filteredPassengers.length > 0 && filteredPassengers.every(p => selectedIds.has(p.id));

  const toggleAll = () => {
    const ids = filteredPassengers.map(p => p.id);
    if (allSelected) {
      setSelectedIds(prev => { const s = new Set(prev); ids.forEach(id => s.delete(id)); return s; });
    } else {
      setSelectedIds(prev => new Set([...prev, ...ids]));
    }
  };

  const handleSend = () => {
    setSending(true);
    setTimeout(() => {
      setSending(false);
      onSent(flight.code, selectedIds.size);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-800">{isDelayed ? 'Thông báo delay' : 'Gửi thông báo'} — {flight.code}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{flight.route} · {passengers.length} hành khách</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex border-b border-slate-100">
          <button onClick={() => setStep('passengers')} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${step === 'passengers' ? 'border-violet-500 text-violet-600' : 'border-transparent text-slate-400'}`}>
            <Users className="w-3.5 h-3.5" /> Chọn hành khách ({selectedIds.size})
          </button>
          <button onClick={() => setStep('message')} className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${step === 'message' ? 'border-violet-500 text-violet-600' : 'border-transparent text-slate-400'}`}>
            <Bell className="w-3.5 h-3.5" /> Nội dung
          </button>
        </div>

        <div className="p-5" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {step === 'passengers' ? (
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="Tìm tên..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs outline-none" />
                <button onClick={toggleAll} className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50">
                  {allSelected ? 'Bỏ chọn hết' : 'Chọn hết'}
                </button>
              </div>
              {filteredPassengers.map(p => (
                <button key={p.id} onClick={() => setSelectedIds(prev => {const s=new Set(prev); s.has(p.id)?s.delete(p.id):s.add(p.id); return s;})} className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${selectedIds.has(p.id) ? 'bg-violet-50 border-violet-200' : 'border-slate-50 hover:bg-slate-50'}`}>
                   <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedIds.has(p.id) ? 'bg-violet-500 border-violet-500' : 'border-slate-300'}`}>
                    {selectedIds.has(p.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-slate-700">{p.name}</div>
                    <div className="text-[10px] text-slate-400">Ghế: {p.seat} · {p.id}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
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
                  <textarea readOnly value={delayMessage} rows={5} className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 resize-none" />
                </>
              ) : (
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={7} className="w-full p-3 border border-slate-200 rounded-xl text-xs text-slate-700 resize-none outline-none focus:ring-1 focus:ring-violet-500" />
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Huỷ</button>
          <button
            onClick={step === 'passengers' ? () => setStep('message') : handleSend}
            disabled={selectedIds.size === 0 || sending}
            className="px-6 py-2 bg-violet-600 text-white rounded-lg text-sm font-bold hover:bg-violet-700 disabled:opacity-50"
          >
            {sending ? 'Đang gửi...' : step === 'passengers' ? 'Tiếp theo' : `Gửi tới ${selectedIds.size} khách`}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- TRANG CHÍNH ---
function FlightSchedulePage() {
  const [flights, setFlights] = useState(FLIGHTS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);
  const [notifyModal, setNotifyModal] = useState(null);

  const addToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const filtered = useMemo(() => {
    return flights.filter(f => {
      const q = search.toLowerCase();
      const matchSearch = !q || f.code.toLowerCase().includes(q) || f.route.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || f.flightStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [flights, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSent = useCallback((code, count) => {
    addToast(`Đã gửi thông báo đến ${count} hành khách chuyến ${code}.`);
  }, [addToast]);

  const delayedCount = flights.filter(f => f.flightStatus === 'Delayed').length;

  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {notifyModal && (
        <NotifyModal flight={notifyModal} onClose={() => setNotifyModal(null)} onSent={handleSent} />
      )}

      {/* Header - Read Only */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lịch chuyến bay</h1>
          <p className="text-sm text-slate-400 mt-0.5">Dành cho nhân viên: Theo dõi và gửi thông báo hành khách.</p>
        </div>
        {delayedCount > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-xl text-xs font-semibold">
            <AlertCircle className="w-4 h-4" /> {delayedCount} chuyến đang Delay
          </div>
        )}
      </div>

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
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'Tất cả trạng thái' : s}</option>)}
        </select>
      </div>

      {/* Table - No Edit Action */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">Chuyến bay</th>
                <th className="px-5 py-4">Tuyến bay</th>
                <th className="px-5 py-4">Giờ bay</th>
                <th className="px-5 py-4">Lấp đầy</th>
                <th className="px-5 py-4 text-center">Trạng thái</th>
                <th className="px-5 py-4 text-center">Thông báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.map((f) => {
                const loadPct = Math.round(((f.seats?.booked ?? 0) / (f.seats?.total ?? 1)) * 100);
                const bookingCount = BOOKINGS.filter(b => b.flight === f.code && b.status !== 'Cancelled').length;
                return (
                  <tr key={f.code} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="text-sm font-bold text-slate-700">{f.code}</div>
                      <div className="text-[10px] text-slate-400 uppercase">{f.airline}</div>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">{f.route}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {f.dep}
                      </div>
                      <div className="text-[10px] text-slate-400">Đến: {f.arr}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                        <div className="h-full bg-violet-500" style={{ width: `${loadPct}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">{loadPct}%</div>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyle[f.flightStatus] || 'text-slate-500 bg-slate-100'}`}>
                        {f.flightStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <button
                        onClick={() => setNotifyModal(f)}
                        className={`p-2 rounded-lg transition-all ${
                          f.flightStatus === 'Delayed' 
                          ? 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100' 
                          : 'text-slate-400 hover:text-violet-600 hover:bg-violet-50'
                        }`}
                        title="Gửi thông báo cho hành khách"
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">Hiển thị {paginated.length} chuyến</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 disabled:opacity-20"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-xs font-bold px-2">{page} / {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 disabled:opacity-20"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightSchedulePage;