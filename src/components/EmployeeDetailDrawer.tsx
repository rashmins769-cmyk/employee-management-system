import React from 'react';
import { Employee } from '../types/employee.ts';
import { formatDate, getInitials, getAvatarGradient } from '../utils/formatters.ts';
import { X, Mail, Briefcase, Calendar, ShieldCheck, Edit2, Trash2, Code2 } from 'lucide-react';

interface EmployeeDetailDrawerProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  employee,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!employee) return null;

  const theme = getAvatarGradient(employee.name);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md glass-surface border-l border-white/10 shadow-2xl flex flex-col justify-between">
          {/* Top Bar */}
          <div>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Employee Dossier
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.bg} border ${theme.border} flex items-center justify-center font-bold text-xl ${theme.text} shadow-md shrink-0`}
                >
                  {getInitials(employee.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    {employee.name}
                  </h2>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">
                    {employee.designation}
                  </p>
                  <p className="text-xs text-slate-400 font-mono tabular-nums mt-0.5">
                    Internal ID: {employee.id || employee._id}
                  </p>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">Corporate Status</span>
                <div className="flex items-center gap-1.5 text-xs font-medium">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      employee.status === 'Active'
                        ? 'bg-emerald-400'
                        : employee.status === 'On Leave'
                        ? 'bg-amber-400'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span
                    className={
                      employee.status === 'Active'
                        ? 'text-emerald-300'
                        : employee.status === 'On Leave'
                        ? 'text-amber-300'
                        : 'text-rose-300'
                    }
                  >
                    {employee.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Core Attributes */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </span>
                  <span className="text-slate-200 font-mono select-all">
                    {employee.email}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Department</span>
                  </span>
                  <span className="text-slate-200 font-medium">
                    {employee.department}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Role / Designation</span>
                  </span>
                  <span className="text-slate-200">
                    {employee.designation}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Date Onboarded</span>
                  </span>
                  <span className="text-slate-300 font-mono tabular-nums">
                    {formatDate(employee.createdAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Last Updated</span>
                  </span>
                  <span className="text-slate-300 font-mono tabular-nums">
                    {formatDate(employee.updatedAt)}
                  </span>
                </div>
              </div>

              {/* Raw Mongoose JSON payload preview */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-2">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Mongoose Record Payload</span>
                </div>
                <pre className="p-3 rounded-lg bg-slate-950/80 border border-white/10 text-[11px] font-mono text-emerald-400 overflow-x-auto max-h-36">
                  {JSON.stringify(employee, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="p-6 border-t border-white/10 flex items-center gap-3">
            <button
              onClick={() => {
                onEdit(employee);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white rounded-lg tactile-button-primary"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={() => {
                onDelete(employee);
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-white/10 transition-colors"
              title="Delete record"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
