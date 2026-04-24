import { PrismaClient } from "@prisma/client";
import { weekDefinitions, workoutTemplatesForWeek } from "../lib/programme/data";

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

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
