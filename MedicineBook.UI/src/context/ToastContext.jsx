import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full sm:w-auto px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl shadow-black/10 animate-toast-in ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-800' :
              toast.type === 'error' ? 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/80 dark:text-rose-100 dark:border-rose-800' :
              'bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950/80 dark:text-blue-100 dark:border-blue-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle className="text-emerald-500 dark:text-emerald-400 shrink-0" size={20} />}
            {toast.type === 'error' && <AlertCircle className="text-rose-500 dark:text-rose-400 shrink-0" size={20} />}
            {toast.type === 'info' && <Info className="text-blue-500 dark:text-blue-400 shrink-0" size={20} />}
            
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            
            <button 
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
