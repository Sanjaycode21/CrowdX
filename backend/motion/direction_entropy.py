import math
import numpy as np
from typing import List, Dict, Tuple

def compute_direction_entropy(vectors: List[Dict[str, float]], num_bins: int = 8) -> Tuple[float, str]:
    """
    Computes Shannon direction entropy of optical flow vectors (0.0 to 100.0%).
    Returns (entropy_percentage, classification_label).
    Classification labels: UNIFORM FLOW, MODERATE VARIATION, CHAOTIC FLOW
    """
    if not vectors:
        return 0.0, "UNIFORM FLOW"

    angles = []
    for v in vectors:
        dx, dy = v.get("dx", 0.0), v.get("dy", 0.0)
        if dx == 0 and dy == 0:
            continue
        angle = math.atan2(dy, dx) # -pi to pi
        if angle < 0:
            angle += 2 * math.pi
        angles.append(angle)

    if not angles:
        return 0.0, "UNIFORM FLOW"

    # Bin histogram
    counts, _ = np.histogram(angles, bins=num_bins, range=(0, 2 * math.pi))
    total = sum(counts)
    if total == 0:
        return 0.0, "UNIFORM FLOW"

    probabilities = counts / total
    entropy = 0.0
    for p in probabilities:
        if p > 0:
            entropy -= p * math.log2(p)

    max_entropy = math.log2(num_bins)
    normalized_entropy = (entropy / max_entropy) * 100.0 if max_entropy > 0 else 0.0
    entropy_pct = round(float(normalized_entropy), 1)

    if entropy_pct < 35.0:
        label = "UNIFORM FLOW"
    elif entropy_pct < 65.0:
        label = "MODERATE VARIATION"
    else:
        label = "CHAOTIC FLOW"

    return entropy_pct, label
