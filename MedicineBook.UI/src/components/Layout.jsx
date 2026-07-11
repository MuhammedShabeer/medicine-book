import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, LogOut, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.roles.includes('Admin');

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-surface backdrop-blur-xl border-b border-white/10 z-20 sticky top-0">
        <h2 className="flex items-center gap-3 text-xl font-bold">
          <Pill className="text-primary" />
          MedBook
        </h2>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 glass-panel rounded-none border-y-0 border-l-0 flex flex-col pt-16 md:pt-0`}>
        <div className="p-6 hidden md:block">
          <h2 className="flex items-center gap-3 mb-2 text-2xl font-bold">
            <Pill className="text-primary" />
            MedBook
          </h2>
          <p className="text-sm text-slate-300">Welcome, {user.fullName}</p>
          <span className="text-[0.7rem] px-2 py-1 bg-primary rounded-full text-white inline-block mt-2 font-medium">
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>
        
        {/* Mobile user info */}
        <div className="p-6 md:hidden">
          <p className="text-sm text-slate-300">Welcome, {user.fullName}</p>
          <span className="text-[0.7rem] px-2 py-1 bg-primary rounded-full text-white inline-block mt-1 font-medium">
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-4">
          <Link onClick={closeMenu} to="/dashboard" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-white/10 text-primary font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link onClick={closeMenu} to="/medicines" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/medicines' ? 'bg-white/10 text-primary font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
            <Pill size={20} />
            Medicines
          </Link>
          
          {isAdmin && (
            <Link onClick={closeMenu} to="/users" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/users' ? 'bg-white/10 text-primary font-semibold' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              <Users size={20} />
              Users
            </Link>
          )}
        </div>

        <div className="p-4 mt-auto">
          <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-left text-danger hover:bg-white/5 rounded-xl transition-all font-medium">
            <LogOut size={20} />
            Logout
          </button>
          <div className="mt-8 text-center text-[11px] text-white/30 tracking-wide font-medium">
            Concept & Design: Sayyid Muhammed
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full md:max-w-[calc(100vw-16rem)] min-h-[calc(100vh-64px)] md:min-h-screen">
        <Outlet />
      </div>
      
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 md:hidden" onClick={closeMenu}></div>
      )}
    </div>
  );
};

export default Layout;
