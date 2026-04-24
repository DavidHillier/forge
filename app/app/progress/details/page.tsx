import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, SectionTitle } from "@/components/ui/card";
import { Field, inputClass } from "@/components/ui/field";
import { saveBodyMetricAction, saveWeeklyReflectionAction } from "@/lib/actions/app-actions";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getProgrammePosition } from "@/lib/programme/programme";

export const dynamic = "force-dynamic";

export default async function ProgressDetailsPage() {
  const user = await requireUser();
  const position = getProgrammePosition(user.programmeStartDate);
  const metrics = await prisma.bodyMetric.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 5 });

  return (
    <AppShell active="Progress">
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="grid content-start gap-5">
          <SectionTitle eyebrow="Progress Details" title="Body metrics" body="Update your stats and track changes without collecting more than Forge needs." />
          <Card>
            <form action={saveBodyMetricAction} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={`Body weight (${user.units === "metric" ? "kg" : "lb"})`}><input name="weight" type="number" step="0.1" className={inputClass} /></Field>
                <Field label={`Waist (${user.units === "metric" ? "cm" : "in"})`}><input name="waist" type="number" step="0.1" className={inputClass} /></Field>
              </div>
              <Field label="Resting heart rate"><input name="restingHeartRate" type="number" className={inputClass} /></Field>
              <Field label="Progress photo URL placeholder"><input name="progressPhotoUrl" type="url" className={inputClass} /></Field>
              <Field label="Note"><textarea name="note" className={`${inputClass} h-28 py-3`} /></Field>
              <Button>Save Metric</Button>
            </form>
          </Card>
          <Card>
            <h2 className="mb-3 font-[var(--font-display)] text-2xl font-semibold">Recent entries</h2>
            <div className="grid gap-2 text-sm">
              {metrics.map((metric) => (
                <div key={metric.id} className="rounded-md bg-[#F7F3EA] p-3">
                  {metric.createdAt.toLocaleDateString()} · {metric.weight ?? "-"} · {metric.waist ?? "-"} · {metric.restingHeartRate ?? "-"} bpm
                </div>
              ))}
            </div>
          </Card>
        </section>
        <section className="grid content-start gap-5">
          <SectionTitle eyebrow="Weekly Reflection" title={`Week ${Math.min(Math.max(position.weekNumber, 1), 9)} Reflection`} body="Build consistency. Notice the signals, then proceed as planned." />
          <Card>
            <form action={saveWeeklyReflectionAction} className="grid gap-4">
              <input type="hidden" name="weekNumber" value={Math.min(Math.max(position.weekNumber, 1), 9)} />
              {["energy", "sleep", "soreness", "motivation"].map((name) => (
                <div key={name}>
                  <p className="mb-2 text-sm font-semibold capitalize">{name}</p>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((score) => (
                      <label key={score}>
                        <input className="peer sr-only" type="radio" name={name} value={score} required defaultChecked={score === 4} />
                        <span className="grid h-10 place-items-center rounded-md border border-[#E4DCCB] peer-checked:border-[#0F4A32] peer-checked:bg-[#0F4A32] peer-checked:text-white">{score}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <Field label="Notes"><textarea name="notes" className={`${inputClass} h-28 py-3`} /></Field>
              <Button>Save Reflection</Button>
            </form>
          </Card>
        </section>
      </div>
    </AppShell>
  );
}
