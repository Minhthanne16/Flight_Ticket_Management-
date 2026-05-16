import { useState } from 'react';
import { Search, Send, CheckCircle2, Clock, AlertCircle, X, ChevronRight } from 'lucide-react';
import { SUPPORT_TICKETS, STAFF_USER } from '../../data/sharedData';

const priorityStyle = {
  High: 'text-red-600 bg-red-50 border-red-200',
  Medium: 'text-amber-700 bg-amber-50 border-amber-200',
  Low: 'text-slate-500 bg-slate-100 border-slate-200',
};

const statusStyle = {
  Open: 'text-red-600 bg-red-50 border-red-200',
  'In Progress': 'text-violet-700 bg-violet-50 border-violet-200',
  Resolved: 'text-emerald-700 bg-emerald-50 border-emerald-200',
};

function CustomerSupportPage() {
  const [tickets, setTickets] = useState(SUPPORT_TICKETS);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase();
    const matchSearch = !q || t.customer.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const selectedTicket = selected ? tickets.find(t => t.id === selected) : null;

  const handleSendReply = () => {
    if (!reply.trim() || !selected) return;
    setTickets(prev => prev.map(t => {
      if (t.id !== selected) return t;
      return {
        ...t,
        status: t.status === 'Open' ? 'In Progress' : t.status,
        messages: [...t.messages, { from: 'staff', text: reply.trim(), time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) }],
      };
    }));
    setReply('');
  };

  const handleResolve = (id) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

  const openCount = tickets.filter(t => t.status === 'Open').length;
  const inProgressCount = tickets.filter(t => t.status === 'In Progress').length;

  return (
    <div className="space-y-5 h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Customer Support</h1>
          <p className="text-sm text-slate-400 mt-0.5">Quản lý yêu cầu hỗ trợ từ hành khách.</p>
        </div>
        <div className="flex gap-2 text-xs font-semibold">
          <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl">
            <AlertCircle className="w-3.5 h-3.5" /> {openCount} Open
          </div>
          <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-200 text-violet-700 px-3 py-2 rounded-xl">
            <Clock className="w-3.5 h-3.5" /> {inProgressCount} In Progress
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[600px]">
        {/* Ticket list */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Tìm ticket..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all" />
            </div>
            <div className="flex gap-1">
              {['All', 'Open', 'In Progress', 'Resolved'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${statusFilter === s ? 'bg-violet-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-400">Không có ticket nào</div>
            ) : filtered.map(t => (
              <button key={t.id} onClick={() => setSelected(t.id)}
                className={`w-full text-left px-4 py-3.5 hover:bg-slate-50 transition-colors ${selected === t.id ? 'bg-violet-50/60 border-r-2 border-violet-500' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs font-bold text-violet-600">{t.id}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[t.status]}`}>{t.status}</span>
                </div>
                <p className="text-sm font-semibold text-slate-700 leading-tight">{t.subject}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.customer} · {t.created}</p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityStyle[t.priority]}`}>{t.priority}</span>
                  <span className="text-[10px] text-slate-400">Booking {t.booking}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat / detail panel */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 p-8">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center">
                <ChevronRight className="w-6 h-6 text-violet-400" />
              </div>
              <p className="text-sm font-medium">Chọn một ticket để xem chi tiết</p>
            </div>
          ) : (
            <>
              {/* Ticket header */}
              <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-violet-600">{selectedTicket.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle[selectedTicket.status]}`}>{selectedTicket.status}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyle[selectedTicket.priority]}`}>{selectedTicket.priority}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-800">{selectedTicket.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedTicket.customer} · {selectedTicket.email} · Booking {selectedTicket.booking}
                  </p>
                </div>
                {selectedTicket.status !== 'Resolved' && (
                  <button onClick={() => handleResolve(selected)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã giải quyết
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selectedTicket.messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'staff' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.from === 'staff'
                        ? 'bg-violet-600 text-white rounded-br-sm'
                        : 'bg-slate-100 text-slate-700 rounded-bl-sm'
                      }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.from === 'staff' ? 'text-violet-200' : 'text-slate-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {selectedTicket.status !== 'Resolved' ? (
                <div className="p-4 border-t border-slate-100 flex gap-2">
                  <input
                    type="text"
                    value={reply}
                    onChange={e => setReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSendReply()}
                    placeholder="Nhập phản hồi..."
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                  />
                  <button onClick={handleSendReply} disabled={!reply.trim()}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="p-4 border-t border-slate-100 text-center text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Ticket đã được giải quyết
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerSupportPage;