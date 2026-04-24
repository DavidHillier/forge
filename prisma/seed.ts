import { PrismaClient } from "@prisma/client";
import { weekDefinitions, workoutTemplatesForWeek } from "../lib/programme/data";
import { canonicalExercises } from "../lib/substitutions/seed-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.programme.upsert({
    where: { id: "forge-9-week" },
    update: {},
    create: {
      id: "forge-9-week",
      name: "Forge 9-Week Fat-Loss System",
      description: "A structured 3-week build-up and 6-week fat-loss conditioning course.",
      totalWeeks: 9,
      totalDays: 63,
    },
  });

  for (const weekDefinition of weekDefinitions) {
    const week = await prisma.week.upsert({
      where: { weekNumber: weekDefinition.weekNumber },
      update: {
        phase: weekDefinition.phase,
        title: weekDefinition.title,
        theme: weekDefinition.theme,
        objective: weekDefinition.objective,
        circuitCount: "circuitCount" in weekDefinition ? weekDefinition.circuitCount : null,
        mainCourseWeekNumber: "mainCourseWeekNumber" in weekDefinition ? weekDefinition.mainCourseWeekNumber : null,
      },
      create: {
        programmeId: "forge-9-week",
        weekNumber: weekDefinition.weekNumber,
        phase: weekDefinition.phase,
        title: weekDefinition.title,
        theme: weekDefinition.theme,
        objective: weekDefinition.objective,
        circuitCount: "circuitCount" in weekDefinition ? weekDefinition.circuitCount : null,
        mainCourseWeekNumber: "mainCourseWeekNumber" in weekDefinition ? weekDefinition.mainCourseWeekNumber : null,
      },
    });

    for (const template of workoutTemplatesForWeek(week.weekNumber)) {
      const workout = await prisma.workout.upsert({
        where: { weekId_dayNumber: { weekId: week.id, dayNumber: template.dayNumber } },
        update: {
          title: template.title,
          type: template.type,
          durationMinutes: template.durationMinutes,
          intensity: template.intensity,
          circuitCount: week.circuitCount,
          equipment: template.equipment,
          description: template.description,
        },
        create: {
          weekId: week.id,
          dayNumber: template.dayNumber,
          title: template.title,
          type: template.type,
          durationMinutes: template.durationMinutes,
          intensity: template.intensity,
          circuitCount: week.circuitCount,
          equipment: template.equipment,
          description: template.description,
        },
      });

      await prisma.workoutBlock.deleteMany({ where: { workoutId: workout.id } });

      for (const block of template.blocks) {
        await prisma.workoutBlock.create({
          data: {
            workoutId: workout.id,
            name: block.name,
            order: block.order,
            durationMinutes: block.durationMinutes,
            blockType: block.blockType,
            exercises: {
              create: block.exercises.map((exercise) => ({
                name: exercise.name,
                order: exercise.order,
                workSeconds: exercise.workSeconds,
                restSeconds: exercise.restSeconds,
                rounds: exercise.rounds,
                formCues: exercise.formCues,
                safetyCue: exercise.safetyCue,
              })),
            },
          },
        });
      }
    }
  }
}

async function seedSubstitutions() {
  console.log("Seeding canonical exercises and substitutes...");

  // Collect all unique exercise definitions (canonical + all substitutes)
  const allExDefs = new Map<string, { movementPattern: string; primaryMuscles: string[]; secondaryMuscles: string[]; equipment: string[]; difficulty: string; impactLevel: string; jointStressLevel: string; isCanonical: boolean; formCues: string[]; safetyCue: string }>();

  for (const canon of canonicalExercises) {
    allExDefs.set(canon.name, {
      movementPattern: canon.movementPattern,
      primaryMuscles: canon.primaryMuscles,
      secondaryMuscles: canon.secondaryMuscles ?? [],
      equipment: canon.equipment,
      difficulty: canon.difficulty,
      impactLevel: canon.impactLevel,
      jointStressLevel: canon.jointStressLevel,
      isCanonical: true,
      formCues: canon.formCues,
      safetyCue: canon.safetyCue ?? "Stop if you feel sharp pain or dizziness.",
    });
    for (const sub of canon.substitutes) {
      if (!allExDefs.has(sub.name)) {
        allExDefs.set(sub.name, {
          movementPattern: sub.movementPattern,
          primaryMuscles: sub.primaryMuscles,
          secondaryMuscles: sub.secondaryMuscles ?? [],
          equipment: sub.equipment,
          difficulty: sub.difficulty,
          impactLevel: sub.impactLevel,
          jointStressLevel: sub.jointStressLevel,
          isCanonical: false,
          formCues: sub.formCues,
          safetyCue: sub.safetyCue ?? "Stop if you feel sharp pain or dizziness.",
        });
      }
    }
  }

  // Upsert all CanonicalExercise records
  for (const [name, def] of allExDefs) {
    await prisma.canonicalExercise.upsert({
      where: { name },
      update: {
        movementPattern: def.movementPattern,
        primaryMuscles: def.primaryMuscles,
        secondaryMuscles: def.secondaryMuscles,
        equipment: def.equipment,
        difficulty: def.difficulty,
        impactLevel: def.impactLevel,
        jointStressLevel: def.jointStressLevel,
        isCanonical: def.isCanonical,
        formCues: def.formCues,
        safetyCue: def.safetyCue,
      },
      create: {
        name,
        movementPattern: def.movementPattern,
        primaryMuscles: def.primaryMuscles,
        secondaryMuscles: def.secondaryMuscles,
        equipment: def.equipment,
        difficulty: def.difficulty,
        impactLevel: def.impactLevel,
        jointStressLevel: def.jointStressLevel,
        isCanonical: def.isCanonical,
        formCues: def.formCues,
        safetyCue: def.safetyCue,
      },
    });
  }

  // Fetch all records so we can look up IDs
  const allRecords = await prisma.canonicalExercise.findMany({ select: { id: true, name: true } });
  const nameToId = new Map(allRecords.map((r) => [r.name, r.id]));

  // Upsert ExerciseSubstitute relationships
  for (const canon of canonicalExercises) {
    const canonicalExerciseId = nameToId.get(canon.name);
    if (!canonicalExerciseId) continue;
    for (const sub of canon.substitutes) {
      const substituteExerciseId = nameToId.get(sub.name);
      if (!substituteExerciseId) continue;
      await prisma.exerciseSubstitute.upsert({
        where: { canonicalExerciseId_substituteExerciseId: { canonicalExerciseId, substituteExerciseId } },
        update: {
          substitutionReasons: sub.substitutionReasons,
          matchQuality: sub.matchQuality,
          intensityChange: sub.intensityChange,
          difficultyChange: sub.difficultyChange,
          recommendationRank: sub.recommendationRank,
          scalingNote: sub.scalingNote ?? null,
          cautionNote: sub.cautionNote ?? null,
          isAdvanced: sub.isAdvanced ?? false,
        },
        create: {
          canonicalExerciseId,
          substituteExerciseId,
          substitutionReasons: sub.substitutionReasons,
          matchQuality: sub.matchQuality,
          intensityChange: sub.intensityChange,
          difficultyChange: sub.difficultyChange,
          recommendationRank: sub.recommendationRank,
          scalingNote: sub.scalingNote ?? null,
          cautionNote: sub.cautionNote ?? null,
          isAdvanced: sub.isAdvanced ?? false,
        },
      });
    }
  }

  console.log(`Seeded ${allExDefs.size} canonical exercises.`);
}

main()
  .then(async () => {
    await seedSubstitutions();
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
