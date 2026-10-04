import os
import yaml
from typing import Dict, Any

DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "risk_config.yaml")

class ConfigManager:
    """Manages system configuration loading, validation, and dynamic runtime updates."""
    
    def __init__(self, config_path: str = DEFAULT_CONFIG_PATH):
        self.config_path = config_path
        self._config: Dict[str, Any] = {}
        self.load_config()

    def load_config(self) -> Dict[str, Any]:
        if os.path.exists(self.config_path):
            with open(self.config_path, "r", encoding="utf-8") as f:
                self._config = yaml.safe_load(f) or {}
        else:
            self._config = self._get_default_fallback()
            self.save_config()
        return self._config

    def save_config(self) -> None:
        os.makedirs(os.path.dirname(self.config_path), exist_ok=True)
        with open(self.config_path, "w", encoding="utf-8") as f:
            yaml.dump(self._config, f, default_flow_style=False)

    def get_config(self) -> Dict[str, Any]:
        return self._config

    def update_config(self, new_config: Dict[str, Any]) -> Dict[str, Any]:
        """Deep update and save configuration."""
        self._update_dict_recursive(self._config, new_config)
        self.save_config()
        return self._config

    def _update_dict_recursive(self, target: Dict[str, Any], updates: Dict[str, Any]) -> None:
        for key, value in updates.items():
            if isinstance(value, dict) and key in target and isinstance(target[key], dict):
                self._update_dict_recursive(target[key], value)
            else:
                target[key] = value

    def _get_default_fallback(self) -> Dict[str, Any]:
        return {
            "version": "1.0",
            "roi_area_sqm": 250.0,
            "fps": 15.0,
            "frame_skip": 1,
            "detection_confidence": 0.50,
            "density_thresholds": {"low": 1.0, "medium": 2.5, "high": 4.0, "critical": 5.5},
            "risk_weights": {
                "density": 0.30,
                "acceleration": 0.20,
                "turbulence": 0.20,
                "direction_entropy": 0.10,
                "convergence": 0.10,
                "persistence": 0.10
            },
            "risk_level_bounds": {
                "low": [0, 25],
                "medium": [26, 50],
                "high": [51, 75],
                "critical": [76, 100]
            },
            "temporal": {
                "window_size_seconds": 5.0,
                "persistence_duration_seconds": 8.0,
                "hysteresis_margin": 5.0
            },
            "baseline_movement": {
                "average_speed": 1.2,
                "max_speed": 3.5,
                "normal_acceleration_max": 0.5
            }
        }

# Global singleton instance
config_manager = ConfigManager()
