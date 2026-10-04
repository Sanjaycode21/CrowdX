import React, { useState } from 'react';
import { Terminal, Filter, Search, RefreshCw, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { LogEntry } from '../types/crowd';

interface SystemLogsPageProps {
  logs: LogEntry[];
  onRefresh: () => void;
}

export const SystemLogsPage: React.FC<SystemLogsPageProps> = ({ logs, onRefresh }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = logs.filter((log) => {
    if (filterSeverity !== 'ALL' && log.severity !== filterSeverity) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        log.module.toLowerCase().includes(q) ||
        log.event.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-blue-600" />
            System Event & Telemetry Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Technical audit trailing for pipeline events, detector state transitions, and alert engines.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition-all self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-ops-surface p-3 rounded-lg border border-ops-border shadow-2xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search module, event, details..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:border-blue-500 font-medium"
          />
        </div>

        {/* Severity Tabs */}
        <div className="flex items-center space-x-1 bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs font-semibold">
          {['ALL', 'INFO', 'WARNING', 'ERROR'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded transition-all ${
                filterSeverity === sev
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Style Log Viewer */}
      <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs text-slate-300 shadow-md overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3 text-[11px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Timestamp | Module | Event Log Stream</span>
          <span>{filteredLogs.length} Records</span>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredLogs.length === 0 ? (
            <div className="py-8 text-center text-slate-600">No log events match query.</div>
          ) : (
            filteredLogs.map((log) => {
              const getSevBadge = (sev: string) => {
                if (sev === 'ERROR') return 'text-red-400 bg-red-950/60 border-red-800';
                if (sev === 'WARNING') return 'text-amber-400 bg-amber-950/60 border-amber-800';
                return 'text-blue-400 bg-blue-950/60 border-blue-800';
              };

              return (
                <div key={log.id} className="flex items-start space-x-3 py-1 hover:bg-slate-900/60 px-2 rounded transition-colors">
                  <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border uppercase shrink-0 ${getSevBadge(log.severity)}`}>
                    {log.severity}
                  </span>
                  <span className="text-emerald-400 font-bold shrink-0">[{log.module}]</span>
                  <span className="text-slate-200">{log.event}</span>
                  {log.details && <span className="text-slate-500 text-[11px]">— {log.details}</span>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
