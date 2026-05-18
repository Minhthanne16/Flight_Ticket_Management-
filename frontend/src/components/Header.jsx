import { Bell, Settings, HelpCircle, Search, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { STAFF_USER } from '../data/sharedData';

const PAGE_LABELS = {
  dashboard: 'Dashboard',
  'flight-schedule': 'Flight Schedule',
  booking: 'Booking',
  promotion: 'Promotion',
  'customer-support': 'Customer Support',
  'personal-info': 'Personal Info',
  regulations: 'Regulations',
};

function Header() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageKey = pathParts[1] || 'dashboard';
  const currentPage = PAGE_LABELS[pageKey] || pageKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <header className="h-[72px] bg-white border-b border-[#E8E8F0] flex items-center justify-between px-6 shrink-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <ChevronRight className="w-3.5 h-3.5 text-[#6C5CE7]" />
        <span className="font-semibold text-[#6C5CE7]">{currentPage}</span>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center max-w-xl mx-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
          <input
            type="text"
            placeholder="Search system commands..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#F5F6FA] border border-[#E8E8F0] rounded-full text-sm text-[#27273F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/20 focus:border-[#6C5CE7]/40 transition-all"
          />
        </div>
      </div>

      {/* Right: icons + avatar */}
      <div className="flex items-center gap-2">
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#EF4444] border-2 border-white" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors">
          <HelpCircle className="w-[18px] h-[18px]" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-full text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors">
          <Settings className="w-[18px] h-[18px]" />
        </button>

        <div className="ml-1 w-9 h-9 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#7E6FF2] flex items-center justify-center shadow-sm shadow-[#6C5CE7]/20 cursor-pointer">
          <span className="text-[11px] font-bold text-white">
            {STAFF_USER.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U'}
          </span>
        </div>
      </div>
    </header>
  );
}

export default Header;