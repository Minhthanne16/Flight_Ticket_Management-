import { useState } from 'react';
import { TrendingUp, Ticket, PlaneTakeoff, Users, ArrowUpRight, ArrowDownRight, Eye, ChevronRight } from 'lucide-react';
import { ADMIN_STATS, REVENUE_CHART, ADMIN_BOOKINGS, ADMIN_FLIGHTS } from '../../data/adminMockData';

const fmt = (n) => n.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
const fmtShort = (n) => n >= 1e9 ? `${(n / 1e9).toFixed(1)} tỷ` : n >= 1e6 ? `${(n / 1e6).toFixed(0)} tr` : n.toLocaleString('vi-VN');

const STATUS_LABEL = { CONFIRMED: 'Đã xác nhận', PENDING: 'Chờ thanh toán', CANCELLED: 'Đã hủy' };
const STATUS_STYLE = { CONFIRMED: 'bg-emerald-50 text-emerald-700 border border-emerald-200', PENDING: 'bg-amber-50 text-amber-700 border border-amber-200', CANCELLED: 'bg-red-50 text-red-700 border border-red-200' };
const FLIGHT_STATUS_STYLE = { BOARDING: 'bg-violet-50 text-violet-700 border border-violet-200', SCHEDULED: 'bg-indigo-50 text-indigo-700 border border-indigo-200', DELAYED: 'bg-red-50 text-red-700 border border-red-200', ARRIVED: 'bg-emerald-50 text-emerald-700 border border-emerald-200', CANCELLED: 'bg-gray-100 text-gray-500 border border-gray-200' };
const FLIGHT_STATUS_LABEL = { BOARDING: 'Đang lên tàu', SCHEDULED: 'Dự kiến', DELAYED: 'Bị trễ', ARRIVED: 'Đã hạ cánh', CANCELLED: 'Đã hủy' };

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

function RevenueChart() {
  const max = Math.max(...REVENUE_CHART.map(d => d.revenue));
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-bold text-slate-800">Doanh thu 7 ngày qua</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tổng: {fmtShort(REVENUE_CHART.reduce((s, d) => s + d.revenue, 0))} đồng</p>
        </div>
        <span className="text-xs bg-violet-50 text-violet-600 font-semibold px-2.5 py-1 rounded-full border border-violet-100">Tuần này</span>
      </div>
      <div className="flex items-end gap-3 h-44">
        {REVENUE_CHART.map((d) => {
          const pct = (d.revenue / max) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1.5 group">
              <span className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">{fmtShort(d.revenue)}</span>
              <div className="w-full relative rounded-t-lg overflow-hidden" style={{ height: `${Math.max(pct, 4)}%`, background: 'linear-gradient(to top, #7C5CFC, #A78BFA)', transition: 'all 0.3s' }} />
              <span className="text-[11px] font-semibold text-slate-500">{d.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const activeFlights = ADMIN_FLIGHTS.filter(f => ['BOARDING', 'SCHEDULED'].includes(f.status)).length;
  const delayedFlights = ADMIN_FLIGHTS.filter(f => f.status === 'DELAYED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{greeting}, {user.email?.split('@')[0] || 'Admin'} 👋</h1>
          <p className="text-sm text-slate-400 mt-0.5">{now.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}</p>
        </div>
        {delayedFlights > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-xl text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {delayedFlights} chuyến bay bị trễ
          </div>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tổng doanh thu tháng" value={fmtShort(ADMIN_STATS.totalRevenue)} growth={ADMIN_STATS.revenueGrowth} icon={TrendingUp} color="bg-violet-500" />
        <StatCard label="Tổng vé bán ra" value={ADMIN_STATS.totalTickets.toLocaleString('vi-VN')} growth={ADMIN_STATS.ticketGrowth} sub="Tháng hiện tại" icon={Ticket} color="bg-indigo-500" />
        <StatCard label="Chuyến bay tháng này" value={ADMIN_STATS.totalFlights} growth={ADMIN_STATS.flightGrowth} sub={`${activeFlights} đang hoạt động`} icon={PlaneTakeoff} color="bg-emerald-500" />
        <StatCard label="Tỷ lệ lấp đầy trung bình" value={`${ADMIN_STATS.occupancyRate}%`} growth={ADMIN_STATS.occupancyGrowth} icon={Users} color="bg-amber-500" />
      </div>

      {/* Charts + Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue chart - 2 cols */}
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        {/* Flight Status Summary */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="text-base font-bold text-slate-800 mb-4">Chuyến bay hôm nay</h2>
          <div className="space-y-3">
            {ADMIN_FLIGHTS.map(f => {
              const pct = Math.round((f.bookedSeats / f.totalSeats) * 100);
              return (
                <div key={f.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-slate-700">{f.id}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${FLIGHT_STATUS_STYLE[f.status]}`}>
                        {FLIGHT_STATUS_LABEL[f.status]}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">{f.route} · {f.dep}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
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
              {ADMIN_BOOKINGS.slice(0, 6).map(b => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-mono font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded">{b.pnr}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 text-xs font-bold flex-shrink-0">
                        {b.passenger.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{b.passenger}</p>
                        <p className="text-xs text-slate-400">{b.email}</p>
                      </div>
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
