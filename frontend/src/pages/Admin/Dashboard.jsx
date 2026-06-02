import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Ticket, PlaneTakeoff, Users, ArrowUpRight, ArrowDownRight, ChevronRight, Loader2, AlertCircle, RefreshCw, Download } from 'lucide-react';
import { bookingService } from '../../api/services/bookingService';
import { flightService } from '../../api/services/flightService';
import { reportService } from '../../api/services/reportService';

const shortNum = (n, div) => (n / div).toFixed(1).replace(/\.0$/, '').replace('.', ',');
const fmtShort = (n) => {
  n = Number(n || 0);
  if (n >= 1e9) return `${shortNum(n, 1e9)} tỷ`;
  if (n >= 1e6) return `${shortNum(n, 1e6)} tr`;
  return n.toLocaleString('vi-VN');
};
const unwrap = (res) => res?.data?.data ?? res?.data ?? null;

// Xuất mảng-các-hàng ra file CSV (kèm BOM để Excel đọc đúng tiếng Việt)
const downloadCsv = (filename, rows) => {
  const csv = '﻿' + rows.map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Booking thật (BookingResponse) -> nhóm trạng thái hiển thị
const normStatus = (s) => {
  const v = String(s || '').toUpperCase();
  if (['CONFIRMED', 'PAID', 'SUCCESS', 'COMPLETED'].includes(v)) return 'CONFIRMED';
  if (['CANCELLED', 'CANCELED', 'EXPIRED'].includes(v)) return 'CANCELLED';
  return 'PENDING';
};
// Booking được tính doanh thu/vé bán (không phải đơn huỷ/hết hạn)
const isRevenueBooking = (b) => normStatus(b.status) === 'CONFIRMED';
// Vé còn hiệu lực (đã giữ chỗ) — bỏ vé huỷ/hoàn
const activeTickets = (b) => (b.tickets || []).filter(t => !['CANCELLED', 'REFUNDED'].includes(String(t.status || '').toUpperCase()));

const sameDay = (iso, d) => {
  if (!iso) return false;
  const x = new Date(iso);
  return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth() && x.getDate() === d.getDate();
};
const sameMonth = (iso, d) => {
  if (!iso) return false;
  const x = new Date(iso);
  return x.getFullYear() === d.getFullYear() && x.getMonth() === d.getMonth();
};

const growthStr = (cur, prev) => {
  if (!prev) return cur > 0 ? '+100%' : null;
  const pct = ((cur - prev) / prev) * 100;
  if (!Number.isFinite(pct) || Math.abs(pct) < 0.5) return null;
  return `${pct > 0 ? '+' : ''}${pct.toFixed(0)}%`;
};

const STATUS_LABEL = { CONFIRMED: 'Đã xác nhận', PENDING: 'Chờ thanh toán', CANCELLED: 'Đã hủy' };
const STATUS_STYLE = { CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-200', PENDING: 'bg-amber-50 text-amber-700 border border-amber-200', CANCELLED: 'bg-red-50 text-red-700 border border-red-200' };
const FLIGHT_STATUS_STYLE = { BOARDING: 'bg-violet-50 text-violet-700 border border-violet-200', SCHEDULED: 'bg-indigo-50 text-indigo-700 border border-indigo-200', DELAYED: 'bg-red-50 text-red-700 border border-red-200', DEPARTED: 'bg-sky-50 text-sky-700 border border-sky-200', COMPLETED: 'bg-emerald-50 text-emerald-700 border border-emerald-200', CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200' };
const FLIGHT_STATUS_LABEL = { BOARDING: 'Đang lên tàu', SCHEDULED: 'Dự kiến', DELAYED: 'Bị trễ', DEPARTED: 'Đã khởi hành', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy' };

function StatCard({ label, value, sub, growth, icon: Icon, color }) {
  const positive = growth?.startsWith('+');
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {growth && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${positive ? 'text-emerald-600' : 'text-red-500'}`}>
            {positive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {growth}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-0.5">{value}</div>
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function RevenueChart({ chart }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const max = Math.max(1, ...chart.map(d => d.revenue));
  const total = chart.reduce((s, d) => s + d.revenue, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-base font-bold text-slate-800">Doanh thu 7 ngày qua</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tổng: {fmtShort(total)} đồng</p>
        </div>
        <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full border border-violet-100">Tuần này</span>
      </div>
      <div className="flex items-end gap-4 flex-1 pb-2 min-h-[12rem]">
        {chart.map((d, i) => {
          const pct = (d.revenue / max) * 100;
          return (
            <div key={d.key} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
              <div className="absolute -top-14 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded-lg z-20 whitespace-nowrap pointer-events-none shadow-lg transform group-hover:-translate-y-1">
                <span className="font-bold text-[11px] mb-0.5">{fmtShort(d.revenue)}</span>
                <span className="text-slate-300">{d.tickets} vé</span>
                <div className="absolute -bottom-1 w-2 h-2 bg-slate-800 rotate-45"></div>
              </div>
              <div
                className="w-full relative rounded-t-xl overflow-hidden transition-all duration-1000 ease-out cursor-pointer group-hover:brightness-110 shadow-sm"
                style={{
                  height: show ? `${Math.max(pct, 2)}%` : '0%',
                  background: 'linear-gradient(to top, #6366f1, #a855f7)',
                  transitionDelay: `${i * 75}ms`
                }}
              >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-[11px] font-semibold text-slate-500 mt-1">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const PAY_LABEL = { PAID: 'Đã thanh toán', SUCCESS: 'Đã thanh toán', UNPAID: 'Chưa thanh toán', PENDING: 'Chưa thanh toán', FAILED: 'Thất bại', REFUNDED: 'Đã hoàn tiền' };
const payLabel = (s) => PAY_LABEL[String(s || '').toUpperCase()] || 'Chưa thanh toán';

const EMPTY = { stats: { totalRevenue: 0, revenueGrowth: null, totalTickets: 0, ticketGrowth: null, totalFlights: 0, activeFlights: 0, delayedFlights: 0, occupancyRate: 0 }, chart: [], todayFlights: [], recentBookings: [], allBookings: [] };

export default function Dashboard() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const today = new Date();
    const month = today.getMonth() + 1, year = today.getFullYear();
    const prev = new Date(year, today.getMonth() - 1, 1);
    const prevMonth = prev.getMonth() + 1, prevYear = prev.getFullYear();

    try {
      const [bookings, flights, revThisRes, revPrevRes] = await Promise.all([
        bookingService.getAll(),
        flightService.getAdminList().catch(() => []),
        reportService.getRevenue(month, year).catch(() => null),
        reportService.getRevenue(prevMonth, prevYear).catch(() => null),
      ]);

      // Bản đồ chuyến bay
      const flightMap = {};
      flights.forEach(f => { flightMap[f.id] = { code: f.flightCode, route: f.routeCode || (f.departureCity && f.arrivalCity ? `${f.departureCity} → ${f.arrivalCity}` : '—') }; });

      // Số vé còn hiệu lực theo chuyến (để tính lấp đầy)
      const bookedByFlight = {};
      bookings.forEach(b => {
        if (normStatus(b.status) === 'CANCELLED') return;
        bookedByFlight[b.flightId] = (bookedByFlight[b.flightId] || 0) + activeTickets(b).length;
      });

      // Doanh thu tháng (ưu tiên báo cáo backend — chỉ tính CONFIRMED)
      const revThis = unwrap(revThisRes);
      const revPrev = unwrap(revPrevRes);
      const totalRevenue = Number(revThis?.revenue || 0);
      const prevRevenue = Number(revPrev?.revenue || 0);

      // Vé bán ra tháng này / tháng trước
      const ticketsThis = bookings.filter(b => isRevenueBooking(b) && sameMonth(b.bookingDate, today)).reduce((s, b) => s + activeTickets(b).length, 0);
      const ticketsPrev = bookings.filter(b => isRevenueBooking(b) && sameMonth(b.bookingDate, prev)).reduce((s, b) => s + activeTickets(b).length, 0);

      // Chuyến bay tháng này
      const flightsThisMonth = flights.filter(f => sameMonth(f.departureTime, today));
      const flightsPrevMonth = flights.filter(f => sameMonth(f.departureTime, prev));
      const activeFlights = flights.filter(f => ['SCHEDULED', 'BOARDING'].includes(String(f.status || '').toUpperCase())).length;
      const delayedFlights = flights.filter(f => String(f.status || '').toUpperCase() === 'DELAYED').length;

      // Tỷ lệ lấp đầy trung bình (theo chuyến tháng này có ghế)
      const occFlights = flightsThisMonth.filter(f => Number(f.totalSeats) > 0);
      const totSeats = occFlights.reduce((s, f) => s + Number(f.totalSeats || 0), 0);
      const totBooked = occFlights.reduce((s, f) => s + (bookedByFlight[f.id] || 0), 0);
      const occupancyRate = totSeats > 0 ? Math.round((totBooked / totSeats) * 100) : 0;

      // Biểu đồ doanh thu 7 ngày
      const chart = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
        const dayBookings = bookings.filter(b => isRevenueBooking(b) && sameDay(b.bookingDate, d));
        chart.push({
          key: `${d.getMonth() + 1}-${d.getDate()}`,
          day: d.toLocaleDateString('vi-VN', { weekday: 'short' }),
          revenue: dayBookings.reduce((s, b) => s + Number(b.totalAmount || 0), 0),
          tickets: dayBookings.reduce((s, b) => s + activeTickets(b).length, 0),
        });
      }

      // Chuyến bay hôm nay
      const todayFlights = flights.filter(f => sameDay(f.departureTime, today)).map(f => {
        const booked = bookedByFlight[f.id] || 0;
        const total = Number(f.totalSeats || 0);
        return {
          id: f.flightCode || `#${f.id}`,
          route: f.routeCode || (f.departureCity && f.arrivalCity ? `${f.departureCity} → ${f.arrivalCity}` : '—'),
          dep: f.departureTime ? new Date(f.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '—',
          status: String(f.status || '').toUpperCase(),
          pct: total > 0 ? Math.round((booked / total) * 100) : 0,
        };
      });

      // Đặt chỗ gần đây
      const recentBookings = [...bookings]
        .sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0))
        .slice(0, 6)
        .map(b => {
          const fl = flightMap[b.flightId] || {};
          const t = (b.tickets || [])[0] || {};
          return {
            id: b.bookingId || b.id,
            pnr: b.pnrCode || `BK-${b.bookingId || b.id}`,
            passenger: t.passengerName || '—',
            flight: fl.code || (b.flightId ? `#${b.flightId}` : '—'),
            route: fl.route || '—',
            amount: Number(b.totalAmount || 0),
            status: normStatus(b.status),
          };
        });

      // Toàn bộ booking để xuất báo cáo (sort mới nhất trước)
      const allBookings = [...bookings]
        .sort((a, b) => new Date(b.bookingDate || 0) - new Date(a.bookingDate || 0))
        .map(b => {
          const fl = flightMap[b.flightId] || {};
          const t = (b.tickets || [])[0] || {};
          return {
            pnr: b.pnrCode || `BK-${b.bookingId || b.id}`,
            passenger: t.passengerName || '—',
            flight: fl.code || (b.flightId ? `#${b.flightId}` : '—'),
            route: fl.route || '—',
            date: b.bookingDate ? new Date(b.bookingDate).toLocaleString('vi-VN') : '—',
            ticketCount: (b.tickets || []).length,
            amount: Number(b.totalAmount || 0),
            payment: payLabel(b.paymentStatus),
            status: STATUS_LABEL[normStatus(b.status)],
          };
        });

      setData({
        stats: {
          totalRevenue,
          revenueGrowth: growthStr(totalRevenue, prevRevenue),
          totalTickets: ticketsThis,
          ticketGrowth: growthStr(ticketsThis, ticketsPrev),
          totalFlights: flightsThisMonth.length,
          flightGrowth: growthStr(flightsThisMonth.length, flightsPrevMonth.length),
          activeFlights,
          delayedFlights,
          occupancyRate,
        },
        chart,
        todayFlights,
        recentBookings,
        allBookings,
      });
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Không tải được dữ liệu tổng quan.');
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const { stats, chart, todayFlights, recentBookings, allBookings } = data;

  const stamp = () => new Date().toISOString().slice(0, 10);

  const exportBookings = () => {
    if (!allBookings.length) { showToast('Chưa có đơn đặt chỗ để xuất.'); return; }
    const header = ['Mã PNR', 'Hành khách', 'Chuyến bay', 'Tuyến', 'Ngày đặt', 'Số vé', 'Số tiền (VND)', 'Thanh toán', 'Trạng thái'];
    const rows = allBookings.map(b => [b.pnr, b.passenger, b.flight, b.route, b.date, b.ticketCount, b.amount, b.payment, b.status]);
    downloadCsv(`bao-cao-dat-cho_${stamp()}.csv`, [header, ...rows]);
    showToast(`Đã xuất ${allBookings.length} đơn đặt chỗ.`);
  };

  const exportRevenue = () => {
    const header = ['Ngày', 'Doanh thu (VND)', 'Số vé'];
    const rows = chart.map(d => [d.key, d.revenue, d.tickets]);
    const summary = [
      [],
      ['Tổng doanh thu tháng (VND)', stats.totalRevenue],
      ['Tổng vé bán tháng', stats.totalTickets],
      ['Chuyến bay tháng này', stats.totalFlights],
      ['Tỷ lệ lấp đầy trung bình (%)', stats.occupancyRate],
    ];
    downloadCsv(`bao-cao-doanh-thu_${stamp()}.csv`, [header, ...rows, ...summary]);
    showToast('Đã xuất báo cáo doanh thu.');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 className="w-7 h-7 animate-spin text-violet-500 mb-3" />
        <p className="text-sm text-slate-400">Đang tải dữ liệu tổng quan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <AlertCircle className="w-7 h-7 text-red-400 mb-3" />
        <p className="text-sm text-red-400 mb-3">{error}</p>
        <button onClick={load} className="text-xs font-semibold text-violet-600 hover:underline">Thử lại</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white" style={{ backgroundColor: '#16A34A' }}>
          <Download className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{greeting}, {user.email?.split('@')[0] || 'Admin'} 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">{now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {stats.delayedFlights > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              {stats.delayedFlights} chuyến bay bị trễ
            </div>
          )}
          <button onClick={exportBookings} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/10 transition-all">
            <Download className="w-4 h-4" /> Xuất đặt chỗ
          </button>
          <button onClick={exportRevenue} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/10 transition-all">
            <Download className="w-4 h-4" /> Xuất doanh thu
          </button>
          <button onClick={load} className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border bg-white border-slate-200 text-slate-600 hover:border-violet-300 transition-colors">
            <RefreshCw className="w-4 h-4" /> Làm mới
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng doanh thu tháng" value={fmtShort(stats.totalRevenue)} growth={stats.revenueGrowth} icon={TrendingUp} color="bg-violet-500" />
        <StatCard label="Tổng vé bán ra" value={stats.totalTickets.toLocaleString('vi-VN')} growth={stats.ticketGrowth} sub="Tháng hiện tại" icon={Ticket} color="bg-indigo-500" />
        <StatCard label="Chuyến bay tháng này" value={stats.totalFlights} growth={stats.flightGrowth} sub={`${stats.activeFlights} đang hoạt động`} icon={PlaneTakeoff} color="bg-emerald-500" />
        <StatCard label="Tỷ lệ lấp đầy trung bình" value={`${stats.occupancyRate}%`} icon={Users} color="bg-amber-500" />
      </div>

      {/* Charts + Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueChart chart={chart} />
        </div>

        {/* Flight Status Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Chuyến bay hôm nay</h2>
          <div className="space-y-3">
            {todayFlights.length === 0 && <p className="text-sm text-slate-400 py-6 text-center">Không có chuyến bay nào hôm nay</p>}
            {todayFlights.map(f => (
              <div key={f.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-700">{f.id}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${FLIGHT_STATUS_STYLE[f.status] || 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                      {FLIGHT_STATUS_LABEL[f.status] || f.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-1">{f.route} · {f.dep}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${f.pct}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{f.pct}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Đặt chỗ gần đây</h2>
          <a href="/admin/bookings" className="flex items-center gap-1 text-xs text-violet-600 font-semibold hover:underline">
            Xem tất cả <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Mã đặt chỗ</th>
                <th className="px-5 py-3">Hành khách</th>
                <th className="px-5 py-3">Chuyến bay</th>
                <th className="px-5 py-3">Số tiền</th>
                <th className="px-5 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentBookings.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">Chưa có đơn đặt chỗ nào</td></tr>
              )}
              {recentBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">{b.pnr}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold flex-shrink-0">
                        {b.passenger.charAt(0)}
                      </div>
                      <p className="text-sm font-medium text-slate-700">{b.passenger}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-semibold text-slate-700">{b.flight}</p>
                    <p className="text-xs text-slate-400">{b.route}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-700">{b.amount.toLocaleString('vi-VN')}đ</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLE[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
