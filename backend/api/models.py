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

class SensorDataInput(BaseModel):
    people_count: int = Field(..., ge=0, description="Estimated or detected count of people in the area")
    average_speed_ms: float = Field(..., ge=0.0, description="Average crowd movement speed in meters/second")
    acceleration_ms2: float = Field(0.0, ge=0.0, description="Crowd movement acceleration in m/s^2")
    velocity_variance: float = Field(0.5, ge=0.0, description="Variance in crowd velocity (m^2/s^2)")
    direction_entropy_pct: float = Field(20.0, ge=0.0, le=100.0, description="Shannon direction entropy percentage (0-100%)")
    convergence_pct: float = Field(15.0, ge=0.0, le=100.0, description="Percentage of vectors converging toward exit zone")
    exit_zone_name: Optional[str] = Field("Exit A", description="Name of the exit or gate zone being monitored")
    roi_area_sqm: Optional[float] = Field(None, gt=0.0, description="Custom ROI area in square meters (default 250m2)")
    sensor_id: Optional[str] = Field("SENSOR-NODE-01", description="Identifier of the transmitting sensor device")
    mode: Optional[str] = Field("AI", description="Analysis mode: AI or RULE")

class SensorProcessResponse(BaseModel):
    status: str
    timestamp: str
    sensor_id: str
    people_count: int
    roi_area_sqm: float
    density_ppm2: float
    density_status: str
    speed_ms: float
    acceleration_ms2: float
    velocity_variance: float
    turbulence_pct: float
    direction_entropy_pct: float
    direction_label: str
    convergence_pct: float
    convergence_msg: str
    risk_score: float
    raw_risk_score: float
    risk_level: str
    is_persisting: bool
    elevated_duration_seconds: int
    factors: List[FactorDetail]
    explanation: str
    alert_triggered: bool
    alert_id: Optional[str] = None
    mode: str

