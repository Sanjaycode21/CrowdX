import React from 'react';
import { AlertTriangle, Clock, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';
import { AlertItem } from '../types/crowd';

interface AlertBannerProps {
  alert: AlertItem;
  onAcknowledge: (id: string) => void;
  onEscalate: (id: string) => void;
  onViewLive: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onAcknowledge, onEscalate, onViewLive }) => {
  const isCritical = alert.level === 'CRITICAL';

  return (
    <div className={`p-4 rounded-lg border shadow-xs mb-6 transition-all ${
      isCritical 
        ? 'bg-red-50 border-red-300 text-red-900' 
        : 'bg-orange-50 border-orange-300 text-orange-900'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className={`p-2 rounded-md ${isCritical ? 'bg-red-600 text-white' : 'bg-orange-600 text-white'}`}>
            <AlertTriangle className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 text-xs font-extrabold rounded uppercase tracking-wider ${
                isCritical ? 'bg-red-200 text-red-900' : 'bg-orange-200 text-orange-900'
              }`}>
                ⚠ {alert.level} CROWD RISK ALERT
              </span>
              <span className="text-xs font-mono text-slate-600 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Detected at: {alert.timestamp} ({alert.duration_seconds}s)
              </span>
            </div>

            <h3 className="text-sm font-bold mt-1 text-slate-900 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              Location: {alert.location}
            </h3>

            <p className="text-xs mt-1 text-slate-700">
              <strong className="font-semibold">Reason:</strong> {alert.reason}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 self-end md:self-center">
          <button
            onClick={() => onAcknowledge(alert.id)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-800 text-xs font-bold rounded-md hover:bg-slate-100 shadow-2xs flex items-center gap-1.5 transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>ACKNOWLEDGE</span>
          </button>

          {isCritical ? (
            <button
              onClick={() => onEscalate(alert.id)}
              className="px-3.5 py-1.5 bg-red-700 text-white text-xs font-bold rounded-md hover:bg-red-800 shadow-xs flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ESCALATE</span>
            </button>
          ) : (
            <button
              onClick={onViewLive}
              className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-md hover:bg-slate-800 shadow-xs transition-all"
            >
              VIEW LIVE SCENE
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
