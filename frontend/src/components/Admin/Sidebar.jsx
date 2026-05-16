import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Plane,
  BookOpen,
  MapPin,
  Users,
  SlidersHorizontal,
  Settings,
  LogOut,
  Plus,
} from 'lucide-react';
import logoImg from '../../assets/logo.png';

const navItems = [
  { path: '/admin/dashboard',     label: 'Tổng quan',         icon: LayoutGrid },
  { path: '/admin/flight-schedule', label: 'Quản lý chuyến bay', icon: Plane },
  { path: '/admin/bookings',      label: 'Quản lý đặt chỗ',   icon: BookOpen },
  { path: '/admin/airports',      label: 'Sân bay & Tuyến bay', icon: MapPin },
  { path: '/admin/staff',         label: 'Nhân viên',          icon: Users },
  { path: '/admin/regulations',   label: 'Cấu hình hệ thống', icon: SlidersHorizontal },
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
    navigate('/signin');
  };

  return (
    <div
      style={{ backgroundColor: '#2D2F3E', width: '200px', minWidth: '200px' }}
      className="min-h-screen flex flex-col font-sans select-none"
    >
      {/* ── Logo ── */}
      <div className="px-4 py-10 flex items-center justify-center">
        <img
          src={logoImg}
          alt="EasyFlight"
          style={{ height: '82px', width: 'auto', objectFit: 'contain' }}
        />
      </div>

      {/* ── Nút Đặt vé mới ── */}
      <div className="px-4 mb-5">
        <Link
          to="/admin/flight-schedule"
          className="flex items-center justify-center gap-2 w-full rounded-lg py-2.5 text-white text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#7C5CFC' }}
        >
          <Plus size={16} strokeWidth={2.5} />
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
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: active ? '#7C5CFC' : 'transparent',
                color: active ? '#ffffff' : '#A0A3BD',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
                  e.currentTarget.style.color = '#ffffff';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#A0A3BD';
                }
              }}
            >
              <Icon
                size={18}
                strokeWidth={active ? 2.5 : 2}
                style={{ color: active ? '#ffffff' : '#A0A3BD', flexShrink: 0 }}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Settings + Logout ── */}
      <div className="px-3 pb-5 space-y-1 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', paddingTop: '12px' }}>
        <Link
          to="/admin/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ color: '#A0A3BD' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#A0A3BD';
          }}
        >
          <Settings size={18} strokeWidth={2} style={{ color: '#A0A3BD', flexShrink: 0 }} />
          Cài đặt hệ thống
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-all"
          style={{ color: '#A0A3BD' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#A0A3BD';
          }}
        >
          <LogOut size={18} strokeWidth={2} style={{ flexShrink: 0 }} />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
