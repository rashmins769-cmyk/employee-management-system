import React from 'react';
import { Users, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  onOpenCreateModal,
}) => {
  return (
    <div className="raycast-panel rounded-xl border border-white/[0.08] p-10 text-center my-6">
      <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3.5">
        <Users className="w-6 h-6" />
      </div>

      <h3 className="text-sm font-bold text-white tracking-tight">
        {hasFilters ? 'No Matching Personnel Found' : 'Employee Directory is Currently Empty'}
      </h3>

      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed font-mono">
        {hasFilters
          ? 'No records matched your search query or department filter. Try resetting your query or pressing ⌘K.'
          : 'No personnel records are currently stored in MongoDB. Commit your first record to seed the directory.'}
      </p>

      <div className="mt-5 flex items-center justify-center gap-2.5">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white rounded-lg raycast-button-secondary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Active Filters</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white rounded-lg raycast-button-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Employee</span>
            <span className="kbd-badge px-1 py-0.2 text-[9px] text-white/70 rounded">N</span>
          </button>
        )}
      </div>
    </div>
  );
};
