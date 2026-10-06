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
    <div className="glass-surface rounded-2xl border border-white/10 p-12 text-center my-6">
      <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
        <Users className="w-7 h-7" />
      </div>

      <h3 className="text-base font-bold text-white tracking-tight">
        {hasFilters ? 'No Matching Employees Found' : 'Employee Directory is Currently Empty'}
      </h3>

      <p className="text-xs text-slate-400 max-w-md mx-auto mt-1.5 leading-relaxed">
        {hasFilters
          ? 'No corporate personnel matched your search query or department filter criteria. Try adjusting or resetting your filters.'
          : 'No personnel records are currently stored in the system. Add your first team member to seed the directory.'}
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white rounded-lg tactile-button-secondary"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Active Filters</span>
          </button>
        ) : (
          <button
            onClick={onOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg tactile-button-primary"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Employee</span>
          </button>
        )}
      </div>
    </div>
  );
};
