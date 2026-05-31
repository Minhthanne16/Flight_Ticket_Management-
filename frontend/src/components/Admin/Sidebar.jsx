import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Plane,
  BookOpen,
  MapPin,
  Users,
  FileText,
  LogOut,
  Plus,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const navItems = [
  { path: '/admin/dashboard', label: 'Tổng quan', icon: LayoutGrid },
  { path: '/admin/flight-schedule', label: 'Quản lý chuyến bay', icon: Plane },
  { path: '/admin/bookings', label: 'Quản lý đặt chỗ', icon: BookOpen },
  { path: '/admin/airports', label: 'Sân bay & Tuyến bay', icon: MapPin },
  { path: '/admin/staff', label: 'Nhân viên', icon: Users },
  { path: '/admin/regulations', label: 'Quy định', icon: FileText },
];

const Sidebar = () => {
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
    <div
      style={{ width: '220px', minWidth: '220px' }}
      className="bg-white border-r border-slate-200 min-h-screen flex flex-col font-sans select-none"
    >
      {/* ── Logo ── */}
      <div className="px-6 py-8 flex items-center justify-center">
        <img
          src={logoImg}
          alt="EasyFlight"
          className="w-full max-w-[140px] h-auto object-contain"
        />
      </div>

      {/* ── Nút Đặt vé mới ── */}
      <div className="px-4 mb-5">
        <Link
          to="/admin/flight-schedule"
          className="flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-white text-sm font-bold transition-transform hover:scale-[1.02] shadow-md shadow-[#003366]/20"
          style={{ backgroundColor: '#003366' }}
        >
          <Plus size={18} strokeWidth={2.5} />
          Đặt vé mới
        </Link>
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
