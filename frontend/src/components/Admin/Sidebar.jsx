import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Plane,
  PlaneTakeoff,
  Route,
  Building2,
  Layers,
  Armchair,
  BookOpen,
  MapPin,
  Users,
  FileText,
  Ticket,
  LogOut,
  Plus,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const navItems = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutGrid },
  { path: '/admin/flight-schedule', label: 'Quản lý chuyến bay', icon: Plane },
  { path: '/admin/bookings', label: 'Quản lý đặt chỗ', icon: BookOpen },
  { path: '/admin/airports', label: 'Sân bay', icon: MapPin },
  { path: '/admin/routes', label: 'Tuyến bay', icon: Route },
  { path: '/admin/airlines', label: 'Hãng bay', icon: Building2 },
  { path: '/admin/airplanes', label: 'Máy bay', icon: PlaneTakeoff },
  { path: '/admin/airplane-models', label: 'Model máy bay', icon: Layers },
  { path: '/admin/ticket-classes', label: 'Hạng ghế', icon: Armchair },
  { path: '/admin/vouchers', label: 'Mã giảm giá', icon: Ticket },
  { path: '/admin/staff', label: 'Nhân viên', icon: Users },
  { path: '/admin/regulations', label: 'Quy định', icon: FileText },
];

const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col font-sans select-none">
      {/* ── Logo ── */}
      <div className="px-6 py-8 flex items-center justify-center">
        <img
          src={logoImg}
          alt="EasyFlight"
          className="w-full max-w-[140px] h-auto object-contain"
        />
      </div>


      {/* ── Nav Items ── */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                backgroundColor: active ? '#003366' : 'transparent',
                color: active ? '#ffffff' : '#64748B',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = '#F8FAFC';
                  e.currentTarget.style.color = '#003366';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748B';
                }
              }}
            >
              <Icon
                size={20}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? '#ffffff' : '#94A3B8', flexShrink: 0 }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Settings + Logout ── */}
      <div className="px-4 pb-6 space-y-1 border-t border-slate-100 pt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold w-full transition-all"
          style={{ color: '#64748B' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF2F2';
            e.currentTarget.style.color = '#EF4444';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <LogOut size={20} strokeWidth={2} style={{ flexShrink: 0 }} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
