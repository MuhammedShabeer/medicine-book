import React from 'react';
import FormularyRestrictions from '../modules/formulary-restrictions/FormularyRestrictions';
import { useAuth } from '../context/AuthContext';

export default function Restrictions() {
  const { user } = useAuth();

  const handleActivity = async (activity) => {
    try {
      const token = localStorage.getItem('token');
      if (token && activity) {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            action: activity.action || 'Restrictions',
            details: activity.details || '',
            module: 'Restrictions'
          })
        }).catch(() => {});
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="w-full">
      <FormularyRestrictions
        apiBaseUrl="/api/formulary-restrictions"
        getToken={() => localStorage.getItem('token')}
        theme="auto"
        showThemeToggle={false}
        syncUrl={true}
        onActivity={handleActivity}
      />
    </div>
  );
}
