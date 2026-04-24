import { notFound } from "next/navigation";
import { ActiveWorkout } from "@/components/workout/active-workout";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ActiveWorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  await requireUser();
  const { workoutId } = await params;
  const workout = await prisma.workout.findUnique({
    where: { id: workoutId },
    include: { week: true, blocks: { orderBy: { order: "asc" }, include: { exercises: { orderBy: { order: "asc" } } } } },
  });
  if (!workout) notFound();

  return <ActiveWorkout workout={workout} weekNumber={workout.week.weekNumber} />;
}
