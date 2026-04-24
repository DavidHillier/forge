import { AppShell } from "@/components/layout/app-shell";
import { WeeklyCharts } from "@/components/progress/charts";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getProgrammePosition } from "@/lib/programme/programme";
import {
  calculateAverageEffort,
  calculateBuildUpCompletion,
  calculateCurrentStreak,
  calculateDaysLeft,
  calculateMainCourseCompletion,
  calculateOverallCompletion,
  calculateTotalTrainingMinutes,
  calculateWeeklySessions,
  weeklyCompletionChart,
} from "@/lib/progress/progress";
import { percentage } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await requireUser();
  const completions = await prisma.workoutCompletion.findMany({
    where: { userId: user.id },
    include: { workout: { include: { week: true } } },
    orderBy: { completedAt: "asc" },
  });
  const metrics = await prisma.bodyMetric.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 1 });
  const position = getProgrammePosition(user.programmeStartDate);
  const overall = percentage(calculateOverallCompletion(completions));

  const stats = [
    ["Days complete", `${Math.round((overall / 100) * 63)} / 63`],
    ["Days left", calculateDaysLeft(completions)],
    ["Current streak", `${calculateCurrentStreak(completions)} days`],
    ["This week", `${calculateWeeklySessions(completions)} sessions`],
    ["Total time", `${calculateTotalTrainingMinutes(completions)} min`],
    ["Avg effort", `${calculateAverageEffort(completions).toFixed(1)} / 5`],
  ];

  return (
    <AppShell active="Progress">
      <div className="grid gap-6">
        <SectionTitle eyebrow="Progress Overview" title={`${overall}% complete`} body={`Current phase: ${position.phase}. Week ${position.weekNumber}.`} />
        <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
          <Card className="grid place-items-center">
            <ProgressRing value={overall} label="Complete" />
            <div className="mt-5 grid w-full grid-cols-2 gap-3 text-center">
              <div className="rounded-md bg-[#F7F3EA] p-3"><p className="text-xs text-[#6B756F]">Build-up</p><p className="font-semibold">{percentage(calculateBuildUpCompletion(completions))}%</p></div>
              <div className="rounded-md bg-[#F7F3EA] p-3"><p className="text-xs text-[#6B756F]">Main course</p><p className="font-semibold">{percentage(calculateMainCourseCompletion(completions))}%</p></div>
            </div>
          </Card>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            {stats.map(([label, value]) => (
              <Card key={label} className="p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B756F]">{label}</p>
                <p className="mt-2 font-[var(--font-display)] text-3xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>
        </div>
        <WeeklyCharts data={weeklyCompletionChart(completions)} />
        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">Body metrics</h2>
              <p className="text-sm text-[#6B756F]">
                {metrics[0] ? `Latest: ${metrics[0].weight ?? "-"} weight · ${metrics[0].waist ?? "-"} waist · ${metrics[0].restingHeartRate ?? "-"} bpm` : "No body metrics logged yet."}
              </p>
            </div>
            <ButtonLink href="/app/progress/details" variant="secondary">Add New Entry</ButtonLink>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
