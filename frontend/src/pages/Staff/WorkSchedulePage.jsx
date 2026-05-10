import { useState, useMemo } from 'react';
import { Clock, CheckCircle2, X, Calendar, User } from 'lucide-react';
import { WORK_SHIFTS, STAFF_USER } from '../../data/sharedData';

const statusStyle = {
  Active: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  Scheduled: 'text-violet-700 bg-violet-50 border-violet-200',
  Completed: 'text-slate-500 bg-slate-100 border-slate-200',
};

const DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const HOURS = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

function WorkSchedulePage() {
  const [view, setView] = useState('list'); // 'list' | 'calendar'

  // LỌC CHỈ LẤY LỊCH CỦA CÁ NHÂN ĐANG ĐĂNG NHẬP
  const myShifts = useMemo(() => {
    return WORK_SHIFTS.filter(s => 
      s.staff === STAFF_USER.fullName || 
      s.staff === STAFF_USER.name
    );
  }, []);

  const activeCount = myShifts.filter(s => s.status === 'Active').length;
  const upcomingCount = myShifts.filter(s => s.status === 'Scheduled').length;
  const completedCount = myShifts.filter(s => s.status === 'Completed').length;

  return (
    <div className="space-y-5">
      {/* Header - Chỉ xem, không có nút thêm */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Lịch làm việc của tôi</h1>
            <p className="text-sm text-slate-400 mt-0.5">Chào {STAFF_USER.fullName}, xem lịch trình được phân công của bạn.</p>
          </div>
        </div>
        
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
          {['list', 'calendar'].map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === v ? 'bg-white text-violet-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {v === 'list' ? 'Danh sách' : 'Lịch tuần'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cá nhân */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Ca đang làm', count: activeCount, color: 'text-emerald-700 bg-emerald-50 border-emerald-100' },
          { label: 'Ca sắp tới', count: upcomingCount, color: 'text-violet-700 bg-violet-50 border-violet-100' },
          { label: 'Đã hoàn thành', count: completedCount, color: 'text-slate-600 bg-slate-50 border-slate-200' },
        ].map(s => (
          <div key={s.label} className={`border rounded-2xl px-5 py-4 ${s.color}`}>
            <div className="text-2xl font-black">{s.count}</div>
            <div className="text-xs font-bold opacity-70 uppercase tracking-wider mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {view === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Thông tin ca</th>
                  <th className="px-6 py-4">Ngày làm việc</th>
                  <th className="px-6 py-4">Thời gian</th>
                  <th className="px-6 py-4">Vị trí & Chuyến bay</th>
                  <th className="px-6 py-4 text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {myShifts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-slate-400 text-sm italic">Bạn chưa có lịch làm việc được phân công.</td>
                  </tr>
                ) : myShifts.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-violet-600">{s.id}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{s.role}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{s.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-slate-400" /> {s.start} – {s.end}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700">{s.gate}</div>
                      <div className="text-xs text-slate-400">Flight: {s.flight}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusStyle[s.status]}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Weekly calendar view - Chỉ highlight ca của cá nhân */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-5">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-8 gap-3 mb-4">
                <div className="h-10"></div>
                {DAYS.map(d => (
                  <div key={d} className="text-xs font-black text-slate-400 text-center uppercase tracking-tighter">{d}</div>
                ))}
              </div>
              
              {HOURS.map(hour => (
                <div key={hour} className="grid grid-cols-8 gap-3 mb-3">
                  <div className="text-[10px] font-bold text-slate-400 text-right pr-4 pt-2 tracking-tighter">{hour}</div>
                  {DAYS.map((_, di) => {
                    const myDayShift = myShifts.find(s => {
                      const shiftStart = parseInt(s.start);
                      const hourNum = parseInt(hour);
                      return shiftStart === hourNum && di < 5; // Demo logic: hiển thị trên grid
                    });

                    return (
                      <div key={di} className={`group relative min-h-[50px] rounded-xl border-2 transition-all ${
                        myDayShift 
                        ? 'bg-violet-600 border-violet-600 shadow-md shadow-violet-200' 
                        : 'bg-slate-50 border-dashed border-slate-200 hover:border-slate-300'
                      }`}>
                        {myDayShift && (
                          <div className="p-2 text-white overflow-hidden">
                            <div className="text-[9px] font-black leading-tight uppercase truncate">{myDayShift.role}</div>
                            <div className="text-[8px] font-medium opacity-80 mt-1">{myDayShift.gate}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkSchedulePage;