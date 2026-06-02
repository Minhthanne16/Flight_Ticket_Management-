import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Tag,
  Headset,
  User,
  ScrollText,
  LogOut,
  AlertTriangle,
} from 'lucide-react';
import logoImg from '../assets/logo.png';

const navGroups = [
  {
    title: 'CHÍNH',
    items: [
      { name: 'Bảng điều khiển', path: '/staff/dashboard', icon: LayoutDashboard },
      { name: 'Lịch bay', path: '/staff/flight-schedule', icon: Calendar },
      { name: 'Đặt vé', path: '/staff/booking', icon: Ticket },
    ]
  },
  {
    title: 'VẬN HÀNH',
    items: [
      { name: 'Khuyến mãi', path: '/staff/promotion', icon: Tag },
      { name: 'Hỗ trợ khách hàng', path: '/staff/customer-support', icon: Headset },
    ]
  },
  {
    title: 'TÀI KHOẢN',
    items: [
      { name: 'Thông tin cá nhân', path: '/staff/personal-info', icon: User },
      { name: 'Quy định', path: '/staff/regulations', icon: ScrollText },
    ]
  }
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <>
      <aside className="w-[240px] bg-[#FAFAFE] flex flex-col justify-between shrink-0 h-screen overflow-y-auto border-r border-[#E8E8F0]">
        {/* Logo */}
        <div>
          <div className="flex items-center justify-center px-2 py-2 border-b border-[#E8E8F0]">
            <img
              src={logoImg}
              alt="EasyFlight"
              className="w-full object-contain"
              style={{ height: '160px' }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Fallback text logo */}
            <div className="hidden items-center gap-2.5">
              <div className="w-8 h-8 bg-gradient-to-br from-[#6C5CE7] to-[#7E6FF2] rounded-lg flex items-center justify-center shadow-lg shadow-[#6C5CE7]/20">
                <span className="text-white text-xs font-black">EF</span>
              </div>
              <span className="text-lg font-bold text-[#27273F] tracking-tight">EasyFlight</span>
            </div>
          </div>

          <div className="p-3 mt-2 space-y-5">
            {navGroups.map((group) => (
              <div key={group.title}>
                <h3 className="px-3 text-[10px] font-semibold text-[#9CA3AF] tracking-[0.14em] mb-1.5 uppercase">
                  {group.title}
                </h3>
                <nav className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${isActive
                          ? 'bg-gradient-to-r from-[#6C5CE7] to-[#7E6FF2] text-white shadow-md shadow-[#6C5CE7]/20'
                          : 'text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7]'
                          }`}
                      >
                        <item.icon
                          className={`w-[18px] h-[18px] shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#9CA3AF] group-hover:text-[#6C5CE7]'
                            }`}
                        />
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: logout */}
        <div className="p-3 border-t border-[#E8E8F0]">
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-all duration-200"
          >
            <LogOut className="w-[18px] h-[18px]" />
            <span className="text-sm font-medium">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          onClick={() => setShowLogoutModal(false)}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            style={{ animation: 'fadeIn 0.2s ease-out' }}
          />
          {/* Modal */}
          <div
            className="relative bg-white rounded-2xl shadow-2xl border border-[#E8E8F0] p-6 w-[380px] max-w-[90vw]"
            style={{ animation: 'modalSlideIn 0.25s ease-out' }}
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

      {/* Modal animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}

export default Sidebar;