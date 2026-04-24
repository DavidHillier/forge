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
  searchParams: Promise<{ total?: string; circuits?: string; rounds?: string; failed?: string }>;
}) {
  const user = await requireUser();
  const { workoutId } = await params;
  const query = await searchParams;
  const workout = await prisma.workout.findUnique({ where: { id: workoutId }, include: { week: true } });
  if (!workout) notFound();

  const totalSeconds = Number(query.total ?? workout.durationMinutes * 60);
  const hadFailures = query.failed === "1";

  return (
    <AppShell active="Today">
      <div className="mx-auto max-w-xl">
        <SectionTitle
          eyebrow="Workout Complete"
          title={hadFailures ? `Good effort, ${user.name.split(" ")[0]}.` : `Great work, ${user.name.split(" ")[0]}.`}
          body={hadFailures ? "You showed up. Redo this one tomorrow — same exercises." : "Clean circuit. You advanced."}
        />
        <Card className="mt-6">
          <WorkoutCompleteForm
            workoutId={workout.id}
            totalSeconds={totalSeconds}
            circuitsCompleted={Number(query.circuits ?? workout.week.circuitCount ?? 1)}
            roundsCompleted={Number(query.rounds ?? 1)}
            hadFailures={hadFailures}
          />
        </Card>
      </div>
    </AppShell>
  );
}
