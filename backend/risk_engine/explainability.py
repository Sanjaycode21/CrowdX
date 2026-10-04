from typing import List, Dict, Any

def generate_risk_explanation(level: str, factors: List[Dict[str, Any]], persistence_sec: int, convergence_msg: str) -> str:
    """Generates clear, natural language explanation of WHY the current risk level exists."""
    if level == "LOW":
        return "Crowd conditions are normal. Density, movement speed, and direction vectors are well within safety baselines."

    # Identify top elevated factors
    top_factors = [f for f in factors if f.get("severity") in ["high", "critical"]]
    if not top_factors:
        top_factors = sorted(factors, key=lambda x: x.get("contribution", 0), reverse=True)[:2]

    names = [f["name"].lower() for f in top_factors]
    
    if len(names) == 1:
        factor_str = names[0]
    elif len(names) == 2:
        factor_str = f"{names[0]} and {names[1]}"
    else:
        factor_str = f"{names[0]}, {names[1]}, and {names[2]}"

    pers_str = f" for {persistence_sec} seconds" if persistence_sec > 0 else ""
    conv_str = f" additionally with {convergence_msg.lower()}" if "Exit" in convergence_msg and "High" in convergence_msg else ""

    if level == "CRITICAL":
        return f"CRITICAL ALERT: Dangerous crowd pressure detected due to elevated {factor_str}{pers_str}{conv_str}. Immediate operator action recommended."
    elif level == "HIGH":
        return f"Risk increased to HIGH because {factor_str} exceeded scene baseline thresholds{pers_str}{conv_str}."
    else: # MEDIUM
        return f"Moderate risk level driven by slight increase in {factor_str}. Monitoring crowd flow dynamics."
