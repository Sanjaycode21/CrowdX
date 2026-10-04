import math
import numpy as np
from typing import List, Dict, Tuple, Any

def compute_simulated_motion_vectors(scenario: str, frame_width: int = 640, frame_height: int = 360, num_vectors: int = 40) -> Tuple[List[Dict[str, float]], float, float]:
    """Generates optical flow motion vectors (dx, dy) for live visualization and metric extraction."""
    vectors = []
    total_speed = 0.0
    speeds = []
    
    np.random.seed(int(np.random.rand() * 1000))
    
    for _ in range(num_vectors):
        x = float(np.random.uniform(50, frame_width - 50))
        y = float(np.random.uniform(50, frame_height - 50))
        
        if scenario == "Normal Crowd":
            dx = float(np.random.normal(1.2, 0.4))
            dy = float(np.random.normal(0.2, 0.3))
        elif scenario == "Increasing Density":
            dx = float(np.random.normal(0.8, 0.5))
            dy = float(np.random.normal(0.5, 0.4))
        elif scenario == "Sudden Movement":
            dx = float(np.random.normal(3.5, 0.8))
            dy = float(np.random.normal(1.1, 0.6))
        elif scenario == "Chaotic Movement":
            # Multi-directional random chaos
            angle = float(np.random.uniform(0, 2 * math.pi))
            mag = float(np.random.uniform(2.0, 5.0))
            dx = mag * math.cos(angle)
            dy = mag * math.sin(angle)
        elif scenario == "Exit Convergence":
            # Vectors pointing toward Exit A at (frame_width * 0.8, frame_height * 0.2)
            exit_x, exit_y = frame_width * 0.8, frame_height * 0.2
            angle = math.atan2(exit_y - y, exit_x - x)
            mag = float(np.random.uniform(2.5, 4.0))
            dx = mag * math.cos(angle) + np.random.normal(0, 0.2)
            dy = mag * math.sin(angle) + np.random.normal(0, 0.2)
        elif scenario == "High-Risk Scenario":
            angle = float(np.random.uniform(0, 2 * math.pi))
            mag = float(np.random.uniform(3.5, 6.0))
            dx = mag * math.cos(angle)
            dy = mag * math.sin(angle)
        else:
            dx = float(np.random.normal(1.0, 0.3))
            dy = float(np.random.normal(0.1, 0.2))
            
        speed = math.sqrt(dx * dx + dy * dy)
        speeds.append(speed)
        total_speed += speed
        
        vectors.append({
            "x": round(x, 1),
            "y": round(y, 1),
            "dx": round(dx, 2),
            "dy": round(dy, 2),
            "speed": round(speed, 2)
        })

    avg_speed = round(float(np.mean(speeds)), 2) if speeds else 0.0
    speed_var = round(float(np.var(speeds)), 2) if speeds else 0.0
    return vectors, avg_speed, speed_var
