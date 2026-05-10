import { Bell, Settings, HelpCircle, Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { STAFF_USER } from '../data/sharedData';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  'flight-schedule': 'Flight Schedule',
  booking: 'Booking',
  'work-schedule': 'Work Schedule',
  'customer-support': 'Customer Support',
  'personal-info': 'Personal Info',
};

function Header() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageKey = pathParts[1] || 'dashboard';
  const currentPage = PAGE_LABELS[pageKey] || pageKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <header className="h-[72px] bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-400 font-medium">Staff Portal</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-semibold text-slate-700">{currentPage}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="w-56 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          />
        </div>

        <div className="flex items-center gap-1">
          <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 border-2 border-white" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
            <Settings className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-100">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-sm shadow-violet-500/30">
            <span className="text-[11px] font-bold text-white">LM</span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-slate-700 leading-none">{STAFF_USER.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">{STAFF_USER.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;