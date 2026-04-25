import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Home, Package, CalendarClock, PieChart, Users } from 'lucide-react';
import { useAppStore } from '../store';
import clsx from 'clsx';

const navItems = [
  { path: '/', label: '用药计划', icon: Home },
  { path: '/inventory', label: '药品库存', icon: Package },
  { path: '/follow-up', label: '复诊续方', icon: CalendarClock },
  { path: '/report', label: '健康报告', icon: PieChart },
];

export const Layout: React.FC = () => {
  const { currentUser, switchRole } = useAppStore();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-xl overflow-hidden">
      {/* Header */}
      <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-gray-800">慢病用药小管家</h1>
          <p className="text-xs text-gray-500 mt-1">当前身份: {currentUser.name} ({currentUser.role === 'patient' ? '患者本人' : '家属代管'})</p>
        </div>
        <button 
          onClick={switchRole}
          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
          title="切换角色"
        >
          <Users size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full max-w-md flex justify-around items-center pb-safe">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center py-3 px-2 flex-1',
                isActive ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'
              )
            }
          >
            <item.icon size={24} className="mb-1" />
            <span className="text-xs">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
