import { useState } from 'react';
import { Search, Filter, Eye, X, CheckCircle, XCircle, User, Phone, Mail, Plane, CreditCard, Calendar } from 'lucide-react';
import { ADMIN_BOOKINGS } from '../../data/adminMockData';

const STATUS_LABEL = { CONFIRMED: 'Đã xác nhận', PENDING: 'Chờ thanh toán', CANCELLED: 'Đã hủy' };
const STATUS_STYLE = { CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-200', PENDING: 'bg-amber-50 text-amber-700 border border-amber-200', CANCELLED: 'bg-red-50 text-red-700 border border-red-200' };
const PAY_LABEL = { PAID: 'Đã thanh toán', UNPAID: 'Chưa thanh toán', REFUNDED: 'Đã hoàn tiền' };
const PAY_STYLE = { PAID: 'bg-emerald-50 text-emerald-700', UNPAID: 'bg-amber-50 text-amber-700', REFUNDED: 'bg-blue-50 text-blue-700' };

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white bg-violet-600 min-w-[260px]">
      <CheckCircle className="w-4 h-4 shrink-0" />
      <span className="flex-1">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
    </div>
  );
}

function DetailModal({ booking, onClose, onConfirm, onCancel }) {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 sticky top-0 bg-white">
          <div>
            <h3 className="text-base font-bold text-slate-800">Chi tiết đặt chỗ</h3>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">{booking.pnr}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          {/* Trạng thái */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_STYLE[booking.status]}`}>{STATUS_LABEL[booking.status]}</span>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${PAY_STYLE[booking.paymentStatus]}`}>{PAY_LABEL[booking.paymentStatus]}</span>
          </div>

          {/* Hành khách */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thông tin hành khách</h4>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold">{booking.passenger}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{booking.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{booking.email}</span>
            </div>
          </div>

          {/* Thông tin vé */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thông tin chuyến bay</h4>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Plane className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="font-semibold">{booking.flight}</span>
              <span className="text-slate-400">—</span>
              <span>{booking.route}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{new Date(booking.date).toLocaleDateString('vi-VN')}</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-0.5">Hạng ghế</p>
                <p className="text-sm font-semibold text-slate-700">{booking.seatClass}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-0.5">Số ghế</p>
                <p className="text-sm font-semibold text-violet-700">{booking.seat}</p>
              </div>
            </div>
          </div>

          {/* Thanh toán */}
          <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide">Thanh toán</h4>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{booking.paymentMethod || 'Chưa thanh toán'}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-sm font-semibold text-slate-700">Tổng tiền</span>
              <span className="text-lg font-bold text-violet-600">{booking.amount.toLocaleString('vi-VN')}đ</span>
            </div>
            <p className="text-xs text-slate-400">Đặt lúc: {booking.bookedAt}</p>
          </div>
        </div>

        {/* Actions */}
        {booking.status !== 'CANCELLED' && (
          <div className="flex gap-3 p-5 pt-0">
            {booking.status === 'PENDING' && (
              <button onClick={() => onConfirm(booking.id)} className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" /> Xác nhận đặt chỗ
              </button>
            )}
            <button onClick={() => onCancel(booking.id)} className="flex-1 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
              <XCircle className="w-4 h-4" /> Hủy đặt chỗ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingManage() {
  const [bookings, setBookings] = useState(ADMIN_BOOKINGS);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState('');
  const [page, setPage] = useState(1);
  const PER_PAGE = 6;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3500); };

  const filtered = bookings.filter(b => {
    const matchSearch = b.pnr.toLowerCase().includes(search.toLowerCase()) || b.passenger.toLowerCase().includes(search.toLowerCase()) || b.flight.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleConfirm = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CONFIRMED', paymentStatus: 'PAID' } : b));
    setSelected(null);
    showToast('Đã xác nhận đặt chỗ thành công!');
  };
  const handleCancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'CANCELLED', paymentStatus: b.paymentStatus === 'PAID' ? 'REFUNDED' : b.paymentStatus } : b));
    setSelected(null);
    showToast('Đã hủy đặt chỗ.');
  };

  const counts = { ALL: bookings.length, CONFIRMED: bookings.filter(b => b.status === 'CONFIRMED').length, PENDING: bookings.filter(b => b.status === 'PENDING').length, CANCELLED: bookings.filter(b => b.status === 'CANCELLED').length };

  return (
    <div className="space-y-5">
      <Toast msg={toast} onClose={() => setToast('')} />
      {selected && <DetailModal booking={selected} onClose={() => setSelected(null)} onConfirm={handleConfirm} onCancel={handleCancel} />}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">Quản lý đặt chỗ</h1>
        <p className="text-slate-400 text-sm mt-1">Theo dõi và xử lý toàn bộ đơn đặt vé máy bay</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl px-3 py-2.5">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Tìm PNR, hành khách, chuyến bay..." className="flex-1 text-sm outline-none bg-transparent text-slate-700" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[['ALL', 'Tất cả'], ['CONFIRMED', 'Đã xác nhận'], ['PENDING', 'Chờ thanh toán'], ['CANCELLED', 'Đã hủy']].map(([val, lbl]) => (
            <button key={val} onClick={() => { setStatusFilter(val); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-colors ${statusFilter === val ? 'bg-violet-600 text-white border-violet-600' : 'bg-white border-slate-200 text-slate-600 hover:border-violet-300'}`}>
              {lbl} ({counts[val]})
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Mã PNR</th>
                <th className="px-5 py-3">Hành khách</th>
                <th className="px-5 py-3">Chuyến bay</th>
                <th className="px-5 py-3">Hạng ghế</th>
                <th className="px-5 py-3">Số tiền</th>
                <th className="px-5 py-3">Thanh toán</th>
                <th className="px-5 py-3">Trạng thái</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paged.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono font-bold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">{b.pnr}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center shrink-0">{b.passenger.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{b.passenger}</p>
                        <p className="text-xs text-slate-400">{b.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-slate-700">{b.flight}</p>
                    <p className="text-xs text-slate-400">{b.route} · {b.date}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-slate-600">{b.seatClass} <span className="text-violet-600 font-semibold">({b.seat})</span></td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{b.amount.toLocaleString('vi-VN')}đ</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PAY_STYLE[b.paymentStatus]}`}>{PAY_LABEL[b.paymentStatus]}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${STATUS_STYLE[b.status]}`}>{STATUS_LABEL[b.status]}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => setSelected(b)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-violet-50 text-slate-400 hover:text-violet-600 transition-colors" title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-sm text-slate-400">Không tìm thấy kết quả phù hợp</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
            <span className="text-xs text-slate-400">Hiển thị {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} / {filtered.length} kết quả</span>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${p === page ? 'bg-violet-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>{p}</button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
