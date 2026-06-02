import { useState, useEffect, useRef, Fragment } from 'react';
import { Plus, Search, Trash2, X, CheckCircle, LayoutGrid, Eraser, DoorOpen } from 'lucide-react';
import { airplaneModelService } from '../../api/services/airplaneModelService';
import { ticketClassService } from '../../api/services/ticketClassService';

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || 'Có lỗi xảy ra';

// Màu cho từng hạng ghế (theo thứ tự trong danh sách)
const CLASS_COLORS = ['#7C3AED', '#0891B2', '#059669', '#D97706', '#E11D48', '#475569'];

const mapDbModel = (m) => ({
  id: `db-${m.id}`,
  dbId: m.id,
  name: m.modelName,
  manufacturer: m.manufacturer,
  description: m.description || '',
  rows: m.totalRows,
  columns: m.seatColumns,
  totalSeats: m.totalSeats,
});

const cleanColumns = (s) => Array.from(new Set(String(s || '').toUpperCase().replace(/[^A-Z]/g, ''))).join('');

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

// Dựng lại seatMap khi đổi số hàng/cột, giữ lại thiết lập cũ ở những ghế còn tồn tại
const buildSeatMap = (rows, cols, prev, defaultClassId) => {
  const map = {};
  for (let r = 1; r <= rows; r++) {
    for (const c of cols) {
      const key = `${r}${c}`;
      map[key] = key in prev ? prev[key] : defaultClassId;
    }
  }
  return map;
};

function ModelModal({ ticketClasses, onSave, onClose }) {
  const defaultClassId = ticketClasses[0]?.id ?? null;
  const [name, setName] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [description, setDescription] = useState('');
  const [rows, setRows] = useState(20);
  const [colsText, setColsText] = useState('ABCDEF');
  const [seatMap, setSeatMap] = useState({});
  const [brush, setBrush] = useState(defaultClassId ?? 'ERASE'); // classId hoặc 'ERASE'
  const paintingRef = useRef(false);

  const cols = cleanColumns(colsText);
  const split = Math.ceil(cols.length / 2); // vị trí lối đi (chỉ để hiển thị)

  // Tạo/đồng bộ seatMap mỗi khi rows/cols thay đổi
  useEffect(() => {
    setSeatMap(prev => buildSeatMap(Number(rows) || 0, cleanColumns(colsText), prev, defaultClassId));
  }, [rows, colsText, defaultClassId]);

  const classColor = (id) => {
    const idx = ticketClasses.findIndex(t => String(t.id) === String(id));
    return CLASS_COLORS[(idx >= 0 ? idx : 0) % CLASS_COLORS.length];
  };
  const classOf = (id) => ticketClasses.find(t => String(t.id) === String(id));

  const applyBrush = (key) => {
    setSeatMap(prev => ({ ...prev, [key]: brush === 'ERASE' ? null : brush }));
  };
  const paintRow = (r) => {
    setSeatMap(prev => {
      const next = { ...prev };
      for (const c of cols) next[`${r}${c}`] = brush === 'ERASE' ? null : brush;
      return next;
    });
  };
  const fillAll = () => {
    setSeatMap(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k] = brush === 'ERASE' ? null : brush; });
      return next;
    });
  };

  // Thống kê
  const present = Object.values(seatMap).filter(v => v != null);
  const totalSeats = present.length;
  const perClass = ticketClasses.map(t => ({
    ...t,
    count: present.filter(v => String(v) === String(t.id)).length,
  }));

  const handleSave = () => {
    const seats = [];
    for (let r = 1; r <= Number(rows); r++) {
      for (const c of cols) {
        const v = seatMap[`${r}${c}`];
        if (v != null) seats.push({ rowNumber: r, columnLetter: c, ticketClassId: v });
      }
    }
    onSave({ name, manufacturer, description, rows: Number(rows), columns: cols, seats });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h3 className="font-bold text-slate-800">Thêm model máy bay & thiết lập sơ đồ ghế</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 space-y-4">
          {ticketClasses.length === 0 && (
            <div className="text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg p-3">
              Chưa có <b>hạng ghế</b> nào trong DB. Hãy tạo hạng ghế ở trang <b>Hạng ghế</b> trước để gán hạng cho từng ghế và lưu được vào DB.
            </div>
          )}

          {/* Thông tin model */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Tên model</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="VD: Airbus A321"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Nhà sản xuất</label>
              <input type="text" value={manufacturer} onChange={e => setManufacturer(e.target.value)} placeholder="VD: Airbus"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Mô tả</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả ngắn"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Số hàng ghế</label>
              <input type="number" min={1} max={80} value={rows} onChange={e => setRows(Math.max(0, Math.min(80, +e.target.value)))}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Cột ghế (sơ đồ đầy đủ)</label>
              <input type="text" value={colsText} onChange={e => setColsText(e.target.value.toUpperCase())} placeholder="ABCDEF"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>

          {/* Bảng màu công cụ (brush) */}
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Công cụ tô — chọn hạng ghế rồi click/kéo trên sơ đồ</p>
            <div className="flex flex-wrap gap-2">
              {ticketClasses.map(t => {
                const active = String(brush) === String(t.id);
                return (
                  <button key={t.id} onClick={() => setBrush(t.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                    style={{
                      borderColor: active ? classColor(t.id) : '#E2E8F0',
                      backgroundColor: active ? `${classColor(t.id)}15` : '#fff',
                      boxShadow: active ? `0 0 0 2px ${classColor(t.id)}40` : 'none',
                    }}>
                    <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: classColor(t.id) }} />
                    <span className="text-slate-700">{t.className}</span>
                    <span className="text-slate-400">×{Number(t.priceMultiplier).toFixed(1)}</span>
                  </button>
                );
              })}
              <button onClick={() => setBrush('ERASE')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all"
                style={{
                  borderColor: brush === 'ERASE' ? '#DC2626' : '#E2E8F0',
                  backgroundColor: brush === 'ERASE' ? '#FEE2E2' : '#fff',
                  boxShadow: brush === 'ERASE' ? '0 0 0 2px #DC262640' : 'none',
                }}>
                <Eraser className="w-3.5 h-3.5 text-red-500" />
                <span className="text-slate-700">Bỏ ghế (lối thoát hiểm)</span>
              </button>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <button onClick={fillAll} className="text-xs font-semibold text-violet-600 hover:underline">Tô tất cả ghế</button>
              <span className="text-xs text-slate-400">· Click vào số hàng để tô cả hàng · Kéo chuột để tô nhanh</span>
            </div>
          </div>

          {/* Sơ đồ ghế */}
          <div
            className="border border-slate-200 rounded-xl bg-slate-50 p-4 max-h-[40vh] overflow-auto select-none"
            onMouseLeave={() => { paintingRef.current = false; }}
            onMouseUp={() => { paintingRef.current = false; }}
          >
            {cols.length === 0 || Number(rows) < 1 ? (
              <p className="text-sm text-slate-400 text-center py-8">Nhập số hàng và cột ghế để hiển thị sơ đồ.</p>
            ) : (
              <div className="inline-flex flex-col gap-1.5 min-w-full items-center">
                {/* Header cột */}
                <div className="flex items-center gap-1">
                  <div className="w-6" />
                  {cols.split('').map((c, idx) => (
                    <Fragment key={`h${c}`}>
                      {idx === split && <div className="w-4" />}
                      <div className="w-8 text-center text-[10px] font-bold text-slate-400">{c}</div>
                    </Fragment>
                  ))}
                </div>
                {/* Các hàng ghế */}
                {Array.from({ length: Number(rows) }, (_, i) => i + 1).map(r => (
                  <div key={r} className="flex items-center gap-1">
                    <button onClick={() => paintRow(r)} title="Tô cả hàng"
                      className="w-6 text-center text-[10px] font-bold text-slate-400 hover:text-violet-600">{r}</button>
                    {cols.split('').map((c, idx) => {
                      const key = `${r}${c}`;
                      const v = seatMap[key];
                      const removed = v == null;
                      return (
                        <Fragment key={key}>
                          {idx === split && <div className="w-4 flex items-center justify-center text-slate-300 text-[9px]">┊</div>}
                          <div
                            title={removed ? `${key} — không có ghế` : `${key} — ${classOf(v)?.className || ''}`}
                            onMouseDown={(e) => { e.preventDefault(); paintingRef.current = true; applyBrush(key); }}
                            onMouseEnter={() => { if (paintingRef.current) applyBrush(key); }}
                            className="w-8 h-8 rounded-md flex items-center justify-center text-[9px] font-bold cursor-pointer transition-transform hover:scale-105 border"
                            style={removed
                              ? { backgroundColor: 'transparent', borderColor: '#CBD5E1', borderStyle: 'dashed', color: '#CBD5E1' }
                              : { backgroundColor: classColor(v), borderColor: classColor(v), color: '#fff' }}
                          >
                            {removed ? '' : c}
                          </div>
                        </Fragment>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Thống kê */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700">Tổng ghế: <span className="text-violet-600">{totalSeats}</span></span>
            {perClass.map(t => (
              <span key={t.id} className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded" style={{ backgroundColor: classColor(t.id) }} />
                {t.className}: <b>{t.count}</b>
              </span>
            ))}
            <span className="flex items-center gap-1.5 text-slate-400">
              <DoorOpen className="w-3.5 h-3.5" /> Đã bỏ: {Number(rows) * cols.length - totalSeats}
            </span>
          </div>
        </div>

        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
          <button onClick={handleSave} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Lưu model</button>
        </div>
      </div>
    </div>
  );
}

export default function AirplaneModelManage() {
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [ticketClasses, setTicketClasses] = useState([]);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type }), 3500);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = (await airplaneModelService.getAll()).map(mapDbModel);
        if (mounted) setModels(db);
      } catch {
        // không tải được -> để danh sách trống
      }
      try {
        const tc = await ticketClassService.getAll();
        if (mounted) setTicketClasses(tc || []);
      } catch {
        // không có hạng vé -> không lưu DB được
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = models.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.manufacturer.toLowerCase().includes(search.toLowerCase()));

  const saveModel = async (data) => {
    const name = (data.name || '').trim();
    const manufacturer = (data.manufacturer || '').trim();
    const rows = Number(data.rows);
    const cols = data.columns;
    if (name.length < 2 || manufacturer.length < 2 || !(rows > 0) || !cols) {
      showToast('Nhập đủ Tên model, Nhà sản xuất, Số hàng (>0) và Cột ghế.', 'error');
      return;
    }

    // Không có hạng vé trong DB -> chỉ lưu cục bộ
    if (!ticketClasses.length) {
      setModels(prev => {
        const localRow = { id: `local-${name}`, dbId: null, name, manufacturer, description: data.description?.trim() || '', rows, columns: cols, totalSeats: rows * cols.length };
        const rest = prev.filter(m => String(m.name).toUpperCase() !== name.toUpperCase());
        return [...rest, localRow];
      });
      showToast('Đã thêm model (cục bộ). Cần tạo "hạng ghế" trong DB để lưu kèm sơ đồ ghế.', 'error');
      setModal(false);
      return;
    }

    if (!data.seats.length) {
      showToast('Sơ đồ chưa có ghế nào. Hãy gán hạng cho ít nhất 1 ghế.', 'error');
      return;
    }

    const payload = {
      modelName: name,
      manufacturer,
      description: data.description?.trim() || '',
      totalRows: rows,
      seatColumns: cols,
      totalSeats: data.seats.length,
      seats: data.seats,
    };
    try {
      const saved = await airplaneModelService.create(payload);
      const mapped = mapDbModel(saved);
      setModels(prev => {
        const rest = prev.filter(m => String(m.name).toUpperCase() !== name.toUpperCase());
        return [...rest, mapped];
      });
      showToast(`Đã thêm model với ${payload.totalSeats} ghế và lưu vào DB!`);
      setModal(false);
    } catch (e) { showToast(errMsg(e, 'Thêm model thất bại.'), 'error'); }
  };

  const deleteModel = async (id) => {
    const m = models.find(x => x.id === id);
    if (m?.dbId) {
      try {
        await airplaneModelService.delete(m.dbId);
        setModels(prev => prev.filter(x => x.id !== id));
        showToast('Đã xóa model trong DB.');
      } catch (e) { showToast(errMsg(e, 'Xóa model thất bại.'), 'error'); }
    } else {
      setModels(prev => prev.filter(x => x.id !== id));
      showToast('Đã xóa model (cục bộ).');
    }
  };

  return (
    <div className="space-y-5">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: toast.type })} />
      {modal && <ModelModal ticketClasses={ticketClasses} onSave={saveModel} onClose={() => setModal(false)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý model máy bay</h1>
        <p className="text-slate-400 text-sm mt-1">Định nghĩa dòng máy bay, sơ đồ ghế và hạng ghế cho từng vị trí</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm model, nhà sản xuất..." className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <button onClick={() => setModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> Thêm model
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3">Model</th><th className="px-5 py-3">Nhà sản xuất</th><th className="px-5 py-3">Số hàng</th><th className="px-5 py-3">Cột ghế</th><th className="px-5 py-3">Tổng ghế</th><th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(m => (
              <tr key={m.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0"><LayoutGrid className="w-4 h-4" /></span>
                    <div>
                      <p>{m.name}</p>
                      {m.description && <p className="text-xs text-slate-400 font-normal">{m.description}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{m.manufacturer}</td>
                <td className="px-5 py-3.5 text-sm text-slate-600">{m.rows} hàng</td>
                <td className="px-5 py-3.5 text-sm"><span className="font-mono text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">{m.columns}</span></td>
                <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{m.totalSeats} ghế</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => deleteModel(m.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-400">Không tìm thấy model nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
