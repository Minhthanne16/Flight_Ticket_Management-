import { useState, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, Ticket, Printer, Send, Plane, AlertCircle, User, Settings, X, MessageSquare, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
          <button onClick={onConfirm} className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${confirmClass}`}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function BookingDetailPage() {
  const navigate = useNavigate();
  const [note, setNote] = useState('Customer requested window seat specifically for view...');
  const [editingNote, setEditingNote] = useState(false);
  const [draftNote, setDraftNote] = useState(note);
  const [toasts, setToasts] = useState([]);
  const [confirm, setConfirm] = useState(null);
  const [status, setStatus] = useState('Confirmed');

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message: msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleCancel = () => {
    setConfirm({
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel booking BK-1024? This will initiate a refund of 2.750.000 đ to the customer.',
      confirmLabel: 'Cancel Booking',
      confirmClass: 'bg-red-500 hover:bg-red-600',
      onConfirm: () => {
        setStatus('Cancelled');
        addToast('Booking BK-1024 has been cancelled successfully.', 'success');
        setConfirm(null);
      }
    });
  };

  const handleSendEticket = () => {
    addToast('E-ticket sent to vananh.nguyen@email.com', 'success');
  };

  const handlePrint = () => {
    addToast('Receipt sent to printer.', 'success');
  };

  const handleSaveNote = () => {
    setNote(draftNote);
    setEditingNote(false);
    addToast('Internal note updated.', 'success');
  };

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
        <button onClick={() => navigate('/staff/booking')} className="hover:text-sky-500 transition-colors font-medium">Bookings</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-slate-700">BK-1024</span>
        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${status === 'Confirmed' ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
            status === 'Cancelled' ? 'text-slate-500 bg-slate-100 border-slate-200' :
              'text-amber-700 bg-amber-50 border-amber-200'
          }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left */}
        <div className="space-y-5">
          {/* Passenger */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-11 h-11 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-base">NV</div>
              <div>
                <h2 className="text-base font-bold text-slate-800">Nguyen Van Anh</h2>
                <span className="text-[10px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Platinum Member</span>
              </div>
            </div>
            <div className="space-y-2.5 text-sm text-slate-500">
              <p className="flex items-center gap-2.5"><span>📞</span> +84 908 111 233</p>
              <p className="flex items-center gap-2.5"><span>✉</span> vananh.nguyen@email.com</p>
              <p className="flex items-center gap-2.5"><span>📍</span> District 1, Ho Chi Minh City</p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 flex items-center gap-2 text-sm">
              <Ticket className="w-4 h-4 text-sky-500" /> Payment & Voucher
            </h3>
            <div className="mb-5">
              <p className="text-xs text-slate-400 mb-1">Total Amount</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-slate-800">2.900.000 đ</span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> PAID
                </span>
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 mb-5 flex justify-between items-center border border-dashed border-slate-200">
              <div className="flex items-center gap-2">
                <div className="bg-violet-100 p-1.5 rounded-lg">
                  <Ticket className="w-3.5 h-3.5 text-violet-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-violet-600">FLY-2024-XJ9</p>
                  <p className="text-[10px] text-slate-400">Seasonal Discount</p>
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700">-250.000 đ</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-slate-500"><span>Base Fare</span><span>2.750.000 đ</span></div>
              <div className="flex justify-between text-slate-500"><span>Taxes & Fees</span><span>400.000 đ</span></div>
              <div className="flex justify-between text-violet-600 font-medium pt-2 border-t border-slate-100">
                <span>Voucher Applied</span><span>-250.000 đ</span>
              </div>
            </div>
          </div>

          {/* Internal Note */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-slate-400" /> Internal Note
              </h3>
              {!editingNote && (
                <button onClick={() => { setDraftNote(note); setEditingNote(true); }} className="text-xs text-sky-500 hover:underline">Edit</button>
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
                  <button onClick={handleSaveNote} className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-600">Save</button>
                  <button onClick={() => setEditingNote(false)} className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:bg-slate-50">Cancel</button>
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
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Flight Number</p>
                <h2 className="text-3xl font-bold">VN123</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Date & Time</p>
                <p className="text-base font-semibold">26 Oct, 2024 • 08:30 AM</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div>
                <h3 className="text-4xl font-bold">SGN</h3>
                <p className="text-sm text-white/40 mt-1">Ho Chi Minh City</p>
              </div>
              <div className="flex-1 px-8 flex flex-col items-center">
                <p className="text-xs text-white/40 mb-2">2h 15m</p>
                <div className="w-full flex items-center gap-2">
                  <div className="h-px flex-1 bg-white/20" />
                  <Plane className="w-4 h-4 text-sky-400" />
                  <div className="h-px flex-1 bg-white/20" />
                </div>
                <p className="text-xs text-white/30 mt-2">Non-stop</p>
              </div>
              <div className="text-right">
                <h3 className="text-4xl font-bold">HAN</h3>
                <p className="text-sm text-white/40 mt-1">Ha Noi</p>
              </div>
            </div>

            <div className="flex gap-8 relative z-10 border-t border-white/10 pt-5">
              {[['Seat', '12A'], ['Class', 'Business'], ['Terminal', 'T2']].map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{label}</p>
                  <p className="text-base font-bold">{val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-700 mb-4 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" /> Cancellation & Refund Policy
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-800 text-sm">Eligible for Refund</h4>
                <p className="text-xs text-emerald-700 mt-0.5">Business Flex fare allows cancellation up to 24 hours before departure.</p>
              </div>
            </div>
            <div className="space-y-3.5 text-sm">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Fee Breakdown</p>
              {[
                { label: 'Processing Fee', sub: 'Standard airline administration fee', val: '150.000 đ', valClass: 'text-slate-700' },
                { label: 'Cancellation Penalty', sub: 'Waived for Platinum members', val: '0 đ', valClass: 'text-emerald-600' },
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
                  <p className="font-bold text-slate-800">Estimated Refund</p>
                  <p className="text-xs text-slate-400">Credited to original payment method</p>
                </div>
                <span className="text-lg font-bold text-sky-600">2.750.000 đ</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-2">
              {status !== 'Cancelled' && (
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                >
                  Cancel Booking
                </button>
              )}
              <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors">
                Modify Booking
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={handleSendEticket}
                className="px-5 py-2.5 bg-sky-500 text-white rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send E-Ticket
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-3 gap-4 pt-4 mt-1 border-t border-slate-100">
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Created By</p>
              <p className="text-xs text-slate-700 font-medium flex items-center gap-1"><User className="w-3 h-3" /> Admin LeMinh</p>
              <p className="text-[10px] text-slate-400">20 Oct, 14:22</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Last Updated</p>
              <p className="text-xs text-slate-700 font-medium flex items-center gap-1"><Settings className="w-3 h-3" /> Auto-System</p>
              <p className="text-[10px] text-slate-400">22 Oct, 09:10</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-slate-400 font-semibold mb-1">Booking ID</p>
              <p className="text-xs text-sky-600 font-bold">BK-1024</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailPage;