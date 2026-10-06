import React from 'react';

interface LoadingSkeletonProps {
  viewMode: 'table' | 'grid';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'table') {
    return (
      <div className="glass-surface rounded-xl overflow-hidden border border-white/10 animate-pulse">
        <div className="p-4 bg-slate-900/60 border-b border-white/10 flex items-center justify-between">
          <div className="h-4 w-32 bg-slate-800 rounded" />
          <div className="h-4 w-20 bg-slate-800 rounded" />
        </div>
        <div className="divide-y divide-white/5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-36 bg-slate-800 rounded" />
                  <div className="h-3 w-20 bg-slate-800/60 rounded" />
                </div>
              </div>
              <div className="h-4 w-44 bg-slate-800 rounded hidden sm:block" />
              <div className="h-4 w-28 bg-slate-800 rounded hidden md:block" />
              <div className="h-4 w-16 bg-slate-800 rounded" />
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-slate-800 rounded" />
                <div className="w-7 h-7 bg-slate-800 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass-surface rounded-xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800 shrink-0" />
              <div className="space-y-1.5">
                <div className="h-4 w-32 bg-slate-800 rounded" />
                <div className="h-3 w-16 bg-slate-800/60 rounded" />
              </div>
            </div>
            <div className="h-3 w-12 bg-slate-800 rounded" />
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-4 w-48 bg-slate-800 rounded" />
            <div className="h-3 w-24 bg-slate-800/60 rounded" />
          </div>

          <div className="pt-3 border-t border-white/5 space-y-2">
            <div className="h-3 w-40 bg-slate-800/60 rounded" />
            <div className="h-3 w-28 bg-slate-800/60 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
