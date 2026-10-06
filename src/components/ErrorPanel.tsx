import React from 'react';
import { AlertCircle, RefreshCw, Terminal } from 'lucide-react';

interface ErrorPanelProps {
  message: string;
  onRetry: () => void;
  details?: string | Record<string, any>;
}

export const ErrorPanel: React.FC<ErrorPanelProps> = ({ message, onRetry, details }) => {
  return (
    <div className="raycast-panel rounded-xl border border-rose-500/30 p-6 my-6 shadow-[0_12px_40px_rgba(244,63,94,0.15)]">
      <div className="max-w-xl mx-auto text-center space-y-3.5">
        <div className="w-10 h-10 mx-auto rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-5 h-5" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white tracking-tight font-mono">
            Database Communications Disrupted
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {message || 'An error occurred while connecting to the employee management backend services.'}
          </p>
        </div>

        {details && (
          <div className="text-left p-3 rounded-lg bg-[#08090d] border border-white/[0.08] font-mono text-[11px] text-rose-300 overflow-x-auto">
            <div className="flex items-center gap-1.5 text-slate-400 mb-1 font-semibold">
              <Terminal className="w-3.5 h-3.5" />
              <span>Diagnostic Stack</span>
            </div>
            {typeof details === 'string' ? details : JSON.stringify(details, null, 2)}
          </div>
        )}

        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white rounded-lg raycast-button-primary font-mono"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Query (R)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
