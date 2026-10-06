import React from 'react';
import { DepartmentStats } from '../types/employee.ts';
import { Users, UserCheck, Clock, Building2, Terminal } from 'lucide-react';

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Metric 1 */}
      <div className="raycast-card rounded-xl p-4 border border-white/[0.08]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-indigo-400" />
            <span>Headcount</span>
          </span>
          <Users className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {total}
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {totalFiltered !== total ? `· ${totalFiltered} filtered` : '· full roster'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="text-indigo-300">directory.all</span>
          <span aria-hidden="true">·</span>
          <span>MongoDB verified</span>
        </div>
      </div>

      {/* Metric 2 */}
      <div className="raycast-card rounded-xl p-4 border border-white/[0.08]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-400" />
            <span>Active Deploy</span>
          </span>
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {active}
          </span>
          <span className="text-[11px] text-emerald-400 font-mono">
            {total > 0 ? `${Math.round((active / total) * 100)}% load` : '100%'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="text-emerald-400">status.active</span>
          <span aria-hidden="true">·</span>
          <span>operational</span>
        </div>
      </div>

      {/* Metric 3 */}
      <div className="raycast-card rounded-xl p-4 border border-white/[0.08]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-amber-400" />
            <span>On Leave</span>
          </span>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {onLeave}
          </span>
          <span className="text-[11px] text-amber-400 font-mono">
            {total > 0 ? `${Math.round((onLeave / total) * 100)}% idle` : '0%'}
          </span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="text-amber-300">status.leave</span>
          <span aria-hidden="true">·</span>
          <span>scheduled hold</span>
        </div>
      </div>

      {/* Metric 4 */}
      <div className="raycast-card rounded-xl p-4 border border-white/[0.08]">
        <div className="flex items-center justify-between text-slate-400 mb-2">
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-400" />
            <span>Departments</span>
          </span>
          <Building2 className="w-3.5 h-3.5 text-cyan-400" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {deptCount}
          </span>
          <span className="text-[11px] text-cyan-400 font-mono">units</span>
        </div>
        <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
          <span className="text-cyan-300">org.structure</span>
          <span aria-hidden="true">·</span>
          <span>cross-matrix</span>
        </div>
      </div>
    </div>
  );
};
