import React from 'react';
import { Users, Gauge, Wind, Zap, ArrowUpRight, TrendingUp } from 'lucide-react';
import { RiskCurrentData, AlertItem } from '../types/crowd';
import { RiskBadge } from '../components/RiskBadge';
import { AlertBanner } from '../components/AlertBanner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface OverviewPageProps {
  data: RiskCurrentData;
  activeAlert?: AlertItem;
  history: any[];
  onAcknowledgeAlert: (id: string) => void;
  onEscalateAlert: (id: string) => void;
  onNavigateToMonitor: () => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  data,
  activeAlert,
  history,
  onAcknowledgeAlert,
  onEscalateAlert,
  onNavigateToMonitor
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Crowd Safety Overview</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Real-time crowd condition monitoring and early-warning analysis.
        </p>
      </div>

      {/* Active Alert Banner if exists */}
      {activeAlert && (
        <AlertBanner
          alert={activeAlert}
          onAcknowledge={onAcknowledgeAlert}
          onEscalate={onEscalateAlert}
          onViewLive={onNavigateToMonitor}
        />
      )}

      {/* Top Risk Status Hero Card */}
      <div className="bg-ops-surface border border-ops-border rounded-lg p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="p-4 bg-slate-100 rounded-lg border border-slate-200">
            <RiskBadge level={data.level} size="lg" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Scene Status</div>
            <div className="text-2xl font-extrabold text-slate-900 mt-0.5 flex items-baseline gap-2">
              {data.level} RISK LEVEL
              <span className="text-sm font-semibold font-mono text-slate-500">
                (Score: {data.score} / 100)
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              {data.explanation}
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToMonitor}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 transition-all shadow-xs flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Open Live Monitor</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Four Compact Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: People Count */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">People Detected</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {data.people_count.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Mode: <strong className="font-semibold text-slate-700">{data.mode} Detector</strong>
          </div>
        </div>

        {/* Metric 2: Density */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Crowd Density</span>
            <Gauge className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {data.density_ppm2} <span className="text-xs font-normal text-slate-500">people/m²</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            ROI Surface: <strong className="font-semibold text-slate-700">250 m²</strong>
          </div>
        </div>

        {/* Metric 3: Movement Speed */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Movement</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {data.speed_ms} <span className="text-xs font-normal text-slate-500">m/s</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Accel: <strong className="font-semibold text-slate-700">{data.acceleration_ms2} m/s²</strong>
          </div>
        </div>

        {/* Metric 4: Turbulence */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Turbulence</span>
            <Wind className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-2">
            {data.turbulence_pct}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Entropy: <strong className="font-semibold text-slate-700">{data.direction_entropy_pct}% ({data.direction_label})</strong>
          </div>
        </div>
      </div>

      {/* Recent Risk Trend Mini Chart */}
      <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Risk Score History (Recent Window)
          </h3>
          <span className="text-xs text-slate-400 font-mono">Live Time Series</span>
        </div>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} tickLine={false} />
              <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', fontSize: '11px' }}
              />
              <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#riskGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
