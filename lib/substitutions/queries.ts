"use server";

import { prisma } from "@/lib/db/prisma";
import { getRecommendedSubstitutes } from "./logic";
import type { SubstituteOption, SubstitutionReason } from "./types";

export async function getSubstitutesForExercise(canonicalName: string): Promise<SubstituteOption[]> {
  const canonical = await prisma.canonicalExercise.findUnique({
    where: { name: canonicalName },
    include: {
      asCanonical: {
        include: { substitute: true },
        orderBy: { recommendationRank: "asc" },
      },
    },
  });

  if (!canonical) return [];

  return canonical.asCanonical.map((rel) => ({
    ...rel,
    substitutionReasons: rel.substitutionReasons as SubstitutionReason[],
    substitute: {
      ...rel.substitute,
      primaryMuscles: rel.substitute.primaryMuscles as string[],
      secondaryMuscles: rel.substitute.secondaryMuscles as string[],
      equipment: rel.substitute.equipment as string[],
      formCues: rel.substitute.formCues as string[],
      difficulty: rel.substitute.difficulty as SubstituteOption["substitute"]["difficulty"],
      impactLevel: rel.substitute.impactLevel as SubstituteOption["substitute"]["impactLevel"],
      jointStressLevel: rel.substitute.jointStressLevel as SubstituteOption["substitute"]["jointStressLevel"],
    },
  })) as SubstituteOption[];
}

export async function getRecommendedSubstitutesForExercise(
  canonicalName: string,
  reason: SubstitutionReason,
  userEquipment?: string[],
): Promise<SubstituteOption[]> {
  const all = await getSubstitutesForExercise(canonicalName);
  return getRecommendedSubstitutes(all, reason, userEquipment);
}
