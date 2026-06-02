import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, Armchair } from 'lucide-react';
import { ticketClassService } from '../../api/services/ticketClassService';

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || 'Có lỗi xảy ra';

const mapDbClass = (t) => ({
  id: `db-${t.id}`,
  dbId: t.id,
  code: t.classCode,
  name: t.className,
  description: t.description || '',
  multiplier: Number(t.priceMultiplier ?? 1),
  baggageKg: Number(t.baggageAllowanceKg ?? 0),
});

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

function ClassModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { code: '', name: '', description: '', multiplier: 1.0, baggageKg: 0 });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800">{initial ? 'Sửa hạng ghế' : 'Thêm hạng ghế mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Mã hạng (VD: Y)</label>
              <input type="text" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="Y"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Hệ số giá</label>
              <input type="number" min={0.01} step={0.01} value={form.multiplier} onChange={e => set('multiplier', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Hành lý tối đa (kg)</label>
            <input type="number" min={0} step={1} value={form.baggageKg} onChange={e => set('baggageKg', e.target.value)} placeholder="VD: 23"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Tên hạng ghế</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Thương gia"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Mô tả</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="Mô tả ngắn về hạng ghế" rows={2}
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all resize-none" />
          </div>
          <p className="text-xs text-slate-400">Hệ số giá nhân với giá cơ bản của chuyến bay để ra giá vé của hạng này.</p>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default function TicketClassManage() {
  const [classes, setClasses] = useState([]);
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
      try {
        const db = (await ticketClassService.getAll()).map(mapDbClass);
        if (mounted) setClasses(db);
      } catch {
        // không tải được -> để danh sách trống
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = classes.filter(c =>
    c.code.toLowerCase().includes(search.toLowerCase()) ||
    c.name.toLowerCase().includes(search.toLowerCase()));

  const saveClass = async (form) => {
    const code = (form.code || '').trim().toUpperCase();
    const name = (form.name || '').trim();
    const multiplier = Number(form.multiplier);
    const baggageKg = Number(form.baggageKg);
    if (!code || code.length > 10 || !name) {
      showToast('Nhập Mã hạng (≤10 ký tự) và Tên hạng.', 'error');
      return;
    }
    if (!(multiplier >= 0.01)) {
      showToast('Hệ số giá phải lớn hơn 0.', 'error');
      return;
    }
    if (!Number.isInteger(baggageKg) || baggageKg < 0) {
      showToast('Hành lý tối đa phải là số nguyên ≥ 0.', 'error');
      return;
    }
    const payload = { classCode: code, className: name, description: form.description?.trim() || '', priceMultiplier: multiplier, baggageAllowanceKg: baggageKg };

    // SỬA
    if (modal.data) {
      if (modal.data.dbId) {
        try {
          const saved = await ticketClassService.update(modal.data.dbId, payload);
          const mapped = mapDbClass(saved);
          setClasses(prev => prev.map(c => c.id === modal.data.id ? mapped : c));
          showToast('Đã cập nhật hạng ghế vào DB!');
          setModal(null);
        } catch (e) { showToast(errMsg(e, 'Cập nhật hạng ghế thất bại.'), 'error'); }
        return;
      }
      // Bản ghi cục bộ (chưa có trong DB)
      setClasses(prev => prev.map(c => c.id === modal.data.id ? { ...c, code, name, description: payload.description, multiplier, baggageKg } : c));
      showToast('Đã cập nhật hạng ghế (cục bộ).');
      setModal(null);
      return;
    }

    // TẠO MỚI
    try {
      const saved = await ticketClassService.create(payload);
      const mapped = mapDbClass(saved);
      setClasses(prev => {
        const rest = prev.filter(c => String(c.code).toUpperCase() !== code);
        return [...rest, mapped];
      });
      showToast('Đã thêm hạng ghế và lưu vào DB!');
      setModal(null);
    } catch (e) { showToast(errMsg(e, 'Thêm hạng ghế thất bại.'), 'error'); }
  };

  const deleteClass = async (id) => {
    const c = classes.find(x => x.id === id);
    if (c?.dbId) {
      try {
        await ticketClassService.delete(c.dbId);
        setClasses(prev => prev.filter(x => x.id !== id));
        showToast('Đã xóa hạng ghế trong DB.');
      } catch (e) { showToast(errMsg(e, 'Xóa hạng ghế thất bại.'), 'error'); }
    } else {
      setClasses(prev => prev.filter(x => x.id !== id));
      showToast('Đã xóa hạng ghế (cục bộ).');
    }
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: toast.type })} />
      {modal && <ClassModal initial={modal.data} onSave={saveClass} onClose={() => setModal(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý hạng ghế</h1>
        <p className="text-slate-400 text-sm mt-1">Định nghĩa các hạng ghế và hệ số giá áp dụng cho vé</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm hạng ghế..." className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <button onClick={() => setModal({ data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> Thêm hạng ghế
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3">Mã hạng</th><th className="px-5 py-3">Tên hạng ghế</th><th className="px-5 py-3">Hệ số giá</th><th className="px-5 py-3">Hành lý (kg)</th><th className="px-5 py-3">Mô tả</th><th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5"><span className="font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded text-sm">{c.code}</span></td>
                <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0"><Armchair className="w-4 h-4" /></span>
                    {c.name}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm"><span className="font-semibold text-slate-700">×{Number(c.multiplier).toFixed(2)}</span></td>
                <td className="px-5 py-3.5 text-sm text-slate-700">{c.baggageKg} kg</td>
                <td className="px-5 py-3.5 text-sm text-slate-500 max-w-[320px] truncate">{c.description || '—'}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setModal({ data: c })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteClass(c.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">Không tìm thấy hạng ghế nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
