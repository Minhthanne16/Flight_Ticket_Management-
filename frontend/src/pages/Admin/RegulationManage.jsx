import { useState } from 'react';
import { Save, X, CheckCircle, Info } from 'lucide-react';
import { REGULATIONS as INIT_REGS } from '../../data/adminMockData';

const GROUP_COLORS = { 'Chuyến bay': 'bg-violet-50 text-violet-700 border-violet-200', 'Đặt vé': 'bg-blue-50 text-blue-700 border-blue-200', 'Thanh toán': 'bg-emerald-50 text-emerald-700 border-emerald-200' };

function Toast({ msg, onClose }) {
  if (!msg) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium text-white bg-violet-600 min-w-[260px]">
      <CheckCircle className="w-4 h-4 shrink-0" /><span className="flex-1">{msg}</span>
      <button onClick={onClose}><X className="w-4 h-4 opacity-70" /></button>
    </div>
  );
}

export default function RegulationManage() {
  const [regs, setRegs] = useState(INIT_REGS);
  const [edited, setEdited] = useState({});
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const groups = [...new Set(regs.map(r => r.group))];
  const hasChanges = Object.keys(edited).length > 0;

  const handleChange = (id, val) => {
    const original = regs.find(r => r.id === id)?.value;
    if (val === original) {
      const next = { ...edited }; delete next[id]; setEdited(next);
    } else {
      setEdited(prev => ({ ...prev, [id]: val }));
    }
  };

  const handleSave = () => {
    setRegs(prev => prev.map(r => edited[r.id] !== undefined ? { ...r, value: edited[r.id] } : r));
    setEdited({});
    showToast(`Đã lưu ${Object.keys(edited).length} cài đặt thành công!`);
  };

  const handleReset = () => { setEdited({}); showToast('Đã hoàn tác tất cả thay đổi.'); };

  return (
    <div className="space-y-5">
      <Toast msg={toast} onClose={() => setToast('')} />

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cấu hình hệ thống</h1>
          <p className="text-slate-400 text-sm mt-1">Quản lý các quy định và thông số vận hành của hệ thống</p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2">
            <button onClick={handleReset} className="px-4 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">
              Hoàn tác ({Object.keys(edited).length})
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
              <Save className="w-4 h-4" /> Lưu tất cả
            </button>
          </div>
        )}
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700">Các thay đổi sẽ được áp dụng ngay sau khi lưu. Vui lòng kiểm tra kỹ trước khi xác nhận.</p>
      </div>

      {/* Groups */}
      {groups.map(group => (
        <div key={group} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${GROUP_COLORS[group] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{group}</span>
            <span className="text-xs text-slate-400">{regs.filter(r => r.group === group).length} cài đặt</span>
          </div>
          <div className="divide-y divide-slate-50">
            {regs.filter(r => r.group === group).map(reg => {
              const currentVal = edited[reg.id] !== undefined ? edited[reg.id] : reg.value;
              const isChanged = edited[reg.id] !== undefined;
              return (
                <div key={reg.id} className={`flex items-center gap-4 px-5 py-4 transition-colors ${isChanged ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-slate-700">{reg.label}</p>
                      {isChanged && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Đã sửa</span>}
                    </div>
                    <p className="text-xs text-slate-400">{reg.description}</p>
                    <p className="text-xs text-slate-300 mt-0.5 font-mono">{reg.key}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {isChanged && (
                      <span className="text-xs text-slate-400 line-through">{reg.value}</span>
                    )}
                    <input
                      type={reg.type === 'NUMBER' ? 'number' : 'text'}
                      value={currentVal}
                      onChange={e => handleChange(reg.id, e.target.value)}
                      className={`w-24 text-center border rounded-xl px-3 py-2 text-sm font-bold outline-none transition-all ${isChanged ? 'border-amber-400 bg-amber-50 text-amber-700 focus:ring-2 focus:ring-amber-500/20' : 'border-slate-200 text-slate-700 focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Save bar */}
      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg px-6 py-4 flex items-center justify-between z-40">
          <p className="text-sm text-slate-600">{Object.keys(edited).length} thay đổi chưa được lưu</p>
          <div className="flex items-center gap-3">
            <button onClick={handleReset} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors">Hoàn tác</button>
            <button onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-violet-600 text-white rounded-xl text-sm font-semibold hover:bg-violet-700 transition-colors">
              <Save className="w-4 h-4" /> Lưu tất cả thay đổi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
