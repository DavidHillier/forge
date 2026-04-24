import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ReadinessForm } from "@/components/workout/readiness-form";
import { SectionTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ReadinessPage({ params }: { params: Promise<{ workoutId: string }> }) {
  await requireUser();
  const { workoutId } = await params;
  const workout = await prisma.workout.findUnique({ where: { id: workoutId }, include: { week: true } });
  if (!workout) notFound();

  return (
    <AppShell active="Today">
      <div className="mx-auto grid max-w-xl gap-6">
        <SectionTitle eyebrow="Readiness Check" title="Tailor today's session" body="Optional, but useful. Build consistency without ignoring recovery." />
        <ReadinessForm workoutId={workout.id} />
      </div>
    </AppShell>
  );
}
