import React, { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AdmixaAI() {
  const { user } = useAuth();
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.user = user
        ? {
            id: user.id || user.username || user.userName || user.fullName || 'user',
            name: user.fullName || user.userName || user.name || 'User',
            role: user.role || user.roles?.[0] || 'user'
          }
        : null;
    }
  }, [user]);

  return (
    <div className="w-full bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
      <admixa-ai
        ref={ref}
        embedded=""
        style={{
          display: 'block',
          width: '100%',
          minHeight: 'calc(100vh - 120px)',
          '--admixa-top-offset': '0px',
          '--admixa-bottom-offset': '0px',
        }}
      />
    </div>
  );
}
