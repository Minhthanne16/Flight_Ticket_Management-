import { useState, useMemo, useCallback, useEffect } from 'react';
import { Search, Eye, RefreshCw, ChevronLeft, ChevronRight, X, CheckCircle2, XCircle, Clock, User, Loader2, AlertCircle, Download } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { bookingService } from '../../api/services/bookingService';
import { ADMIN_BOOKINGS } from '../../data/adminMockData';

const PAGE_SIZE = 8;

// Backend enums → display
const statusStyle = {
  CONFIRMED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PENDING:   'text-amber-700 bg-amber-50 border-amber-200',
  CANCELLED: 'text-slate-500 bg-slate-100 border-slate-200',
  EXPIRED:   'text-red-600 bg-red-50 border-red-200',
};
const statusLabel = { CONFIRMED: 'Confirmed', PENDING: 'Pending', CANCELLED: 'Cancelled', EXPIRED: 'Expired' };

const paymentStatusStyle = {
  PAID:    'text-violet-700 bg-violet-50',
  UNPAID:  'text-red-600 bg-red-50',
  REFUNDED:'text-indigo-600 bg-indigo-50',
};

function formatAmount(amount) {
  if (!amount) return '—';
  return `${Number(amount).toLocaleString('vi-VN')} đ`;
}

function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[260px] ${t.type === 'success' ? 'bg-violet-600' : 'bg-red-500'}`}>
          {t.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="opacity-70 hover:opacity-100"><X className="w-4 h-4" /></button>
        </div>
      ))}
    </div>
  );
}

function BookingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data, loading, error, refetch } = useApi(bookingService.getAll);
  
  const querySearch = searchParams.get('search') || '';
  const [search, setSearch] = useState(querySearch);
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const bookings = (data && data.length > 0) ? data : (() => {
    const storedPayments = JSON.parse(localStorage.getItem('mock_payments') || '{}');
    return ADMIN_BOOKINGS.map(b => {
      const mockPaymentStatus = storedPayments[b.id] || b.paymentStatus;
      const mockBookingStatus = mockPaymentStatus === 'PAID' ? 'CONFIRMED' : b.status;
      return {
        bookingId: b.id,
        pnrCode: b.pnr,
        passengerName: b.passenger,
        phone: b.phone,
        email: b.email,
        flightId: b.flight,
        flightCode: b.flight,
        route: b.route,
        date: b.date,
        seatClass: b.seatClass,
        seat: b.seat,
        totalAmount: b.amount,
        status: mockBookingStatus,
        paymentStatus: mockPaymentStatus,
        paymentMethod: b.paymentMethod,
        bookedAt: b.bookedAt,
      };
    });
  })();

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const q = search.toLowerCase();
      const pnr = b.pnrCode?.toLowerCase() || '';
      const matchSearch = !q || String(b.bookingId).includes(q) || pnr.includes(q);
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchPayment = paymentFilter === 'All' || b.paymentStatus === paymentFilter;
      return matchSearch && matchStatus && matchPayment;
    });
  }, [bookings, search, statusFilter, paymentFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleCancel = async (id) => {
    try {
      await bookingService.cancel(id);
      addToast(`Booking #${id} đã bị huỷ.`);
      refetch();
    } catch {
      addToast('Không thể huỷ booking.', 'error');
    }
  };

  const handleExportReport = () => {
    if (filtered.length === 0) {
      addToast('Không có dữ liệu để xuất báo cáo!', 'error');
      return;
    }

    try {
      const headers = ['Mã Booking', 'Mã PNR', 'Mã Chuyến bay', 'Tổng tiền (VND)', 'Phương thức thanh toán', 'Trạng thái thanh toán', 'Trạng thái đặt vé'];
      
      const rows = filtered.map(b => [
        `#${b.bookingId}`,
        b.pnrCode || '—',
        `FLIGHT-${b.flightId}`,
        b.totalAmount || 0,
        b.paymentMethod || '—',
        b.paymentStatus || '—',
        b.status || '—'
      ]);

      const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Bao_cao_booking_EasyFlight_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addToast('Xuất báo cáo thành công!', 'success');
    } catch (err) {
      addToast('Gặp lỗi khi xuất báo cáo.', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <Toast toasts={toasts} onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Quản lý Booking</h1>
          <p className="text-sm text-slate-400 mt-0.5">Theo dõi lịch đặt vé và tình trạng thanh toán của khách hàng.</p>
        </div>
        <button
          onClick={handleExportReport}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-500/10 transition-all hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Download className="w-4 h-4" />
          Xuất báo cáo (CSV)
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text" value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Tìm mã booking, PNR..."
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20">
            <option value="All">Tất cả trạng thái</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PENDING">Pending</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 outline-none focus:ring-2 focus:ring-violet-500/20">
            <option value="All">Thanh toán</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="REFUNDED">Refunded</option>
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
                <th className="px-5 py-4">PNR</th>
                <th className="px-5 py-4">Chuyến bay</th>
                <th className="px-5 py-4">Tổng tiền</th>
                <th className="px-5 py-4">Thanh toán</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={7} className="py-20 text-center">
                  <Loader2 className="w-6 h-6 animate-spin text-violet-500 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Đang tải dữ liệu...</p>
                </td></tr>
              ) : paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-20 text-center text-slate-400 text-sm italic">Không có dữ liệu hiển thị</td></tr>
              ) : paginated.map(b => (
                <tr key={b.bookingId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-bold text-violet-600">#{b.bookingId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-semibold text-slate-700">{b.pnrCode || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-slate-600">Chuyến #{b.flightId}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-slate-700">{formatAmount(b.totalAmount)}</div>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${paymentStatusStyle[b.paymentStatus] || 'text-slate-500'}`}>
                      {b.paymentStatus || '—'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-500">{b.paymentMethod || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusStyle[b.status] || 'text-slate-500 bg-slate-100 border-slate-200'}`}>
                      {statusLabel[b.status] || b.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => navigate(`/staff/booking/${b.bookingId}`)}
                        className="p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-50 rounded-xl transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      {b.status !== 'CANCELLED' && (
                        <button onClick={() => handleCancel(b.bookingId)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Huỷ booking">
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">
            Hiển thị {paginated.length} trên {filtered.length} kết quả
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors">
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <div className="flex items-center px-3">
              <span className="text-xs font-bold text-slate-700">{currentPage}</span>
              <span className="text-xs font-bold text-slate-300 mx-1">/</span>
              <span className="text-xs font-bold text-slate-300">{totalPages}</span>
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-100 disabled:opacity-30 hover:bg-slate-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingPage;