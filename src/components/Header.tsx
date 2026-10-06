import React from 'react';
import { Plus, RefreshCw, Database, Server } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  activeNav: 'directory' | 'analytics' | 'system';
  setActiveNav: (nav: 'directory' | 'analytics' | 'system') => void;
  dbStatus?: { isConnected: boolean; isUsingFallback: boolean; mode: string };
  onOpenApiDocs: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreateModal,
  onRefresh,
  isRefreshing,
  activeNav,
  setActiveNav,
  dbStatus,
  onOpenApiDocs,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-surface border-b border-white/10 px-6 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#directory"
          onClick={(e) => {
            e.preventDefault();
            setActiveNav('directory');
          }}
          className="text-xl font-bold tracking-tight text-white hover:text-blue-400 transition-colors"
        >
          GUPIO
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveNav('directory')}
            className={`transition-colors hover:text-white ${
              activeNav === 'directory' ? 'text-blue-400 underline underline-offset-8 decoration-2 decoration-blue-500 font-semibold' : ''
            }`}
          >
            Directory
          </button>
          <button
            onClick={() => setActiveNav('analytics')}
            className={`transition-colors hover:text-white ${
              activeNav === 'analytics' ? 'text-blue-400 underline underline-offset-8 decoration-2 decoration-blue-500 font-semibold' : ''
            }`}
          >
            Analytics
          </button>
          <button
            onClick={onOpenApiDocs}
            className="transition-colors hover:text-white flex items-center gap-1.5"
          >
            <span>API Docs</span>
          </button>
          <button
            onClick={() => setActiveNav('system')}
            className={`transition-colors hover:text-white ${
              activeNav === 'system' ? 'text-blue-400 underline underline-offset-8 decoration-2 decoration-blue-500 font-semibold' : ''
            }`}
          >
            System Status
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            title="Refresh database records"
            aria-label="Refresh records"
            className="p-2 text-slate-400 hover:text-white rounded-lg tactile-button-secondary transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-400' : ''}`} />
          </button>

          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg tactile-button-primary whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>
    </header>
  );
};
