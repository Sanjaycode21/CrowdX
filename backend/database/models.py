import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON, ForeignKey
from .db import Base

class OperatorDB(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    role = Column(String, default="Operator")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class RiskMeasurementDB(Base):
    __tablename__ = "risk_measurements"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    score = Column(Float, nullable=False)
    level = Column(String, nullable=False)
    people_count = Column(Integer, nullable=False)
    density = Column(Float, nullable=False)
    speed = Column(Float, nullable=False)
    acceleration = Column(Float, nullable=False)
    turbulence = Column(Float, nullable=False)
    direction_entropy = Column(Float, nullable=False)
    convergence = Column(Float, nullable=False)
    mode = Column(String, default="AI")
    factors = Column(JSON, nullable=True)

class AlertDB(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, nullable=False)
    level = Column(String, nullable=False)
    score = Column(Float, nullable=False)
    location = Column(String, default="Gate B")
    reason = Column(String, nullable=False)
    status = Column(String, default="Active") # Active, Acknowledged, Escalated, Resolved
    duration_seconds = Column(Integer, default=0)
    acknowledged_by = Column(String, nullable=True)

class IncidentDB(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    created_at = Column(String, nullable=False)
    title = Column(String, nullable=False)
    location = Column(String, default="Gate B")
    risk_level = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)
    detected_factors = Column(JSON, nullable=True)
    duration = Column(String, default="0s")
    operator_notes = Column(Text, default="")
    status = Column(String, default="Open") # Open, Acknowledged, Investigating, Resolved
    timeline = Column(JSON, nullable=True)
