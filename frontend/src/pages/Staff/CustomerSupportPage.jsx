import { useState } from 'react';
import { Search, Eye, ChevronLeft, ChevronRight, FileDown, ArrowLeft, MessageSquare, Filter } from 'lucide-react';
import { CANCEL_REQUESTS, REFUND_REQUESTS, COMPLAINTS, SYSTEM_ERRORS } from '../../data/sharedData';

const TABS = [
  { id: 'cancel', label: 'Yêu cầu huỷ vé' },
  { id: 'exchange', label: 'Yêu cầu đổi vé' },
  { id: 'complaint', label: 'Khiếu nại' },
  { id: 'system', label: 'Lỗi hệ thống vé' },
];

const cancelStatusStyle = {
  'Đang chờ': 'text-amber-700 bg-amber-50 border border-amber-200',
  'Đã duyệt': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'Bị từ chối': 'text-red-600 bg-red-50 border border-red-200',
};

const refundStatusStyle = {
  'Đã hoàn': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'Chờ hoàn': 'text-amber-700 bg-amber-50 border border-amber-200',
  'Từ chối': 'text-red-600 bg-red-50 border border-red-200',
};

const processStatusStyle = {
  'N/A': 'text-[#9CA3AF] bg-[#F5F6FA]',
  'Đang duyệt': 'text-amber-700 bg-amber-50 border border-amber-200',
  'Lưu trữ': 'text-[#6C5CE7] bg-[#E9E8FC] border border-[#D4D0F8]',
  'Đã phê duyệt': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
};

const complaintStatusStyle = {
  'OPEN': 'text-amber-700 bg-amber-50 border border-amber-200',
  'IN PROGRESS': 'text-[#6C5CE7] bg-[#E9E8FC] border border-[#D4D0F8]',
  'RESOLVED': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'CLOSED': 'text-[#6E7491] bg-[#F0F0F5] border border-[#E8E8F0]',
};

const severityStyle = {
  'CRITICAL': 'text-red-700 bg-red-50 border border-red-200',
  'HIGH': 'text-amber-700 bg-amber-50 border border-amber-200',
  'MEDIUM': 'text-[#6C5CE7] bg-[#E9E8FC] border border-[#D4D0F8]',
};

const errorStatusDot = {
  'Chờ xử lý': 'bg-red-500',
  'Đang xử lý': 'bg-amber-500',
  'Đã xử lý': 'bg-emerald-500',
};

function Avatar({ initials, color }) {
  const colors = ['bg-[#6C5CE7]', 'bg-emerald-500', 'bg-amber-500', 'bg-red-500', 'bg-sky-500'];
  const bg = color || colors[initials.charCodeAt(0) % colors.length];
  return (
    <div className={`w-8 h-8 rounded-full ${bg} flex items-center justify-center shrink-0`}>
      <span className="text-[10px] font-bold text-white">{initials}</span>
    </div>
  );
}

function Pagination({ current, total, onChange }) {
  if (total <= 1) return null;
  return (
    <div className="px-6 py-4 border-t border-[#E8E8F0] flex items-center justify-between">
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
        className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6E7491] border border-[#E8E8F0] rounded-lg disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors">
        <ChevronLeft className="w-3.5 h-3.5" /> Trước
      </button>
      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(total, 3) }, (_, i) => (
          <button key={i + 1} onClick={() => onChange(i + 1)}
            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${current === i + 1 ? 'bg-[#6C5CE7] text-white' : 'text-[#6E7491] hover:bg-[#F0EFFA]'}`}>
            {i + 1}
          </button>
        ))}
        {total > 3 && <span className="px-1 text-[#9CA3AF]">...</span>}
        {total > 3 && (
          <button onClick={() => onChange(total)}
            className={`w-8 h-8 rounded-lg text-xs font-bold ${current === total ? 'bg-[#6C5CE7] text-white' : 'text-[#6E7491] hover:bg-[#F0EFFA]'}`}>{total}</button>
        )}
      </div>
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
        className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-[#6E7491] border border-[#E8E8F0] rounded-lg disabled:opacity-30 hover:bg-[#F0EFFA] transition-colors">
        Tiếp <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function SearchFilter({ search, setSearch, onFilter }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 p-5 bg-[#FAFAFE] rounded-xl border border-[#E8E8F0] mb-5">
      <div className="flex-1">
        <label className="text-xs font-semibold text-[#6E7491] mb-1.5 block">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Booking ID, tên khách hàng hoặc số điện thoại..."
            className="w-full pl-9 pr-4 py-2.5 border border-[#E8E8F0] rounded-lg text-sm placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]/40 bg-white transition-all" />
        </div>
      </div>
      <div className="w-48">
        <label className="text-xs font-semibold text-[#6E7491] mb-1.5 block">Trạng thái</label>
        <select className="w-full px-3 py-2.5 border border-[#E8E8F0] rounded-lg text-sm text-[#6E7491] bg-white focus:outline-none cursor-pointer">
          <option>Tất cả trạng thái</option>
        </select>
      </div>
      <div className="flex items-end">
        <button className="px-5 py-2.5 bg-white border border-[#E8E8F0] rounded-lg text-sm font-semibold text-[#27273F] hover:bg-[#F0EFFA] transition-colors">
          Lọc kết quả
        </button>
      </div>
    </div>
  );
}

// ─── TAB: Cancel Requests ───────────────────────────────────────────────────
function CancelTab() {
  const [search, setSearch] = useState('');
  const pendingCount = CANCEL_REQUESTS.filter(r => r.status === 'Đang chờ').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#27273F]">Yêu cầu huỷ vé</h2>
          <p className="text-sm text-[#6E7491] mt-1">Bạn có <span className="font-bold text-[#6C5CE7]">{pendingCount * 3} yêu cầu</span> đang chờ xử lý.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#6C5CE7] text-white rounded-lg text-sm font-semibold hover:bg-[#5A4BD1] transition-colors">
          <FileDown className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>
      <SearchFilter search={search} setSearch={setSearch} />
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E8F0] bg-[#FAFAFE] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
              <th className="px-6 py-4">Booking ID</th>
              <th className="px-6 py-4">Khách Hàng</th>
              <th className="px-6 py-4">Thông Tin Chuyến Bay</th>
              <th className="px-6 py-4">Lý Do</th>
              <th className="px-6 py-4">Ngày Yêu Cầu</th>
              <th className="px-6 py-4">Số Tiền Hoàn</th>
              <th className="px-6 py-4 text-center">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F5]">
            {CANCEL_REQUESTS.map(r => (
              <tr key={r.id} className="hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-[#6C5CE7]">{r.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={r.avatar} />
                    <div>
                      <div className="text-sm font-semibold text-[#27273F]">{r.customer}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-[#27273F]">{r.flight}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{r.flightCode} • {r.flightDate}</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6E7491]">{r.reason}</td>
                <td className="px-6 py-4 text-sm text-[#6E7491]">{r.requestDate}</td>
                <td className="px-6 py-4 text-sm font-bold text-[#6C5CE7]">{r.refundAmount}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${cancelStatusStyle[r.status]}`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination current={1} total={3} onChange={() => {}} />
      </div>
    </div>
  );
}

// ─── TAB: Ticket Exchange Requests ───────────────────────────────────────────
const EXCHANGE_REQUESTS = [
  { id: 'EX-0041', customer: 'Nguyễn Văn A', avatar: 'NA', email: 'nva@gmail.com', flight: 'HAN → SGN', flightCode: 'VN202', flightDate: '22/05/2026', type: 'Nâng hạng', from: 'Ghế phổ thông', to: 'Ghế thương gia', requestDate: '21/05/2026', status: 'Đang chờ' },
  { id: 'EX-0042', customer: 'Trần Thị B', avatar: 'TB', email: 'ttb@gmail.com', flight: 'SGN → DAD', flightCode: 'VN530', flightDate: '23/05/2026', type: 'Đổi ghế', from: '14A', to: '2F (cạnh cửa sổ)', requestDate: '21/05/2026', status: 'Đã duyệt' },
  { id: 'EX-0043', customer: 'Lê Minh C', avatar: 'LC', email: 'lmc@gmail.com', flight: 'DAD → HAN', flightCode: 'VN171', flightDate: '24/05/2026', type: 'Đổi ngày bay', from: '24/05/2026', to: '26/05/2026', requestDate: '20/05/2026', status: 'Bị từ chối' },
  { id: 'EX-0044', customer: 'Phạm Quốc D', avatar: 'PD', email: 'pqd@gmail.com', flight: 'HAN → PQC', flightCode: 'VN461', flightDate: '25/05/2026', type: 'Nâng hạng', from: 'Ghế phổ thông', to: 'Ghế hạng nhất', requestDate: '21/05/2026', status: 'Đang chờ' },
  { id: 'EX-0045', customer: 'Hoàng Thị E', avatar: 'HE', email: 'hte@gmail.com', flight: 'SGN → HAN', flightCode: 'VN231', flightDate: '26/05/2026', type: 'Đổi ghế', from: '22C', to: '10A (cạnh lối đi)', requestDate: '21/05/2026', status: 'Đã duyệt' },
];

const exchangeTypeStyle = {
  'Nâng hạng': 'text-violet-700 bg-violet-50 border border-violet-200',
  'Đổi ghế': 'text-sky-700 bg-sky-50 border border-sky-200',
  'Đổi ngày bay': 'text-amber-700 bg-amber-50 border border-amber-200',
};

const exchangeStatusStyle = {
  'Đang chờ': 'text-amber-700 bg-amber-50 border border-amber-200',
  'Đã duyệt': 'text-emerald-700 bg-emerald-50 border border-emerald-200',
  'Bị từ chối': 'text-red-600 bg-red-50 border border-red-200',
};

function ExchangeTab() {
  const [search, setSearch] = useState('');
  const pendingCount = EXCHANGE_REQUESTS.filter(r => r.status === 'Đang chờ').length;
  const filtered = EXCHANGE_REQUESTS.filter(r =>
    r.customer.toLowerCase().includes(search.toLowerCase()) ||
    r.id.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#27273F]">Yêu cầu đổi vé</h2>
          <p className="text-sm text-[#6E7491] mt-1">Có <span className="font-bold text-[#6C5CE7]">{pendingCount} yêu cầu</span> đang chờ xử lý.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#6C5CE7] text-white rounded-lg text-sm font-semibold hover:bg-[#5A4BD1] transition-colors">
          <FileDown className="w-4 h-4" /> Xuất báo cáo
        </button>
      </div>
      <SearchFilter search={search} setSearch={setSearch} />
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E8F0] bg-[#FAFAFE] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
              <th className="px-6 py-4">Mã yêu cầu</th>
              <th className="px-6 py-4">Khách Hàng</th>
              <th className="px-6 py-4">Chuyến Bay</th>
              <th className="px-6 py-4">Loại Đổi</th>
              <th className="px-6 py-4">Từ → Sang</th>
              <th className="px-6 py-4">Ngày Yêu Cầu</th>
              <th className="px-6 py-4 text-center">Trạng Thái</th>
              <th className="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F5]">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-[#6C5CE7]">{r.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={r.avatar} />
                    <div>
                      <div className="text-sm font-semibold text-[#27273F]">{r.customer}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{r.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-semibold text-[#27273F]">{r.flight}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{r.flightCode} • {r.flightDate}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${exchangeTypeStyle[r.type] || 'text-slate-600 bg-slate-100'}`}>
                    {r.type}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs text-[#6E7491]">
                    <span className="line-through opacity-60">{r.from}</span>
                    <span className="mx-1 text-[#6C5CE7] font-bold">→</span>
                    <span className="font-semibold text-[#27273F]">{r.to}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6E7491]">{r.requestDate}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${exchangeStatusStyle[r.status]}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button className="p-2 text-[#9CA3AF] hover:text-[#6C5CE7] hover:bg-[#E9E8FC] rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination current={1} total={3} onChange={() => {}} />
      </div>
    </div>
  );
}

// ─── TAB: Complaints ────────────────────────────────────────────────────────
function ComplaintTab() {
  const [search, setSearch] = useState('');
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#27273F]">Khiếu nại</h2>
          <p className="text-sm text-[#6E7491] mt-1">Quản lý và phản hồi các vấn đề phát sinh từ khách hàng.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E8E8F0] rounded-lg text-sm font-semibold text-[#27273F] hover:bg-[#F0EFFA] transition-colors">
          <Filter className="w-4 h-4" /> Bộ lọc nâng cao
        </button>
      </div>
      <SearchFilter search={search} setSearch={setSearch} />
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E8F0] bg-[#FAFAFE] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
              <th className="px-6 py-4">Complaint ID</th>
              <th className="px-6 py-4">Khách Hàng</th>
              <th className="px-6 py-4">Chủ Đề</th>
              <th className="px-6 py-4">Ngày Gửi</th>
              <th className="px-6 py-4">Trạng Thái</th>
              <th className="px-6 py-4 text-center">Hành Động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F5]">
            {COMPLAINTS.map(c => (
              <tr key={c.id} className="hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4 text-sm font-bold text-[#6C5CE7]">{c.id}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={c.avatar} />
                    <div>
                      <div className="text-sm font-semibold text-[#27273F]">{c.customer}</div>
                      <div className="text-[11px] text-[#9CA3AF]">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-[#27273F]">{c.subject}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{c.flightInfo}</div>
                </td>
                <td className="px-6 py-4 text-sm text-[#6E7491]">{c.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${complaintStatusStyle[c.status]}`}>{c.status}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-2 text-[#9CA3AF] hover:text-[#6C5CE7] hover:bg-[#E9E8FC] rounded-lg transition-all">
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-[#9CA3AF] hover:text-[#6C5CE7] hover:bg-[#E9E8FC] rounded-lg transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination current={1} total={3} onChange={() => {}} />
      </div>
    </div>
  );
}

// ─── TAB: System Errors ─────────────────────────────────────────────────────
function SystemErrorTab() {
  const [search, setSearch] = useState('');
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#27273F]">Lỗi hệ thống vé</h2>
          <p className="text-sm text-[#6E7491] mt-1">Quản lý và xử lý các sự cố kỹ thuật phát sinh trong quá trình đặt vé và thanh toán.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-[#E8E8F0] rounded-lg text-sm font-semibold text-[#27273F] hover:bg-[#F0EFFA] transition-colors">
            <Filter className="w-4 h-4" /> Bộ lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#6C5CE7] text-white rounded-lg text-sm font-semibold hover:bg-[#5A4BD1] transition-colors">
            Cập nhật dữ liệu
          </button>
        </div>
      </div>
      <SearchFilter search={search} setSearch={setSearch} />
      <div className="bg-white rounded-2xl border border-[#E8E8F0] shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#E8E8F0] bg-[#FAFAFE] text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">
              <th className="px-6 py-4">Loại Lỗi</th>
              <th className="px-6 py-4">Ticket ID</th>
              <th className="px-6 py-4">Nội Dung Lỗi</th>
              <th className="px-6 py-4">Thời Gian</th>
              <th className="px-6 py-4">Mức Độ</th>
              <th className="px-6 py-4">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0F0F5]">
            {SYSTEM_ERRORS.map(e => (
              <tr key={e.id} className="hover:bg-[#FAFAFE] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span>{e.typeIcon}</span>
                    <span className="text-sm font-semibold text-[#27273F]">{e.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm font-bold text-[#6C5CE7]">{e.id}</td>
                <td className="px-6 py-4 text-sm text-[#6E7491] max-w-[240px] truncate">{e.description}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-[#27273F]">{e.time}</div>
                  <div className="text-[11px] text-[#9CA3AF]">{e.timeLabel}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${severityStyle[e.severity]}`}>{e.severity}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${errorStatusDot[e.status]}`} />
                    <span className="text-xs font-semibold text-[#6E7491]">{e.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination current={1} total={16} onChange={() => {}} />
      </div>
    </div>
  );
}

// ─── MAIN PAGE ──────────────────────────────────────────────────────────────
function CustomerSupportPage() {
  const [activeTab, setActiveTab] = useState('cancel');

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E8E8F0]">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id
                ? 'text-[#6C5CE7] border-[#6C5CE7]'
                : 'text-[#9CA3AF] border-transparent hover:text-[#6E7491]'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'cancel' && <CancelTab />}
      {activeTab === 'exchange' && <ExchangeTab />}
      {activeTab === 'complaint' && <ComplaintTab />}
      {activeTab === 'system' && <SystemErrorTab />}
    </div>
  );
}

export default CustomerSupportPage;