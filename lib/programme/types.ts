export type ProgrammePhase = "Build-Up Phase" | "Main 6-Week Course";

export type ExerciseTemplate = {
  name: string;
  order: number;
  workSeconds: number;
  restSeconds: number;
  rounds: number;
  formCues: string[];
  safetyCue: string;
};

export type WorkoutBlockTemplate = {
  name: string;
  order: number;
  durationMinutes: number;
  blockType: "warmup" | "main" | "finisher" | "cooldown" | "recovery";
  exercises: ExerciseTemplate[];
};

export type WorkoutTemplate = {
  dayNumber: number;
  title: string;
  type: string;
  durationMinutes: number;
  intensity: string;
  equipment: string[];
  description: string;
  blocks: WorkoutBlockTemplate[];
};
