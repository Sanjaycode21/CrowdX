from typing import Dict, Any, Tuple
from backend.config.config_manager import config_manager

class DensityAnalyzer:
    """Calculates crowd density, density status, and secondary motion-area fallback."""
    
    def __init__(self):
        pass

    def analyze_density(self, people_count: int, foreground_motion_ratio: float = 0.0) -> Dict[str, Any]:
        cfg = config_manager.get_config()
        roi_area = float(cfg.get("roi_area_sqm", 250.0))
        thresholds = cfg.get("density_thresholds", {"low": 1.0, "medium": 2.5, "high": 4.0, "critical": 5.5})

        # Calculate people/m^2
        density_val = round(people_count / max(roi_area, 1.0), 2)
        
        # Secondary fallback density estimate using motion area if people count is ambiguous/dense
        estimated_dense_people = int(people_count + (foreground_motion_ratio * 300))

        status = self._get_status(density_val, thresholds)

        return {
            "people_count": people_count,
            "estimated_dense_people": estimated_dense_people,
            "roi_area_sqm": roi_area,
            "density_ppm2": density_val,
            "status": status,
            "foreground_motion_ratio": foreground_motion_ratio
        }

    def _get_status(self, density: float, thresholds: Dict[str, float]) -> str:
        if density <= thresholds.get("low", 1.0):
            return "LOW"
        elif density <= thresholds.get("medium", 2.5):
            return "MEDIUM"
        elif density <= thresholds.get("high", 4.0):
            return "HIGH"
        else:
            return "CRITICAL"

density_analyzer = DensityAnalyzer()
