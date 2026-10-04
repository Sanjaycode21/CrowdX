import collections
from typing import Dict, List, Any, Tuple
from backend.motion.optical_flow import compute_simulated_motion_vectors
from backend.motion.turbulence import compute_turbulence
from backend.motion.direction_entropy import compute_direction_entropy
from backend.motion.convergence import detect_exit_convergence

class MotionAnalyzer:
    """Combines optical flow speed, acceleration, baseline tracking, turbulence, direction disorder, and exit convergence."""

    def __init__(self):
        # Sliding buffer for tracking baseline speed (last 30 samples)
        self.speed_history = collections.deque(maxlen=30)
        self.last_speed = 1.2

    def analyze_motion(
        self, 
        scenario: str = "Normal Crowd", 
        density_ppm2: float = 1.0, 
        exit_zone: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        
        # 1. Optical flow vectors & speed statistics
        vectors, current_speed, speed_var = compute_simulated_motion_vectors(scenario)
        
        # Update baseline speed history
        self.speed_history.append(current_speed)
        baseline_speed = round(sum(self.speed_history) / len(self.speed_history), 2)

        # 2. Acceleration calculation (current_speed - last_speed)
        speed_delta = round(current_speed - self.last_speed, 2)
        acceleration = round(max(0.0, speed_delta * 1.5), 2) # m/s^2 equivalent
        self.last_speed = current_speed

        # 3. Crowd Turbulence
        turbulence_pct = compute_turbulence(density_ppm2, speed_var)

        # 4. Direction Entropy
        entropy_pct, direction_label = compute_direction_entropy(vectors)

        # 5. Exit Zone Convergence
        convergence_pct, is_converging, convergence_msg = detect_exit_convergence(vectors, exit_zone)

        return {
            "vectors": vectors,
            "average_speed_ms": current_speed,
            "baseline_speed_ms": baseline_speed,
            "speed_delta": speed_delta,
            "acceleration_ms2": acceleration,
            "velocity_variance": speed_var,
            "turbulence_pct": turbulence_pct,
            "direction_entropy_pct": entropy_pct,
            "direction_label": direction_label,
            "convergence_pct": convergence_pct,
            "is_converging": is_converging,
            "convergence_msg": convergence_msg
        }

motion_analyzer = MotionAnalyzer()
