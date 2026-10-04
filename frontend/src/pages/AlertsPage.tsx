import React, { useState } from 'react';
import { Bell, Filter, CheckCircle, ShieldAlert, MapPin, Clock } from 'lucide-react';
import { AlertItem, RiskLevel } from '../types/crowd';
import { RiskBadge } from '../components/RiskBadge';

interface AlertsPageProps {
  alerts: AlertItem[];
  onAcknowledge: (id: string) => void;
  onEscalate: (id: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({ alerts, onAcknowledge, onEscalate }) => {
  const [filterLevel, setFilterLevel] = useState<string>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (filterLevel === 'ALL') return true;
    return a.level === filterLevel;
  });

  const filterOptions = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Alert Management & Audit Log
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            System generated early-warning alerts with operator acknowledgment tracking.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center space-x-1.5 bg-ops-surface p-1 rounded-md border border-ops-border shadow-2xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {filterOptions.map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                filterLevel === lvl
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Log Table */}
      <div className="bg-ops-surface border border-ops-border rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Alert ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Reason / Primary Factors</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No alerts recorded for filter mode "{filterLevel}".
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {alert.id}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {alert.timestamp}
                    </td>
                    <td className="py-3.5 px-4">
                      <RiskBadge level={alert.level} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {alert.score}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-700 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {alert.location}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium max-w-xs">
                      {alert.reason}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                        alert.status === 'Active' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : alert.status === 'Acknowledged'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : alert.status === 'Escalated'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      {alert.status === 'Active' && (
                        <>
                          <button
                            onClick={() => onAcknowledge(alert.id)}
                            className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold rounded text-[11px] transition-all"
                          >
                            Acknowledge
                          </button>
                          {alert.level === 'CRITICAL' && (
                            <button
                              onClick={() => onEscalate(alert.id)}
                              className="px-2.5 py-1 bg-red-600 text-white font-bold rounded text-[11px] hover:bg-red-700 transition-all"
                            >
                              Escalate
                            </button>
                          )}
                        </>
                      )}
                      {alert.status !== 'Active' && (
                        <span className="text-slate-400 text-[11px] italic">
                          {alert.acknowledged_by ? `By ${alert.acknowledged_by}` : 'Processed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
