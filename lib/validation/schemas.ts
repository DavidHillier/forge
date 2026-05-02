import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8).max(100),
});

export const readinessSchema = z.object({
  workoutId: z.string().min(1),
  sleepQuality: z.enum(["poor", "ok", "good"]),
  soreness: z.enum(["low", "medium", "high"]),
  energyLevel: z.enum(["low", "medium", "high"]),
  timeAvailable: z.enum(["10", "20", "30"]),
});

export const workoutCompletionSchema = z.object({
  workoutId: z.string().min(1),
  totalSeconds: z.coerce.number().int().positive(),
  circuitsCompleted: z.coerce.number().int().min(0),
  roundsCompleted: z.coerce.number().int().min(0),
  effortScore: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
});

export const bodyMetricSchema = z.object({
  weight: z.coerce.number().positive().optional().or(z.literal("")),
  waist: z.coerce.number().positive().optional().or(z.literal("")),
  restingHeartRate: z.coerce.number().int().positive().optional().or(z.literal("")),
  note: z.string().max(1000).optional(),
  progressPhotoUrl: z.url().optional().or(z.literal("")),
});

export const weeklyReflectionSchema = z.object({
  weekNumber: z.coerce.number().int().min(1).max(9),
  energy: z.coerce.number().int().min(1).max(5),
  sleep: z.coerce.number().int().min(1).max(5),
  soreness: z.coerce.number().int().min(1).max(5),
  motivation: z.coerce.number().int().min(1).max(5),
  notes: z.string().max(1000).optional(),
});

export const settingsUpdateSchema = z.object({
  name: z.string().min(2).max(80),
  programmeStartDate: z.coerce.date(),
  units: z.enum(["metric", "imperial"]),
});

export const equipmentProfileSchema = z.array(z.string());

export const substitutionReasonSchema = z.enum([
  "closest_match",
  "no_equipment",
  "easier",
  "harder",
  "joint_friendly",
  "equipment_unavailable",
  "bodyweight",
  "heavier_strength",
  "conditioning",
]);

export const weightsJsonSchema = z.array(
  z.object({
    exerciseName: z.string(),
    weight: z.number().min(0),
  }),
).transform((entries) => entries.filter((e) => e.weight > 0));

export const substitutionsJsonSchema = z.array(
  z.object({
    originalExerciseName: z.string(),
    substitutedExerciseName: z.string(),
    substitutionReason: substitutionReasonSchema,
  }),
);
