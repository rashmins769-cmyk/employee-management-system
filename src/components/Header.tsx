import React from 'react';
import { Plus, RefreshCw, Command } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeNav: 'directory' | 'analytics' | 'system';
  setActiveNav: (nav: 'directory' | 'analytics' | 'system') => void;
  dbStatus?: { isConnected: boolean; isUsingFallback: boolean; mode: string };
  onOpenApiDocs: () => void;
  onOpenCommandPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
  activeNav,
  setActiveNav,
  dbStatus,
  onOpenApiDocs,
  onOpenCommandPalette,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0d14]/90 backdrop-blur-xl border-b border-white/[0.08] px-6 py-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-6">
          <a
            href="#directory"
            onClick={(e) => {
              e.preventDefault();
              setActiveNav('directory');
            }}
            className="flex items-center gap-2 group"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-tr from-indigo-500 to-cyan-400 shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors font-mono">
              GUPIO<span className="text-indigo-400">.</span>CORE
            </span>
          </a>

          {/* Quick ⌘K Search trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 text-xs text-slate-400 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-indigo-500/40 rounded-lg transition-all"
            title="Open Command Palette (⌘K)"
          >
            <Command className="w-3.5 h-3.5 text-indigo-400" />
            <span>Search or command...</span>
            <span className="kbd-badge px-1.5 py-0.5 text-[10px] text-slate-300 rounded ml-2">⌘K</span>
          </button>
        </div>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <button
            onClick={() => setActiveNav('directory')}
            className={`transition-colors hover:text-white py-1 ${
              activeNav === 'directory'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveNav('analytics')}
            className={`transition-colors hover:text-white py-1 ${
              activeNav === 'analytics'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={onOpenApiDocs}
            className="text-slate-400 hover:text-white transition-colors py-1 flex items-center gap-1.5"
          >
            <span>API Docs</span>
          </button>
          <button
            onClick={() => setActiveNav('system')}
            className={`transition-colors hover:text-white py-1 ${
              activeNav === 'system'
                ? 'text-cyan-400 border-b-2 border-cyan-400 font-semibold'
                : 'text-slate-400'
            }`}
          >
            System Health
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          {/* DB Indicator */}
          <div
            className={`flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-md border ${
              dbStatus?.isConnected
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
            }`}
            title={dbStatus?.mode || 'Database Status'}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                dbStatus?.isConnected ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]' : 'bg-amber-400'
              }`}
            />
            <span>{dbStatus?.isConnected ? 'MongoDB: Live' : 'Mongoose: Fallback'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh database records (R)"
            aria-label="Refresh records"
            className="p-1.5 text-slate-400 hover:text-white rounded-lg raycast-button-secondary transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white rounded-lg raycast-button-primary whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Employee</span>
            <span className="kbd-badge px-1 py-0.2 text-[9px] text-white/70 rounded hidden sm:inline">N</span>
          </button>
        </div>
      </div>
    </header>
  );
};
