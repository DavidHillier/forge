import { notFound } from "next/navigation";
import { ActiveWorkout } from "@/components/workout/active-workout";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export default async function ActiveWorkoutPage({ params }: { params: Promise<{ workoutId: string }> }) {
  const user = await requireUser();
  const { workoutId } = await params;
  const [workout, generated] = await Promise.all([
    prisma.workout.findUnique({
      where: { id: workoutId },
      include: { week: true, blocks: { orderBy: { order: "asc" }, include: { exercises: { orderBy: { order: "asc" } } } } },
    }),
    prisma.generatedWorkout.findUnique({
      where: { userId_workoutId: { userId: user.id, workoutId } },
    }),
  ]);
  if (!workout) notFound();

  const generatedExercises = generated
    ? (generated.exercises as { exerciseId: string; exerciseName: string }[])
    : undefined;

  return (
    <ActiveWorkout
      workout={workout}
      weekNumber={workout.week.weekNumber}
      generatedExercises={generatedExercises}
    />
  );
}
