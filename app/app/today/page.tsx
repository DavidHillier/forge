import { CheckCircle2, Dumbbell, Eye, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ButtonLink } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { generateWorkoutAction } from "@/lib/actions/app-actions";
import {
  CIRCUITS_PER_PASS,
  TOTAL_LEVELS,
  circuitsRequiredForLevel,
  getCurrentCircuitDayNumber,
  getCurrentPassNumber,
  getCircuitInPass,
  getOverallProgressPercent,
  getTotalProgrammeCircuits,
} from "@/lib/level/logic";
import { calculateCircuitsForWorkout } from "@/lib/workout-engine/workout";

export const dynamic = "force-dynamic";

export default async function TodayPage() {
  const user = await requireUser();

  const level = user.currentLevel;
  const completedThisLevel = user.completedCircuitsThisLevel;
  const programmeComplete = level > TOTAL_LEVELS;

  const passNumber = getCurrentPassNumber(completedThisLevel);          // e.g. 2
  const passesRequired = level;                                          // e.g. 2
  const circuitInPass = getCircuitInPass(completedThisLevel);            // e.g. 3
  const circuitsRequired = circuitsRequiredForLevel(level);             // e.g. 8
  const overallPercent = getOverallProgressPercent(level, completedThisLevel);
  const totalCircuits = getTotalProgrammeCircuits();

  // Find the workout for this level + circuit slot
  const circuitDayNumber = getCurrentCircuitDayNumber(completedThisLevel);
  const workout = programmeComplete
    ? null
    : await prisma.workout.findFirst({
        where: { week: { weekNumber: level }, dayNumber: circuitDayNumber },
        include: { week: true },
      });

  // Check if workout exercises have been generated
  const generated = workout
    ? await prisma.generatedWorkout.findUnique({
        where: { userId_workoutId: { userId: user.id, workoutId: workout.id } },
      })
    : null;

  const workoutCircuitsInSession = workout
    ? calculateCircuitsForWorkout(level, workout)
    : 0;

  // Build the contextual label lines
  const levelLine = `Level ${level}`;
  const passLine = passesRequired > 1
    ? `Week ${passNumber} of ${passesRequired} · Circuit ${circuitInPass} of ${CIRCUITS_PER_PASS}`
    : `Circuit ${circuitInPass} of ${CIRCUITS_PER_PASS}`;

  return (
    <AppShell active="Today">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Main card */}
        <section className="green-gradient overflow-hidden rounded-lg p-5 text-white shadow-2xl shadow-[#082F23]/20">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#C9A24D]">Today</p>
          <h1 className="mt-5 font-[var(--font-display)] text-4xl font-semibold">
            Good morning, {user.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-sm text-[#F7F3EA]">Discipline today. Results tomorrow.</p>

          {programmeComplete ? (
            <div className="mt-8 rounded-lg border border-[#C9A24D]/35 bg-[#082F23]/45 p-5 text-center">
              <CheckCircle2 className="mx-auto mb-3 text-[#C9A24D]" size={40} />
              <h2 className="font-[var(--font-display)] text-2xl font-semibold">Programme complete</h2>
              <p className="mt-1 text-sm text-[#F7F3EA]/70">All {totalCircuits} circuits done. Outstanding work.</p>
            </div>
          ) : workout ? (
            <div className="mt-8 rounded-lg border border-[#C9A24D]/35 bg-[#082F23]/45 p-5">
              {/* Level + pass + circuit label */}
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#C9A24D]">
                  {levelLine}
                </p>
                <p className="text-xs text-[#F7F3EA]/60">{passLine}</p>
              </div>

              <h2 className="mt-3 font-[var(--font-display)] text-3xl font-semibold leading-tight">
                {workout.title}
              </h2>

              {/* Workout meta */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#F7F3EA]/80">
                <span className="flex items-center gap-1.5"><Dumbbell size={14} /> {workout.type}</span>
                <span>{workout.intensity} intensity</span>
                <span>{workoutCircuitsInSession} circuit{workoutCircuitsInSession !== 1 ? "s" : ""} per session</span>
              </div>

              {/* Progress bar within level */}
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-xs text-[#F7F3EA]/50">
                  <span>{completedThisLevel} of {circuitsRequired} circuits done this level</span>
                  <span>{Math.round((completedThisLevel / circuitsRequired) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10">
                  <div
                    className="h-1.5 rounded-full bg-[#C9A84C] transition-all"
                    style={{ width: `${Math.round((completedThisLevel / circuitsRequired) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 grid gap-3">
                {generated ? (
                  <>
                    <ButtonLink href={`/app/workout/${workout.id}/active`}>Start Workout</ButtonLink>
                    <div className="grid grid-cols-2 gap-3">
                      <ButtonLink href={`/app/workout/${workout.id}/preview`} variant="ghost">
                        <Eye size={15} /> Preview
                      </ButtonLink>
                      <form action={generateWorkoutAction} className="contents">
                        <input type="hidden" name="workoutId" value={workout.id} />
                        <input type="hidden" name="regenerate" value="1" />
                        <button
                          type="submit"
                          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full border border-[#C9A24D]/40 text-sm text-[#C9A24D] transition hover:bg-[#C9A24D]/10"
                        >
                          <RotateCcw size={13} /> Re-generate
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
                      <Eye size={15} /> Preview Exercises
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {/* Sidebar */}
        <aside className="grid content-start gap-5">
          <Card>
            <SectionTitle
              eyebrow={programmeComplete ? "Complete" : `Level ${level} of ${TOTAL_LEVELS}`}
              title={`${overallPercent}% done`}
              body={
                programmeComplete
                  ? "All circuits finished."
                  : `${completedThisLevel} of ${circuitsRequired} this level · ${passesRequired > 1 ? `${passesRequired} passes required` : "1 pass required"}`
              }
            />
            <div className="mt-5 flex items-center gap-4">
              <ProgressRing value={overallPercent} label="Overall" />
              <div className="grid flex-1 gap-2.5">
                <div className="rounded-md bg-[#F7F3EA] p-3 text-center">
                  <p className="font-[var(--font-display)] text-2xl font-semibold">
                    {level > TOTAL_LEVELS ? TOTAL_LEVELS : level}
                    <span className="text-base font-normal text-[#6B756F]"> / {TOTAL_LEVELS}</span>
                  </p>
                  <p className="text-xs uppercase text-[#6B756F]">Level</p>
                </div>
                <div className="rounded-md bg-[#F7F3EA] p-3 text-center">
                  <p className="font-[var(--font-display)] text-2xl font-semibold">
                    {completedThisLevel}
                    <span className="text-base font-normal text-[#6B756F]"> / {circuitsRequired}</span>
                  </p>
                  <p className="text-xs uppercase text-[#6B756F]">This level</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="font-[var(--font-display)] text-xl font-semibold">How it works</h2>
            <ul className="mt-3 grid gap-2 text-sm text-[#6B756F]">
              <li>Level {level} needs <strong className="text-[#10251D]">{passesRequired} full {passesRequired === 1 ? "pass" : "passes"}</strong> through all 4 circuits.</li>
              <li>Fail any exercise → circuit repeats, counter stays.</li>
              <li>Complete all circuits clean → advance to Level {Math.min(level + 1, TOTAL_LEVELS)}.</li>
            </ul>
          </Card>
        </aside>
      </div>
    </AppShell>
  );
}
