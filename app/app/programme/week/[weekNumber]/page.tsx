import { CheckCircle2, Circle } from "lucide-react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function WeekDetailPage({ params }: { params: Promise<{ weekNumber: string }> }) {
  const user = await requireUser();
  const { weekNumber } = await params;
  const week = await prisma.week.findUnique({
    where: { weekNumber: Number(weekNumber) },
    include: { workouts: { orderBy: { dayNumber: "asc" } } },
  });
  if (!week) notFound();
  const completions = await prisma.workoutCompletion.findMany({ where: { userId: user.id, workout: { week: { weekNumber: week.weekNumber } } }, include: { workout: true } });
  const completedDays = new Set(completions.map((completion) => completion.workout.dayNumber));

  return (
    <AppShell active="Programme">
      <div className="grid gap-6">
        <SectionTitle eyebrow={week.phase === "BUILD_UP" ? "Build-Up Phase" : "Main 6-Week Course"} title={`Week ${week.weekNumber}: ${week.title}`} body={week.objective} />
        <Card className="grid gap-2 sm:grid-cols-3">
          <p><span className="text-sm text-[#6B756F]">Theme</span><br />{week.theme}</p>
          <p><span className="text-sm text-[#6B756F]">Days complete</span><br />{completedDays.size} / 7</p>
          <p><span className="text-sm text-[#6B756F]">Circuit count</span><br />{week.circuitCount ?? "Prescribed progression"}</p>
        </Card>
        <div className="grid gap-3">
          {week.workouts.map((workout) => (
            <Card key={workout.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                {completedDays.has(workout.dayNumber) ? <CheckCircle2 className="text-[#1E6F4B]" /> : <Circle className="text-[#B9903D]" />}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#B9903D]">Day {workout.dayNumber}</p>
                  <h2 className="font-[var(--font-display)] text-2xl font-semibold">{workout.title}</h2>
                  <p className="text-sm text-[#6B756F]">{workout.durationMinutes} min · {workout.type} · {workout.intensity} · {(workout.equipment as string[]).join(", ")}</p>
                </div>
              </div>
              <div className="flex gap-2 sm:ml-auto">
                <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost">Preview</ButtonLink>
                <ButtonLink href={`/app/workout/${workout.id}`} variant="secondary">Start</ButtonLink>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
