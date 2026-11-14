import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { Bus, LayoutDashboard, Calendar, LogOut, Menu, X, ArrowLeft, Route as RouteIcon, PlusCircle } from 'lucide-react';

export default function OperatorLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-darker border-r border-slate-800 text-slate-300 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <Link to="/" className="flex items-center group">
              <Logo className="h-9 w-auto" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <NavLink
              to="/operator/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Dashboard &amp; Reports</span>
            </NavLink>

            <NavLink
              to="/operator/buses"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Bus className="w-5 h-5" />
              <span>My Fleet (Buses)</span>
            </NavLink>

            <NavLink
              to="/operator/schedule-trip"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Bus to Route</span>
            </NavLink>

            <NavLink
              to="/operator/trips"
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-brand-accent text-brand-dark shadow-md shadow-brand-accent/30 font-bold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Calendar className="w-5 h-5" />
              <span>Assigned Trips</span>
            </NavLink>
          </nav>
        </div>

        {/* Footer with Operator Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Public Site</span>
          </Link>

          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/80">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center font-black text-xs uppercase shrink-0">
                {user?.name ? user.name[0] : 'O'}
              </div>
              <div className="truncate text-xs">
                <p className="font-bold text-white truncate">{user?.name || 'Bus Operator'}</p>
                <p className="text-slate-400 text-[10px] uppercase font-semibold">Fleet Partner</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-gray-900">Operator Portal</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
