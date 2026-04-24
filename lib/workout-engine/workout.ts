import { determineCircuitCount } from "@/lib/programme/programme";

export type WorkoutForEngine = {
  title: string;
  durationMinutes: number;
  blocks: {
    name: string;
    order: number;
    blockType: string;
    exercises: {
      name: string;
      order: number;
      workSeconds: number;
      restSeconds: number;
      rounds: number;
      formCues: unknown;
      safetyCue: string;
    }[];
  }[];
};

export type WorkoutInterval = {
  block: string;
  exercise: string;
  status: "work" | "rest";
  seconds: number;
  round: number;
  formCues: string[];
  safetyCue: string;
};

export function buildWorkoutIntervalSequence(workout: WorkoutForEngine) {
  return workout.blocks
    .sort((a, b) => a.order - b.order)
    .flatMap((block) =>
      block.exercises
        .sort((a, b) => a.order - b.order)
        .flatMap((exercise) => {
          const rounds = Math.max(1, exercise.rounds);
          const cues = Array.isArray(exercise.formCues) ? exercise.formCues.map(String) : [];
          return Array.from({ length: rounds }).flatMap((_, index) => {
            const intervals: WorkoutInterval[] = [
              {
                block: block.name,
                exercise: exercise.name,
                status: "work",
                seconds: exercise.workSeconds,
                round: index + 1,
                formCues: cues,
                safetyCue: exercise.safetyCue,
              },
            ];
            if (exercise.restSeconds > 0) {
              intervals.push({
                block: block.name,
                exercise: "Rest",
                status: "rest",
                seconds: exercise.restSeconds,
                round: index + 1,
                formCues: [],
                safetyCue: exercise.safetyCue,
              });
            }
            return intervals;
          });
        }),
    );
}

export function calculateWorkoutDuration(workout: WorkoutForEngine) {
  return buildWorkoutIntervalSequence(workout).reduce((sum, interval) => sum + interval.seconds, 0);
}

export function determineTrainingLoad(effortScore: number) {
  if (effortScore <= 2) return "LOW";
  if (effortScore === 3) return "MEDIUM";
  return "HIGH";
}

export function calculateCircuitsForWorkout(weekNumber: number, workout: { circuitCount?: number | null }) {
  return workout.circuitCount ?? determineCircuitCount(weekNumber);
}
