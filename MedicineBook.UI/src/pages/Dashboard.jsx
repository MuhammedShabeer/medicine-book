import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Users, Activity } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="animate-fade-in">
      <h1 style={{ marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ marginBottom: '32px' }}>Overview of Medicine Book</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '12px', color: 'var(--primary-color)' }}>
            <Package size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>--</h3>
            <p style={{ margin: 0 }}>Total Medicines</p>
          </div>
        </div>

        {user.roles.includes('Admin') && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: 'var(--secondary-color)' }}>
              <Users size={32} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.8rem' }}>--</h3>
              <p style={{ margin: 0 }}>Total Users</p>
            </div>
          </div>
        )}

        <div className="glass-panel" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger-color)' }}>
            <Activity size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.8rem' }}>Active</h3>
            <p style={{ margin: 0 }}>System Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
