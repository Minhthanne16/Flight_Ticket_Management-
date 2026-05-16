import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  Ticket,
  Briefcase,
  Headset,
  User,
  LogOut,
} from 'lucide-react';
import { STAFF_USER } from '../data/sharedData';
import logoImg from '../assets/logo.png';

const navGroups = [
  {
    title: 'MAIN',
    items: [
      { name: 'Dashboard', path: '/staff/dashboard', icon: LayoutDashboard },
      { name: 'Flight Schedule', path: '/staff/flight-schedule', icon: Calendar },
      { name: 'Booking', path: '/staff/booking', icon: Ticket },
    ]
  },
  {
    title: 'OPERATIONS',
    items: [
      { name: 'Work Schedule', path: '/staff/work-schedule', icon: Briefcase },
      { name: 'Customer Support', path: '/staff/customer-support', icon: Headset },
    ]
  },
  {
    title: 'ACCOUNT',
    items: [
      { name: 'Personal Info', path: '/staff/personal-info', icon: User },
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
    <aside className="w-[240px] bg-[#0F0B1E] flex flex-col justify-between shrink-0 h-screen overflow-y-auto border-r border-white/[0.05]">
      {/* Logo */}
      <div>
        <div className="h-[72px] flex items-center overflow-hidden border-b border-white/[0.06]" style={{ paddingLeft: '30px' }}>
          <img
            src={logoImg}
            alt="EasyFlight"
            style={{
              height: '45px',
              width: 'auto',
              objectFit: 'contain',
              transform: 'scale(3.5)',
              transformOrigin: 'left center'
            }}
            onError={(e) => {
              // fallback nếu logo.png chưa có
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback text logo */}
          <div className="hidden items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-violet-500/30">
              <span className="text-white text-xs font-black">EF</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">EasyFlight</span>
          </div>
        </div>

        <div className="p-3 mt-2 space-y-5">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-3 text-[10px] font-semibold text-white/25 tracking-[0.14em] mb-1.5 uppercase">
                {group.title}
              </h3>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-150 group ${isActive
                          ? 'bg-violet-500/20 text-violet-300'
                          : 'text-white/35 hover:bg-white/[0.05] hover:text-white/75'
                        }`}
                    >
                      <item.icon
                        className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-violet-400' : 'text-white/30 group-hover:text-white/60'
                          }`}
                      />
                      <span className="text-sm">{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom: user + logout */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-white">LM</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white/80 truncate">{STAFF_USER.fullName}</p>
            <p className="text-[10px] text-white/30 truncate">{STAFF_USER.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-white/35 hover:bg-white/[0.05] hover:text-white/65 transition-all duration-150"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;