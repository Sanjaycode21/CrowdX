from typing import Dict, Any, List
from backend.config.config_manager import config_manager
from backend.risk_engine.temporal_smoothing import temporal_smoother
from backend.risk_engine.explainability import generate_risk_explanation

class RiskCalculator:
    """Computes weighted explainable risk score, contributing factor analysis, and applies temporal logic."""

    def __init__(self):
        pass

    def compute_risk(self, density_data: Dict[str, Any], motion_data: Dict[str, Any]) -> Dict[str, Any]:
        cfg = config_manager.get_config()
        weights = cfg.get("risk_weights", {
            "density": 0.30,
            "acceleration": 0.20,
            "turbulence": 0.20,
            "direction_entropy": 0.10,
            "convergence": 0.10,
            "persistence": 0.10
        })

        # 1. Normalize individual factor scores to 0 - 100%
        # Density norm (0 to 6.0 people/m2 mapped to 0-100)
        density_ppm2 = density_data.get("density_ppm2", 0.0)
        density_norm = min(100.0, (density_ppm2 / 5.0) * 100.0)

        # Acceleration norm (0 to 2.5 m/s2 mapped to 0-100)
        accel_ms2 = motion_data.get("acceleration_ms2", 0.0)
        accel_norm = min(100.0, (accel_ms2 / 2.0) * 100.0)

        # Turbulence norm (0 - 100%)
        turb_pct = motion_data.get("turbulence_pct", 0.0)

        # Direction entropy norm (0 - 100%)
        entropy_pct = motion_data.get("direction_entropy_pct", 0.0)

        # Exit Convergence norm (0 - 100%)
        conv_pct = motion_data.get("convergence_pct", 0.0)

        # Persistence raw score placeholder (evaluated during temporal step)
        pers_norm = 0.0

        # Weighted summation
        raw_score = (
            (density_norm * weights.get("density", 0.30)) +
            (accel_norm * weights.get("acceleration", 0.20)) +
            (turb_pct * weights.get("turbulence", 0.20)) +
            (entropy_pct * weights.get("direction_entropy", 0.10)) +
            (conv_pct * weights.get("convergence", 0.10))
        )
        # Normalize sum of non-persistence weights (0.90) to 1.0 base
        raw_score = (raw_score / 0.90) if sum(weights.values()) > 0 else raw_score
        raw_score = round(min(100.0, max(0.0, raw_score)), 1)

        # 2. Temporal Smoothing, Persistence, & Hysteresis
        smoothed_score, level, elevated_sec, is_persisting = temporal_smoother.smooth_and_evaluate_level(raw_score)

        # 3. Formulate Contributing Factors for Explainability
        factors = [
            {
                "name": "Crowd Density",
                "score": round(density_norm, 1),
                "weight_pct": int(weights.get("density", 0.30) * 100),
                "contribution": round(density_norm * weights.get("density", 0.30), 1),
                "severity": self._get_severity(density_norm)
            },
            {
                "name": "Movement Acceleration",
                "score": round(accel_norm, 1),
                "weight_pct": int(weights.get("acceleration", 0.20) * 100),
                "contribution": round(accel_norm * weights.get("acceleration", 0.20), 1),
                "severity": self._get_severity(accel_norm)
            },
            {
                "name": "Crowd Turbulence",
                "score": round(turb_pct, 1),
                "weight_pct": int(weights.get("turbulence", 0.20) * 100),
                "contribution": round(turb_pct * weights.get("turbulence", 0.20), 1),
                "severity": self._get_severity(turb_pct)
            },
            {
                "name": "Direction Disorder",
                "score": round(entropy_pct, 1),
                "weight_pct": int(weights.get("direction_entropy", 0.10) * 100),
                "contribution": round(entropy_pct * weights.get("direction_entropy", 0.10), 1),
                "severity": self._get_severity(entropy_pct)
            },
            {
                "name": "Gate Convergence",
                "score": round(conv_pct, 1),
                "weight_pct": int(weights.get("convergence", 0.10) * 100),
                "contribution": round(conv_pct * weights.get("convergence", 0.10), 1),
                "severity": self._get_severity(conv_pct)
            }
        ]

        # 4. Generate Natural Language Explanation
        explanation = generate_risk_explanation(level, factors, elevated_sec, motion_data.get("convergence_msg", ""))

        return {
            "score": smoothed_score,
            "raw_score": raw_score,
            "level": level,
            "is_persisting": is_persisting,
            "elevated_duration_seconds": elevated_sec,
            "factors": factors,
            "explanation": explanation
        }

    def _get_severity(self, score_norm: float) -> str:
        if score_norm < 30.0:
            return "low"
        elif score_norm < 60.0:
            return "medium"
        elif score_norm < 80.0:
            return "high"
        else:
            return "critical"

risk_calculator = RiskCalculator()
