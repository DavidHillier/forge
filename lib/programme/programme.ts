import type { ProgrammePhase } from "./types";

const MS_PER_DAY = 86_400_000;

export function calculateProgrammeDay(programmeStartDate: Date | string, currentDate: Date | string) {
  const start = startOfDay(programmeStartDate);
  const current = startOfDay(currentDate);
  return Math.floor((current.getTime() - start.getTime()) / MS_PER_DAY) + 1;
}

export function calculateWeekNumber(programmeDay: number) {
  return Math.ceil(programmeDay / 7);
}

export function calculateDayNumber(programmeDay: number) {
  return ((programmeDay - 1) % 7) + 1;
}

export function determinePhase(weekNumber: number): ProgrammePhase {
  return isBuildUpPhase(weekNumber) ? "Build-Up Phase" : "Main 6-Week Course";
}

export function determineCircuitCount(weekNumber: number) {
  if (weekNumber <= 0) return 0;
  if (weekNumber <= 3) return weekNumber;
  if (weekNumber === 4) return 3;
  if (weekNumber === 5) return 3;
  if (weekNumber === 6) return 4;
  if (weekNumber === 7) return 3;
  if (weekNumber === 8) return 4;
  return 4;
}

export function isBuildUpPhase(weekNumber: number) {
  return weekNumber >= 1 && weekNumber <= 3;
}

export function isMainCourse(weekNumber: number) {
  return weekNumber >= 4 && weekNumber <= 9;
}

export function getProgrammePosition(programmeStartDate: Date, currentDate = new Date()) {
  const programmeDay = calculateProgrammeDay(programmeStartDate, currentDate);
  const weekNumber = calculateWeekNumber(programmeDay);
  const dayNumber = calculateDayNumber(programmeDay);

  return {
    programmeDay,
    weekNumber,
    dayNumber,
    phase: determinePhase(weekNumber),
    circuitCount: determineCircuitCount(weekNumber),
    hasStarted: programmeDay >= 1,
    isComplete: programmeDay > 63,
  };
}

function startOfDay(value: Date | string) {
  const date = new Date(value);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
