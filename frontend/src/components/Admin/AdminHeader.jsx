import React, { useState } from 'react';
import { Search, Bell, HelpCircle, ChevronDown } from 'lucide-react';

const AdminHeader = ({ title = '' }) => {
  const [searchValue, setSearchValue] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.fullName || user.username || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <header
      className="flex items-center justify-between px-6 py-3 border-b bg-white"
      style={{ borderColor: '#E8EBF0', minHeight: '60px' }}
    >
      {/* Title (tuỳ theo trang) */}
      <div className="flex items-center gap-4 min-w-0">
        {title ? (
          <h1 className="text-xl font-bold text-[#7C5CFC] whitespace-nowrap">{title}</h1>
        ) : (
          /* Search bar */
          <div
            className="flex items-center gap-2 rounded-lg px-3 py-2"
            style={{ backgroundColor: '#F4F6F8', minWidth: '260px' }}
          >
            <Search size={16} style={{ color: '#9CA3AF', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search flights, passengers..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent outline-none text-sm w-full"
              style={{ color: '#374151' }}
            />
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Bell */}
        <button
          className="relative p-2 rounded-lg transition-colors hover:bg-gray-100"
          title="Notifications"
        >
          <Bell size={20} style={{ color: '#6B7280' }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: '#EF4444' }}
          />
        </button>

        {/* Help */}
        <button className="p-2 rounded-lg transition-colors hover:bg-gray-100" title="Help">
          <HelpCircle size={20} style={{ color: '#6B7280' }} />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200" />

        {/* Profile */}
        <button className="flex items-center gap-2 px-2 py-1 rounded-lg transition-colors hover:bg-gray-100">
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
            style={{ backgroundColor: '#7C5CFC' }}
          >
            {initials}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden md:block">Profile Settings</span>
          <ChevronDown size={14} style={{ color: '#9CA3AF' }} className="hidden md:block" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
