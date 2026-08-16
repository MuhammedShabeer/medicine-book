import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Activity, LogIn, Search, FileText, RefreshCw, Calculator } from 'lucide-react';

const UserAnalytics = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    activeUsersToday: 0,
    recentActivity: [],
    mostActiveUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/analytics/dashboard');
      setData(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.Message || 'Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'Login': return <LogIn size={16} className="text-blue-500" />;
      case 'Search': return <Search size={16} className="text-amber-500" />;
      case 'View_Medicine': return <FileText size={16} className="text-cyan-500" />;
      case 'Calculator': return <Calculator size={16} className="text-emerald-500" />;
      default: return <Activity size={16} className="text-slate-500" />;
    }
  };

  const getActionBadgeClass = (actionType) => {
    switch (actionType) {
      case 'Login': return 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30';
      case 'Search': return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-500/30';
      case 'View_Medicine': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30';
      case 'Calculator': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300 border-slate-200 dark:border-slate-500/30';
    }
  };

  return (
    <div className="animate-fade-in pb-8">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl mb-2 text-slate-900 dark:text-white">User Analytics</h1>
          <p className="text-slate-600 dark:text-slate-300">Monitor user engagement and system activity</p>
        </div>
        <button className="glass-button secondary flex-1 md:flex-none justify-center text-sm md:text-base py-2" onClick={fetchAnalytics}>
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-danger/10 text-danger p-4 rounded-xl mb-6 text-sm font-medium border border-danger/20">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform active:scale-95 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-gradient-to-br from-primary to-secondary rounded-2xl text-white shadow-lg shadow-primary/30 relative z-10">
            <Users size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white font-bold">{loading ? '...' : data.totalUsers}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium tracking-wide">Total Users</p>
          </div>
        </div>

        <div className="glass-panel p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform active:scale-95 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-gradient-to-br from-accent to-primary rounded-2xl text-white shadow-lg shadow-accent/30 relative z-10">
            <Activity size={32} />
          </div>
          <div className="relative z-10">
            <h3 className="text-3xl m-0 leading-none text-slate-900 dark:text-white font-bold">{loading ? '...' : data.activeUsersToday}</h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1 font-medium tracking-wide">Logins Today</p>
          </div>
        </div>
        
        <div className="glass-panel p-6 flex flex-col justify-center relative overflow-hidden">
          <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Most Active Users (7d)</h4>
          {loading ? (
            <div className="animate-pulse flex space-x-4"><div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div></div>
          ) : data.mostActiveUsers.length === 0 ? (
            <p className="text-slate-500 text-sm italic">No recent activity.</p>
          ) : (
            <div className="space-y-2">
              {data.mostActiveUsers.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2" title={u.userName}>{u.userName}</span>
                  <span className="shrink-0 bg-slate-100 dark:bg-white/10 px-2 py-0.5 rounded text-xs text-slate-600 dark:text-slate-300 font-semibold">{u.actionCount} actions</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Log */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-white/5 pb-2">
          Recent Activity (Last 50 Actions)
        </h3>
        
        {loading ? (
          <div className="py-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.recentActivity.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-white/5">
            No activity logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">User</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">Action</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">Details</th>
                  <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {data.recentActivity.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {log.userName}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionBadgeClass(log.actionType)}`}>
                        {getActionIcon(log.actionType)}
                        {log.actionType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate" title={log.details || '-'}>
                      {log.details || '-'}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-500 dark:text-slate-400 text-right whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAnalytics;
