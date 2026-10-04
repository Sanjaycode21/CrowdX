def compute_turbulence(density_ppm2: float, velocity_variance: float) -> float:
    """
    Calculates crowd turbulence indicator (0.0 to 100.0%) based on Density x Velocity Variance.
    Represents chaotic, stop-and-go movement.
    """
    # Raw index: density * variance
    raw_index = density_ppm2 * velocity_variance
    # Scale to 0-100% normalized range
    # 5.0 raw index roughly maps to 100%
    normalized = min(100.0, (raw_index / 4.5) * 100.0)
    return round(float(normalized), 1)
