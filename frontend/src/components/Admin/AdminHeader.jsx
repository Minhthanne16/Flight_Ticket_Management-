import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, HelpCircle, ChevronDown, AlertCircle, CheckCircle, Info, X, User, LogOut } from 'lucide-react';
import { notificationService } from '../../api/services/notificationService';

// Map loại notification của backend sang kiểu icon hiển thị
const mapType = (type) => {
  if (['SYSTEM_ALERT', 'PAYMENT_FAILED', 'FLIGHT_UPDATED'].includes(type)) return 'alert';
  if (['PAYMENT_SUCCESS', 'BOOKING_CREATED', 'VOUCHER_APPLIED'].includes(type)) return 'success';
  return 'info';
};

const formatTime = (sentAt) => {
  if (!sentAt) return 'Vừa xong';
  const d = new Date(sentAt);
  return d.toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
};

const AdminHeader = ({ title = '', onMenuClick }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const displayName = user.fullName || user.username || 'EasyFlight Staff';
  const getInitials = (name) => {
    if (!name) return 'A';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const initials = getInitials(displayName);

  // Lấy danh sách thông báo thật từ backend
  const loadNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      const list = Array.isArray(data) ? data : [];
      setNotifications(
        list.map((n) => ({
          id: n.id,
          type: mapType(n.type),
          message: n.title ? `${n.title}${n.content ? ' — ' + n.content : ''}` : (n.content || n.message || ''),
          time: formatTime(n.sentAt),
          read: n.unread === false || n.status === 'READ',
        }))
      );
    } catch (err) {
      console.error('Không tải được thông báo:', err);
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
    window.addEventListener('storage', loadNotifications);
    return () => window.removeEventListener('storage', loadNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    notificationService.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
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
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100"
        >
          <Menu size={24} />
        </button>
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
        <div className="relative" ref={notificationRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg transition-colors ${showNotifications ? 'bg-slate-100' : 'hover:bg-gray-100'}`}
            title="Notifications"
          >
            <Bell size={20} style={{ color: '#003366' }} />
            {unreadCount > 0 && (
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-white"
                style={{ backgroundColor: '#EF4444' }}
              />
            )}
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
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-sm text-slate-400">
                    Chưa có thông báo nào.
                  </div>
                ) : (
                  notifications.map((note) => (
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
                  ))
                )}
              </div>
              {notifications.length > 0 && unreadCount > 0 && (
                <div className="p-3 text-center border-t border-slate-100 bg-slate-50">
                  <button onClick={handleMarkAllRead} className="text-sm font-semibold text-[#003366] hover:underline">
                    Đánh dấu tất cả đã đọc
                  </button>
                </div>
              )}
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
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2 px-1 py-1 rounded-full transition-colors hover:bg-gray-100 focus:outline-none"
          >
            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-base font-semibold flex-shrink-0"
              style={{ backgroundColor: '#7C5CFC' }}
            >
              {initials}
            </div>
          </button>
          
          {showProfile && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 z-[100] p-2">
              <div className="px-3 py-2">
                <p className="font-semibold text-[#003366] text-base">{displayName}</p>
                <p className="text-sm text-slate-500 mt-0.5">{user.role || 'Nhân viên'} &middot; {user.department || 'Phục vụ mặt đất'}</p>
              </div>
              <div className="h-px bg-slate-100 my-1"></div>
              <button 
                onClick={() => {
                  setShowProfile(false);
                  navigate('/admin/profile');
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-[#003366] hover:bg-slate-50 rounded-lg transition-colors"
              >
                <User size={18} className="text-slate-500" />
                <span>Thông tin cá nhân</span>
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('user');
                  window.location.href = '/login';
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-1"
              >
                <LogOut size={18} />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
