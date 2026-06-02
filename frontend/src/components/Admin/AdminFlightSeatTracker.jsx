import React, { useState, useEffect, useMemo } from 'react';
import { Plane, Loader2, User, Hash, Ticket as TicketIcon } from 'lucide-react';
import { flightService } from '../../api/services/flightService';

// Màu cho từng hạng ghế (theo thứ tự xuất hiện)
const CLASS_COLORS = ['#7C3AED', '#0891B2', '#059669', '#D97706', '#E11D48', '#475569'];

// Trạng thái ghế theo chuyến bay
const STATUS_STYLE = {
  AVAILABLE: { label: 'Trống', bg: '#ffffff', border: '#CBD5E1', text: '#64748B' },
  HELD: { label: 'Đang giữ', bg: '#FEF3C7', border: '#F59E0B', text: '#B45309' },
  BOOKED: { label: 'Đã đặt', bg: '#003366', border: '#003366', text: '#ffffff' },
  BLOCKED: { label: 'Khóa', bg: '#FEE2E2', border: '#DC2626', text: '#B91C1C' },
};
const statusOf = (s) => STATUS_STYLE[s] || STATUS_STYLE.AVAILABLE;

export default function AdminFlightSeatTracker({ flight }) {
  const [seatMap, setSeatMap] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, seat: null });

  useEffect(() => {
    if (!flight?.dbId) { setSeatMap([]); return; }
    let mounted = true;
    setLoading(true);
    setError('');
    flightService.getSeatMap(flight.dbId)
      .then(data => { if (mounted) setSeatMap(data || []); })
      .catch(() => { if (mounted) setError('Không tải được sơ đồ ghế từ máy chủ.'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [flight?.dbId]);

  // Bảng màu theo hạng ghế
  const classColor = useMemo(() => {
    const ids = [...new Set(seatMap.map(s => s.ticketClassId).filter(v => v != null))];
    const map = new Map();
    ids.forEach((id, i) => map.set(String(id), CLASS_COLORS[i % CLASS_COLORS.length]));
    return (id) => map.get(String(id)) || '#94A3B8';
  }, [seatMap]);

  const classLegend = useMemo(() => {
    const seen = new Map();
    seatMap.forEach(s => {
      if (s.ticketClassId != null && !seen.has(String(s.ticketClassId))) {
        seen.set(String(s.ticketClassId), s.ticketClassName || `Hạng ${s.ticketClassId}`);
      }
    });
    return Array.from(seen.entries()).map(([id, name]) => ({ id, name }));
  }, [seatMap]);

  // Nhóm theo hàng + xác định các cột (để chừa lối đi)
  const { rows, columns, split } = useMemo(() => {
    const byRow = new Map();
    const colSet = new Set();
    seatMap.forEach(s => {
      const r = s.rowNumber ?? 0;
      if (!byRow.has(r)) byRow.set(r, new Map());
      byRow.get(r).set(s.columnLetter, s);
      if (s.columnLetter) colSet.add(s.columnLetter);
    });
    const cols = Array.from(colSet).sort();
    const rowsArr = Array.from(byRow.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([rowNum, seatsByCol]) => ({ rowNum, seatsByCol }));
    return { rows: rowsArr, columns: cols, split: Math.ceil(cols.length / 2) };
  }, [seatMap]);

  // Thống kê
  const stats = useMemo(() => {
    const s = { total: seatMap.length, AVAILABLE: 0, HELD: 0, BOOKED: 0, BLOCKED: 0 };
    seatMap.forEach(x => { s[x.status] = (s[x.status] || 0) + 1; });
    return s;
  }, [seatMap]);

  const showTip = (e, seat) => setTooltip({ visible: true, x: e.clientX + 16, y: e.clientY + 16, seat });
  const moveTip = (e) => setTooltip(t => (t.visible ? { ...t, x: e.clientX + 16, y: e.clientY + 16 } : t));
  const hideTip = () => setTooltip(t => ({ ...t, visible: false }));

  if (!flight) return null;

  return (
    <div className="flex flex-col xl:flex-row gap-6" onMouseMove={moveTip}>
      {/* Tooltip */}
      {tooltip.visible && tooltip.seat && (
        <div className="fixed z-[100] w-60 bg-slate-900 text-white rounded-xl shadow-2xl p-4 pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}>
          <div className="flex items-center justify-between border-b border-slate-700 pb-2 mb-2">
            <p className="font-black text-base text-emerald-400">Ghế {tooltip.seat.seatNumber}</p>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
              style={{ backgroundColor: statusOf(tooltip.seat.status).bg, color: statusOf(tooltip.seat.status).text, border: `1px solid ${statusOf(tooltip.seat.status).border}` }}>
              {statusOf(tooltip.seat.status).label}
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-2">Hạng: <span className="font-semibold text-white">{tooltip.seat.ticketClassName || '—'}</span></p>
          {tooltip.seat.passengerName ? (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm"><User className="w-4 h-4 text-slate-400" /><span className="font-medium">{tooltip.seat.passengerName}</span></div>
              <div className="flex items-center gap-2 text-xs"><TicketIcon className="w-4 h-4 text-slate-400" /><span>Mã vé: <span className="text-amber-300 font-semibold">{tooltip.seat.ticketNumber || '—'}</span></span></div>
              <div className="flex items-center gap-2 text-xs"><Hash className="w-4 h-4 text-slate-400" /><span>PNR: <span className="text-sky-300 font-semibold">{tooltip.seat.pnrCode || '—'}</span></span></div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Chưa có khách đặt ghế này.</p>
          )}
        </div>
      )}

      {/* Khoang máy bay */}
      <div className="xl:w-8/12 bg-[#F8FAFC] rounded-3xl p-6 shadow-inner">
        <div className="flex items-center justify-center gap-2 mb-4 text-[#003366]">
          <Plane size={18} style={{ transform: 'rotate(-45deg)' }} />
          <span className="text-sm font-bold uppercase tracking-widest">Sơ đồ ghế · {flight.id}</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" /> Đang tải sơ đồ ghế...
          </div>
        )}
        {!loading && error && <div className="py-16 text-center text-sm text-red-500">{error}</div>}
        {!loading && !error && seatMap.length === 0 && (
          <div className="py-16 text-center text-sm text-slate-400">Chưa có dữ liệu ghế cho chuyến bay này trong DB.</div>
        )}

        {!loading && !error && seatMap.length > 0 && (
          <div className="overflow-auto max-h-[64vh] py-2">
            {/* Thân máy bay */}
            <div className="relative mx-auto w-fit">
              {/* Mũi máy bay */}
              <div className="h-16 w-full bg-gradient-to-b from-slate-100 to-slate-200 border-2 border-b-0 border-slate-300 rounded-t-[50%] flex items-start justify-center pt-3">
                <div className="w-16 h-5 bg-slate-400/60 rounded-full" />
              </div>

              {/* Thân + cánh */}
              <div className="relative bg-slate-200 border-x-2 border-slate-300 px-6 py-4">
                {/* Cánh trái/phải */}
                <div className="absolute -left-12 top-6 w-12 h-28 bg-slate-200 border-2 border-slate-300 rounded-l-2xl -skew-y-12" />
                <div className="absolute -right-12 top-6 w-12 h-28 bg-slate-200 border-2 border-slate-300 rounded-r-2xl skew-y-12" />

                <div className="relative inline-flex flex-col gap-1.5 items-center">
                  {/* header cột */}
                  <div className="flex items-center gap-1">
                    <div className="w-6" />
                    {columns.map((c, idx) => (
                      <React.Fragment key={`h${c}`}>
                        {idx === split && <div className="w-5" />}
                        <div className="w-9 text-center text-[10px] font-bold text-slate-400">{c}</div>
                      </React.Fragment>
                    ))}
                  </div>
                  {/* các hàng */}
                  {rows.map(({ rowNum, seatsByCol }) => (
                    <div key={rowNum} className="flex items-center gap-1">
                      <div className="w-6 text-center text-[10px] font-bold text-slate-400">{rowNum}</div>
                      {columns.map((c, idx) => {
                        const seat = seatsByCol.get(c);
                        const node = seat ? (() => {
                          const st = statusOf(seat.status);
                          return (
                            <div
                              onMouseEnter={(e) => showTip(e, seat)}
                              onMouseLeave={hideTip}
                              className="w-9 h-9 rounded-md flex items-center justify-center text-[9px] font-bold cursor-pointer transition-transform hover:scale-110 hover:ring-2 hover:ring-[#003366]/40"
                              style={{
                                backgroundColor: st.bg,
                                color: st.text,
                                border: `1px solid ${st.border}`,
                                borderTop: `3px solid ${classColor(seat.ticketClassId)}`,
                              }}
                            >
                              {seat.seatNumber || c}
                            </div>
                          );
                        })() : <div className="w-9 h-9" />;
                        return (
                          <React.Fragment key={`${rowNum}${c}`}>
                            {idx === split && <div className="w-5 flex items-center justify-center text-slate-300 text-[9px]">┊</div>}
                            {node}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              {/* Đuôi máy bay */}
              <div className="h-14 w-full bg-gradient-to-t from-slate-100 to-slate-200 border-2 border-t-0 border-slate-300 rounded-b-[45%]" />
            </div>
            <p className="text-center text-[11px] text-slate-400 mt-3">Rê chuột vào ghế để xem chi tiết hành khách / vé</p>
          </div>
        )}
      </div>

      {/* Tổng quan */}
      <div className="xl:w-4/12">
        <div className="bg-[#003366] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden sticky top-6">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Plane size={120} /></div>
          <h3 className="text-xs font-black text-[#C0A062] uppercase tracking-widest mb-4">Tổng quan ghế</h3>
          <div className="mb-6">
            <p className="text-2xl font-black mb-1">{flight.id}</p>
            <p className="text-sm text-slate-300">{flight.aircraft} • {flight.from} → {flight.to}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              ['Tổng ghế', stats.total, 'text-white'],
              ['Trống', stats.AVAILABLE, 'text-emerald-400'],
              ['Đã đặt', stats.BOOKED, 'text-sky-300'],
              ['Đang giữ', stats.HELD, 'text-amber-400'],
            ].map(([lbl, val, cls]) => (
              <div key={lbl} className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase mb-1">{lbl}</p>
                <p className={`text-2xl font-bold ${cls}`}>{val}</p>
              </div>
            ))}
          </div>

          {classLegend.length > 0 && (
            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700 mb-3">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Hạng ghế (viền trên)</p>
              <div className="space-y-2">
                {classLegend.map(c => (
                  <div key={c.id} className="flex items-center gap-3 text-sm">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: classColor(c.id) }} />
                    <span className="text-slate-300">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-700">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Trạng thái</p>
            <div className="space-y-2">
              {Object.values(STATUS_STYLE).map(st => (
                <div key={st.label} className="flex items-center gap-3 text-sm">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: st.bg, border: `1px solid ${st.border}` }} />
                  <span className="text-slate-300">{st.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
