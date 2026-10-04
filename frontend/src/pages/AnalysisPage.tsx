import React, { useState } from 'react';
import { LineChart as LineIcon, Download, Calendar } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface AnalysisPageProps {
  history: any[];
}

export const AnalysisPage: React.FC<AnalysisPageProps> = ({ history }) => {
  const [timeRange, setTimeRange] = useState<string>('15m');

  const ranges = ['15 min', '30 min', '1 hour', 'Custom'];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <LineIcon className="w-5 h-5 text-blue-600" />
            Crowd Dynamics & Risk Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Time-series telemetry for density, velocity, turbulence, and convergence metrics.
          </p>
        </div>

        {/* Time Selector & Export */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
            {ranges.map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                  timeRange === r 
                    ? 'bg-slate-900 text-white shadow-2xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button 
            className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-bold rounded-md shadow-2xs flex items-center gap-1.5 transition-all"
            onClick={() => alert("Telemetry CSV Report exported successfully.")}
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Grid of 4 Detailed Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: People Count & Density */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. People Count & Density (people/m²)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">ROI: 250 m²</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="people_count" stroke="#2563eb" strokeWidth={2} dot={false} name="People Count" />
                <Line type="monotone" dataKey="density" stroke="#d97706" strokeWidth={2} dot={false} name="Density (p/m²)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Movement Speed & Acceleration */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Average Speed (m/s) & Acceleration (m/s²)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Baseline: 1.2 m/s</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="speed" stroke="#16a34a" strokeWidth={2} dot={false} name="Speed (m/s)" />
                <Line type="monotone" dataKey="acceleration" stroke="#dc2626" strokeWidth={2} dot={false} name="Acceleration (m/s²)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Crowd Turbulence & Direction Entropy */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              3. Turbulence (%) & Direction Entropy (%)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Disorder Index</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="turbulence" stroke="#ea580c" strokeWidth={2} dot={false} name="Turbulence (%)" />
                <Line type="monotone" dataKey="direction_entropy" stroke="#9333ea" strokeWidth={2} dot={false} name="Entropy (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Exit Convergence & Overall Risk Score */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              4. Gate Convergence (%) & Risk Score (0-100)
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Exit A Zone</span>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '4px', fontSize: '11px' }} />
                <Line type="monotone" dataKey="convergence" stroke="#0284c7" strokeWidth={2} dot={false} name="Convergence (%)" />
                <Line type="monotone" dataKey="score" stroke="#dc2626" strokeWidth={2.5} dot={false} name="Risk Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
