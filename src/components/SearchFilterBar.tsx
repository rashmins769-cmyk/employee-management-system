import React from 'react';
import { Search, X, LayoutGrid, List, Filter, Command } from 'lucide-react';
import { DEPARTMENTS } from '../types/employee.ts';

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (dept: string) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  onClearFilters: () => void;
  totalResults: number;
  onOpenCommandPalette?: () => void;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  viewMode,
  onViewModeChange,
  onClearFilters,
  totalResults,
  onOpenCommandPalette,
}) => {
  const hasActiveFilters = searchTerm.trim() !== '' || selectedDepartment !== 'All';

  return (
    <div className="raycast-panel rounded-xl p-3 mb-6 border border-white/[0.08]">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Left: Search Input & Department Filter */}
        <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Box with keyboard hint */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-indigo-400 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search personnel by name, email, or designation..."
              className="w-full pl-9 pr-20 py-2 text-xs font-mono bg-[#11131c] border border-white/[0.08] rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/40 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchTerm ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="text-slate-500 hover:text-white p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onOpenCommandPalette}
                  className="hidden sm:flex items-center gap-1 kbd-badge px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-white rounded transition-colors"
                  title="Open Command Palette"
                >
                  <span>⌘K</span>
                </button>
              )}
            </div>
          </div>

          {/* Department Select */}
          <div className="relative min-w-[210px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400 pointer-events-none" />
            <select
              value={selectedDepartment}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-mono bg-[#11131c] border border-white/[0.08] rounded-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all appearance-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Reset Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="px-2.5 py-2 text-xs font-mono text-slate-400 hover:text-white raycast-button-secondary rounded-lg whitespace-nowrap"
            >
              Reset
            </button>
          )}
        </div>

        {/* Right: View Mode Toggle & Result Count */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-white/[0.06]">
          <span className="text-[11px] text-slate-400 font-mono tabular-nums">
            {totalResults} {totalResults === 1 ? 'record' : 'records'}
          </span>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center p-0.5 bg-[#090b10] border border-white/[0.08] rounded-lg">
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View (T)"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid Cards View (T)"
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
