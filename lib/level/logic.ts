// Day numbers of the 4 circuit workouts within each programme week
export const CIRCUIT_DAY_NUMBERS = [1, 3, 5, 6] as const;

// Sessions per week / "pass" — 3 so there's always a rest day between sessions
export const CIRCUITS_PER_PASS = 3;

// All 4 circuit workouts cycle in rotation regardless of pass size
const CIRCUIT_ROTATION = CIRCUIT_DAY_NUMBERS.length; // 4

export const TOTAL_LEVELS = 9;

// Level N requires N passes × 3 circuits each
export function circuitsRequiredForLevel(level: number): number {
  return level * CIRCUITS_PER_PASS;
}

// Total circuits in the whole programme: 3*(1+2+...+9) = 3*45 = 135
export function getTotalProgrammeCircuits(): number {
  let total = 0;
  for (let i = 1; i <= TOTAL_LEVELS; i++) total += circuitsRequiredForLevel(i);
  return total; // 135
}

// Which programme day to do next — cycles through all 4 workouts
export function getCurrentCircuitDayNumber(completedCircuitsThisLevel: number): number {
  const idx = completedCircuitsThisLevel % CIRCUIT_ROTATION;
  return CIRCUIT_DAY_NUMBERS[idx];
}

// Which pass through the 3-circuit week we're on (1-based)
export function getCurrentPassNumber(completedCircuitsThisLevel: number): number {
  return Math.floor(completedCircuitsThisLevel / CIRCUITS_PER_PASS) + 1;
}

// Which circuit within the current pass (1-based, 1–3)
export function getCircuitInPass(completedCircuitsThisLevel: number): number {
  return (completedCircuitsThisLevel % CIRCUITS_PER_PASS) + 1;
}

// Cumulative clean circuits completed across all levels
export function getTotalCompletedCircuits(currentLevel: number, completedCircuitsThisLevel: number): number {
  let total = 0;
  for (let i = 1; i < currentLevel; i++) total += circuitsRequiredForLevel(i);
  return total + completedCircuitsThisLevel;
}

export function getOverallProgressPercent(currentLevel: number, completedCircuitsThisLevel: number): number {
  const total = getTotalProgrammeCircuits();
  return Math.round((getTotalCompletedCircuits(currentLevel, completedCircuitsThisLevel) / total) * 100);
}

// Recalculate level + completedThisLevel from a raw clean-completion count
export function levelFromCleanCount(cleanCount: number): { level: number; completedCircuitsThisLevel: number } {
  let level = 1;
  let remaining = cleanCount;
  while (level <= TOTAL_LEVELS && remaining >= circuitsRequiredForLevel(level)) {
    remaining -= circuitsRequiredForLevel(level);
    level++;
  }
  return {
    level: Math.min(level, TOTAL_LEVELS),
    completedCircuitsThisLevel: remaining,
  };
}

// Walk target: Level N = N km
export function getWalkTargetKm(level: number): number {
  return Math.min(level, TOTAL_LEVELS);
}

// Approx walk duration in minutes at a comfortable 5 km/h
export function getWalkDurationMinutes(km: number): number {
  return Math.round((km / 5) * 60);
}
