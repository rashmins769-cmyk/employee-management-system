import React, { useState, useEffect, useRef } from 'react';
import { Employee, DEPARTMENTS } from '../types/employee.ts';
import {
  Search,
  UserPlus,
  Table,
  LayoutGrid,
  RefreshCw,
  Download,
  Building2,
  FileCode2,
  Activity,
  Layers,
  CornerDownLeft,
  X,
  User,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCreate: () => void;
  onToggleView: () => void;
  viewMode: 'table' | 'grid';
  onRefresh: () => void;
  onSelectDepartment: (dept: string) => void;
  onNavigateTab: (tab: 'directory' | 'analytics' | 'system') => void;
  onOpenApiDocs: () => void;
  onExportJson: () => void;
  onExportCsv: () => void;
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
}

interface CommandItem {
  id: string;
  category: 'Actions' | 'Navigation' | 'Departments' | 'Employees';
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenCreate,
  onToggleView,
  viewMode,
  onRefresh,
  onSelectDepartment,
  onNavigateTab,
  onOpenApiDocs,
  onExportJson,
  onExportCsv,
  employees,
  onSelectEmployee,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Construct items
  const baseActions: CommandItem[] = [
    {
      id: 'action-create',
      category: 'Actions',
      label: 'Create New Employee',
      sublabel: 'Add personnel to MongoDB directory',
      icon: <UserPlus className="w-4 h-4 text-indigo-400" />,
      shortcut: 'N',
      action: () => {
        onClose();
        onOpenCreate();
      },
    },
    {
      id: 'action-toggle-view',
      category: 'Actions',
      label: `Switch to ${viewMode === 'table' ? 'Grid Cards' : 'Table'} View`,
      sublabel: 'Toggle display layout density',
      icon: viewMode === 'table' ? <LayoutGrid className="w-4 h-4 text-cyan-400" /> : <Table className="w-4 h-4 text-cyan-400" />,
      shortcut: 'T',
      action: () => {
        onClose();
        onToggleView();
      },
    },
    {
      id: 'action-refresh',
      category: 'Actions',
      label: 'Sync Database Records',
      sublabel: 'Re-fetch latest MongoDB collections',
      icon: <RefreshCw className="w-4 h-4 text-emerald-400" />,
      shortcut: 'R',
      action: () => {
        onClose();
        onRefresh();
      },
    },
    {
      id: 'action-export-json',
      category: 'Actions',
      label: 'Export Records to JSON',
      sublabel: 'Download current dataset',
      icon: <Download className="w-4 h-4 text-blue-400" />,
      action: () => {
        onClose();
        onExportJson();
      },
    },
    {
      id: 'action-export-csv',
      category: 'Actions',
      label: 'Export Records to CSV',
      sublabel: 'Download tabular spreadsheet data',
      icon: <Download className="w-4 h-4 text-purple-400" />,
      action: () => {
        onClose();
        onExportCsv();
      },
    },
    {
      id: 'nav-directory',
      category: 'Navigation',
      label: 'Go to Employee Directory',
      sublabel: 'Master headcount table and grid',
      icon: <Layers className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onClose();
        onNavigateTab('directory');
      },
    },
    {
      id: 'nav-analytics',
      category: 'Navigation',
      label: 'Open Workforce Analytics',
      sublabel: 'Department allocation ratios',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onClose();
        onNavigateTab('analytics');
      },
    },
    {
      id: 'nav-system',
      category: 'Navigation',
      label: 'Open System Status & DB Diagnostics',
      sublabel: 'MongoDB connection & schema validation audit',
      icon: <Activity className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onClose();
        onNavigateTab('system');
      },
    },
    {
      id: 'nav-docs',
      category: 'Navigation',
      label: 'Open API Reference & cURL Inspector',
      sublabel: 'Live placement evaluation documentation',
      icon: <FileCode2 className="w-4 h-4 text-purple-400" />,
      action: () => {
        onClose();
        onOpenApiDocs();
      },
    },
  ];

  // Department Filters
  const deptItems: CommandItem[] = [
    {
      id: 'dept-all',
      category: 'Departments',
      label: 'Filter: All Departments',
      sublabel: 'Reset department filter',
      icon: <Building2 className="w-4 h-4 text-slate-400" />,
      action: () => {
        onClose();
        onSelectDepartment('All');
      },
    },
    ...DEPARTMENTS.map((dept) => ({
      id: `dept-${dept}`,
      category: 'Departments' as const,
      label: `Filter by ${dept}`,
      sublabel: `Show employees in ${dept}`,
      icon: <Building2 className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onClose();
        onSelectDepartment(dept);
      },
    })),
  ];

  // Employee Direct Jumps
  const employeeItems: CommandItem[] = employees.map((emp) => ({
    id: `emp-${emp._id || emp.id}`,
    category: 'Employees' as const,
    label: emp.name,
    sublabel: `${emp.designation} · ${emp.department} (${emp.email})`,
    icon: <User className="w-4 h-4 text-indigo-300" />,
    action: () => {
      onClose();
      onSelectEmployee(emp);
    },
  }));

  const allItems = [...baseActions, ...deptItems, ...employeeItems];

  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.sublabel?.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems.length, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e1017] border border-white/[0.12] rounded-2xl shadow-[0_24px_70px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.1)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Raycast Search Input */}
        <div className="relative border-b border-white/[0.08] px-4 py-3.5 flex items-center gap-3 bg-[#11141e]/70">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, search employee, or filter..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="kbd-badge px-1.5 py-0.5 text-[10px] text-slate-400 rounded">ESC</span>
            </div>
          )}
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No matching commands or employees found.
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isSelected
                      ? 'bg-indigo-600/20 text-white border border-indigo-500/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                      : 'text-slate-300 hover:bg-white/[0.04] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-lg shrink-0 ${
                        isSelected
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-white/[0.04] text-slate-400'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <div className="truncate">
                      <div className="font-medium text-white flex items-center gap-2">
                        <span>{item.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                          {item.category}
                        </span>
                      </div>
                      {item.sublabel && (
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {item.sublabel}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <span className="kbd-badge px-1.5 py-0.5 text-[10px] text-slate-400 rounded">
                        {item.shortcut}
                      </span>
                    )}
                    {isSelected && (
                      <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-mono">
                        <CornerDownLeft className="w-3 h-3" />
                        <span>Select</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Shortcut Bar */}
        <div className="px-4 py-2 border-t border-white/[0.06] bg-[#090b10] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="kbd-badge px-1 py-0.2 rounded text-[9px] text-slate-400">↑</span>
              <span className="kbd-badge px-1 py-0.2 rounded text-[9px] text-slate-400">↓</span> Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="kbd-badge px-1 py-0.2 rounded text-[9px] text-slate-400">↵</span> Select
            </span>
          </div>
          <span className="text-indigo-400">Raycast Console v2.4</span>
        </div>
      </div>
    </div>
  );
};
