import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle, ChevronDown, AlertCircle, CheckCircle, Info, X } from 'lucide-react';

const AdminHeader = ({ title = '' }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.fullName || user.username || 'Admin';
  const initials = displayName.charAt(0).toUpperCase();

  const notifications = [
    { id: 1, type: 'alert', message: 'Chuyến bay VN305 bị delay 30 phút do thời tiết xấu.', time: '10 phút trước', read: false },
    { id: 2, type: 'success', message: 'Bảo trì thành công ghế 4A trên VN201.', time: '1 giờ trước', read: false },
    { id: 3, type: 'info', message: 'Hệ thống tự động cập nhật giá vé cuối tuần.', time: '2 giờ trước', read: true },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Bell & Notifications */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-slate-100' : 'hover:bg-gray-100'}`}
            title="Notifications"
          >
            <Bell size={20} style={{ color: '#003366' }} />
            <span
              className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white"
              style={{ backgroundColor: '#EF4444' }}
            />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-slate-100 bg-slate-50">
                <h3 className="font-bold text-[#003366]">Thông báo</h3>
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="max-h-[320px] overflow-y-auto">
                {notifications.map((note) => (
                  <div 
                    key={note.id} 
                    className={`flex gap-3 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${note.read ? 'opacity-70' : 'bg-blue-50/30'}`}
                  >
                    <div className="mt-1 flex-shrink-0">
                      {note.type === 'alert' && <AlertCircle size={18} className="text-red-500" />}
                      {note.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                      {note.type === 'info' && <Info size={18} className="text-blue-500" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm text-slate-700 ${!note.read ? 'font-semibold' : ''}`}>{note.message}</p>
                      <p className="text-xs text-slate-400 mt-1">{note.time}</p>
                    </div>
                    {!note.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                <button className="text-sm font-semibold text-[#003366] hover:underline">
                  Đánh dấu tất cả đã đọc
                </button>
              </div>
            </div>
          )}
        </div>

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
