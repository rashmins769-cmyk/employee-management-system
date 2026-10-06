import React, { useState, useEffect, useCallback } from 'react';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getDepartmentStats,
  checkSystemHealth,
  ApiError,
} from './services/api.ts';
import { Employee, EmployeeFormData, DepartmentStats } from './types/employee.ts';
import { Header } from './components/Header.tsx';
import { MetricsOverview } from './components/MetricsOverview.tsx';
import { SearchFilterBar } from './components/SearchFilterBar.tsx';
import { EmployeeTable } from './components/EmployeeTable.tsx';
import { EmployeeCardGrid } from './components/EmployeeCardGrid.tsx';
import { EmployeeModal } from './components/EmployeeModal.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { EmployeeDetailDrawer } from './components/EmployeeDetailDrawer.tsx';
import { LoadingSkeleton } from './components/LoadingSkeleton.tsx';
import { ErrorPanel } from './components/ErrorPanel.tsx';
import { EmptyState } from './components/EmptyState.tsx';
import { ApiInspectorModal } from './components/ApiInspectorModal.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { SystemStatusView } from './components/SystemStatusView.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { Command, Terminal } from 'lucide-react';

export default function App() {
  // Navigation & View State
  const [activeNav, setActiveNav] = useState<'directory' | 'analytics' | 'system'>('directory');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Data State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<DepartmentStats | null>(null);
  const [dbStatus, setDbStatus] = useState<any>(null);

  // Status & Polish
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Raycast Command Palette State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalServerError, setModalServerError] = useState<string | null>(null);

  // Delete Safeguard Modal
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Detail Dossier Drawer
  const [employeeToView, setEmployeeToView] = useState<Employee | null>(null);

  // API Documentation Inspector Modal
  const [isApiDocsOpen, setIsApiDocsOpen] = useState(false);

  // Toast Helpers
  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Main Data Fetcher
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setFetchError(null);

    try {
      const [empResult, statsResult, healthResult] = await Promise.all([
        getEmployees(searchTerm, selectedDepartment),
        getDepartmentStats(),
        checkSystemHealth().catch(() => null),
      ]);

      setEmployees(empResult.data);
      setStats(statsResult);
      if (healthResult?.database) {
        setDbStatus(healthResult.database);
      }
    } catch (err: any) {
      console.error('Data retrieval failed:', err);
      setFetchError(err.message || 'Failed to communicate with Express / Mongoose backend.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchTerm, selectedDepartment]);

  // Initial load and filter sync
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadData();
    }, 150);

    return () => clearTimeout(debounceTimer);
  }, [loadData]);

  // Global Keyboard Shortcuts (⌘K, N, T, R, Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // ⌘K / Ctrl+K Command Palette
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // If typing in form input, don't trigger single letter shortcuts
      if (isInput) return;

      // N -> New Employee
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEmployeeToEdit(null);
        setModalServerError(null);
        setIsModalOpen(true);
      }

      // T -> Toggle View
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setViewMode((prev) => (prev === 'table' ? 'grid' : 'table'));
      }

      // R -> Refresh Data
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
    addToast('info', 'Synchronized', 'Database records refreshed from MongoDB.');
  };

  // Export JSON handler
  const handleExportJson = () => {
    const jsonStr = JSON.stringify(employees, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gupio-employees-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Export Ready', 'Downloaded employee directory as JSON.');
  };

  // Export CSV handler
  const handleExportCsv = () => {
    if (employees.length === 0) return;
    const headers = ['ID', 'Name', 'Email', 'Department', 'Designation', 'Status', 'CreatedAt'];
    const rows = employees.map((emp) => [
      emp._id || emp.id,
      `"${emp.name.replace(/"/g, '""')}"`,
      `"${emp.email}"`,
      `"${emp.department}"`,
      `"${emp.designation.replace(/"/g, '""')}"`,
      emp.status,
      emp.createdAt,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gupio-employees-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('success', 'Export Ready', 'Downloaded employee directory as CSV.');
  };

  // Create or Update Form Submission
  const handleFormSubmit = async (formData: EmployeeFormData) => {
    setIsSubmitting(true);
    setModalServerError(null);

    try {
      if (employeeToEdit) {
        const empId = employeeToEdit._id || employeeToEdit.id;
        const updated = await updateEmployee(empId, formData);
        addToast('success', 'Employee Updated', `Successfully updated profile for ${updated.name}.`);
      } else {
        const created = await createEmployee(formData);
        addToast('success', 'Employee Created', `Successfully added ${created.name} to MongoDB directory.`);
      }

      setIsModalOpen(false);
      setEmployeeToEdit(null);
      await loadData(true);
    } catch (err: any) {
      console.error('Submit error:', err);
      const msg = err instanceof ApiError ? err.message : 'Failed to save record to database.';
      setModalServerError(msg);
      addToast('error', 'Operation Failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Action Execution
  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);

    try {
      const empId = employeeToDelete._id || employeeToDelete.id;
      await deleteEmployee(empId);
      addToast('success', 'Record Removed', `Deleted employee record for ${employeeToDelete.name}.`);
      setEmployeeToDelete(null);
      await loadData(true);
    } catch (err: any) {
      console.error('Delete error:', err);
      addToast('error', 'Delete Failed', err.message || 'Unable to delete employee.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Bar Navigation Contract */}
      <Header
        onOpenCreateModal={() => {
          setEmployeeToEdit(null);
          setModalServerError(null);
          setIsModalOpen(true);
        }}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        activeNav={activeNav}
        setActiveNav={setActiveNav}
        dbStatus={dbStatus}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Content Viewport (Desktop baseline 1440px max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Breadcrumb & Status Subtitle */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
          <div>
            <div className="text-[11px] font-mono tracking-wider text-indigo-400 flex items-center gap-1.5 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span>GUPIO ENGINEERING CONSOLE · RAYCAST PRECISION DARK</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-3">
              <span>
                {activeNav === 'directory'
                  ? 'Corporate Employee Directory'
                  : activeNav === 'analytics'
                  ? 'Workforce Analytics & Telemetry'
                  : 'System Architecture & MongoDB Diagnostics'}
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <button
              onClick={() => setIsCommandPaletteOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-300 transition-colors"
            >
              <Command className="w-3 h-3 text-cyan-400" />
              <span className="text-[11px]">Command Palette</span>
              <span className="kbd-badge px-1 text-[9px] text-slate-400 rounded">⌘K</span>
            </button>
          </div>
        </div>

        {/* Directory View */}
        {activeNav === 'directory' && (
          <>
            {/* Executive Metrics Overview */}
            <MetricsOverview stats={stats} totalFiltered={employees.length} />

            {/* Search & Filtering Bar */}
            <SearchFilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedDepartment={selectedDepartment}
              onDepartmentChange={setSelectedDepartment}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onClearFilters={() => {
                setSearchTerm('');
                setSelectedDepartment('All');
              }}
              totalResults={employees.length}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />

            {/* Error Panel State */}
            {fetchError && (
              <ErrorPanel
                message={fetchError}
                onRetry={() => loadData(false)}
              />
            )}

            {/* Loading Skeleton State */}
            {isLoading && !fetchError && (
              <LoadingSkeleton viewMode={viewMode} />
            )}

            {/* Empty State */}
            {!isLoading && !fetchError && employees.length === 0 && (
              <EmptyState
                hasFilters={searchTerm.trim() !== '' || selectedDepartment !== 'All'}
                onClearFilters={() => {
                  setSearchTerm('');
                  setSelectedDepartment('All');
                }}
                onOpenCreateModal={() => {
                  setEmployeeToEdit(null);
                  setIsModalOpen(true);
                }}
              />
            )}

            {/* Populated Employee Records State */}
            {!isLoading && !fetchError && employees.length > 0 && (
              <>
                {viewMode === 'table' ? (
                  <EmployeeTable
                    employees={employees}
                    onView={(emp) => setEmployeeToView(emp)}
                    onEdit={(emp) => {
                      setEmployeeToEdit(emp);
                      setModalServerError(null);
                      setIsModalOpen(true);
                    }}
                    onDelete={(emp) => setEmployeeToDelete(emp)}
                  />
                ) : (
                  <EmployeeCardGrid
                    employees={employees}
                    onView={(emp) => setEmployeeToView(emp)}
                    onEdit={(emp) => {
                      setEmployeeToEdit(emp);
                      setModalServerError(null);
                      setIsModalOpen(true);
                    }}
                    onDelete={(emp) => setEmployeeToDelete(emp)}
                  />
                )}
              </>
            )}
          </>
        )}

        {/* Analytics View */}
        {activeNav === 'analytics' && (
          <AnalyticsView stats={stats} employees={employees} />
        )}

        {/* System Diagnostics View */}
        {activeNav === 'system' && (
          <SystemStatusView />
        )}
      </main>

      {/* Corporate Footer (Anti-Slop Cleanliness) */}
      <footer className="border-t border-white/[0.06] bg-[#07080c] py-4 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">GUPIO · Linear Precision Dark Console</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500 text-[11px]">Shortcuts: [⌘K] Command · [N] New · [T] View · [R] Sync</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              onClick={handleExportJson}
              className="hover:text-cyan-400 transition-colors"
            >
              Export JSON
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleExportCsv}
              className="hover:text-cyan-400 transition-colors"
            >
              Export CSV
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-white transition-colors"
            >
              API Reference
            </button>
          </div>
        </div>
      </footer>

      {/* Instant ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onOpenCreate={() => {
          setEmployeeToEdit(null);
          setModalServerError(null);
          setIsModalOpen(true);
        }}
        onToggleView={() => setViewMode((prev) => (prev === 'table' ? 'grid' : 'table'))}
        viewMode={viewMode}
        onRefresh={handleRefresh}
        onSelectDepartment={(dept) => {
          setSelectedDepartment(dept);
          setActiveNav('directory');
        }}
        onNavigateTab={(tab) => setActiveNav(tab)}
        onOpenApiDocs={() => setIsApiDocsOpen(true)}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        employees={employees}
        onSelectEmployee={(emp) => setEmployeeToView(emp)}
      />

      {/* Modals & Overlays */}
      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEmployeeToEdit(null);
        }}
        onSubmit={handleFormSubmit}
        employeeToEdit={employeeToEdit}
        isSubmitting={isSubmitting}
        serverError={modalServerError}
      />

      <DeleteConfirmModal
        isOpen={!!employeeToDelete}
        onClose={() => setEmployeeToDelete(null)}
        onConfirm={handleDeleteConfirm}
        employee={employeeToDelete}
        isDeleting={isDeleting}
      />

      <EmployeeDetailDrawer
        employee={employeeToView}
        onClose={() => setEmployeeToView(null)}
        onEdit={(emp) => {
          setEmployeeToEdit(emp);
          setModalServerError(null);
          setIsModalOpen(true);
        }}
        onDelete={(emp) => setEmployeeToDelete(emp)}
      />

      <ApiInspectorModal
        isOpen={isApiDocsOpen}
        onClose={() => setIsApiDocsOpen(false)}
      />

      {/* Floating Glassmorphic Toasts */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
