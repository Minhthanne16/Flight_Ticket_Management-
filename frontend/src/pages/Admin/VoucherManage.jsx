import { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, CheckCircle, Ticket } from 'lucide-react';
import { voucherService } from '../../api/services/voucherService';

const errMsg = (e, fallback) =>
  e?.response?.data?.message || e?.message || fallback || 'Có lỗi xảy ra';

// Backend Voucher -> frontend model
const mapDbVoucher = (v) => ({
  id: `db-${v.id}`,
  dbId: v.id,
  code: v.voucherCode,
  name: v.name || '',
  discountType: v.discountType || 'FIXED_AMOUNT',
  discountValue: Number(v.discountValue ?? 0),
  minBookingAmount: Number(v.minBookingAmount ?? 0),
  maxDiscountAmount: v.maxDiscountAmount != null ? Number(v.maxDiscountAmount) : null,
  startTime: v.startTime || '',
  endTime: v.endTime || '',
  usageLimit: Number(v.usageLimit ?? 0),
  usedCount: Number(v.usedCount ?? 0),
  status: v.status || 'ACTIVE',
});

const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

const vnd = (n) => Number(n || 0).toLocaleString('vi-VN') + 'đ';
// ISO -> giá trị cho input datetime-local ("YYYY-MM-DDTHH:mm")
const toInput = (iso) => (iso ? String(iso).slice(0, 16) : '');
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('vi-VN') + ' ' + d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const STATUS_META = {
  ACTIVE: { label: 'Đang hoạt động', cls: 'bg-emerald-50 text-emerald-700' },
  INACTIVE: { label: 'Tạm ngưng', cls: 'bg-slate-100 text-slate-600' },
  EXPIRED: { label: 'Hết hạn', cls: 'bg-red-50 text-red-600' },
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

function VoucherModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || {
    code: '', name: '', discountType: 'FIXED_AMOUNT', discountValue: '',
    minBookingAmount: 0, maxDiscountAmount: '', startTime: '', endTime: '', usageLimit: 1,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const isPercent = form.discountType === 'PERCENTAGE';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <h3 className="font-bold text-slate-800">{initial ? 'Sửa mã giảm giá' : 'Thêm mã giảm giá mới'}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Mã giảm giá</label>
              <input type="text" value={form.code} onChange={e => set('code', e.target.value.toUpperCase())} placeholder="VD: SUMMER2026"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Loại giảm</label>
              <select value={form.discountType} onChange={e => set('discountType', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all bg-white">
                <option value="FIXED_AMOUNT">Số tiền cố định</option>
                <option value="PERCENTAGE">Phần trăm</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Tên chương trình</label>
            <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="VD: Giảm giá mùa hè"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                {isPercent ? 'Mức giảm (%)' : 'Mức giảm (đ)'}
              </label>
              <input type="number" min={1} max={isPercent ? 100 : undefined} step={1} value={form.discountValue}
                onChange={e => set('discountValue', e.target.value)} placeholder={isPercent ? '10' : '50000'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Giảm tối đa (đ)</label>
              <input type="number" min={1} step={1} value={form.maxDiscountAmount}
                onChange={e => set('maxDiscountAmount', e.target.value)} placeholder={isPercent ? 'VD: 200000' : 'Không bắt buộc'}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Đơn tối thiểu (đ)</label>
              <input type="number" min={0} step={1} value={form.minBookingAmount}
                onChange={e => set('minBookingAmount', e.target.value)} placeholder="0"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Số lượt sử dụng</label>
              <input type="number" min={1} step={1} value={form.usageLimit}
                onChange={e => set('usageLimit', e.target.value)} placeholder="100"
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Bắt đầu</label>
              <input type="datetime-local" value={form.startTime} onChange={e => set('startTime', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">Kết thúc</label>
              <input type="datetime-local" value={form.endTime} onChange={e => set('endTime', e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-400 transition-all" />
            </div>
          </div>

          <p className="text-xs text-slate-400">
            {isPercent
              ? 'Giảm theo % giá trị đơn, có thể giới hạn bằng "Giảm tối đa".'
              : 'Giảm trực tiếp một khoản tiền cố định trên đơn.'}
          </p>
        </div>
        <div className="flex gap-3 p-5 pt-0">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hủy</button>
          <button onClick={() => onSave(form)} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  );
}

export default function VoucherManage() {
  const [vouchers, setVouchers] = useState([]);
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
        const arr = unwrap(await voucherService.getAll()) || [];
        if (mounted) setVouchers(arr.map(mapDbVoucher));
      } catch {
        // không tải được -> để danh sách trống
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filtered = vouchers.filter(v =>
    v.code.toLowerCase().includes(search.toLowerCase()) ||
    v.name.toLowerCase().includes(search.toLowerCase()));

  const saveVoucher = async (form) => {
    const code = (form.code || '').trim().toUpperCase();
    const name = (form.name || '').trim();
    const isPercent = form.discountType === 'PERCENTAGE';
    const discountValue = Number(form.discountValue);
    const minBookingAmount = Number(form.minBookingAmount);
    const maxRaw = form.maxDiscountAmount === '' || form.maxDiscountAmount == null ? null : Number(form.maxDiscountAmount);
    const usageLimit = Number(form.usageLimit);

    if (!code || code.length > 50 || !name) {
      showToast('Nhập Mã giảm giá (≤50 ký tự) và Tên chương trình.', 'error');
      return;
    }
    if (!(discountValue >= 1)) {
      showToast('Mức giảm phải lớn hơn 0.', 'error');
      return;
    }
    if (isPercent && discountValue > 100) {
      showToast('Mức giảm phần trăm phải trong khoảng 1–100.', 'error');
      return;
    }
    if (!(minBookingAmount >= 0)) {
      showToast('Đơn tối thiểu không được âm.', 'error');
      return;
    }
    if (maxRaw != null && !(maxRaw >= 1)) {
      showToast('Giảm tối đa phải lớn hơn 0.', 'error');
      return;
    }
    if (!(usageLimit >= 1)) {
      showToast('Số lượt sử dụng phải lớn hơn 0.', 'error');
      return;
    }
    if (!form.startTime || !form.endTime) {
      showToast('Chọn thời gian bắt đầu và kết thúc.', 'error');
      return;
    }
    if (new Date(form.startTime) >= new Date(form.endTime)) {
      showToast('Thời gian bắt đầu phải trước thời gian kết thúc.', 'error');
      return;
    }

    const payload = {
      voucherCode: code,
      name,
      discountType: form.discountType,
      discountValue,
      minBookingAmount,
      maxDiscountAmount: maxRaw,
      startTime: form.startTime,
      endTime: form.endTime,
      usageLimit,
    };

    // SỬA
    if (modal.data) {
      try {
        const saved = mapDbVoucher(unwrap(await voucherService.update(modal.data.dbId, payload)));
        setVouchers(prev => prev.map(v => v.id === modal.data.id ? saved : v));
        showToast('Đã cập nhật mã giảm giá!');
        setModal(null);
      } catch (e) { showToast(errMsg(e, 'Cập nhật mã giảm giá thất bại.'), 'error'); }
      return;
    }

    // TẠO MỚI
    try {
      const saved = mapDbVoucher(unwrap(await voucherService.create(payload)));
      setVouchers(prev => {
        const rest = prev.filter(v => String(v.code).toUpperCase() !== code);
        return [...rest, saved];
      });
      showToast('Đã thêm mã giảm giá và lưu vào DB!');
      setModal(null);
    } catch (e) { showToast(errMsg(e, 'Thêm mã giảm giá thất bại.'), 'error'); }
  };

  const deleteVoucher = async (id) => {
    const v = vouchers.find(x => x.id === id);
    if (!v) return;
    try {
      await voucherService.remove(v.dbId);
      setVouchers(prev => prev.filter(x => x.id !== id));
      showToast('Đã xóa mã giảm giá trong DB.');
    } catch (e) { showToast(errMsg(e, 'Xóa mã giảm giá thất bại.'), 'error'); }
  };

  const renderDiscount = (v) =>
    v.discountType === 'PERCENTAGE'
      ? `${v.discountValue}%${v.maxDiscountAmount ? ` (tối đa ${vnd(v.maxDiscountAmount)})` : ''}`
      : vnd(v.discountValue);

  return (
    <div className="space-y-5">
      <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: toast.type })} />
      {modal && <VoucherModal initial={modal.data} onSave={saveVoucher} onClose={() => setModal(null)} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý mã giảm giá</h1>
        <p className="text-slate-400 text-sm mt-1">Tạo và quản lý các mã giảm giá áp dụng cho đơn đặt vé</p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm mã giảm giá..." className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <button onClick={() => setModal({ data: null })}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors whitespace-nowrap">
          <Plus className="w-4 h-4" /> Thêm mã giảm giá
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="px-5 py-3">Mã</th>
              <th className="px-5 py-3">Tên chương trình</th>
              <th className="px-5 py-3">Mức giảm</th>
              <th className="px-5 py-3">Đơn tối thiểu</th>
              <th className="px-5 py-3">Lượt dùng</th>
              <th className="px-5 py-3">Hiệu lực</th>
              <th className="px-5 py-3">Trạng thái</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(v => {
              const st = STATUS_META[v.status] || STATUS_META.ACTIVE;
              return (
                <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5"><span className="font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded text-sm">{v.code}</span></td>
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center shrink-0"><Ticket className="w-4 h-4" /></span>
                      {v.name}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{renderDiscount(v)}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{v.minBookingAmount > 0 ? vnd(v.minBookingAmount) : '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-slate-700">{v.usedCount}/{v.usageLimit}</td>
                  <td className="px-5 py-3.5 text-xs text-slate-500 whitespace-nowrap">{fmtDate(v.startTime)}<br />→ {fmtDate(v.endTime)}</td>
                  <td className="px-5 py-3.5"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setModal({ data: { ...v, startTime: toInput(v.startTime), endTime: toInput(v.endTime), maxDiscountAmount: v.maxDiscountAmount ?? '' } })} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => deleteVoucher(v.id)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">Không tìm thấy mã giảm giá nào</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
