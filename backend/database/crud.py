import uuid
import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from .models import AlertDB, IncidentDB, RiskMeasurementDB

def create_alert(db: Session, level: str, score: float, location: str, reason: str, duration_seconds: int = 0) -> AlertDB:
    alert_id = f"ALT-{uuid.uuid4().hex[:6].upper()}"
    timestamp = datetime.datetime.now().strftime("%H:%M:%S")
    alert = AlertDB(
        id=alert_id,
        timestamp=timestamp,
        level=level,
        score=score,
        location=location,
        reason=reason,
        status="Active",
        duration_seconds=duration_seconds
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    return alert

def get_alerts(db: Session, level_filter: Optional[str] = None) -> List[AlertDB]:
    query = db.query(AlertDB)
    if level_filter and level_filter.upper() != "ALL":
        query = query.filter(AlertDB.level == level_filter.upper())
    return query.order_by(AlertDB.id.desc()).all()

def acknowledge_alert(db: Session, alert_id: str, operator_name: str = "Operator 1") -> Optional[AlertDB]:
    alert = db.query(AlertDB).filter(AlertDB.id == alert_id).first()
    if alert:
        alert.status = "Acknowledged"
        alert.acknowledged_by = operator_name
        db.commit()
        db.refresh(alert)
    return alert

def escalate_alert(db: Session, alert_id: str) -> Optional[AlertDB]:
    alert = db.query(AlertDB).filter(AlertDB.id == alert_id).first()
    if alert:
        alert.status = "Escalated"
        db.commit()
        db.refresh(alert)
    return alert

def create_incident(db: Session, title: str, location: str, risk_level: str, risk_score: float, detected_factors: List[str], operator_notes: str = "") -> IncidentDB:
    incident_id = f"INC-{uuid.uuid4().hex[:6].upper()}"
    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    time_only = datetime.datetime.now().strftime("%H:%M:%S")
    
    timeline = [
        {"time": time_only, "event": "Incident created from active alert", "actor": "System"}
    ]
    
    incident = IncidentDB(
        id=incident_id,
        created_at=now_str,
        title=title,
        location=location,
        risk_level=risk_level,
        risk_score=risk_score,
        detected_factors=detected_factors,
        duration="Active",
        operator_notes=operator_notes,
        status="Open",
        timeline=timeline
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

def update_incident_status(db: Session, incident_id: str, new_status: str, notes: Optional[str] = None, actor: str = "Operator 1") -> Optional[IncidentDB]:
    incident = db.query(IncidentDB).filter(IncidentDB.id == incident_id).first()
    if incident:
        time_only = datetime.datetime.now().strftime("%H:%M:%S")
        timeline = incident.timeline or []
        timeline.append({"time": time_only, "event": f"Status changed to {new_status}", "actor": actor})
        
        incident.status = new_status
        incident.timeline = timeline
        if notes is not None:
            incident.operator_notes = notes
        db.commit()
        db.refresh(incident)
    return incident

def get_incidents(db: Session) -> List[IncidentDB]:
    return db.query(IncidentDB).order_by(IncidentDB.id.desc()).all()
