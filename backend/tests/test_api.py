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

def test_sensor_sample_endpoint():
    response = client.get("/api/sensor/sample")
    assert response.status_code == 200
    data = response.json()
    assert "normal_flow" in data
    assert "critical_stampede_precursor" in data

def test_sensor_ingest_normal_data():
    payload = {
        "people_count": 200,
        "average_speed_ms": 1.2,
        "acceleration_ms2": 0.1,
        "velocity_variance": 0.3,
        "direction_entropy_pct": 20.0,
        "convergence_pct": 10.0,
        "exit_zone_name": "Gate A",
        "sensor_id": "TEST-SENSOR-01",
        "mode": "AI"
    }
    response = client.post("/api/sensor/ingest", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    assert res["people_count"] == 200
    assert res["density_ppm2"] == 0.8 # 200 / 250
    assert res["risk_level"] in ["LOW", "MEDIUM"]
    assert "explanation" in res

def test_sensor_ingest_critical_data_triggers_alert():
    payload = {
        "people_count": 1400,
        "average_speed_ms": 3.8,
        "acceleration_ms2": 2.6,
        "velocity_variance": 4.5,
        "direction_entropy_pct": 90.0,
        "convergence_pct": 95.0,
        "exit_zone_name": "Exit A",
        "sensor_id": "TEST-CRITICAL-SENSOR",
        "mode": "AI"
    }
    response = client.post("/api/sensor/ingest", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["status"] == "SUCCESS"
    assert res["raw_risk_score"] >= 70.0
    assert len(res["factors"]) == 5
    # Risk current should now return this sensor reading
    cur_res = client.get("/api/risk/current")
    assert cur_res.status_code == 200
    assert cur_res.json()["people_count"] == 1400

def test_sensor_reset():
    response = client.post("/api/sensor/reset")
    assert response.status_code == 200
    data = response.json()
    assert data["state"]["source_type"] == "scenario"

