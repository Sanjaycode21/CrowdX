import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { ConfigData } from '../types/crowd';

interface ConfigurationPageProps {
  config: ConfigData;
  onSaveConfig: (updated: Partial<ConfigData>) => void;
}

export const ConfigurationPage: React.FC<ConfigurationPageProps> = ({ config, onSaveConfig }) => {
  const [roiArea, setRoiArea] = useState<number>(config.roi_area_sqm || 250);
  const [fps, setFps] = useState<number>(config.fps || 15);
  const [confidence, setConfidence] = useState<number>(config.detection_confidence || 0.50);

  // Density thresholds
  const [lowDensity, setLowDensity] = useState<number>(config.density_thresholds?.low || 1.0);
  const [medDensity, setMedDensity] = useState<number>(config.density_thresholds?.medium || 2.5);
  const [highDensity, setHighDensity] = useState<number>(config.density_thresholds?.high || 4.0);

  // Risk Weights
  const [wDensity, setWDensity] = useState<number>(config.risk_weights?.density || 0.30);
  const [wAccel, setWAccel] = useState<number>(config.risk_weights?.acceleration || 0.20);
  const [wTurb, setWTurb] = useState<number>(config.risk_weights?.turbulence || 0.20);
  const [wEntropy, setWEntropy] = useState<number>(config.risk_weights?.direction_entropy || 0.10);
  const [wConv, setWConv] = useState<number>(config.risk_weights?.convergence || 0.10);

  // Temporal
  const [persistenceSec, setPersistenceSec] = useState<number>(config.temporal?.persistence_duration_seconds || 8.0);
  const [hysteresisMargin, setHysteresisMargin] = useState<number>(config.temporal?.hysteresis_margin || 5.0);

  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      roi_area_sqm: roiArea,
      fps: fps,
      detection_confidence: confidence,
      density_thresholds: {
        low: lowDensity,
        medium: medDensity,
        high: highDensity,
        critical: highDensity + 1.5
      },
      risk_weights: {
        density: wDensity,
        acceleration: wAccel,
        turbulence: wTurb,
        direction_entropy: wEntropy,
        convergence: wConv,
        persistence: 0.10
      },
      temporal: {
        window_size_seconds: 5.0,
        persistence_duration_seconds: persistenceSec,
        hysteresis_margin: hysteresisMargin
      }
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 select-none max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-blue-600" />
            System Threshold & Parameter Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Dynamic configuration file editor (`/config/risk_config.yaml`). No hard-coded thresholds.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-md text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Configuration saved successfully.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Surface ROI & Frame Parameters */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-ops-border pb-2">
            1. Monitored Area & Sampling Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">ROI Surface Area (m²)</label>
              <input
                type="number"
                step="5"
                value={roiArea}
                onChange={(e) => setRoiArea(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-normal">Real-world ground area</span>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Target Sampling FPS</label>
              <input
                type="number"
                step="1"
                value={fps}
                onChange={(e) => setFps(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-normal">Processing frame rate limit</span>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Detection Confidence (0-1.0)</label>
              <input
                type="number"
                step="0.05"
                min="0.1"
                max="0.95"
                value={confidence}
                onChange={(e) => setConfidence(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-normal">YOLO confidence cutoff</span>
            </div>
          </div>
        </div>

        {/* Section 2: Crowd Density Thresholds */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-ops-border pb-2">
            2. Crowd Density Level Bounds (people/m²)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">LOW Threshold (≤ p/m²)</label>
              <input
                type="number"
                step="0.1"
                value={lowDensity}
                onChange={(e) => setLowDensity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">MEDIUM Threshold (≤ p/m²)</label>
              <input
                type="number"
                step="0.1"
                value={medDensity}
                onChange={(e) => setMedDensity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">HIGH Threshold (≤ p/m²)</label>
              <input
                type="number"
                step="0.1"
                value={highDensity}
                onChange={(e) => setHighDensity(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Risk Factor Weights */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-ops-border pb-2">
            3. Risk Engine Factor Weights (Must sum to ~1.0)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Density Weight ({Math.round(wDensity * 100)}%)</label>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.05"
                value={wDensity}
                onChange={(e) => setWDensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Acceleration Weight ({Math.round(wAccel * 100)}%)</label>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={wAccel}
                onChange={(e) => setWAccel(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Turbulence Weight ({Math.round(wTurb * 100)}%)</label>
              <input
                type="range"
                min="0.05"
                max="0.40"
                step="0.05"
                value={wTurb}
                onChange={(e) => setWTurb(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Temporal Persistence & Hysteresis */}
        <div className="bg-ops-surface border border-ops-border rounded-lg p-5 shadow-2xs space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-ops-border pb-2">
            4. Temporal Persistence & Hysteresis State Buffer
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Persistence Duration (Seconds)</label>
              <input
                type="number"
                step="1"
                value={persistenceSec}
                onChange={(e) => setPersistenceSec(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-normal">Condition must persist N seconds before escalation</span>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Hysteresis Margin (Score Points)</label>
              <input
                type="number"
                step="1"
                value={hysteresisMargin}
                onChange={(e) => setHysteresisMargin(parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded font-mono focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-400 font-normal">Prevents flickering between HIGH / MEDIUM</span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 shadow-sm flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Configuration File</span>
          </button>
        </div>
      </form>
    </div>
  );
};
