import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, Send, Play, Square, RotateCcw, CheckCircle2, 
  AlertTriangle, Radio, Activity, Zap, Server, SlidersHorizontal, Eye
} from 'lucide-react';
import { SensorDataInput, SensorProcessResponse, SampleSensorPreset } from '../types/crowd';
import { postSensorData, fetchSamplePresets, resetSensorMode, checkBackendStatus } from '../services/api';
import { RiskBadge } from './RiskBadge';

interface SensorTelemetryLabProps {
  onSensorProcessed: (res: SensorProcessResponse) => void;
  onResetCamera: () => void;
  usePhotoBackdrop: boolean;
  onTogglePhotoBackdrop: (val: boolean) => void;
}

export const SensorTelemetryLab: React.FC<SensorTelemetryLabProps> = ({
  onSensorProcessed,
  onResetCamera,
  usePhotoBackdrop,
  onTogglePhotoBackdrop
}) => {
  // Sensor State
  const [peopleCount, setPeopleCount] = useState<number>(850);
  const [speed, setSpeed] = useState<number>(2.4);
  const [accel, setAccel] = useState<number>(1.6);
  const [variance, setVariance] = useState<number>(2.2);
  const [entropy, setEntropy] = useState<number>(68);
  const [convergence, setConvergence] = useState<number>(75);
  const [exitZone, setExitZone] = useState<string>('Exit A');
  const [roiArea, setRoiArea] = useState<number>(250);
  const [sensorId, setSensorId] = useState<string>('OPTICAL-FLOW-GATE-A');
  const [mode, setMode] = useState<'AI' | 'RULE'>('AI');

  // Backend state
  const [backendStatus, setBackendStatus] = useState<{ online: boolean; pingMs: number }>({ online: false, pingMs: 0 });
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<SensorProcessResponse | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [presets, setPresets] = useState<Record<string, SampleSensorPreset>>({});

  const streamTimerRef = useRef<any>(null);

  // Check backend health & fetch sample presets
  useEffect(() => {
    async function init() {
      const status = await checkBackendStatus();
      setBackendStatus({ online: status.online, pingMs: status.pingMs });
      const p = await fetchSamplePresets();
      setPresets(p);
    }
    init();
    const interval = setInterval(async () => {
      const status = await checkBackendStatus();
      setBackendStatus({ online: status.online, pingMs: status.pingMs });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Send Sensor Data to Backend
  const handleSendSensorData = async () => {
    setIsProcessing(true);
    const payload: SensorDataInput = {
      people_count: peopleCount,
      average_speed_ms: speed,
      acceleration_ms2: accel,
      velocity_variance: variance,
      direction_entropy_pct: entropy,
      convergence_pct: convergence,
      exit_zone_name: exitZone,
      roi_area_sqm: roiArea,
      sensor_id: sensorId,
      mode
    };

    const res: SensorProcessResponse = await postSensorData(payload);
    setLastResponse(res);
    onSensorProcessed(res);
    setIsProcessing(false);
  };

  // Preset loader
  const handleApplyPreset = (key: string) => {
    const preset = presets[key];
    if (!preset) return;
    const d = preset.data;
    setPeopleCount(d.people_count);
    setSpeed(d.average_speed_ms);
    setAccel(d.acceleration_ms2);
    setVariance(d.velocity_variance);
    setEntropy(d.direction_entropy_pct);
    setConvergence(d.convergence_pct);
    setExitZone(d.exit_zone_name || 'Exit A');
    setSensorId(d.sensor_id || 'SENSOR-NODE-01');
    if (d.mode) setMode(d.mode);
  };

  // Toggle Continuous IoT stream
  const toggleStreaming = () => {
    if (isStreaming) {
      clearInterval(streamTimerRef.current);
      setIsStreaming(false);
    } else {
      setIsStreaming(true);
      streamTimerRef.current = setInterval(async () => {
        // Apply slight realistic telemetry variance
        const jitterCount = Math.max(50, Math.round(peopleCount + (Math.random() * 40 - 20)));
        const jitterSpeed = Math.max(0.5, Math.round((speed + (Math.random() * 0.2 - 0.1)) * 10) / 10);
        const jitterAccel = Math.max(0.0, Math.round((accel + (Math.random() * 0.2 - 0.1)) * 10) / 10);
        
        const payload: SensorDataInput = {
          people_count: jitterCount,
          average_speed_ms: jitterSpeed,
          acceleration_ms2: jitterAccel,
          velocity_variance: variance,
          direction_entropy_pct: entropy,
          convergence_pct: convergence,
          exit_zone_name: exitZone,
          roi_area_sqm: roiArea,
          sensor_id: sensorId,
          mode
        };
        const res = await postSensorData(payload);
        setLastResponse(res);
        onSensorProcessed(res);
      }, 1500);
    }
  };

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) clearInterval(streamTimerRef.current);
    };
  }, []);

  const handleReset = async () => {
    if (isStreaming) {
      clearInterval(streamTimerRef.current);
      setIsStreaming(false);
    }
    await resetSensorMode();
    setLastResponse(null);
    onResetCamera();
  };

  const currentDensity = (peopleCount / Math.max(roiArea, 1)).toFixed(2);

  return (
    <div className="bg-ops-surface border border-ops-border rounded-lg shadow-sm p-5 space-y-5">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-ops-border pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
            <Radio className="w-4 h-4 animate-pulse text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Sensor Telemetry Ingestion & Backend Test Lab
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                Live Pipe
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Submit custom sensor or camera telemetry to execute the real Python risk engine and see outputs live on the website.
            </p>
          </div>
        </div>

        {/* Live Backend Connection Badge */}
        <div className="flex items-center space-x-2 text-xs">
          <div className={`px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1.5 ${
            backendStatus.online 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            <Server className="w-3.5 h-3.5" />
            <span>Backend: {backendStatus.online ? `ONLINE (${backendStatus.pingMs}ms)` : 'STANDBY / LOCAL'}</span>
          </div>

          {/* Toggle Real Camera Photo Backdrop */}
          <button
            onClick={() => onTogglePhotoBackdrop(!usePhotoBackdrop)}
            className={`px-2.5 py-1 rounded-md border font-semibold flex items-center gap-1.5 transition-all text-xs ${
              usePhotoBackdrop 
                ? 'bg-slate-900 text-white border-slate-900 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Toggle authentic surveillance facility photo background"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{usePhotoBackdrop ? 'Facility Cam Active' : 'Switch to Facility Cam'}</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Loader Buttons */}
      <div>
        <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Load Sample Sensor Telemetry Presets</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleApplyPreset('normal_flow')}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-bold rounded-md transition-all shadow-2xs"
          >
            🟢 Normal Baseline Flow
          </button>
          <button
            onClick={() => handleApplyPreset('dense_influx')}
            className="px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100 font-bold rounded-md transition-all shadow-2xs"
          >
            🟡 Dense Influx Gathering
          </button>
          <button
            onClick={() => handleApplyPreset('sudden_surge')}
            className="px-3 py-1.5 bg-orange-50 text-orange-800 border border-orange-300 hover:bg-orange-100 font-bold rounded-md transition-all shadow-2xs"
          >
            🟠 Sudden Movement Surge
          </button>
          <button
            onClick={() => handleApplyPreset('chaotic_turbulence')}
            className="px-3 py-1.5 bg-red-50 text-red-800 border border-red-300 hover:bg-red-100 font-bold rounded-md transition-all shadow-2xs"
          >
            🔴 Chaotic Turbulence
          </button>
          <button
            onClick={() => handleApplyPreset('critical_stampede_precursor')}
            className="px-3 py-1.5 bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 font-bold rounded-md transition-all shadow-2xs"
          >
            🚨 Critical Exit Bottleneck
          </button>
        </div>
      </div>

      {/* Sensor Input Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 bg-slate-50/80 p-4 rounded-lg border border-slate-200 text-xs">
        {/* People Count */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>People Count</span>
            <span className="font-mono text-blue-600 font-bold">{peopleCount}</span>
          </div>
          <input
            type="range"
            min="50"
            max="2000"
            step="25"
            value={peopleCount}
            onChange={(e) => setPeopleCount(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Density: <strong>{currentDensity} p/m²</strong>
          </div>
        </div>

        {/* Speed */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>Speed (m/s)</span>
            <span className="font-mono text-emerald-600 font-bold">{speed}</span>
          </div>
          <input
            type="range"
            min="0.4"
            max="4.5"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Base: 1.2 m/s
          </div>
        </div>

        {/* Acceleration */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>Accel (m/s²)</span>
            <span className="font-mono text-red-600 font-bold">{accel}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="3.5"
            step="0.1"
            value={accel}
            onChange={(e) => setAccel(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Sudden surge rate
          </div>
        </div>

        {/* Velocity Variance */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>Variance (σ²)</span>
            <span className="font-mono text-orange-600 font-bold">{variance}</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="5.0"
            step="0.1"
            value={variance}
            onChange={(e) => setVariance(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Stop-and-go turbulence
          </div>
        </div>

        {/* Direction Entropy */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>Entropy (%)</span>
            <span className="font-mono text-purple-600 font-bold">{entropy}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={entropy}
            onChange={(e) => setEntropy(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            {entropy > 65 ? 'CHAOTIC' : entropy > 35 ? 'MODERATE' : 'UNIFORM'}
          </div>
        </div>

        {/* Exit Convergence */}
        <div>
          <div className="flex justify-between font-bold text-slate-700 mb-1">
            <span>Convergence (%)</span>
            <span className="font-mono text-cyan-600 font-bold">{convergence}%</span>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={convergence}
            onChange={(e) => setConvergence(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
            Toward Exit Gate
          </div>
        </div>
      </div>

      {/* Meta options & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center space-x-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Gate:</span>
            <input
              type="text"
              value={exitZone}
              onChange={(e) => setExitZone(e.target.value)}
              className="w-24 px-2 py-1 border border-slate-300 rounded font-semibold text-slate-800 bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Sensor ID:</span>
            <input
              type="text"
              value={sensorId}
              onChange={(e) => setSensorId(e.target.value)}
              className="w-36 px-2 py-1 border border-slate-300 rounded font-mono font-medium text-slate-800 bg-white"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded border border-slate-200">
            <button
              onClick={() => setMode('AI')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mode === 'AI' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              AI Mode
            </button>
            <button
              onClick={() => setMode('RULE')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                mode === 'RULE' ? 'bg-slate-900 text-white' : 'text-slate-600'
              }`}
            >
              Rule Mode
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSendSensorData}
            disabled={isProcessing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Processing...' : '⚡ Send to Backend Risk Engine'}</span>
          </button>

          <button
            onClick={toggleStreaming}
            className={`px-3.5 py-2 font-bold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition-all ${
              isStreaming
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isStreaming ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isStreaming ? 'Stop IoT Stream' : 'Live IoT Stream'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-md transition-all"
            title="Reset to scenario feed"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Real-Time Backend Calculation Output Inspector */}
      {lastResponse && (
        <div className="bg-slate-900 text-white rounded-lg p-4 font-mono text-xs shadow-md border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>BACKEND EVALUATION COMPLETE (HTTP 200)</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Latency: <strong className="text-white font-bold">{lastResponse.execution_latency_ms || 3.8}ms</strong> | Source: <strong className="text-white">{lastResponse.sensor_id}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300">
            <div>
              <span className="text-slate-400 text-[10px] block">COMPUTED RISK LEVEL</span>
              <div className="mt-1">
                <RiskBadge level={lastResponse.risk_level} score={lastResponse.risk_score} size="md" />
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">DENSITY / STATUS</span>
              <div className="text-sm font-bold text-white mt-1">
                {lastResponse.density_ppm2} p/m² <span className="text-xs text-slate-400 font-normal">({lastResponse.density_status})</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">TURBULENCE INDICATOR</span>
              <div className="text-sm font-bold text-white mt-1">
                {lastResponse.turbulence_pct}% <span className="text-xs text-slate-400 font-normal">(Density × σ²)</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 text-[10px] block">EXIT CONVERGENCE</span>
              <div className="text-sm font-bold text-white mt-1">
                {lastResponse.convergence_pct}% <span className="text-xs text-slate-400 font-normal">({lastResponse.convergence_msg.slice(0, 15)}...)</span>
              </div>
            </div>
          </div>

          {/* Natural language explainability */}
          <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-200 leading-relaxed font-sans text-xs">
            <strong className="text-amber-400 font-mono text-[11px] uppercase block mb-1">
              Backend Explainability Engine:
            </strong>
            "{lastResponse.explanation}"
          </div>
        </div>
      )}
    </div>
  );
};
