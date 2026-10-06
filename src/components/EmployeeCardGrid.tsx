import React from 'react';
import { Employee } from '../types/employee.ts';
import { formatDate, getInitials, getAvatarGradient } from '../utils/formatters.ts';
import { Mail, Briefcase, Calendar, Edit2, Trash2, Eye } from 'lucide-react';

interface EmployeeCardGridProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeCardGrid: React.FC<EmployeeCardGridProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {employees.map((emp) => {
        const theme = getAvatarGradient(emp.name);
        const empId = emp._id || emp.id;

        return (
          <div
            key={empId}
            className="tactile-card rounded-xl p-5 relative group flex flex-col justify-between"
            onClick={() => onView(emp)}
          >
            {/* Header: Avatar, Name, Status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.bg} border ${theme.border} flex items-center justify-center font-bold text-sm ${theme.text} shadow-sm shrink-0`}
                  >
                    {getInitials(emp.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-white group-hover:text-blue-300 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono tabular-nums">
                      {emp.id || emp._id?.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Status Dot & Label (Zero-Pill Compliance) */}
                <div className="flex items-center gap-1.5 text-xs font-medium pt-1">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      emp.status === 'Active'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                        : 'bg-rose-400'
                    }`}
                  />
                  <span
                    className={
                      emp.status === 'Active'
                        ? 'text-emerald-300'
                        : emp.status === 'On Leave'
                        ? 'text-amber-300'
                        : 'text-rose-300'
                    }
                  >
                    {emp.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Designation & Department */}
              <div className="mb-4">
                <div className="text-sm font-medium text-slate-200">{emp.designation}</div>
                {/* Zero-Pill Unboxed Text Metadata with separators */}
                <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-400">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>{emp.department}</span>
                </div>
              </div>

              {/* Email & Join Date */}
              <div className="space-y-1.5 pt-3 border-t border-white/5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="font-mono tabular-nums">Joined {formatDate(emp.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Card Bar */}
            <div
              className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onView(emp)}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Dossier</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onEdit(emp)}
                  title="Edit details"
                  className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  title="Remove employee"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
