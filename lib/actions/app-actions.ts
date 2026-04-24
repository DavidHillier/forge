"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { determineReadinessRecommendation } from "@/lib/readiness/readiness";
import { determineTrainingLoad } from "@/lib/workout-engine/workout";
import {
  bodyMetricSchema,
  readinessSchema,
  settingsUpdateSchema,
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

  await prisma.workoutCompletion.create({
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
