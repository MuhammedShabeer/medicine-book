import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, LogOut, Sun, Moon, Heart, Activity, Calculator, AlertTriangle, FlaskConical, PackageOpen, Menu, X } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.roles.includes('Admin');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Medicines', path: '/medicines', icon: Pill },
    { name: 'Calculator', path: '/calculator', icon: Calculator },
    ...(isAdmin ? [
      { name: 'Users', path: '/users', icon: Users },
      { name: 'Analytics', path: '/analytics', icon: Activity }
    ] : []),
    { name: 'Quality', path: '/operations/quality', icon: AlertTriangle },
    { name: 'Extemporaneous', path: '/operations/extemporaneous', icon: FlaskConical },
    { name: 'Stock', path: '/operations/stock', icon: PackageOpen },
      { name: 'References', path: '/references', icon: Heart },
    { name: 'About', path: '/acknowledgements', icon: Heart }
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-background transition-colors duration-300 pb-16 md:pb-0">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white/80 dark:bg-surface backdrop-blur-2xl border-b border-white/20 dark:border-white/10 z-20 sticky top-0 shadow-sm transition-all duration-300">
        <h2 className="flex items-center gap-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          <img src="/logo.png" alt="Logo" className="w-8 h-8 rounded-xl shadow-md" />
          NEXFLUX
        </h2>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="p-2 text-slate-500 dark:text-slate-300 hover:text-primary transition-colors active:scale-95">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={logout} className="p-2 text-danger hover:text-danger/80 transition-colors active:scale-95">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col inset-y-0 left-0 w-64 bg-white/80 dark:bg-surface backdrop-blur-2xl border-r border-white/20 dark:border-white/10 shadow-lg z-30 transition-all duration-300">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="flex items-center gap-3 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              <img src="/logo.png" alt="Logo" className="w-10 h-10 rounded-xl shadow-md" />
              NEXFLUX
            </h2>
            <button onClick={toggleTheme} className="p-2 text-slate-400 hover:text-primary transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-white/10 active:scale-95">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Welcome, <span className="font-semibold text-slate-900 dark:text-white">{user.fullName}</span></p>
          <span className="text-[0.7rem] px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary dark:text-primary rounded-full inline-block mt-2 font-bold tracking-wide uppercase border border-primary/20">
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>

        <div className="flex-1 flex flex-col gap-2 px-4 py-2">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 active:scale-95 ${
                location.pathname === item.path 
                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md shadow-primary/20' 
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white font-medium'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="p-4 mt-auto border-t border-slate-100 dark:border-white/5">
          <button onClick={logout} className="flex items-center gap-3 p-3 w-full text-left text-danger hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all font-semibold active:scale-95">
            <LogOut size={20} />
            Logout
          </button>
          <div className="mt-6 text-center text-[10px] text-slate-400 dark:text-white/30 tracking-wider font-semibold uppercase">
            Quintessentially Conceived & Sculpted by Sayyid Muhammed
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto w-full md:max-w-[calc(100vw-16rem)] min-h-[calc(100vh-64px)] md:min-h-screen">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-surface/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 z-30 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.slice(0, 3).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 active:scale-95 min-w-[60px] ${
                  isActive ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-300 ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon size={22} className={isActive ? 'animate-bounce-subtle' : ''} />
                </div>
                <span className={`text-[10px] font-medium mt-1 ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
          
          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-300 active:scale-95 min-w-[60px] ${
              isMobileMenuOpen ? 'text-primary' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'bg-primary/10' : ''}`}>
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </div>
            <span className={`text-[10px] font-medium mt-1 ${isMobileMenuOpen ? 'font-bold' : ''}`}>
              More
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Pop-up Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-sm animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute bottom-20 left-4 right-4 bg-white dark:bg-surface rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-slide-up flex flex-col p-4 max-h-[70vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">More Options</h3>
            <div className="grid grid-cols-4 gap-2">
              {navItems.slice(3).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.path} 
                    to={item.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 active:scale-95 ${
                      isActive ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <item.icon size={24} className="mb-2" />
                    <span className="text-[10px] text-center leading-tight">
                      {item.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default Layout;
