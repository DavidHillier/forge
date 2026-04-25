import type {
  SubstituteOption,
  SubstitutionReason,
  WorkoutSubstitutionEntry,
} from "./types";

// Maps workout-block short names (as they appear in Exercise.name before the parenthetical)
// to the canonical exercise names in the CanonicalExercise table.
export const WORKOUT_TO_CANONICAL_NAME: Record<string, string> = {
  Squat: "Dumbbell squat",
  "Overhead press": "Dumbbell overhead press",
  "Push-up renegade row": "Push-up renegade row",
  "Dumbbell swing": "Dumbbell swing",
  "Hammer curl": "Dumbbell hammer curl",
  "Triceps extension": "Dumbbell triceps extension",
  Lunge: "Dumbbell lunge",
  "Upright row": "Dumbbell upright row",
  "Floor press": "Dumbbell floor press",
  "Bent-over row": "Dumbbell bent-over row",
  Plank: "Plank",
  "Goblet squat": "Dumbbell goblet squat",
  "Lateral raise": "Dumbbell lateral raise",
  "Push-up": "Push-up",
  "One-arm row": "Dumbbell single-arm row",
  "Side bend": "Dumbbell side bend",
  "Reverse lunge": "Dumbbell reverse lunge",
  Halo: "Dumbbell halo",
  "Diamond push-up": "Diamond push-up",
  "Reverse-grip bent-over row": "Dumbbell reverse-grip bent-over row",
  "Side plank": "Side plank",
};

// Strip "(12)", "(40 sec)", etc. from exercise display names to get the base name.
export function stripTarget(exerciseName: string): string {
  return exerciseName.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

// Extract the target string from inside the parentheses, e.g. "Squat (12)" → "12"
export function extractTarget(exerciseName: string): string {
  const match = exerciseName.match(/\(([^)]+)\)\s*$/);
  return match ? match[1] : "";
}

export function getCanonicalName(exerciseName: string): string | null {
  const base = stripTarget(exerciseName);
  return WORKOUT_TO_CANONICAL_NAME[base] ?? null;
}

export function isSwappable(exerciseName: string): boolean {
  return getCanonicalName(exerciseName) !== null;
}

export function getSubstitutionDisplayLabel(reason: SubstitutionReason): string {
  const labels: Record<SubstitutionReason, string> = {
    closest_match: "Closest match",
    no_equipment: "No equipment",
    easier: "Easier today",
    harder: "Harder option",
    joint_friendly: "Joint-friendly",
    equipment_unavailable: "Equipment unavailable",
    bodyweight: "Bodyweight only",
    heavier_strength: "Heavier strength",
    conditioning: "Conditioning",
  };
  return labels[reason];
}

export function isAdvancedSubstitute(sub: SubstituteOption): boolean {
  return sub.isAdvanced;
}

export function filterSubstitutesByReason(
  substitutes: SubstituteOption[],
  reason: SubstitutionReason,
): SubstituteOption[] {
  return substitutes.filter((s) => s.substitutionReasons.includes(reason));
}

export function filterSubstitutesByEquipment(
  substitutes: SubstituteOption[],
  userEquipment: string[],
): SubstituteOption[] {
  if (userEquipment.length === 0) return substitutes;
  const available = new Set(userEquipment.map((e) => e.toLowerCase()));
  return substitutes.filter((s) => {
    const needed = s.substitute.equipment as string[];
    // "Bodyweight" exercises need no equipment
    if (needed.length === 0 || needed.every((e) => e.toLowerCase() === "bodyweight")) return true;
    return needed.every((e) => available.has(e.toLowerCase()));
  });
}

export function rankSubstitutes(
  substitutes: SubstituteOption[],
  reason: SubstitutionReason,
  userEquipment?: string[],
): SubstituteOption[] {
  let results = [...substitutes];

  // Filter by reason
  const byReason = filterSubstitutesByReason(results, reason);
  if (byReason.length > 0) results = byReason;

  // Filter by equipment if available
  if (userEquipment && userEquipment.length > 0) {
    const byEquipment = filterSubstitutesByEquipment(results, userEquipment);
    if (byEquipment.length > 0) results = byEquipment;
  }

  // Sort: advanced last unless reason calls for it, then by recommendationRank
  const advancedLast = reason !== "harder" && reason !== "heavier_strength";
  results.sort((a, b) => {
    if (advancedLast) {
      if (a.isAdvanced !== b.isAdvanced) return a.isAdvanced ? 1 : -1;
    }
    return a.recommendationRank - b.recommendationRank;
  });

  return results;
}

export function getRecommendedSubstitutes(
  substitutes: SubstituteOption[],
  reason: SubstitutionReason,
  userEquipment?: string[],
): SubstituteOption[] {
  return rankSubstitutes(substitutes, reason, userEquipment);
}

const WEIGHTED_PREFIXES = ["Dumbbell", "Barbell", "Kettlebell"];
const WEIGHTED_EXACT = new Set(["Push-up renegade row"]);

export function isWeightedExercise(exerciseName: string): boolean {
  const canonical = getCanonicalName(exerciseName);
  if (!canonical) return false;
  return WEIGHTED_PREFIXES.some((p) => canonical.startsWith(p)) || WEIGHTED_EXACT.has(canonical);
}

// sessionStorage helpers
const STORAGE_PREFIX = "forge_subs_v2_";

export function getStorageKey(workoutId: string): string {
  return `${STORAGE_PREFIX}${workoutId}`;
}

export function loadSubstitutions(workoutId: string): WorkoutSubstitutionEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(getStorageKey(workoutId));
    return raw ? (JSON.parse(raw) as WorkoutSubstitutionEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveSubstitutions(workoutId: string, subs: WorkoutSubstitutionEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(getStorageKey(workoutId), JSON.stringify(subs));
  } catch {
    // sessionStorage may be unavailable in some environments
  }
}

export function clearSubstitutions(workoutId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(getStorageKey(workoutId));
}

// Exercise weight sessionStorage helpers
const WEIGHTS_PREFIX = "forge_weights_";

export function loadWeights(workoutId: string): Record<string, number> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(`${WEIGHTS_PREFIX}${workoutId}`);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export function saveWeights(workoutId: string, weights: Record<string, number>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${WEIGHTS_PREFIX}${workoutId}`, JSON.stringify(weights));
  } catch {}
}

export function clearWeights(workoutId: string): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(`${WEIGHTS_PREFIX}${workoutId}`);
}

// Rep / target override sessionStorage helpers
const TARGETS_PREFIX = "forge_targets_v2_";

export function loadTargetOverrides(workoutId: string): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(`${TARGETS_PREFIX}${workoutId}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function saveTargetOverrides(workoutId: string, overrides: Record<string, string>): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`${TARGETS_PREFIX}${workoutId}`, JSON.stringify(overrides));
  } catch {}
}

// Build a substitution lookup map keyed by original exercise base name
export function buildSubstitutionMap(
  subs: WorkoutSubstitutionEntry[],
): Map<string, WorkoutSubstitutionEntry> {
  const map = new Map<string, WorkoutSubstitutionEntry>();
  for (const sub of subs) {
    map.set(sub.originalExerciseName, sub);
  }
  return map;
}
