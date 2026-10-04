export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FactorDetail {
  name: string;
  score: number;
  weight_pct: number;
  contribution: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface BoundingBox {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  confidence: number;
  class: string;
}

export interface MotionVector {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

export interface RiskCurrentData {
  score: number;
  raw_score: number;
  level: RiskLevel;
  is_persisting: boolean;
  elevated_duration_seconds: number;
  factors: FactorDetail[];
  explanation: string;
  people_count: number;
  density_ppm2: number;
  speed_ms: number;
  acceleration_ms2: number;
  turbulence_pct: number;
  direction_entropy_pct: number;
  direction_label: string;
  convergence_pct: number;
  convergence_msg: string;
  mode: 'AI' | 'RULE';
  boxes?: BoundingBox[];
  vectors?: MotionVector[];
  fps?: number;
  confidence?: number;
  scenario?: string;
}

export interface RiskHistoryItem {
  timestamp: string;
  score: number;
  level: RiskLevel;
  people_count: number;
  density: number;
  speed: number;
  acceleration: number;
  turbulence: number;
  direction_entropy: number;
  convergence: number;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  level: RiskLevel;
  score: number;
  location: string;
  reason: string;
  status: 'Active' | 'Acknowledged' | 'Escalated' | 'Resolved';
  duration_seconds: number;
  acknowledged_by?: string;
}

export interface IncidentTimelineItem {
  time: string;
  event: string;
  actor: string;
}

export interface IncidentItem {
  id: string;
  created_at: string;
  title: string;
  location: string;
  risk_level: RiskLevel;
  risk_score: number;
  detected_factors: string[];
  duration: string;
  operator_notes: string;
  status: 'Open' | 'Acknowledged' | 'Investigating' | 'Resolved';
  timeline?: IncidentTimelineItem[];
}

export interface ModeMetric {
  name: string;
  mae: number;
  precision: number;
  recall: number;
  false_alarm_rate: number;
  detection_latency_ms: number;
  fps: number;
}

export interface EvaluationMetrics {
  dataset_notice: string;
  ai_mode: ModeMetric;
  rule_mode: ModeMetric;
}

export interface ConfigData {
  version: string;
  roi_area_sqm: number;
  fps: number;
  frame_skip: number;
  detection_confidence: number;
  density_thresholds: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  risk_weights: {
    density: number;
    acceleration: number;
    turbulence: number;
    direction_entropy: number;
    convergence: number;
    persistence: number;
  };
  temporal: {
    window_size_seconds: number;
    persistence_duration_seconds: number;
    hysteresis_margin: number;
  };
}

export interface LogEntry {
  id: number;
  timestamp: string;
  iso_timestamp: string;
  module: string;
  event: string;
  severity: 'INFO' | 'WARNING' | 'ERROR';
  details: string;
}
