import React from 'react';
import { Info, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { RiskCurrentData } from '../types/crowd';
import { RiskBadge } from './RiskBadge';

interface FactorPanelProps {
  data: RiskCurrentData;
}

export const FactorPanel: React.FC<FactorPanelProps> = ({ data }) => {
  return (
    <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-xs flex flex-col justify-between h-full select-none">
      <div>
        {/* Risk Header */}
        <div className="flex items-center justify-between border-b border-ops-border pb-4 mb-4">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Current Risk Status</div>
            <div className="mt-1 flex items-center space-x-2">
              <RiskBadge level={data.level} score={data.score} size="lg" />
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold font-mono text-slate-900">{data.score} <span className="text-xs font-normal text-slate-400">/100</span></div>
            {data.is_persisting && (
              <span className="text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 flex items-center gap-1 justify-end mt-1">
                <Clock className="w-3 h-3" />
                Persisting {data.elevated_duration_seconds}s
              </span>
            )}
          </div>
        </div>

        {/* Contributing Factors Progress Bars */}
        <div className="space-y-3.5">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contributing Risk Factors</div>

          {data.factors.map((factor) => {
            const getBarColor = (score: number) => {
              if (score > 75) return 'bg-red-500';
              if (score > 55) return 'bg-orange-500';
              if (score > 30) return 'bg-amber-500';
              return 'bg-emerald-500';
            };

            const getTooltip = (name: string) => {
              if (name === 'Crowd Turbulence') return 'High velocity variation combined with elevated crowd density.';
              if (name === 'Crowd Density') return 'Estimated people per square meter in ROI.';
              if (name === 'Movement Acceleration') return 'Rate of speed change relative to baseline movement.';
              if (name === 'Direction Disorder') return 'Shannon entropy of movement vector directions.';
              if (name === 'Gate Convergence') return 'Concentration of movement vectors towards Exit A.';
              return '';
            };

            return (
              <div key={factor.name} className="group relative">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    {factor.name}
                    <Info className="w-3 h-3 text-slate-400 cursor-help" />
                  </span>
                  <span className="font-mono font-bold text-slate-800">{factor.score}%</span>
                </div>
                
                {/* Progress Bar Container */}
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                  <div 
                    className={`h-full transition-all duration-500 rounded-full ${getBarColor(factor.score)}`} 
                    style={{ width: `${Math.min(100, Math.max(5, factor.score))}%` }}
                  />
                </div>

                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 left-0 z-20 bg-slate-900 text-white text-[11px] p-2 rounded shadow-lg pointer-events-none max-w-xs">
                  {getTooltip(factor.name)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY THIS ALERT Explainability Panel */}
      <div className="mt-6 pt-4 border-t border-ops-border bg-slate-50 -mx-5 -mb-5 p-4 rounded-b-lg">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <span>WHY THIS ALERT?</span>
        </div>
        <p className="text-xs text-slate-700 leading-relaxed font-medium bg-white p-3 rounded border border-slate-200 shadow-2xs">
          "{data.explanation}"
        </p>
      </div>
    </div>
  );
};
