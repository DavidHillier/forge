// Day numbers of circuit workouts within each programme week
export const CIRCUIT_DAY_NUMBERS = [1, 3, 5, 6] as const;
export const CIRCUITS_PER_PASS = 4;
export const TOTAL_LEVELS = 9;

// Level N requires N full passes through the 4 circuits
export function circuitsRequiredForLevel(level: number): number {
  return level * CIRCUITS_PER_PASS;
}

// Total circuits in the entire programme: 4*(1+2+...+9) = 180
export function getTotalProgrammeCircuits(): number {
  let total = 0;
  for (let i = 1; i <= TOTAL_LEVELS; i++) total += circuitsRequiredForLevel(i);
  return total; // 180
}

// Which programme day to do next (cycles every 4)
export function getCurrentCircuitDayNumber(completedCircuitsThisLevel: number): number {
  const idx = completedCircuitsThisLevel % CIRCUITS_PER_PASS;
  return CIRCUIT_DAY_NUMBERS[idx];
}

// Which pass through the 4 circuits we're on (1-based)
export function getCurrentPassNumber(completedCircuitsThisLevel: number): number {
  return Math.floor(completedCircuitsThisLevel / CIRCUITS_PER_PASS) + 1;
}

// Which circuit within the current pass (1-based)
export function getCircuitInPass(completedCircuitsThisLevel: number): number {
  return (completedCircuitsThisLevel % CIRCUITS_PER_PASS) + 1;
}

// Cumulative circuits completed across all levels
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
// (used when deleting a session)
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
