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
} from 'lucide-react';
import { STAFF_USER } from '../data/sharedData';
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

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
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
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[#6E7491] hover:bg-[#F0EFFA] hover:text-[#6C5CE7] transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;