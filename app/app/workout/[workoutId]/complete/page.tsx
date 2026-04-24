import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Card, SectionTitle } from "@/components/ui/card";
import { WorkoutCompleteForm } from "@/components/workout/workout-complete-form";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function WorkoutCompletePage({
  params,
  searchParams,
}: {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ total?: string; circuits?: string; rounds?: string }>;
}) {
  const user = await requireUser();
  const { workoutId } = await params;
  const query = await searchParams;
  const workout = await prisma.workout.findUnique({ where: { id: workoutId }, include: { week: true } });
  if (!workout) notFound();
  const totalSeconds = Number(query.total ?? workout.durationMinutes * 60);

  return (
    <AppShell active="Today">
      <div className="mx-auto max-w-xl">
        <SectionTitle eyebrow="Workout Complete" title={`Great work, ${user.name.split(" ")[0]}.`} body="You showed up and put in the work." />
        <Card className="mt-6">
          <WorkoutCompleteForm
            workoutId={workout.id}
            totalSeconds={totalSeconds}
            circuitsCompleted={Number(query.circuits ?? workout.week.circuitCount ?? 3)}
            roundsCompleted={Number(query.rounds ?? 1)}
          />
        </Card>
      </div>
    </AppShell>
  );
}
