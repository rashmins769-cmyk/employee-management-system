import React, { useState } from 'react';
import { X, Code, Copy, Check, Server, Database, Shield } from 'lucide-react';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const endpoints = [
    {
      method: 'POST',
      path: '/api/employees',
      desc: 'Create employee record with strict Mongoose schema validation',
      status: '201 Created / 400 Bad Request',
      body: JSON.stringify(
        {
          name: 'Sarah Chen',
          email: 'sarah.chen@gupio.corp',
          department: 'Engineering',
          designation: 'Staff Distributed Systems Architect',
          status: 'Active',
        },
        null,
        2
      ),
      curl: `curl -X POST http://localhost:3000/api/employees \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Sarah Chen","email":"sarah.chen@gupio.corp","department":"Engineering","designation":"Staff Architect"}'`,
    },
    {
      method: 'GET',
      path: '/api/employees?search=sarah&department=Engineering',
      desc: 'Query employees with case-insensitive search (name/email/designation) and department filter',
      status: '200 OK',
      curl: `curl "http://localhost:3000/api/employees?search=sarah&department=Engineering"`,
    },
    {
      method: 'GET',
      path: '/api/employees/:id',
      desc: 'Retrieve single employee by ID (Validates 24-char ObjectId)',
      status: '200 OK / 400 Bad ID / 404 Not Found',
      curl: `curl http://localhost:3000/api/employees/65f123456789abcdef012345`,
    },
    {
      method: 'PUT',
      path: '/api/employees/:id',
      desc: 'Safely update existing employee details with runValidators: true',
      status: '200 OK / 400 Validation Error / 404 Not Found',
      body: JSON.stringify(
        {
          designation: 'Principal Systems Architect',
          status: 'Active',
        },
        null,
        2
      ),
      curl: `curl -X PUT http://localhost:3000/api/employees/65f123456789abcdef012345 \\
  -H "Content-Type: application/json" \\
  -d '{"designation":"Principal Systems Architect"}'`,
    },
    {
      method: 'DELETE',
      path: '/api/employees/:id',
      desc: 'Safely delete employee record by ID',
      status: '200 OK / 400 Bad ID / 404 Not Found',
      curl: `curl -X DELETE http://localhost:3000/api/employees/65f123456789abcdef012345`,
    },
    {
      method: 'GET',
      path: '/api/employees/stats/summary',
      desc: 'Aggregate analytics of total, active, on leave, and departmental distribution',
      status: '200 OK',
      curl: `curl http://localhost:3000/api/employees/stats/summary`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-[#0e1017] rounded-2xl border border-white/[0.12] shadow-[0_24px_70px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.1)] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] bg-[#11141e]/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">
                REST API Specification & Evaluation Documentation
              </h2>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                GUPIO Placement Evaluation Test Suite · Express + Mongoose Controller Routes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Architecture Banner */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <Database className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Database Schema</span>
                <p className="text-slate-400 mt-0.5">
                  Mongoose Model with required fields, email regex match, department enum.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Error Handling</span>
                <p className="text-slate-400 mt-0.5">
                  Consistent JSON format with status 200, 201, 400, 404, 500 & try/catch blocks.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Code className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">Environment Safety</span>
                <p className="text-slate-400 mt-0.5">
                  Configured via process.env.MONGODB_URI and process.env.PORT.
                </p>
              </div>
            </div>
          </div>

          {/* Endpoints List */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Documented Controller Endpoints
            </h3>

            {endpoints.map((ep, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded ${
                        ep.method === 'POST'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : ep.method === 'GET'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : ep.method === 'PUT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {ep.method}
                    </span>
                    <span className="font-mono text-xs text-white font-semibold">
                      {ep.path}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 font-mono">
                    Returns: {ep.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300">{ep.desc}</p>

                {ep.body && (
                  <div className="pt-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Payload Schema:
                    </span>
                    <pre className="p-2.5 rounded bg-slate-950 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto">
                      {ep.body}
                    </pre>
                  </div>
                )}

                {/* Curl Snippet */}
                <div className="relative pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      cURL Test Command:
                    </span>
                    <button
                      onClick={() => handleCopy(ep.curl, idx)}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy cURL</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-slate-950/90 border border-white/5 font-mono text-[11px] text-blue-300 overflow-x-auto select-all">
                    {ep.curl}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <span>GUPIO Practical Placement Assignment 3.5h</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg tactile-button-secondary"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
