import { Footprints } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, SectionTitle } from "@/components/ui/card";
import { DeleteCompletionButton } from "@/components/history/delete-completion-button";
import { deleteWalkLogAction } from "@/lib/actions/app-actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const user = await requireUser();

  const [completions, walkLogs] = await Promise.all([
    prisma.workoutCompletion.findMany({
      where: { userId: user.id },
      include: { workout: { include: { week: true } } },
      orderBy: { completedAt: "desc" },
    }),
    prisma.walkLog.findMany({
      where: { userId: user.id },
      orderBy: { loggedAt: "desc" },
    }),
  ]);

  const totalSessions = completions.length + walkLogs.length;

  return (
    <AppShell active="History">
      <SectionTitle
        eyebrow="Workout History"
        title={`${totalSessions} session${totalSessions === 1 ? "" : "s"}`}
        body="Delete a session to redo it — circuits reset the generated exercises, walks simply remove the log."
      />

      {/* Circuit completions */}
      <div className="mt-6 grid gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6B756F]">
          Circuits — {completions.length} session{completions.length !== 1 ? "s" : ""}
        </h2>

        {completions.length === 0 && (
          <Card><p className="text-sm text-[#6B756F]">No circuits completed yet.</p></Card>
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
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                    c.hadFailures ? "bg-[#B94A48]/15 text-[#B94A48]" : "bg-[#0F4A32]/10 text-[#0F4A32]"
                  }`}>
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
              <DeleteCompletionButton completionId={c.id} />
            </Card>
          );
        })}

        {/* Walk logs */}
        <h2 className="mt-4 text-sm font-semibold uppercase tracking-[0.12em] text-[#6B756F]">
          Walks — {walkLogs.length} session{walkLogs.length !== 1 ? "s" : ""}
        </h2>

        {walkLogs.length === 0 && (
          <Card><p className="text-sm text-[#6B756F]">No walks logged yet.</p></Card>
        )}

        {walkLogs.map((w) => {
          const date = new Date(w.loggedAt);
          const dateStr = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
          const timeStr = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

          return (
            <Card key={w.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Footprints className="shrink-0 text-[#B9903D]" size={18} />
                <div>
                  <p className="font-semibold text-[#10251D]">{w.distanceKm} km walk</p>
                  <div className="flex gap-3 text-xs text-[#6B756F]">
                    <span>{dateStr} · {timeStr}</span>
                    <span>Level {w.level}</span>
                  </div>
                </div>
              </div>
              <form action={deleteWalkLogAction} className="shrink-0">
                <input type="hidden" name="walkLogId" value={w.id} />
                <button type="submit" title="Remove walk log" className="flex size-9 items-center justify-center rounded-full text-[#6B756F] transition hover:bg-[#B94A48]/10 hover:text-[#B94A48] text-lg">
                  ×
                </button>
              </form>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}
