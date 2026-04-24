"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { determineReadinessRecommendation } from "@/lib/readiness/readiness";
import { determineTrainingLoad } from "@/lib/workout-engine/workout";
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

  revalidatePath("/app/progress");
  redirect("/app/progress");
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
