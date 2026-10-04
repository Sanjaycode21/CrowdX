import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckSquare, Square, Video, Layers } from 'lucide-react';
import { RiskCurrentData } from '../types/crowd';
import { LiveVideoCanvas } from '../components/LiveVideoCanvas';
import { FactorPanel } from '../components/FactorPanel';
import { DemoScenario } from '../services/demoSimulator';

interface LiveMonitorPageProps {
  data: RiskCurrentData;
  scenario: DemoScenario;
  onSelectScenario: (scen: DemoScenario) => void;
  isAnalyzing: boolean;
  onTogglePlay: () => void;
}

export const LiveMonitorPage: React.FC<LiveMonitorPageProps> = ({
  data,
  scenario,
  onSelectScenario,
  isAnalyzing,
  onTogglePlay
}) => {
  // Overlays state
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [showROI, setShowROI] = useState<boolean>(true);
  const [showExit, setShowExit] = useState<boolean>(true);

  const scenarios: DemoScenario[] = [
    'Normal Crowd',
    'Increasing Density',
    'Sudden Movement',
    'Chaotic Movement',
    'Exit Convergence',
    'High-Risk Scenario'
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            Live Crowd Monitor & Vision Engine
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Real-time video feed analysis with multi-layer computer vision overlays.
          </p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-2 bg-ops-surface p-1.5 rounded-lg border border-ops-border shadow-2xs">
          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all ${
              isAnalyzing 
                ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                : 'bg-emerald-600 text-white'
            }`}
          >
            {isAnalyzing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAnalyzing ? 'Pause Analysis' : 'Start Analysis'}</span>
          </button>

          <button
            onClick={() => onSelectScenario('Normal Crowd')}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200 transition-all"
            title="Restart Stream"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: Video Stream on Left (7 cols), Live Factor Panel on Right (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Video & Controls */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Video Canvas Stream */}
          <LiveVideoCanvas
            data={data}
            showBoxes={showBoxes}
            showVectors={showVectors}
            showHeatmap={showHeatmap}
            showROI={showROI}
            showExit={showExit}
          />

          {/* Overlay Toggles Panel */}
          <div className="bg-ops-surface border border-ops-border rounded-lg p-3.5 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Vision Layer Overlays</span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-700">
              <button
                onClick={() => setShowBoxes(!showBoxes)}
                className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
              >
                {showBoxes ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>Bounding Boxes</span>
              </button>

              <button
                onClick={() => setShowVectors(!showVectors)}
                className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
              >
                {showVectors ? <CheckSquare className="w-4 h-4 text-yellow-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>Motion Vectors</span>
              </button>

              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
              >
                {showHeatmap ? <CheckSquare className="w-4 h-4 text-red-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>Density Heatmap</span>
              </button>

              <button
                onClick={() => setShowROI(!showROI)}
                className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
              >
                {showROI ? <CheckSquare className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>ROI Area</span>
              </button>

              <button
                onClick={() => setShowExit(!showExit)}
                className="flex items-center gap-1.5 hover:text-slate-900 cursor-pointer"
              >
                {showExit ? <CheckSquare className="w-4 h-4 text-orange-600" /> : <Square className="w-4 h-4 text-slate-400" />}
                <span>Exit Zones</span>
              </button>
            </div>
          </div>

          {/* Demo Scenario Controls */}
          <div className="bg-ops-surface border border-ops-border rounded-lg p-4 shadow-2xs">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              DEMO SCENARIO SIMULATOR
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {scenarios.map((scen) => {
                const isSelected = scenario === scen;
                return (
                  <button
                    key={scen}
                    onClick={() => onSelectScenario(scen)}
                    className={`px-3 py-2 text-xs font-bold rounded border transition-all text-left ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {scen}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Factor Panel */}
        <div className="lg:col-span-5 h-full">
          <FactorPanel data={data} />
        </div>
      </div>
    </div>
  );
};
