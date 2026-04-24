import { Clock, Dumbbell } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { WorkoutPreviewExercises } from "@/components/workout/workout-preview-exercises";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getCanonicalName, isSwappable, isWeightedExercise, stripTarget } from "@/lib/substitutions/logic";
import { getLastWeightsForExercises, getSubstitutesForExercise } from "@/lib/substitutions/queries";
import type { SubstituteOption } from "@/lib/substitutions/types";
import { calculateCircuitsForWorkout } from "@/lib/workout-engine/workout";

export const dynamic = "force-dynamic";

export default async function WorkoutPreviewPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const user = await requireUser();
  const { workoutId } = await params;
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: { week: true, blocks: { orderBy: { order: "asc" }, include: { exercises: { orderBy: { order: "asc" } } } } },
  });
  if (!workout) notFound();
  const circuits = calculateCircuitsForWorkout(workout.week.weekNumber, workout);

  const allExerciseNames = workout.blocks.flatMap((b) => b.exercises.map((e) => e.name));

  // Pre-fetch substitutes for all swappable exercises
  const canonicalNames = [...new Set(allExerciseNames.filter(isSwappable).map((n) => getCanonicalName(n)!))];
  const substitutesByCanonical: Record<string, SubstituteOption[]> = {};
  await Promise.all(
    canonicalNames.map(async (cn) => {
      substitutesByCanonical[cn] = await getSubstitutesForExercise(cn);
    }),
  );

  // Pre-fetch last weights for weighted exercises
  const weightedBaseNames = [...new Set(allExerciseNames.filter(isWeightedExercise).map(stripTarget))];
  const lastWeights = await getLastWeightsForExercises(user.id, weightedBaseNames);

  const userEquipment = Array.isArray(user.equipmentProfile) ? (user.equipmentProfile as string[]) : [];

  return (
    <AppShell active="Today">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_0.25fr]">
        <section className="grid gap-5">
          <SectionTitle eyebrow={`Week ${workout.week.weekNumber} · Day ${workout.dayNumber}`} title={workout.title} body={workout.description} />
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="flex items-center gap-3"><Clock className="text-[#B9903D]" /> {workout.durationMinutes} min total</Card>
            <Card className="flex items-center gap-3"><Dumbbell className="text-[#B9903D]" /> {circuits} circuits</Card>
            <Card>{workout.intensity} intensity</Card>
          </div>
          <WorkoutPreviewExercises
            workoutId={workout.id}
            blocks={workout.blocks.map((b) => ({
              id: b.id,
              name: b.name,
              durationMinutes: b.durationMinutes,
              exercises: b.exercises.map((e) => ({
                id: e.id,
                name: e.name,
                workSeconds: e.workSeconds,
                restSeconds: e.restSeconds,
              })),
            }))}
            substitutesByCanonical={substitutesByCanonical}
            userEquipment={userEquipment}
            lastWeights={lastWeights}
            units={user.units}
          />
        </section>
        <aside className="grid content-start gap-4">
          <Card>
            <h2 className="font-semibold">Equipment</h2>
            <ul className="mt-3 grid gap-2 text-sm text-[#6B756F]">
              {(workout.equipment as string[]).map((item) => <li key={item}>{item}</li>)}
            </ul>
          </Card>
          <ButtonLink href={`/app/workout/${workout.id}/active`} variant="secondary">Start Warm-Up</ButtonLink>
        </aside>
      </div>
    </AppShell>
  );
}
