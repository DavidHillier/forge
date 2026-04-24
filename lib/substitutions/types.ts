export type SubstitutionReason =
  | "closest_match"
  | "no_equipment"
  | "easier"
  | "harder"
  | "joint_friendly"
  | "equipment_unavailable"
  | "bodyweight"
  | "heavier_strength"
  | "conditioning";

export type MatchQuality = "excellent" | "good" | "fair";
export type Difficulty = "beginner" | "moderate" | "advanced";
export type ImpactLevel = "low" | "moderate" | "high";
export type IntensityChange = "lower" | "same" | "higher";
export type DifficultyChange = "easier" | "same" | "harder";

export type CanonicalExerciseRecord = {
  id: string;
  name: string;
  description: string;
  movementPattern: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string[];
  difficulty: Difficulty;
  impactLevel: ImpactLevel;
  jointStressLevel: ImpactLevel;
  isCanonical: boolean;
  formCues: string[];
  safetyCue: string;
};

export type SubstituteRecord = {
  id: string;
  canonicalExerciseId: string;
  substituteExerciseId: string;
  substitutionReasons: SubstitutionReason[];
  matchQuality: MatchQuality;
  intensityChange: IntensityChange;
  difficultyChange: DifficultyChange;
  recommendationRank: number;
  scalingNote: string | null;
  cautionNote: string | null;
  isAdvanced: boolean;
  substitute: CanonicalExerciseRecord;
};

export type SubstituteOption = SubstituteRecord & {
  substitute: CanonicalExerciseRecord;
};

// Stored in sessionStorage per workout
export type WorkoutSubstitutionEntry = {
  originalExerciseName: string;
  substitutedExerciseName: string;
  substitutionReason: SubstitutionReason;
};
