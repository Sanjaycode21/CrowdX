from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class HealthResponse(BaseModel):
    status: str
    mode: str
    fps: float
    timestamp: str

class FactorDetail(BaseModel):
    name: str
    score: float
    weight_pct: int
    contribution: float
    severity: str

class RiskCurrentResponse(BaseModel):
    score: float
    raw_score: float
    level: str
    is_persisting: bool
    elevated_duration_seconds: int
    factors: List[FactorDetail]
    explanation: str
    people_count: int
    density_ppm2: float
    speed_ms: float
    acceleration_ms2: float
    turbulence_pct: float
    direction_entropy_pct: float
    direction_label: str
    convergence_pct: float
    convergence_msg: str
    mode: str

class AlertItem(BaseModel):
    id: str
    timestamp: str
    level: str
    score: float
    location: str
    reason: str
    status: str
    duration_seconds: int
    acknowledged_by: Optional[str] = None

class IncidentCreateRequest(BaseModel):
    title: str
    location: str = "Gate B"
    risk_level: str
    risk_score: float
    detected_factors: List[str]
    operator_notes: Optional[str] = ""

class IncidentUpdateRequest(BaseModel):
    status: str
    operator_notes: Optional[str] = None

class ConfigUpdateRequest(BaseModel):
    roi_area_sqm: Optional[float] = None
    fps: Optional[float] = None
    detection_confidence: Optional[float] = None
    density_thresholds: Optional[Dict[str, float]] = None
    risk_weights: Optional[Dict[str, float]] = None
    temporal: Optional[Dict[str, float]] = None

class ScenarioChangeRequest(BaseModel):
    scenario: str # "Normal Crowd", "Increasing Density", "Sudden Movement", "Chaotic Movement", "Exit Convergence", "High-Risk Scenario"
    mode: Optional[str] = "AI" # "AI" or "RULE"
