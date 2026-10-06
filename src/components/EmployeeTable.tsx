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
    <div className="raycast-panel rounded-xl overflow-hidden border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans">
          <thead>
            <tr className="border-b border-white/[0.08] bg-[#11131c]/90 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-2.5 px-4">Personnel</th>
              <th className="py-2.5 px-4">Corporate Email</th>
              <th className="py-2.5 px-4">Department & Title</th>
              <th className="py-2.5 px-4">Telemetry Status</th>
              <th className="py-2.5 px-4">Onboarded</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.05] text-xs">
            {employees.map((emp) => {
              const theme = getAvatarGradient(emp.name);
              const empId = emp._id || emp.id;

              return (
                <tr
                  key={empId}
                  className="hover:bg-indigo-600/[0.07] transition-all group cursor-pointer border-l-2 border-l-transparent hover:border-l-indigo-500"
                  onClick={() => onView(emp)}
                >
                  {/* Name & Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-lg bg-[#141824] border border-white/[0.1] flex items-center justify-center font-mono font-bold text-[11px] ${theme.text} shrink-0`}
                      >
                        {getInitials(emp.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {emp.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono tabular-nums">
                          ID: <span>{emp.id || emp._id?.slice(-6)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Corporate Email */}
                  <td className="py-3 px-4 font-mono text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[200px] text-slate-300 group-hover:text-indigo-200 transition-colors">
                        {emp.email}
                      </span>
                    </div>
                  </td>

                  {/* Department & Role (Zero-Pill Compliance) */}
                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-medium">{emp.designation}</div>
                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <span className="text-cyan-400">{emp.department}</span>
                    </div>
                  </td>

                  {/* Status (Semantic text with accessible dot) */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          emp.status === 'Active'
                            ? 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.7)]'
                            : emp.status === 'On Leave'
                            ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.7)]'
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
                  <td className="py-3 px-4 text-[11px] text-slate-400 font-mono tabular-nums">
                    {formatDate(emp.createdAt)}
                  </td>

                  {/* Actions */}
                  <td
                    className="py-3 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(emp)}
                        title="View dossier (Space)"
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onEdit(emp)}
                        title="Edit employee record"
                        className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(emp)}
                        title="Delete employee record"
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
