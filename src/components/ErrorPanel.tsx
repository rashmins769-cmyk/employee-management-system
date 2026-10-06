import React from 'react';
import { AlertCircle, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';

interface ErrorPanelProps {
  message: string;
  onRetry: () => void;
  details?: string | Record<string, any>;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({ message, onRetry, details }) => {
  return (
    <div className="glass-surface rounded-2xl border border-rose-500/30 p-8 my-6 shadow-[0_12px_40px_rgba(244,63,94,0.15)]">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Database Communications Disruption
          </h3>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
            {message || 'An error occurred while connecting to the employee management backend services.'}
          </p>
        </div>

        {details && (
          <div className="text-left p-3.5 rounded-lg bg-slate-950/80 border border-white/10 font-mono text-xs text-rose-300 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-sans font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Server Diagnostic Stack</span>
            </div>
            {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white rounded-lg tactile-button-primary"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    </div>
  );
};
