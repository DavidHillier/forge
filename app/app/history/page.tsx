import { Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, SectionTitle } from "@/components/ui/card";
import { deleteWorkoutCompletionAction } from "@/lib/actions/app-actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser();
  const completions = await prisma.workoutCompletion.findMany({
    where: { userId: user.id },
    include: { workout: { include: { week: true } } },
    orderBy: { completedAt: "desc" },
  });

  return (
    <AppShell active="History">
      <SectionTitle
        eyebrow="Workout History"
        title={`${completions.length} session${completions.length === 1 ? "" : "s"}`}
        body="Delete a session to redo it — this removes the record and resets the generated exercises."
      />

      <div className="mt-6 grid gap-3">
        {completions.length === 0 && (
          <Card>
            <p className="text-sm text-[#6B756F]">No workouts completed yet.</p>
          </Card>
        )}
        {completions.map((c) => {
          const levelNum = c.workout.week.weekNumber;
          const date = new Date(c.completedAt);
          const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

          return (
            <Card key={c.id} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                      c.hadFailures
                        ? "bg-[#B94A48]/15 text-[#B94A48]"
                        : "bg-[#0F4A32]/10 text-[#0F4A32]"
                    }`}
                  >
                    {c.hadFailures ? "Failed" : "Passed"}
                  </span>
                  <span className="text-xs text-[#6B756F]">Level {levelNum}</span>
                </div>
                <p className="mt-1 font-semibold text-[#10251D] truncate">{c.workout.title}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#6B756F]">
                  <span>{dateStr} · {timeStr}</span>
                  <span>{Math.round(c.totalSeconds / 60)} min</span>
                  <span>{c.circuitsCompleted} circuit{c.circuitsCompleted !== 1 ? "s" : ""}</span>
                  <span>Effort {c.effortScore}/5</span>
                </div>
                {c.notes && (
                  <p className="mt-1.5 text-xs text-[#6B756F] italic">&ldquo;{c.notes}&rdquo;</p>
                )}
              </div>

              <form action={deleteWorkoutCompletionAction} className="shrink-0">
                <input type="hidden" name="completionId" value={c.id} />
                <button
                  type="submit"
                  title="Delete this session"
                  className="flex size-9 items-center justify-center rounded-full text-[#6B756F] transition hover:bg-[#B94A48]/10 hover:text-[#B94A48]"
                  onClick={(e) => {
                    if (!confirm("Delete this session? This cannot be undone and will reset your generated exercises for this workout.")) {
                      e.preventDefault();
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
