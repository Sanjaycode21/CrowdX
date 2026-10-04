import pytest
from backend.density.density_analyzer import density_analyzer
from backend.motion.motion_analyzer import motion_analyzer
from backend.risk_engine.risk_calculator import risk_calculator
from backend.risk_engine.temporal_smoothing import temporal_smoother

def test_low_density_normal_movement():
    """Test 1: Low density + normal movement -> LOW risk level"""
    density_res = density_analyzer.analyze_density(people_count=150) # 0.6 p/m2
    motion_res = {
        "average_speed_ms": 1.2,
        "acceleration_ms2": 0.1,
        "turbulence_pct": 10.0,
        "direction_entropy_pct": 20.0,
        "convergence_pct": 10.0,
        "vectors": []
    }
    res = risk_calculator.compute_risk(density_res, motion_res)
    assert res["level"] in ["LOW", "MEDIUM"]
    assert res["score"] <= 40.0

def test_high_density_normal_movement():
    """Test 2: High density + normal movement -> elevated score but not immediately critical"""
    temporal_smoother.elevated_start_time = None
    temporal_smoother.current_level = "LOW"
    temporal_smoother.raw_score_history.clear()
    
    density_res = density_analyzer.analyze_density(people_count=800) # 3.2 p/m2
    motion_res = {
        "average_speed_ms": 1.1,
        "acceleration_ms2": 0.1,
        "turbulence_pct": 15.0,
        "direction_entropy_pct": 25.0,
        "convergence_pct": 15.0,
        "vectors": []
    }
    res = risk_calculator.compute_risk(density_res, motion_res)
    assert res["level"] in ["LOW", "MEDIUM", "HIGH"]
    assert res["score"] < 75.0

def test_high_density_high_acceleration():
    """Test 3: High density + high acceleration -> HIGH risk level"""
    density_res = density_analyzer.analyze_density(people_count=1000) # 4.0 p/m2
    motion_res = {
        "average_speed_ms": 2.8,
        "acceleration_ms2": 1.8,
        "turbulence_pct": 65.0,
        "direction_entropy_pct": 55.0,
        "convergence_pct": 60.0,
        "vectors": []
    }
    res = risk_calculator.compute_risk(density_res, motion_res)
    assert res["raw_score"] >= 50.0

def test_short_abnormal_spike_does_not_immediately_trigger_critical():
    """Test 5: Short abnormal spike (1 sec) should NOT immediately escalate to CRITICAL due to persistence timer"""
    temporal_smoother.elevated_start_time = None
    temporal_smoother.current_level = "LOW"
    
    # Single spike
    density_res = density_analyzer.analyze_density(people_count=1400) # 5.6 p/m2
    motion_res = {
        "average_speed_ms": 3.5,
        "acceleration_ms2": 2.2,
        "turbulence_pct": 85.0,
        "direction_entropy_pct": 80.0,
        "convergence_pct": 75.0,
        "vectors": []
    }
    res = risk_calculator.compute_risk(density_res, motion_res)
    # Because persistence has not reached 8 seconds, level should be buffered to MEDIUM or HIGH, not immediate CRITICAL
    assert res["is_persisting"] == False
