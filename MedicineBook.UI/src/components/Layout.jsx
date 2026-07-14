import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, LogOut, Menu, X, Sun, Moon } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.roles.includes('Admin');

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 z-20 sticky top-0 shadow-sm">
        <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white">
          <Pill className="text-primary" />
          MedBook
        </h2>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-700 dark:text-white">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed md:relative inset-y-0 left-0 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out z-30 w-64 bg-white dark:bg-slate-800/90 md:bg-white/80 md:dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200 dark:border-white/10 shadow-lg md:shadow-none flex flex-col pt-16 md:pt-0`}>
        <div className="p-6 hidden md:block">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white">
              <Pill className="text-primary" />
              MedBook
            </h2>
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/10">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Welcome, <span className="font-semibold text-slate-800 dark:text-white">{user.fullName}</span></p>
          <span className="text-[0.7rem] px-2 py-1 bg-primary/10 text-primary dark:bg-primary dark:text-white rounded-full inline-block mt-2 font-bold tracking-wide uppercase">
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>
        
        {/* Mobile user info */}
        <div className="p-6 md:hidden border-b border-slate-100 dark:border-white/5">
          <p className="text-sm text-slate-600 dark:text-slate-300">Welcome, <span className="font-semibold">{user.fullName}</span></p>
          <span className="text-[0.7rem] px-2 py-1 bg-primary/10 text-primary dark:bg-primary dark:text-white rounded-full inline-block mt-2 font-bold tracking-wide uppercase">
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-4 py-6 md:py-0">
          <Link onClick={closeMenu} to="/dashboard" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/dashboard' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-primary font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link onClick={closeMenu} to="/medicines" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/medicines' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-primary font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
            <Pill size={20} />
            Medicines
          </Link>
          
          {isAdmin && (
            <Link onClick={closeMenu} to="/users" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${location.pathname === '/users' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-primary font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'}`}>
              <Users size={20} />
              Users
            </Link>
          )}
        </div>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5">
          <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-left text-danger hover:bg-red-50 dark:hover:bg-white/5 rounded-xl transition-all font-semibold">
            <LogOut size={20} />
            Logout
          </button>
          <div className="mt-6 text-center text-[10px] text-slate-400 dark:text-white/30 tracking-wider font-semibold uppercase">
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
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/60 backdrop-blur-sm z-20 md:hidden transition-opacity" onClick={closeMenu}></div>
      )}
    </div>
  );
};

export default Layout;
