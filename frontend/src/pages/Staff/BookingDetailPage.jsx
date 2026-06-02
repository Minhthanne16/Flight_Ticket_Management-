import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Ticket, Printer, Send, Plane, AlertCircle, User, Settings, X, MessageSquare, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { bookingService } from '../../api/services/bookingService';
import { flightService } from '../../api/services/flightService';

// Toast (local, minimal)
function Toast({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map(t => (
        <div key={t.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white min-w-[240px] ${t.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)}><X className="w-4 h-4 opacity-70 hover:opacity-100" /></button>
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-[380px] mx-4">
        <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Hủy</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

const STATUS_STYLES = {
  CONFIRMED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PAID: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  PENDING: 'text-amber-700 bg-amber-50 border-amber-200',
  CANCELLED: 'text-slate-500 bg-slate-100 border-slate-200',
  EXPIRED: 'text-red-700 bg-red-50 border-red-200'
};

const STATUS_LABELS = {
  CONFIRMED: 'Đã xác nhận',
  PAID: 'Đã thanh toán',
  PENDING: 'Chờ thanh toán',
  CANCELLED: 'Đã hủy',
  EXPIRED: 'Đã hết hạn'
};

const PAYMENT_STATUS_LABELS = {
  PAID: 'ĐÃ THANH TOÁN',
  UNPAID: 'CHƯA THANH TOÁN',
  REFUNDED: 'ĐÃ HOÀN TIỀN',
  FAILED: 'GIAO DỊCH LỖI'
};

function BookingDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: booking, loading: bookingLoading, error: bookingError, refetch: refetchBooking } = useApi(() => bookingService.getById(id), [id]);
  const { data: flights, loading: flightsLoading } = useApi(() => flightService.search({}), []);

  const [note, setNote] = useState('Khách hàng yêu cầu ghế ngồi sát cửa sổ để ngắm cảnh...');
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(note);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);

  const flight = flights?.find(f => f.id === booking?.flightId);

  const addToast = useCallback((msg, type = 'success') => {
    const toastId = Date.now();
    setToasts(prev => [...prev, { id: toastId, message: msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toastId)), 3500);
  }, []);

  const removeToast = (toastId) => setToasts(prev => prev.filter(t => t.id !== toastId));

  const handleCancel = () => {
    if (!booking) return;
    setConfirm({
      title: 'Hủy đặt vé',
      message: `Bạn có chắc chắn muốn hủy đặt vé với mã PNR ${booking.pnrCode}? Thao tác này sẽ cập nhật trạng thái đặt vé về Đã hủy.`,
      confirmLabel: 'Hủy đặt vé',
      confirmClass: 'bg-red-500 hover:bg-red-600',
      onConfirm: async () => {
        try {
          await bookingService.cancel(booking.bookingId);
          addToast(`Đã hủy đặt vé PNR ${booking.pnrCode} thành công.`, 'success');
          refetchBooking();
        } catch (err) {
          addToast(err.response?.data?.message || err.message || 'Lỗi khi hủy đặt vé', 'error');
        } finally {
          setConfirm(null);
        }
      }
    });
  };

  const handleConfirmPayment = () => {
    if (!booking) return;
    setConfirm({
      title: 'Xác nhận thanh toán',
      message: `Bạn xác nhận đã nhận đủ số tiền ${booking.totalAmount.toLocaleString('vi-VN')} đ cho mã đặt vé ${booking.pnrCode}? Trạng thái vé sẽ chuyển sang ĐÃ THANH TOÁN.`,
      confirmLabel: 'Xác nhận',
      confirmClass: 'bg-emerald-600 hover:bg-emerald-700',
      onConfirm: async () => {
        try {
          await bookingService.confirmPayment(booking.bookingId);
          addToast(`Xác nhận thanh toán thành công cho PNR ${booking.pnrCode}!`, 'success');
          refetchBooking();
        } catch (err) {
          addToast(err.response?.data?.message || err.message || 'Lỗi khi xác nhận thanh toán', 'error');
        } finally {
          setConfirm(null);
        }
      }
    });
  };

  const handleSendEticket = () => {
    const mainTicket = booking?.tickets?.[0];
    const email = mainTicket ? `${mainTicket.passengerName.toLowerCase().replace(/\s+/g, '')}@email.com` : 'khachhang@email.com';
    addToast(`Đã gửi vé điện tử (E-ticket) đến ${email}`, 'success');
  };

  const handlePrint = () => {
    addToast('Đã gửi yêu cầu in hóa đơn đến máy in.', 'success');
  };

  const handleSaveNote = () => {
    setNote(draftNote);
    setEditingNote(false);
    addToast('Đã cập nhật ghi chú nội bộ.', 'success');
  };

  const getPassengerInitials = (name) => {
    if (!name) return 'HK';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (bookingLoading || flightsLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="text-sm text-slate-500 font-medium">Đang tải thông tin đặt vé từ database...</p>
      </div>
    );
  }

  if (bookingError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-red-800 mb-1">Không thể tải thông tin đặt vé</h3>
        <p className="text-sm text-red-600 mb-4">{bookingError}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate('/staff/booking')} className="px-4 py-2 border border-slate-200 text-sm font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
            Quay lại
          </button>
          <button onClick={refetchBooking} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="text-center py-20 text-slate-400 italic">
        Không tìm thấy thông tin đặt vé phù hợp.
      </div>
    );
  }

  const primaryPassenger = booking.tickets?.[0];
  const totalAmountVal = booking.totalAmount || 0;
  const refundAmount = Math.max(0, totalAmountVal - 150000);

  return (
    <div className="space-y-5 max-w-5xl">
      <Toast toasts={toasts} onRemove={removeToast} />
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        confirmClass={confirm?.confirmClass}
        onConfirm={confirm?.onConfirm}
        onCancel={() => setConfirm(null)}
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-slate-400">
        <button onClick={() => navigate('/staff/booking')} className="hover:text-sky-500 transition-colors font-medium">Danh sách đặt vé</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-700">{booking.pnrCode}</span>
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[booking.status] || 'text-slate-500 bg-slate-50'}`}>
          {STATUS_LABELS[booking.status] || booking.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* Passenger */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-base">
                {getPassengerInitials(primaryPassenger?.passengerName)}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-800">{primaryPassenger?.passengerName || 'Chưa rõ tên'}</h2>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {primaryPassenger?.nationality || 'Thành viên'}
                </span>
              </div>
            </div>
            <div className="space-y-2.5 text-sm text-slate-500">
              <p className="flex items-center gap-2.5"><span>📞</span> {primaryPassenger?.documentNumber || 'Chưa cung cấp CCCD'}</p>
              <p className="flex items-center gap-2.5"><span>✉</span> {primaryPassenger?.passengerName ? `${primaryPassenger.passengerName.toLowerCase().replace(/\s+/g, '')}@email.com` : 'Chưa cung cấp'}</p>
              <p className="flex items-center gap-2.5"><span>📍</span> Quốc tịch: {primaryPassenger?.nationality || 'Không rõ'}</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-sky-500" /> Thông tin thanh toán
            </h3>
            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-1">Tổng cộng</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800">{totalAmountVal.toLocaleString('vi-VN')} đ</span>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 border ${
                  booking.paymentStatus === 'PAID' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-700 bg-amber-50 border-amber-200'
                }`}>
                  <CheckCircle2 className="w-3 h-3" /> {PAYMENT_STATUS_LABELS[booking.paymentStatus] || booking.paymentStatus}
                </span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Phương thức</span><span className="font-semibold">Chuyển khoản</span></div>
              <div className="flex justify-between text-slate-500"><span>Ngày đặt</span><span>{formatDateTime(booking.bookingDate)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Hết hạn</span><span>{formatDateTime(booking.expirationTime)}</span></div>
            </div>
          </div>

          {/* Internal Note */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Ghi chú nội bộ
              </h3>
              {!editingNote && (
                <button onClick={() => { setDraftNote(note); setEditingNote(true); }} className="text-xs text-sky-500 hover:underline">Sửa</button>
              )}
            </div>
            {editingNote ? (
              <div className="space-y-2">
                <textarea
                  value={draftNote}
                  onChange={e => setDraftNote(e.target.value)}
                  rows={3}
                  className="w-full text-sm text-slate-600 border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-600">Lưu</button>
                  <button onClick={() => setEditingNote(false)} className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:bg-slate-50">Hủy</button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">"{note}"</p>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="lg:col-span-2 space-y-5">
          {/* Flight Card */}
          <div className="bg-[#0F1629] rounded-2xl text-white p-6 relative overflow-hidden">
            <div className="absolute -right-8 -top-8 opacity-[0.05]">
              <Plane className="w-48 h-48 text-white" />
            </div>
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Mã chuyến bay</p>
                <h2 className="text-3xl font-bold">{flight?.flightCode || '...'}</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Giờ khởi hành</p>
                <p className="text-base font-semibold">{flight ? formatDateTime(flight.departureTime) : '—'}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-4xl font-bold">{flight?.departureAirportCode || 'SGN'}</h3>
                <p className="text-sm text-white/40 mt-1">{flight?.departureCity || 'Hồ Chí Minh'}</p>
              </div>
              <div className="flex-1 px-8 flex flex-col items-center">
                <p className="text-xs text-white/40 mb-2">
                  {flight ? `${Math.floor(flight.estimateDuration / 60)}h ${flight.estimateDuration % 60}m` : '—'}
                </p>
                <div className="w-full flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/20" />
                  <Plane className="w-4 h-4 text-sky-400" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <p className="text-xs text-white/30 mt-2">Bay thẳng</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-bold">{flight?.arrivalAirportCode || 'HAN'}</h3>
                <p className="text-sm text-white/40 mt-1">{flight?.arrivalCity || 'Hà Nội'}</p>
              </div>
            </div>

            <div className="flex gap-8 relative z-10 border-t border-white/10 pt-5">
              {[
                ['Ghế đã chọn', booking.tickets?.map(t => t.seatNumber).filter(Boolean).join(', ') || 'Chưa xếp'],
                ['Hãng bay', flight?.airlineName || 'Vietnam Airlines'],
                ['Thời gian đến', flight ? formatDateTime(flight.arrivalTime) : '—']
              ].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-base font-bold">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tickets Detail List */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-sky-500" /> Chi tiết từng hành khách & Ghế ngồi ({booking.tickets?.length || 0})
            </h3>
            <div className="space-y-3">
              {booking.tickets?.map((t, idx) => (
                <div key={t.ticketId || idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:bg-slate-100/50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-slate-800">{t.passengerName}</p>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 uppercase">
                        {t.status || 'ACTIVE'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">CCCD/Hộ chiếu: {t.documentNumber} • Quốc tịch: {t.nationality}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-violet-600 bg-violet-50 border border-violet-200 px-3 py-1 rounded-lg">
                      Ghế: {t.seatNumber || 'Chưa xếp'}
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-2">{t.price?.toLocaleString('vi-VN')} đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> Điều khoản hoàn hủy vé
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">Hỗ trợ hủy hoàn vé</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Vé này cho phép hoàn hủy trước giờ khởi hành tối thiểu 24 giờ. Phí xử lý áp dụng là 150.000 đ.</p>
              </div>
            </div>
            <div className="space-y-3.5 text-sm">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Chi tiết phí</p>
              {[
                { label: 'Phí xử lý giao dịch', sub: 'Áp dụng theo quy định của hãng hàng không', val: '150.000 đ', valClass: 'text-slate-700' },
                { label: 'Phí phạt hủy', sub: 'Được giảm trừ cho khách hàng thân thiết', val: '0 đ', valClass: 'text-emerald-600' },
              ].map(({ label, sub, val, valClass }) => (
                <div key={label} className="flex justify-between items-start border-b border-slate-100 pb-3.5">
                  <div>
                    <p className="font-medium text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <span className={`font-medium ${valClass}`}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between items-start pt-1">
                <div>
                  <p className="font-bold text-slate-800">Số tiền dự kiến hoàn</p>
                  <p className="text-xs text-slate-400">Hoàn lại phương thức thanh toán ban đầu</p>
                </div>
                <span className="text-lg font-bold text-sky-600">{refundAmount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {booking.status !== 'CANCELLED' && (
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Hủy đặt vé
                </button>
              )}
              {booking.paymentStatus !== 'PAID' && booking.status !== 'CANCELLED' && (
                <button
                  onClick={handleConfirmPayment}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Xác nhận đã nhận tiền
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> In hóa đơn
              </button>
              <button
                onClick={handleSendEticket}
                className="px-5 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Gửi E-Ticket
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-1 border-t border-slate-100">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Mã đặt vé</p>
              <p className="text-xs text-sky-600 font-bold">#{booking.bookingId}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Phương thức</p>
              <p className="text-xs text-slate-700 font-medium">Chuyển khoản</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Hạn thanh toán</p>
              <p className="text-xs text-red-500 font-bold">{formatDateTime(booking.expirationTime)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;