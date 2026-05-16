import { useState, useMemo, useCallback } from 'react';
import { Search, Eye, RefreshCw, ChevronLeft, ChevronRight, X, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BOOKINGS } from '../../data/sharedData';

const STATUS_OPTIONS = ['All', 'Confirmed', 'Pending', 'Cancelled'];
const PAYMENT_OPTIONS = ['All', 'Paid', 'Unpaid', 'Refunded'];
const PAGE_SIZE = 8;

const statusStyle = {
  Confirmed: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Pending: 'text-amber-700 bg-amber-50 border-amber-200',
  Cancelled: 'text-slate-500 bg-slate-100 border-slate-200',
};

const paymentStyle = {
  Paid: 'text-violet-700 bg-violet-50',
  Unpaid: 'text-red-600 bg-red-50',
  Refunded: 'text-indigo-600 bg-indigo-50',
};

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[260px] ${t.type === 'success' ? 'bg-violet-600' : 'bg-red-500'} animate-in slide-in-from-right`}>
          {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
}

function StatusDropdown({ bookingId, currentStatus, onUpdate }) {
  const [open, setOpen] = useState(false);
  const options = ['Confirmed', 'Pending', 'Cancelled'];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="p-1.5 text-slate-400 hover:text-violet-500 transition-colors rounded-lg hover:bg-violet-50 border border-transparent hover:border-violet-100"
        title="Đổi trạng thái"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 z-20 overflow-hidden py-1 min-w-[140px]">
            {options.filter(o => o !== currentStatus).map(opt => (
              <button
                key={opt}
                onClick={() => { onUpdate(bookingId, opt); setOpen(false); }}
                className="w-full px-4 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Chuyển: {opt}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function BookingPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const q = search.toLowerCase();
      const matchSearch = !q || b.id.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.flight.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchPayment = paymentFilter === 'All' || b.payment === paymentFilter;
      
      return matchSearch && matchStatus && matchPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleStatusUpdate = useCallback((id, newStatus) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    addToast(`Booking ${id} đã chuyển sang ${newStatus}.`);
  }, [addToast]);

  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Quản lý Booking</h1>
        <p className="text-sm text-slate-400 mt-0.5">Theo dõi lịch đặt vé và tình trạng thanh toán của khách hàng.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm mã vé, tên hành khách, chuyến bay..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'Tất cả trạng thái' : s}</option>)}
          </select>
          <select
            value={paymentFilter}
            onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            {PAYMENT_OPTIONS.map(p => <option key={p} value={p}>{p === 'All' ? 'Thanh toán' : p}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                <th className="px-5 py-4">Mã Booking</th>
                <th className="px-5 py-4">Hành khách</th>
                <th className="px-5 py-4">Chuyến bay</th>
                <th className="px-5 py-4">Hạng / Ghế</th>
                <th className="px-5 py-4">Tổng tiền</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-slate-400 text-sm italic">Không có dữ liệu hiển thị</td>
                </tr>
              ) : paginated.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-violet-600">{b.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-700">{b.name}</div>
                        <div className="text-[11px] text-slate-400 font-medium">{b.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-semibold text-slate-700">{b.flight}</div>
                    <div className="text-[11px] text-slate-400">{b.route}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded inline-block mb-1">{b.class}</div>
                    <div className="text-[10px] text-slate-400 font-bold">GHẾ: {b.seat}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-slate-700">{b.price}</div>
                    <span className={`text-[10px] font-bold uppercase ${paymentStyle[b.payment]}`}>
                      {b.payment}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => navigate(`/staff/booking/${b.id}`)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <StatusDropdown bookingId={b.id} currentStatus={b.status} onUpdate={handleStatusUpdate} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            Hiển thị {paginated.length} trên {filtered.length} kết quả
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center px-3">
               <span className="text-xs font-bold text-slate-700">{currentPage}</span>
               <span className="text-xs font-bold text-slate-300 mx-1">/</span>
               <span className="text-xs font-bold text-slate-300">{totalPages}</span>
            </div>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;