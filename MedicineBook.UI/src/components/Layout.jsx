import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Pill, LogOut } from 'lucide-react';

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user.roles.includes('Admin');

  return (
    <div className="app-container">
      <div className="sidebar glass-panel" style={{ borderRadius: 0, borderTop: 0, borderBottom: 0, borderLeft: 0 }}>
        <div style={{ padding: '16px 8px', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Pill color="var(--primary-color)" />
            MedBook
          </h2>
          <p style={{ fontSize: '0.85rem' }}>Welcome, {user.fullName}</p>
          <span style={{ fontSize: '0.7rem', padding: '2px 8px', background: 'var(--primary-color)', borderRadius: '12px', color: 'white', display: 'inline-block', marginTop: '4px' }}>
            {isAdmin ? 'Administrator' : 'Staff'}
          </span>
        </div>

        <Link to="/dashboard" className={`sidebar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          Dashboard
        </Link>
        <Link to="/medicines" className={`sidebar-link ${location.pathname === '/medicines' ? 'active' : ''}`}>
          <Pill size={20} />
          Medicines
        </Link>
        
        {isAdmin && (
          <Link to="/users" className={`sidebar-link ${location.pathname === '/users' ? 'active' : ''}`}>
            <Users size={20} />
            Users
          </Link>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button onClick={logout} className="sidebar-link" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger-color)' }}>
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
