import time
import collections
from typing import List, Dict, Any, Tuple
from backend.config.config_manager import config_manager

class TemporalSmoother:
    """Implements exponential moving average, condition persistence timer, and hysteresis state transition logic."""
    
    def __init__(self):
        self.raw_score_history = collections.deque(maxlen=10) # ~5-10 frames window
        self.smoothed_score = 15.0
        self.current_level = "LOW"
        self.elevated_start_time = None
        self.persistence_duration = 8.0 # seconds required before escalating to HIGH/CRITICAL

    def smooth_and_evaluate_level(self, raw_score: float) -> Tuple[float, str, int, bool]:
        """
        Returns (smoothed_score, risk_level, elevated_duration_sec, is_persisting)
        """
        cfg = config_manager.get_config()
        temporal_cfg = cfg.get("temporal", {})
        persistence_thresh = temporal_cfg.get("persistence_duration_seconds", 8.0)
        hysteresis_margin = temporal_cfg.get("hysteresis_margin", 5.0)

        # 1. Moving Average Smoothing
        self.raw_score_history.append(raw_score)
        ma_score = sum(self.raw_score_history) / len(self.raw_score_history)
        
        # Exponential smoothing (α = 0.3)
        self.smoothed_score = round(0.3 * raw_score + 0.7 * ma_score, 1)

        # Determine raw target level based on bounds
        raw_target_level = self._score_to_level(self.smoothed_score)

        now = time.time()
        
        # 2. Persistence Check
        if raw_target_level in ["HIGH", "CRITICAL"]:
            if self.elevated_start_time is None:
                self.elevated_start_time = now
            elevated_duration = int(now - self.elevated_start_time)
            is_persisting = elevated_duration >= persistence_thresh
        else:
            self.elevated_start_time = None
            elevated_duration = 0
            is_persisting = False

        # 3. Hysteresis State Transition Logic
        new_level = self._apply_hysteresis(self.smoothed_score, raw_target_level, is_persisting, hysteresis_margin)
        self.current_level = new_level

        return self.smoothed_score, new_level, elevated_duration, is_persisting

    def _score_to_level(self, score: float) -> str:
        if score <= 25.0:
            return "LOW"
        elif score <= 50.0:
            return "MEDIUM"
        elif score <= 75.0:
            return "HIGH"
        else:
            return "CRITICAL"

    def _apply_hysteresis(self, score: float, target_level: str, is_persisting: bool, hysteresis_margin: float) -> str:
        curr = self.current_level

        # Escalation rules
        if target_level == "CRITICAL":
            if is_persisting:
                return "CRITICAL"
            # Elevate to HIGH while persistence timer verifies condition duration
            return "HIGH"
        elif target_level == "HIGH":
            if curr in ["LOW", "MEDIUM"]:
                return "HIGH" if is_persisting else "MEDIUM"
            return curr if curr == "CRITICAL" and score > (76 - hysteresis_margin) else "HIGH"
        elif target_level == "MEDIUM":
            if curr == "LOW":
                return "MEDIUM"
            elif curr in ["HIGH", "CRITICAL"]:
                # De-escalate only if score drops significantly below 51 - hysteresis_margin
                if score < (51 - hysteresis_margin):
                    return "MEDIUM"
                return curr
            return "MEDIUM"
        else: # target LOW
            if curr != "LOW":
                if score < (26 - hysteresis_margin):
                    return "LOW"
                return curr
            return "LOW"

temporal_smoother = TemporalSmoother()
