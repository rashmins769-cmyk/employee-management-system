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
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [loadData]);

  // Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData(true);
    addToast('info', 'Synchronized', 'Database records refreshed from server.');
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
        addToast('success', 'Employee Created', `Successfully added ${created.name} to the corporate directory.`);
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
    <div className="min-h-screen bg-[#0c111d] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
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
      />

      {/* Main Content Viewport (Desktop baseline 1440px max-w-7xl) */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Breadcrumb & Status Subtitle */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Campus Placement Assignment · GUPIO Platform
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              {activeNav === 'directory'
                ? 'Corporate Employee Directory'
                : activeNav === 'analytics'
                ? 'Workforce Analytics'
                : 'System Architecture & Health'}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
            <span>Mongoose Engine Connected</span>
            <span aria-hidden="true">·</span>
            <span>REST API Live</span>
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
      <footer className="border-t border-white/5 py-6 px-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>GUPIO Full-Stack Placement Assignment — Built with Express, Mongoose & Tailwind CSS</span>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsApiDocsOpen(true)}
              className="hover:text-white transition-colors"
            >
              API Reference
            </button>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[11px]">process.env.MONGODB_URI</span>
          </div>
        </div>
      </footer>

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
