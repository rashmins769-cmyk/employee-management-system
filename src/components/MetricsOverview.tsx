import React from 'react';
import { DepartmentStats } from '../types/employee.ts';
import { Users, UserCheck, Clock, Building2 } from 'lucide-react';

interface MetricsOverviewProps {
  stats: DepartmentStats | null;
  totalFiltered: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ stats, totalFiltered }) => {
  const total = stats?.totalEmployees ?? 0;
  const active = stats?.activeEmployees ?? 0;
  const onLeave = stats?.onLeaveEmployees ?? 0;
  const deptCount = stats?.departmentsCount ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1 */}
      <div className="tactile-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Headcount</span>
          <Users className="w-4 h-4 text-blue-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
            {total}
          </span>
          <span className="text-xs text-slate-400">
            {totalFiltered !== total ? `(${totalFiltered} matched)` : 'in directory'}
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Active Staff</span>
          <span aria-hidden="true">·</span>
          <span>Full Directory Access</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="tactile-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Active Workforce</span>
          <UserCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
            {active}
          </span>
          <span className="text-xs text-emerald-400">
            {total > 0 ? `${Math.round((active / total) * 100)}% active` : '100%'}
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Deployed</span>
          <span aria-hidden="true">·</span>
          <span>Fully Operational</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="tactile-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">On Leave / Rest</span>
          <Clock className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
            {onLeave}
          </span>
          <span className="text-xs text-amber-400">
            {total > 0 ? `${Math.round((onLeave / total) * 100)}% on leave` : '0%'}
          </span>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Scheduled Absence</span>
          <span aria-hidden="true">·</span>
          <span>Temporary Hold</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="tactile-card rounded-xl p-5 border border-white/10">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Departments</span>
          <Building2 className="w-4 h-4 text-purple-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-white font-mono tabular-nums">
            {deptCount}
          </span>
          <span className="text-xs text-slate-400">operational units</span>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex items-center gap-1.5">
          <span>Cross-functional</span>
          <span aria-hidden="true">·</span>
          <span>Structured Org</span>
        </div>
      </div>
    </div>
  );
};
