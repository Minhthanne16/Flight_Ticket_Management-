import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, ArrowRight } from 'lucide-react';
import { airportService } from '../../api/services/airportService';
import { routeService } from '../../api/services/routeService';

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || 'Có lỗi xảy ra';

const mapDbAirport = (a) => ({
  id: `db-${a.id}`,
  dbId: a.id,
  code: a.airportCode,
  city: a.city,
});

const mapDbRoute = (r, byDbId) => {
  const dep = byDbId.get(r.departureAirportId);
  const arr = byDbId.get(r.arrivalAirportId);
  const [fc, tc] = String(r.routeCode || '-').split('-');
  return {
    id: `db-${r.id}`,
    dbId: r.id,
    from: dep?.code || fc || '?',
    to: arr?.code || tc || '?',
    fromCity: dep?.city || '',
    toCity: arr?.city || '',
    status: r.status || 'ACTIVE',
  };
};

function Toast({ msg, type, onClose }) {
  if (!msg) return null;
  const isError = type === 'error';
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[280px] max-w-[90vw]"
      style={{ backgroundColor: isError ? '#DC2626' : '#16A34A' }}>
      {isError ? <X className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
      <span className="flex-1">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-70" /></button>
    </div>
  );
}

function RouteModal({ airports, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { from: airports[0]?.code || '', to: airports[1]?.code || '', status: 'ACTIVE' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{initial ? 'Sửa tuyến bay' : 'Thêm tuyến bay mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          {airports.length < 2 && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3">
              Cần có ít nhất 2 <b>sân bay</b> trong DB để tạo tuyến bay. Hãy thêm sân bay ở trang Sân bay trước.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {[['from', 'Điểm khởi hành'], ['to', 'Điểm đến']].map(([k, lbl]) => (
              <div key={k}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">{lbl}</label>
                <select value={form[k]} onChange={e => set(k, e.target.value)} className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all">
                  <option value="">— Chọn sân bay —</option>
                  {airports.map(a => <option key={a.code} value={a.code}>{a.code} — {a.city}</option>)}
                </select>
              </div>
            ))}
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

export default function RouteManage() {
  const [airports, setAirports] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | { data }
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type }), 3000);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      let dbAirports = [];
      try {
        dbAirports = (await airportService.getAll()).map(mapDbAirport);
      } catch {
        // để trống
      }
      if (!mounted) return;
      setAirports(dbAirports);

      const byDbId = new Map(dbAirports.map(a => [a.dbId, a]));
      let dbRoutes = [];
      try {
        dbRoutes = (await routeService.getAll()).map(r => mapDbRoute(r, byDbId));
      } catch {
        // để trống
      }
      if (!mounted) return;
      setRoutes(dbRoutes);
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = routes.filter(r =>
    r.id.toLowerCase().includes(search.toLowerCase()) ||
    r.from.includes(search.toUpperCase()) ||
    r.to.includes(search.toUpperCase()) ||
    r.fromCity.toLowerCase().includes(search.toLowerCase()) ||
    r.toCity.toLowerCase().includes(search.toLowerCase()));

  const saveRoute = async (form) => {
    if (!form.from || !form.to) { showToast('Vui lòng chọn sân bay đi và đến.', 'error'); return; }
    if (form.from === form.to) { showToast('Sân bay đi và đến không được giống nhau.', 'error'); return; }
    const dep = airports.find(a => a.code === form.from);
    const arr = airports.find(a => a.code === form.to);
    if (!dep?.dbId || !arr?.dbId) { showToast('Sân bay chưa có trong DB.', 'error'); return; }
    const routeCode = `${form.from}-${form.to}`;
    const payload = {
      routeCode,
      departureAirportId: dep.dbId,
      arrivalAirportId: arr.dbId,
      status: form.status,
    };
    const byDbId = new Map([[dep.dbId, dep], [arr.dbId, arr]]);

    // SỬA
    if (modal.data) {
      try {
        const saved = await routeService.update(modal.data.dbId, payload);
        const mapped = { ...mapDbRoute(saved, byDbId), id: modal.data.id };
        setRoutes(prev => prev.map(r => r.id === modal.data.id ? mapped : r));
        showToast('Đã cập nhật tuyến bay trong DB!');
        setModal(null);
      } catch (e) { showToast(errMsg(e, 'Cập nhật tuyến bay thất bại.'), 'error'); }
      return;
    }

    // TẠO MỚI
    try {
      const saved = await routeService.create(payload);
      const mapped = mapDbRoute(saved, byDbId);
      setRoutes(prev => {
        const rest = prev.filter(r => `${r.from}-${r.to}`.toUpperCase() !== routeCode.toUpperCase());
        return [...rest, mapped];
      });
      showToast('Đã thêm tuyến bay và lưu vào DB!');
      setModal(null);
    } catch (e) { showToast(errMsg(e, 'Thêm tuyến bay thất bại.'), 'error'); }
  };

  const deleteRoute = async (id) => {
    const route = routes.find(r => r.id === id);
    if (route?.dbId) {
      try {
        await routeService.delete(route.dbId);
        setRoutes(prev => prev.filter(r => r.id !== id));
        showToast('Đã xóa tuyến bay trong DB.');
      } catch (e) { showToast(errMsg(e, 'Xóa tuyến bay thất bại.'), 'error'); }
    } else {
      setRoutes(prev => prev.filter(r => r.id !== id));
      showToast('Đã xóa tuyến bay (cục bộ).');
    }
  };

  // chuẩn bị form sửa (RouteModal dùng code, lưu lại id/dbId)
  const toEditForm = (r) => ({ from: r.from, to: r.to, status: r.status, id: r.id, dbId: r.dbId });

  return (
    <div className="space-y-5">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: toast.type })} />
      {modal && <RouteModal airports={airports} initial={modal.data} onSave={saveRoute} onClose={() => setModal(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý tuyến bay</h1>
        <p className="text-slate-400 text-sm mt-1">Thiết lập các tuyến bay giữa các sân bay trong hệ thống</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm tuyến bay..." className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <button onClick={() => setModal({ data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> Thêm tuyến bay
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3">Mã tuyến</th><th className="px-5 py-3">Hành trình</th><th className="px-5 py-3">Trạng thái</th><th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5"><span className="font-mono text-sm font-bold text-slate-600">{r.from}-{r.to}</span></td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <span className="font-mono text-violet-700 bg-violet-50 px-1.5 rounded">{r.from}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono text-violet-700 bg-violet-50 px-1.5 rounded">{r.to}</span>
                    <span className="text-xs text-slate-400 font-normal">{r.fromCity} → {r.toCity}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${r.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                    {r.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModal({ data: toEditForm(r) })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteRoute(r.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">Không tìm thấy tuyến bay nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
