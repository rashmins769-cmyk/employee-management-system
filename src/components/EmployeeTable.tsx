import React from 'react';
import { Employee } from '../types/employee.ts';
import { formatDate, getInitials, getAvatarGradient } from '../utils/formatters.ts';
import { Edit2, Trash2, Eye, Mail } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="glass-surface rounded-xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-5">Employee</th>
              <th className="py-3 px-4">Corporate Email</th>
              <th className="py-3 px-4">Department & Role</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {employees.map((emp) => {
              const theme = getAvatarGradient(emp.name);
              const empId = emp._id || emp.id;

              return (
                <tr
                  key={empId}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => onView(emp)}
                >
                  {/* Name & Avatar */}
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${theme.bg} border ${theme.border} flex items-center justify-center font-bold text-xs ${theme.text} shadow-sm shrink-0`}
                      >
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                          {emp.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          ID: <span className="font-mono tabular-nums">{emp.id || emp._id?.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Corporate Email */}
                  <td className="py-3.5 px-4 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[200px]">{emp.email}</span>
                    </div>
                  </td>

                  {/* Department & Role (Zero-Pill Compliance) */}
                  <td className="py-3.5 px-4">
                    <div className="text-slate-200 font-medium text-xs">{emp.designation}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <span>{emp.department}</span>
                    </div>
                  </td>

                  {/* Status (Semantic text with accessible dot) */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Active'
                            ? 'bg-emerald-400'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-400'
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
                  </td>

                  {/* Joined Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-400 font-mono tabular-nums">
                    {formatDate(emp.createdAt)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3.5 px-5 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(emp)}
                        title="View details"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        title="Edit employee record"
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        title="Delete employee record"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
