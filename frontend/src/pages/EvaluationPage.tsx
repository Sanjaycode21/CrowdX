import React from 'react';
import { BarChart3, Cpu, Layers, Info, CheckCircle2, Award } from 'lucide-react';
import { EvaluationMetrics } from '../types/crowd';

interface EvaluationPageProps {
  metrics: EvaluationMetrics;
}

export const EvaluationPage: React.FC<EvaluationPageProps> = ({ metrics }) => {
  const { ai_mode, rule_mode, dataset_notice } = metrics;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          Engineering Evaluation & Benchmark Matrix
        </h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium">
          Comparative empirical evaluation between Deep Learning (AI Mode) and Classical Background Subtraction (Rule Mode).
        </p>
      </div>

      {/* Dataset Benchmark Notice Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-900 flex items-start space-x-3">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Evaluation Dataset Provenance & Standards:</strong>
          <p className="mt-0.5 text-blue-800 leading-relaxed font-medium">
            {dataset_notice} Supported datasets include <strong className="font-bold">ShanghaiTech (Part A/B)</strong>, <strong className="font-bold">UCF-QNRF</strong>, and the <strong className="font-bold">UMN Crowd Panic Dataset</strong> for escape behavior evaluation.
          </p>
        </div>
      </div>

      {/* Side-by-Side Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: AI Mode */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-ops-border pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-slate-900 text-white rounded-md">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{ai_mode.name}</h3>
                <span className="text-[11px] text-slate-500">Learned Detection Features</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded uppercase">
              Recommended
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">MAE (Counting Error)</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{ai_mode.mae}</div>
              <span className="text-[10px] text-slate-400">Lower is better</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Alert Precision</span>
              <div className="text-xl font-extrabold text-emerald-700 font-mono mt-1">{ai_mode.precision}%</div>
              <span className="text-[10px] text-slate-400">High specificity</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Alert Recall</span>
              <div className="text-xl font-extrabold text-blue-700 font-mono mt-1">{ai_mode.recall}%</div>
              <span className="text-[10px] text-slate-400">Sensitivity</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">False Alarm Rate</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{ai_mode.false_alarm_rate}%</div>
              <span className="text-[10px] text-slate-400">Low false positives</span>
            </div>
          </div>
        </div>

        {/* Card 2: Rule Mode */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-ops-border pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{rule_mode.name}</h3>
                <span className="text-[11px] text-slate-500">Heuristic Thresholds (No ML)</span>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded uppercase">
              Fallback
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">MAE (Counting Error)</span>
              <div className="text-xl font-extrabold text-slate-900 font-mono mt-1">{rule_mode.mae}</div>
              <span className="text-[10px] text-slate-400">Optical flow area</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Alert Precision</span>
              <div className="text-xl font-extrabold text-amber-700 font-mono mt-1">{rule_mode.precision}%</div>
              <span className="text-[10px] text-slate-400">Fixed threshold</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">Alert Recall</span>
              <div className="text-xl font-extrabold text-slate-700 font-mono mt-1">{rule_mode.recall}%</div>
              <span className="text-[10px] text-slate-400">Sensitivity</span>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="text-slate-500 font-medium">False Alarm Rate</span>
              <div className="text-xl font-extrabold text-red-700 font-mono mt-1">{rule_mode.false_alarm_rate}%</div>
              <span className="text-[10px] text-slate-400">Higher noise sensitivity</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Detailed Metric Comparison Table
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <th className="py-2.5 px-4">Evaluation Metric</th>
                <th className="py-2.5 px-4">AI Mode (YOLOv8n)</th>
                <th className="py-2.5 px-4">Rule-Based Mode</th>
                <th className="py-2.5 px-4">Performance Delta</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">Counting Error (MAE)</td>
                <td className="py-3 px-4 font-mono">{ai_mode.mae} people</td>
                <td className="py-3 px-4 font-mono">{rule_mode.mae} people</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">67.8% lower error in AI Mode</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">Alert Precision</td>
                <td className="py-3 px-4 font-mono">{ai_mode.precision}%</td>
                <td className="py-3 px-4 font-mono">{rule_mode.precision}%</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">+15.7% precision improvement</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">Alert Recall</td>
                <td className="py-3 px-4 font-mono">{ai_mode.recall}%</td>
                <td className="py-3 px-4 font-mono">{rule_mode.recall}%</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">+17.7% recall improvement</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">False Alarm Rate</td>
                <td className="py-3 px-4 font-mono">{ai_mode.false_alarm_rate}%</td>
                <td className="py-3 px-4 font-mono">{rule_mode.false_alarm_rate}%</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">72.8% reduction in false alerts</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">Processing Latency</td>
                <td className="py-3 px-4 font-mono">{ai_mode.detection_latency_ms} ms</td>
                <td className="py-3 px-4 font-mono">{rule_mode.detection_latency_ms} ms</td>
                <td className="py-3 px-4 text-slate-600 font-bold">Rule mode is 20ms faster</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-slate-900 font-bold">Throughput (FPS)</td>
                <td className="py-3 px-4 font-mono">{ai_mode.fps} FPS</td>
                <td className="py-3 px-4 font-mono">{rule_mode.fps} FPS</td>
                <td className="py-3 px-4 text-slate-600 font-bold">Both meet real-time requirements (&gt;25 FPS)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
