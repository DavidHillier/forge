import { Clock, Dumbbell, Eye, HeartPulse, Route } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getProgrammePosition } from "@/lib/programme/programme";
import { calculateDaysLeft, calculateOverallCompletion } from "@/lib/progress/progress";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await requireUser();
  const position = getProgrammePosition(user.programmeStartDate);
  const completions = await prisma.workoutCompletion.findMany({
    where: { userId: user.id },
    include: { workout: { include: { week: true } } },
  });
  const workout = await prisma.workout.findFirst({
    where: { week: { weekNumber: Math.min(Math.max(position.weekNumber, 1), 9) }, dayNumber: position.dayNumber },
    include: { week: true },
  });
  const completePercent = percentage(calculateOverallCompletion(completions));

  return (
    <AppShell active="Today">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="green-gradient overflow-hidden rounded-lg p-5 text-white shadow-2xl shadow-[#082F23]/20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A24D]">Today</p>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold">Good morning, {user.name.split(" ")[0]}.</h1>
          <p className="mt-1 text-sm text-[#F7F3EA]">Discipline today. Results tomorrow.</p>
          {position.programmeDay < 1 ? (
            <Card className="mt-8 bg-[#FBF8F1] text-[#10251D]">Programme starts soon.</Card>
          ) : position.programmeDay > 63 ? (
            <Card className="mt-8 bg-[#FBF8F1] text-[#10251D]">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">Programme complete</h2>
              <p className="mt-1 text-sm text-[#6B756F]">Review your progress or reset programme data in Settings.</p>
            </Card>
          ) : workout ? (
            <div className="mt-8 rounded-lg border border-[#C9A24D]/35 bg-[#082F23]/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A24D]">Week {position.weekNumber} · Day {position.dayNumber}</p>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">{workout.title}</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <span className="flex items-center gap-2"><Clock size={16} /> {workout.durationMinutes} min</span>
                <span className="flex items-center gap-2"><Dumbbell size={16} /> {workout.type}</span>
                <span>{workout.intensity} intensity</span>
                <span>{position.circuitCount} circuits</span>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <ButtonLink href={`/app/workout/${workout.id}`} className="sm:col-span-3">Start Workout</ButtonLink>
                <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost"><Eye size={16} /> Preview Session</ButtonLink>
                <ButtonLink href="/app/progress/details" variant="ghost"><HeartPulse size={16} /> Log Recovery</ButtonLink>
                <ButtonLink href="/app/programme" variant="ghost"><Route size={16} /> View Programme</ButtonLink>
              </div>
            </div>
          ) : null}
        </section>
        <aside className="grid gap-5">
          <Card>
            <SectionTitle eyebrow={position.phase} title={`${completePercent}% complete`} body="Build before you push. Keep the path visible." />
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={completePercent} label="Progress" />
              <div className="grid flex-1 grid-cols-2 gap-3 text-center">
                <div className="rounded-md bg-[#F7F3EA] p-3">
                  <p className="font-[var(--font-display)] text-3xl font-semibold">{Math.round((completePercent / 100) * 63)} / 63</p>
                  <p className="text-xs uppercase text-[#6B756F]">Days complete</p>
                </div>
                <div className="rounded-md bg-[#F7F3EA] p-3">
                  <p className="font-[var(--font-display)] text-3xl font-semibold">{calculateDaysLeft(completions)}</p>
                  <p className="text-xs uppercase text-[#6B756F]">Days left</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold">What to do next</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B756F]">Proceed as planned. Complete the minimum, keep form sharp, and save your completion when the session is done.</p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
