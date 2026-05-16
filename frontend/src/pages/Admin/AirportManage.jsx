import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, MapPin, Route, ArrowRight } from 'lucide-react';
import { AIRPORTS as INIT_AIRPORTS, ROUTES as INIT_ROUTES } from '../../data/adminMockData';

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white bg-violet-600 min-w-[260px]">
      <CheckCircle className="w-4 h-4 shrink-0" /><span className="flex-1">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-70" /></button>
    </div>
  );
}

function AirportModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { code: '', name: '', city: '', country: 'Việt Nam', terminals: 1, status: 'ACTIVE' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{initial ? 'Sửa sân bay' : 'Thêm sân bay mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          {[['code', 'Mã IATA (VD: SGN)', 'text'], ['name', 'Tên sân bay', 'text'], ['city', 'Thành phố', 'text'], ['country', 'Quốc gia', 'text']].map(([k, placeholder, type]) => (
            <div key={k}>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{placeholder}</label>
              <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={placeholder}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Số nhà ga</label>
              <input type="number" min={1} value={form.terminals} onChange={e => set('terminals', +e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Trạng thái</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all">
                <option value="ACTIVE">Hoạt động</option>
                <option value="INACTIVE">Ngừng hoạt động</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
}

function RouteModal({ airports, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { from: airports[0]?.code || '', to: airports[1]?.code || '', distance: '', duration: '', status: 'ACTIVE' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{initial ? 'Sửa tuyến bay' : 'Thêm tuyến bay mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[['from', 'Điểm khởi hành'], ['to', 'Điểm đến']].map(([k, lbl]) => (
              <div key={k}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{lbl}</label>
                <select value={form[k]} onChange={e => set(k, e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all">
                  {airports.map(a => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Khoảng cách (km)</label>
              <input type="number" value={form.distance} onChange={e => set('distance', +e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Thời gian bay</label>
              <input type="text" placeholder="VD: 1h 30m" value={form.duration} onChange={e => set('duration', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Trạng thái</label>
            <select value={form.status} onChange={e => set('status', e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all">
              <option value="ACTIVE">Hoạt động</option>
              <option value="INACTIVE">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default function AirportManage() {
  const [tab, setTab] = useState('airports');
  const [airports, setAirports] = useState(INIT_AIRPORTS);
  const [routes, setRoutes] = useState(INIT_ROUTES);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { type, data }
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const filteredAirports = airports.filter(a => a.code.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase()) || a.city.toLowerCase().includes(search.toLowerCase()));
  const filteredRoutes = routes.filter(r => r.id.toLowerCase().includes(search.toLowerCase()) || r.from.includes(search.toUpperCase()) || r.to.includes(search.toUpperCase()));

  const saveAirport = (form) => {
    if (modal.data) {
      setAirports(prev => prev.map(a => a.id === modal.data.id ? { ...a, ...form } : a));
      showToast('Đã cập nhật sân bay!');
    } else {
      setAirports(prev => [...prev, { ...form, id: form.code, flightsThisMonth: 0 }]);
      showToast('Đã thêm sân bay mới!');
    }
    setModal(null);
  };
  const deleteAirport = (id) => { setAirports(prev => prev.filter(a => a.id !== id)); showToast('Đã xóa sân bay.'); };

  const saveRoute = (form) => {
    const fromCity = airports.find(a => a.code === form.from)?.city || form.from;
    const toCity = airports.find(a => a.code === form.to)?.city || form.to;
    if (modal.data) {
      setRoutes(prev => prev.map(r => r.id === modal.data.id ? { ...r, ...form, fromCity, toCity } : r));
      showToast('Đã cập nhật tuyến bay!');
    } else {
      const newId = `R${String(routes.length + 1).padStart(3, '0')}`;
      setRoutes(prev => [...prev, { id: newId, ...form, fromCity, toCity, flightsThisMonth: 0 }]);
      showToast('Đã thêm tuyến bay mới!');
    }
    setModal(null);
  };
  const deleteRoute = (id) => { setRoutes(prev => prev.filter(r => r.id !== id)); showToast('Đã xóa tuyến bay.'); };

  return (
    <div className="space-y-5">
      <Toast msg={toast} onClose={() => setToast('')} />
      {modal?.type === 'airport' && <AirportModal initial={modal.data} onSave={saveAirport} onClose={() => setModal(null)} />}
      {modal?.type === 'route' && <RouteModal airports={airports} initial={modal.data} onSave={saveRoute} onClose={() => setModal(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý cơ sở hạ tầng</h1>
        <p className="text-slate-400 text-sm mt-1">Quản lý sân bay và tuyến bay trong hệ thống</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 border-b border-slate-200">
        {[['airports', MapPin, 'Sân bay'], ['routes', Route, 'Tuyến bay']].map(([key, Icon, lbl]) => (
          <button key={key} onClick={() => { setTab(key); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${tab === key ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            <Icon className="w-4 h-4" />{lbl}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === 'airports' ? 'Tìm sân bay...' : 'Tìm tuyến bay...'} className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <button onClick={() => setModal({ type: tab === 'airports' ? 'airport' : 'route', data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" />{tab === 'airports' ? 'Thêm sân bay' : 'Thêm tuyến bay'}
        </button>
      </div>

      {/* Airport Table */}
      {tab === 'airports' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Mã IATA</th><th className="px-5 py-3">Tên sân bay</th><th className="px-5 py-3">Thành phố</th><th className="px-5 py-3">Quốc gia</th><th className="px-5 py-3">Nhà ga</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredAirports.map(a => (
                <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded text-sm">{a.code}</span></td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">{a.name}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{a.city}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{a.country}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{a.terminals} nhà ga</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${a.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {a.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ type: 'airport', data: a })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteAirport(a.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Route Table */}
      {tab === 'routes' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Mã tuyến</th><th className="px-5 py-3">Hành trình</th><th className="px-5 py-3">Khoảng cách</th><th className="px-5 py-3">Thời gian bay</th><th className="px-5 py-3">Chuyến/tháng</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredRoutes.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-mono text-sm font-bold text-slate-600">{r.id}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span className="font-mono text-violet-700 bg-violet-50 px-1.5 rounded">{r.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-violet-700 bg-violet-50 px-1.5 rounded">{r.to}</span>
                      <span className="text-xs text-slate-400 font-normal">{r.fromCity} → {r.toCity}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{r.distance?.toLocaleString('vi-VN')} km</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{r.duration}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{r.flightsThisMonth} chuyến</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {r.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ type: 'route', data: r })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteRoute(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
