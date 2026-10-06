import React from 'react';
import { DepartmentStats, Employee } from '../types/employee.ts';
import { Building2, PieChart, Users, TrendingUp } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-surface rounded-2xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <PieChart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Organizational Analytics & Department Distribution
            </h2>
            <p className="text-xs text-slate-400">
              Real-time headcount allocation and operational ratios derived from MongoDB records
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Breakdown Bars */}
        <div className="lg:col-span-2 glass-surface rounded-2xl p-6 border border-white/10 space-y-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>Departmental Headcount Allocation</span>
          </h3>

          <div className="space-y-4">
            {departmentData.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200">{item.name}</span>
                  <div className="flex items-center gap-2 font-mono tabular-nums text-slate-400">
                    <span className="text-white font-semibold">{item.count}</span>
                    <span className="text-[11px] text-slate-500">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(item.percentage, 4)}%` }}
                  />
                </div>
              </div>
            ))}

            {departmentData.length === 0 && (
              <p className="text-xs text-slate-500 text-center py-6">
                No department distribution data available.
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats Insights */}
        <div className="glass-surface rounded-2xl p-6 border border-white/10 space-y-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Workforce Health Indicators</span>
          </h3>

          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium">
                Retention & Active Ratio
              </span>
              <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1">
                {stats?.totalEmployees
                  ? `${Math.round(((stats.activeEmployees || 0) / stats.totalEmployees) * 100)}%`
                  : '100%'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Active personnel currently fulfilling primary corporate duties.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium">
                Absence & Leave Load
              </span>
              <div className="text-2xl font-bold text-amber-400 font-mono tabular-nums mt-1">
                {stats?.totalEmployees
                  ? `${Math.round(((stats.onLeaveEmployees || 0) / stats.totalEmployees) * 100)}%`
                  : '0%'}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Staff members currently on approved corporate leave or sabbaticals.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10">
              <span className="text-[11px] text-slate-400 uppercase font-medium">
                Cross-Department Balance
              </span>
              <div className="text-2xl font-bold text-purple-400 font-mono tabular-nums mt-1">
                {stats?.departmentsCount || 0}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Unique operational divisions populated across the enterprise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
