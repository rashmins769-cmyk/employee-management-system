import React from 'react';

interface LoadingSkeletonProps {
  viewMode: 'table' | 'grid';
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ viewMode }) => {
  if (viewMode === 'table') {
    return (
      <div className="raycast-panel rounded-xl overflow-hidden border border-white/[0.08] animate-pulse">
        <div className="p-3 bg-[#11131c] border-b border-white/[0.08] flex items-center justify-between">
          <div className="h-3.5 w-28 bg-white/[0.06] rounded" />
          <div className="h-3.5 w-16 bg-white/[0.06] rounded" />
        </div>
        <div className="divide-y divide-white/[0.04]">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.06] shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-white/[0.06] rounded" />
                  <div className="h-2.5 w-16 bg-white/[0.03] rounded" />
                </div>
              </div>
              <div className="h-3.5 w-40 bg-white/[0.06] rounded hidden sm:block" />
              <div className="h-3.5 w-24 bg-white/[0.06] rounded hidden md:block" />
              <div className="h-3.5 w-14 bg-white/[0.06] rounded" />
              <div className="flex gap-1.5">
                <div className="w-6 h-6 bg-white/[0.06] rounded" />
                <div className="w-6 h-6 bg-white/[0.06] rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="raycast-panel rounded-xl p-4 border border-white/[0.08] space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/[0.06] shrink-0" />
              <div className="space-y-1.5">
                <div className="h-3.5 w-28 bg-white/[0.06] rounded" />
                <div className="h-2.5 w-14 bg-white/[0.03] rounded" />
              </div>
            </div>
            <div className="h-2.5 w-10 bg-white/[0.06] rounded" />
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="h-3.5 w-44 bg-white/[0.06] rounded" />
            <div className="h-2.5 w-20 bg-white/[0.03] rounded" />
          </div>

          <div className="pt-2.5 border-t border-white/[0.04] space-y-1.5">
            <div className="h-2.5 w-36 bg-white/[0.03] rounded" />
            <div className="h-2.5 w-24 bg-white/[0.03] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
