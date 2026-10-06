import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl backdrop-blur-md flex items-start gap-3 transition-all transform animate-in slide-in-from-bottom-5 duration-200 ${
        isSuccess
          ? 'bg-slate-900/90 border-emerald-500/30 text-white'
          : isError
          ? 'bg-slate-900/90 border-rose-500/30 text-white'
          : 'bg-slate-900/90 border-blue-500/30 text-white'
      }`}
    >
      <div className="mt-0.5 shrink-0">
        {isSuccess && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        {isError && <AlertCircle className="w-4 h-4 text-rose-400" />}
        {!isSuccess && !isError && <Info className="w-4 h-4 text-blue-400" />}
      </div>

      <div className="flex-1">
        <h4 className="text-xs font-bold">{toast.title}</h4>
        {toast.message && (
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
        )}
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-0.5"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
