import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package, Users, Activity } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
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
      <p className="text-slate-600 dark:text-slate-300 mb-8">Overview of NEXFLUX</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
        <div 
          className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform cursor-pointer active:scale-95 relative overflow-hidden group"
          onClick={() => navigate('/medicines')}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white shadow-lg shadow-primary/30 relative z-10">
            <Package size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white font-bold">{loading ? '...' : stats.totalMedicines}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium tracking-wide">Total Medicines</p>
          </div>
        </div>

        {user.roles.includes('Admin') && (
          <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform active:scale-95 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="p-4 bg-gradient-to-br from-accent to-primary rounded-2xl text-white shadow-lg shadow-accent/30 relative z-10">
              <Users size={32} />
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white font-bold">{loading ? '...' : stats.totalUsers}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium tracking-wide">Total Users</p>
            </div>
          </div>
        )}

        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform active:scale-95 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-success/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-gradient-to-br from-success to-secondary rounded-2xl text-white shadow-lg shadow-success/30 relative z-10">
            <Activity size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white font-bold">{loading ? '...' : stats.systemStatus}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium tracking-wide">System Status</p>
          </div>
        </div>
      </div>
      
      {/* Footer in the main content area so it's always visible on mobile too */}
      <div className="mt-auto pt-8 text-center text-[10px] text-slate-400 dark:text-white/30 tracking-wider font-semibold uppercase">
        Quintessentially Conceived & Sculpted by Sayyid Muhammed
      </div>
    </div>
  );
};

export default Dashboard;
