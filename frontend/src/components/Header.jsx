import { Bell, HelpCircle, ChevronRight, User, LogOut, X, Info, AlertTriangle } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { notificationService } from '../api/services/notificationService';
import { ADMIN_STAFF } from '../data/adminMockData';

const PAGE_LABELS = {
  dashboard: 'Bảng điều khiển',
  'flight-schedule': 'Lịch bay',
  booking: 'Đặt vé',
  promotion: 'Khuyến mãi',
  'customer-support': 'Hỗ trợ khách hàng',
  'personal-info': 'Thông tin cá nhân',
  regulations: 'Quy định',
};

const MOCK_NOTIFICATIONS = []; // No longer used

function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(); };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageKey = pathParts[1] || 'dashboard';
  const currentPage = PAGE_LABELS[pageKey] || pageKey.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  const [showNotif, setShowNotif] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState([]);


  // Fetch live notifications
  const loadNotifications = async () => {
    try {
      const notifs = await notificationService.getMy();
      // Format backend notification properties if needed
      setNotifications(notifs.map(n => ({
        id: n.id,
        title: n.title,
        desc: n.content || n.message || '',
        time: n.sentAt ? new Date(n.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : 'Vừa xong',
        unread: n.unread ?? (n.status !== 'READ')
      })));
    } catch (err) {
      console.error('Failed to load notifications:', err);
    }
  };

  useEffect(() => {
    loadNotifications();
    // Sync notifications across components/tabs when custom storage event fires
    window.addEventListener('storage', loadNotifications);
    return () => window.removeEventListener('storage', loadNotifications);
  }, []);

  const [profile, setProfile] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'STAFF') {
        const stored = localStorage.getItem('local_staff_profile');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.email === user.email) return parsed;
        }

        const mockProfile = ADMIN_STAFF.find(s => s.email === user.email);
        if (mockProfile) {
            return {
                fullName: mockProfile.fullName,
                email: mockProfile.email,
                role: 'STAFF',
                department: mockProfile.department
            };
        }

        return {
          fullName: user.fullName || 'EasyFlight Staff',
          email: user.email || 'staff@easyflight.vn',
          role: 'STAFF',
          department: 'Phục vụ mặt đất'
        };
      }
      return {
        fullName: user.email === 'admin@easyflight.vn' ? 'Nguyễn Văn Admin' : (user.email || 'Admin'),
        email: user.email || '',
        role: user.role || 'STAFF',
        department: 'Ban Giám Đốc'
      };
    } catch {
      return {
        fullName: 'EasyFlight Staff',
        email: 'staff@easyflight.vn',
        role: 'STAFF',
        department: 'Phục vụ mặt đất'
      };
    }
  });

  useEffect(() => {
    const syncProfile = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role === 'STAFF') {
          const stored = localStorage.getItem('local_staff_profile');
          if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.email === user.email) {
                  setProfile(parsed);
                  return;
              }
          }
          const mockProfile = ADMIN_STAFF.find(s => s.email === user.email);
          if (mockProfile) {
              setProfile({
                  fullName: mockProfile.fullName,
                  email: mockProfile.email,
                  role: 'STAFF',
                  department: mockProfile.department
              });
          }
        } else {
          setProfile({
            fullName: user.email === 'admin@easyflight.vn' ? 'Nguyễn Văn Admin' : (user.email || 'Admin'),
            email: user.email || '',
            role: user.role || 'ADMIN',
            department: 'Ban Giám Đốc'
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    window.addEventListener('storage', syncProfile);
    window.addEventListener('focus', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('focus', syncProfile);
    };
  }, []);

  const notifRef = useRef(null);
  const avatarRef = useRef(null);
  const helpRef = useRef(null);

  useClickOutside(notifRef, () => setShowNotif(false));
  useClickOutside(avatarRef, () => setShowAvatar(false));
  useClickOutside(helpRef, () => setShowHelp(false));

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    notificationService.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signin');
  };



  const getPassengerInitials = (name) => {
    if (!name) return 'NV';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getPassengerInitials(profile.fullName);

  return (
    <header className="h-[72px] bg-white border-b border-[#E8E8F0] flex items-center justify-between px-6 shrink-0 relative z-30">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm">
        <ChevronRight className="w-3.5 h-3.5 text-[#6C5CE7]" />
        <span className="font-semibold text-[#6C5CE7]">{currentPage}</span>
      </div>


      {/* Right: icons + avatar */}
      <div className="flex items-center gap-2">

        {/* Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => { setShowNotif(v => !v); setShowAvatar(false); setShowHelp(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors"
          >
            <Bell className="w-[18px] h-[18px]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] border-2 border-white text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <div className="absolute right-0 top-11 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <span className="text-sm font-bold text-slate-800">Thông báo</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-[#6C5CE7] hover:underline">Đánh dấu đã đọc</button>
                  )}
                  <button onClick={() => setShowNotif(false)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.map(n => (
                  <div key={n.id} className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${n.unread ? 'bg-violet-50/50' : ''}`}>
                    <div className="flex items-start gap-2">
                      {n.unread && <span className="w-2 h-2 rounded-full bg-[#6C5CE7] mt-1.5 shrink-0" />}
                      {!n.unread && <span className="w-2 h-2 mt-1.5 shrink-0" />}
                      <div>
                        <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.desc}</p>
                        <p className="text-[10px] text-slate-300 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Help */}
        <div ref={helpRef} className="relative">
          <button
            onClick={() => { setShowHelp(v => !v); setShowNotif(false); setShowAvatar(false); }}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors"
          >
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>

          {showHelp && (
            <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="w-4 h-4 text-[#6C5CE7]" />
                <span className="text-sm font-bold text-slate-800">Trợ giúp</span>
                <button onClick={() => setShowHelp(false)} className="ml-auto"><X className="w-4 h-4 text-slate-400" /></button>
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <p>📋 <span className="font-medium text-slate-700">Lịch bay:</span> Xem và quản lý lịch trình các chuyến bay</p>
                <p>🎫 <span className="font-medium text-slate-700">Đặt vé:</span> Tra cứu và xử lý đơn đặt vé</p>
                <p>🎁 <span className="font-medium text-slate-700">Khuyến mãi:</span> Quản lý các chương trình ưu đãi</p>
                <p>🎧 <span className="font-medium text-slate-700">Hỗ trợ:</span> Phản hồi yêu cầu từ khách hàng</p>
              </div>
            </div>
          )}
        </div>

        {/* Avatar dropdown */}
        <div ref={avatarRef} className="relative ml-1">
          <button
            onClick={() => { setShowAvatar(v => !v); setShowNotif(false); setShowHelp(false); }}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-[#6C5CE7] to-[#7E6FF2] flex items-center justify-center shadow-sm shadow-[#6C5CE7]/20 cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-[11px] font-bold text-white">{initials}</span>
          </button>

          {showAvatar && (
            <div className="absolute right-0 top-11 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-semibold text-slate-800">{profile.fullName}</p>
                <p className="text-xs text-slate-400 mt-0.5">{profile.role === 'ADMIN' ? 'Quản trị viên' : `Nhân viên · ${profile.department || 'Vận hành'}`}</p>
              </div>
              <div className="p-1.5">
                <button
                  onClick={() => { navigate('/staff/personal-info'); setShowAvatar(false); }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-colors"
                >
                  <User className="w-4 h-4" />
                  Thông tin cá nhân
                </button>
                <button
                  onClick={() => { setShowLogoutModal(true); setShowAvatar(false); }}
                  className="flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'headerFadeIn 0.2s ease-out' }}
          />
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#E8E8F0] p-6 w-[380px] max-w-[90vw]"
            style={{ animation: 'headerModalSlideIn 0.25s ease-out' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-[#27273F] mb-2">Xác nhận đăng xuất</h3>
              <p className="text-sm text-[#6E7491] mb-6">
                Bạn có chắc chắn muốn đăng xuất không?<br />
                Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng hệ thống.
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#E8E8F0] text-sm font-semibold text-[#6E7491] hover:bg-[#F0EFFA] transition-all duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold hover:from-red-600 hover:to-red-700 shadow-md shadow-red-500/20 transition-all duration-200"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes headerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes headerModalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </header>
  );
}

export default Header;