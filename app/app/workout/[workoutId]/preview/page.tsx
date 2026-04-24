import { Clock, Dumbbell } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { calculateCircuitsForWorkout } from "@/lib/workout-engine/workout";

export const dynamic = "force-dynamic";

export default async function WorkoutPreviewPage({ params }: { params: Promise<{ workoutId: string }> }) {
  await requireUser();
  const { workoutId } = await params;
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: { week: true, blocks: { orderBy: { order: "asc" }, include: { exercises: { orderBy: { order: "asc" } } } } },
  });
  if (!workout) notFound();
  const circuits = calculateCircuitsForWorkout(workout.week.weekNumber, workout);

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
          {workout.blocks.map((block) => (
            <Card key={block.id}>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-[var(--font-display)] text-2xl font-semibold">{block.name}</h2>
                <span className="text-sm text-[#6B756F]">{block.durationMinutes} min</span>
              </div>
              <div className="grid gap-2">
                {block.exercises.map((exercise) => (
                  <div key={exercise.id} className="flex items-center justify-between rounded-md bg-[#F7F3EA] p-3 text-sm">
                    <span>{exercise.name}</span>
                    <span className="text-[#6B756F]">{exercise.workSeconds}s work · {exercise.restSeconds}s rest</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
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
