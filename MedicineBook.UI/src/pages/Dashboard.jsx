import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Package, Users, Activity } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ totalMedicines: '--', totalUsers: '--', systemStatus: '--' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="animate-fade-in pb-8 min-h-[calc(100vh-64px)] md:min-h-screen flex flex-col">
      <h1 className="text-3xl md:text-4xl mb-2 text-slate-900 dark:text-white">Dashboard</h1>
      <p className="text-slate-600 dark:text-slate-300 mb-8">Overview of Medicine Book</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-primary/10 rounded-2xl text-primary">
            <Package size={32} />
          </div>
          <div>
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white">{loading ? '...' : stats.totalMedicines}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Total Medicines</p>
          </div>
        </div>

        {user.roles.includes('Admin') && (
          <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
            <div className="p-4 bg-secondary/10 rounded-2xl text-secondary">
              <Users size={32} />
            </div>
            <div>
              <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white">{loading ? '...' : stats.totalUsers}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">Total Users</p>
            </div>
          </div>
        )}

        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-4 bg-danger/10 rounded-2xl text-danger">
            <Activity size={32} />
          </div>
          <div>
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white">{loading ? '...' : stats.systemStatus}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">System Status</p>
          </div>
        </div>
      </div>
      
      {/* Footer in the main content area so it's always visible on mobile too */}
      <div className="mt-auto pt-8 text-center text-[10px] text-slate-400 dark:text-white/30 tracking-wider font-semibold uppercase">
        Concept & Design: Sayyid Muhammed
      </div>
    </div>
  );
};

export default Dashboard;
