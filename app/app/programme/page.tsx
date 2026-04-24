import { AppShell } from "@/components/layout/app-shell";
import { WeekList } from "@/components/programme/week-list";
import { SectionTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ProgrammePage() {
  const user = await requireUser();
  const [weeks, completions] = await Promise.all([
    prisma.week.findMany({ orderBy: { weekNumber: "asc" }, include: { workouts: { select: { dayNumber: true } } } }),
    prisma.workoutCompletion.findMany({ where: { userId: user.id }, include: { workout: { include: { week: true } } } }),
  ]);
  const completedKeys = new Set(completions.map((completion) => `${completion.workout.week.weekNumber}-${completion.workout.dayNumber}`));

  return (
    <AppShell active="Programme">
      <div className="grid gap-6">
        <SectionTitle eyebrow="Programme" title="9-Week Fat-Loss System" body="A structured path to a stronger, leaner you. Build before you push." />
        <section className="grid gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[#B9903D]">Build-Up Phase · Weeks 1-3</h2>
          <WeekList weeks={weeks.filter((week) => week.weekNumber <= 3)} completedKeys={completedKeys} />
          <h2 className="mt-4 text-sm font-bold uppercase tracking-[0.18em] text-[#B9903D]">Main 6-Week Course · Weeks 4-9</h2>
          <WeekList weeks={weeks.filter((week) => week.weekNumber >= 4)} completedKeys={completedKeys} />
        </section>
      </div>
    </AppShell>
  );
}
