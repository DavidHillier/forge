import { AppShell } from "@/components/layout/app-shell";
import { LevelChart } from "@/components/progress/charts";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import {
  TOTAL_LEVELS,
  circuitsRequiredForLevel,
  getOverallProgressPercent,
  getTotalCompletedCircuits,
  getTotalProgrammeCircuits,
} from "@/lib/level/logic";
import {
  calculateAverageEffort,
  calculateCurrentStreak,
  calculateTotalTrainingMinutes,
  calculateWeeklySessions,
  countCleanCircuits,
  countFailedCircuits,
  levelCompletionChart,
} from "@/lib/progress/progress";

export const dynamic = "force-dynamic";

export default async function ProgressPage() {
  const user = await requireUser();

  const completions = await prisma.workoutCompletion.findMany({
    where: { userId: user.id },
    include: { workout: { include: { week: true } } },
    orderBy: { completedAt: "asc" },
  });

  const metrics = await prisma.bodyMetric.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 1,
  });

  const level = user.currentLevel;
  const completedThisLevel = user.completedCircuitsThisLevel;
  const overallPercent = getOverallProgressPercent(level, completedThisLevel);
  const totalDone = getTotalCompletedCircuits(level, completedThisLevel);
  const totalCircuits = getTotalProgrammeCircuits();
  const circuitsNeeded = circuitsRequiredForLevel(level);

  const clean = countCleanCircuits(completions);
  const failed = countFailedCircuits(completions);
  const totalMin = calculateTotalTrainingMinutes(completions);
  const avgEffort = calculateAverageEffort(completions).toFixed(1);
  const streak = calculateCurrentStreak(completions);
  const thisWeek = calculateWeeklySessions(completions);

  const stats = [
    { label: "Clean circuits", value: `${clean}` },
    { label: "Failed circuits", value: `${failed}` },
    { label: "This level", value: `${completedThisLevel} / ${circuitsNeeded}` },
    { label: "Sessions this week", value: `${thisWeek}` },
    { label: "Total training", value: `${totalMin} min` },
    { label: "Avg effort", value: `${avgEffort} / 5` },
    { label: "Current streak", value: `${streak} day${streak !== 1 ? "s" : ""}` },
  ];

  const chartData = levelCompletionChart(completions);

  return (
    <AppShell active="Progress">
      <div className="grid gap-6">
        <SectionTitle
          eyebrow="Progress Overview"
          title={`Level ${Math.min(level, TOTAL_LEVELS)} of ${TOTAL_LEVELS}`}
          body={`${totalDone} of ${totalCircuits} total circuits complete — ${overallPercent}% through the programme.`}
        />

        <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
          <Card className="grid place-items-center gap-4">
            <ProgressRing value={overallPercent} label="Overall" />
            <div className="w-full text-center">
              <p className="font-[var(--font-display)] text-3xl font-semibold">{totalDone}</p>
              <p className="text-xs uppercase text-[#6B756F]">Circuits done</p>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 content-start">
            {stats.map(({ label, value }) => (
              <Card key={label} className="p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6B756F]">{label}</p>
                <p className="mt-2 font-[var(--font-display)] text-2xl font-semibold">{value}</p>
              </Card>
            ))}
          </div>
        </div>

        <LevelChart data={chartData} />

        <Card>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">Body metrics</h2>
              <p className="text-sm text-[#6B756F]">
                {metrics[0]
                  ? `Latest: ${metrics[0].weight ?? "—"} kg · ${metrics[0].waist ?? "—"} waist · ${metrics[0].restingHeartRate ?? "—"} bpm`
                  : "No body metrics logged yet."}
              </p>
            </div>
            <ButtonLink href="/app/progress/details" variant="secondary">Add New Entry</ButtonLink>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
