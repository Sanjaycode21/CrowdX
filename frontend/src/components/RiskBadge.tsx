import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle, Zap } from 'lucide-react';
import { RiskLevel } from '../types/crowd';

interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, score, size = 'md', showIcon = true }) => {
  const getStyles = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          icon: ShieldCheck,
          label: 'LOW RISK'
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-600',
          icon: AlertCircle,
          label: 'MEDIUM RISK'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50 text-orange-800 border-orange-300',
          dot: 'bg-orange-600 animate-pulse',
          icon: AlertTriangle,
          label: 'HIGH RISK'
        };
      case 'CRITICAL':
        return {
          bg: 'bg-red-50 text-red-800 border-red-400 font-bold',
          dot: 'bg-red-600 animate-ping',
          icon: Zap,
          label: 'CRITICAL RISK'
        };
    }
  };

  const style = getStyles();
  const Icon = style.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-3 py-1 text-sm gap-1.5',
    lg: 'px-4 py-2 text-base gap-2 font-bold'
  };

  return (
    <div className={`inline-flex items-center rounded-md border font-semibold tracking-wide ${style.bg} ${sizeClasses[size]}`}>
      {showIcon && <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />}
      <span>{style.label}</span>
      {score !== undefined && (
        <span className="ml-1 opacity-90 font-mono">
          ({score}/100)
        </span>
      )}
    </div>
  );
};
