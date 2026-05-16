import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutGrid, PlaneTakeoff, Ticket, Calendar, Headset, User, LogOut } from 'lucide-react';
import logoImg from '../../assets/logo.png';

const Sidebar = () => {
  const location = useLocation();

  const menuGroups = [
    {
      title: 'MAIN',
      items: [
        { path: '/admin', label: 'Dashboard', icon: LayoutGrid },
        { path: '/admin/flight-schedule', label: 'Flight Schedule', icon: PlaneTakeoff },
        { path: '/admin/booking', label: 'Booking', icon: Ticket },
      ]
    },
    {
      title: 'OPERATIONS',
      items: [
        { path: '/admin/work-schedule', label: 'Work Schedule', icon: Calendar },
        { path: '/admin/customer-support', label: 'Customer Support', icon: Headset },
      ]
    },
    {
      title: 'ACCOUNT',
      items: [
        { path: '/admin/profile', label: 'Personal Info', icon: User },
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="w-64 bg-[#F4F7FE] min-h-screen border-r border-slate-200 flex flex-col font-sans">
      {/* Logo */}
      <div className="p-6 flex items-center mb-2">
        <img src={logoImg} alt="EasyFlight Logo" className="h-10 w-auto object-contain" />
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 overflow-y-auto">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider px-2">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item, itemIndex) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                return (
                  <li key={itemIndex}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                        active 
                          ? 'bg-[#704FF7] text-white shadow-sm' 
                          : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 mr-4 ${active ? 'text-white' : 'text-slate-500'}`} strokeWidth={active ? 2.5 : 2} />
                      <span className="font-medium text-[15px]">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Logout */}
      <div className="p-4 border-t border-slate-200/60 mt-auto">
        <button className="flex items-center w-full px-4 py-3 text-slate-600 hover:bg-slate-200/50 hover:text-red-600 rounded-xl transition-all group">
          <LogOut className="w-5 h-5 mr-4 text-slate-500 group-hover:text-red-600 transition-colors" />
          <span className="font-medium text-[15px]">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
