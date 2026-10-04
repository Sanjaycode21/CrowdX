import math
from typing import List, Dict, Tuple, Any

def detect_exit_convergence(
    vectors: List[Dict[str, float]], 
    exit_zone: Dict[str, float] = None, 
    frame_width: int = 640, 
    frame_height: int = 360
) -> Tuple[float, bool, str]:
    """
    Detects vector convergence toward a configured Exit/Gate zone.
    Returns (convergence_score 0-100%, is_converging_bool, description_text).
    """
    if exit_zone is None:
        # Default Exit A zone at top-right (e.g. x: 500-600, y: 30-100)
        exit_zone = {
            "name": "Exit A",
            "center_x": frame_width * 0.8,
            "center_y": frame_height * 0.2,
            "radius": 120.0
        }

    if not vectors:
        return 0.0, False, f"No movement toward {exit_zone.get('name', 'Exit A')}"

    cx = exit_zone.get("center_x", frame_width * 0.8)
    cy = exit_zone.get("center_y", frame_height * 0.2)

    converging_count = 0
    total = len(vectors)

    for v in vectors:
        vx, vy = v["x"], v["y"]
        dx, dy = v["dx"], v["dy"]

        # Vector pointing from (vx, vy) in direction (dx, dy)
        # Vector to exit center
        to_exit_x = cx - vx
        to_exit_y = cy - vy
        dist_to_exit = math.sqrt(to_exit_x**2 + to_exit_y**2)

        if dist_to_exit < 15: # already inside exit
            continue

        # Cosine similarity between velocity vector and vector pointing to exit center
        v_mag = math.sqrt(dx**2 + dy**2)
        if v_mag == 0:
            continue

        dot_prod = (dx * to_exit_x + dy * to_exit_y) / (v_mag * dist_to_exit)

        # High positive dot product (> 0.6) means vector points directly toward exit
        if dot_prod > 0.6:
            converging_count += 1

    ratio = converging_count / max(total, 1)
    convergence_pct = round(min(100.0, ratio * 140.0), 1)
    is_converging = convergence_pct >= 50.0

    zone_name = exit_zone.get("name", "Exit A")
    if is_converging:
        msg = f"High crowd convergence detected near {zone_name}"
    else:
        msg = f"Normal flow distribution near {zone_name}"

    return convergence_pct, is_converging, msg
