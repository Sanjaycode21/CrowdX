import React, { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, Settings, Activity, Clock, Layers } from 'lucide-react';

interface TopBarProps {
  mode: 'AI' | 'RULE';
  onToggleMode: (newMode: 'AI' | 'RULE') => void;
  fps: number;
  onOpenSettings: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ mode, onToggleMode, fps, onOpenSettings }) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-ops-surface border-b border-ops-border px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm select-none">
      {/* Left branding */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-md bg-slate-900 flex items-center justify-center text-white shadow-sm">
          <ShieldAlert className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-base font-bold text-slate-900 leading-tight tracking-tight flex items-center gap-2">
            CrowdGuard
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
              Ops Center
            </span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">AI Crowd Safety & Early-Warning System</p>
        </div>
      </div>

      {/* Center & Right Status Information */}
      <div className="flex items-center space-x-6 text-xs">
        {/* System Status */}
        <div className="flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>System Status: <strong className="font-semibold">ONLINE</strong></span>
        </div>

        {/* Live Clock */}
        <div className="flex items-center space-x-1.5 text-slate-600 font-mono font-medium bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentTime || '10:37:24'}</span>
        </div>

        {/* FPS Indicator */}
        <div className="flex items-center space-x-1.5 text-slate-600 font-medium bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span>FPS: <strong className="font-mono text-slate-800">{fps.toFixed(1)}</strong></span>
        </div>

        {/* Mode Switcher Button */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200">
          <button
            onClick={() => onToggleMode('AI')}
            className={`flex items-center gap-1 px-3 py-1 rounded font-semibold transition-all ${
              mode === 'AI' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Mode</span>
          </button>

          <button
            onClick={() => onToggleMode('RULE')}
            className={`flex items-center gap-1 px-3 py-1 rounded font-semibold transition-all ${
              mode === 'RULE' 
                ? 'bg-slate-900 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Rule Mode</span>
          </button>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all"
          title="Configuration Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
