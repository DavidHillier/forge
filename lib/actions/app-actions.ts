"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { determineReadinessRecommendation } from "@/lib/readiness/readiness";
import { filterSubstitutesByEquipment, getCanonicalName, stripTarget } from "@/lib/substitutions/logic";
import { getSubstitutesForExercise } from "@/lib/substitutions/queries";
import { determineTrainingLoad } from "@/lib/workout-engine/workout";
import { circuitsRequiredForLevel, levelFromCleanCount, TOTAL_LEVELS } from "@/lib/level/logic";
import {
  bodyMetricSchema,
  equipmentProfileSchema,
  readinessSchema,
  settingsUpdateSchema,
  substitutionsJsonSchema,
  weightsJsonSchema,
  weeklyReflectionSchema,
  workoutCompletionSchema,
} from "@/lib/validation/schemas";

export async function saveReadinessAction(formData: FormData) {
  const user = await requireUser();
  const parsed = readinessSchema.parse(Object.fromEntries(formData));
  const recommendation = determineReadinessRecommendation(
    parsed.sleepQuality,
    parsed.soreness,
    parsed.energyLevel,
    parsed.timeAvailable,
  );

  await prisma.readinessCheck.create({
    data: {
      userId: user.id,
      workoutId: parsed.workoutId,
      sleepQuality: parsed.sleepQuality,
      soreness: parsed.soreness,
      energyLevel: parsed.energyLevel,
      timeAvailable: parsed.timeAvailable,
      recommendation,
    },
  });

  redirect(`/app/workout/${parsed.workoutId}/preview`);
}

export async function completeWorkoutAction(formData: FormData) {
  const user = await requireUser();
  const parsed = workoutCompletionSchema.parse(Object.fromEntries(formData));
  const hadFailures = formData.get("hadFailures") === "1";

  const rawSubs = formData.get("substitutionsJson");
  const substitutions = rawSubs
    ? substitutionsJsonSchema.parse(JSON.parse(rawSubs as string))
    : [];

  const rawWeights = formData.get("weightsJson");
  const weights = rawWeights
    ? weightsJsonSchema.parse(JSON.parse(rawWeights as string))
    : [];

  const completion = await prisma.workoutCompletion.create({
    data: {
      userId: user.id,
      workoutId: parsed.workoutId,
      totalSeconds: parsed.totalSeconds,
      circuitsCompleted: parsed.circuitsCompleted,
      roundsCompleted: parsed.roundsCompleted,
      effortScore: parsed.effortScore,
      trainingLoad: determineTrainingLoad(parsed.effortScore),
      hadFailures,
      notes: parsed.notes,
    },
  });

  if (substitutions.length > 0) {
    await prisma.workoutSubstitution.createMany({
      data: substitutions.map((s) => ({
        userId: user.id,
        workoutId: parsed.workoutId,
        workoutCompletionId: completion.id,
        originalExerciseName: s.originalExerciseName,
        substitutedExerciseName: s.substitutedExerciseName,
        substitutionReason: s.substitutionReason,
      })),
    });
  }

  if (weights.length > 0) {
    await prisma.exerciseWeight.createMany({
      data: weights.map((w) => ({
        userId: user.id,
        workoutId: parsed.workoutId,
        exerciseName: w.exerciseName,
        weight: w.weight,
      })),
    });
  }

  // Advance progress only on clean completion
  if (!hadFailures) {
    const newCompleted = user.completedCircuitsThisLevel + 1;
    const required = circuitsRequiredForLevel(user.currentLevel);
    if (newCompleted >= required) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          currentLevel: Math.min(user.currentLevel + 1, TOTAL_LEVELS),
          completedCircuitsThisLevel: 0,
        },
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { completedCircuitsThisLevel: newCompleted },
      });
    }
  }

  revalidatePath("/app/today");
  revalidatePath("/app/progress");
  redirect("/app/progress");
}

export async function generateWorkoutAction(formData: FormData) {
  const user = await requireUser();
  const workoutId = formData.get("workoutId") as string;
  if (!workoutId) return;

  const regenerate = formData.get("regenerate") === "1";

  // Don't regenerate if one already exists (unless regenerate flag is set)
  const existing = await prisma.generatedWorkout.findUnique({
    where: { userId_workoutId: { userId: user.id, workoutId } },
  });
  if (existing && !regenerate) {
    revalidatePath(`/app/workout/${workoutId}/preview`);
    return;
  }
  if (existing && regenerate) {
    await prisma.generatedWorkout.delete({ where: { id: existing.id } });
  }

  // Load the workout's main block exercises
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: {
      blocks: {
        where: { blockType: "main" },
        include: { exercises: { orderBy: { order: "asc" } } },
      },
    },
  });
  if (!workout) return;

  const userEquipment = (user.equipmentProfile as string[]) ?? [];
  const mainExercises = workout.blocks[0]?.exercises ?? [];

  // For each exercise slot, pick randomly from canonical + equipment-filtered substitutes
  const exerciseEntries: { exerciseId: string; exerciseName: string }[] = [];
  for (const exercise of mainExercises) {
    const baseName = stripTarget(exercise.name);
    const canonicalName = getCanonicalName(exercise.name);

    if (!canonicalName) {
      // Not swappable — keep as-is
      exerciseEntries.push({ exerciseId: exercise.id, exerciseName: baseName });
      continue;
    }

    // Get canonical exercise itself
    const canonicalExercise = await prisma.canonicalExercise.findUnique({
      where: { name: canonicalName },
    });

    // Get all substitutes
    const substitutes = await getSubstitutesForExercise(canonicalName);

    // Build pool: canonical + substitutes, filter by user equipment
    type Candidate = { name: string; equipment: string[] };
    const pool: Candidate[] = [];

    if (canonicalExercise) {
      pool.push({ name: canonicalExercise.name, equipment: canonicalExercise.equipment as string[] });
    }

    const equipmentFilteredSubs = filterSubstitutesByEquipment(substitutes, userEquipment);
    for (const sub of equipmentFilteredSubs) {
      pool.push({ name: sub.substitute.name, equipment: sub.substitute.equipment as string[] });
    }

    // Further filter pool by user equipment
    const available = new Set(userEquipment.map((e) => e.toLowerCase()));
    const filtered = pool.filter((c) => {
      if (c.equipment.length === 0 || c.equipment.every((e) => e.toLowerCase() === "bodyweight")) return true;
      return c.equipment.every((e) => available.has(e.toLowerCase()));
    });

    const candidates = filtered.length > 0 ? filtered : pool;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    exerciseEntries.push({ exerciseId: exercise.id, exerciseName: picked?.name ?? baseName });
  }

  await prisma.generatedWorkout.create({
    data: {
      userId: user.id,
      workoutId,
      exercises: exerciseEntries,
    },
  });

  revalidatePath(`/app/workout/${workoutId}/preview`);
  revalidatePath("/app/today");
}

export async function saveBodyMetricAction(formData: FormData) {
  const user = await requireUser();
  const parsed = bodyMetricSchema.parse(Object.fromEntries(formData));

  await prisma.bodyMetric.create({
    data: {
      userId: user.id,
      weight: parsed.weight === "" ? null : parsed.weight,
      waist: parsed.waist === "" ? null : parsed.waist,
      restingHeartRate: parsed.restingHeartRate === "" ? null : parsed.restingHeartRate,
      note: parsed.note,
      progressPhotoUrl: parsed.progressPhotoUrl === "" ? null : parsed.progressPhotoUrl,
    },
  });

  revalidatePath("/app/progress/details");
}

export async function saveWeeklyReflectionAction(formData: FormData) {
  const user = await requireUser();
  const parsed = weeklyReflectionSchema.parse(Object.fromEntries(formData));

  await prisma.weeklyReflection.upsert({
    where: { userId_weekNumber: { userId: user.id, weekNumber: parsed.weekNumber } },
    update: parsed,
    create: { ...parsed, userId: user.id },
  });

  revalidatePath("/app/progress/details");
}

export async function updateSettingsAction(formData: FormData) {
  const user = await requireUser();
  const parsed = settingsUpdateSchema.parse(Object.fromEntries(formData));

  await prisma.user.update({
    where: { id: user.id },
    data: parsed,
  });

  revalidatePath("/app/settings");
  revalidatePath("/app/today");
}

export async function updateEquipmentProfileAction(formData: FormData) {
  const user = await requireUser();
  const raw = formData.getAll("equipment");
  const equipmentProfile = equipmentProfileSchema.parse(raw);

  await prisma.user.update({
    where: { id: user.id },
    data: { equipmentProfile },
  });

  revalidatePath("/app/settings");
}

export async function deleteWorkoutCompletionAction(formData: FormData) {
  const user = await requireUser();
  const completionId = formData.get("completionId") as string;
  if (!completionId) return;

  const completion = await prisma.workoutCompletion.findUnique({
    where: { id: completionId, userId: user.id },
  });
  if (!completion) return;

  await prisma.$transaction([
    prisma.workoutCompletion.delete({ where: { id: completionId } }),
    // Remove generated workout so it can be regenerated
    prisma.generatedWorkout.deleteMany({
      where: { userId: user.id, workoutId: completion.workoutId },
    }),
  ]);

  // Recalculate level progress from remaining clean completions
  if (!completion.hadFailures) {
    const cleanCount = await prisma.workoutCompletion.count({
      where: { userId: user.id, hadFailures: false },
    });
    const { level, completedCircuitsThisLevel } = levelFromCleanCount(cleanCount);
    await prisma.user.update({
      where: { id: user.id },
      data: { currentLevel: level, completedCircuitsThisLevel },
    });
  }

  revalidatePath("/app/history");
  revalidatePath("/app/today");
}

export async function resetProgrammeDataAction() {
  const user = await requireUser();
  await prisma.$transaction([
    prisma.workoutCompletion.deleteMany({ where: { userId: user.id } }),
    prisma.readinessCheck.deleteMany({ where: { userId: user.id } }),
    prisma.bodyMetric.deleteMany({ where: { userId: user.id } }),
    prisma.weeklyReflection.deleteMany({ where: { userId: user.id } }),
    prisma.user.update({ where: { id: user.id }, data: { programmeStartDate: new Date() } }),
  ]);

  revalidatePath("/app/today");
  redirect("/app/today");
}
