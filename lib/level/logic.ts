import { determineCircuitCount } from "@/lib/programme/programme";

// Day numbers of circuit workouts within each week of the programme
export const CIRCUIT_DAY_NUMBERS = [1, 3, 5, 6] as const;

// 9 levels (matching programme weeks), 4 circuits each = 36 total
export const TOTAL_LEVELS = 9;
export const CIRCUITS_PER_LEVEL = 4;
export const TOTAL_CIRCUITS = TOTAL_LEVELS * CIRCUITS_PER_LEVEL;

export function getCurrentCircuitDayNumber(completedCircuitsThisLevel: number): number {
  const idx = Math.min(completedCircuitsThisLevel, CIRCUITS_PER_LEVEL - 1);
  return CIRCUIT_DAY_NUMBERS[idx];
}

export function getLevelCircuitsRequired(level: number): number {
  return determineCircuitCount(level);
}

export function getTotalCompletedCircuits(currentLevel: number, completedCircuitsThisLevel: number): number {
  return (currentLevel - 1) * CIRCUITS_PER_LEVEL + completedCircuitsThisLevel;
}

export function getOverallProgressPercent(currentLevel: number, completedCircuitsThisLevel: number): number {
  return Math.round((getTotalCompletedCircuits(currentLevel, completedCircuitsThisLevel) / TOTAL_CIRCUITS) * 100);
}
