from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ONLINE"
    assert "mode" in data

def test_risk_current_endpoint():
    response = client.get("/api/risk/current")
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert "level" in data
    assert "factors" in data
    assert "explanation" in data

def test_alerts_endpoint():
    response = client.get("/api/alerts")
    assert response.status_code == 200
    alerts = response.json()
    assert isinstance(alerts, list)

def test_config_endpoint():
    response = client.get("/api/config")
    assert response.status_code == 200
    config = response.json()
    assert "roi_area_sqm" in config
    assert "risk_weights" in config

def test_metrics_endpoint():
    response = client.get("/api/metrics")
    assert response.status_code == 200
    metrics = response.json()
    assert "ai_mode" in metrics
    assert "rule_mode" in metrics
    assert "dataset_notice" in metrics
