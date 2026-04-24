import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { inputClass } from "@/components/ui/field";
import { completeWorkoutAction } from "@/lib/actions/app-actions";
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
          <form action={completeWorkoutAction} className="grid gap-4">
            <input type="hidden" name="workoutId" value={workout.id} />
            <input type="hidden" name="totalSeconds" value={totalSeconds} />
            <input type="hidden" name="circuitsCompleted" value={query.circuits ?? workout.week.circuitCount ?? 3} />
            <input type="hidden" name="roundsCompleted" value={query.rounds ?? 1} />
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md bg-[#F7F3EA] p-3"><p className="text-xs text-[#6B756F]">Total time</p><p className="font-semibold">{Math.round(totalSeconds / 60)} min</p></div>
              <div className="rounded-md bg-[#F7F3EA] p-3"><p className="text-xs text-[#6B756F]">Circuits</p><p className="font-semibold">{query.circuits ?? workout.week.circuitCount ?? 3}</p></div>
              <div className="rounded-md bg-[#F7F3EA] p-3"><p className="text-xs text-[#6B756F]">Load</p><p className="font-semibold">By effort</p></div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold">How hard was this workout?</p>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <label key={score}>
                    <input className="peer sr-only" type="radio" name="effortScore" value={score} required defaultChecked={score === 4} />
                    <span className="grid h-12 place-items-center rounded-md border border-[#E4DCCB] peer-checked:border-[#0F4A32] peer-checked:bg-[#0F4A32] peer-checked:text-white">{score}</span>
                  </label>
                ))}
              </div>
            </div>
            <textarea name="notes" className={`${inputClass} h-28 py-3`} placeholder="Optional notes" />
            <Button>Finish</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}
