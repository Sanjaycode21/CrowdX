import { RiskCurrentData, RiskLevel } from '../types/crowd';

export type DemoScenario = 
  | 'Normal Crowd'
  | 'Increasing Density'
  | 'Sudden Movement'
  | 'Chaotic Movement'
  | 'Exit Convergence'
  | 'High-Risk Scenario';

export function generateSimulatedData(scenario: DemoScenario, mode: 'AI' | 'RULE' = 'AI'): RiskCurrentData {
  let baseCount = 240;
  let density = 0.96;
  let speed = 1.2;
  let accel = 0.1;
  let turb = 12.5;
  let entropy = 24.0;
  let conv = 15.0;
  let isPersisting = false;
  let elevatedSec = 0;
  let convMsg = "Normal flow distribution near Exit A";
  let explanation = "Crowd conditions are normal. Density, movement speed, and direction vectors are well within safety baselines.";

  switch (scenario) {
    case 'Normal Crowd':
      baseCount = 248 + Math.floor(Math.random() * 20 - 10);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 1.2;
      accel = 0.1;
      turb = 12.0;
      entropy = 22.0;
      conv = 14.0;
      break;

    case 'Increasing Density':
      baseCount = 680 + Math.floor(Math.random() * 40 - 20);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 1.0;
      accel = 0.2;
      turb = 38.0;
      entropy = 42.0;
      conv = 30.0;
      explanation = "Moderate risk level driven by slight increase in crowd density. Monitoring gate entry areas.";
      break;

    case 'Sudden Movement':
      baseCount = 520 + Math.floor(Math.random() * 30);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 2.9;
      accel = 1.6;
      turb = 62.0;
      entropy = 54.0;
      conv = 45.0;
      isPersisting = true;
      elevatedSec = 5;
      explanation = "Risk increased to HIGH because movement acceleration and speed exceeded scene baseline thresholds for 5 seconds.";
      break;

    case 'Chaotic Movement':
      baseCount = 840 + Math.floor(Math.random() * 40);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 2.4;
      accel = 1.1;
      turb = 78.0;
      entropy = 82.0;
      conv = 50.0;
      isPersisting = true;
      elevatedSec = 9;
      explanation = "Risk increased to HIGH because crowd turbulence and direction disorder exceeded baseline thresholds for 9 seconds.";
      break;

    case 'Exit Convergence':
      baseCount = 950 + Math.floor(Math.random() * 50);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 2.2;
      accel = 0.9;
      turb = 74.0;
      entropy = 68.0;
      conv = 88.0;
      isPersisting = true;
      elevatedSec = 11;
      convMsg = "High crowd convergence detected near Exit A";
      explanation = "Risk increased to HIGH because gate convergence and crowd density exceeded baseline thresholds for 11 seconds additionally with high crowd convergence detected near Exit A.";
      break;

    case 'High-Risk Scenario':
      baseCount = 1248 + Math.floor(Math.random() * 60);
      density = parseFloat((baseCount / 250).toFixed(2));
      speed = 3.2;
      accel = 2.1;
      turb = 86.0;
      entropy = 88.0;
      conv = 92.0;
      isPersisting = true;
      elevatedSec = 14;
      convMsg = "Critical crowd convergence detected near Exit A";
      explanation = "CRITICAL ALERT: Dangerous crowd pressure detected due to elevated crowd density, movement acceleration, and crowd turbulence for 14 seconds. Immediate operator action recommended.";
      break;
  }

  // Calculate score (0-100)
  const dNorm = Math.min(100, (density / 5.0) * 100);
  const aNorm = Math.min(100, (accel / 2.0) * 100);
  const scoreRaw = (dNorm * 0.30) + (aNorm * 0.20) + (turb * 0.20) + (entropy * 0.10) + (conv * 0.10);
  const score = Math.min(100, Math.max(0, Math.round((scoreRaw / 0.90) * 10) / 10));

  let level: RiskLevel = 'LOW';
  if (score <= 25) level = 'LOW';
  else if (score <= 50) level = 'MEDIUM';
  else if (score <= 75) level = 'HIGH';
  else level = 'CRITICAL';

  // Generate bounding boxes
  const boxes = [];
  const numBoxes = Math.min(35, Math.floor(baseCount / 25));
  for (let i = 0; i < numBoxes; i++) {
    boxes.push({
      id: i,
      x: 30 + Math.random() * 560,
      y: 40 + Math.random() * 280,
      w: 18 + Math.random() * 10,
      h: 34 + Math.random() * 18,
      confidence: parseFloat((0.75 + Math.random() * 0.20).toFixed(2)),
      class: mode === 'AI' ? 'person' : 'blob'
    });
  }

  // Generate vectors
  const vectors = [];
  for (let i = 0; i < 40; i++) {
    let dx = (Math.random() - 0.5) * 2;
    let dy = (Math.random() - 0.5) * 2;
    if (scenario === 'Exit Convergence') {
      dx = 2.5 + Math.random();
      dy = -1.5 - Math.random();
    }
    vectors.push({
      x: 40 + Math.random() * 560,
      y: 40 + Math.random() * 280,
      dx: parseFloat(dx.toFixed(2)),
      dy: parseFloat(dy.toFixed(2)),
      speed: parseFloat(Math.sqrt(dx * dx + dy * dy).toFixed(2))
    });
  }

  return {
    score,
    raw_score: score,
    level,
    is_persisting: isPersisting,
    elevated_duration_seconds: elevatedSec,
    factors: [
      { name: 'Crowd Density', score: Math.round(dNorm), weight_pct: 30, contribution: parseFloat((dNorm * 0.30).toFixed(1)), severity: dNorm > 75 ? 'critical' : dNorm > 55 ? 'high' : dNorm > 30 ? 'medium' : 'low' },
      { name: 'Movement Acceleration', score: Math.round(aNorm), weight_pct: 20, contribution: parseFloat((aNorm * 0.20).toFixed(1)), severity: aNorm > 75 ? 'critical' : aNorm > 55 ? 'high' : aNorm > 30 ? 'medium' : 'low' },
      { name: 'Crowd Turbulence', score: Math.round(turb), weight_pct: 20, contribution: parseFloat((turb * 0.20).toFixed(1)), severity: turb > 75 ? 'critical' : turb > 55 ? 'high' : turb > 30 ? 'medium' : 'low' },
      { name: 'Direction Disorder', score: Math.round(entropy), weight_pct: 10, contribution: parseFloat((entropy * 0.10).toFixed(1)), severity: entropy > 75 ? 'critical' : entropy > 55 ? 'high' : entropy > 30 ? 'medium' : 'low' },
      { name: 'Gate Convergence', score: Math.round(conv), weight_pct: 10, contribution: parseFloat((conv * 0.10).toFixed(1)), severity: conv > 75 ? 'critical' : conv > 55 ? 'high' : conv > 30 ? 'medium' : 'low' }
    ],
    explanation,
    people_count: baseCount,
    density_ppm2: density,
    speed_ms: speed,
    acceleration_ms2: accel,
    turbulence_pct: turb,
    direction_entropy_pct: entropy,
    direction_label: entropy > 65 ? 'CHAOTIC FLOW' : entropy > 35 ? 'MODERATE VARIATION' : 'UNIFORM FLOW',
    convergence_pct: conv,
    convergence_msg: convMsg,
    mode,
    boxes,
    vectors,
    fps: mode === 'AI' ? 29.4 : 46.2,
    confidence: mode === 'AI' ? 0.88 : 0.70,
    scenario
  };
}
