import { Dumbbell, Eye } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { generateWorkoutAction } from "@/lib/actions/app-actions";
import {
  CIRCUITS_PER_LEVEL,
  TOTAL_LEVELS,
  getCurrentCircuitDayNumber,
  getLevelCircuitsRequired,
  getOverallProgressPercent,
} from "@/lib/level/logic";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await requireUser();

  const level = user.currentLevel;
  const completedThisLevel = user.completedCircuitsThisLevel;
  const overallPercent = getOverallProgressPercent(level, completedThisLevel);
  const programmeComplete = level > TOTAL_LEVELS;

  // Find the workout for this level + circuit slot
  const circuitDayNumber = getCurrentCircuitDayNumber(completedThisLevel);
  const workout = programmeComplete
    ? null
    : await prisma.workout.findFirst({
        where: { week: { weekNumber: level }, dayNumber: circuitDayNumber },
        include: { week: true },
      });

  // Check if workout has already been generated
  const generated = workout
    ? await prisma.generatedWorkout.findUnique({
        where: { userId_workoutId: { userId: user.id, workoutId: workout.id } },
      })
    : null;

  const circuitsRequired = workout ? getLevelCircuitsRequired(level) : 0;
  const circuitLabel = `Circuit ${completedThisLevel + 1} of ${CIRCUITS_PER_LEVEL}`;

  return (
    <AppShell active="Today">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="green-gradient overflow-hidden rounded-lg p-5 text-white shadow-2xl shadow-[#082F23]/20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A24D]">Today</p>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold">
            Good morning, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-[#F7F3EA]">Discipline today. Results tomorrow.</p>

          {programmeComplete ? (
            <Card className="mt-8 bg-[#FBF8F1] text-[#10251D]">
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">Programme complete</h2>
              <p className="mt-1 text-sm text-[#6B756F]">All 36 circuits done. Outstanding work.</p>
            </Card>
          ) : workout ? (
            <div className="mt-8 rounded-lg border border-[#C9A24D]/35 bg-[#082F23]/45 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C9A24D]">
                Level {level} · {circuitLabel}
              </p>
              <h2 className="mt-3 font-[var(--font-display)] text-4xl font-semibold">{workout.title}</h2>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                <span className="flex items-center gap-2">
                  <Dumbbell size={16} /> {workout.type}
                </span>
                <span>{workout.intensity} intensity</span>
                <span>{circuitsRequired} circuits</span>
              </div>

              <div className="mt-7 grid gap-3">
                {generated ? (
                  <>
                    <ButtonLink href={`/app/workout/${workout.id}/active`}>Start Workout</ButtonLink>
                    <div className="grid grid-cols-2 gap-3">
                      <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost">
                        <Eye size={16} /> Preview
                      </ButtonLink>
                      <form action={generateWorkoutAction}>
                        <input type="hidden" name="workoutId" value={workout.id} />
                        <input type="hidden" name="regenerate" value="1" />
                        <button
                          type="submit"
                          className="h-10 w-full rounded-full border border-[#C9A24D]/40 text-sm text-[#C9A24D] transition hover:bg-[#C9A24D]/10"
                          title="Re-randomise exercises (only before you start)"
                        >
                          Re-generate
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <>
                    <form action={generateWorkoutAction}>
                      <input type="hidden" name="workoutId" value={workout.id} />
                      <button
                        type="submit"
                        className="h-14 w-full rounded-full bg-[#C9A84C] font-semibold text-[#1B3D2F] transition hover:bg-[#d4b55a]"
                      >
                        Generate Workout
                      </button>
                    </form>
                    <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost">
                      <Eye size={16} /> Preview Session
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="grid gap-5">
          <Card>
            <SectionTitle
              eyebrow={programmeComplete ? "Programme complete" : `Level ${level} of ${TOTAL_LEVELS}`}
              title={`${overallPercent}% complete`}
              body={
                programmeComplete
                  ? "All 36 circuits finished."
                  : `${completedThisLevel} of ${CIRCUITS_PER_LEVEL} circuits done this level.`
              }
            />
            <div className="mt-5 flex items-center gap-5">
              <ProgressRing value={overallPercent} label="Progress" />
              <div className="grid flex-1 gap-3 text-center">
                <div className="rounded-md bg-[#F7F3EA] p-3">
                  <p className="font-[var(--font-display)] text-3xl font-semibold">
                    {completedThisLevel} / {CIRCUITS_PER_LEVEL}
                  </p>
                  <p className="text-xs uppercase text-[#6B756F]">This level</p>
                </div>
                <div className="rounded-md bg-[#F7F3EA] p-3">
                  <p className="font-[var(--font-display)] text-3xl font-semibold">
                    {level > TOTAL_LEVELS ? TOTAL_LEVELS : level} / {TOTAL_LEVELS}
                  </p>
                  <p className="text-xs uppercase text-[#6B756F]">Level</p>
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="font-[var(--font-display)] text-2xl font-semibold">What to do next</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B756F]">
              {generated
                ? "Your exercises are ready. Hit Start Workout when you are."
                : "Generate your workout to randomise today's exercises, then start when ready."}
            </p>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
