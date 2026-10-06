import React from 'react';
import { DepartmentStats, Employee } from '../types/employee.ts';
import { Building2, PieChart, TrendingUp, BarChart3 } from 'lucide-react';

interface AnalyticsViewProps {
  stats: DepartmentStats | null;
  employees: Employee[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ stats, employees }) => {
  const distribution = stats?.distribution || {};
  const total = stats?.totalEmployees || employees.length || 1;

  const departmentData = Object.entries(distribution).map(([dept, count]) => ({
    name: dept,
    count,
    percentage: Math.round((count / total) * 100),
  }));

  // Sort largest departments first
  departmentData.sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="raycast-panel rounded-xl p-5 border border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <PieChart className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-tight">
              Workforce Analytics & Telemetry Console
            </h2>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Live headcount allocation and operational ratios derived from MongoDB records
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Department Breakdown Bars */}
        <div className="lg:col-span-2 raycast-panel rounded-xl p-5 border border-white/[0.08] space-y-4">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Department Allocation Ratio</span>
          </h3>

          <div className="space-y-3.5">
            {departmentData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2 tabular-nums text-slate-400">
                    <span className="text-cyan-400 font-semibold">{item.count}</span>
                    <span className="text-[10px] text-slate-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#121522] rounded-full overflow-hidden border border-white/[0.04]">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 3)}%` }}
                  />
                </div>
              </div>
            ))}

            {departmentData.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6 font-mono">
                No department distribution telemetry available.
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Insights */}
        <div className="raycast-panel rounded-xl p-5 border border-white/[0.08] space-y-4">
          <h3 className="text-[11px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Operational Signals</span>
          </h3>

          <div className="space-y-3 font-mono">
            <div className="p-3.5 rounded-lg bg-[#11131c] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">
                Active Staff Ratio
              </span>
              <div className="text-xl font-bold text-emerald-400 tabular-nums mt-0.5">
                {stats?.totalEmployees
                  ? `${Math.round(((stats.activeEmployees || 0) / stats.totalEmployees) * 100)}%`
                  : '100%'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Full duty deploy in active MongoDB rosters.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#11131c] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">
                Leave Capacity Load
              </span>
              <div className="text-xl font-bold text-amber-400 tabular-nums mt-0.5">
                {stats?.totalEmployees
                  ? `${Math.round(((stats.onLeaveEmployees || 0) / stats.totalEmployees) * 100)}%`
                  : '0%'}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Approved corporate leave or sabbaticals.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-[#11131c] border border-white/[0.06]">
              <span className="text-[10px] text-slate-400 uppercase">
                Matrix Divisions
              </span>
              <div className="text-xl font-bold text-indigo-400 tabular-nums mt-0.5">
                {stats?.departmentsCount || 0}
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Discrete department clusters active.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
