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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {employees.map((emp) => {
        const theme = getAvatarGradient(emp.name);
        const empId = emp._id || emp.id;

        return (
          <div
            key={empId}
            className="raycast-card rounded-xl p-4 relative group flex flex-col justify-between cursor-pointer border border-white/[0.08]"
            onClick={() => onView(emp)}
          >
            {/* Header: Avatar, Name, Status */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-[#141824] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-xs ${theme.text} shrink-0`}
                  >
                    {getInitials(emp.name)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-cyan-300 transition-colors">
                      {emp.name}
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono tabular-nums">
                      {emp.id || emp._id?.slice(-8)}
                    </p>
                  </div>
                </div>

                {/* Status Dot & Label (Zero-Pill Compliance) */}
                <div className="flex items-center gap-1.5 text-[11px] font-mono pt-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      emp.status === 'Active'
                        ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                        : emp.status === 'On Leave'
                        ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
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
              <div className="mb-3">
                <div className="text-xs font-medium text-slate-200">{emp.designation}</div>
                {/* Zero-Pill Unboxed Text Metadata with separators */}
                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-mono text-cyan-400">
                  <Briefcase className="w-3 h-3 text-slate-500" />
                  <span>{emp.department}</span>
                </div>
              </div>

              {/* Email & Join Date */}
              <div className="space-y-1 pt-2.5 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate text-slate-300 group-hover:text-indigo-200 transition-colors">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="tabular-nums">Onboarded {formatDate(emp.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Card Bar */}
            <div
              className="mt-4 pt-2.5 border-t border-white/[0.05] flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onView(emp)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
              >
                <Eye className="w-3 h-3 text-indigo-400" />
                <span>Inspect</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onEdit(emp)}
                  title="Edit details"
                  className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded transition-colors"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  title="Remove employee"
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
